import "./App.css";

import { CoverArt } from "./components/CoverArt";
import { SongNavi } from "./components/SongNavi";
import { useAudio } from "./context/AudioContext";

function App() {
  const {
    metadata,
    isPlaying,
    handleLike,
    handleNextTrack,
    handlePlayPause,
    handlePreviousTrack,
    nextSong,
  } = useAudio();
  return (
    <>
      <div className="h-full w-full flex-col flex justify-end gap-3">
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
        <div
          className="max-h-[70dvh] w-full flex flex-col items-center px-13"
          id="songContainer"
        >
          <div className="flex w-full justify-between h-3.5 items-center mb-2">
            <img
              draggable="false"
              className="h-full invert-100"
              src="./src/assets/arrow-outline.svg"
            />

            <img
              draggable="false"
              className="h-full invert-100"
              src="./src/assets/ellipsis-vertical.svg"
            />
          </div>
          <CoverArt />
          <div className="w-full flex-1 flex flex-col pt-[5dvh]">
            <div className="flex justify-between">
              <img
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/shuffle.svg"
              />
              <img
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/heart-outline.svg"
                onClick={handleLike}
              />
              <img
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/repeat.svg"
              />
            </div>
            <SongNavi />
            <div className="flex justify-around px-5">
              <img
                onClick={handlePreviousTrack}
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/play-skip-back.svg"
              />
              <img
                draggable="false"
                onClick={handlePlayPause}
                className="h-5 invert-100"
                src={`./src/assets/${isPlaying ? "pause" : "play"}.svg`}
              />
              <img
                onClick={handleNextTrack}
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/play-skip-forward.svg"
              />
            </div>
          </div>
        </div>
        <div
          className="h-[20dvh] w-full items-center gap-2 flex flex-col justify-end"
          style={{
            opacity: nextSong ? 1 : 0,
            visibility: nextSong ? "visible" : "hidden",
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
              <p className="text-[9px] flex-1">Up Next</p>
              <p>{nextSong?.songName}</p>
            </div>
            <img
              draggable="false"
              className="h-5 invert-100"
              src="./src/assets/heart-outline.svg"
            />
            <p className="text-purple-300 text-2xl h-5 leading-4">+</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
