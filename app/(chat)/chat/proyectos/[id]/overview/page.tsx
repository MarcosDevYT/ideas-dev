import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProjectOverviewClient } from "@/components/projects/project-overview-client";

interface ProjectOverviewPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectOverviewPage({
  params,
}: ProjectOverviewPageProps) {
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
      user: {
        select: {
          credits: true,
        },
      },
    },
  });

  if (!project) {
    notFound();
  }

  // Verify ownership
  if (project.userId !== userId) {
    notFound();
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full">
        <ProjectOverviewClient
          projectId={project.id}
          initialSummary={project.aiSummary}
          description={project.description}
          originalIdea={project.originalIdea}
          userCredits={project.user.credits || 0}
        />
      </div>
    </div>
  );
}
