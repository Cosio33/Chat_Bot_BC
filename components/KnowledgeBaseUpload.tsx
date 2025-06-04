
import React, { useState, useRef } from 'react';

interface KnowledgeBaseUploadProps {
  onFileUpload: (content: string) => void;
  disabled?: boolean;
}

const KnowledgeBaseUpload: React.FC<KnowledgeBaseUploadProps> = ({ onFileUpload, disabled }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type === 'text/plain' || file.type === 'text/markdown' || file.type === 'text/csv') {
        setFileName(file.name);
        setFileError(null);
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          onFileUpload(content);
        };
        reader.onerror = () => {
            setFileError("Error al leer el archivo.");
            setFileName(null);
            onFileUpload(""); // Clear knowledge base on error
        }
        reader.readAsText(file);
      } else {
        setFileError("Archivo no soportado. Sube archivos .txt, .md o .csv.");
        setFileName(null);
        onFileUpload(""); // Clear knowledge base
        if(fileInputRef.current) fileInputRef.current.value = ""; // Reset file input
      }
    } else {
        setFileName(null);
        onFileUpload(""); // Clear knowledge base if no file selected
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      <label htmlFor="knowledge-base" className="block text-sm font-medium text-gray-300">
        Sube una Base de Conocimiento (Opcional)
      </label>
      <input
        id="knowledge-base"
        type="file"
        ref={fileInputRef}
        accept=".txt,.md,.csv"
        onChange={handleFileChange}
        className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-violet-500 file:text-violet-50 hover:file:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={disabled}
      />
      {fileName && <p className="text-xs text-green-400 mt-1">Archivo cargado: {fileName}</p>}
      {fileError && <p className="text-xs text-red-400 mt-1">{fileError}</p>}
       <p className="text-xs text-gray-500">Sube un archivo de texto (.txt, .md, .csv) para que el bot lo use como referencia.</p>
    </div>
  );
};

export default KnowledgeBaseUpload;
