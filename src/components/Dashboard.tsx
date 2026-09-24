import { Artist, Statistic } from '../types';
import { TrendingUp, TrendingDown, Minus, Eye, Trash2, Download, Pause, Play } from 'lucide-react';

interface DashboardProps {
  artists: Artist[];
  statistics: Statistic[];
  onViewArtist: (id: string) => void;
  onDeleteArtist: (id: string) => void;
  onToggleArtist: (id: string) => void;
  onExport: (artistId?: string) => void;
}

export default function Dashboard({ artists, statistics, onViewArtist, onDeleteArtist, onToggleArtist, onExport }: DashboardProps) {
  const getLatestStat = (artistId: string): Statistic | null => {
    const stats = statistics
      .filter(s => s.artistId === artistId && s.status === 'success')
      .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
    return stats[0] || null;
  };

  const activeArtists = artists.filter(a => a.active);
  const inactiveArtists = artists.filter(a => !a.active);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold">Дашборд</h2>
          <p className="text-white/50 mt-1">Мониторинг слушателей артистов</p>
        </div>
        <button
          onClick={() => onExport()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" />
          Экспорт CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Всего артистов</p>
          <p className="text-3xl font-bold">{artists.length}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Активных</p>
          <p className="text-3xl font-bold text-green-400">{activeArtists.length}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Замеров</p>
          <p className="text-3xl font-bold">{statistics.filter(s => s.status === 'success').length}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Ошибок</p>
          <p className="text-3xl font-bold text-red-400">{statistics.filter(s => s.status === 'error').length}</p>
        </div>
      </div>

      {/* Artists Table */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-semibold text-lg">Артисты</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Артист</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Слушатели</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Изменение</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">%</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Последний сбор</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {artists.map(artist => {
                const latestStat = getLatestStat(artist.id);
                return (
                  <tr key={artist.id} className={`border-b border-white/5 hover:bg-white/[0.02] transition-colors ${!artist.active ? 'opacity-40' : ''}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                          {artist.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{artist.name}</p>
                          <p className="text-[11px] text-white/30">ID: {artist.yandexArtistId || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="font-semibold text-sm">
                        {latestStat ? latestStat.listeners.toLocaleString('ru-RU') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {latestStat?.listenersChange !== null && latestStat?.listenersChange !== undefined ? (
                        <span className={`inline-flex items-center gap-1 text-sm font-medium ${
                          latestStat.listenersChange > 0 ? 'text-green-400' : 
                          latestStat.listenersChange < 0 ? 'text-red-400' : 'text-white/50'
                        }`}>
                          {latestStat.listenersChange > 0 ? <TrendingUp className="w-3.5 h-3.5" /> :
                           latestStat.listenersChange < 0 ? <TrendingDown className="w-3.5 h-3.5" /> :
                           <Minus className="w-3.5 h-3.5" />}
                          {latestStat.listenersChange > 0 ? '+' : ''}{latestStat.listenersChange.toLocaleString('ru-RU')}
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {latestStat?.listenersChangePercent !== null && latestStat?.listenersChangePercent !== undefined ? (
                        <span className={`text-sm font-medium ${
                          latestStat.listenersChangePercent > 0 ? 'text-green-400' : 
                          latestStat.listenersChangePercent < 0 ? 'text-red-400' : 'text-white/50'
                        }`}>
                          {latestStat.listenersChangePercent > 0 ? '+' : ''}{latestStat.listenersChangePercent}%
                        </span>
                      ) : (
                        <span className="text-white/30 text-sm">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-sm text-white/50">
                        {latestStat ? new Date(latestStat.collectedAt).toLocaleDateString('ru-RU') : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onViewArtist(artist.id)}
                          className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                          title="Подробнее"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onToggleArtist(artist.id)}
                          className={`p-2 rounded-lg hover:bg-white/10 transition-colors ${artist.active ? 'text-green-400/70 hover:text-green-400' : 'text-white/30 hover:text-white/60'}`}
                          title={artist.active ? 'Отключить' : 'Включить'}
                        >
                          {artist.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Удалить артиста "${artist.name}"?`)) {
                              onDeleteArtist(artist.id);
                            }
                          }}
                          className="p-2 rounded-lg hover:bg-red-500/20 transition-colors text-white/30 hover:text-red-400"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {artists.length === 0 && (
          <div className="p-12 text-center text-white/30">
            <p className="text-lg mb-2">Нет артистов</p>
            <p className="text-sm">Добавьте первого артиста для начала мониторинга</p>
          </div>
        )}
      </div>
    </div>
  );
}
