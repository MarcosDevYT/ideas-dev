/**
 * Generación de prompts del sistema para la API de IA
 * REFACTOR: Ahora delega a los módulos específicos en lib/prompts/
 */

import {
  buildIdeasSystemPrompt as buildIdeas,
  UserContext as IdeasUserContext,
} from "./prompts/ideas";
import {
  buildProjectSystemPrompt as buildProject,
  UserContext as ProjectUserContext,
  ProjectContext,
} from "./prompts/projects";

// Tipos re-exportados o adaptados
export interface UserContext {
  stack?: string[];
  role?: string | null;
}

export function buildIdeasSystemPrompt(user: IdeasUserContext): string {
  return buildIdeas(user);
}

export function buildProjectSystemPrompt(
  user: ProjectUserContext,
  project: ProjectContext,
): string {
  return buildProject(user, project);
}
