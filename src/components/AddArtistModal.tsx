import { useState } from 'react';
import { X, Link, User } from 'lucide-react';

interface AddArtistModalProps {
  onAdd: (name: string, url: string) => void;
  onClose: () => void;
}

export default function AddArtistModal({ onAdd, onClose }: AddArtistModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Введите имя артиста');
      return;
    }

    if (!url.trim()) {
      setError('Введите ссылку на страницу артиста');
      return;
    }

    if (!url.match(/music\.yandex\.ru\/artist\/\d+/)) {
      setError('Ссылка должна быть в формате: https://music.yandex.ru/artist/XXXXXX');
      return;
    }

    onAdd(name.trim(), url.trim());
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-[#16161f] border border-white/10 rounded-2xl w-full max-w-md mx-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h3 className="text-lg font-bold">Добавить артиста</h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs text-white/40 mb-2 block flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Имя артиста
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Например: Скриптонит"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-400/50 transition-colors placeholder:text-white/20"
              autoFocus
            />
          </div>

          <div>
            <label className="text-xs text-white/40 mb-2 block flex items-center gap-1.5">
              <Link className="w-3.5 h-3.5" />
              Ссылка на Яндекс Музыку
            </label>
            <input
              type="text"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://music.yandex.ru/artist/123456"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-yellow-400/50 transition-colors placeholder:text-white/20"
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
              {error}
            </p>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:opacity-90 transition-all"
            >
              Добавить
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition-all"
            >
              Отмена
            </button>
          </div>
        </form>

        {/* Hint */}
        <div className="px-6 pb-5">
          <p className="text-[11px] text-white/30 text-center">
            ID артиста будет определён автоматически из ссылки
          </p>
        </div>
      </div>
    </div>
  );
}
