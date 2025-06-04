
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat } from '@google/genai';
import { Message, ApiKeyStatus, GeminiServiceType } from './types';
import Header from './components/Header';
import PersonalityInput from './components/PersonalityInput';
import KnowledgeBaseUpload from './components/KnowledgeBaseUpload';
import ChatDisplay from './components/ChatDisplay';
import ChatInput from './components/ChatInput';
import ApiKeyStatusBanner from './components/ApiKeyStatusBanner';
import { GeminiService } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [stagedPersonality, setStagedPersonality] = useState<string>("un asistente virtual amigable y muy útil");
  const [currentPersonality, setCurrentPersonality] = useState<string>("un asistente virtual amigable y muy útil");
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatus>('checking');

  const geminiServiceRef = useRef<GeminiServiceType | null>(null);

  useEffect(() => {
    if (!process.env.API_KEY) {
      setApiKeyStatus('missing');
      setError("Falta la API Key de Gemini. Asegúrate de que la variable de entorno API_KEY esté configurada.");
    } else {
      try {
        geminiServiceRef.current = new GeminiService();
        setApiKeyStatus('ok');
      } catch (e) {
        console.error("Error al inicializar GeminiService:", e);
        setApiKeyStatus('error');
        setError((e as Error).message || "Error al inicializar el servicio de IA. Verifique la API Key.");
      }
    }
  }, []);

  const initializeOrUpdateChat = useCallback(async () => {
    if (apiKeyStatus !== 'ok' || !geminiServiceRef.current) {
      if (apiKeyStatus !== 'missing' && apiKeyStatus !== 'error') { 
         setError("El servicio de IA no está listo. Verifique la configuración de la API Key.");
      }
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const newChat = await geminiServiceRef.current.startChatSession(currentPersonality, knowledgeBase);
      setChatSession(newChat);
      
      const systemMessageText = `Chat iniciado/actualizado. Personalidad: "${currentPersonality}". ${knowledgeBase ? "Con base de conocimiento." : "Sin base de conocimiento adicional."}`;
      const systemMessage: Message = {
        id: `system-${Date.now()}`,
        text: systemMessageText,
        sender: 'system',
        timestamp: new Date()
      };
      
      // When personality or knowledge base changes, clear old messages and show the new system context.
      setMessages([systemMessage]);

    } catch (err) {
      console.error("Error al iniciar/actualizar la sesión de chat:", err);
      const errorMessage = (err as Error).message || "No se pudo iniciar/actualizar la sesión de chat.";
      setError(errorMessage);
      setChatSession(null); // Ensure chat session is null on error
      if (errorMessage.toLowerCase().includes("api key")) {
        setApiKeyStatus('error');
      }
    } finally {
      setIsLoading(false);
    }
  // Dependencies: re-run if personality, knowledge base, or API key status changes.
  // geminiServiceRef.current is stable after first initialization handled by apiKeyStatus.
  }, [currentPersonality, knowledgeBase, apiKeyStatus]); 

  useEffect(() => {
    if (apiKeyStatus === 'ok') {
        initializeOrUpdateChat();
    }
  // This effect runs when apiKeyStatus changes to 'ok' or when initializeOrUpdateChat itself is redefined (due to its own dependencies changing).
  }, [apiKeyStatus, initializeOrUpdateChat]);


  const handleSendMessage = async (userInput: string) => {
    if (!userInput.trim() || isLoading ) {
      if (!chatSession && !isLoading && apiKeyStatus === 'ok') {
        setError("La sesión de chat no está activa. Intente aplicar la personalidad/base de datos o recargar.");
      }
      return;
    }
    if (!chatSession) {
        setError("La sesión de chat no está activa. Por favor, espera a que se inicialice o aplica una personalidad.");
        return;
    }


    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      if (!geminiServiceRef.current) throw new Error("Gemini service no está inicializado.");
      const botResponseText = await geminiServiceRef.current.sendMessageInChat(chatSession, userInput);
      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponseText,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error("Error al enviar mensaje:", err);
      const errorMessage = (err as Error).message || "Error al obtener respuesta del bot.";
      setError(errorMessage);
      setMessages(prev => [...prev, {
        id: `error-${Date.now()}`,
        text: `Error: ${errorMessage}`,
        sender: 'system',
        timestamp: new Date()
      }]);
      if (errorMessage.toLowerCase().includes("api key")) {
        setApiKeyStatus('error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyPersonality = () => {
    setCurrentPersonality(stagedPersonality);
    // The useEffect listening to currentPersonality will trigger initializeOrUpdateChat
  };
  
  const handleKnowledgeBaseUpload = (content: string) => {
    setKnowledgeBase(content);
    // The useEffect listening to knowledgeBase will trigger initializeOrUpdateChat
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      <Header />
      <ApiKeyStatusBanner status={apiKeyStatus} message={error} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 bg-gray-800 p-6 rounded-lg shadow-xl">
        <PersonalityInput
          stagedPersonality={stagedPersonality}
          currentPersonality={currentPersonality}
          onStagedPersonalityChange={setStagedPersonality}
          onApplyPersonality={handleApplyPersonality}
          disabled={isLoading || apiKeyStatus !== 'ok'}
        />
        <KnowledgeBaseUpload 
          onFileUpload={handleKnowledgeBaseUpload} 
          disabled={isLoading || apiKeyStatus !== 'ok'}
        />
      </div>

      {error && apiKeyStatus !== 'missing' && apiKeyStatus !== 'error' && ( // Show general errors not covered by banner's default messages
        <div className="bg-red-700 text-white p-3 rounded-md mb-4 text-sm shadow">
          <strong>Error:</strong> {error}
        </div>
      )}

      <ChatDisplay messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading || apiKeyStatus !== 'ok'} />
    </div>
  );
};

export default App;
