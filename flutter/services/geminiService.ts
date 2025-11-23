import { GoogleGenAI } from "@google/genai";
import { Memory } from '../types';

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMemorySummary = async (memories: Memory[], period: string): Promise<string> => {
  try {
    // Prepare a simplified version of memories for the prompt to save tokens
    const memoryContext = memories.map(m => ({
      date: m.date.split('T')[0],
      title: m.title,
      content: m.content,
      type: m.type,
      tags: m.tags?.join(', ')
    }));

    const prompt = `
      Analyze the following list of user memories from the last ${period}.
      Generate a warm, engaging, and insightful summary of the user's life during this period.
      Highlight key themes, emotions, and activities. 
      Keep the tone personal and reflective, like a digital diary assistant.
      
      Memories Data:
      ${JSON.stringify(memoryContext)}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing your memories.";
  }
};

export const askGeminiAboutMemories = async (question: string, memories: Memory[]): Promise<string> => {
    try {
        const memoryContext = memories.map(m => ({
            date: m.date.split('T')[0],
            title: m.title,
            content: m.content,
            type: m.type,
          }));

        const prompt = `
        Context: You are Digi-Mem, a helpful memory assistant.
        User Question: "${question}"
        
        Based strictly on the following memory database, answer the user's question.
        If the answer isn't in the memories, say so politely.
        
        Database:
        ${JSON.stringify(memoryContext)}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        
        return response.text || "I couldn't process that request.";
    } catch (error) {
        console.error("Gemini Chat Error:", error);
        return "Sorry, I'm having trouble accessing your memories right now.";
    }
}