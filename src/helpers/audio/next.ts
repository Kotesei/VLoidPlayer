import { handleEnd } from "./ended";
import { getMetaData } from "../metadata";
import { SongMetaData } from "../../context/AudioContext";

interface Next {
  metadata: SongMetaData | null;
  currentSong: string | null;
  audio: HTMLAudioElement | null;
  loopState: string;
  trackList: string[];
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<string | null>>;
}
export async function handleNextTrack(
  _e: any,
  ended: boolean = false,
  {
    metadata,
    currentSong,
    audio,
    loopState,
    trackList,
    setIsPlaying,
    setIsReset,
    setMetadata,
    setCurrentSong,
  }: Next,
) {
  if (!metadata) return;
  if (!currentSong) return;
  if (!audio) return;
  if (ended && loopState === "single") {
    audio.currentTime = 0;
    audio.play();
    return;
  }
  if (audio.currentTime === audio.duration && loopState === "single") {
    audio.currentTime = 0;
    return;
  }
  const currentSongFile =
    currentSong.split("/")[currentSong.split("/").length - 1];
  let src;
  const nextTrack = trackList[trackList.indexOf(currentSongFile) + 1];
  if (!nextTrack) {
    // If Disabled
    if (loopState === "list") {
      src = `./src/assets/${trackList[0]}`;
    } else {
      handleEnd({ setIsPlaying, audio, setIsReset });
      return;
    }
    // If looping list
  } else {
    src = `./src/assets/${nextTrack}`;
  }
  // audio = new Audio(src);
  getMetaData(src, setMetadata);
  setCurrentSong(src);
  setIsPlaying(true);
}
