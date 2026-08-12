import { handleEnd } from "./ended";
import { getMetaData } from "../metadata";
import { ShuffledTracks, SongMetaData } from "../../context/AudioContext";

interface Next {
  metadata: SongMetaData | null;
  currentSong: File | null;
  audio: HTMLAudioElement | null;
  loopState: string;
  trackList: File[] | null;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<File | null>>;
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
  if (!trackList) return;
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
  const nextTrack = isShuffling
    ? isShuffling.shuffledTrackList[
        isShuffling.shuffledTrackList.indexOf(currentSong) + 1
      ]
    : trackList[trackList.indexOf(currentSong) + 1];

  let song;

  if (!nextTrack) {
    // If not in loop list mode
    if (loopState !== "list") {
      handleEnd({ setIsPlaying, audio, setIsReset });
      return;
    } else {
      song = isShuffling ? isShuffling.shuffledTrackList[0] : trackList[0];
    }
  } else {
    song = nextTrack;
  }
  getMetaData(song, setMetadata);
  setCurrentSong(song);
  setIsPlaying(true);
  audio.src = URL.createObjectURL(song);
}
