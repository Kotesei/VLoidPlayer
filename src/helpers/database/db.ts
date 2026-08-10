async function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const request = indexedDB.open("MusicDatabase", 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("likedSongs")) {
        const store = db.createObjectStore("likedSongs", {
          keyPath: "id",
          autoIncrement: true,
        });

        // Indexes for searching purposes (Not sure if I will use for first release, might leave it for future updates)
        store.createIndex("artist", "artist", {
          unique: false,
        });
        store.createIndex("song_name", "song_name", {
          unique: false,
        });
        store.createIndex("album", "album", {
          unique: false,
        });
      }
    };

    request.onsuccess = () => res(request.result);

    request.onerror = () => rej(request.error);
  });
}

// Start Database
export const db = await openDB();

// Read DB using queries [Most for debugging]
export async function readDB() {
  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");
  const queryAll = store.getAll();
  queryAll.onsuccess = () => console.log(queryAll.result);
}
