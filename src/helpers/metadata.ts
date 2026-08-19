import { parseBlob } from "music-metadata";
import { formatTime } from "./formatTime";

export async function getMetaData(song: File) {
  // Get metadata
  const metadata = await parseBlob(song);
  const songMetaData = {
    song_name: metadata.common.title ?? song.name,
    artist: metadata.common.artist,
    album: metadata.common.album,
    coverArt: metadata.common.picture?.[0] ?? null,
    coverArtURL: undefined as string | undefined,
    // Convert time to the duration
    duration: formatTime(metadata.format.duration ?? 0),
  };

  // // Handle the artwork
  function createBlob(item: any) {
    const blob = new Blob([item.data], { type: item.format });
    const url = URL.createObjectURL(blob);
    return url;
  }

  if (songMetaData.coverArt) {
    songMetaData.coverArtURL = createBlob(songMetaData.coverArt);
  }
  return songMetaData;
}
