import { useState, useEffect, useRef } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Sidebar } from './Sidebar';
import { useTheme } from '../contexts/ThemeContext';
import logoPensando from '../imagenes/Pensando.jpg'; // <-- La importación se mantiene aquí

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatAppProps {
  webhookUrl: string;
  welcomeMessage: string;
  onGoToWelcome: () => void; 
}

// ======================================================================
// FUNCIÓN CORREGIDA: sendToN8n
// ======================================================================

async function sendToN8n(sessionID: string, chatInput: string, webhookUrl: string, file?: File | Blob): Promise<string> {
  let body: FormData | string;
  let headers: Record<string, string> = {};

  // --- Lógica para construir el BODY y HEADERS ---
  if (file) {
    body = new FormData();
    body.append('sessionID', sessionID);
    body.append('chatInput', chatInput);

    if (file.type.startsWith('audio/')) {
      body.append('data', file, 'grabacion.webm');
    } else if (file.type.startsWith('image/')) {
      body.append('data', file, 'imagen.png');
    } else {
      body.append('data', file, 'archivo');
    }
  } else {
    const payload = {
      sessionID: sessionID,
      chatInput: chatInput
    };
    body = JSON.stringify(payload);
    headers['Content-Type'] = 'application/json';
  }
  // --- FIN Lógica para construir el BODY y HEADERS ---

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`Error HTTP ${response.status}: ${response.statusText}`);
    }

    // === INICIO DE LA LÓGICA DE PROCESAMIENTO CORREGIDA ===
    const contentType = response.headers.get("content-type") || "";
    let finalResponseText: string;

    if (contentType.includes("application/json")) {
      // 1. Si es JSON, pársalo
      const response_json = await response.json();

      if (response_json.output) {
        // Opción 1: n8n devolvió la clave 'output' (Formato común de n8n)
        finalResponseText = response_json.output;
      } else if (response_json.message) {
        // Opción 2: n8n devolvió una clave 'message' (Formato estructurado)
        finalResponseText = response_json.message;
      } else {
        // Opción 3: Recibimos un JSON, pero sin las claves de mensaje esperadas (ej: el JSON vacío {})
        console.warn("La respuesta de n8n no tiene la clave de mensaje esperada:", response_json);
        finalResponseText = "Respuesta recibida de n8n, pero sin formato esperado (JSON válido): \n" + JSON.stringify(response_json, null, 2);
      }
    } else {
      // 2. Si NO es JSON (es texto/plain), pársalo como texto
      // Esto previene el error "Unexpected end of JSON input"
      finalResponseText = await response.text();
    }
    
    // Devolvemos el texto ya procesado
    return finalResponseText;

    // === FIN DE LA LÓGICA DE PROCESAMIENTO CORREGIDA ===

  } catch (e) {
    console.error("Error al conectar con n8n:", e);
    // Añadimos más detalle para errores de parseo
    if (e instanceof Error && e.message.includes('JSON')) {
        throw new Error("Error de formato de respuesta. El servidor devolvió texto donde se esperaba JSON.");
    }
    throw e;
  }
}

// ======================================================================
// COMPONENTE PRINCIPAL: ChatApp
// ======================================================================

export function ChatApp({ webhookUrl, welcomeMessage, onGoToWelcome }: ChatAppProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: '¡Hola! Soy Liam, tu asistente de tickets de soporte. ¿En que puedo ayudarte hoy',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [sessionID] = useState(() => crypto.randomUUID());

  const [isDesktopExpanded, setIsDesktopExpanded] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleQuerySelect = (query: string) => {
    setInputValue(query);
  };

  const toggleDesktopSidebar = () => {
    setIsDesktopExpanded(prev => !prev);
  };

  const handleSendMessage = async (text: string, file?: File | Blob) => {
    
    let uiMessageText = text;
    if (file) {
      if (file.type.startsWith('audio/')) {
        uiMessageText = 'Audio enviado'; 
      } else if (file.type.startsWith('image/')) {
        uiMessageText = text || 'Imagen adjunta';
      }
    }

    if (!uiMessageText.trim() && !file) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: uiMessageText, 
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendToN8n(sessionID, text, webhookUrl, file);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessageText = error instanceof Error
        ? error.message
        : 'Lo siento, hubo un error al procesar tu consulta. Por favor, intenta de nuevo.';

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error al conectar: ${errorMessageText}`,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark
        ? 'bg-zinc-900' 
        : 'bg-indigo-100' 
    }`}>
      <div className="h-screen flex flex-col md:flex-row">
        
        <Sidebar 
          onQuerySelect={handleQuerySelect}
          isDesktopExpanded={isDesktopExpanded}
          onDesktopToggle={toggleDesktopSidebar}
          onGoToWelcome={onGoToWelcome}
        />
        
        <div className="flex-1 flex flex-col md:w-full">
          
          {/* --- HEADER MODIFICADO --- */}
          <header className={`transition-colors duration-300 ${
            isDark
              ? 'bg-zinc-900' 
              : 'bg-indigo-100' 
          } p-4 shadow-lg`}>
            <div className="flex items-center justify-between">
              {/* Título minimizado */}
              <h1 className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r opacity-30 ${
    isDark
      ? 'from-zinc-500 to-zinc-600'
      : 'from-indigo-800 to-indigo-700'
  }`}>
  L.IA.M
</h1>

              
              {/* Botón de tema (color ajustado) */}
              <button
                onClick={toggleTheme}
                className={`p-2.5 rounded-xl transition-all duration-200 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-400'
                    : 'bg-indigo-400 hover:bg-indigo-500 text-white' 
                }`}
                aria-label="Toggle theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </header>

          {/* --- CHAT WINDOW MODIFICADO --- */}
          <div className={`flex-1 overflow-y-auto my-2 mx-2 rounded-2xl shadow-lg transition-colors barra duration-300 ${
            isDark
              ? 'bg-zinc-900' 
              : 'bg-indigo-50' 
          }`}>
            <div className="p-6 space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}
              {isLoading && (
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <img 
                      src={logoPensando} 
                      alt="Procesando..." 
                      className="w-12 h-12 rounded-full animate-pulse" 
                    />
                  </div>
                  {/* Color de 'cargando' ajustado */}
                  <div className={`rounded-2xl px-4 py-2 border ${
                    isDark
                      ? 'bg-zinc-800 border-zinc-800 text-slate-100' 
                      : 'bg-indigo-200 border-indigo-200 text-indigo-900' 
                  }`}>
                    <p className="text-sm">Procesando consulta...</p>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div> 


          {/* --- CHAT INPUT MODIFICADO --- */}
          <div className={`mx-2 mb-2 rounded-2xl shadow-lg overflow-hidden border transition-colors duration-300 ${ 
            isDark
              ? 'bg-zinc-900 border-zinc-800' 
              : 'bg-indigo-50 border-indigo-200' 
          }`}>
            <ChatInput onSend={handleSendMessage} disabled={isLoading} initialValue={inputValue} />
          </div>
        </div>
      </div>
    </div>
  );
}