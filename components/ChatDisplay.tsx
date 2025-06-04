
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import ChatMessage from './ChatMessage';

interface ChatDisplayProps {
  messages: Message[];
}

const ChatDisplay: React.FC<ChatDisplayProps> = ({ messages }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-grow bg-gray-800 p-4 rounded-lg shadow-inner overflow-y-auto mb-4 h-96">
      {messages.length === 0 ? (
        <div className="flex justify-center items-center h-full">
          <p className="text-gray-500">No hay mensajes aún. ¡Comienza la conversación!</p>
        </div>
      ) : (
        messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default ChatDisplay;
