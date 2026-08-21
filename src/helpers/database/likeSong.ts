import { DBFile } from "../../context/FileContext";

import { db, loadDB, removeFromDB } from "./db";

//////////// IndexedDB ////////////
export async function handleLike(
  dbFile: DBFile | null,
  setDB: React.Dispatch<React.SetStateAction<DBFile[] | null>>,
) {
  if (!dbFile) return;
  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");
  // Gets all songs
  const idQuery = store.getAll();

  idQuery.onsuccess = async () => {
    const songFound = idQuery.result.find(
      (query) =>
        query.file.name === dbFile.file.name &&
        query.file.size === dbFile.file.size,
    );
    // Run unlike logic here
    if (songFound) {
      await removeFromDB(songFound);
    } else {
      // Otherwise like song
      store.put({
        metadata: {
          song_name: dbFile.metadata.song_name,
          artist: dbFile.metadata.artist,
          album: dbFile.metadata.album,
          duration: dbFile.metadata.duration,
          cover_art: dbFile.metadata.coverArt,
        },
        file: dbFile.file,
      });
    }
    loadDB(setDB, true);
  };
}
