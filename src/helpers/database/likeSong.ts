import { SongMetaData } from "../../context/AudioContext";
import { db } from "./db";

///////////// SQLite /////////////////
// export async function handleLike(metadata: SongMetaData | null) {
// Need to handle if the song already exists in liked list
// await window.dbHandlers.likeSong(null, metadata);
// }

//////////// IndexedDB ////////////
export async function handleLike(metadata: SongMetaData | null) {
  if (!metadata) return;
  const transaction = db.transaction("likedSongs", "readwrite");
  const store = transaction.objectStore("likedSongs");
  // Gets all songs
  const idQuery = store.getAll();

  const song = {
    song_name: metadata.songName,
    artist: metadata.artist,
    album: metadata.album,
    duration: metadata.duration,
    cover_art: metadata.coverArt,
  };

  idQuery.onsuccess = () => {
    const songFound = idQuery.result.find(
      (query) => query.song_name === metadata.songName,
    );
    // Run unlike logic here
    if (songFound) {
      console.log(songFound);
    } else {
      // Otherwise like song
      store.put(song);
    }
  };
}
