import { useState, useEffect, useCallback } from 'react';
import { ViewMode, Artist, Statistic, LogEntry, Settings } from './types';
import { initializeStore, getArtists, getStatistics, getLogs, getSettings, saveSettings, addArtist, deleteArtist, toggleArtistActive, simulateCollection, exportToCSV, resetStore, updateArtist } from './store';
import Dashboard from './components/Dashboard';
import ArtistDetail from './components/ArtistDetail';
import LogsPage from './components/LogsPage';
import SettingsPage from './components/SettingsPage';
import AnalyticsPage from './components/AnalyticsPage';
import AddArtistModal from './components/AddArtistModal';
import Sidebar from './components/Sidebar';
import { Menu } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<ViewMode>('dashboard');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [settings, setSettings] = useState<Settings>(getSettings());
  const [showAddModal, setShowAddModal] = useState(false);
  const [collectionResult, setCollectionResult] = useState<{ success: number; errors: number; errorArtists: string[] } | null>(null);
  const [isCollecting, setIsCollecting] = useState(false);

  const refreshData = useCallback(() => {
    setArtists(getArtists());
    setStatistics(getStatistics());
    setLogs(getLogs());
    setSettings(getSettings());
  }, []);

  useEffect(() => {
    initializeStore();
    refreshData();
  }, [refreshData]);

  const handleAddArtist = (name: string, url: string) => {
    const idMatch = url.match(/\/artist\/(\d+)/);
    addArtist({
      name,
      yandexUrl: url,
      yandexArtistId: idMatch ? idMatch[1] : '',
      active: true,
    });
    refreshData();
    setShowAddModal(false);
  };

  const handleDeleteArtist = (id: string) => {
    deleteArtist(id);
    refreshData();
    if (selectedArtistId === id) {
      setSelectedArtistId(null);
      setView('dashboard');
    }
  };

  const handleToggleArtist = (id: string) => {
    toggleArtistActive(id);
    refreshData();
  };

  const handleUpdateArtist = (id: string, updates: Partial<Artist>) => {
    updateArtist(id, updates);
    refreshData();
  };

  const handleCollect = async () => {
    setIsCollecting(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    const result = simulateCollection();
    setCollectionResult(result);
    refreshData();
    setIsCollecting(false);
    setTimeout(() => setCollectionResult(null), 5000);
  };

  const handleExport = (artistId?: string) => {
    const csv = exportToCSV(artistId);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ym_listeners_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSaveSettings = (newSettings: Settings) => {
    saveSettings(newSettings);
    setSettings(newSettings);
  };

  const handleReset = () => {
    resetStore();
    refreshData();
  };

  const handleViewArtist = (id: string) => {
    setSelectedArtistId(id);
    setView('artist');
  };

  const getArtistStats = (artistId: string): Statistic[] => {
    return statistics
      .filter(s => s.artistId === artistId)
      .sort((a, b) => new Date(a.collectedAt).getTime() - new Date(b.collectedAt).getTime());
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-['Inter',sans-serif] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        view={view}
        setView={(v) => { setView(v); setSidebarOpen(false); }}
        onCollect={handleCollect}
        isCollecting={isCollecting}
        onAddArtist={() => setShowAddModal(true)}
        isOpen={sidebarOpen}
      />

      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-xl bg-[#12121a] border border-white/10 lg:hidden"
      >
        <Menu className="w-5 h-5" />
      </button>

      <main className="flex-1 lg:ml-64 p-4 pt-16 lg:pt-8 lg:p-8 overflow-auto">
        {collectionResult && (
          <div className={`mb-6 p-4 rounded-xl border ${
            collectionResult.errors > 0 
              ? 'bg-yellow-500/10 border-yellow-500/30' 
              : 'bg-green-500/10 border-green-500/30'
          } animate-fadeIn`}>
            <div className="flex items-center gap-3">
              <span className="text-2xl">{collectionResult.errors > 0 ? '⚠️' : '✅'}</span>
              <div>
                <p className="font-semibold">Сбор завершён</p>
                <p className="text-sm opacity-70">
                  Успешно: {collectionResult.success} артистов
                  {collectionResult.errors > 0 && `, Ошибки: ${collectionResult.errors}`}
                </p>
                {collectionResult.errorArtists.length > 0 && (
                  <p className="text-sm text-yellow-400 mt-1">
                    Не удалось: {collectionResult.errorArtists.join(', ')}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'dashboard' && (
          <Dashboard
            artists={artists}
            statistics={statistics}
            onViewArtist={handleViewArtist}
            onDeleteArtist={handleDeleteArtist}
            onToggleArtist={handleToggleArtist}
            onExport={handleExport}
          />
        )}

        {view === 'artist' && selectedArtistId && (
          <ArtistDetail
            artist={artists.find(a => a.id === selectedArtistId)!}
            stats={getArtistStats(selectedArtistId)}
            onBack={() => setView('dashboard')}
            onExport={() => handleExport(selectedArtistId)}
          />
        )}

        {view === 'logs' && (
          <LogsPage logs={logs} />
        )}

        {view === 'settings' && (
          <SettingsPage
            settings={settings}
            onSave={handleSaveSettings}
            onReset={handleReset}
          />
        )}

        {view === 'analytics' && (
          <AnalyticsPage
            artists={artists}
            statistics={statistics}
            onViewArtist={handleViewArtist}
          />
        )}
      </main>

      {showAddModal && (
        <AddArtistModal
          onAdd={handleAddArtist}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}
