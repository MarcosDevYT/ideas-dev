"use client";

import { useState, useEffect } from "react";
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
import { eventBus, EVENTS } from "@/lib/events";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  createTaskAction,
  toggleTaskStatusAction,
  deleteTaskAction,
} from "@/actions/projects/project-actions";

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

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    setCredits(userCredits);
  }, [userCredits]);

  // States for actions
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loadingTasks, setLoadingTasks] = useState<Record<string, boolean>>({});
  const [streamingTasks, setStreamingTasks] = useState<string[]>([]);

  // AI Generation Handler
  const handleGenerateTasks = async () => {
    if (credits < 1) {
      eventBus.emit(EVENTS.OUT_OF_CREDITS);
      return;
    }

    setIsGenerating(true);
    setStreamingTasks([]);
    toast.info("Generando tareas con IA...");

    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/stream`, {
        method: "POST",
      });

      if (response.status === 402) {
        eventBus.emit(EVENTS.OUT_OF_CREDITS);
        return;
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        fullText += text;

        // Real-time parsing for preview
        const lines = fullText
          .split("\n")
          .filter((line) => line.trim().startsWith("- "))
          .map((line) => line.trim().substring(2).trim());

        setStreamingTasks(lines);
      }

      setCredits((prev) => Math.max(0, prev - 1));
      eventBus.emit(EVENTS.REFRESH_SIDEBAR);
      toast.success("Tareas generadas exitosamente.");

      // Wait a moment for server background task to complete DB save
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setStreamingTasks([]); // Clear preview
      router.refresh(); // Fetch persisted tasks
    } catch (error) {
      console.error(error);
      toast.error("Error al generar tareas.");
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

          <form onSubmit={handleCreateTask} className="w-full flex gap-2">
            <Input
              placeholder="Nueva tarea..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="w-full bg-background/50 border-primary/20 focus-visible:ring-primary/30"
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
            {isGenerating && streamingTasks.length > 0 && (
              <div className="space-y-2 mb-4">
                {streamingTasks.map((task, idx) => (
                  <div
                    key={`streaming-${idx}`}
                    className="flex items-center gap-3 p-3 rounded-lg border border-primary/20 bg-primary/5 animate-pulse"
                  >
                    <div className="w-5 h-5 rounded-full border-2 border-primary/30" />
                    <span className="font-medium text-foreground/80">
                      {task}
                    </span>
                  </div>
                ))}
              </div>
            )}
            {tasks.length === 0 && !isGenerating ? (
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
                                group flex items-center w-full justify-between p-3 rounded-lg border transition-all duration-200
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
                      className={`break-words font-medium ${task.status === "completed" ? "line-through opacity-70" : ""}`}
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
