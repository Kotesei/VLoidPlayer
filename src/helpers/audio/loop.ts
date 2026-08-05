import { SongMetaData } from "../../context/AudioContext";

interface Loop {
  metadata: SongMetaData | null;
  audio: HTMLAudioElement | null;
  onEnded: (e: Event) => void;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;
}
// Cycle through the loop options
export async function handleLoop({
  metadata,
  audio,
  onEnded,
  setLoopState,
}: Loop) {
  if (!metadata) return;
  if (!audio) return;
  audio.removeEventListener("ended", onEnded);
  setLoopState((state) => {
    switch (state) {
      case "list":
        return "single";
      case "single":
        return "disabled";
      default:
        return "list";
    }
  });
}
