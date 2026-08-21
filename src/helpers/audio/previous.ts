import { ShuffledTracks } from "../../context/AudioContext";
import { DBFile } from "../../context/FileContext";

interface Previous {
  currentSong: DBFile | null;
  audio: HTMLAudioElement | null;
  validFiles: DBFile[] | null;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentSong: React.Dispatch<React.SetStateAction<DBFile | null>>;
  isPlaying: boolean;
  isShuffling: ShuffledTracks | false;
}

export async function handlePreviousTrack({
  audio,
  setIsReset,
  currentSong,
  validFiles,
  setCurrentSong,
  isPlaying,
  setIsPlaying,
  isShuffling,
}: Previous) {
  if (!validFiles) return;
  if (!audio) return;
  if (!currentSong) return;

  if (audio.currentTime > 2) {
    audio.currentTime = 0;
    setIsReset(true);
  } else {
    const currentIndex = validFiles.findIndex(
      (item) => item.file === currentSong.file,
    );
    if (!currentSong) return;
    const prevTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.findIndex(
            (item) => item.file === currentSong.file,
          ) - 1
        ]
      : validFiles[currentIndex - 1];
    if (prevTrack) {
      audio.src = "";
      setIsReset(false);
      setCurrentSong(prevTrack);
      audio.src = URL.createObjectURL(prevTrack.file);
      if (!isPlaying) setIsPlaying(true);
    } else {
      // This is when trying to go to previous track on the start of a list
      audio.currentTime = 0;
      audio.play();
      setIsPlaying(true);
    }
  }
}
