import { SongMetaData } from "../../context/AudioContext";
import { db } from "./db";

///////////// SQLite /////////////////
// export async function handleLike(metadata: SongMetaData | null) {
// Need to handle if the song already exists in liked list
// await window.dbHandlers.likeSong(null, metadata);
// }

//////////// IndexedDB ////////////
export async function handleLike(
  metadata: SongMetaData | null,
  file: File | null,
) {
  if (!metadata) return;
  if (!file) return;

  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");
  // Gets all songs
  const idQuery = store.getAll();

  idQuery.onsuccess = () => {
    const songFound = idQuery.result.find(
      (query) => query.metadata.song_name === metadata.songName,
    );
    // Run unlike logic here
    if (songFound) {
      console.log(songFound);
    } else {
      // Otherwise like song
      store.put({
        metadata: {
          song_name: metadata.songName,
          artist: metadata.artist,
          album: metadata.album,
          duration: metadata.duration,
          cover_art: metadata.coverArt,
        },
        file,
      });
    }
  };
}
