import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function summarizeReply(replyText: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Summarize this standup update into a single concise sentence.
Cover what they did yesterday, what they're doing today, and any blockers.
Keep it casual and dev-friendly. No bullet points, just one flowing sentence.

Standup update:
${replyText}`,
    });
    return response.text ?? replyText;
  } catch (error) {
    console.error("Gemini summarization failed, falling back to raw text:", error);
    return replyText;
  }
}
