
import React from 'react';

interface PersonalityInputProps {
  stagedPersonality: string;
  currentPersonality: string;
  onStagedPersonalityChange: (newStagedPersonality: string) => void;
  onApplyPersonality: () => void;
  disabled?: boolean; // Global disable (e.g. loading, API key error)
}

const PersonalityInput: React.FC<PersonalityInputProps> = ({
  stagedPersonality,
  currentPersonality,
  onStagedPersonalityChange,
  onApplyPersonality,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onStagedPersonalityChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplyPersonality();
  };

  // Button is disabled if globally disabled OR if staged personality is same as current
  const isApplyButtonDisabled = disabled || stagedPersonality === currentPersonality;

  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor="personality" className="block text-sm font-medium text-gray-300">
        Define la Personalidad del Chatbot
      </label>
      <textarea
        id="personality"
        rows={3}
        className="block w-full p-3 bg-gray-700 border border-gray-600 rounded-md shadow-sm placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-200 disabled:opacity-50"
        placeholder="Ej: Un pirata divertido, un científico riguroso, un poeta melancólico..."
        value={stagedPersonality}
        onChange={handleChange}
        disabled={disabled}
        aria-label="Define la personalidad del chatbot"
      />
      <button
        type="button" // Changed from submit as form submission is handled by onClick
        onClick={handleSubmit}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        disabled={isApplyButtonDisabled}
      >
        Aplicar Personalidad
      </button>
    </div>
  );
};

export default PersonalityInput;
