import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { generateProjectResourcesStream } from "@/lib/ai-helper";
import { hasCredits, consumeCredits } from "@/actions/credits/service";

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
    },
  });

  if (!project) return new Response("Project not found", { status: 404 });
  if (project.userId !== userId)
    return new Response("Unauthorized", { status: 401 });

  const hasSuffCredits = await hasCredits(userId, 1);
  if (!hasSuffCredits) {
    return new Response("Insufficient credits", { status: 402 });
  }

  const aiStream = await generateProjectResourcesStream(
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

      // Parse resources from Markdown and save to DB
      // Format: "- [Title](URL) - Type" or "- Title - Type"
      const resources = fullText
        .split("\n")
        .filter((line) => line.trim().startsWith("- "))
        .map((line) => {
          const content = line.trim().substring(2).trim();
          const linkMatch = content.match(/\[(.*?)\]\((.*?)\)/);

          let title = content;
          let url = "";
          let type = "link";

          if (linkMatch) {
            title = linkMatch[1];
            url = linkMatch[2];
            // Try to extract type if present after the link
            const typeMatch = content
              .replace(linkMatch[0], "")
              .match(/-\s*(\w+)$/);
            if (typeMatch) {
              type = typeMatch[1].toLowerCase();
            }
          } else {
            // Simple split by "-" if no link
            const parts = content.split(" - ");
            title = parts[0];
            if (parts.length > 1) {
              type = parts[parts.length - 1].toLowerCase();
            }
          }

          return { title, url, type };
        });

      if (resources.length > 0) {
        await consumeCredits(
          userId,
          1,
          `Recursos stream para proyecto: ${project.title}`,
        );
        await prisma.resource.createMany({
          data: resources.map((res) => ({
            title: res.title,
            type: res.type,
            url: res.url || null,
            projectId: projectId,
          })),
        });
      }
    } catch (error) {
      console.error("Error processing stream for database:", error);
    }
  })();

  return new Response(stream1, {
    headers: { "Content-Type": "text/markdown" },
  });
}
