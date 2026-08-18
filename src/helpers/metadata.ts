import { parseBlob } from "music-metadata";
import { formatTime } from "./formatTime";
import { SongMetaData } from "../context/AudioContext";
import { DBFile } from "../context/FileContext";

export async function getMetaData(
  song: File,
  {
    setNextSong,
    setMetadata,
  }: {
    setNextSong?: React.Dispatch<React.SetStateAction<DBFile | null>>;
    setMetadata?: React.Dispatch<React.SetStateAction<SongMetaData | null>>;
  },
) {
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

  if (setNextSong) {
    setNextSong({ file: song, metadata: songMetaData });
  }

  if (setMetadata) {
    setMetadata(songMetaData);
  }
}
