'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Check, Trash2, Share2, User, Loader2, Sparkles } from 'lucide-react';
import { parseShoppingItem, ParsedItem } from '@/lib/parser';
import { useSuggestions } from '@/hooks/useSuggestions';
import { AnimatedListItem, AnimatedContainer } from '@/components/animated-list-item';
import { SwipeableItem } from '@/components/swipeable-item';
import { SyncIndicator } from '@/components/sync-indicator';
import { useTranslation } from '@/lib/i18n';
import { useTheme } from '@/lib/useTheme';

function useLiveQuery<T>(querier: () => Promise<T>, deps: any[] = []): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);
  
  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const result = await querier();
        if (isMounted) setData(result);
      } catch (err) {
        console.error("LiveQuery Error:", err);
      }
    };
    
    fetchData();
    const intervalId = setInterval(fetchData, 1000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  
  return data;
}

/**
 * ListDetail - Device-Aware Adaptive Shopping List Detail View
 * Responsive structures:
 * - iOS: Collapsible Apple Notes header, bottom glass bar, circular scale checkbox
 * - Samsung One UI: 1/3 top empty zone displaying list name + budget, giant rounded cards, oval autocompletes
 * - Android Pixel: Pill buttons, click-ripple, Floating Action Button (FAB)
 * - Generic Tech: Sharp angulaire edges, monospace fonts, instant transitions
 */
