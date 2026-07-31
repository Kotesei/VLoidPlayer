import { useEffect, useRef, useState } from "react";
import { animate } from "../helpers/animation";
import { AnimationItem } from "lottie-web";

export function CoverArt({ metadata, isPlaying }: CoverArtProps) {
  const [currentSpeed, setSpeed] = useState<number>(1);
  const [anim, setAnim] = useState<string | null>(null);
  const [animData, setAnimData] = useState<AnimationItem | null>(null);
  const coverArtRef = useRef(null);

  useEffect(() => {
    if (!coverArtRef.current || !anim) return;
    const animation = animate(coverArtRef.current, anim);
    animation.setSpeed(currentSpeed);
    setAnimData(animation);

    return () => animation.destroy();
  }, [anim]);

  useEffect(() => {
    // Set an animation for now (Need to change this to be more dynamic)
    if (isPlaying && !anim) setAnim("./src/assets/test2.json");
    console.log(isPlaying);
    if (!animData) return;
    if (!isPlaying) {
      animData.setSpeed(0);
    } else {
      animData.setSpeed(currentSpeed);
    }
  }, [isPlaying]);

  return (
    <div
      ref={coverArtRef}
      style={{ backgroundImage: `url(${metadata?.coverArt})` }}
      className="border-purple-300 border-2 min-w-50 min-h-50 aspect-square h-[65dvw] bg-[url] bg-cover"
      id="coverArt"
    ></div>
  );
}
