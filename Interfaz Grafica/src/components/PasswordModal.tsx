import { useState } from 'react';
import { Lock, X, AlertCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface PasswordModalProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PasswordModal({ onSuccess, onCancel }: PasswordModalProps) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SaulCerraPestañas') {
      onSuccess();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative max-w-md w-full rounded-3xl p-8 shadow-2xl transition-colors ${
        isDark ? 'bg-zinc-800' : 'bg-white'
      }`}>
        <button
          onClick={onCancel}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-colors ${
            isDark
              ? 'hover:bg-zinc-700 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600'
          }`}
        >
          <X className="w-5 h-5" />
        </button>

        <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${
          isDark ? 'bg-emerald-600' : 'bg-emerald-500'
        }`}>
          <Lock className="w-8 h-8 text-white" />
        </div>

        <h2 className={`text-2xl font-bold text-center mb-2 ${
          isDark ? 'text-white' : 'text-gray-900'
        }`}>
          Acceso Restringido
        </h2>

        <p className={`text-center mb-6 ${
          isDark ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Para agregar tickets necesitas permisos de administrador
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa la contraseña"
              autoFocus
              className={`w-full px-4 py-3 rounded-xl border-2 transition-colors outline-none ${
                error
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : isDark
                    ? 'bg-zinc-700 border-zinc-600 text-white placeholder-gray-400 focus:border-emerald-500'
                    : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500'
              }`}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                isDark
                  ? 'bg-zinc-700 hover:bg-zinc-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
              }`}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!password}
              className={`flex-1 px-6 py-3 rounded-xl font-medium transition-colors ${
                !password
                  ? 'opacity-50 cursor-not-allowed bg-emerald-500'
                  : isDark
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-600 text-white'
              }`}
            >
              Confirmar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
