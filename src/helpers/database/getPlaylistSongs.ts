import { PlaylistSong } from "../../context/FileContext";
import { db } from "./db";

export async function getPlaylistSongs(playlistId: number) {
  return new Promise<PlaylistSong[]>((res, rej) => {
    const transaction = db.transaction("playlistSongs", "readonly");
    const store = transaction.objectStore("playlistSongs");
    const index = store.index("playlistId");

    const request = index.getAll(playlistId);

    request.onsuccess = () => {
      res(request.result);
    };
    request.onerror = () => {
      rej(request.error);
    };
  });
}
