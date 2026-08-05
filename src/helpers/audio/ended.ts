interface Ended {
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audio: HTMLAudioElement | null;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;
}
export async function handleEnd({ setIsPlaying, audio, setIsReset }: Ended) {
  setIsPlaying(false);
  if (!audio) return;
  audio.currentTime = 0;
  setIsReset(true);
  return;
}
