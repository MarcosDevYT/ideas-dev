import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProjectTasksClient } from "@/components/projects/project-tasks-client";

interface ProjectTasksPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectTasksPage({
  params,
}: ProjectTasksPageProps) {
  const resolvedParams = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/");
  }

  const userId = session.user.id;
  const projectId = resolvedParams.id;

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      user: { select: { credits: true } },
    },
  });

  if (!project) {
    notFound();
  }

  if (project.userId !== userId) {
    notFound();
  }

  // Fetch tasks
  const tasks = await prisma.task.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        <ProjectTasksClient
          projectId={project.id}
          initialTasks={tasks}
          userCredits={project.user.credits || 0}
        />
      </div>
    </div>
  );
}
