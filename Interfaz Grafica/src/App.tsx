import { useState } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { PasswordModal } from './components/PasswordModal';
import { ChatApp } from './components/ChatApp';

type AppMode = 'welcome' | 'consultas' | 'tickets';

function App() {
  const [mode, setMode] = useState<AppMode>('welcome');
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Función que se pasará al Sidebar (a través de ChatApp)
  const handleGoToWelcome = () => {
    setMode('welcome'); // Esto restablece el modo para mostrar WelcomeScreen
  };

  const handleModeSelect = (selectedMode: 'consultas' | 'tickets') => {
    if (selectedMode === 'tickets') {
      setShowPasswordModal(true);
    } else {
      setMode('consultas');
    }
  };

  const handlePasswordSuccess = () => {
    setShowPasswordModal(false);
    setMode('tickets');
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
  };

  if (mode === 'welcome') {
    return (
      <>
        <WelcomeScreen onSelectMode={handleModeSelect} />
        {showPasswordModal && (
          <PasswordModal
            onSuccess={handlePasswordSuccess}
            onCancel={handlePasswordCancel}
          />
        )}
      </>
    );
  }

  // --- MODIFICACIÓN AQUÍ: Se pasa la función de regreso a ChatApp ---

  if (mode === 'consultas') {
    return (
      <ChatApp
        webhookUrl="http://localhost:5678/webhook/chatbot"
        welcomeMessage="¡Hola! Soy Liam, tu asistente de tickets de soporte. ¿En qué puedo ayudarte hoy?"
        onGoToWelcome={handleGoToWelcome} // ¡NUEVO PROP!
      />
    );
  }

  if (mode === 'tickets') {
    return (
      <ChatApp
        webhookUrl="http://localhost:5678/webhook/ticket"
        welcomeMessage="¡Bienvenido al sistema de tickets! Aquí puedes crear y gestionar nuevos tickets de soporte."
        onGoToWelcome={handleGoToWelcome} // ¡NUEVO PROP!
      />
    );
  }

  return null;
}

export default App;