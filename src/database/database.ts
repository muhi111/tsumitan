import { type DBSchema, type IDBPDatabase, openDB } from 'idb';

// Word model based on backend structure
export interface Word {
  userID: string;
  word: string;
  meaning: string;
  searchCount: number;
  reviewCount: number;
  correctCount: number;
  wrongCount: number;
  lastReviewed: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Database schema definition
interface TsumitanDB extends DBSchema {
  words: {
    key: [string, string]; // [userID, word] composite key
    value: Word;
    indexes: {
      'by-user': string;
      'by-last-reviewed': Date;
      'by-search-count': number;
    };
  };
}

// Database name and version
const DB_NAME = 'tsumitan-db';
const DB_VERSION = 2;

// Global database instance
let db: IDBPDatabase<TsumitanDB> | null = null;

// Generate a unique user ID for this device/browser
function generateUserID(): string {
  const stored = localStorage.getItem('tsumitan-user-id');
  if (stored) {
    return stored;
  }

  // Generate a new UUID-like ID
  const newID = `user_${Math.random().toString(36).substr(2, 9)}${Date.now().toString(36)}`;
  localStorage.setItem('tsumitan-user-id', newID);
  return newID;
}

// Get the current user ID
export function getUserID(): string {
  return generateUserID();
}

// Initialize the database
export async function initDatabase(): Promise<IDBPDatabase<TsumitanDB>> {
  if (db) {
    return db;
  }

  db = await openDB<TsumitanDB>(DB_NAME, DB_VERSION, {
    upgrade(database) {
      // Create words object store if it doesn't exist
      if (!database.objectStoreNames.contains('words')) {
        const wordsStore = database.createObjectStore('words', {
          keyPath: ['userID', 'word']
        });

        // Create indexes
        wordsStore.createIndex('by-user', 'userID');
        wordsStore.createIndex('by-last-reviewed', 'lastReviewed');
        wordsStore.createIndex('by-search-count', 'searchCount');
      }
    }
  });

  return db;
}

// Get database instance
export async function getDatabase(): Promise<IDBPDatabase<TsumitanDB>> {
  if (!db) {
    return await initDatabase();
  }
  return db;
}
