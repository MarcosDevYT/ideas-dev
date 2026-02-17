import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateProjectTasksStream } from "@/lib/ai-helper";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;
  const session = await auth();
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 });
  const userId = session.user.id;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      messages: { orderBy: { createdAt: "asc" }, take: 20 },
      user: { select: { credits: true } },
    },
  });

  if (!project) return new Response("Project not found", { status: 404 });
  if (project.userId !== userId)
    return new Response("Unauthorized", { status: 401 });

  if ((project.user.credits || 0) < 1) {
    return new Response("Insufficient credits", { status: 402 });
  }

  const aiStream = await generateProjectTasksStream(
    project.description,
    project.aiSummary,
    project.messages.map((m) => ({ role: m.role, content: m.content })),
  );

  const [stream1, stream2] = aiStream.tee();

  // Background processing to save to DB
  (async () => {
    try {
      const reader = stream2.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
      }

      // Parse tasks from Markdown and save to DB
      const tasks = fullText
        .split("\n")
        .filter((line) => line.trim().startsWith("- "))
        .map((line) => line.trim().substring(2).trim());

      if (tasks.length > 0) {
        await prisma.$transaction(async (tx) => {
          await tx.user.update({
            where: { id: userId },
            data: { credits: { decrement: 1 } },
          });

          await tx.task.createMany({
            data: tasks.map((title) => ({
              title,
              status: "pending",
              projectId: projectId,
            })),
          });
        });

        // Note: revalidatePath might not work as expected in background tasks of Route Handlers
        // The client should call router.refresh() or similar after stream completes.
      }
    } catch (error) {
      console.error("Error processing stream for database:", error);
    }
  })();

  return new Response(stream1, {
    headers: { "Content-Type": "text/markdown" },
  });
}
