"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  generateProjectTasksAction,
  createTaskAction,
  toggleTaskStatusAction,
  deleteTaskAction,
} from "@/actions/project-actions";

interface Task {
  id: string;
  title: string;
  status: string;
}

interface ProjectTasksClientProps {
  projectId: string;
  initialTasks: Task[];
  userCredits: number;
}

export function ProjectTasksClient({
  projectId,
  initialTasks,
  userCredits,
}: ProjectTasksClientProps) {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [credits, setCredits] = useState(userCredits);

  // States for actions
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({});

  // AI Generation Handler
  const handleGenerateTasks = async () => {
    if (credits < 1) {
      toast.error("No tienes suficientes créditos.");
      return;
    }

    setIsGenerating(true);
    toast.info("Generando tareas con IA...");

    try {
      const result = await generateProjectTasksAction(projectId);

      if (result.success) {
        setCredits((prev) => Math.max(0, prev - 1));
        toast.success("Tareas generadas exitosamente.");
        router.refresh();
      } else {
        toast.error(result.error || "Error al generar tareas.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Ocurrió un error inesperado.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Create Task Handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    setIsCreating(true);
    try {
      const result = await createTaskAction(projectId, newTaskTitle);
      if (result.success) {
        setNewTaskTitle("");
        toast.success("Tarea creada.");
        router.refresh();
      } else {
        toast.error(result.error || "Error al crear tarea.");
      }
    } catch (error) {
      toast.error("Error inesperado.");
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  // Toggle Status Handler
  const handleToggleStatus = async (task: Task) => {
    // Optimistic update
    const newStatus = task.status === "completed" ? "pending" : "completed";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t)),
    );

    setLoadingTasks((prev) => ({ ...prev, [task.id]: true }));

    try {
      const result = await toggleTaskStatusAction(task.id, task.status);
      if (!result.success) {
        // Revert on error
        setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
        toast.error("Error al actualizar estado.");
      } else {
        router.refresh(); // Sync with server eventually
      }
    } catch (error) {
      console.error(error);
      setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
      toast.error("Error de conexión.");
    } finally {
      setLoadingTasks((prev) => {
        const newState = { ...prev };
        delete newState[task.id];
        return newState;
      });
    }
  };

  // Delete Task Handler
  const handleDeleteTask = async (taskId: string) => {
    // Optimistic update
    const taskToDelete = tasks.find((t) => t.id === taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));

    try {
      const result = await deleteTaskAction(taskId);
      if (!result.success) {
        if (taskToDelete) setTasks((prev) => [...prev, taskToDelete]);
        toast.error("Error al eliminar tarea.");
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      if (taskToDelete) setTasks((prev) => [...prev, taskToDelete]);
      toast.error("Error al eliminar.");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold img-tracking-tight text-foreground/90">
            Plan de Acción
          </h2>
          <p className="text-muted-foreground text-sm">
            Gestiona y genera tareas para tu proyecto.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge className="flex font-mono items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-primary/10">
            <Sparkles className="h-4 w-4" />
            <span className="font-medium text-sm">
              Créditos disponibles: {credits}
            </span>
          </Badge>
          <Button
            onClick={handleGenerateTasks}
            disabled={isGenerating || credits < 1}
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-primary/20"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Generar Tareas
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Task List Column */}
        <div className="md:col-span-3 space-y-4">
          {/* Create Task Form */}

          <form onSubmit={handleCreateTask} className="flex gap-2">
            <Input
              placeholder="Nueva tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="bg-background/50 border-primary/20 focus-visible:ring-primary/30"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isCreating || !newTaskTitle.trim()}
            >
              {isCreating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
            </Button>
          </form>

          {/* Tasks Display */}
          <div className="grid gap-2">
            {tasks.length === 0 ? (
              <div className="text-center py-10 opacity-50">
                <div className="inline-block p-3 rounded-full bg-muted mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p>No hay tareas pendientes.</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className={`
                                group flex items-center justify-between p-3 rounded-lg border transition-all duration-200
                                ${
                                  task.status === "completed"
                                    ? "bg-muted/30 border-border text-muted-foreground"
                                    : "bg-card border-primary/10 hover:border-primary/30 shadow-sm hover:shadow-md"
                                }
                            `}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <button
                      onClick={() => handleToggleStatus(task)}
                      disabled={loadingTasks[task.id]}
                      className={`
                                        shrink-0 transition-colors duration-200
                                        ${task.status === "completed" ? "text-green-500" : "text-muted-foreground hover:text-primary"}
                                    `}
                    >
                      {task.status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>
                    <span
                      className={`truncate font-medium ${task.status === "completed" ? "line-through opacity-70" : ""}`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-destructive hover:bg-destructive/10 rounded-md transition-all sm:ml-2"
                    aria-label="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
