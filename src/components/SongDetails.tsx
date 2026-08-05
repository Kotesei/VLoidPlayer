import { useAudio } from "../context/AudioContext";

export function SongDetails() {
  const { metadata } = useAudio();
  return (
    <div
      style={{
        opacity: metadata ? 1 : 0,
        visibility: metadata ? "visible" : "hidden",
      }}
      className="minh-[10dvh] w-full"
      id="navigation"
    >
      <div className="text-purple-300 flex-1 flex flex-col h-full justify-center">
        <h2 className="text-[9px] leading-2.5 flex justify-center italic">
          {metadata?.artist ?? "Unknown"}
        </h2>
        <h2 className="text-xs flex  leading-3.5 justify-center">
          {metadata?.songName ?? "Unknown"}
        </h2>
        <h2 className="text-[9px] flex leading-3.5 justify-center font-medium">
          {metadata?.album ?? "Unknown"}
        </h2>
      </div>
    </div>
  );
}
