import { ShuffledTracks, SongMetaData } from "../../context/AudioContext";
import { getMetaData } from "../metadata";

interface Previous {
  metadata: SongMetaData | null;
  currentSong: File | null;
  audio: HTMLAudioElement | null;
  trackList: File[];
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<File | null>>;
  isPlaying: boolean;
  isShuffling: ShuffledTracks | false;
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
  isShuffling,
}: Previous) {
  if (!metadata) return;
  if (!audio) return;
  if (audio.currentTime > 2) {
    audio.currentTime = 0;
    setIsReset(true);
  } else {
    if (!currentSong) return;
    const prevTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSong) - 1
        ]
      : trackList[trackList.indexOf(currentSong) - 1];
    if (prevTrack) {
      audio.src = "";
      setIsReset(false);
      getMetaData(prevTrack, setMetadata);
      setCurrentSong(prevTrack);
      audio.src = URL.createObjectURL(prevTrack);
      if (!isPlaying) setIsPlaying(true);
    } else {
      // This is when trying to go to previous track on the start of a list
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  }
}
