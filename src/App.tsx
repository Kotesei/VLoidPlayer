import "./App.css";
import Lottie from "lottie-web";
import { useEffect, useRef } from "react";

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const animation = Lottie.loadAnimation({
      container: containerRef.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "./src/assets/test.json",
    });

    return () => {
      animation.destroy();
    };
  }, []);

  return (
    <>
      <div className="h-full w-full flex-col flex">
        <div className="h-[18%] w-full" id="navigation">
          <div className="text-purple-300 flex-1 flex flex-col h-full justify-center">
            <h2 className="text-[10px] leading-2.5 flex justify-center">
              Artist
            </h2>
            <h2 className="text-xs flex  leading-3.5 justify-center">
              Song Name Sample 1
            </h2>
            <h2 className="text-[10px] flex leading-3.5 justify-center">
              Album Name
            </h2>
          </div>
        </div>
        <div
          className="h-[62%] w-full py-2 flex flex-col items-center px-13"
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
            className="border-purple-300 bg-slate-800 border-2 min-w-50 min-h-50 mb-2"
            id="coverArt"
          ></div>
          <div className="w-full flex-1">
            <div className="flex justify-between">
              <img className="h-5 invert-100" src="./src/assets/shuffle.svg" />
              <img
                className="h-5 invert-100"
                src="./src/assets/heart-outline.svg"
              />
              <img className="h-5 invert-100" src="./src/assets/repeat.svg" />
            </div>
            <div className="w-full h-5 mt-5">
              <div className="w-full h-[1.5px] bg-purple-300 relative">
                <div className="h-3 w-3 absolute translate-y-1/2 bottom-0 left-15 bg-purple-300 rounded-full"></div>
              </div>
              <div className="text-purple-300 flex justify-between text-[9px] pt-1">
                <p>0:30</p>
                <p>1:49</p>
              </div>
            </div>
            <div className="flex justify-around px-5">
              <img
                className="h-5 invert-100"
                src="./src/assets/play-skip-back.svg"
              />
              <img className="h-5 invert-100" src="./src/assets/play.svg" />
              <img
                className="h-5 invert-100"
                src="./src/assets/play-skip-forward.svg"
              />
            </div>
          </div>
        </div>
        <div className="h-[20%] w-full" id="queue"></div>
      </div>
    </>
  );
}

export default App;
