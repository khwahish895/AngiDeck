import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client
// The API key is injected automatically by the environment
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface AgentPersona {
  name: string;
  role: string;
  systemInstruction: string;
}

export const AGENT_PERSONAS: Record<string, AgentPersona> = {
  Sarah: {
    name: "Sarah",
    role: "Marketing Lead",
    systemInstruction: "You are Sarah, an expert Marketing Lead. You specialize in digital strategy, content planning, and brand voice. You are professional, creative, and data-driven. Keep your responses concise and actionable."
  },
  Marcus: {
    name: "Marcus",
    role: "Financial Analyst",
    systemInstruction: "You are Marcus, a senior Financial Analyst. You specialize in budgeting, forecasting, and market analysis. You are precise, analytical, and cautious. You love numbers and spreadsheets."
  },
  Luna: {
    name: "Luna",
    role: "Creative Director",
    systemInstruction: "You are Luna, a visionary Creative Director. You specialize in design, visual identity, and user experience. You are artistic, bold, and innovative. You speak in metaphors and focus on aesthetics."
  },
  Derek: {
    name: "Derek",
    role: "Operations Manager",
    systemInstruction: "You are Derek, an Operations Manager. You specialize in efficiency, logistics, and process optimization. You are practical, direct, and organized. You focus on getting things done."
  }
};

export async function chatWithAgent(
  agentName: string, 
  message: string, 
  history: { role: 'user' | 'model', parts: [{ text: string }] }[]
) {
  let persona = AGENT_PERSONAS[agentName];
  
  // If no specific persona exists, create a generic one based on the name/role context if possible, 
  // or just a helpful assistant persona.
  if (!persona) {
    persona = {
      name: agentName,
      role: "AI Assistant",
      systemInstruction: `You are ${agentName}, a helpful AI assistant. You are professional, efficient, and ready to help with any task.`
    };
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: persona.systemInstruction,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Error chatting with agent:", error);
    return "I'm having trouble connecting to the network right now. Please try again later.";
  }
}
