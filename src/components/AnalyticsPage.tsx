import { Artist, Statistic } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Trophy, Flame, Target } from 'lucide-react';

interface AnalyticsPageProps {
  artists: Artist[];
  statistics: Statistic[];
  onViewArtist: (id: string) => void;
}

export default function AnalyticsPage({ artists, statistics, onViewArtist }: AnalyticsPageProps) {
  const activeArtists = artists.filter(a => a.active);

  // Get latest stats for each artist
  const artistSummaries = activeArtists.map(artist => {
    const stats = statistics
      .filter(s => s.artistId === artist.id && s.status === 'success')
      .sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime());
    
    const latest = stats[0];
    const allListeners = stats.map(s => s.listeners);
    const maxListeners = allListeners.length > 0 ? Math.max(...allListeners) : 0;
    const minListeners = allListeners.length > 0 ? Math.min(...allListeners) : 0;
    
    // 7-day change
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const weekAgoStat = stats.find(s => new Date(s.collectedAt) <= sevenDaysAgo);
    const change7d = weekAgoStat && latest ? latest.listeners - weekAgoStat.listeners : null;
    const change7dPercent = weekAgoStat && latest 
      ? Math.round(((latest.listeners - weekAgoStat.listeners) / weekAgoStat.listeners) * 10000) / 100 
      : null;

    // 30-day change
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthAgoStat = stats.find(s => new Date(s.collectedAt) <= thirtyDaysAgo);
    const change30d = monthAgoStat && latest ? latest.listeners - monthAgoStat.listeners : null;
    const change30dPercent = monthAgoStat && latest 
      ? Math.round(((latest.listeners - monthAgoStat.listeners) / monthAgoStat.listeners) * 10000) / 100 
      : null;

    return {
      artist,
      latest,
      maxListeners,
      minListeners,
      change7d,
      change7dPercent,
      change30d,
      change30dPercent,
      totalMeasurements: stats.length,
    };
  }).filter(s => s.latest);

  // Chart data - top artists by listeners
  const topByListeners = [...artistSummaries]
    .sort((a, b) => (b.latest?.listeners || 0) - (a.latest?.listeners || 0))
    .slice(0, 8);

  const barChartData = topByListeners.map(s => ({
    name: s.artist.name.length > 12 ? s.artist.name.slice(0, 12) + '...' : s.artist.name,
    listeners: s.latest?.listeners || 0,
  }));

  // Growth chart
  const growthData = [...artistSummaries]
    .filter(s => s.change7dPercent !== null)
    .sort((a, b) => (b.change7dPercent || 0) - (a.change7dPercent || 0))
    .slice(0, 8)
    .map(s => ({
      name: s.artist.name.length > 12 ? s.artist.name.slice(0, 12) + '...' : s.artist.name,
      growth: s.change7dPercent || 0,
    }));

  // Top performers
  const topGrowers = [...artistSummaries]
    .filter(s => s.change7dPercent !== null)
    .sort((a, b) => (b.change7dPercent || 0) - (a.change7dPercent || 0))
    .slice(0, 3);

  const topDecliners = [...artistSummaries]
    .filter(s => s.change7dPercent !== null)
    .sort((a, b) => (a.change7dPercent || 0) - (b.change7dPercent || 0))
    .slice(0, 3);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Аналитика</h2>
        <p className="text-white/50 mt-1">Обзор и сравнение артистов</p>
      </div>

      {/* Top performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Лучший рост за 7 дней</h3>
          </div>
          <div className="space-y-3">
            {topGrowers.map((s, i) => (
              <button
                key={s.artist.id}
                onClick={() => onViewArtist(s.artist.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white/20">#{i + 1}</span>
                  <span className="font-medium text-sm">{s.artist.name}</span>
                </div>
                <span className="text-green-400 font-semibold text-sm">
                  +{s.change7dPercent}%
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-red-400" />
            <h3 className="font-semibold">Наибольшее падение</h3>
          </div>
          <div className="space-y-3">
            {topDecliners.map((s, i) => (
              <button
                key={s.artist.id}
                onClick={() => onViewArtist(s.artist.id)}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/5 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-white/20">#{i + 1}</span>
                  <span className="font-medium text-sm">{s.artist.name}</span>
                </div>
                <span className="text-red-400 font-semibold text-sm">
                  {s.change7dPercent}%
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Топ артистов по слушателям</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickFormatter={(v) => (v / 1000).toFixed(0) + 'K'} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(value: number) => [value.toLocaleString('ru-RU'), 'Слушатели']}
                />
                <Bar dataKey="listeners" fill="#facc15" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <h3 className="font-semibold mb-4">Рост за 7 дней (%)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} tickFormatter={(v) => v + '%'} />
                <YAxis type="category" dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  formatter={(value: number) => [value + '%', 'Рост']}
                />
                <Bar dataKey="growth" fill="#4ade80" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Full comparison table */}
      <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            <h3 className="font-semibold text-lg">Сравнение артистов</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Артист</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Слушатели</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">За 7 дней</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">За 30 дней</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Макс</th>
                <th className="text-right px-5 py-3 text-xs uppercase tracking-wider text-white/40 font-medium">Мин</th>
              </tr>
            </thead>
            <tbody>
              {artistSummaries.map(s => (
                <tr 
                  key={s.artist.id} 
                  className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                  onClick={() => onViewArtist(s.artist.id)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                        {s.artist.name.charAt(0)}
                      </div>
                      <span className="font-medium text-sm">{s.artist.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right font-semibold text-sm">
                    {s.latest?.listeners.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {s.change7dPercent !== null ? (
                      <span className={`text-sm font-medium ${s.change7dPercent > 0 ? 'text-green-400' : s.change7dPercent < 0 ? 'text-red-400' : ''}`}>
                        {s.change7dPercent > 0 ? '+' : ''}{s.change7dPercent}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {s.change30dPercent !== null ? (
                      <span className={`text-sm font-medium ${s.change30dPercent > 0 ? 'text-green-400' : s.change30dPercent < 0 ? 'text-red-400' : ''}`}>
                        {s.change30dPercent > 0 ? '+' : ''}{s.change30dPercent}%
                      </span>
                    ) : '—'}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-white/60">
                    {s.maxListeners.toLocaleString('ru-RU')}
                  </td>
                  <td className="px-5 py-4 text-right text-sm text-white/60">
                    {s.minListeners.toLocaleString('ru-RU')}
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
