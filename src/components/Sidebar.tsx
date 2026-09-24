import { ViewMode } from '../types';
import { 
  LayoutDashboard, 
  BarChart3, 
  FileText, 
  Settings, 
  Plus, 
  RefreshCw,
  Activity
} from 'lucide-react';

interface SidebarProps {
  view: ViewMode;
  setView: (view: ViewMode) => void;
  onCollect: () => void;
  isCollecting: boolean;
  onAddArtist: () => void;
  isOpen?: boolean;
}

export default function Sidebar({ view, setView, onCollect, isCollecting, onAddArtist, isOpen }: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as ViewMode, label: 'Дашборд', icon: LayoutDashboard },
    { id: 'analytics' as ViewMode, label: 'Аналитика', icon: BarChart3 },
    { id: 'logs' as ViewMode, label: 'Логи', icon: FileText },
    { id: 'settings' as ViewMode, label: 'Настройки', icon: Settings },
  ];

  return (
    <aside className={`fixed left-0 top-0 h-full w-64 bg-[#0f0f17] border-r border-white/5 flex flex-col z-50 transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Activity className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="font-bold text-sm leading-tight">YM Monitor</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-wider">Listener Tracker</p>
          </div>
        </div>
      </div>

      {/* Collect Button */}
      <div className="p-4">
        <button
          onClick={onCollect}
          disabled={isCollecting}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-yellow-500/20"
        >
          <RefreshCw className={`w-4 h-4 ${isCollecting ? 'animate-spin' : ''}`} />
          {isCollecting ? 'Сбор...' : 'Собрать данные'}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all ${
              view === item.id
                ? 'bg-white/10 text-white'
                : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Add Artist */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={onAddArtist}
          className="w-full py-3 px-4 border border-dashed border-white/20 text-white/50 rounded-xl flex items-center justify-center gap-2 hover:border-yellow-400/50 hover:text-yellow-400 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Добавить артиста</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-white/5">
        <p className="text-[10px] text-white/30 text-center">
          v1.0 • Yandex Music Monitor
        </p>
      </div>
    </aside>
  );
}
