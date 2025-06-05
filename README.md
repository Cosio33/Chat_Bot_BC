# Chatbot Personalizable con Gemini  
Un asistente virtual en español con personalidad configurable y capacidad para integrar conocimiento externo mediante archivos.  

---  

### Características Principales  
- **Personalidad Ajustable**: Define cómo el bot debe comportarse (ej: "un científico riguroso").  
- **Base de Conocimiento**: Sube archivos `.txt`, `.md` o `.csv` para respuestas basadas en datos específicos.  
- **Interfaz Amigable**: Diseño moderno con Tailwind CSS y mensajes en tiempo real.  
- **Manejo de Errores**: Alertas claras para problemas de API Key, carga de archivos inválidos, etc.  

---  

### Tecnologías Utilizadas  
- **Frontend**: React + TypeScript + Vite  
- **IA**: API de Google Gemini (`@google/genai`)  
- **Estilos**: Tailwind CSS + Componentes personalizados  

---  

### Requisitos  
1. Node.js (v18+)  
2. API Key de Gemini (obtenla en [Google AI Studio](https://aistudio.google.com/))  

---  

### Instalación y Ejecución  
1. **Clona el repositorio**:  
   ```  
   git clone [URL_DEL_REPO]  
   cd cosio33-chat_bot_bc  
   ```  

2. **Instala dependencias**:  
   ```  
   npm install  
   ```  

3. **Configura la API Key**:  
   - Crea un archivo `.env.local` en la raíz del proyecto.  
   - Agrega tu clave:  
     ```  
     GEMINI_API_KEY=tu_clave_de_gemini_aqui  
     ```  

4. **Ejecuta la aplicación**:  
   ```  
   npm run dev  
   ```  
   → Accede en `http://localhost:5173`.  

---  

### Uso Básico  
1. **Definir Personalidad**:  
   - Escribe una descripción en el campo "Personalidad" (ej: "un poeta melancólico").  
   - Haz clic en **Aplicar Personalidad**.  

2. **Subir Base de Conocimiento**:  
   - Arrastra o selecciona un archivo de texto/csv/markdown.  
   - El bot usará esta información para respuestas más precisas.  

3. **Chatear**:  
   - Envía mensajes y observa las respuestas del bot.  
   - Los mensajes del sistema indicarán cambios en la configuración.  

---  

### Estructura del Proyecto  
```  
cosio33-chat_bot_bc/  
├── components/ → Componentes React (UI y lógica de interacción)  
├── services/ → Servicio de conexión con Gemini  
├── types.ts → Tipos TypeScript  
├── App.tsx → Componente principal  
└── vite.config.ts → Configuración de Vite  
```  

---  

### Posibles Errores  
- **"API Key no configurada"**: Verifica `.env.local` y que la clave sea válida.  
- **Archivos no soportados**: Solo se permiten `.txt`, `.md`, y `.csv`.  
- **Tiempo de espera excedido**: Revisa tu conexión a internet o intenta más tarde.  

---  

### Personalización Avanzada  
- **Modelo de IA**: Cambia `gemini-2.5-flash-preview-04-17` en `geminiService.ts` por otro modelo de Gemini.  
- **Estilos**: Modifica las clases de Tailwind en los componentes para ajustar colores/espaciado.  


