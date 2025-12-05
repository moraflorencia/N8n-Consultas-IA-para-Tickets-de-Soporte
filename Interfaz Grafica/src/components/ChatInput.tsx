import { useState, useEffect, useRef } from 'react';
// 1. Importaciones actualizadas: Mic, Send, Paperclip, Trash2
import { Send, Mic, Paperclip, Trash2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface ChatInputProps {
  onSend: (message: string, file?: File | Blob) => void;
  disabled?: boolean;
  initialValue?: string;
}

export function ChatInput({ onSend, disabled, initialValue = '' }: ChatInputProps) {
  const [message, setMessage] = useState(initialValue);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>(''); // Para vistas previas de imágenes
  
  // 2. Nueva lógica de grabación
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialValue) {
      setMessage(initialValue);
    }
  }, [initialValue]);

  // 3. Manejador de archivos (acepta imágenes y otros)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      // Generar vista previa solo si es una imagen
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFilePreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(''); // No mostrar vista previa para otros archivos
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || file) && !disabled) {
      // 4. Lógica de envío actualizada
      // Si hay archivo, el texto es opcional (puede ser un pie de foto)
      onSend(message.trim(), file || undefined);
      setMessage('');
      clearFile();
    }
  };

  const clearFile = () => {
    setFile(null);
    setFilePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 5. Lógica de grabación "One-Click"
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSend('', audioBlob); // Envía el audio blob
        stream.getTracks().forEach(track => track.stop()); // Detiene el stream
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error al acceder al micrófono:", err);
      // Aquí podrías mostrar un error al usuario
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // 6. JSX con los nuevos colores (zinc/stone) y lógica
  return (
    <form onSubmit={handleSubmit} className={`p-4 transition-colors ${
      isDark ? 'bg-zinc-900' : 'bg-white'
    }`}>
      {/* Vista previa (para imágenes) o nombre de archivo */}
      {file && (
        <div className={`p-2 mb-2 rounded-lg flex justify-between items-center ${isDark ? 'bg-zinc-800' : 'bg-stone-100'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            {filePreview && (
              <img src={filePreview} alt="Preview" className="h-10 w-10 object-cover rounded" />
            )}
            <span className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-stone-700'}`}>
              {file.name}
            </span>
          </div>
          <button type="button" onClick={clearFile} className={`p-1 rounded-full ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-stone-200'}`}>
            <Trash2 className={`w-4 h-4 ${isDark ? 'text-gray-500' : 'text-stone-500'}`} />
          </button>
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Botón de Adjuntar (Paperclip) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        {/* <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isRecording}
          className={`p-3 rounded-xl transition-all ${
            isDark
              ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-400'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
          } disabled:opacity-50`}
          title="Adjuntar archivo"
        >
          <Paperclip className="w-5 h-5" />
        </button> */}

        {/* Text Area */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          disabled={disabled || isRecording}
          placeholder={isRecording ? "Grabando audio..." : (disabled ? "Procesando..." : "Escribe tu consulta...")}
          rows={1}
          className={`flex-1 p-3 rounded-xl resize-none border-none outline-none text-sm max-h-32 overflow-hidden ${
            isDark
              ? 'bg-zinc-800 text-gray-200 placeholder-zinc-500'
              : 'bg-stone-100 text-stone-900 placeholder-stone-500'
          } disabled:opacity-50 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-500/40`}
        />

        {/* Botón de Micrófono (Lógica "One-Click") */}
        {/* <button
          type="button"
          onClick={handleMicClick}
          disabled={disabled}
          className={`p-3 rounded-xl transition-all ${
            isRecording
              ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
              : (isDark ? 'bg-zinc-800 hover:bg-zinc-700 text-gray-400' : 'bg-indigo-100 hover:bg-stone-200 text-indigo-900')
          } disabled:opacity-50`}
          title={isRecording ? "Detener grabación" : "Grabar audio"}
        >
          <Mic className="w-5 h-5" />
        </button> */}

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={disabled || isRecording || (!message.trim() && !file)}
          className={`p-3 rounded-xl transition-all ${
            isDark
              ? 'bg-teal-700 hover:bg-teal-600 text-white'
              : 'bg-indigo-400 hover:bg-indigo-500 text-white'
          } disabled: disabled:cursor-not-allowed`}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
}