import { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContext";
import { useFiles } from "../context/FileContext";
import { handleLike } from "../helpers/database/likeSong";
import { Button } from "./Button";

export function Queue() {
  const { nextSong, currentSong, loopState } = useAudio();
  const queue = useRef(null);
  const { db, setDB, validFiles } = useFiles();
  const [showingQueue, setShowingQueue] = useState<boolean>(false);
  function handleShowQueue() {
    setShowingQueue(!showingQueue);
  }

  // useEffect(() => {
  //   if (!showingQueue) return;
  //   console.log(queue);
  //   console.log(validFiles);
  // }, [showingQueue]);

  console.log("test");
  return (
    <div className="h-[18dvh] w-full items-center gap-2 flex flex-col justify-end">
      <div className="flex flex-col items-center flex-1 py-[3dvh] justify-end">
        <h2 className="text-purple-300 text-[11px]">Playing From</h2>
        <p className="text-purple-300 text-[10px]">Uploaded List</p>
      </div>
      <div className="min-h-[35%] flex justify-center relative w-full">
        <div
          ref={queue}
          id="queue"
          className={`gap-5 flex absolute border-b-0  rounded-b-none border-purple-300 ${showingQueue ? "justify-end w-[85%] h-[70dvh] border rounded-xl bg-[#16044e94] items-start p-4 flex-col-reverse" : "px-2 w-full border-t items-center justify-center"} min-h-full bottom-0  backdrop-blur-sm shadow-2xl shadow-purple-500 `}
        >
          {showingQueue && (
            <div className="w-full h-full rounded-t-xl shadow-inner shadow-amber-50 border-t-red-200 border-t-2 text-white">
              {currentSong?.metadata && (
                <div className="px-2 text-xs pt-3 w-full h-full flex flex-col gap-2">
                  <div className="bg-[#000c32a5] h-15 p-3 rounded-lg border-white border-2 flex justify-between items-center gap-5">
                    <div>
                      <p>
                        {currentSong?.metadata?.song_name ??
                          currentSong?.file?.name}
                      </p>
                      {currentSong?.metadata?.artist && (
                        <p className="text-gray-400">
                          {currentSong?.metadata?.artist}
                        </p>
                      )}
                    </div>
                    <p>{currentSong?.metadata?.duration}</p>
                  </div>
                  {nextSong && (
                    <div className="bg-[#000c32a5] p-3 rounded-lg border-white flex justify-between items-center border-2 gap-5">
                      <div>
                        <p>
                          {nextSong?.metadata?.song_name ?? nextSong?.file.name}
                        </p>
                        <p className="text-gray-400">
                          {nextSong?.metadata?.artist}
                        </p>
                      </div>
                      <p>{nextSong?.metadata?.duration}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          <div
            className={`text-purple-300 flex ${showingQueue ? "h-20 max-h-25" : ""} flex-col text-xs px-[clamp(3rem,7vmin,5rem)] items-center w-full relative justify-center`}
          >
            <svg
              onClick={handleShowQueue}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)] absolute left-[clamp(1rem,1vmin,5rem)]  top-1/2 -translate-y-1/2"
            >
              <path
                d="M160 144h288M160 256h288M160 368h288"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="144"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="256"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="368"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
            </svg>
            <p className="text-[9px] w-fit text-center ">Up Next</p>
            {loopState === "single" ? (
              <>
                <p className="text-center">
                  {currentSong?.metadata?.song_name}
                </p>
              </>
            ) : (
              <>
                {currentSong?.metadata && nextSong && (
                  <div className="max-w-full w-fit self-center">
                    <div className="absolute translate-y-1/2 bottom-1/2 right-[clamp(1rem,1vmin,5rem)]">
                      <Button
                        nextLike
                        file={nextSong}
                        db={db}
                        likeSong={() => {
                          handleLike(nextSong, setDB);
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
                {!nextSong && <p className="text-center">End Of List</p>}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
