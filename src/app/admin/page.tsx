'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, User, ShoppingList, Article } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, Users, ShoppingBag, Package, ArrowLeft, Loader2, Globe } from 'lucide-react';
import { useTranslation, SUPPORTED_LANGUAGES, LANGUAGE_NAMES, SupportedLanguage } from '@/lib/i18n';

/**
 * AdminDashboard - Premium dashboard for database administration and server settings
 * Fully translated and supports real-time PostgreSQL language settings configuration.
 */
export default function AdminDashboard() {
  const router = useRouter();
  
  // Dynamic Translations
  const { t, loadingTranslations } = useTranslation();

  const [stats, setStats] = useState({
    users: 0,
    lists: 0,
    items: 0,
    articles: 0,
  });
  const [loading, setLoading] = useState(true);
  const [articlesList, setArticlesList] = useState<Article[]>([]);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [shoppingLists, setShoppingLists] = useState<(ShoppingList & { totalItems?: number, completedItems?: number })[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Server settings language state
  const [serverLang, setServerLang] = useState<string>('fr');
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadStats();
    loadServerSettings();
  }, []);

  const loadStats = async () => {
    try {
      const [userCount, listCount, itemCount, articleCount] = await Promise.all([
        db.users.count(),
        db.shoppingLists.count(),
        db.listItems.count(),
        db.articles.count(),
      ]);
      setStats({
        users: userCount,
        lists: listCount,
        items: itemCount,
        articles: articleCount,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
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

  const loadArticles = async () => {
    try {
      const allArticles = await db.articles.toArray();
      setArticlesList(allArticles.sort((a, b) => (b.frequency || 0) - (a.frequency || 0)));
    } catch (error) {
      console.error('Error loading articles:', error);
    }
  };

  const loadUsers = async () => {
    try {
      const allUsers = await db.users.toArray();
      setUsersList(allUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadLists = async () => {
    try {
      const allLists = await db.shoppingLists.toArray();
      const allItems = await db.listItems.toArray();
      
      const listsWithStats = allLists.map(list => {
        const listItems = allItems.filter(i => i.listId === list.id);
        const completed = listItems.filter(i => i.completed).length;
        return {
          ...list,
          totalItems: listItems.length,
          completedItems: completed
        };
      });
      
      setShoppingLists(listsWithStats);
    } catch (error) {
      console.error('Error loading lists:', error);
    }
  };

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
      return;
    }
    setActiveSection(section);
    if (section === 'articles') loadArticles();
    if (section === 'users') loadUsers();
    if (section === 'lists') loadLists();
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
        await db.articles.delete(id);
        loadArticles();
        loadStats();
      } catch (error) {
        console.error('Error deleting article:', error);
      }
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm(t('admin_confirm_delete_user'))) {
      try {
        await db.users.delete(id);
        loadUsers();
        loadStats();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const deleteList = async (id: string) => {
    if (confirm(t('admin_confirm_delete_list'))) {
      try {
        const allItems = await db.listItems.toArray();
        const items = allItems.filter((item) => item.listId === id);
        for (const item of items) {
          if (item.id) await db.listItems.delete(item.id);
        }
        await db.shoppingLists.delete(id);
        loadLists();
        loadStats();
      } catch (error) {
        console.error('Error deleting list:', error);
      }
    }
  };

  if (loadingTranslations) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-400" />
          <div className="text-slate-400 font-medium animate-pulse">{t('initialization')}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center gap-4 py-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('admin_title')}</h1>
        </header>

        {loading ? (
          <div className="text-center py-12">{t('loading')}</div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin_stats_users')}</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.users}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin_stats_active_lists')}</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lists}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin_stats_items_total')}</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.items}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('admin_stats_db_articles')}</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.articles}</div>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-3 mt-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('admin_mgmt_title')}</CardTitle>
                <CardDescription>{t('admin_mgmt_desc')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={() => toggleSection('users')} variant={activeSection === 'users' ? 'default' : 'outline'} className="w-full justify-start">
                  {t('admin_btn_manage_users')}
                </Button>
                <Button onClick={() => toggleSection('lists')} variant={activeSection === 'lists' ? 'default' : 'outline'} className="w-full justify-start">
                  {t('admin_btn_see_all_lists')}
                </Button>
                <Button onClick={() => toggleSection('articles')} variant={activeSection === 'articles' ? 'default' : 'outline'} className="w-full justify-start">
                  {t('admin_btn_manage_nlp_articles')}
                </Button>
                <Button onClick={exportData} variant="outline" className="w-full justify-start">
                  {t('admin_btn_export_data')}
                </Button>
                
                {activeSection === 'articles' && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <h3 className="font-medium mb-4">{t('admin_sec_articles_title')} ({articlesList.length})</h3>
                    {articlesList.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('admin_sec_articles_empty')}</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {articlesList.map(article => (
                          <div key={article.id} className="flex justify-between items-center bg-background p-3 rounded border">
                            <div>
                              <div className="font-medium">{article.name}</div>
                              <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                                <span>{t('frequency')}: {article.frequency || 1}x</span>
                                {article.lastPrice && <span>{t('last_price')}: {article.lastPrice}€</span>}
                              </div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => article.id && deleteArticle(article.id)}
                            >
                              {t('admin_btn_delete')}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeSection === 'users' && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <h3 className="font-medium mb-4">{t('admin_sec_users_title')} ({usersList.length})</h3>
                    {usersList.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('admin_sec_users_empty')}</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {usersList.map(user => (
                          <div key={user.id} className="flex justify-between items-center bg-background p-3 rounded border">
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {user.username} {user.isAdmin && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Admin</span>}
                              </div>
                              <div className="text-xs text-muted-foreground flex gap-3 mt-1">
                                <span>ID: {user.id}</span>
                              </div>
                            </div>
                            {!user.isAdmin && (
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => user.id && deleteUser(user.id)}
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

                {activeSection === 'lists' && (
                  <div className="mt-4 border rounded-md p-4 bg-muted/50">
                    <h3 className="font-medium mb-4">{t('admin_stats_active_lists')} ({shoppingLists.length})</h3>
                    {shoppingLists.length === 0 ? (
                      <p className="text-sm text-muted-foreground">{t('admin_sec_users_empty')}</p>
                    ) : (
                      <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                        {shoppingLists.map(list => (
                          <div key={list.id} className="flex justify-between items-center bg-background p-3 rounded border">
                            <div>
                              <div className="font-medium">{list.name}</div>
                              <div className="text-xs text-muted-foreground flex flex-col gap-1 mt-1">
                                <span>{t('sharing')}: {list.shareId}</span>
                                <span>{t('progress')}: {list.completedItems}/{list.totalItems}</span>
                                <span>{t('created_by')}: {list.createdBy || t('anonyme')}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                variant="secondary" 
                                size="sm"
                                onClick={() => router.push(`/lists/${list.id}`)}
                              >
                                {t('dashboard_lists_open')}
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => list.id && deleteList(list.id)}
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
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-1">
            {/* Premium Server Language Settings Configuration Panel */}
            <Card className="border-slate-700 bg-slate-900/60 backdrop-blur-xl text-slate-100 shadow-xl rounded-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-indigo-300">
                  <Globe className="h-5 w-5" />
                  {t('admin_server_settings_title')}
                </CardTitle>
                <CardDescription className="text-slate-400">
                  {t('admin_server_settings_desc')}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="serverLanguage" className="text-sm font-medium text-slate-300 block">
                    {t('admin_server_language_label')}
                  </label>
                  <div className="flex flex-col gap-3">
                    <select
                      id="serverLanguage"
                      value={serverLang}
                      onChange={(e) => setServerLang(e.target.value)}
                      className="bg-slate-800 border border-slate-700 text-slate-100 rounded-lg p-2.5 w-full focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer font-medium"
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
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all gap-2 w-full"
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
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {t('admin_server_language_desc')}
                  </p>
                </div>
                
                {settingsMessage && (
                  <div className={`text-sm p-3 rounded-lg flex items-center gap-2 border mt-4 ${
                    settingsMessage.type === 'success' 
                      ? 'bg-emerald-950/40 border-emerald-800/40 text-emerald-300' 
                      : 'bg-rose-950/40 border-rose-800/40 text-rose-300'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      settingsMessage.type === 'success' ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    <p className="text-xs font-medium">{settingsMessage.text}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
