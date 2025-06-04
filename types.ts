
import { Chat } from "@google/genai";

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'system';
  timestamp: Date;
}

export interface GeminiServiceType {
  getAi: () => any; // Simplified for example, replace with actual GoogleGenAI type if needed elsewhere
  startChatSession: (personality: string, knowledgeBase?: string) => Promise<Chat>;
  sendMessageInChat: (chat: Chat, message: string) => Promise<string>;
  constructSystemInstruction: (personality: string, knowledgeBase?: string) => string;
}

export type ApiKeyStatus = 'checking' | 'ok' | 'missing' | 'error';
