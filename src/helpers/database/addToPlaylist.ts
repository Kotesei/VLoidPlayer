import { DBFile } from "../../context/FileContext";
import { db } from "./db";

export async function addToPlaylist(file: DBFile | null, playlistId: number) {
  if (!file) return;
  const transaction = db.transaction("playlistSongs", "readwrite");
  const store = transaction.objectStore("playlistSongs");

  const song_name = file.metadata.song_name;
  const file_name = file.file.name;
  const size = file.file.size;
  store.put({
    ...(song_name !== undefined && { song_name: song_name }),

    ...(file_name !== undefined && { name: file_name }),
    size,
    playlistId,
  });
}
