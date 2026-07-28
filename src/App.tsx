import "./App.css";
import { useEffect, useRef, useState } from "react";
import { getMetaData } from "./helpers/metadata";
import { animate } from "./helpers/animation";
import { AnimationItem } from "lottie-web";
import { formatTime } from "./helpers/formatTime";
import * as Slider from "@radix-ui/react-slider";

const sampleTrackList = [
  "sample1.flac",
  "sample2.flac",
  "sample3.flac",
  "sample4.flac",
  "sample5.flac",
];

function App() {
  const sliderRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animData, setAnimData] = useState<AnimationItem | null>(null);
  const [currentSong, setCurrentSong] = useState<MediaItem | null>(null);
  const [metadata, setMetadata] = useState<SongMetaData | null>(null);
  const [anim, setAnim] = useState<string | null>(null);
  const [currentSpeed, setSpeed] = useState<number>(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [sliderPos, setSliderPos] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!metadata) return;
    if (!audioRef.current) return;
    console.log(metadata);
    const audio = audioRef.current;

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentSong((prev) => {
        if (!prev) return null;
        return { ...prev, currentDuration: String(metadata?.duration) };
      });
    });
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
    if (!metadata) getMetaData(currentSong.src, setMetadata);

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
          if (!isSeeking) {
            setSliderPos(+meterCompletion.toFixed(2));
          }
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
  }, [audioRef.current, isSeeking, isPlaying]);

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

  function handleSeek(e: number[]) {
    if (!audioRef.current) return;
    setIsSeeking(true);
    setSliderPos(e[0]);
  }

  function handlePreviousTrack() {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 2) {
      audioRef.current.currentTime = 0;
      setCurrentSong((prev) => {
        if (!prev) return null;
        return { ...prev, currentDuration: "0:00" };
      });

      setSliderPos(0);
    } else {
      if (!currentSong) return;
      const currentSongFile =
        currentSong.src.split("/")[currentSong.src.split("/").length - 1];
      const prevTrack =
        sampleTrackList[sampleTrackList.indexOf(currentSongFile) - 1];
      if (prevTrack) {
        audioRef.current.src = "";
        const src = `./src/assets/${prevTrack}`;
        audioRef.current = new Audio(src);
        const song = {
          src,
          audio: audioRef.current,
          currentDuration: "0:00",
        };
        getMetaData(src, setMetadata);
        setCurrentSong(song);
        audioRef.current.play();
      } else {
        audioRef.current.currentTime = 0;
      }
    }
  }

  function handleNextTrack() {
    if (!currentSong) return;
    if (!audioRef.current) return;
    const currentSongFile =
      currentSong.src.split("/")[currentSong.src.split("/").length - 1];
    audioRef.current.src = "";
    let src;
    const nextTrack =
      sampleTrackList[sampleTrackList.indexOf(currentSongFile) + 1];
    if (!nextTrack) {
      src = `./src/assets/${sampleTrackList[0]}`;
    } else {
      src = `./src/assets/${nextTrack}`;
    }
    audioRef.current = new Audio(src);
    const song = {
      src,
      audio: audioRef.current,
      currentDuration: "0:00",
    };
    getMetaData(src, setMetadata);
    setCurrentSong(song);
    audioRef.current.play();
  }

  useEffect(() => {
    if (isSeeking) return;
    if (!sliderRef.current) return;
    if (!audioRef.current) return;
    const sliderThumb = sliderRef.current.querySelector('[role="slider"]');

    if (sliderThumb) {
      const value = sliderThumb.getAttribute("aria-valuenow");
      const meterCompletion = (Number(value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = +meterCompletion;
    }
  }, [isSeeking]);

  return (
    <>
      <div className="h-full w-full flex-col flex justify-end gap-3">
        <div className="minh-[10dvh] w-full" id="navigation">
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
          <div
            ref={containerRef}
            style={{ backgroundImage: `url(${metadata?.coverArt})` }}
            className="border-purple-300 border-2 min-w-50 min-h-50 aspect-square h-[65dvw] bg-[url] bg-cover"
            id="coverArt"
          ></div>
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
              />
              <img
                draggable="false"
                className="h-5 invert-100"
                src="./src/assets/repeat.svg"
              />
            </div>
            <div className="w-full h-5 mt-5">
              <div className="w-full h-[1.5px] flex justify-center items-center bg-purple-300 relative">
                <Slider.Root
                  ref={sliderRef}
                  className="w-full absolute flex h-full"
                  value={[sliderPos]}
                  onValueChange={handleSeek}
                  onPointerUp={() => setIsSeeking(false)}
                  onKeyUp={() => setIsSeeking(false)}
                  max={100}
                  step={0.1}
                >
                  <Slider.Track className="bg-purple-500 flex-1">
                    <Slider.Range className="absolute h-full bg-white" />
                  </Slider.Track>
                  <Slider.Thumb className="w-3 h-3 rounded-full block bg-white top-0 -translate-y-1/2" />
                </Slider.Root>
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
          id="queue"
        >
          <div className="flex flex-col items-center flex-1 py-[3dvh] justify-end">
            <h2 className="text-purple-300 text-[11px]">Playing From</h2>
            <p className="text-purple-300 text-[10px]">Library</p>
          </div>
          <div className="w-full gap-2 flex items-center px-3 h-[45%] border-t border-purple-300">
            <img
              draggable="false"
              className="h-[30%] rotate-180 invert-100"
              src="./src/assets/arrow-outline.svg"
            />
            <div className="text-purple-300 flex-1 flex flex-col text-xs">
              <p className="text-[9px] flex-1">Up Next</p>
              <p>Song Name Sample 2</p>
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
