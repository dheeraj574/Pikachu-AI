type ChatHistoryItem = {
  role: "user" | "model";
  parts: { text: string }[];
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data as T;
}

export async function generateSummary(content: string) {
  const data = await postJson<{ text: string }>("/api/ai/summary", { content });
  return data.text;
}

export async function chatWithAI(message: string, history: ChatHistoryItem[]) {
  const data = await postJson<{ text: string }>("/api/ai/chat", { message, history });
  return data.text;
}

export async function getImportantQuestions(subject: string, topics: string[]) {
  const data = await postJson<{ items: string[] }>("/api/ai/important-questions", { subject, topics });
  return data.items;
}

export async function getSmartRecommendations(query: string, availableResources: any[]) {
  const data = await postJson<{ items: any[] }>("/api/ai/recommendations", { query, availableResources });
  return data.items;
}
