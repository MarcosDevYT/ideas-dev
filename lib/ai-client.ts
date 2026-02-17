/**
 * Cliente para interactuar con la API de IA externa
 */

interface SystemMessage {
  role: "system";
  content: string;
}

interface UserMessage {
  role: "user";
  content: string;
}

interface AssistantMessage {
  role: "assistant";
  content: string;
}

type ChatMessage = SystemMessage | UserMessage | AssistantMessage;

/**
 * Realiza streaming del chat de ideas usando el endpoint /advanced-chat
 * @returns ReadableStream con la respuesta de la IA
 */
export async function streamIdeasChat(params: {
  systemMessages: SystemMessage[];
  userMessage: UserMessage;
}): Promise<ReadableStream> {
  const aiApiUrl = process.env.AI_API_URL;

  if (!aiApiUrl) {
    throw new Error("AI_API_URL no está configurada");
  }

  const response = await fetch(`${aiApiUrl}/advanced-chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la API de IA: ${response.status} - ${errorText}`);
  }

  if (!response.body) {
    throw new Error("La respuesta de la API no contiene un body");
  }

  return response.body;
}

/**
 * Realiza streaming del chat de proyecto usando el endpoint /chat
 * @returns ReadableStream con la respuesta de la IA
 */
export async function streamProjectChat(params: {
  messages: ChatMessage[];
}): Promise<ReadableStream> {
  const aiApiUrl = process.env.AI_API_URL;

  if (!aiApiUrl) {
    throw new Error("AI_API_URL no está configurada");
  }

  const response = await fetch(`${aiApiUrl}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en la API de IA: ${response.status} - ${errorText}`);
  }

  if (!response.body) {
    throw new Error("La respuesta de la API no contiene un body");
  }

  return response.body;
}

/**
 * Genera una respuesta completa del chat de ideas (sin streaming)
 */
export async function generateIdeasChatCompletion(params: {
  systemMessages: SystemMessage[];
  userMessage: UserMessage;
}): Promise<string> {
  const stream = await streamIdeasChat(params);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}

/**
 * Genera una respuesta completa del chat de proyecto (sin streaming)
 * Útil para tareas puntuales como generar títulos o resúmenes
 */
export async function generateProjectChatCompletion(params: {
  messages: ChatMessage[];
}): Promise<string> {
  const stream = await streamProjectChat(params);
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += decoder.decode(value, { stream: true });
    }
  } finally {
    reader.releaseLock();
  }

  return result;
}
