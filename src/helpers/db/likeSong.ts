import { SongMetaData } from "../../context/AudioContext";

export async function handleLike(metadata: SongMetaData | null) {
  if (!metadata) return;
  console.log(metadata);
  ///////////// IndexedDB /////////////////
  // Need to figure out how this works for web version release

  ///////////// SQLite /////////////////
  // Need to handle if the song already exists in liked list
  // await window.dbHandlers.likeSong(null, metadata);
}
