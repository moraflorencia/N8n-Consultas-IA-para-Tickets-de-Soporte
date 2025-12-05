import { useTheme } from '../contexts/ThemeContext';

// Importa tu logo 'feliz'
import logoFeliz from '../imagenes/Feliz.jpg';

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      
      {/* MODIFICACIÓN: Avatar del Bot (ahora solo se muestra si NO es usuario) */}
      {!isUser && (
        // Avatar del Bot (con tu imagen 'feliz.png')
        <img
          src={logoFeliz}
          alt="Bot"
          className="flex-shrink-0 w-12 h-12 rounded-full"
        />
      )}
      {/* FIN MODIFICACIÓN */}

      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isUser
            ? isDark
              ? 'bg-gradient-to-r from-zinc-800/90 to-zinc-800/90 text-white border border-zinc-800/90'
              : 'bg-gradient-to-r from-indigo-400 to-indigo-400 text-white shadow-lg'
            : isDark
              ? 'bg-zinc-800 text-slate-100 border border-zinc-800'
              : 'bg-indigo-200 text-indigo-900 border border-indigo-200'
        }`}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">{message}</p>
        </div>
        <span className={`text-xs mt-1 px-2 ${
          isDark ? 'text-slate-200/60' : 'text-indigo-900/60'
        }`}>
          {timestamp.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}