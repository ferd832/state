import { Artist, Statistic, LogEntry } from './types';

export const demoArtists: Artist[] = [
  {
    id: '1',
    name: 'YN WIGGA',
    yandexUrl: 'https://music.yandex.ru/artist/714839',
    yandexArtistId: '714839',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '2',
    name: 'Скриптонит',
    yandexUrl: 'https://music.yandex.ru/artist/478563',
    yandexArtistId: '478563',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '3',
    name: 'Miyagi & Andy Panda',
    yandexUrl: 'https://music.yandex.ru/artist/543912',
    yandexArtistId: '543912',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '4',
    name: 'MACAN',
    yandexUrl: 'https://music.yandex.ru/artist/801234',
    yandexArtistId: '801234',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '5',
    name: 'The Limba',
    yandexUrl: 'https://music.yandex.ru/artist/623451',
    yandexArtistId: '623451',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '6',
    name: 'T-Fest',
    yandexUrl: 'https://music.yandex.ru/artist/591234',
    yandexArtistId: '591234',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '7',
    name: 'Big Baby Tape',
    yandexUrl: 'https://music.yandex.ru/artist/678901',
    yandexArtistId: '678901',
    active: true,
    createdAt: '2026-09-01T10:00:00Z',
  },
  {
    id: '8',
    name: 'Matrang',
    yandexUrl: 'https://music.yandex.ru/artist/456789',
    yandexArtistId: '456789',
    active: false,
    createdAt: '2026-09-01T10:00:00Z',
  },
];

function generateStats(artistId: string, baseListeners: number, volatility: number, days: number): Statistic[] {
  const stats: Statistic[] = [];
  let current = baseListeners;
  const startDate = new Date('2026-09-01');

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i * 3);

    const change = Math.round((Math.random() - 0.35) * volatility);
    const prevListeners = current;
    current = Math.max(1000, current + change);

    const prevStat = stats.length > 0 ? stats[stats.length - 1] : null;
    const listenersChange = prevStat ? current - prevStat.listeners : null;
    const listenersChangePercent = prevStat
      ? Math.round(((current - prevStat.listeners) / prevStat.listeners) * 10000) / 100
      : null;

    stats.push({
      id: `${artistId}-${i}`,
      artistId,
      collectedAt: date.toISOString(),
      listeners: current,
      listenersChange,
      listenersChangePercent,
      status: Math.random() > 0.05 ? 'success' : 'error',
      errorMessage: Math.random() > 0.95 ? 'Timeout при получении данных' : undefined,
    });
  }

  return stats;
}

export const demoStatistics: Statistic[] = [
  ...generateStats('1', 51442, 2500, 12),
  ...generateStats('2', 128300, 5000, 12),
  ...generateStats('3', 89200, 4000, 12),
  ...generateStats('4', 215600, 8000, 12),
  ...generateStats('5', 45800, 2000, 12),
  ...generateStats('6', 67300, 3000, 12),
  ...generateStats('7', 38900, 1800, 12),
  ...generateStats('8', 22100, 1200, 12),
];

export const demoLogs: LogEntry[] = [
  { id: '1', timestamp: '2026-09-28T12:00:01Z', level: 'info', message: 'Начало сбора статистики' },
  { id: '2', timestamp: '2026-09-28T12:00:04Z', level: 'success', message: '51 442 слушателей', artistName: 'YN WIGGA' },
  { id: '3', timestamp: '2026-09-28T12:00:08Z', level: 'success', message: '128 300 слушателей', artistName: 'Скриптонит' },
  { id: '4', timestamp: '2026-09-28T12:00:12Z', level: 'success', message: '89 200 слушателей', artistName: 'Miyagi & Andy Panda' },
  { id: '5', timestamp: '2026-09-28T12:00:16Z', level: 'success', message: '215 600 слушателей', artistName: 'MACAN' },
  { id: '6', timestamp: '2026-09-28T12:00:20Z', level: 'success', message: '45 800 слушателей', artistName: 'The Limba' },
  { id: '7', timestamp: '2026-09-28T12:00:24Z', level: 'success', message: '67 300 слушателей', artistName: 'T-Fest' },
  { id: '8', timestamp: '2026-09-28T12:00:28Z', level: 'success', message: '38 900 слушателей', artistName: 'Big Baby Tape' },
  { id: '9', timestamp: '2026-09-28T12:00:32Z', level: 'error', message: 'Не удалось получить данные: timeout', artistName: 'Matrang' },
  { id: '10', timestamp: '2026-09-28T12:00:33Z', level: 'info', message: 'Сбор завершён. Успешно: 7, Ошибки: 1' },
  { id: '11', timestamp: '2026-09-25T12:00:01Z', level: 'info', message: 'Начало сбора статистики' },
  { id: '12', timestamp: '2026-09-25T12:00:04Z', level: 'success', message: '49 105 слушателей', artistName: 'YN WIGGA' },
  { id: '13', timestamp: '2026-09-25T12:00:08Z', level: 'success', message: '125 800 слушателей', artistName: 'Скриптонит' },
  { id: '14', timestamp: '2026-09-25T12:00:12Z', level: 'success', message: '87 500 слушателей', artistName: 'Miyagi & Andy Panda' },
  { id: '15', timestamp: '2026-09-25T12:00:16Z', level: 'success', message: '210 200 слушателей', artistName: 'MACAN' },
  { id: '16', timestamp: '2026-09-25T12:00:20Z', level: 'success', message: '44 900 слушателей', artistName: 'The Limba' },
  { id: '17', timestamp: '2026-09-25T12:00:24Z', level: 'success', message: '65 800 слушателей', artistName: 'T-Fest' },
  { id: '18', timestamp: '2026-09-25T12:00:28Z', level: 'success', message: '38 100 слушателей', artistName: 'Big Baby Tape' },
  { id: '19', timestamp: '2026-09-25T12:00:32Z', level: 'success', message: '22 100 слушателей', artistName: 'Matrang' },
  { id: '20', timestamp: '2026-09-25T12:00:33Z', level: 'info', message: 'Сбор завершён. Успешно: 8, Ошибки: 0' },
];
