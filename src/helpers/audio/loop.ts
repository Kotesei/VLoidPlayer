interface Loop {
  audio: HTMLAudioElement | null;
  onEnded: (e: Event) => void;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;
}
// Cycle through the loop options
export async function handleLoop({ audio, onEnded, setLoopState }: Loop) {
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
