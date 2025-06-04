
import React, { useState } from 'react';
import LoadingSpinner from './LoadingSpinner'; // Assuming you have this component

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center bg-gray-800 p-4 rounded-lg shadow-xl">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Escribe tu mensaje aquí..."
        className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-200 placeholder-gray-500 disabled:opacity-50"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150 ease-in-out flex items-center justify-center"
        disabled={isLoading || !inputValue.trim()}
      >
        {isLoading ? <LoadingSpinner /> : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
            <path d="M3.105 3.105a1.5 1.5 0 012.122-.001L19.43 14.257V8.547a1.5 1.5 0 013 0v10.906A1.5 1.5 0 0120.93 21a1.5 1.5 0 01-1.5-1.5V10.603L4.329 19.43a1.5 1.5 0 01-2.122-2.122L15.706 3.105H8.547a1.5 1.5 0 010-3h10.906a1.5 1.5 0 011.5 1.5v2.006L3.105 3.105z" />
          </svg>
        )}
        <span className="ml-2 sr-only">Enviar</span>
      </button>
    </form>
  );
};

export default ChatInput;
