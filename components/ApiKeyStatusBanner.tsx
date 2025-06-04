
import React from 'react';
import { ApiKeyStatus } from '../types';

interface ApiKeyStatusBannerProps {
  status: ApiKeyStatus;
  message?: string | null;
}

const ApiKeyStatusBanner: React.FC<ApiKeyStatusBannerProps> = ({ status, message }) => {
  if (status === 'ok') return null;

  let bgColor = 'bg-yellow-500';
  let borderColor = 'border-yellow-700';
  let textColor = 'text-yellow-900';
  let title = 'Atención';
  let defaultMessage = 'Verificando el estado de la API Key...';

  if (status === 'missing' || status === 'error') {
    bgColor = 'bg-red-500';
    borderColor = 'border-red-700';
    textColor = 'text-red-100'; // Brighter text for dark red
    title = 'Error de Configuración';
    defaultMessage = status === 'missing' 
      ? "La API Key de Gemini no está configurada. Por favor, asegúrese de que la variable de entorno API_KEY esté correctamente establecida."
      : "Hubo un problema con la API Key de Gemini o la conexión al servicio.";
  }

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} ${textColor} p-4 mb-6 rounded-md shadow-lg`} role="alert">
      <p className="font-bold">{title}</p>
      <p>{message || defaultMessage}</p>
    </div>
  );
};

export default ApiKeyStatusBanner;
