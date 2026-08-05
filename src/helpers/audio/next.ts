import { handleEnd } from "./ended";
import { getMetaData } from "../metadata";
import { ShuffledTracks, SongMetaData } from "../../context/AudioContext";

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
  isShuffling: ShuffledTracks | false;
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
    isShuffling,
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
  const nextTrack = isShuffling
    ? isShuffling.shuffledTrackList[
        isShuffling.shuffledTrackList.indexOf(currentSongFile) + 1
      ]
    : trackList[trackList.indexOf(currentSongFile) + 1];

  let src;

  if (!nextTrack) {
    // If not in loop list mode
    if (loopState !== "list") {
      handleEnd({ setIsPlaying, audio, setIsReset });
      return;
    } else {
      src = isShuffling
        ? `./src/assets/${isShuffling.shuffledTrackList[0]}`
        : `./src/assets/${trackList[0]}`;
    }
  } else {
    src = `./src/assets/${nextTrack}`;
  }
  getMetaData(src, setMetadata);
  setCurrentSong(src);
  setIsPlaying(true);
}
