import { db } from "./db";

export async function createPlaylist(name: String) {
  if (!name.trim().length) return;
  const playlistName = name.trim();
  const transaction = db.transaction("playlists", "readwrite");
  const store = transaction.objectStore("playlists");

  store.put({
    playlistName,
  });
}
