import { makeElectricContext } from 'electric-sql/react';
import { ElectricDatabase, electrify } from 'electric-sql/wa-sqlite';
import { insecureAuthToken } from 'electric-sql/auth';

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
      let electricUrl = process.env.NEXT_PUBLIC_ELECTRIC_URL || 'http://localhost:5133';
      
      // Dynamic host resolution ONLY if the configured URL points to localhost (default/development)
      // and we are accessing the app from another device (like a mobile phone on the local network)
      if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const protocol = window.location.protocol; // "http:" or "https:"
        const isLocalhostConfigured = electricUrl.includes('localhost') || electricUrl.includes('127.0.0.1');
        
        if (isLocalhostConfigured && hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
          // Resolve Electric SQL to the same host on port 5133 with the matching protocol (to prevent Mixed Content blocks on HTTPS)
          electricUrl = `${protocol}//${hostname}:5133`;
          console.log(`🔌 Dynamic Local Network Electric SQL URL resolved: ${electricUrl}`);
        }
      }

      const config = {
        url: electricUrl,
        debug: process.env.NODE_ENV === 'development',
      };

      const conn = await ElectricDatabase.init('kaino.db');
      const electric = await electrify(conn, schema, config);
      
      // Connect to the Electric SQL Satellite replication service (required in 0.11 to start sync)
      try {
        const token = insecureAuthToken({ sub: 'kaino-user-session' });
        console.log("🔌 Connecting to Electric SQL Satellite replication service...");
        await electric.connect(token);
        console.log("🔌 Electric SQL Satellite replication is now active!");
      } catch (err: any) {
        console.error("🔌 Failed to connect to Electric Satellite service:", err);
        const errMsg = err?.message || String(err);
        if (errMsg.includes("Unknown schema version") || errMsg.includes("divergence between local client and server")) {
          console.warn("⚠️ Schema mismatch detected! Wiping local IndexedDB 'kaino.db' and auto-reloading...");
          if (typeof window !== 'undefined' && typeof indexedDB !== 'undefined') {
            indexedDB.deleteDatabase("kaino.db");
            setTimeout(() => {
              window.location.reload();
            }, 600);
          }
        }
      }
      
      // Establish active shape subscriptions to synchronise postgresql data with local SQLite DB
      if (electric.db) {
        console.log("Establishing shape subscriptions for Electric SQL tables...");
        electric.db.lists.sync().catch((err: any) => console.error("Sync lists failed:", err));
        electric.db.list_items.sync().catch((err: any) => console.error("Sync list_items failed:", err));
        electric.db.article_references.sync().catch((err: any) => console.error("Sync article_references failed:", err));
        electric.db.admin_users.sync().catch((err: any) => console.error("Sync admin_users failed:", err));
      }

      // Hook the Electric notifier to dispatch a global window event for our useLiveQuery hooks
      if (electric.notifier) {
        electric.notifier.subscribeToDataChanges(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('electric-sync-change'));
          }
        });
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
