import { useEffect, useRef, useState } from "react";
import { animate } from "../helpers/animate";
import { AnimationData } from "../context/FileContext";

export function Search() {
  const searchContainer = useRef<HTMLDivElement>(null);
  const searchAnimationRef = useRef<AnimationData | null>(null);

  const [searchState, setSearchState] = useState({
    hover: false,
    active: false,
  });

  const [looping, setLooping] = useState(false);

  useEffect(() => {
    if (!searchContainer.current) return;

    const src = "./src/assets/searchBtn/search_full.json";
    console.log(src);

    const animation = animate(searchContainer.current, src);
    searchAnimationRef.current = { src, item: animation };
    animation.addEventListener("DOMLoaded", () => animation.stop());
    return () => {
      animation.destroy();
    };
  }, [searchContainer]);

  useEffect(() => {
    const animation = searchAnimationRef.current?.item;
    const currentFrame = Number(animation?.currentFrame);
    function loop() {
      animation?.playSegments([30, 70], true);
      animation?.setLoop(true);
      setLooping(true);
    }

    if (searchState.active) {
      animation?.setSpeed(1.5);
      animation?.removeEventListener("complete", loop);
      animation?.setSegment(
        animation.currentFrame < 69 ? animation.currentFrame : 70,
        150,
      );
      animation?.play();
      animation?.setLoop(false);
      console.log(currentFrame);
      return;
    }

    if (searchState.hover) {
      animation?.setSpeed(1);
      animation?.playSegments(
        [looping ? currentFrame + 30 : currentFrame, 30],
        true,
      );
      animation?.addEventListener("complete", loop);
    } else {
      animation?.playSegments(
        [looping ? currentFrame + 30 : currentFrame, 0],
        true,
      );
      animation?.setLoop(false);
      setLooping(false);
      animation?.removeEventListener("complete", loop);
      animation?.setSpeed(1.5);
    }

    return () => {
      if (!searchState.active && !searchState.hover) return;
      animation?.removeEventListener("complete", loop);
    };
  }, [searchState]);

  //   top-20 z-1
  return (
    <div className="absolute max-w-[clamp(1.5rem,4vmin,3rem)] max-h-[clamp(1.5rem,4vmin,3rem)] bottom-[150%] left-[50%] -translate-x-1/2">
      <div
        onMouseEnter={() =>
          setSearchState((prev) => {
            return { ...prev, hover: true };
          })
        }
        onMouseLeave={() =>
          setSearchState((prev) => {
            return { ...prev, hover: false };
          })
        }
        onClick={() =>
          setSearchState((prev) => {
            return { ...prev, active: true };
          })
        }
        className="absolute w-full h-full z-10"
      ></div>
      <div className="scale-950" ref={searchContainer}></div>
    </div>
  );
}
