import { useEffect, useState } from "react";
import { animate } from "../helpers/animate";
import { useAudio } from "../context/AudioContext";
import { Button } from "./Button";
import { useFiles } from "../context/FileContext";

export function CoverArt() {
  const { isPlaying, currentSong } = useAudio();
  const { setUploadState, coverArtRef, animationRef } = useFiles();
  const [initialized, setInitialized] = useState(false);
  const [width, setWidth] = useState<String | null>(null);
  // Will probably move this for speed control of the animation in the context in the future
  const [currentSpeed, setSpeed] = useState<number>(2);
  const [animationVisibility, setAnimationVisibility] = useState(true);

  async function toggleAnimation() {
    setAnimationVisibility(!animationVisibility);
  }

  async function goToUploadPage() {
    setUploadState(true);
  }

  useEffect(() => {
    if (!animationRef.current?.item?.isLoaded) return;
    if (!currentSong?.metadata) return;
    if (animationVisibility) {
      if (!animationRef.current?.item) return;
      animationRef.current.item.show();
    } else {
      animationRef.current.item.hide();
    }
  }, [animationVisibility]);

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
  }, [isPlaying, animationRef]);

  useEffect(() => {
    return () => handleResize();
  }, []);

  function handleResize() {
    setWidth(
      `${coverArtRef.current?.getBoundingClientRect().width.toFixed(0)}px`,
    );
  }
  useEffect(() => {
    if (!coverArtRef.current) return;
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [coverArtRef]);

  useEffect(() => {
    if (!animationVisibility) return;
    if (!isPlaying) return;
    if (initialized) return;
    if (!coverArtRef.current) return;
    const src = "./src/assets/test2.json";
    const animation = animate(coverArtRef.current, src);
    animation.setSpeed(currentSpeed);
    animationRef.current = { src, item: animation };
    setInitialized(true);
  }, [initialized, isPlaying, animationVisibility]);

  return (
    <>
      <div
        style={{ width: `${width}` }}
        className="flex justify-between h-fit items-center mb-[2dvh]"
      >
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
        style={{
          backgroundImage: `url(${currentSong?.metadata?.coverArtURL})`,
        }}
        className="border-purple-300 border-2 min-w-50 min-h-50 aspect-square h-[65dvw] bg-[url] bg-cover pointer-events-none"
        id="coverArt"
      ></div>
    </>
  );
}
