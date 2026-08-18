import { SongMetaData } from "../../context/AudioContext";
import { DBFile } from "../../context/FileContext";

import { db, loadDB, removeFromDB } from "./db";

//////////// IndexedDB ////////////
export async function handleLike(
  metadata: SongMetaData | null,
  file: File | null,
  setDB: React.Dispatch<React.SetStateAction<DBFile[] | null>>,
) {
  if (!metadata) return;
  if (!file) return;
  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");
  // Gets all songs
  const idQuery = store.getAll();

  idQuery.onsuccess = async () => {
    const songFound = idQuery.result.find(
      (query) => query.file.name === file.name && query.file.size === file.size,
    );
    // Run unlike logic here
    if (songFound) {
      await removeFromDB(songFound);
    } else {
      // Otherwise like song
      store.put({
        metadata: {
          song_name: metadata.song_name,
          artist: metadata.artist,
          album: metadata.album,
          duration: metadata.duration,
          cover_art: metadata.coverArt,
        },
        file,
      });
    }
    loadDB(setDB, true);
  };
}
