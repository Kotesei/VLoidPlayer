import { ShuffledTracks, SongMetaData } from "../../context/AudioContext";
import { shuffleArray } from "../shuffleArray";

interface Shuffle {
  currentSong: File | null;
  trackList: File[];
  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
  metadata: SongMetaData | null;
}
export async function handleShuffle({
  currentSong,
  trackList,
  isShuffling,
  setIsShuffling,
  metadata,
}: Shuffle) {
  if (!metadata) return;
  if (!isShuffling) {
    if (!currentSong) return;

    const newList = [...trackList];
    newList.splice(
      newList.findIndex((i) => i === currentSong),
      1,
    );
    shuffleArray(newList);
    const shuffledTrackList = [currentSong, ...newList];
    setIsShuffling({ trackList, shuffledTrackList });
  } else {
    setIsShuffling(false);
  }
}
