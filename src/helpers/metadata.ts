import { parseBlob } from "music-metadata";
import { formatTime } from "./formatTime";

export async function getMetaData(song: string, setState: any) {
  // Get metadata
  const res = await fetch(song);
  const data = await res.blob();
  const metadata = await parseBlob(data);
  const songMetaData = {
    songName: metadata.common.title,
    artist: metadata.common.artist,
    album: metadata.common.album,
    coverArt: metadata.common.picture?.[0] ?? null,
    coverArtURL: undefined as string | undefined,
    // Convert time to the duration
    duration: formatTime(metadata.format.duration ?? 0),
  };

  console.log(songMetaData);

  // // Handle the artwork
  function createBlob(item: any) {
    console.log(item);
    const blob = new Blob([item.data], { type: item.format });
    const url = URL.createObjectURL(blob);
    return url;
  }

  songMetaData.coverArtURL = createBlob(songMetaData.coverArt);

  setState(songMetaData);
}
