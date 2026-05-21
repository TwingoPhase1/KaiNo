import { makeElectricContext } from 'electric-sql/react';
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite';

// This will be replaced by the generated client
// For now, we define a minimal structure to allow development
// The user will need to run: npx electric-sql generate
// after starting the postgres and electric services.
import { schema } from './generated/client';

export type Electric = any; // In real usage, this would be the generated Electric type

let electricInstance: Electric | null = null;
let electricPromise: Promise<Electric> | null = null;

export const initElectric = async () => {
  if (electricInstance) return electricInstance;
  if (electricPromise) return electricPromise;

  electricPromise = (async () => {
    try {
      const config = {
        url: process.env.NEXT_PUBLIC_ELECTRIC_URL || 'http://localhost:5133',
        debug: process.env.NODE_ENV === 'development',
      };

      const conn = await ElectricDatabase.init('kaino.db');
      const electric = await electrify(conn, schema, config);
      
      // Establish active shape subscriptions to synchronise postgresql data with local SQLite DB
      if (electric.db) {
        console.log("Establishing shape subscriptions for Electric SQL tables...");
        electric.db.lists.sync().catch((err: any) => console.error("Sync lists failed:", err));
        electric.db.list_items.sync().catch((err: any) => console.error("Sync list_items failed:", err));
        electric.db.article_references.sync().catch((err: any) => console.error("Sync article_references failed:", err));
        electric.db.admin_users.sync().catch((err: any) => console.error("Sync admin_users failed:", err));
      }
      
      electricInstance = electric;
      return electric;
    } catch (error) {
      console.error('Failed to initialize Electric:', error);
      electricPromise = null;
      throw error;
    }
  })();

  return electricPromise;
};

export const getElectric = async () => {
  if (electricInstance) return electricInstance;
  return initElectric();
};
