import { useEffect, useRef, useState } from "react";
import { animate } from "../helpers/animate";
import { AnimationItem } from "lottie-web";
import { useAudio } from "../context/AudioContext";
import { Button } from "./Button";
import { useFiles } from "../context/FileContext";

interface AnimationData {
  src: string | null;
  item: AnimationItem | null;
}
export function CoverArt() {
  const { metadata, isPlaying, setMetadata } = useAudio();
  const { setUploadState } = useFiles();
  const coverArtRef = useRef(null);
  // Will probably move this for speed control of the animation in the context in the future
  const [currentSpeed, setSpeed] = useState<number>(1);
  const [animationVisibility, setAnimationVisibility] = useState(true);
  // Contains the animation data
  const animationRef = useRef<AnimationData | null>(null);

  async function toggleAnimation() {
    setAnimationVisibility(!animationVisibility);
  }

  async function goToUploadPage() {
    setUploadState(true);
    setMetadata(null);
  }
  useEffect(() => {
    if (!animationRef.current?.item || !animationRef.current.item.isLoaded)
      return;
    if (animationVisibility) {
      animationRef.current.item.show();
    } else {
      animationRef.current.item.hide();
    }
  }, [animationVisibility, animationRef.current]);
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
    const src = "./src/assets/test2.json";
    const animation = animate(coverArtRef.current, src);
    animationRef.current = { src, item: animation };
    animationRef.current.item?.hide();
    return () => animation.destroy();
  }, [coverArtRef.current]);

  useEffect(() => {
    if (!animationVisibility) return;
    if (metadata) animationRef.current?.item?.show();
  }, [metadata]);

  return (
    <>
      <div className="flex w-full justify-between h-5.5 items-center mb-2">
        <Button
          upload
          fill="oklch(82.7% 0.119 306.383)"
          onClick={goToUploadPage}
        />

        <Button
          fill="oklch(82.7% 0.119 306.383)"
          stroke="oklch(82.7% 0.119 306.383)"
          visible={animationVisibility}
          animation
          onClick={toggleAnimation}
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
