export interface Artist {
  id: string;
  name: string;
  yandexUrl: string;
  yandexArtistId: string;
  active: boolean;
  createdAt: string;
  avatar?: string;
}

export interface Statistic {
  id: string;
  artistId: string;
  collectedAt: string;
  listeners: number;
  listenersChange: number | null;
  listenersChangePercent: number | null;
  status: 'success' | 'error';
  errorMessage?: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'success' | 'error' | 'warning';
  message: string;
  artistName?: string;
}

export interface Settings {
  intervalDays: number;
  telegramEnabled: boolean;
  telegramToken: string;
  telegramChatId: string;
  notificationThresholdUp: number;
  notificationThresholdDown: number;
}

export type ViewMode = 'dashboard' | 'artist' | 'logs' | 'settings' | 'analytics';
