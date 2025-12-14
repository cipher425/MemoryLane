import { openDB } from 'idb';

const DB_NAME = 'memory-lane-db';
const STORE_NAME = 'capsules';

// Open (or create) the database
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

// Get all capsules
export const getAllCapsules = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

// Add or Update a capsule
export const saveCapsuleToDB = async (capsule) => {
  const db = await initDB();
  return db.put(STORE_NAME, capsule);
};


// DELETE a capsule
export const deleteCapsuleFromDB = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};