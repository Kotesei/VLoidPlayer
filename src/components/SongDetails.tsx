import { useAudio } from "../context/AudioContext";

export function SongDetails() {
  const { currentSong } = useAudio();
  return (
    <div
      style={{
        opacity: currentSong?.metadata ? 1 : 0,
        visibility: currentSong?.metadata ? "visible" : "hidden",
      }}
      className="minh-[10dvh] w-full"
      id="navigation"
    >
      <div className="text-purple-300 text-center flex-1 flex flex-col h-full justify-center">
        <h2 className="text-[9px] leading-2.5 flex justify-center italic">
          {currentSong?.metadata?.artist ?? "Unknown"}
        </h2>
        <h2 className="text-xs flex  leading-3.5 justify-center">
          {currentSong?.metadata?.song_name ?? `${currentSong?.file.name}`}
        </h2>
        <h2 className="text-[9px] flex leading-3.5 justify-center font-medium">
          {currentSong?.metadata?.album ?? "Unknown"}
        </h2>
      </div>
    </div>
  );
}
