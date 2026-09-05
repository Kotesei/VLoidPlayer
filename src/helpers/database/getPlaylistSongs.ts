import { db } from "./db";

export async function getPlaylistSongs(playlistId: number) {
  const transaction = db.transaction("playlistSongs", "readonly");
  const store = transaction.objectStore("playlistSongs");
  const index = store.index("playlistId");

  const request = index.getAll(playlistId);

  request.onsuccess = () => {
    console.log(request.result);
  };
}
