import { Artist, Statistic, LogEntry, Settings } from './types';
import { demoArtists, demoStatistics, demoLogs } from './data/demo';

const STORAGE_KEYS = {
  artists: 'ym_artists',
  statistics: 'ym_statistics',
  logs: 'ym_logs',
  settings: 'ym_settings',
  initialized: 'ym_initialized',
};

const defaultSettings: Settings = {
  intervalDays: 3,
  telegramEnabled: false,
  telegramToken: '',
  telegramChatId: '',
  notificationThresholdUp: 5,
  notificationThresholdDown: -5,
};

export function initializeStore(): void {
  if (!localStorage.getItem(STORAGE_KEYS.initialized)) {
    localStorage.setItem(STORAGE_KEYS.artists, JSON.stringify(demoArtists));
    localStorage.setItem(STORAGE_KEYS.statistics, JSON.stringify(demoStatistics));
    localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(demoLogs));
    localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(defaultSettings));
    localStorage.setItem(STORAGE_KEYS.initialized, 'true');
  }
}

export function getArtists(): Artist[] {
  const data = localStorage.getItem(STORAGE_KEYS.artists);
  return data ? JSON.parse(data) : [];
}

export function getStatistics(): Statistic[] {
  const data = localStorage.getItem(STORAGE_KEYS.statistics);
  return data ? JSON.parse(data) : [];
}

export function getLogs(): LogEntry[] {
  const data = localStorage.getItem(STORAGE_KEYS.logs);
  return data ? JSON.parse(data) : [];
}

export function getSettings(): Settings {
  const data = localStorage.getItem(STORAGE_KEYS.settings);
  return data ? JSON.parse(data) : defaultSettings;
}

export function saveSettings(settings: Settings): void {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function addArtist(artist: Omit<Artist, 'id' | 'createdAt'>): Artist {
  const artists = getArtists();
  const newArtist: Artist = {
    ...artist,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
  };
  artists.push(newArtist);
  localStorage.setItem(STORAGE_KEYS.artists, JSON.stringify(artists));
  return newArtist;
}

export function updateArtist(id: string, updates: Partial<Artist>): void {
  const artists = getArtists();
  const index = artists.findIndex(a => a.id === id);
  if (index !== -1) {
    artists[index] = { ...artists[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.artists, JSON.stringify(artists));
  }
}

export function deleteArtist(id: string): void {
  const artists = getArtists().filter(a => a.id !== id);
  const stats = getStatistics().filter(s => s.artistId !== id);
  localStorage.setItem(STORAGE_KEYS.artists, JSON.stringify(artists));
  localStorage.setItem(STORAGE_KEYS.statistics, JSON.stringify(stats));
}

export function toggleArtistActive(id: string): void {
  const artists = getArtists();
  const index = artists.findIndex(a => a.id === id);
  if (index !== -1) {
    artists[index].active = !artists[index].active;
    localStorage.setItem(STORAGE_KEYS.artists, JSON.stringify(artists));
  }
}

export function addLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): void {
  const logs = getLogs();
  const newLog: LogEntry = {
    ...entry,
    id: Date.now().toString() + Math.random().toString(36),
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  localStorage.setItem(STORAGE_KEYS.logs, JSON.stringify(logs.slice(0, 500)));
}

export function simulateCollection(): { success: number; errors: number; errorArtists: string[] } {
  const artists = getArtists().filter(a => a.active);
  const allStats = getStatistics();
  let success = 0;
  let errors = 0;
  const errorArtists: string[] = [];

  addLog({ level: 'info', message: 'Начало сбора статистики' });

  artists.forEach(artist => {
    const artistStats = allStats.filter(s => s.artistId === artist.id && s.status === 'success');
    const lastStat = artistStats.sort((a, b) => new Date(b.collectedAt).getTime() - new Date(a.collectedAt).getTime())[0];
    
    const isError = Math.random() < 0.08;
    
    if (isError) {
      errors++;
      errorArtists.push(artist.name);
      addLog({ level: 'error', message: 'Не удалось получить данные: timeout', artistName: artist.name });
    } else {
      const volatility = lastStat ? lastStat.listeners * 0.05 : 5000;
      const change = Math.round((Math.random() - 0.35) * volatility);
      const newListeners = Math.max(1000, (lastStat?.listeners || 50000) + change);
      
      const prevListeners = lastStat?.listeners || null;
      const listenersChange = prevListeners ? newListeners - prevListeners : null;
      const listenersChangePercent = prevListeners
        ? Math.round(((newListeners - prevListeners) / prevListeners) * 10000) / 100
        : null;

      const newStat: Statistic = {
        id: Date.now().toString() + Math.random().toString(36),
        artistId: artist.id,
        collectedAt: new Date().toISOString(),
        listeners: newListeners,
        listenersChange,
        listenersChangePercent,
        status: 'success',
      };

      allStats.push(newStat);
      success++;
      addLog({ level: 'success', message: `${newListeners.toLocaleString('ru-RU')} слушателей`, artistName: artist.name });
    }
  });

  localStorage.setItem(STORAGE_KEYS.statistics, JSON.stringify(allStats));
  addLog({ level: 'info', message: `Сбор завершён. Успешно: ${success}, Ошибки: ${errors}` });

  return { success, errors, errorArtists };
}

export function exportToCSV(artistId?: string, startDate?: string, endDate?: string): string {
  const artists = getArtists();
  let stats = getStatistics().filter(s => s.status === 'success');

  if (artistId) {
    stats = stats.filter(s => s.artistId === artistId);
  }
  if (startDate) {
    stats = stats.filter(s => new Date(s.collectedAt) >= new Date(startDate));
  }
  if (endDate) {
    stats = stats.filter(s => new Date(s.collectedAt) <= new Date(endDate));
  }

  const header = 'Дата,Артист,Слушатели,Изменение,Изменение %\n';
  const rows = stats.map(s => {
    const artist = artists.find(a => a.id === s.artistId);
    const date = new Date(s.collectedAt).toLocaleDateString('ru-RU');
    const name = artist?.name || 'Unknown';
    const listeners = s.listeners;
    const change = s.listenersChange !== null ? s.listenersChange : '';
    const percent = s.listenersChangePercent !== null ? `${s.listenersChangePercent}%` : '';
    return `${date},${name},${listeners},${change},${percent}`;
  });

  return header + rows.join('\n');
}

export function resetStore(): void {
  localStorage.removeItem(STORAGE_KEYS.initialized);
  localStorage.removeItem(STORAGE_KEYS.artists);
  localStorage.removeItem(STORAGE_KEYS.statistics);
  localStorage.removeItem(STORAGE_KEYS.logs);
  localStorage.removeItem(STORAGE_KEYS.settings);
  initializeStore();
}
