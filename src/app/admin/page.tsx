'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart3, Users, ShoppingBag, Package, ArrowLeft, Loader2, Globe, Search, ShieldAlert } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage } from '@/lib/i18n';

/**
 * AdminDashboard - Premium dashboard for database administration and server settings
 * Fully secured via JWT session and real-time direct PostgreSQL queries.
 */
export default function AdminDashboard() {
  const router = useRouter();
  
  // Dynamic Translations
  const { t, loadingTranslations } = useTranslation();

  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    users: 0,
    lists: 0,
    items: 0,
    articles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [articlesList, setArticlesList] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [shoppingLists, setShoppingLists] = useState<any[]>([]);
  
  // Tabbed view and Search filtering states
  const [activeTab, setActiveTab] = useState<'users' | 'lists' | 'articles' | 'settings'>('users');
  const [searchQuery, setSearchQuery] = useState('');

  // Server settings language state
  const [serverLang, setServerLang] = useState<string>('fr');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Load all central PostgreSQL admin metrics and items
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/admin/data');
      if (resp.ok) {
        const data = await resp.json();
        setStats(data.stats || { users: 0, lists: 0, items: 0, articles: 0 });
        setUsersList(data.users || []);
        setShoppingLists(data.shoppingLists || []);
        setArticlesList(data.articles || []);
        setIsAuthorized(true);
      } else if (resp.status === 401 || resp.status === 403) {
        setIsAuthorized(false);
      } else {
        console.error('Failed to load admin dashboard data from server:', resp.statusText);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadServerSettings = async () => {
    try {
      const resp = await fetch('/api/settings');
      if (resp.ok) {
        const data = await resp.json();
        if (data.default_language) {
          setServerLang(data.default_language);
        }
      }
    } catch (error) {
      console.error('Error fetching server settings:', error);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadServerSettings();
  }, []);

  // Reload data periodically or when switching tabs
  useEffect(() => {
    if (isAuthorized) {
      loadDashboardData();
    }
    setSearchQuery('');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const saveServerSettings = async () => {
    setSavingSettings(true);
    setSettingsMessage(null);
    try {
      const resp = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ default_language: serverLang }),
      });
      if (resp.ok) {
        setSettingsMessage({
          text: t('admin_server_language_saved'),
          type: 'success',
        });
      } else {
        const data = await resp.json();
        setSettingsMessage({
          text: data.error || t('admin_server_language_save_error'),
          type: 'error',
        });
      }
    } catch (error) {
      console.error('Error saving server settings:', error);
      setSettingsMessage({
        text: t('admin_server_language_save_error'),
        type: 'error',
      });
    } finally {
      setSavingSettings(false);
    }
  };

  const exportData = async () => {
    try {
      const allArticles = await db.articles.toArray();
      const allUsers = await db.users.toArray();
      const allLists = await db.shoppingLists.toArray();
      const allItems = await db.listItems.toArray();
      
      const data = {
        articles: allArticles,
        users: allUsers,
        shoppingLists: allLists,
        listItems: allItems,
        exportedAt: new Date().toISOString()
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `kaino-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
      alert("Error exporting data");
    }
  };

  const deleteArticle = async (id: string) => {
    if (confirm(t('admin_confirm_delete_article'))) {
      try {
        const resp = await fetch(`/api/admin/data?type=article&id=${id}`, {
          method: 'DELETE',
        });
        if (resp.ok) {
          loadDashboardData();
        } else {
          const data = await resp.json();
          alert(data.error || "Error deleting article");
        }
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm(t('admin_confirm_delete_user'))) {
      try {
        const resp = await fetch(`/api/admin/data?type=user&id=${id}`, {
          method: 'DELETE',
        });
        if (resp.ok) {
          loadDashboardData();
        } else {
          const data = await resp.json();
          alert(data.error || "Error deleting user");
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteList = async (id: string) => {
    if (confirm(t('admin_confirm_delete_list'))) {
      try {
        const resp = await fetch(`/api/admin/data?type=list&id=${id}`, {
          method: 'DELETE',
        });
        if (resp.ok) {
          loadDashboardData();
        } else {
          const data = await resp.json();
          alert(data.error || "Error deleting list");
        }
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  // Real-time client-side search filtering logic
  const filteredUsers = usersList.filter(user => 
    (user.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (user.id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredLists = shoppingLists.filter(list => 
    (list.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.shareId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (list.createdBy || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = articlesList.filter(article => 
    (article.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loadingTranslations || loading && isAuthorized === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
          <div className="text-muted-foreground font-medium animate-pulse">{t('initialization')}</div>
        </div>
      </div>
    );
  }

  // --- PREMIUM ACCESS DENIED SCREEN (GLASSMORPHIC ONE UI STYLE) ---
  if (isAuthorized === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gradient-to-br dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 p-4 text-slate-900 dark:text-slate-100 overflow-hidden relative animate-in fade-in duration-300">
        {/* Decorative ambient animations */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[6000ms]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none animate-pulse duration-[8000ms]" />

        <Card className="w-full max-w-md border-rose-200 dark:border-rose-950/40 bg-white/90 dark:bg-slate-900/70 backdrop-blur-2xl text-slate-900 dark:text-slate-100 shadow-2xl relative overflow-hidden rounded-2xl">
          {/* Top warning stripe */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-400" />
          
          <CardHeader className="text-center pb-4 pt-8">
            <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 shadow-lg shadow-rose-500/5 relative group">
              <ShieldAlert className="h-10 w-10 text-rose-500 dark:text-rose-400 group-hover:scale-110 transition-transform animate-pulse" />
            </div>
            <CardTitle className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-rose-600 to-rose-400 dark:from-rose-400 dark:to-rose-200 bg-clip-text text-transparent">
              {t('admin_denied_title')}
            </CardTitle>
            <CardDescription className="text-slate-500 dark:text-slate-400 mt-3 text-sm px-4 leading-relaxed font-medium">
              {t('admin_denied_desc')}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-8 pt-4">
            <Button 
              onClick={() => router.push('/')}
              className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white shadow-lg transition-all py-6 font-semibold rounded-xl flex items-center justify-center gap-2 border border-slate-700/50"
            >
              <ArrowLeft className="h-5 w-5 animate-pulse" />
              <span>{t('admin_denied_btn')}</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      <div className="max-w-5xl mx-auto p-4 sm:p-6">
        
        {/* Header */}
        <header className="flex items-center gap-4 py-6 border-b border-slate-800/60 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')}
            className="bg-slate-900/60 hover:bg-slate-800 border border-slate-700/40 rounded-full h-10 w-10 shadow"
          >
            <ArrowLeft className="h-5 w-5 text-indigo-400" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {t('admin_title')}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              Gérez les utilisateurs, listes, articles et configurations de Kaino
            </p>
          </div>
        </header>

        {/* Stats Summary Panel */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
          </div>
        ) : (
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{t('admin_stats_users')}</p>
                  <p className="text-xl font-bold text-slate-100 mt-0.5 truncate">{stats.users}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{t('admin_stats_active_lists')}</p>
                  <p className="text-xl font-bold text-slate-100 mt-0.5 truncate">{stats.lists}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                  <Package className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{t('admin_stats_items_total')}</p>
                  <p className="text-xl font-bold text-slate-100 mt-0.5 truncate">{stats.items}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/40 border-slate-800/80 backdrop-blur-md">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 shrink-0">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate">{t('admin_stats_db_articles')}</p>
                  <p className="text-xl font-bold text-slate-100 mt-0.5 truncate">{stats.articles}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab Selection */}
        <div className="bg-slate-900/50 border border-slate-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden p-6">
          <div className="flex border-b border-slate-800/80 pb-4 mb-6 overflow-x-auto gap-2 scrollbar-none">
            <button 
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0 ${
                activeTab === 'users' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Users className="h-4 w-4" />
              <span>{t('admin_tab_users')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('lists')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0 ${
                activeTab === 'lists' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>{t('admin_tab_lists')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('articles')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0 ${
                activeTab === 'articles' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>{t('admin_tab_articles')}</span>
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 shrink-0 ${
                activeTab === 'settings' 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/15' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Globe className="h-4 w-4" />
              <span>{t('admin_tab_settings')}</span>
            </button>
          </div>

          {/* Search bar inside lists */}
          {activeTab !== 'settings' && (
            <div className="relative mb-6">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900/60 border-slate-700/60 text-slate-100 pl-10 pr-4 py-2.5 rounded-xl focus:border-indigo-500 focus:ring-indigo-500 w-full backdrop-blur-md shadow-inner transition-all placeholder:text-slate-500"
              />
            </div>
          )}

          {/* Tab content rendering */}
          {activeTab === 'users' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-200 text-lg">
                  {t('admin_sec_users_title')} ({filteredUsers.length})
                </h3>
              </div>
              {filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                  {t('admin_sec_users_empty')}
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredUsers.map(user => (
                    <div key={user.id} className="flex justify-between items-center bg-slate-950/30 hover:bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 shadow-sm transition-all gap-4">
                      <div>
                        <div className="font-semibold text-slate-200 flex items-center gap-2">
                          {user.username} 
                          {user.isAdmin && <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-bold">Admin</span>}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium select-all">
                          ID: {user.id}
                        </div>
                      </div>
                      {!user.isAdmin && (
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => user.id && deleteUser(user.id)}
                          className="rounded-lg h-8 text-xs font-semibold px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all shrink-0"
                        >
                          {t('admin_btn_delete')}
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'lists' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-200 text-lg">
                  {t('admin_stats_active_lists')} ({filteredLists.length})
                </h3>
              </div>
              {filteredLists.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                  Aucune liste trouvée
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredLists.map(list => (
                    <div key={list.id} className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-slate-950/30 hover:bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 shadow-sm transition-all gap-4">
                      <div>
                        <div className="font-semibold text-slate-200">{list.name}</div>
                        <div className="text-[11px] text-slate-500 mt-1.5 font-medium flex flex-wrap gap-x-4 gap-y-1">
                          <span className="select-all">ID Partage: {list.shareId}</span>
                          <span>Progression: {list.completedItems}/{list.totalItems}</span>
                          <span>Créateur: {list.createdBy || t('anonyme')}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 self-end sm:self-center shrink-0">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => router.push(`/lists/${list.id}`)}
                          className="rounded-lg h-8 text-xs font-semibold px-3 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200"
                        >
                          {t('dashboard_lists_open')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => list.id && deleteList(list.id)}
                          className="rounded-lg h-8 text-xs font-semibold px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all"
                        >
                          {t('admin_btn_delete')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-200 text-lg">
                  {t('admin_sec_articles_title')} ({filteredArticles.length})
                </h3>
              </div>
              {filteredArticles.length === 0 ? (
                <div className="text-center py-8 text-slate-400 bg-slate-950/20 border border-dashed border-slate-800 rounded-xl">
                  {t('admin_sec_articles_empty')}
                </div>
              ) : (
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                  {filteredArticles.map(article => (
                    <div key={article.id} className="flex justify-between items-center bg-slate-950/30 hover:bg-slate-950/50 p-4 rounded-xl border border-slate-800/60 shadow-sm transition-all gap-4">
                      <div>
                        <div className="font-semibold text-slate-200">{article.name}</div>
                        <div className="text-[11px] text-slate-500 mt-1 font-medium flex gap-3">
                          <span>{t('frequency')}: {article.frequency || 1}x</span>
                          {article.lastPrice && <span>{t('last_price')}: {article.lastPrice.toFixed(2)}€</span>}
                        </div>
                      </div>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => article.id && deleteArticle(article.id)}
                        className="rounded-lg h-8 text-xs font-semibold px-3 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white border border-rose-500/20 transition-all shrink-0"
                      >
                        {t('admin_btn_delete')}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Server default language configuration */}
              <Card className="bg-slate-950/20 border-slate-800/80 backdrop-blur-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-slate-200 text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-indigo-400" />
                    {t('admin_server_settings_title')}
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    {t('admin_server_settings_desc')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="serverLanguage" className="text-xs font-semibold text-slate-300 block uppercase tracking-wider">
                      {t('admin_server_language_label')}
                    </label>
                    <div className="flex flex-col gap-3">
                      <select
                        id="serverLanguage"
                        value={serverLang}
                        onChange={(e) => setServerLang(e.target.value)}
                        className="bg-slate-800/80 border border-slate-700/60 text-slate-100 rounded-xl p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer font-semibold text-sm"
                      >
                        {SUPPORTED_LANGUAGES.map((l) => (
                          <option key={l} value={l}>
                            {LANGUAGE_NAMES[l as SupportedLanguage]} ({l.toUpperCase()})
                          </option>
                        ))}
                      </select>
                      <Button
                        onClick={saveServerSettings}
                        disabled={savingSettings}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-indigo-600/20 transition-all gap-2 w-full animate-pulse-slow"
                      >
                        {savingSettings ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            {t('loading')}
                          </>
                        ) : (
                          t('admin_btn_save')
                        )}
                      </Button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-2 leading-relaxed font-medium">
                      {t('admin_server_language_desc')}
                    </p>
                  </div>
                  
                  {settingsMessage && (
                    <div className={`text-sm p-3 rounded-lg flex items-center gap-2 border mt-4 ${
                      settingsMessage.type === 'success' 
                        ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300 animate-in slide-in-from-top-2 duration-200' 
                        : 'bg-rose-950/40 border-rose-800/40 text-rose-300 animate-in slide-in-from-top-2 duration-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        settingsMessage.type === 'success' ? 'bg-emerald-400 animate-ping-slow' : 'bg-rose-400'
                      }`} />
                      <p className="text-xs font-medium">{settingsMessage.text}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Data Exporter card */}
              <Card className="bg-slate-950/20 border-slate-800/80 backdrop-blur-md rounded-xl">
                <CardHeader>
                  <CardTitle className="text-slate-200 text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-indigo-400" />
                    Exporter les données Kaino
                  </CardTitle>
                  <CardDescription className="text-slate-400 text-xs">
                    {"Sauvegardez l'ensemble des données locales (IndexedDB) de l'application."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 font-medium">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {"Cette opération génère un fichier JSON structuré contenant vos comptes d'utilisateurs, vos listes de courses, les articles catalogués par le moteur d'intelligence NLP, et le détail de chaque produit enregistré."}
                    </p>
                    <Button 
                      onClick={exportData} 
                      className="bg-slate-800/60 hover:bg-slate-700/80 text-slate-200 border border-slate-700/60 rounded-xl font-semibold py-2.5 transition-all w-full flex items-center justify-center gap-2 mt-4 shadow-md"
                    >
                      <Package className="h-4 w-4 text-indigo-400" />
                      <span>{t('admin_btn_export_data')}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
