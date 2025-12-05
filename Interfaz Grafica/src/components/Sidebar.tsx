import { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  FileText,
  Mail,
  Share,
  Download,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Code,
  BarChart,
  PieChart,
  TrendingUp,
  Ticket,
  List,
  History,
  BarChart2,
  HardHat,
  ListChecks,
  User,
  Users,
  UserSquare,
  ListOrdered,
  MapPin,
  Server,
  BookOpen,
  Briefcase,
  Database,
  Home, // Importado para el botón de L.I.A.M.
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface QuerySection {
  title: string;
  icon: React.ElementType;
  queries: Array<{
    label: string;
    text: string;
    icon: React.ElementType;
  }>;
}

interface SidebarProps {
  onQuerySelect: (query: string) => void;
  isDesktopExpanded: boolean;
  onDesktopToggle: () => void;
  // NUEVO: Prop para volver a la pantalla de bienvenida
  onGoToWelcome: () => void;
}

const querySections: QuerySection[] = [
  {
    title: 'Informes',
    icon: FileText,
    queries: [
      { label: 'Enviar por Mail', text: 'Enviame por email un informe de...', icon: Mail },
      { label: 'Subir a Drive', text: 'Subime al Google Drive un informe de...', icon: Share },
      { label: 'Descargar', text: 'Descarga un informe de...', icon: Download },
    ],
  },
  {
    title: 'Consultas',
    icon: HelpCircle,
    queries: [
      { label: 'Tickets Abiertos', text: '¿Cuántos tickets abiertos hay?', icon: HelpCircle },
      { label: 'Urgentes', text: 'Muéstrame los tickets...', icon: AlertTriangle },
      { label: 'Resueltos', text: '¿Cuáles son los tickets resueltos?', icon: CheckCircle },
      { label: 'Técnicos', text: 'Listame todos los técnicos', icon: Code },
      { label: 'Tickets por técnico', text: 'Listame todos los tickets del técnico...', icon: Code },
    ],
  },
  {
    title: 'Estadísticas',
    icon: BarChart,
    queries: [
      { label: 'Resumen General', text: 'Dame un resumen...', icon: BarChart },
      { label: 'Por Prioridad', text: 'Muestra estadísticas...', icon: PieChart },
      { label: 'Por Estado', text: 'Analiza los tickets...', icon: TrendingUp },
    ],
  },
  {
    title: 'Tickets',
    icon: Ticket,
    queries: [
      {
        label: 'Prioridad y Severidad Alta',
        text: 'Ver todos los tickets con prioridad y severidad alta',
        icon: AlertTriangle,
      },
      {
        label: 'Tickets por Estado',
        text: 'Ver los tickets cerrados',
        icon: List,
      },
      {
        label: 'Historial de Ticket',
        text: 'Ver el historial completo del ticket...',
        icon: History,
      },
    ],
  },
  {
    title: 'Recuentos',
    icon: BarChart2,
    queries: [
      {
        label: 'Tickets por Estado',
        text: 'Ver cuántos tickets hay por estado',
        icon: PieChart,
      },
      {
        label: 'Activos por Prioridad',
        text: 'Ver cuántos tickets activos hay por prioridad',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Técnicos',
    icon: HardHat,
    queries: [
      {
        label: 'Estadísticas de Técnico',
        text: 'Ver las estadísticas del técnico 10',
        icon: BarChart,
      },
      {
        label: 'Tickets por Técnico',
        text: 'Ver cuántos tickets tiene asignado cada técnico',
        icon: ListChecks,
      },
      {
        label: 'Datos de Técnico',
        text: 'Ver los datos de un técnico específico',
        icon: User,
      },
    ],
  },
  {
    title: 'Clientes',
    icon: Users,
    queries: [
      {
        label: 'Datos de Cliente',
        text: 'Ver los datos de un cliente específico',
        icon: UserSquare,
      },
      {
        label: 'Tickets por Cliente',
        text: 'Ver cuántos tickets tiene cada cliente',
        icon: ListOrdered,
      },
      {
        label: 'Clientes por Localidad',
        text: 'Ver cuántos clientes hay en Mar del Plata',
        icon: MapPin,
      },
    ],
  },
  {
    title: 'Servicios',
    icon: Server,
    queries: [
      {
        label: 'Servicios Disponibles',
        text: 'Ver los servicios disponibles',
        icon: Server,
      },
      {
        label: 'Servicios Más Reclamados',
        text: 'Ver los servicios más reclamados',
        icon: TrendingUp,
      },
    ],
  },
  {
    title: 'Contratos y BDC',
    icon: BookOpen,
    queries: [
      {
        label: 'Contratos por Cliente',
        text: 'Ver los contratos ordenados por cliente',
        icon: Briefcase,
      },
      {
        label: 'Base de Conocimiento',
        text: 'Ver los conocimientos de los servicios disponibles',
        icon: Database,
      },
    ],
  },
];


export function Sidebar({ onQuerySelect, isDesktopExpanded, onDesktopToggle, onGoToWelcome }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    Informes: true,
  });
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const sidebarRef = useRef<HTMLElement>(null);

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleQueryClick = (query: string) => {
    onQuerySelect(query);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const handleSectionClick = (sectionTitle: string) => {
    if (!isDesktopExpanded && window.innerWidth >= 768) {
      onDesktopToggle();
      setExpandedSections((prev) => ({
        ...prev,
        [sectionTitle]: true,
      }));
    } else {
      toggleSection(sectionTitle);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (window.innerWidth < 768 || !isDesktopExpanded) return;

      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onDesktopToggle();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDesktopExpanded, onDesktopToggle]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed left-4 top-24 z-40 p-2 rounded-lg transition-all ${
          isDark
            ? 'bg-zinc-800 hover:bg-zinc-700 text-teal-600'
            : 'bg-indigo-200 hover:bg-indigo-300 text-indigo-900'
        } md:hidden`}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-24 bottom-0 transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 md:relative md:top-0 z-30
        ${isDesktopExpanded ? 'md:w-64' : 'md:w-20'}
        ${
          isDark
            ? 'bg-zinc-900 border-r border-zinc-800/60'
            : 'bg-indigo-100 border-r border-indigo-200'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* BOTÓN: Volver al Welcome Screen */}
          <div className={`p-4 ${isDesktopExpanded ? '' : 'flex justify-center'}`}>
  <button
    onClick={onGoToWelcome} 
    className={`flex items-center w-full p-2 rounded-lg transition-colors duration-200 ${
      isDark
        ? 'text-gray-400 bg-zinc-800 hover:bg-zinc-700'
        : 'text-indigo-800 bg-indigo-200 hover:bg-indigo-300'
    } ${isDesktopExpanded ? 'justify-start' : 'justify-center'}`}
  >
    <Home className="w-6 h-6 shrink-0" /> {/* ¡Icono de casita aquí! */}
    <span
      className={`text-lg font-bold ml-3 ${
        !isDesktopExpanded && 'hidden'
      }`}
    >
      Inicio {/* ¡Texto cambiado a "Inicio"! */}
    </span>
  </button>
</div>
          {/* FIN BOTÓN */}
          
          <div className={`flex-1 barra p-4 ${isDesktopExpanded ? 'overflow-y-auto' : 'overflow-y-hidden'} overflow-x-hidden
             scrollbar scrollbar-thin scrollbar-track-transparent
             scrollbar-thumb-gray-500/40 hover:scrollbar-thumb-gray-500/70
          `}>
            <h2
              className={`text-sm font-semibold mb-4 px-2 transition-opacity ${
                isDark ? 'text-gray-400' : 'text-indigo-800'
              } ${
                isDesktopExpanded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              CONSULTAS RÁPIDAS
            </h2>

            <div className="space-y-2">
              {querySections.map((section) => (
                <div key={section.title}>
                  <button
                    onClick={() => handleSectionClick(section.title)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      isDark
                        ? 'hover:bg-zinc-800 text-gray-200'
                        : 'hover:bg-indigo-200 text-indigo-900'
                    } ${
                      !isDesktopExpanded && ''
                    }`}
                  >
                    <section.icon className="w-5 h-5 shrink-0" />

                    <span
                      className={`text-sm font-medium flex-1 text-left ml-3 ${
                        !isDesktopExpanded && 'hidden'
                      }`}
                    >
                      {section.title}
                    </span>
                    <ChevronUp
                      className={`w-4 h-4 ${
                        !expandedSections[section.title] && 'rotate-180'
                      } ${!isDesktopExpanded && 'hidden'}`}
                    />
                  </button>

                  {expandedSections[section.title] && isDesktopExpanded && (
                    <div className="mt-1 ml-2 space-y-1 pl-3">
                      {section.queries.map((query) => (
                        <button
                          key={query.label}
                          onClick={() => handleQueryClick(query.text)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center gap-3 ${
                            isDark
                              ? 'text-gray-400 hover:bg-zinc-800/70 hover:text-gray-300'
                              : 'text-indigo-900 hover:bg-indigo-100 hover:text-indigo-600'
                          }`}
                          title={query.text}
                        >
                          <query.icon className="w-4 h-4 shrink-0" />
                          {query.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div
            className={`hidden md:flex p-3 border-t ${
              isDark ? 'border-zinc-900' : 'border-indigo-200'
            } ${
              !isDesktopExpanded && ''
            }`}
          >
            <button
              onClick={onDesktopToggle}
              className={`p-2 rounded-lg w-full flex items-center gap-3 ${
                isDark
                  ? 'hover:bg-zinc-800 text-gray-400'
                  : 'hover:bg-indigo-200 text-indigo-800'
              } ${
                !isDesktopExpanded && ''
              }`}
            >
              {isDesktopExpanded ? (
                <PanelLeftClose className="w-5 h-5 shrink-0" />
              ) : (
                <PanelLeftOpen className="w-5 h-5 shrink-0" />
              )}
              <span className={!isDesktopExpanded ? 'hidden' : ''}>Contraer</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}