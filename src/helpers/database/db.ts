import { SongMetaData } from "../../context/AudioContext";

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
  setDBFiles: React.Dispatch<React.SetStateAction<File[] | null>>,
  setDBMetadata: React.Dispatch<React.SetStateAction<SongMetaData[] | null>>,
  read: boolean,
) {
  const dbFiles = await readDB();
  if (read) {
    const files: File[] = [];
    const metadata: SongMetaData[] = [];
    dbFiles.map((dbFile) => files.push(dbFile.file));
    dbFiles.map((dbFile) => metadata.push(dbFile.metadata));
    setDBFiles(files);
    setDBMetadata(metadata);
  } else {
    dbFiles.map((dbFile) => {
      setDBFiles((prev) => [...(prev || []), dbFile.file]);
      setDBMetadata((prev) => [...(prev || []), dbFile.metadata]);
    });
  }
}

export async function removeFromDB(song: any): Promise<void> {
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
