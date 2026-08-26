import { ShuffledTracks } from "../../context/AudioContext";
import { DBFile } from "../../context/FileContext";
import { shuffleArray } from "../shuffleArray";

interface Shuffle {
  currentSong?: DBFile | null;
  validFiles?: DBFile[] | null;
  isShuffling?: ShuffledTracks;
  setIsShuffling?: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}
export async function handleShuffle({
  currentSong,
  validFiles,
  isShuffling,
  setIsShuffling,
}: Shuffle) {
  if (!setIsShuffling) return;
  if (!currentSong) return;
  if (!validFiles) return;
  const newList = [...validFiles];
  newList.splice(
    newList.findIndex((i) => i.file === currentSong.file),
    1,
  );
  shuffleArray(newList);

  const shuffledTrackList = [currentSong, ...newList];
  if (!isShuffling) {
    setIsShuffling({ validFiles, shuffledTrackList });
  } else {
    setIsShuffling(false);
  }
}
