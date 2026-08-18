import { ShuffledTracks } from "../../context/AudioContext";
import { shuffleArray } from "../shuffleArray";

interface Shuffle {
  currentSong?: File | null;
  validFiles?: File[] | null;
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
    newList.findIndex((i) => i === currentSong),
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
