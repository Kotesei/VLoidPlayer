import "./App.css";
import { useEffect, useRef, useState } from "react";
import { getMetaData } from "./helpers/metadata";
import { animate } from "./helpers/animation";
import { AnimationItem } from "lottie-web";
import { formatTime } from "./helpers/formatTime";

function App() {
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animData, setAnimData] = useState<AnimationItem | null>(null);
  const [currentSong, setCurrentSong] = useState<MediaItem | null>(null);
  const [metadata, setMetadata] = useState<SongMetaData | null>(null);
  const [anim, setAnim] = useState<string | null>(null);
  const [currentSpeed, setSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sliderBarRef = useRef(null);
  const [sliderPos, setSliderPos] = useState<number>(0);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!metadata) return;
    console.log(metadata);
  }, [metadata]);

  // Do stuff if song is playing
  useEffect(() => {
    // Runs the function to get the metadata for a song. Args: (song_location, metadata_state)

    if (!isPlaying) {
      if (!animData) return;
      animData.setSpeed(0);
      audioRef.current?.pause();
      return;
    } else if (animData && isPlaying) {
      animData.setSpeed(currentSpeed);
      audioRef.current?.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!containerRef.current || !anim) return;
    const animation = animate(containerRef.current, anim);
    animation.setSpeed(currentSpeed);
    setAnimData(animation);

    return () => animation.destroy();
  }, [anim]);

  useEffect(() => {
    if (!currentSong) return;
    getMetaData(currentSong.src, setMetadata);

    const timer = setInterval(() => {
      setCurrentSong((prev) => {
        if (!prev) {
          return {
            src: "",
            currentDuration: "-:--",
          };
        }

        if (audioRef.current) {
          const meterCompletion =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setSliderPos(+meterCompletion.toFixed(2));
        }

        return {
          ...prev,
          currentDuration: formatTime(
            audioRef.current ? audioRef.current.currentTime : 0,
          ),
        };
      });
    }, 25);

    return () => clearInterval(timer);
  }, [audioRef.current]);

  function handlePlayPause() {
    // Set current animation
    if (!anim) setAnim("./src/assets/test.json");
    if (!currentSong) {
      const src = "./src/assets/sample2.flac";
      audioRef.current = new Audio(src);
      const song = {
        src,
        audio: audioRef.current,
        currentDuration: "0:00",
      };
      setCurrentSong(song);
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  return (
    <>
      <div className="h-full w-full flex-col flex justify-end gap-3">
        <div className="minh-[10dvh] w-full" id="navigation">
          <div className="text-purple-300 flex-1 flex flex-col h-full justify-center">
            <h2 className="text-[10px] leading-2.5 flex justify-center">
              {metadata?.artist ?? "Unknown"}
            </h2>
            <h2 className="text-xs flex  leading-3.5 justify-center">
              {metadata?.songName ?? "Unknown"}
            </h2>
            <h2 className="text-[10px] flex leading-3.5 justify-center">
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
              className="h-full invert-100"
              src="./src/assets/arrow-outline.svg"
            />

            <img
              className="h-full invert-100"
              src="./src/assets/ellipsis-vertical.svg"
            />
          </div>
          <div
            ref={containerRef}
            style={{ backgroundImage: `url(${metadata?.coverArt})` }}
            className="border-purple-300 border-2 min-w-50 min-h-50 aspect-square h-[65dvw] bg-[url] bg-cover"
            id="coverArt"
          ></div>
          <div className="w-full flex-1 flex flex-col pt-[5dvh]">
            <div className="flex justify-between">
              <img className="h-5 invert-100" src="./src/assets/shuffle.svg" />
              <img
                className="h-5 invert-100"
                src="./src/assets/heart-outline.svg"
              />
              <img className="h-5 invert-100" src="./src/assets/repeat.svg" />
            </div>
            <div ref={sliderBarRef} className="w-full h-5 mt-5">
              <div className="w-full h-[1.5px] bg-purple-300 relative">
                <div
                  style={{ left: `${sliderPos}%` }}
                  className="h-2.5 w-2.5 absolute translate-y-1/2 -translate-x-full bottom-[50%] bg-purple-300 rounded-full"
                ></div>
              </div>
              <div className="text-purple-300 flex justify-between text-[9px] pt-1">
                <p>
                  {metadata?.duration ? currentSong?.currentDuration : "-:--"}
                </p>
                <p>{metadata?.duration ?? "-:--"}</p>
              </div>
            </div>
            <div className="flex justify-around px-5">
              <img
                className="h-5 invert-100"
                src="./src/assets/play-skip-back.svg"
              />
              <img
                onClick={handlePlayPause}
                className="h-5 invert-100"
                src={`./src/assets/${isPlaying ? "pause" : "play"}.svg`}
              />
              <img
                className="h-5 invert-100"
                src="./src/assets/play-skip-forward.svg"
              />
            </div>
          </div>
        </div>
        <div
          className="h-[20dvh] w-full items-center gap-2 flex flex-col justify-end"
          id="queue"
        >
          <div className="flex flex-col items-center flex-1 py-[3dvh] justify-end">
            <h2 className="text-purple-300 text-[11px]">Playing From</h2>
            <p className="text-purple-300 text-[10px]">Library</p>
          </div>
          <div className="w-full gap-2 flex items-center px-3 h-[45%] border-t border-purple-300">
            <img
              className="h-[30%] rotate-180 invert-100"
              src="./src/assets/arrow-outline.svg"
            />
            <div className="text-purple-300 flex-1 flex flex-col text-xs">
              <p className="text-[9px] flex-1">Up Next</p>
              <p>Song Name Sample 2</p>
            </div>
            <img
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
