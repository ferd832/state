import { useState } from 'react';
import { Settings } from '../types';
import { Save, RotateCcw, Clock, Bell, AlertTriangle } from 'lucide-react';

interface SettingsPageProps {
  settings: Settings;
  onSave: (settings: Settings) => void;
  onReset: () => void;
}

export default function SettingsPage({ settings, onSave, onReset }: SettingsPageProps) {
  const [local, setLocal] = useState<Settings>({ ...settings });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    if (confirm('Сбросить все данные? Это удалит всех артистов, статистику и логи. Будут загружены демо-данные.')) {
      onReset();
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Настройки</h2>
        <p className="text-white/50 mt-1">Конфигурация системы мониторинга</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Interval */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="font-semibold">Интервал сбора</h3>
          </div>
          <p className="text-sm text-white/50 mb-4">Как часто собирать статистику</p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 7, 14].map(days => (
              <button
                key={days}
                onClick={() => setLocal({ ...local, intervalDays: days })}
                className={`py-3 rounded-xl text-sm font-medium transition-all ${
                  local.intervalDays === days
                    ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30'
                    : 'bg-white/5 text-white/50 border border-white/5 hover:bg-white/10'
                }`}
              >
                {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}
              </button>
            ))}
          </div>
        </div>

        {/* Telegram */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h3 className="font-semibold">Telegram уведомления</h3>
            <span className="text-[10px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full uppercase">Скоро</span>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setLocal({ ...local, telegramEnabled: !local.telegramEnabled })}
              className={`relative w-12 h-6 rounded-full transition-all ${
                local.telegramEnabled ? 'bg-yellow-400' : 'bg-white/10'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                local.telegramEnabled ? 'left-7' : 'left-1'
              }`} />
            </button>
            <span className="text-sm text-white/60">{local.telegramEnabled ? 'Включено' : 'Выключено'}</span>
          </div>
          {local.telegramEnabled && (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-white/40 mb-1 block">Bot Token</label>
                <input
                  type="text"
                  value={local.telegramToken}
                  onChange={e => setLocal({ ...local, telegramToken: e.target.value })}
                  placeholder="123456:ABC-DEF..."
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1 block">Chat ID</label>
                <input
                  type="text"
                  value={local.telegramChatId}
                  onChange={e => setLocal({ ...local, telegramChatId: e.target.value })}
                  placeholder="-100123456789"
                  className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-400/50 transition-colors"
                />
              </div>
            </div>
          )}
        </div>

        {/* Notification Thresholds */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            <h3 className="font-semibold">Пороги уведомлений</h3>
          </div>
          <p className="text-sm text-white/50 mb-4">Уведомлять при изменении аудитории больше указанного порога</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-white/40 mb-1 block">Рост (%)</label>
              <input
                type="number"
                value={local.notificationThresholdUp}
                onChange={e => setLocal({ ...local, notificationThresholdUp: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-green-400/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs text-white/40 mb-1 block">Падение (%)</label>
              <input
                type="number"
                value={local.notificationThresholdDown}
                onChange={e => setLocal({ ...local, notificationThresholdDown: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-red-400/50 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? 'Сохранено ✓' : 'Сохранить'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-6 py-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500/20 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Сбросить данные
          </button>
        </div>
      </div>
    </div>
  );
}
