
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { GeminiServiceType } from "../types";

export class GeminiService implements GeminiServiceType {
    private ai: GoogleGenAI;
    private readonly modelName = 'gemini-2.5-flash-preview-04-17';

    constructor() {
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error("API_KEY variable de entorno no encontrada.");
            throw new Error("API_KEY no configurada. Por favor, verifica las variables de entorno de tu aplicación.");
        }
        try {
            this.ai = new GoogleGenAI({ apiKey });
        } catch (error) {
            console.error("Error al inicializar GoogleGenAI, posible API Key inválida:", error);
            throw new Error("API Key inválida o error al inicializar el servicio de IA. Verifica tu API_KEY.");
        }
    }

    public getAi(): GoogleGenAI {
        return this.ai;
    }

    public constructSystemInstruction(personality: string, knowledgeBase?: string): string {
        let instruction = `Eres un asistente virtual. Tu personalidad actual es: '${personality}'. Debes comunicarte siempre en español.`;
        if (knowledgeBase && knowledgeBase.trim() !== "") {
            instruction += `\n\nUtiliza la siguiente información como tu base de conocimiento principal para responder de manera concisa y relevante a la pregunta del usuario. No menciones explícitamente que estás usando esta base de conocimiento a menos que sea relevante para explicar una fuente. Simplemente integra la información en tu respuesta natural:\n---INICIO BASE DE CONOCIMIENTO---\n${knowledgeBase}\n---FIN BASE DE CONOCIMIENTO---`;
        }
        return instruction;
    }

    public async startChatSession(personality: string, knowledgeBase?: string): Promise<Chat> {
        const systemInstruction = this.constructSystemInstruction(personality, knowledgeBase);
        try {
            const chat = this.ai.chats.create({
                model: this.modelName,
                config: { 
                    systemInstruction: systemInstruction,
                }
            });
            return chat;
        } catch (error) {
            console.error("Error al iniciar la sesión de chat en GeminiService:", error);
            if (error instanceof Error && error.message.toLowerCase().includes("api key not valid")) {
                 throw new Error("API Key inválida al intentar iniciar chat. Por favor, verifique la configuración.");
            }
            throw error; 
        }
    }

    public async sendMessageInChat(chat: Chat, message: string): Promise<string> {
        try {
            const result: GenerateContentResponse = await chat.sendMessage({ message });
            // Directly access the text property as per guidance
            return result.text;
        } catch (error) {
            console.error("Error al enviar mensaje en GeminiService:", error);
             if (error instanceof Error && error.message.toLowerCase().includes("api key not valid")) {
                 throw new Error("API Key inválida al intentar enviar mensaje. Por favor, verifique la configuración.");
            }
            if (error instanceof Error && error.message.includes("fetch")) {
                throw new Error("Error de red al comunicarse con el servicio de IA. Verifica tu conexión.");
            }
            throw new Error("Error al comunicarse con el modelo de IA.");
        }
    }
}