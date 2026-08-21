import { handleEnd } from "./ended";
import { ShuffledTracks } from "../../context/AudioContext";
import { DBFile } from "../../context/FileContext";

interface Next {
  currentSong: DBFile | null;
  audio: HTMLAudioElement | null;
  loopState: string;
  validFiles: DBFile[] | null;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<DBFile | null>>;
  isShuffling: ShuffledTracks | false;
}
export async function handleNextTrack(
  _e: any,
  ended: boolean = false,
  {
    currentSong,
    audio,
    loopState,
    validFiles,
    setIsPlaying,
    setIsReset,
    setCurrentSong,
    isShuffling,
  }: Next,
) {
  if (!validFiles) return;
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
  const currentIndex = validFiles.findIndex(
    (item) => item.file === currentSong.file,
  );
  const nextTrack = isShuffling
    ? isShuffling.shuffledTrackList[
        isShuffling.shuffledTrackList.findIndex(
          (item) => item.file === currentSong.file,
        ) + 1
      ]
    : validFiles[currentIndex + 1];

  let song;

  if (!nextTrack) {
    // If not in loop list mode
    if (loopState !== "list") {
      handleEnd({ setIsPlaying, audio, setIsReset });
      return;
    } else {
      song = isShuffling ? isShuffling.shuffledTrackList[0] : validFiles[0];
    }
  } else {
    song = nextTrack;
  }
  setCurrentSong(song);
  setIsPlaying(true);
  audio.src = URL.createObjectURL(song.file);
}
