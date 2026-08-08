import { useEffect, useRef, useState } from "react";
import { animate } from "../helpers/animate";
import { AnimationItem } from "lottie-web";
import { useAudio } from "../context/AudioContext";

interface AnimationData {
  src: string | null;
  item: AnimationItem | null;
}
export function CoverArt() {
  const { metadata, isPlaying } = useAudio();
  const coverArtRef = useRef(null);
  // Will probably move this for speed control of the animation in the context in the future
  const [currentSpeed, setSpeed] = useState<number>(1);
  // Contains the animation data
  const animationRef = useRef<AnimationData | null>(null);

  useEffect(() => {
    if (!coverArtRef.current) return;
    // Set an animation for now (Need to change this to be more dynamic)
    if (!animationRef.current) {
      if (!isPlaying) return;
    }
    if (!isPlaying) {
      // Stops the animation
      animationRef.current?.item?.setSpeed(0);
    } else {
      // Plays the animation at whatever the speed set was
      animationRef.current?.item?.setSpeed(currentSpeed);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!coverArtRef.current) return;
    const src = "./src/assets/test.json";
    const animation = animate(coverArtRef.current, src);
    animationRef.current = { src, item: animation };
    animationRef.current.item?.hide();
    return () => animation.destroy();
  }, []);

  useEffect(() => {
    if (metadata) animationRef.current?.item?.show();
  }, [metadata]);

  return (
    <>
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
        ref={coverArtRef}
        style={{ backgroundImage: `url(${metadata?.coverArtURL})` }}
        className="border-purple-300 border-2 min-w-50 min-h-50 aspect-square h-[65dvw] bg-[url] bg-cover pointer-events-none"
        id="coverArt"
      ></div>
    </>
  );
}
