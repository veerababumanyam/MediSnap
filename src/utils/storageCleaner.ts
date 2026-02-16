/**
 * storageCleaner.ts
 * Utility to clear all browser storage (LocalStorage, SessionStorage, Cache API, IndexedDB)
 * Use this when recovering from QuotaExceededError.
 */

export const clearAllStorage = async () => {
  console.warn("🧹 Starting comprehensive storage cleanup...");

  // 1. Clear LocalStorage
  try {
    localStorage.clear();
    console.log("✓ LocalStorage cleared");
  } catch (e) {
    console.error("Failed to clear LocalStorage", e);
  }

  // 2. Clear SessionStorage
  try {
    sessionStorage.clear();
    console.log("✓ SessionStorage cleared");
  } catch (e) {
    console.error("Failed to clear SessionStorage", e);
  }

  // 3. Clear Cache API (Service Worker Caches)
  try {
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      console.log(`✓ Cleared ${cacheNames.length} Cache API entries`);
    }
  } catch (e) {
    console.error("Failed to clear Cache API", e);
  }

  // 4. Clear IndexedDB (optional, as it requires knowing DB names or deleting all)
  try {
    if ('indexedDB' in window && 'databases' in indexedDB) {
      const dbs = await indexedDB.databases();
      for (const db of dbs) {
        if (db.name) {
          indexedDB.deleteDatabase(db.name);
          console.log(`✓ Deleted IndexedDB: ${db.name}`);
        }
      }
    }
  } catch (e) {
    console.error("Failed to clear IndexedDB", e);
  }

  console.log("✨ Storage cleanup complete. Please reload the page.");
};
