/**
 * Electric SQL Compatibility Layer
 * 
 * This file provides a Dexie-like API on top of Electric SQL for backward compatibility.
 * It allows existing components to work with minimal changes while using Electric SQL
 * for robust offline-first sync with PostgreSQL.
 */

import { getElectric } from './electric';

// Type definitions (same as before for compatibility)
export interface Article {
  id?: string;
  name: string;
  lastPrice?: number;
  lastSeen?: Date;
  createdAt: Date;
  frequency?: number;
  category?: string;
}


/**
 * Interface representing a system user/administrator.
 * Note: Password authentication has been retired in this v1 implementation.
 * Authentication is fully handled via secure cryptographical WebAuthn Passkeys.
 * `passwordHash` is kept as an empty fallback solely to maintain compatibility with the
 * database schema mappings and offline synchronization layers.
 */
export interface User {
  id?: string;
  username: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
}

export interface ShoppingList {
  id?: string;
  name: string;
  shareId: string;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListItem {
  id?: string;
  listId: string;
  articleId?: string;
  name: string;
  completed: boolean;
  price?: number;
  addedBy?: string;
  createdAt: Date;
  completedAt?: Date;
  quantity?: number | string;
  unit?: string;
  assignedTo?: string;
  order?: number;
}

// Table mapping configuration
const tableMap: Record<string, string> = {
  articles: 'article_references',
  users: 'admin_users',
  shopping_lists: 'lists',
  list_items: 'list_items',
};

// Field mapping configuration
const fieldMap: Record<string, Record<string, string>> = {
  articles: {
    name: 'article_name',
    lastPrice: 'last_price',
    category: 'suggested_category',
    createdAt: 'updated_at',
    lastSeen: 'updated_at',
  },
  users: {
    passwordHash: 'password_hash',
    createdAt: 'created_at',
  },
  shopping_lists: {
    createdAt: 'created_at',
  },
  list_items: {
    listId: 'list_id',
    completed: 'is_checked',
    assignedTo: 'assigned_to',
    createdAt: 'updated_at',
  }
};

function prepareDoc(tableName: string, item: any, isNew: boolean = false) {
  if (!item) return item;
  const doc: any = { ...item };
  if (isNew && !doc.id) doc.id = crypto.randomUUID();

  const prepared: any = {};
  
  if (tableName === 'articles') {
    prepared.id = doc.id;
    prepared.article_name = doc.name;
    prepared.last_price = doc.lastPrice !== undefined ? doc.lastPrice : null;
    prepared.suggested_category = doc.category !== undefined ? doc.category : null;
    prepared.updated_at = doc.lastSeen || doc.createdAt || new Date();
  } else if (tableName === 'users') {
    prepared.id = doc.id;
    prepared.username = doc.username;
    prepared.password_hash = doc.passwordHash || '';
    prepared.created_at = doc.createdAt || new Date();
  } else if (tableName === 'shopping_lists') {
    prepared.id = doc.id;
    prepared.name = doc.name;
    prepared.created_at = doc.createdAt || new Date();
  } else if (tableName === 'list_items') {
    prepared.id = doc.id;
    prepared.list_id = doc.listId;
    prepared.name = doc.name;
    prepared.quantity = doc.quantity !== undefined ? String(doc.quantity) : null;
    prepared.price = doc.price !== undefined ? doc.price : null;
    prepared.assigned_to = doc.assignedTo !== undefined ? doc.assignedTo : null;
    prepared.is_checked = doc.completed !== undefined ? doc.completed : false;
    prepared.updated_at = doc.completedAt || doc.createdAt || new Date();
  } else {
    return doc;
  }

  return prepared;
}

function parseDoc(tableName: string, doc: any) {
  if (!doc) return doc;
  const parsed: any = {};

  if (tableName === 'articles') {
    parsed.id = doc.id;
    parsed.name = doc.article_name;
    parsed.lastPrice = doc.last_price !== null ? doc.last_price : undefined;
    parsed.category = doc.suggested_category !== null ? doc.suggested_category : undefined;
    parsed.createdAt = new Date(doc.updated_at);
    parsed.lastSeen = new Date(doc.updated_at);
    parsed.frequency = 1;
  } else if (tableName === 'users') {
    parsed.id = doc.id;
    parsed.username = doc.username;
    parsed.passwordHash = doc.password_hash;
    parsed.isAdmin = true;
    parsed.createdAt = new Date(doc.created_at);
  } else if (tableName === 'shopping_lists') {
    parsed.id = doc.id;
    parsed.name = doc.name;
    parsed.shareId = doc.id; // use UUID as shareId
    parsed.createdBy = 'admin';
    parsed.createdAt = new Date(doc.created_at);
    parsed.updatedAt = new Date(doc.created_at);
  } else if (tableName === 'list_items') {
    parsed.id = doc.id;
    parsed.listId = doc.list_id;
    parsed.name = doc.name;
    parsed.completed = doc.is_checked;
    parsed.price = doc.price !== null ? doc.price : undefined;
    parsed.quantity = doc.quantity !== null ? doc.quantity : undefined;
    parsed.assignedTo = doc.assigned_to !== null ? doc.assigned_to : undefined;
    parsed.createdAt = new Date(doc.updated_at);
    parsed.completedAt = doc.is_checked ? new Date(doc.updated_at) : undefined;
    parsed.addedBy = 'admin';
  } else {
    return doc;
  }

  return parsed;
}

/**
 * Table interface for compatibility with Electric SQL
 */
class ElectricTable<T> {
  private tableName: string;
  private dbName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.dbName = tableMap[tableName] || tableName;
  }

