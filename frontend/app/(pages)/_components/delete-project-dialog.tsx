"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { deleteProject } from "@/app/actions/projects";
import { toast } from "sonner";

interface DeleteProjectDialogProps {
  projectId: number;
  projectName: string;
  onProjectDeleted?: () => void;
}

export const DeleteProjectDialog = ({
  projectId,
  projectName,
  onProjectDeleted,
}: DeleteProjectDialogProps) => {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteProject(projectId);

      if (result.success) {
        toast.success("Projeto deletado com sucesso!");
        setOpen(false);
        onProjectDeleted?.();
      } else {
        toast.error(result.error || "Erro ao deletar projeto");
      }
    } catch {
      toast.error("Erro ao deletar projeto");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Projeto</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="inline-flex items-center space-x-1 truncate max-w-[25rem]">
              <span>Tem certeza que deseja deletar o projeto</span>
              <span className="font-semibold truncate">{projectName}</span>
              <span>?</span>
            </span>
            <br />
            <br />
            <span className="text-red-600">
              Esta ação não pode ser desfeita. Projetos com tarefas não podem
              ser deletados.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deletando...
              </>
            ) : (
              "Deletar"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
