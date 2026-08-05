import { ShuffledTracks } from "../../context/AudioContext";
import { shuffleArray } from "../shuffleArray";

interface Shuffle {
  currentSong: string | null;
  trackList: string[];
  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}
export async function handleShuffle({
  currentSong,
  trackList,
  isShuffling,
  setIsShuffling,
}: Shuffle) {
  if (!isShuffling) {
    if (!currentSong) return;
    const currentSongFile =
      currentSong.split("/")[currentSong.split("/").length - 1];
    const newList = [...trackList];
    newList.splice(
      newList.findIndex((i) => i === currentSongFile),
      1,
    );
    shuffleArray(newList);
    const shuffledTrackList = [currentSongFile, ...newList];
    setIsShuffling({ trackList, shuffledTrackList });
  } else {
    setIsShuffling(false);
  }
}
