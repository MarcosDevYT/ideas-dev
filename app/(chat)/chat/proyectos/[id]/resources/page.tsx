import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { ProjectResourcesClient } from "@/components/projects/project-resources-client";

interface ProjectResourcesPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectResourcesPage({
  params,
}: ProjectResourcesPageProps) {
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

  // Fetch resources
  const resources = await prisma.resource.findMany({
    where: { projectId: project.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-6xl mx-auto w-full">
        <ProjectResourcesClient
          projectId={project.id}
          initialResources={resources}
          userCredits={project.user.credits || 0}
        />
      </div>
    </div>
  );
}
