'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Check, Trash2, User, Loader2, Sparkles, QrCode, Link as LinkIcon, Pencil, X, Settings } from 'lucide-react';
import { parseShoppingItem, ParsedItem } from '@/lib/parser';
import { useSuggestions } from '@/hooks/useSuggestions';
import { AnimatedListItem, AnimatedContainer } from '@/components/animated-list-item';
import { SwipeableItem } from '@/components/swipeable-item';
import { SyncIndicator } from '@/components/sync-indicator';
import { useTranslation } from '@/lib/i18n';
import { useTheme } from '@/lib/useTheme';

const CATEGORIES = [
  { id: 'Fruits & Légumes', label: 'Fruits & Légumes', emoji: '🥦' },
  { id: 'Produits Laitiers & Oeufs', label: 'Produits Laitiers & Oeufs', emoji: '🥛' },
  { id: 'Boucherie & Poissonnerie', label: 'Boucherie & Poissonnerie', emoji: '🥩' },
  { id: 'Boulangerie & Pâtisserie', label: 'Boulangerie & Pâtisserie', emoji: '🍞' },
  { id: 'Épicerie Salée & Sucrée', label: 'Épicerie Salée & Sucrée', emoji: '🍝' },
  { id: 'Boissons', label: 'Boissons', emoji: '🥤' },
  { id: 'Hygiène & Beauté', label: 'Hygiène & Beauté', emoji: '🧼' },
  { id: 'Entretien & Maison', label: 'Entretien & Maison', emoji: '🧽' },
  { id: 'Divers', label: 'Divers', emoji: '📦' }
];

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
  
  // Inline title editing and sharing states
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // List management states
  const [currentUser, setCurrentUser] = useState<{ id: string; username: string } | null>(null);
  const [showManageModal, setShowManageModal] = useState(false);
  const [transferTarget, setTransferTarget] = useState('');
  const [manageSuccessMsg, setManageSuccessMsg] = useState('');
  const [manageErrorMsg, setManageErrorMsg] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Sorting and Editing states
  const [isSortedByRayon, setIsSortedByRayon] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [editName, setEditName] = useState('');
  const [editQty, setEditQty] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editCategory, setEditCategory] = useState('');
  
  // iOS Dynamic Title shrink on scroll
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load current user session
  useEffect(() => {
    let isMounted = true;
    const fetchUser = async () => {
      try {
        const resp = await fetch('/api/auth/status');
        if (resp.ok && isMounted) {
          const data = await resp.json();
          if (data.authenticated) {
            setCurrentUser(data.user);
          }
        }
      } catch (err) {
        console.error('Error fetching current user status:', err);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
    };
  }, []);

  // Live queries: automatically reload list and list items on change
  const list = useLiveQuery(() => db.shoppingLists.get(listId));
  const items = useLiveQuery(async () => {
    const allItems = await db.listItems.toArray();
    return allItems.filter((item) => item.listId === listId);
  });

  // Live query for article references (to fetch global categories)
  const articlesList = useLiveQuery(() => db.articles.toArray());

  // Create article category map
  const articleCategoryMap = new Map<string, string>();
  articlesList?.forEach(art => {
    if (art.category) {
      articleCategoryMap.set(art.name.toLowerCase(), art.category);
    }
  });

  // Collaborative assignment handler ("Je prends")
  const handleToggleAssign = async (item: any) => {
    if (!currentUser) return;
    const isAssignedToMe = item.assignedTo === currentUser.username;
    try {
      await db.listItems.update(item.id, {
        assignedTo: isAssignedToMe ? undefined : currentUser.username
      });
    } catch (error) {
      console.error('Error toggling assignment:', error);
    }
  };

  // Start editing modal states
  const handleStartEdit = (item: any) => {
    setEditingItem(item);
    setEditName(item.name);
    setEditQty(item.quantity !== undefined && item.quantity !== null ? String(item.quantity) : '');
    setEditPrice(item.price !== undefined && item.price !== null ? String(item.price) : '');
    
    // Look up category
    const cat = articleCategoryMap.get(item.name.toLowerCase()) || 'Divers';
    setEditCategory(cat);
  };

  // Save changes from editing modal
  const handleSaveItemEdit = async () => {
    if (!editingItem || !editName.trim()) return;
    try {
      const parsedPrice = editPrice.trim() ? parseFloat(editPrice.replace(',', '.')) : undefined;
      
      // Update list item details
      await db.listItems.update(editingItem.id, {
        name: editName.trim(),
        quantity: editQty.trim() || undefined,
        price: isNaN(parsedPrice as number) ? undefined : parsedPrice,
      });

      // Update or create article reference for categories and price lookup
      const allArticles = await db.articles.toArray();
      const existing = allArticles.find(a => a.name.toLowerCase() === editName.trim().toLowerCase());
      
      if (existing && existing.id) {
        await db.articles.update(existing.id, {
          category: editCategory,
          lastPrice: isNaN(parsedPrice as number) ? undefined : parsedPrice,
          lastSeen: new Date()
        });
      } else {
        await db.articles.add({
          name: editName.trim(),
          category: editCategory,
          lastPrice: isNaN(parsedPrice as number) ? undefined : parsedPrice,
          createdAt: new Date(),
          frequency: 1
        });
      }

      setEditingItem(null);
    } catch (error) {
      console.error('Error saving item edits:', error);
    }
  };

  // DRY helper to render standard Active Item card layout
  const renderActiveItemCard = (item: any, index: number) => {
    return (
      <AnimatedListItem key={item.id} index={index}>
        <SwipeableItem onDelete={() => deleteItem(item.id!)}>
          <Card className="theme-card hover:bg-slate-900/40 relative overflow-hidden transition-all duration-300">
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3.5">
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
                
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 ${
                      theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-lg'
                    }`}
                    onClick={() => handleStartEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 ${
                      theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-lg'
                    }`}
                    onClick={() => deleteItem(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Collaborative "Je prends" row */}
              {currentUser && (
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2.5 mt-0.5">
                  <span className="text-[11px] text-slate-400 font-medium select-none">
                    {articleCategoryMap.get(item.name.toLowerCase()) ? (
                      <span className="bg-slate-800/40 border border-slate-700/30 px-2.5 py-0.5 rounded text-indigo-300 font-semibold text-[10px]">
                        {CATEGORIES.find(c => c.id === articleCategoryMap.get(item.name.toLowerCase()))?.emoji || '📦'} {articleCategoryMap.get(item.name.toLowerCase())}
                      </span>
                    ) : (
                      <span className="bg-slate-800/40 border border-slate-700/30 px-2.5 py-0.5 rounded text-slate-400 italic text-[10px]">
                        📦 Divers
                      </span>
                    )}
                  </span>
                  {item.assignedTo === currentUser.username ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleAssign(item)}
                      className="h-7 px-3 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Moi</span>
                    </Button>
                  ) : item.assignedTo ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleAssign(item)}
                      className="h-7 px-3 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-full text-xs font-medium flex items-center gap-1.5 transition-all duration-200"
                      title="Prendre cet article"
                    >
                      <User className="w-3 h-3 text-indigo-400" />
                      <span className="truncate max-w-[80px]">{item.assignedTo}</span>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleAssign(item)}
                      className="h-7 px-3 bg-slate-800/40 hover:bg-slate-800 text-indigo-400 hover:text-indigo-300 rounded-full border border-indigo-500/20 border-dashed text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Je prends</span>
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </SwipeableItem>
      </AnimatedListItem>
    );
  };

  // Auto-healing owner & auto-registering collaborator presence
  useEffect(() => {
    if (!items || !currentUser) return;

    const metaItems = items.filter(item => item.name.startsWith('__kaino_meta:'));
    const ownerItemExists = metaItems.find(item => item.name.startsWith('__kaino_meta:owner:'));
    const ownerName = ownerItemExists ? ownerItemExists.name.replace('__kaino_meta:owner:', '') : null;

    if (!ownerItemExists) {
      // Auto-assign the first visitor as the owner
      const initialOwner = currentUser.username || 'admin';
      db.listItems.add({
        listId,
        name: `__kaino_meta:owner:${initialOwner}`,
        completed: true,
        createdAt: new Date(),
        addedBy: 'system'
      }).catch(err => {
        console.error('Failed to auto-heal/create list owner metadata:', err);
      });
    } else if (ownerName && ownerName !== currentUser.username) {
      // Register current user as a collaborator
      const collabItemExists = metaItems.some(item => item.name === `__kaino_meta:collab:${currentUser.username}`);
      if (!collabItemExists) {
        db.listItems.add({
          listId,
          name: `__kaino_meta:collab:${currentUser.username}`,
          completed: true,
          createdAt: new Date(),
          addedBy: 'system'
        }).catch(err => {
          console.error('Failed to auto-register list collaborator presence:', err);
        });
      }
    }
  }, [items, currentUser, listId]);
  
  const { suggestions } = useSuggestions(newItem, 5);

  useEffect(() => {
    if (list) {
      document.title = `${list.name} - Kaino`;
      // Synchroniser le titre édité lors du chargement initial
      if (!isEditingTitle) {
        setEditedTitle(list.name);
      }
    }
  }, [list, isEditingTitle]);

  const saveTitle = async () => {
    if (!editedTitle.trim() || !list) return;
    try {
      await db.shoppingLists.update(listId, { name: editedTitle.trim() });
      setIsEditingTitle(false);
    } catch (error) {
      console.error('Error updating list name:', error);
    }
  };

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/lists/${listId}`;
    }
    return '';
  };

  const copyShareLink = () => {
    const shareUrl = getShareUrl();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopyFeedback(true);
        setTimeout(() => setCopyFeedback(false), 2000);
      }).catch(err => {
        console.error('Failed to copy share link:', err);
      });
    }
  };

  const handleRenameList = async () => {
    if (!editedTitle.trim() || !list) return;
    try {
      await db.shoppingLists.update(listId, { name: editedTitle.trim() });
      setManageSuccessMsg(t('rename_btn') + ' ok');
      setTimeout(() => setManageSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error renaming list:', error);
      setManageErrorMsg('Erreur lors du renommage');
    }
  };

  const handleDeleteList = async () => {
    const confirmDelete = window.confirm(t('delete_confirm'));
    if (!confirmDelete) return;
    
    setIsDeleting(true);
    try {
      // Delete all list items (both products and meta)
      const allItems = await db.listItems.toArray();
      const itemsToDelete = allItems.filter(item => item.listId === listId);
      for (const item of itemsToDelete) {
        if (item.id) {
          await db.listItems.delete(item.id);
        }
      }
      
      // Delete the list itself
      await db.shoppingLists.delete(listId);
      
      setShowManageModal(false);
      router.push('/');
    } catch (error) {
      console.error('Error deleting list:', error);
      alert('Erreur lors de la suppression de la liste');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTransferOwnership = async () => {
    if (!transferTarget || !currentUser) return;
    
    const confirmTransfer = window.confirm(`Voulez-vous vraiment transférer la propriété à ${transferTarget} ?`);
    if (!confirmTransfer) return;
    
    try {
      const allItems = await db.listItems.toArray();
      const metaItems = allItems.filter(item => item.listId === listId && item.name.startsWith('__kaino_meta:'));
      
      // Delete existing owner item(s)
      const ownerItems = metaItems.filter(item => item.name.startsWith('__kaino_meta:owner:'));
      for (const item of ownerItems) {
        if (item.id) await db.listItems.delete(item.id);
      }
      
      // Delete target's collaborator item
      const targetCollabItems = metaItems.filter(item => item.name === `__kaino_meta:collab:${transferTarget}`);
      for (const item of targetCollabItems) {
        if (item.id) await db.listItems.delete(item.id);
      }
      
      // Create new owner item
      await db.listItems.add({
        listId,
        name: `__kaino_meta:owner:${transferTarget}`,
        completed: true,
        createdAt: new Date(),
        addedBy: 'system'
      });
      
      // Add current user as collaborator
      await db.listItems.add({
        listId,
        name: `__kaino_meta:collab:${currentUser.username}`,
        completed: true,
        createdAt: new Date(),
        addedBy: 'system'
      });
      
      setManageSuccessMsg(t('transfer_success'));
      setTransferTarget('');
      setTimeout(() => {
        setManageSuccessMsg('');
        setShowManageModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error transferring ownership:', error);
      setManageErrorMsg('Erreur lors du transfert de propriété');
    }
  };

  const handleDistributeEquitably = async () => {
    if (!currentUser || !items) return;
    try {
      setManageSuccessMsg('');
      setManageErrorMsg('');

      const productItems = items.filter((item) => !item.name.startsWith('__kaino_meta:'));
      const metadataItems = items.filter((item) => item.name.startsWith('__kaino_meta:'));

      const collaboratorUsernames = metadataItems
        .filter((item) => item.name.startsWith('__kaino_meta:collab:'))
        .map((item) => item.name.replace('__kaino_meta:collab:', ''));

      const ownerItem = metadataItems.find((item) => item.name.startsWith('__kaino_meta:owner:'));
      const ownerUsername = ownerItem ? ownerItem.name.replace('__kaino_meta:owner:', '') : null;

      // 1. Gather all unique active participants
      const allPeople = new Set<string>();
      const activeOwner = ownerUsername || currentUser.username;
      allPeople.add(activeOwner);
      collaboratorUsernames.forEach((username) => allPeople.add(username));
      productItems.forEach((item) => {
        if (item.assignedTo) {
          allPeople.add(item.assignedTo);
        }
      });

      const participants = Array.from(allPeople);

      // Helper to compute item cost
      const getItemCost = (item: any) => {
        const qty = typeof item.quantity === 'number' ? item.quantity : (parseFloat(item.quantity as string) || 1);
        return (item.price || 0) * qty;
      };

      // 2. Compute total cost of all product items
      const totalCost = productItems.reduce((sum, item) => sum + getItemCost(item), 0);
      const idealShare = totalCost / Math.max(1, participants.length);

      // 3. Track totals per participant
      const participantTotals: Record<string, number> = {};
      participants.forEach((p) => {
        participantTotals[p] = 0;
      });

      const assignedItems: any[] = [];
      const unassignedItems: any[] = [];

      productItems.forEach((item) => {
        if (item.assignedTo && participants.includes(item.assignedTo)) {
          participantTotals[item.assignedTo] += getItemCost(item);
          assignedItems.push(item);
        } else {
          unassignedItems.push(item);
        }
      });

      // 4. Sort unassigned items by cost descending for fair greedy division
      unassignedItems.sort((a, b) => getItemCost(b) - getItemCost(a));

      const updates: { id: string; assignedTo: string }[] = [];

      // 5. Distribute remaining items
      unassignedItems.forEach((item) => {
        const cost = getItemCost(item);

        // Find participant with lowest total
        let lowestParticipant = participants[0] || activeOwner;
        let lowestTotal = participantTotals[lowestParticipant] || 0;

        participants.forEach((p) => {
          const tVal = participantTotals[p] || 0;
          if (tVal < lowestTotal) {
            lowestParticipant = p;
            lowestTotal = tVal;
          }
        });

        // Rule: If assigning this item to the lowest participant makes them exceed the ideal share,
        // it goes to the owner.
        const wouldExceed = (lowestTotal + cost) > idealShare;

        if (wouldExceed) {
          participantTotals[activeOwner] = (participantTotals[activeOwner] || 0) + cost;
          updates.push({ id: item.id, assignedTo: activeOwner });
        } else {
          participantTotals[lowestParticipant] = (participantTotals[lowestParticipant] || 0) + cost;
          updates.push({ id: item.id, assignedTo: lowestParticipant });
        }
      });

      // 6. Persist updates to db
      for (const update of updates) {
        await db.listItems.update(update.id, {
          assignedTo: update.assignedTo
        });
      }

      setManageSuccessMsg('Les articles ont été répartis équitablement !');
      setTimeout(() => setManageSuccessMsg(''), 3000);
    } catch (error) {
      console.error('Error distributing items:', error);
      setManageErrorMsg('Erreur lors de la répartition');
    }
  };


  const renderEditableTitle = (textSizeClass: string = "text-2xl font-bold") => {
    if (!list) return null;
    if (isEditingTitle && isOwner) {
      return (
        <div className="flex items-center gap-1.5 max-w-full">
          <Input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveTitle();
              if (e.key === 'Escape') {
                setEditedTitle(list.name);
                setIsEditingTitle(false);
              }
            }}
            className="bg-slate-800/80 border-indigo-500 text-slate-100 px-3 py-1 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-[14px] font-semibold h-8 w-44"
            autoFocus
          />
          <Button variant="ghost" size="icon" onClick={saveTitle} className="h-7 w-7 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 hover:text-emerald-300 rounded-md shrink-0">
            <Check className="h-4 w-4" />
          </Button>
        </div>
      );
    }
    
    return (
      <div 
        className="flex items-center gap-1.5 group cursor-pointer select-none max-w-full"
        onDoubleClick={() => isOwner && setIsEditingTitle(true)}
        title={isOwner ? t('edit_title_tooltip') : undefined}
      >
        <h1 className={`${textSizeClass} text-slate-100 tracking-tight leading-tight truncate max-w-[170px] sm:max-w-md`}>
          {list.name}
        </h1>
        {isOwner && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditingTitle(true)}
            className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-white/10 rounded-full shrink-0 transition-opacity"
          >
            <Pencil className="h-3 w-3 text-indigo-400" />
          </Button>
        )}
      </div>
    );
  };

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
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground transition-colors duration-300">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 dark:text-indigo-400" />
          <div className="text-muted-foreground font-medium animate-pulse">{t('initialization')}</div>
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

  const productItems = items?.filter(item => !item.name.startsWith('__kaino_meta:')) || [];
  const metadataItems = items?.filter(item => item.name.startsWith('__kaino_meta:')) || [];

  const activeItems = productItems.filter(item => !item.completed);
  const completedItems = productItems.filter(item => item.completed);
  
  // Extract collaborators and owner details
  const collaboratorUsernames = metadataItems
    .filter(item => item.name.startsWith('__kaino_meta:collab:'))
    .map(item => item.name.replace('__kaino_meta:collab:', ''));
    
  const ownerItem = metadataItems.find(item => item.name.startsWith('__kaino_meta:owner:'));
  const ownerUsername = ownerItem ? ownerItem.name.replace('__kaino_meta:owner:', '') : null;
  const isOwner = !ownerUsername || (currentUser && ownerUsername === currentUser.username);

  // Scoped collaborators lists for transfer ownership
  const collaborators = collaboratorUsernames.filter(username => currentUser && username !== currentUser.username);

  // Compute organic peopleCount
  const allPeople = new Set<string>();
  if (ownerUsername) allPeople.add(ownerUsername);
  collaboratorUsernames.forEach(username => allPeople.add(username));
  productItems.forEach(item => {
    if (item.assignedTo) {
      allPeople.add(item.assignedTo);
    }
  });
  const peopleCount = Math.max(1, allPeople.size);

  // Calculate dynamic list statistics & budget
  const totalItems = productItems.length;
  const completedCount = completedItems.length;
  const totalBudget = productItems.reduce((sum, item) => {
    const qty = typeof item.quantity === 'number' ? item.quantity : (parseFloat(item.quantity as string) || 1);
    return sum + ((item.price || 0) * qty);
  }, 0);

  // Group active items by category for "Trier par rayon" view
  const groupedActiveItems: Record<string, typeof activeItems> = {};
  if (isSortedByRayon) {
    CATEGORIES.forEach(cat => {
      groupedActiveItems[cat.id] = [];
    });
    
    activeItems.forEach(item => {
      const categoryName = articleCategoryMap.get(item.name.toLowerCase()) || 'Divers';
      if (groupedActiveItems[categoryName]) {
        groupedActiveItems[categoryName].push(item);
      } else {
        groupedActiveItems['Divers'].push(item);
      }
    });
  }

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
                    {renderEditableTitle("text-3xl font-extrabold")}
                    <SyncIndicator compact peopleCount={peopleCount} />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    ID: {list.shareId} • {totalBudget > 0 ? `${totalBudget.toFixed(2)}€` : `${totalItems} items`}
                  </p>
                </div>
              )}
              
              {/* iOS style share actions */}
              <div className="flex items-center gap-1.5 shrink-0">
                {isOwner && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setShowManageModal(true)} 
                    className="hover:bg-white/10 rounded-full h-9 w-9 text-indigo-400"
                    title={t('manage_list_btn')}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowQrModal(true)} 
                  className="hover:bg-white/10 rounded-full h-9 w-9 text-indigo-400"
                  title={t('qr_code_btn')}
                >
                  <QrCode className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={copyShareLink} 
                  className="hover:bg-white/10 rounded-full h-9 w-9 text-indigo-400 relative"
                  title={t('copy_link_btn')}
                >
                  {copyFeedback ? (
                    <Check className="h-5 w-5 text-emerald-400" />
                  ) : (
                    <LinkIcon className="h-5 w-5" />
                  )}
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* ==========================================
           2. SAMSUNG ONE UI 1/3 TOP STATS ZONE
           ========================================== */}
        {theme === 'theme-samsung' && (
          <section className="bg-gradient-to-b from-indigo-950/20 to-transparent pt-12 pb-6 px-6 max-w-2xl mx-auto text-left select-none">
            <div className="flex justify-between items-center">
              <Button variant="ghost" size="icon" onClick={() => router.push('/')} className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full h-11 w-11 shadow">
                <ArrowLeft className="h-5 w-5 text-indigo-300" />
              </Button>
              
              {/* Samsung style share actions */}
              <div className="flex items-center gap-2">
                {isOwner && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowManageModal(true)} 
                    className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full text-indigo-300 flex items-center gap-1.5 px-4 h-11 shadow font-semibold text-xs transition-all duration-200"
                  >
                    <Settings className="h-4 w-4" />
                    <span>{t('manage_list_btn')}</span>
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowQrModal(true)} 
                  className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full text-indigo-300 flex items-center gap-1.5 px-4 h-11 shadow font-semibold text-xs transition-all duration-200"
                >
                  <QrCode className="h-4 w-4" />
                  <span>{t('qr_code_btn')}</span>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyShareLink} 
                  className="bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 rounded-full text-indigo-300 flex items-center gap-1.5 px-4 h-11 shadow font-semibold text-xs transition-all duration-200"
                >
                  {copyFeedback ? (
                    <Check className="h-4 w-4 text-emerald-400 animate-in zoom-in-50" />
                  ) : (
                    <LinkIcon className="h-4 w-4" />
                  )}
                  <span>{copyFeedback ? t('share_link_copied') : t('copy_link_btn')}</span>
                </Button>
              </div>
            </div>
            
            {/* Giant Title 1/3 height allocation */}
            <div className="mt-8 space-y-2">
              <div className="flex items-center gap-3">
                {renderEditableTitle("text-4xl font-extrabold")}
                <SyncIndicator compact peopleCount={peopleCount} />
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
                  {renderEditableTitle("text-2xl font-bold")}
                  <SyncIndicator compact peopleCount={peopleCount} />
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  ID: {list.shareId} {totalBudget > 0 && `• ${totalBudget.toFixed(2)}€`}
                </p>
              </div>
            </div>
            
            {/* Standard sharing buttons */}
            <div className="flex items-center gap-2">
              {isOwner && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowManageModal(true)} 
                  className={`${theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-none'} border border-slate-800 flex items-center gap-1.5 px-3 h-10 text-xs font-semibold`}
                >
                  <Settings className="h-4 w-4 text-indigo-400" />
                  <span>{t('manage_list_btn')}</span>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowQrModal(true)} 
                className={`${theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-none'} border border-slate-800 flex items-center gap-1.5 px-3 h-10 text-xs font-semibold`}
              >
                <QrCode className="h-4 w-4 text-indigo-400" />
                <span>{t('qr_code_btn')}</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyShareLink} 
                className={`${theme === 'theme-android' ? 'rounded-full ripple' : 'rounded-none'} border border-slate-800 flex items-center gap-1.5 px-3 h-10 text-xs font-semibold`}
              >
                {copyFeedback ? (
                  <Check className="h-4 w-4 text-emerald-400 animate-in zoom-in-50" />
                ) : (
                  <LinkIcon className="h-4 w-4 text-indigo-400" />
                )}
                <span>{copyFeedback ? t('share_link_copied') : t('copy_link_btn')}</span>
              </Button>
            </div>
          </header>
        )}

        {/* ==========================================
           MAIN CONTENT BODY (COLLABORATIVE ITEMS LIST)
           ========================================== */}
        <div className="max-w-2xl mx-auto px-4 mt-4">
          <div className="space-y-3">
            {/* Header / Active items title & Toggle */}
            <div className="flex justify-between items-center mb-4 pl-2 pr-2">
              <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest">
                Articles ({activeItems.length})
              </h2>
              {activeItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsSortedByRayon(!isSortedByRayon)}
                  className="h-8 px-3 bg-slate-800/40 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 rounded-full border border-slate-700/50 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200"
                >
                  <span>{isSortedByRayon ? 'Vue classique' : 'Trier par rayon'}</span>
                </Button>
              )}
            </div>

            {isSortedByRayon ? (
              // Grouped view by Rayon
              <div className="space-y-6">
                {CATEGORIES.map(cat => {
                  const catItems = groupedActiveItems[cat.id] || [];
                  if (catItems.length === 0) return null;
                  
                  return (
                    <div key={cat.id} className="space-y-2.5 animate-in fade-in duration-300">
                      <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-widest pl-2 flex items-center gap-2">
                        <span className="text-sm select-none">{cat.emoji}</span>
                        <span>{cat.label}</span>
                        <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[10px] font-bold">
                          {catItems.length}
                        </span>
                      </h3>
                      <div className="space-y-3">
                        {catItems.map((item, index) => renderActiveItemCard(item, index))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Standard View
              <div className="space-y-3">
                {activeItems.map((item, index) => renderActiveItemCard(item, index))}
              </div>
            )}

            {completedItems.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xs font-semibold text-indigo-300 uppercase tracking-widest pl-2 mb-3">
                  {t('list_completed_section')} ({completedItems.length})
                </h2>
                <div className="space-y-3">
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
                            <div className="flex items-center gap-1 shrink-0">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg"
                                onClick={() => handleStartEdit(item)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg"
                                onClick={() => deleteItem(item.id!)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </SwipeableItem>
                    </AnimatedListItem>
                  ))}
                </div>
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

        {/* QR Code Glassmorphic Modal */}
        {showQrModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900/90 border border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-3xl max-w-sm w-full p-6 relative animate-in zoom-in-95 duration-200 flex flex-col items-center">
              
              {/* Close button top right */}
              <button 
                onClick={() => setShowQrModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1.5 rounded-full transition-colors animate-in duration-300"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title */}
              <h2 className="text-xl font-bold text-slate-100 tracking-tight mt-2 mb-1">
                {t('qr_code_title')}
              </h2>
              
              {/* Description */}
              <p className="text-xs text-slate-400 px-4 mb-6 text-center">
                {t('qr_code_desc')}
              </p>

              {/* QR Code Container with sleek glow */}
              <div className="relative p-4 bg-white rounded-2xl shadow-inner mb-6 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(getShareUrl())}`} 
                  alt="List QR Code" 
                  className="w-[180px] h-[180px]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 w-full mt-2">
                <Button 
                  onClick={copyShareLink}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl py-2 font-semibold text-sm flex items-center justify-center gap-1.5 w-full transition-all duration-200"
                >
                  {copyFeedback ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span>{t('share_link_copied')}</span>
                    </>
                  ) : (
                    <>
                      <LinkIcon className="h-4 w-4" />
                      <span>{t('copy_link_btn')}</span>
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setShowQrModal(false)}
                  className="text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl py-2 font-semibold text-sm w-full"
                >
                  {t('close')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* List Management Glassmorphic Modal */}
        {showManageModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900/90 border border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-3xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
              
              {/* Close button top right */}
              <button 
                onClick={() => {
                  setShowManageModal(false);
                  setManageSuccessMsg('');
                  setManageErrorMsg('');
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-4 mt-2">
                <Settings className="h-5 w-5 text-indigo-400 animate-spin duration-1000" />
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                  {t('manage_list_title')}
                </h2>
              </div>
              
              <div className="space-y-6">
                {/* 1. Rename Section */}
                <div className="space-y-2 p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    {t('new_list_label_name')}
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="bg-slate-900/80 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                    />
                    <Button 
                      onClick={handleRenameList}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 font-semibold text-sm transition-all duration-200"
                    >
                      {t('rename_btn')}
                    </Button>
                  </div>
                </div>

                {/* 2. Transfer Ownership Section */}
                <div className="space-y-2 p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    {t('transfer_ownership_label')}
                  </label>
                  
                  {collaborators.length > 0 ? (
                    <div className="flex gap-2">
                      <select
                        value={transferTarget}
                        onChange={(e) => setTransferTarget(e.target.value)}
                        className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                      >
                        <option value="">-- Choisir un collaborateur --</option>
                        {collaborators.map((username) => (
                          <option key={username} value={username}>
                            {username}
                          </option>
                        ))}
                      </select>
                      <Button 
                        onClick={handleTransferOwnership}
                        disabled={!transferTarget}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-4 font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {t('transfer_ownership_btn')}
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">
                      {t('no_collaborators')}
                    </p>
                  )}
                </div>

                {/* 3. Fair Distribution Section */}
                <div className="space-y-2.5 p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Répartition équitable
                  </label>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Calcule la part idéale par personne et répartit automatiquement les articles restants (non assignés) entre les participants. Les choix manuels restent inchangés. Les surplus éventuels sont attribués au propriétaire.
                  </p>
                  <Button 
                    onClick={handleDistributeEquitably}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl py-2 w-full font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-950/20"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span>Distribuer équitablement</span>
                  </Button>
                </div>

                {/* 4. Danger Zone / Delete Section */}
                <div className="space-y-2 p-4 bg-rose-950/10 border border-rose-500/20 rounded-2xl">
                  <label className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
                    Zone de danger
                  </label>
                  <p className="text-xs text-slate-400">
                    Cette action supprimera définitivement la liste et tous ses articles associés de manière irréversible.
                  </p>
                  <Button 
                    onClick={handleDeleteList}
                    disabled={isDeleting}
                    className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl py-2 font-semibold text-sm w-full transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Suppression en cours...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        <span>{t('delete_list_btn')}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Status messages */}
              {manageSuccessMsg && (
                <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-center text-xs font-semibold animate-in fade-in duration-200">
                  {manageSuccessMsg}
                </div>
              )}
              {manageErrorMsg && (
                <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-center text-xs font-semibold animate-in fade-in duration-200">
                  {manageErrorMsg}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Item Edit Glassmorphic Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-slate-900/90 border border-slate-700/50 backdrop-blur-xl shadow-2xl rounded-3xl max-w-md w-full p-6 relative animate-in zoom-in-95 duration-200">
              
              {/* Close button top right */}
              <button 
                onClick={() => setEditingItem(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 p-1.5 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Header */}
              <div className="flex items-center gap-2 mb-4 mt-2">
                <Pencil className="h-5 w-5 text-indigo-400" />
                <h2 className="text-xl font-bold text-slate-100 tracking-tight">
                  Modifier l&apos;article
                </h2>
              </div>
              
              <div className="space-y-4">
                {/* Product Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Nom de l&apos;article
                  </label>
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                    placeholder="Ex: Baguette, Lait..."
                  />
                </div>

                {/* Quantity & Price Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                      Quantité / Nombre
                    </label>
                    <Input
                      type="text"
                      value={editQty}
                      onChange={(e) => setEditQty(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      placeholder="Ex: 3, 500g..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                      Prix (€)
                    </label>
                    <Input
                      type="text"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="bg-slate-800/50 border-slate-700 text-slate-100 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl"
                      placeholder="Ex: 1.50"
                    />
                  </div>
                </div>

                {/* Category Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
                    Rayon / Catégorie
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 text-slate-100 rounded-xl px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 outline-none"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.emoji} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button 
                  variant="ghost" 
                  onClick={() => setEditingItem(null)}
                  className="flex-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 rounded-xl font-semibold text-sm py-2.5"
                >
                  Annuler
                </Button>
                <Button 
                  onClick={handleSaveItemEdit}
                  disabled={!editName.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm py-2.5 transition-all duration-200 disabled:opacity-50"
                >
                  Enregistrer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatedContainer>
  );
}
