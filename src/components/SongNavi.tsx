import * as Slider from "@radix-ui/react-slider";
import { useRef, useState } from "react";

export function SongNavi({ metadata, audioRef }: CoverArtProps) {
  const sliderRef = useRef<HTMLSpanElement>(null);
  const [sliderPos, setSliderPos] = useState<number>(0);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);

  function handleSeek(e: number[]) {
    if (!audioRef.current) return;
    setIsSeeking(true);
    setSliderPos(e[0]);
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
        <p>{metadata?.duration ? currentSong?.currentDuration : "-:--"}</p>
        <p>{metadata?.duration ?? "-:--"}</p>
      </div>
    </div>
  );
}
