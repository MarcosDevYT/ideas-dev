import { generateProjectChatCompletion, streamProjectChat } from "./ai-client";

/**
 * Genera un título corto y descriptivo para un chat de ideas basado en el prompt del usuario.
 * @param prompt El mensaje o prompt inicial del usuario.
 * @param ideaContext (Opcional) El objeto JSON completo de la idea para más contexto.
 */
export async function generateIdeaChatTitle(
  prompt: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ideaContext?: any,
): Promise<string> {
  try {
    const contextString = ideaContext
      ? `\n\nDetalles adicionales de la idea:\n${JSON.stringify(ideaContext, null, 2)}`
      : "";

    const response = await generateProjectChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Eres un experto en resumir intenciones de usuarios. Tu tarea es generar un título MUY CORTO (2 a 5 palabras máximo) que resuma de qué trata la idea o pregunta del usuario. Debe ser descriptivo y directo, sin comillas ni signos de puntuación innecesarios. Solo devuelve el título, nada más.",
        },
        {
          role: "user",
          content: `Genera un título corto para esta idea o prompt:\n"${prompt}"${contextString}`,
        },
      ],
    });

    return response.trim().replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Error generating idea chat title:", error);
    return ""; // Retornamos cadena vacía para usar el fallback
  }
}

/**
 * Genera un resumen del proyecto basado en la descripción y el historial de mensajes.
 */
export async function generateProjectSummary(
  description: string | null,
  messages: { role: string; content: string }[],
): Promise<string> {
  try {
    const messagesContext = messages
      .slice(-10) // Tomamos los últimos 10 mensajes para contexto
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
      Basado en la siguiente información del proyecto, genera un resumen ejecutivo conciso (máximo 3 párrafos).
      El resumen debe capturar la idea principal, los objetivos clave y el estado actual si se puede inferir.
      Usa formato Markdown para resaltar puntos clave.
      
      Descripción original: ${description || "No disponible"}
      
      Contexto reciente del chat:
      ${messagesContext || "No hay mensajes recientes"}
    `;

    const response = await generateProjectChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Eres un Project Manager experto. Tu tarea es sintetizar la información de un proyecto en un resumen claro y profesional.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return response;
  } catch (error) {
    console.error("Error generating project summary:", error);
    throw new Error("Failed to generate summary");
  }
}

/**
 * Genera una lista de tareas sugeridas para el proyecto.
 */
export async function generateProjectTasks(
  description: string | null,
  summary: string | null,
  messages: { role: string; content: string }[],
): Promise<{ title: string; status: string }[]> {
  try {
    const messagesContext = messages
      .slice(-10)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
      Basado en la siguiente información del proyecto, genera una lista de 5 a 10 tareas clave para avanzar en el desarrollo.
      
      Descripción: ${description || "No disponible"}
      Resumen existente: ${summary || "No disponible"}
      Contexto reciente: ${messagesContext}
      
      Responde SOLO con un array JSON válido de objetos, donde cada objeto tenga:
      - title: Título de la tarea (string)
      - status: "pending" (string constante)
      
      Ejemplo formato:
      [
        {"title": "Configurar repositorio", "status": "pending"},
        {"title": "Diseñar base de datos", "status": "pending"}
      ]
      
      NO incluyas markdown, ni explicaciones, solo el JSON puro.
    `;

    const response = await generateProjectChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Eres un Project Manager técnico. Generas tareas procesables y claras.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    // Intentar limpiar la respuesta de bloques de código markdown si los hay
    const cleanResponse = response.replace(/^```json\n?|```$/g, "").trim();

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Error generating project tasks:", error);
    throw new Error("Failed to generate tasks");
  }
}

/**
 * Genera una lista de recursos recomendados para el proyecto.
 */
export async function generateProjectResources(
  description: string | null,
  summary: string | null,
  messages: { role: string; content: string }[],
): Promise<{ title: string; type: string; url?: string }[]> {
  try {
    const messagesContext = messages
      .slice(-10)
      .map((m) => `${m.role}: ${m.content}`)
      .join("\n");

    const prompt = `
      Basado en la siguiente información del proyecto, sugiere 5 recursos técnicos útiles (librerías, documentaciones, herramientas).
      
      Descripción: ${description || "No disponible"}
      Resumen existente: ${summary || "No disponible"}
      Contexto reciente: ${messagesContext}
      
      Responde SOLO con un array JSON válido de objetos, donde cada objeto tenga:
      - title: Título del recurso o nombre de la librería (string)
      - type: "link" (por defecto) o "tool" (string)
      - url: URL oficial si es conocida (opcional, string)
      
      Ejemplo formato:
      [
        {"title": "Documentación React", "type": "link", "url": "https://react.dev"},
        {"title": "Tailwind CSS", "type": "tool", "url": "https://tailwindcss.com"}
      ]
      
      NO incluyas markdown, ni explicaciones, solo el JSON puro.
    `;

    const response = await generateProjectChatCompletion({
      messages: [
        {
          role: "system",
          content:
            "Eres un Arquitecto de Software. Recomiendas las mejores herramientas y documentaciones.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const cleanResponse = response.replace(/^```json\n?|```$/g, "").trim();

    return JSON.parse(cleanResponse);
  } catch (error) {
    console.error("Error generating project resources:", error);
    throw new Error("Failed to generate resources");
  }
}

/**
 * Genera un stream de tareas sugeridas para el proyecto (formato Markdown).
 */
export async function generateProjectTasksStream(
  description: string | null,
  summary: string | null,
  messages: { role: string; content: string }[],
): Promise<ReadableStream> {
  const messagesContext = messages
    .slice(-15)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `
      Basado en la siguiente información del proyecto, genera una lista de 5 a 10 tareas clave.
      
      Descripción: ${description || "No disponible"}
      Resumen existente: ${summary || "No disponible"}
      Contexto reciente: ${messagesContext}
      
      Responde CON UNA LISTA MARKDOWN simple.
      Cada tarea debe empezar con un guion corto "- ".
      NO uses numeración.
      NO uses formato JSON.
      NO incluyas texto introductorio ni conclusiones.
      
      Ejemplo formato:
      - Configurar repositorio
      - Diseñar base de datos
      - Implementar autenticación
    `;

  return await streamProjectChat({
    messages: [
      {
        role: "system",
        content:
          "Eres un Project Manager técnico. Generas listas de tareas claras y directas.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}

/**
 * Genera un stream de recursos sugeridos para el proyecto (formato Markdown).
 */
export async function generateProjectResourcesStream(
  description: string | null,
  summary: string | null,
  messages: { role: string; content: string }[],
): Promise<ReadableStream> {
  const messagesContext = messages
    .slice(-15)
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const prompt = `
      Basado en la siguiente información del proyecto, sugiere 5 recursos técnicos útiles.
      
      Descripción: ${description || "No disponible"}
      Resumen existente: ${summary || "No disponible"}
      Contexto reciente: ${messagesContext}
      
      Responde CON UNA LISTA MARKDOWN simple.
      Cada recurso debe tener el formato: "- [Título](URL) - Tipo (Link/Tool/File)".
      Si no tienes URL, usa solo "- Título - Tipo".
      
      Ejemplo formato:
      - [Documentación React](https://react.dev) - Link
      - [Tailwind CSS](https://tailwindcss.com) - Tool
      
      NO uses formato JSON.
    `;

  return await streamProjectChat({
    messages: [
      {
        role: "system",
        content: "Eres un Arquitecto de Software. Recomiendas recursos útiles.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });
}
