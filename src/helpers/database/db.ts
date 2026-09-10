import { SongMetaData } from "../../context/AudioContext";

async function openDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const request = indexedDB.open("MusicDatabase", 1);

    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("playlistSongs")) {
        const store = db.createObjectStore("playlistSongs", {
          keyPath: "songId",
          autoIncrement: true,
        });
        store.createIndex("playlistId", "playlistId", {
          unique: false,
        });
      }

      if (!db.objectStoreNames.contains("playlists")) {
        const store = db.createObjectStore("playlists", {
          keyPath: "playlistId",
          autoIncrement: true,
        });
      }

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

interface DBFile {
  metadata: SongMetaData;
  file: File;
}

// Read DB using queries [Most for debugging]
export async function readDB(): Promise<DBFile[]> {
  return new Promise((res, rej) => {
    const transaction = db.transaction("likedSongs", "readonly");
    const store = transaction.objectStore("likedSongs");
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

export async function loadDB(
  setDB: React.Dispatch<React.SetStateAction<DBFile[] | null>>,
  read: boolean,
) {
  const dbFiles = await readDB();
  if (!dbFiles.length) {
    setDB(dbFiles);
    console.log("No saved songs found.. returning");
    return;
  }
  if (read) {
    setDB(dbFiles);
  } else {
    setDB((prev) => [...(prev || []), ...dbFiles]);
  }
}

export async function removeFromDB(song: any): Promise<void> {
  console.log(song);
  return new Promise((res, rej) => {
    const transaction = db.transaction("likedSongs", "readwrite");
    const store = transaction.objectStore("likedSongs");
    const req = store.delete(song.id);

    req.onsuccess = () => {
      res();
    };
    req.onerror = () => {
      rej(req.error);
    };
  });
}

export async function clearDB() {
  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");

  store.clear();
}
