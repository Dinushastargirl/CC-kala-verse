import { GoogleGenAI, Chat } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateToolResponse = async (
  modelName: string,
  systemPrompt: string,
  userInputs: Record<string, string>
): Promise<string> => {
  if (!apiKey) throw new Error("API Key not found");

  const formattedInputs = Object.entries(userInputs)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  const prompt = `
    ${systemPrompt}
    
    ---
    INPUTS:
    ${formattedInputs}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini Tool Error:", error);
    return "Error generating content. Please try again.";
  }
};

export const createChatSession = (systemInstruction: string) => {
    return ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction
        }
    });
}

export const sendMessage = async (chat: Chat, message: string) => {
    try {
        const response = await chat.sendMessage({ message });
        return response.text;
    } catch (e) {
        console.error(e);
        return "Sorry, I encountered an error.";
    }
}