  private async getClient() {
    const electric = await getElectric();
    return (electric.db as any)[this.dbName];
  }

  async get(id: string): Promise<T | undefined> {
    if (!id) return undefined;
    const client = await this.getClient();
    const doc = await client.findUnique({
      where: { id }
    });
    return parseDoc(this.tableName, doc) as T;
  }

  async add(item: T): Promise<string> {
    const client = await this.getClient();
    const prepared = prepareDoc(this.tableName, item, true);
    const doc = await client.create({
      data: prepared
    });
    return doc.id;
  }

  async put(item: T): Promise<string> {
    const client = await this.getClient();
    const prepared = prepareDoc(this.tableName, item, true);
    const doc = await client.upsert({
      where: { id: (prepared as any).id },
      update: prepared,
      create: prepared
    });
    return doc.id;
  }

  async update(id: string, changes: Partial<T>): Promise<number> {
    const client = await this.getClient();
    await client.update({
      where: { id },
      data: prepareDoc(this.tableName, changes)
    });
    return 1;
  }

  async delete(id: string): Promise<void> {
    const client = await this.getClient();
    await client.delete({
      where: { id }
    });
  }

  async toArray(): Promise<T[]> {
    const client = await this.getClient();
    const docs = await client.findMany();
    return docs.map((doc: any) => parseDoc(this.tableName, doc) as T);
  }

  async count(): Promise<number> {
    const client = await this.getClient();
    return await client.count();
  }

  where(field: string) {
    return new ElectricWhereClause<T>(this.tableName, field);
  }
}

/**
 * WhereClause for compatibility
 */
class ElectricWhereClause<T> {
  private tableName: string;
  private field: string;
  private dbField: string;

  constructor(tableName: string, field: string) {
    this.tableName = tableName;
    this.field = field;
    this.dbField = (fieldMap[tableName] && fieldMap[tableName][field]) || field;
  }

  equals(value: any): ElectricQuery<T> {
    return new ElectricQuery<T>(this.tableName, { [this.dbField]: value });
  }

  equalsIgnoreCase(value: string): ElectricQuery<T> {
    return new ElectricQuery<T>(this.tableName, { [this.dbField]: value });
  }

  startsWith(value: string): ElectricQuery<T> {
    return new ElectricQuery<T>(this.tableName, { [this.dbField]: { startsWith: value } });
  }

  startsWithIgnoreCase(value: string): ElectricQuery<T> {
    return new ElectricQuery<T>(this.tableName, { [this.dbField]: { startsWith: value } });
  }
}

/**
 * Query for compatibility
 */
class ElectricQuery<T> {
  private tableName: string;
  private where: any;

  constructor(tableName: string, where: any) {
    this.tableName = tableName;
    this.where = where;
  }

  private async getClient() {
    const dbName = tableMap[this.tableName] || this.tableName;
    const electric = await getElectric();
    return (electric.db as any)[dbName];
  }

  async first(): Promise<T | undefined> {
    const client = await this.getClient();
    const doc = await client.findFirst({
      where: this.where
    });
    return parseDoc(this.tableName, doc) as T;
  }

  async toArray(): Promise<T[]> {
    const client = await this.getClient();
    const docs = await client.findMany({
      where: this.where
    });
    return docs.map((doc: any) => parseDoc(this.tableName, doc) as T);
  }

  async count(): Promise<number> {
    const client = await this.getClient();
    return await client.count({
      where: this.where
    });
  }

  async sortBy(sortField: string): Promise<T[]> {
    const dbSortField = (fieldMap[this.tableName] && fieldMap[this.tableName][sortField]) || sortField;
    const client = await this.getClient();
    const docs = await client.findMany({
      where: this.where,
      orderBy: {
        [dbSortField]: 'asc'
      }
    });
    return docs.map((doc: any) => parseDoc(this.tableName, doc) as T);
  }
}

// Export database object
export const db = {
  articles: new ElectricTable<Article>('articles'),
  users: new ElectricTable<User>('users'),
  shoppingLists: new ElectricTable<ShoppingList>('shopping_lists'),
  listItems: new ElectricTable<ListItem>('list_items'),
};
