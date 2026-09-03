import { DBFile } from "../../context/FileContext";
import { db } from "./db";

export async function addToPlaylist(file: DBFile, playlistId: number) {
  const transaction = db.transaction("playlistSongs", "readwrite");
  const store = transaction.objectStore("playlistSongs");

  const song_name = file.metadata.song_name ?? file.file.name;
  const size = file.file.size;
  store.put({
    song_name,
    size,
    playlistId,
  });
}
