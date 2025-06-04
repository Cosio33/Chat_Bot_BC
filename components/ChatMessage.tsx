
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isBot = message.sender === 'bot';
  const isSystem = message.sender === 'system';

  const baseClasses = "max-w-xl p-3 rounded-lg mb-3 shadow";
  let specificClasses = "";

  if (isUser) {
    specificClasses = "bg-indigo-600 text-white ml-auto";
  } else if (isBot) {
    specificClasses = "bg-gray-700 text-gray-200 mr-auto";
  } else if (isSystem) {
    specificClasses = "bg-yellow-700 bg-opacity-30 text-yellow-300 text-xs italic text-center mx-auto w-full md:w-3/4";
  }

  // Basic Markdown-like rendering for **bold** and *italic*
  const renderText = (text: string) => {
    // Replace **text** with <strong>text</strong>
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Replace *text* with <em>text</em>
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Replace newlines with <br>
    text = text.replace(/\n/g, '<br />');
    return { __html: text };
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} ${isSystem ? 'justify-center' : ''} mb-2`}>
      <div className={`${baseClasses} ${specificClasses}`}>
        <div dangerouslySetInnerHTML={renderText(message.text)} />
        {!isSystem && (
            <p className={`text-xs mt-1 ${isUser ? 'text-indigo-200 text-right' : 'text-gray-500 text-left'}`}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
