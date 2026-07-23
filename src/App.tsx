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
            className="border-purple-300 bg-black border-2 min-w-50 min-h-50 mb-2"
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
        <div
          className="h-[20%] w-full items-center gap-2 flex flex-col justify-end"
          id="queue"
        >
          <div className="flex flex-col items-center flex-1 pt-1">
            <h2 className="text-purple-300 text-[11px]">Playing From</h2>
            <p className="text-purple-300 text-[10px]">
              Song Playlist Location
            </p>
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
