import * as Slider from "@radix-ui/react-slider";
import { useEffect, useRef, useState } from "react";
import { useAudio } from "../context/AudioContext";
import { formatTime } from "../helpers/formatTime";

interface SongTime {
  currentTime: string;
  duration: string;
}

export function SongNavi() {
  const { audio, isPlaying, isReset, setIsReset } = useAudio();
  const sliderRef = useRef<HTMLSpanElement>(null);
  const [sliderPos, setSliderPos] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [songTime, setSongTime] = useState<SongTime | null>(null);

  function handleSeek(e: number[]) {
    if (!audio) return;
    setIsSeeking(true);
    setSliderPos(e[0]);
  }

  useEffect(() => {
    if (isSeeking) return;
    if (!sliderRef.current) return;
    if (!audio?.src) return;
    const sliderThumb = sliderRef.current.querySelector('[role="slider"]');

    if (sliderThumb) {
      const value = sliderThumb.getAttribute("aria-valuenow");
      const meterCompletion = (Number(value) / 100) * audio.duration;
      audio.currentTime = +meterCompletion;
      const currentTime = formatTime(audio.currentTime);
      setSongTime((prev) => {
        if (!prev) return prev;
        return { ...prev, currentTime };
      });
    }
  }, [isSeeking]);

  // Handles the timing conversion
  useEffect(() => {
    if (!isPlaying) return;
    if (!songTime) handleSongData(null);
    audio?.addEventListener("loadedmetadata", handleSongData);

    const updateTime = setInterval(() => {
      if (!audio) return;
      const meterCompletion = (audio.currentTime / audio.duration) * 100;
      if (!isSeeking) {
        setSliderPos(+meterCompletion.toFixed(2));
        const currentTime = formatTime(audio?.currentTime);
        setSongTime((prev) => {
          if (!prev) return prev;
          return { ...prev, currentTime };
        });
      }
    }, 25);

    return () => {
      clearInterval(updateTime);
      audio?.removeEventListener("loadedmetadata", handleSongData);
    };
  }, [isPlaying, isSeeking]);

  function handleResetSong() {
    setSliderPos(0);
    setIsReset(false);

    setSongTime((prev) => {
      if (!prev) return prev;
      return { ...prev, currentTime: "0:00" };
    });
  }

  useEffect(() => {
    if (!isReset) return;
    audio?.addEventListener("timeupdate", handleResetSong);
    return () => audio?.removeEventListener("timeupdate", handleResetSong);
  }, [isReset]);

  function handleSongData(e: any) {
    if (!audio) return;
    let currentTime;
    let duration;
    if (!e) {
      currentTime = formatTime(audio?.currentTime);
      duration = formatTime(audio?.duration);
    } else {
      currentTime = formatTime(e.target.currentTime);
      duration = formatTime(e.target.duration);
    }
    audio?.play();
    setSongTime({
      currentTime,
      duration,
    });
  }

  return (
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
        {/* Rework this, can just use the audio's time */}
        <p>{songTime?.currentTime ?? "-:--"}</p>
        <p>{songTime?.duration ?? "-:--"}</p>
      </div>
    </div>
  );
}
