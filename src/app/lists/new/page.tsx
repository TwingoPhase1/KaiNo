'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db, ShoppingList } from '@/lib/db';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Loader2 } from 'lucide-react';
import { generateShareId } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

/**
 * NewList - Premium page to create new shopping lists with collaborative sync
 * Fully translated and clean.
 */
export default function NewList() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Dynamic translations
  const { t, loadingTranslations } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const list: ShoppingList = {
        name,
        shareId: generateShareId(),
        createdBy: 'admin', // Kept for admin profile
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const id = await db.shoppingLists.add(list);
      router.push(`/lists/${id}`);
    } catch (error) {
      console.error('Error creating list:', error);
      alert(t('error_create'));
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto p-4">
        <header className="flex items-center gap-4 py-6">
          <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{t('new_list_title')}</h1>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>{t('new_list_card_title')}</CardTitle>
            <CardDescription>
              {t('new_list_card_desc')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="listName" className="text-sm font-medium">
                  {t('new_list_label_name')}
                </label>
                <Input
                  id="listName"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder={t('new_list_placeholder')}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('new_list_btn_loading')}
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    {t('new_list_btn_create')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
