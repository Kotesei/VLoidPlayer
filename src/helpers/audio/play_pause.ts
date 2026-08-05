interface PlayPause {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}
export async function handlePlayPause({ isPlaying, setIsPlaying }: PlayPause) {
  setIsPlaying(!isPlaying);
}
