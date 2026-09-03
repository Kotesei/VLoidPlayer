import { Playlist } from "../../context/FileContext";
import { db } from "./db";

export async function loadPlaylists(): Promise<Playlist[] | null> {
  return new Promise((res, rej) => {
    const transaction = db.transaction("playlists", "readonly");
    const store = transaction.objectStore("playlists");
    const req = store.getAll();
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}
