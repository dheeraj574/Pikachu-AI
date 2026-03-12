import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateSummary(content: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following academic content into concise bullet points for quick revision: ${content}`,
  });
  return response.text;
}

export async function chatWithAI(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: {
      systemInstruction: "You are Pikachu AI, a helpful academic assistant for university students. Provide concise, accurate, and encouraging study advice, explain concepts, and help with academic resources.",
    }
  });
  return response.text;
}

export async function getImportantQuestions(subject: string, topics: string[]) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Based on the subject "${subject}" and topics [${topics.join(", ")}], predict 5 high-yield "Important Questions" that are likely to appear in an exam. Provide them as a JSON array of strings.`,
    config: { responseMimeType: "application/json" }
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}

export async function getSmartRecommendations(query: string, availableResources: any[]) {
  const context = availableResources.slice(0, 20).map(r => `${r.topic} (${r.resource_type})`).join(", ");
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `User is searching for: "${query}". 
    Available resources: [${context}]. 
    Recommend the top 3 most relevant resources from the list. Return a JSON array of objects with "topic" and "reason" fields.`,
    config: { responseMimeType: "application/json" }
  });
  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    return [];
  }
}
