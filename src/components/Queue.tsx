import { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";

export function Queue() {
  const [loaded, setLoaded] = useState(false);
  const { nextSong, trackList, isPlaying } = useAudio();
  useEffect(() => {
    if (!nextSong) return;
    setLoaded(true);
  }, [nextSong]);
  return (
    <div
      className="h-[20dvh] w-full items-center gap-2 flex flex-col justify-end"
      style={{
        opacity: loaded ? 1 : 0,
        visibility: loaded ? "visible" : "hidden",
      }}
      id="queue"
    >
      <div className="flex flex-col items-center flex-1 py-[3dvh] justify-end">
        <h2 className="text-purple-300 text-[11px]">Playing From</h2>
        <p className="text-purple-300 text-[10px]">Sample List</p>
      </div>
      <div className="w-full gap-2 flex items-center px-3 h-[45%] border-t border-purple-300">
        <img
          draggable="false"
          className="h-[30%] rotate-180 invert-100"
          src="./src/assets/arrow-outline.svg"
        />
        <div className="text-purple-300 flex-1 flex flex-col text-xs">
          {nextSong && (
            <>
              <p className="text-[9px] flex-1">Up Next</p>
              <p>{nextSong?.songName ?? "None"}</p>
            </>
          )}
          {!trackList && (
            <p className="text-center">Nothing has been added to the Queue</p>
          )}
          {trackList && !nextSong && <p className="text-center">End Of List</p>}
        </div>
        <img
          draggable="false"
          className="h-5 invert-100"
          src="./src/assets/heart-outline.svg"
        />
        <p className="text-purple-300 text-2xl h-5 leading-4">+</p>
      </div>
    </div>
  );
}
