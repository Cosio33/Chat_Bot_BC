
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="mb-8 text-center">
      <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        Chatbot Personalizable con Gemini
      </h1>
      <p className="text-gray-400 mt-2">Define la personalidad y proporciona conocimiento a tu asistente IA.</p>
    </header>
  );
};

export default Header;
