import "./App.css";
import { Button } from "./components/Button";
import { CoverArt } from "./components/CoverArt";
import { Queue } from "./components/Queue";
import { SongDetails } from "./components/SongDetails";
import { SongNavi } from "./components/SongNavi";
import { useAudio } from "./context/AudioContext";

function App() {
  const {
    isPlaying,
    handleLike,
    handleNextTrack,
    handlePlayPause,
    handlePreviousTrack,
    handleLoop,
  } = useAudio();
  return (
    <>
      <div className="h-full w-full flex-col flex items-center justify-end gap-3">
        <SongDetails />
        <div
          className="max-h-[62dvh] flex flex-col items-center px-13 w-[clamp(5.5rem,85vmin,55.5rem)] min-w-76 max-w-225"
          id="songContainer"
        >
          <CoverArt />
          <div className="w-full flex-1 flex flex-col pt-[5dvh]">
            <div className="flex justify-between">
              <Button shuffle stroke="oklch(82.7% 0.119 306.383)" />
              <Button
                like
                onClick={handleLike}
                stroke="oklch(82.7% 0.119 306.383)"
              />
              <Button
                repeat
                stroke="oklch(82.7% 0.119 306.383)"
                onClick={handleLoop}
              />
            </div>
            <SongNavi />
            <div className="flex justify-around px-5">
              <Button
                previous
                onClick={handlePreviousTrack}
                fill="oklch(82.7% 0.119 306.383)"
              />
              <Button
                playPause
                isPlaying={isPlaying}
                onClick={handlePlayPause}
                stroke="oklch(82.7% 0.119 306.383)"
              />
              <Button
                fill="oklch(82.7% 0.119 306.383)"
                skip
                onClick={handleNextTrack}
              />
            </div>
          </div>
        </div>
        <Queue />
      </div>
    </>
  );
}

export default App;
