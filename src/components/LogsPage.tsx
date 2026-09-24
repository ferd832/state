import { LogEntry } from '../types';
import { CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

interface LogsPageProps {
  logs: LogEntry[];
}

export default function LogsPage({ logs }: LogsPageProps) {
  const getIcon = (level: string) => {
    switch (level) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getColor = (level: string) => {
    switch (level) {
      case 'success': return 'text-green-400/80';
      case 'error': return 'text-red-400/80';
      case 'warning': return 'text-yellow-400/80';
      default: return 'text-blue-400/80';
    }
  };

  const formatTimestamp = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Логи</h2>
          <p className="text-white/50 mt-1">История работы системы</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-1.5 text-green-400/70">
            <span className="w-2 h-2 rounded-full bg-green-400"></span>
            Успех: {logs.filter(l => l.level === 'success').length}
          </span>
          <span className="flex items-center gap-1.5 text-red-400/70">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Ошибки: {logs.filter(l => l.level === 'error').length}
          </span>
        </div>
      </div>

      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="divide-y divide-white/5">
          {logs.map(log => (
            <div key={log.id} className="px-5 py-3 flex items-start gap-3 hover:bg-white/[0.02] transition-colors">
              <div className="mt-0.5">{getIcon(log.level)}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {log.artistName && (
                    <span className="text-xs font-medium bg-white/5 px-2 py-0.5 rounded-full">
                      {log.artistName}
                    </span>
                  )}
                  <span className={`text-sm ${getColor(log.level)}`}>
                    {log.message}
                  </span>
                </div>
              </div>
              <span className="text-[11px] text-white/30 whitespace-nowrap font-mono">
                {formatTimestamp(log.timestamp)}
              </span>
            </div>
          ))}
        </div>

        {logs.length === 0 && (
          <div className="p-12 text-center text-white/30">
            <p>Нет записей в логах</p>
          </div>
        )}
      </div>
    </div>
  );
}
