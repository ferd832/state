import { useState } from 'react';
import { Artist, Statistic } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { ArrowLeft, Download, TrendingUp, TrendingDown, Calendar, Hash } from 'lucide-react';

interface ArtistDetailProps {
  artist: Artist;
  stats: Statistic[];
  onBack: () => void;
  onExport: () => void;
}

type Period = '7' | '30' | '90' | '180' | 'all';

export default function ArtistDetail({ artist, stats, onBack, onExport }: ArtistDetailProps) {
  const [period, setPeriod] = useState<Period>('all');

  const successStats = stats.filter(s => s.status === 'success');
  
  const filteredStats = successStats.filter(s => {
    if (period === 'all') return true;
    const days = parseInt(period);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return new Date(s.collectedAt) >= cutoff;
  });

  const latestStat = successStats[successStats.length - 1];
  const allListeners = successStats.map(s => s.listeners);
  const maxListeners = allListeners.length > 0 ? Math.max(...allListeners) : 0;
  const minListeners = allListeners.length > 0 ? Math.min(...allListeners) : 0;
  const avgListeners = allListeners.length > 0 ? Math.round(allListeners.reduce((a, b) => a + b, 0) / allListeners.length) : 0;

  const maxStat = successStats.find(s => s.listeners === maxListeners);
  
  const changes = successStats.filter(s => s.listenersChange !== null).map(s => s.listenersChange!);
  const avgChange = changes.length > 0 ? Math.round(changes.reduce((a, b) => a + b, 0) / changes.length) : 0;

  const chartData = filteredStats.map(s => ({
    date: new Date(s.collectedAt).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' }),
    fullDate: new Date(s.collectedAt).toLocaleDateString('ru-RU'),
    listeners: s.listeners,
  }));

  const periods: { value: Period; label: string }[] = [
    { value: '7', label: '7 дней' },
    { value: '30', label: '30 дней' },
    { value: '90', label: '3 мес' },
    { value: '180', label: '6 мес' },
    { value: 'all', label: 'Всё время' },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg font-bold">
              {artist.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{artist.name}</h2>
              <a href={artist.yandexUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors">
                {artist.yandexUrl}
              </a>
            </div>
          </div>
        </div>
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-all"
        >
          <Download className="w-4 h-4" />
          CSV
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="w-4 h-4 text-yellow-400" />
            <p className="text-white/40 text-xs uppercase tracking-wider">Текущие</p>
          </div>
          <p className="text-2xl font-bold">{latestStat?.listeners.toLocaleString('ru-RU') || '—'}</p>
          {latestStat?.listenersChangePercent !== null && latestStat?.listenersChangePercent !== undefined && (
            <p className={`text-xs mt-1 ${latestStat.listenersChangePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {latestStat.listenersChangePercent > 0 ? '+' : ''}{latestStat.listenersChangePercent}%
            </p>
          )}
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-white/40 text-xs uppercase tracking-wider">Максимум</p>
          </div>
          <p className="text-2xl font-bold">{maxListeners.toLocaleString('ru-RU')}</p>
          {maxStat && (
            <p className="text-xs text-white/30 mt-1">{new Date(maxStat.collectedAt).toLocaleDateString('ru-RU')}</p>
          )}
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <p className="text-white/40 text-xs uppercase tracking-wider">Минимум</p>
          </div>
          <p className="text-2xl font-bold">{minListeners.toLocaleString('ru-RU')}</p>
        </div>
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-blue-400" />
            <p className="text-white/40 text-xs uppercase tracking-wider">Ср. изменение</p>
          </div>
          <p className={`text-2xl font-bold ${avgChange > 0 ? 'text-green-400' : avgChange < 0 ? 'text-red-400' : ''}`}>
            {avgChange > 0 ? '+' : ''}{avgChange.toLocaleString('ru-RU')}
          </p>
          <p className="text-xs text-white/30 mt-1">Среднее: {avgListeners.toLocaleString('ru-RU')}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-lg">Динамика слушателей</h3>
          <div className="flex gap-1">
            {periods.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p.value
                    ? 'bg-yellow-400/20 text-yellow-400'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorListeners" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#facc15" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#facc15" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="date" 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.2)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                  tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a2e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    padding: '12px',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}
                  itemStyle={{ color: '#facc15', fontSize: '14px', fontWeight: 'bold' }}
                  formatter={(value: number) => [value.toLocaleString('ru-RU'), 'Слушатели']}
                />
                <Area
                  type="monotone"
                  dataKey="listeners"
                  stroke="#facc15"
                  strokeWidth={2.5}
                  fill="url(#colorListeners)"
                  dot={{ fill: '#facc15', strokeWidth: 0, r: 4 }}
                  activeDot={{ fill: '#facc15', strokeWidth: 0, r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-white/30">
              <p>Нет данных для отображения</p>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <h3 className="font-semibold text-lg">История замеров</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Дата</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Слушатели</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Изменение</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">%</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Статус</th>
              </tr>
            </thead>
            <tbody>
              {[...successStats].reverse().map(stat => (
                <tr key={stat.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-5 py-3 text-sm">{new Date(stat.collectedAt).toLocaleDateString('ru-RU')}</td>
                  <td className="px-5 py-3 text-right font-semibold text-sm">{stat.listeners.toLocaleString('ru-RU')}</td>
                  <td className="px-5 py-3 text-right">
                    {stat.listenersChange !== null ? (
                      <span className={`text-sm font-medium ${stat.listenersChange > 0 ? 'text-green-400' : stat.listenersChange < 0 ? 'text-red-400' : ''}`}>
                        {stat.listenersChange > 0 ? '+' : ''}{stat.listenersChange.toLocaleString('ru-RU')}
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    {stat.listenersChangePercent !== null ? (
                      <span className={`text-sm font-medium ${stat.listenersChangePercent > 0 ? 'text-green-400' : stat.listenersChangePercent < 0 ? 'text-red-400' : ''}`}>
                        {stat.listenersChangePercent > 0 ? '+' : ''}{stat.listenersChangePercent}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs ${
                      stat.status === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {stat.status === 'success' ? 'OK' : 'Ошибка'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