export default function ListDetail() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Device-Aware Theme
  const theme = useTheme();
  
  // Dynamic translations
  const { t, loadingTranslations } = useTranslation();

  const [newItem, setNewItem] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [parsedItem, setParsedItem] = useState<ParsedItem | null>(null);
  
  // iOS Dynamic Title shrink on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Live queries: automatically reload list and list items on change
  const list = useLiveQuery(() => db.shoppingLists.get(listId));
  const items = useLiveQuery(async () => {
    const allItems = await db.listItems.toArray();
    return allItems.filter((item) => item.listId === listId);
  });
  
  const { suggestions } = useSuggestions(newItem, 5);

  useEffect(() => {
    if (list) {
      document.title = `${list.name} - Kaino`;
    }
  }, [list]);

  // NLP parsing in real-time
  useEffect(() => {
    if (newItem.length >= 1) {
      const parsed = parseShoppingItem(newItem);
      setParsedItem(parsed);
      setShowSuggestions(true);
    } else {
      setParsedItem(null);
      setShowSuggestions(false);
    }
  }, [newItem]);

  const addItem = async (input: string) => {
    setNewItem('');
    setShowSuggestions(false);
    setParsedItem(null);

    try {
      const parsed = parseShoppingItem(input);
      const name = parsed.name || input;
      let articleId: string | undefined;

      // Check article DB
      try {
        const allArticles = await db.articles.toArray();
        const existing = allArticles.find(
          (a) => a.name.toLowerCase() === name.toLowerCase()
        );

        if (existing && existing.id) {
          articleId = existing.id;
          await db.articles.update(existing.id, {
            frequency: (existing.frequency || 0) + 1,
            lastPrice: parsed.price || existing.lastPrice,
            lastSeen: new Date(),
          });
        } else {
          articleId = await db.articles.add({
            name,
            lastPrice: parsed.price,
            lastSeen: new Date(),
            createdAt: new Date(),
            frequency: 1,
          });
        }
      } catch (articleError: any) {
        console.error('Error with article lookup/create:', articleError);
      }

      // Insert item
      const currentItems = await db.listItems.toArray();
      const listItemsCount = currentItems.filter(i => i.listId === listId).length;
      
      await db.listItems.add({
        listId,
        articleId,
        name,
        completed: false,
        price: parsed.price,
        quantity: parsed.quantity,
        unit: parsed.unit,
        assignedTo: parsed.assignedTo,
        order: listItemsCount,
        addedBy: 'admin',
        createdAt: new Date(),
      });
    } catch (error: any) {
      console.error('Error adding item:', error);
      alert(t('item_error') + (error?.message || error));
    }
  };

  const toggleComplete = async (itemId: string, completed: boolean) => {
    try {
      await db.listItems.update(itemId, {
        completed,
        completedAt: completed ? new Date() : undefined,
      });
    } catch (error) {
      console.error('Error toggling item:', error);
    }
  };

  const deleteItem = async (itemId: string) => {
    try {
      await db.listItems.delete(itemId);
    } catch (error) {
      console.error('Error deleting item:', error);
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

  if (!list) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-foreground font-semibold">{t('list_not_found')}</div>
      </div>
    );
  }

  const activeItems = items?.filter(item => !item.completed) || [];
  const completedItems = items?.filter(item => item.completed) || [];
  
  // Calculate dynamic list statistics & budget
  const totalItems = items?.length || 0;
  const completedCount = completedItems.length;
  const totalBudget = items?.reduce((sum, item) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : (parseFloat(item.quantity as string) || 1);
    return sum + ((item.price || 0) * qty);
  }, 0) || 0;

  // Trigger floating input focus for Android FAB
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <AnimatedContainer>
      <div className={`min-h-screen bg-background pb-32 ${theme}`}>
        
        {/* ==========================================
           1. iOS STICKY APPLE-STYLE HEADER
           ========================================== */}
        {theme === 'theme-ios' && (
          <header className={`sticky top-0 z-50 transition-all duration-300 ${
            scrolled 
              ? 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 py-3' 
              : 'bg-transparent py-6'
          }`}>
            <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="hover:bg-white/10 rounded-full">
                  <ArrowLeft className="h-5 w-5 text-indigo-400" />
                </Button>
                {scrolled && (
                  <h1 className="text-lg font-bold text-slate-100 tracking-tight animate-in fade-in slide-in-from-top-4 duration-200">
                    {list.name}
                  </h1>
                )}
              </div>
              {!scrolled && (
                <div className="text-left flex-1 pl-2">
                  <div className="flex items-center gap-2">
                    <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">
                      {list.name}
                    </h1>
                    <SyncIndicator />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    ID: {list.shareId} • {totalBudget > 0 ? `${totalBudget.toFixed(2)}€` : `${totalItems} items`}
                  </p>
                </div>
              )}
              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(list.shareId)} className="hover:bg-white/10 rounded-full">
                <Share2 className="h-5 w-5 text-indigo-400" />
              </Button>
            </div>
          </header>
        )}

        {/* ==========================================
           2. SAMSUNG ONE UI 1/3 TOP STATS ZONE
           ========================================== */}
        {theme === 'theme-samsung' && (
          <section className="bg-gradient-to-b from-indigo-950/20 to-transparent pt-12 pb-6 px-6 max-w-2xl mx-auto text-left select-none">
            <div className="flex justify-between items-start">
              <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full h-11 w-11 shadow">
                <ArrowLeft className="h-5 w-5 text-indigo-300" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(list.shareId)} className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full h-11 w-11 shadow">
                <Share2 className="h-5 w-5 text-indigo-300" />
              </Button>
            </div>
            {/* Giant Title 1/3 height allocation */}
            <div className="mt-8 space-y-2">
              <div className="flex items-baseline gap-3">
                <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight leading-none">
                  {list.name}
                </h1>
                <SyncIndicator />
              </div>
              <div className="flex items-center gap-3 pt-2 text-indigo-300 font-medium">
                <span className="bg-indigo-600/20 px-3 py-1 rounded-full text-xs">
                  {completedCount}/{totalItems} {t('list_completed_section').toLowerCase()}
                </span>
                {totalBudget > 0 && (
                  <span className="bg-emerald-600/20 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                    {totalBudget.toFixed(2)} €
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 pt-1">
                ID: {list.shareId}
              </p>
            </div>
          </section>
        )}

        {/* ==========================================
           3. STANDARD ANDROID & GENERIC HEADERS
           ========================================== */}
        {(theme === 'theme-android' || theme === 'theme-generic') && (
          <header className="max-w-2xl mx-auto p-4 flex items-center justify-between py-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => router.push('/')} className={`${theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-none'} border border-slate-800`}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold tracking-tight">{list.name}</h1>
                  <SyncIndicator />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  ID: {list.shareId} {totalBudget > 0 && `• ${totalBudget.toFixed(2)}€`}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => navigator.clipboard.writeText(list.shareId)} className={`${theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-none'} border border-slate-800`}>
              <Share2 className="h-5 w-5" />
            </Button>
          </header>
        )}

        {/* ==========================================
           MAIN CONTENT BODY (COLLABORATIVE ITEMS LIST)
           ========================================== */}
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="space-y-3">
            {activeItems.map((item, index) => (
              <AnimatedListItem key={item.id} index={index}>
                <SwipeableItem onDelete={() => deleteItem(item.id!)}>
                  <Card className="theme-card hover:bg-slate-900/40 relative overflow-hidden transition-all duration-300">
                    <CardContent className="flex items-center gap-3.5 p-4">
                      {/* Dynamic Themed Checkbox */}
                      <label className="theme-checkbox shrink-0">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => toggleComplete(item.id!, true)}
                        />
                        <span className="checkmark">
                          {item.completed && <Check className="h-3.5 w-3.5 text-white animate-in zoom-in-50" />}
                        </span>
                      </label>

                      <div className="flex-1 select-none">
                        <div className="font-semibold text-slate-100 text-[15px] tracking-tight">
                          {item.quantity && (
                            <span className="text-indigo-400 font-bold mr-1.5 bg-indigo-500/10 px-2 py-0.5 rounded text-xs">
                              {item.quantity}{item.unit || ''}
                            </span>
                          )}
                          {item.name}
                          {item.assignedTo && (
                            <span className="ml-2 text-xs bg-slate-800/80 text-indigo-300 border border-slate-700/50 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                              <User className="w-3 h-3 text-indigo-400" />
                              {item.assignedTo}
                            </span>
                          )}
                        </div>
                        {item.price && (
                          <div className="text-xs text-slate-400 mt-1 font-medium flex items-center gap-1.5">
                            <Sparkles className="h-3.5 w-3.5 text-indigo-400/80" />
                            {item.price.toFixed(2)} €
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-9 w-9 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ${
                          theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-lg'
                        }`}
                        onClick={() => deleteItem(item.id!)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </SwipeableItem>
              </AnimatedListItem>
            ))}

            {completedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest pl-2 mb-3">
                  {t('list_completed_section')} ({completedItems.length})
                </h2>
                {completedItems.map((item, index) => (
                  <AnimatedListItem key={item.id} index={index}>
                    <SwipeableItem onDelete={() => deleteItem(item.id!)}>
                      <Card className="theme-card opacity-50 relative overflow-hidden transition-all duration-300 border-dashed">
                        <CardContent className="flex items-center gap-3.5 p-4">
                          <label className="theme-checkbox shrink-0">
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleComplete(item.id!, false)}
                            />
                            <span className="checkmark">
                              <Check className="h-3.5 w-3.5 text-white" />
                            </span>
                          </label>
                          <div className="flex-1 select-none">
                            <div className="font-semibold text-slate-300 line-through text-[15px] tracking-tight">
                              {item.quantity && <span className="mr-1.5 text-xs opacity-75">{item.quantity}{item.unit || ''}</span>}
                              {item.name}
                              {item.assignedTo && <span className="ml-2 text-xs opacity-70 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 border"><User className="w-3 h-3" />{item.assignedTo}</span>}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                            onClick={() => deleteItem(item.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    </SwipeableItem>
                  </AnimatedListItem>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================
           4. ANDROID FLOATING ACTION BUTTON (FAB)
           ========================================== */}
        {theme === 'theme-android' && newItem.trim() === '' && (
          <Button
            onClick={focusInput}
            className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-2xl flex items-center justify-center z-50 ripple scale-in border-none"
          >
            <Plus className="h-6 w-6 text-white" />
          </Button>
        )}

        {/* ==========================================
           THEMED FIXED BOTTOM INPUT INPUT AREA
           ========================================== */}
        <div className={`fixed bottom-0 left-0 right-0 p-4 z-40 transition-all ${
          theme === 'theme-ios' 
            ? 'bg-slate-950/70 backdrop-blur-2xl border-t border-white/10' 
            : theme === 'theme-samsung'
            ? 'bg-slate-900 border-t border-slate-800'
            : 'bg-background border-t border-slate-800'
        }`}>
          <div className="max-w-2xl mx-auto relative">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newItem.trim()) {
                    addItem(newItem.trim());
                  }
                }}
                placeholder={t('list_input_placeholder')}
                className={`flex-1 bg-slate-800/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 ${
                  theme === 'theme-samsung' 
                    ? 'rounded-2xl py-6 pl-4' 
                    : theme === 'theme-android'
                    ? 'rounded-full py-6 pl-5'
                    : 'rounded-lg'
                }`}
              />
              <Button 
                onClick={() => newItem.trim() && addItem(newItem.trim())}
                className={`theme-btn bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow font-semibold gap-1.5 ${
                  theme === 'theme-samsung' 
                    ? 'rounded-2xl px-6' 
                    : theme === 'theme-android'
                    ? 'rounded-full px-6 ripple'
                    : 'rounded-lg'
                }`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Parsed item preview */}
            {parsedItem && parsedItem.name && (
              <div className="mt-2.5 flex gap-2 text-xs font-semibold text-indigo-300">
                {parsedItem.quantity && (
                  <span className="bg-indigo-600/20 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                    {t('qty')}: {parsedItem.quantity}
                  </span>
                )}
                {parsedItem.price && (
                  <span className="bg-indigo-600/20 border border-indigo-500/20 px-2.5 py-1 rounded-md">
                    {t('price')}: {parsedItem.price.toFixed(2)}€
                  </span>
                )}
                {parsedItem.assignedTo && (
                  <span className="bg-indigo-600/20 border border-indigo-500/20 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <User className="h-3 w-3" />
                    {parsedItem.assignedTo}
                  </span>
                )}
              </div>
            )}

            {/* Autocomplete Suggestions */}
            {showSuggestions && suggestions.length > 0 && (
              <div className={`absolute bottom-full left-0 right-0 mb-3 bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden z-50 ${
                theme === 'theme-samsung' 
                  ? 'rounded-3xl p-2' 
                  : theme === 'theme-android'
                  ? 'rounded-2xl p-1.5'
                  : 'rounded-lg'
              }`}>
                {/* One UI large tapable suggestions */}
                {theme === 'theme-samsung' ? (
                  <div className="flex flex-wrap gap-2 p-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        onClick={() => addItem(suggestion.name)}
                        className="bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-full px-5 py-2 text-sm font-semibold flex items-center gap-2 shadow-sm border border-slate-700/50"
                      >
                        <span>{suggestion.name}</span>
                        {suggestion.frequency && suggestion.frequency > 1 && (
                          <span className="bg-indigo-600/30 text-indigo-300 rounded-full text-[10px] px-2 py-0.5">
                            {suggestion.frequency}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                ) : (
                  // Traditional vertical suggestion dropdown for standard/generic
                  <div>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        className={`w-full text-left px-4 py-3 hover:bg-slate-800 flex justify-between items-center border-b border-slate-800 last:border-b-0 ${
                          theme === 'theme-android' ? 'rounded-xl ripple' : ''
                        }`}
                        onClick={() => addItem(suggestion.name)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-200">{suggestion.name}</span>
                          {suggestion.frequency && suggestion.frequency > 1 && (
                            <span className="text-xs bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-bold">
                              {suggestion.frequency}x
                            </span>
                          )}
                        </div>
                        {suggestion.lastPrice && (
                          <span className="text-sm text-slate-400 font-medium">
                            {suggestion.lastPrice.toFixed(2)} €
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedContainer>
  );
}
