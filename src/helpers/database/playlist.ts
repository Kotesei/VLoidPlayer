import { DBFile } from "../../context/FileContext";
import { db } from "./db";
import { PlaylistSong } from "../../context/FileContext";
import { Playlist } from "../../context/FileContext";

/////////////
// Getters //
/////////////

// Loads the playlist
export async function getPlaylists(): Promise<Playlist[] | null> {
  return new Promise((res, rej) => {
    const transaction = db.transaction("playlists", "readonly");
    const store = transaction.objectStore("playlists");
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

// Gets the songs in playlist
export async function getPlaylistSongs(playlistId: number) {
  return new Promise<PlaylistSong[]>((res, rej) => {
    const transaction = db.transaction("playlistSongs", "readonly");
    const store = transaction.objectStore("playlistSongs");
    const index = store.index("playlistId");

    const req = index.getAll(playlistId);

    req.onsuccess = () => {
      res(req.result);
    };
    req.onerror = () => {
      rej(req.error);
    };
  });
}

/////////////
// Setters //
/////////////

// Creates the playlist
export async function createPlaylist(setName: String) {
  if (!setName.trim().length) return;
  const name = setName.trim();
  const transaction = db.transaction("playlists", "readwrite");
  const store = transaction.objectStore("playlists");

  store.put({
    name,
  });
}

// Adds a song to playlist
export async function addToPlaylist(file: DBFile | null, playlistId: number) {
  if (!file) return;
  const transaction = db.transaction("playlistSongs", "readwrite");
  const store = transaction.objectStore("playlistSongs");

  const song_name = file.metadata.song_name;
  const file_name = file.file.name;
  const size = file.file.size;
  store.put({
    ...(song_name !== undefined && { song_name: song_name }),
    ...(song_name !== undefined && { song_name: song_name }),

    ...(file_name !== undefined && { name: file_name }),
    size,
    playlistId,
  });
}

//////////////
// Removers //
//////////////

// Delete the playlist
export async function deletePlaylist(playlistId: number) {
  console.log(playlistId);
}

// Removes a song from playlist
export async function removeFromPlaylist(
  file: DBFile | null,
  playlistId: number,
): Promise<void> {
  return new Promise((res, rej) => {
    const transaction = db.transaction("playlistSongs", "readwrite");
    const store = transaction.objectStore("playlistSongs");
    const index = store.index("playlistId");
    const req = index.getAll(playlistId);

    req.onsuccess = () => {
      const song = req.result.find(
        (item) =>
          item.size === file?.file.size &&
          (item.song_name === file?.metadata.song_name ||
            item.name === file?.file.name),
      );
      const delReq = store.delete(song.songId);

      delReq.onsuccess = () => res();
      delReq.onerror = () => rej();
    };
  });
}
