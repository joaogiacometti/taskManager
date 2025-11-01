"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { getProjects } from "@/app/actions/projects";
import { Project } from "@/app/types/project";
import { toast } from "sonner";
import { DeleteProjectDialog } from "./delete-project-dialog";
import { UpdateProjectDialog } from "./update-project-dialog";

interface ProjectsListProps {
  onRefresh?: number;
}

export const ProjectsList = ({ onRefresh }: ProjectsListProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch {
      toast.error("Erro ao carregar projetos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [onRefresh]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project) => (
        <Card
          key={project.id}
          className="hover:shadow-lg transition-shadow cursor-pointer relative group"
        >
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <UpdateProjectDialog
              project={project}
              onProjectUpdated={fetchProjects}
            />
            <DeleteProjectDialog
              projectId={project.id}
              projectName={project.name}
              onProjectDeleted={fetchProjects}
            />
          </div>
          <CardHeader>
            <CardTitle className="text-xl pr-20">{project.name}</CardTitle>
            <CardDescription>
              {project.description || "Sem descrição"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              Criado em:{" "}
              {new Date(project.createdAt).toLocaleDateString("pt-BR")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
