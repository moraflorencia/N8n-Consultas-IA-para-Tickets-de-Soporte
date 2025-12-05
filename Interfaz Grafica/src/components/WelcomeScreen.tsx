import { MessageSquare, TicketPlus, Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface WelcomeScreenProps {
  onSelectMode: (mode: 'consultas' | 'tickets') => void;
}

export function WelcomeScreen({ onSelectMode }: WelcomeScreenProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-900' : 'bg-indigo-100'
    }`}>
      <div className="h-screen flex flex-col">
        <header className={`transition-colors duration-300 ${
          isDark ? 'bg-zinc-900' : 'bg-indigo-100'
        } p-4 shadow-lg`}>
          <div className="flex items-center justify-between">
            <h1 className={`text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r opacity-30 ${
              isDark
                ? 'from-zinc-500 to-zinc-600'
                : 'from-indigo-800 to-indigo-700'
            }`}>
              L.IA.M
            </h1>

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

        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-4xl w-full">
            <div className="text-center mb-12">
              <h2 className={`text-5xl font-extrabold mb-4 ${
                isDark ? 'text-white' : 'text-indigo-900'
              }`}>
                ¡Bienvenido a L.IA.M!
              </h2>
              <p className={`text-xl ${
                isDark ? 'text-gray-400' : 'text-indigo-700'
              }`}>
                Tu asistente inteligente de soporte. ¿Qué deseas hacer hoy?
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => onSelectMode('consultas')}
                className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-750 border-2 border-zinc-700 hover:border-indigo-500'
                    : 'bg-white hover:bg-indigo-50 border-2 border-indigo-200 hover:border-indigo-400 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isDark ? 'bg-indigo-500' : 'bg-indigo-600'
                }`} />

                <div className="relative">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark
                      ? 'bg-indigo-600 group-hover:bg-indigo-500'
                      : 'bg-indigo-500 group-hover:bg-indigo-600'
                  } transition-colors duration-300`}>
                    <MessageSquare className="w-10 h-10 text-white" />
                  </div>

                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-indigo-900'
                  }`}>
                    Consultas
                  </h3>

                  <p className={`text-base ${
                    isDark ? 'text-gray-400' : 'text-indigo-700'
                  }`}>
                    Realiza consultas generales, obtén ayuda con tus dudas y accede a información sobre tus tickets existentes.
                  </p>
                </div>
              </button>

              <button
                onClick={() => onSelectMode('tickets')}
                className={`group relative overflow-hidden rounded-3xl p-8 transition-all duration-300 transform hover:scale-105 ${
                  isDark
                    ? 'bg-zinc-800 hover:bg-zinc-750 border-2 border-zinc-700 hover:border-emerald-500'
                    : 'bg-white hover:bg-emerald-50 border-2 border-indigo-200 hover:border-emerald-400 shadow-lg hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${
                  isDark ? 'bg-emerald-500' : 'bg-emerald-600'
                }`} />

                <div className="relative">
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
                    isDark
                      ? 'bg-emerald-600 group-hover:bg-emerald-500'
                      : 'bg-emerald-500 group-hover:bg-emerald-600'
                  } transition-colors duration-300`}>
                    <TicketPlus className="w-10 h-10 text-white" />
                  </div>

                  <h3 className={`text-2xl font-bold mb-3 ${
                    isDark ? 'text-white' : 'text-indigo-900'
                  }`}>
                    Agregar Tickets
                  </h3>

                  <p className={`text-base ${
                    isDark ? 'text-gray-400' : 'text-indigo-700'
                  }`}>
                    Crea nuevos tickets de soporte, reporta problemas y gestiona solicitudes administrativas.
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
