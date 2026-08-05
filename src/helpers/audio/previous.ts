import { SongMetaData } from "../../context/AudioContext";
import { getMetaData } from "../metadata";

interface Previous {
  metadata: SongMetaData | null;
  currentSong: string | null;
  audio: HTMLAudioElement | null;
  trackList: string[];
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<string | null>>;
  isPlaying: boolean;
}

export async function handlePreviousTrack({
  metadata,
  audio,
  setIsReset,
  currentSong,
  trackList,
  setMetadata,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
}: Previous) {
  if (!metadata) return;
  if (!audio) return;
  if (audio.currentTime > 2) {
    audio.currentTime = 0;
    setIsReset(true);
  } else {
    if (!currentSong) return;
    const currentSongFile =
      currentSong.split("/")[currentSong.split("/").length - 1];
    const prevTrack = trackList[trackList.indexOf(currentSongFile) - 1];
    if (prevTrack) {
      audio.src = "";
      const src = `./src/assets/${prevTrack}`;
      setIsReset(false);
      getMetaData(src, setMetadata);
      setCurrentSong(src);
      if (!isPlaying) setIsPlaying(true);
    } else {
      // This is when trying to go to previous track on the start of a list
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  }
}
