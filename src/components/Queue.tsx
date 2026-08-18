import { useAudio } from "../context/AudioContext";
import { useFiles } from "../context/FileContext";
import { handleLike } from "../helpers/database/likeSong";
import { Button } from "./Button";

export function Queue() {
  const { nextSong, currentSong, metadata, loopState } = useAudio();
  const { db, setDB } = useFiles();

  return (
    <div
      className="h-[18dvh] w-full items-center gap-2 flex flex-col justify-end"
      id="queue"
    >
      <div className="flex flex-col items-center flex-1 py-[3dvh] justify-end">
        <h2 className="text-purple-300 text-[11px]">Playing From</h2>
        <p className="text-purple-300 text-[10px]">Uploaded List</p>
      </div>
      <div className="w-full gap-2 flex items-center px-3 h-[45%] border-t border-purple-300">
        <div className="text-purple-300 flex-1 flex flex-col text-xs px-10">
          <p className="text-[9px] text-center flex-1">Up Next</p>
          {loopState === "single" ? (
            <>
              <p className="text-center">{metadata?.song_name}</p>
            </>
          ) : (
            <>
              {metadata && nextSong && (
                <div className="relative w-fit self-center">
                  <div className="absolute translate-y-1/2 bottom-1/2 left-full px-2">
                    <Button
                      nextLike
                      file={nextSong.file}
                      db={db}
                      likeSong={() => {
                        handleLike(nextSong.metadata, nextSong.file, setDB);
                      }}
                      stroke="oklch(82.7% 0.119 306.383)"
                      fill="oklch(82.7% 0.119 306.383)"
                    />
                  </div>
                  <p className="text-center">
                    {nextSong.metadata.song_name ?? "Unknown"}
                  </p>
                </div>
              )}
              {!metadata && (
                <p className="text-center">
                  Nothing has been added to the Queue
                </p>
              )}
              {metadata && currentSong && !nextSong && (
                <p className="text-center">End Of List</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
