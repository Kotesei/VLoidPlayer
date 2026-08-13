import "./App.css";
import { Button } from "./components/Button";
import { CoverArt } from "./components/CoverArt";
import { Queue } from "./components/Queue";
import { SongDetails } from "./components/SongDetails";
import { SongNavi } from "./components/SongNavi";
import { useAudio } from "./context/AudioContext";
import { handleLoop } from "./helpers/audio/loop";
import { handleNextTrack } from "./helpers/audio/next";
import { handlePlayPause } from "./helpers/audio/play_pause";
import { handlePreviousTrack } from "./helpers/audio/previous";
import { handleShuffle } from "./helpers/audio/shuffle";
import { handleLike } from "./helpers/database/likeSong";
import { Upload } from "./components/Upload";
import { useFiles } from "./context/FileContext";
import { loadDB } from "./helpers/database/db";

function App() {
  const {
    isPlaying,
    metadata,
    currentSong,
    audio,
    loopState,
    trackList,
    setIsPlaying,
    setIsReset,
    setMetadata,
    setCurrentSong,
    onEnded,
    setLoopState,
    isShuffling,
    setIsShuffling,
  } = useAudio();
  const {
    uploadState,
    loadedDBMetadata,
    setLoadedDBFiles,
    setLoadedDBMetadata,
    loadedDBFiles,
  } = useFiles();
  return (
    <>
      {uploadState && <Upload />}
      {!uploadState && (
        <div className="h-full w-full flex-col flex items-center justify-end gap-3">
          <SongDetails />
          <div
            className="max-h-[62dvh] flex flex-col items-center px-13 w-[clamp(5.5rem,85vmin,55.5rem)] min-w-76 max-w-225 flex-1"
            id="songContainer"
          >
            <CoverArt />
            <div className="w-full flex-1 flex flex-col pt-[5dvh]">
              <div className="flex justify-between">
                <Button
                  shuffle
                  isShuffling={isShuffling}
                  stroke="oklch(82.7% 0.119 306.383)"
                  onClick={() =>
                    handleShuffle({
                      currentSong,
                      trackList,
                      isShuffling,
                      setIsShuffling,
                      metadata,
                    })
                  }
                />
                <Button
                  like
                  metadata={metadata}
                  loadedDBMetadata={loadedDBMetadata}
                  likeSong={() => {
                    handleLike(
                      metadata,
                      currentSong,
                      setLoadedDBFiles,
                      setLoadedDBMetadata,
                    );
                  }}
                  stroke="oklch(82.7% 0.119 306.383)"
                  fill="oklch(82.7% 0.119 306.383)"
                />
                <Button
                  repeat
                  loop={loopState}
                  stroke="oklch(82.7% 0.119 306.383)"
                  onClick={() =>
                    handleLoop({ metadata, audio, onEnded, setLoopState })
                  }
                />
              </div>
              <SongNavi />
              <div className="flex justify-around px-5">
                <Button
                  previous
                  onClick={() =>
                    handlePreviousTrack({
                      metadata,
                      audio,
                      setIsReset,
                      currentSong,
                      trackList,
                      setMetadata,
                      setCurrentSong,
                      isPlaying,
                      setIsPlaying,
                      isShuffling,
                    })
                  }
                  fill="oklch(82.7% 0.119 306.383)"
                />
                <Button
                  playPause
                  isPlaying={isPlaying}
                  onClick={() => handlePlayPause({ isPlaying, setIsPlaying })}
                  stroke="oklch(82.7% 0.119 306.383)"
                />
                <Button
                  fill="oklch(82.7% 0.119 306.383)"
                  skip
                  onClick={() =>
                    handleNextTrack(null, false, {
                      metadata,
                      currentSong,
                      audio,
                      loopState,
                      trackList,
                      setIsPlaying,
                      setIsReset,
                      setMetadata,
                      setCurrentSong,
                      isShuffling,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <Queue />
        </div>
      )}
    </>
  );
}

export default App;
