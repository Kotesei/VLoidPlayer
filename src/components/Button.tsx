import { useAudio } from "../context/AudioContext";

export function Button({
  shuffle,
  like,
  repeat,
  previous,
  playPause,
  skip,
  fill = "none",
  stroke = "currentColor",
  onClick,
  isPlaying,
}: {
  shuffle?: boolean;
  like?: boolean;
  repeat?: boolean;
  previous?: boolean;
  playPause?: boolean;
  skip?: boolean;
  fill?: string;
  stroke?: string;
  onClick?: () => Promise<void>;
  isPlaying?: boolean;
}) {
  const { loopState, isShuffling } = useAudio();
  return (
    <>
      {shuffle && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className={`ionicon w-[clamp(1.5rem,4vmin,2.5rem)]  ${!isShuffling ? "" : "drop-shadow-[0_0_2px_#fff]"}`}
          onClick={onClick}
        >
          <path
            d="m400 304 48 48-48 48M400 112l48 48-48 48M64 352h85.19a80 80 0 0 0 66.56-35.62L256 256"
            fill={fill}
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32px"
          />
          <path
            d="M64 160h85.19a80 80 0 0 1 66.56 35.62l80.5 120.76A80 80 0 0 0 362.81 352H416M416 160h-53.19a80 80 0 0 0-66.56 35.62L288 208"
            fill={fill}
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32px"
          />
        </svg>
      )}
      {like && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          onClick={onClick}
        >
          <path
            d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81"
            fill={fill}
            stroke={stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32px"
          />
        </svg>
      )}
      {repeat &&
        (loopState !== "single" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={`ionicon w-[clamp(1.5rem,4vmin,2.5rem)] ${loopState === "disabled" ? "" : "drop-shadow-[0_0_2px_#fff]"}`}
            onClick={onClick}
          >
            <path
              d="m320 120 48 48-48 48"
              fill={fill}
              stroke={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
            <path
              d="M352 168H144a80.24 80.24 0 0 0-80 80v16M192 392l-48-48 48-48"
              fill={fill}
              stroke={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
            <path
              d="M160 344h208a80.24 80.24 0 0 0 80-80v-16"
              fill={fill}
              stroke={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)] drop-shadow-[0_0_2px_#fff]"
            onClick={onClick}
          >
            <path
              d="M256 256s-48-96-126-96c-54.12 0-98 43-98 96s43.88 96 98 96c30 0 56.45-13.18 78-32M256 256s48 96 126 96c54.12 0 98-43 98-96s-43.88-96-98-96c-29.37 0-56.66 13.75-78 32"
              fill={fill}
              stroke={stroke}
              strokeLinecap="round"
              strokeMiterlimit="10"
              strokeWidth="48px"
            />
          </svg>
        ))}
      {previous && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          fill={fill === "none" ? "white" : fill}
          onClick={onClick}
        >
          <path d="M112 64a16 16 0 0 1 16 16v136.43L360.77 77.11a35.13 35.13 0 0 1 35.77-.44c12 6.8 19.46 20 19.46 34.33v290c0 14.37-7.46 27.53-19.46 34.33a35.14 35.14 0 0 1-35.77-.45L128 295.57V432a16 16 0 0 1-32 0V80a16 16 0 0 1 16-16" />
        </svg>
      )}

      {playPause &&
        (!isPlaying ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
            fill={fill === "none" ? "white" : fill}
            onClick={onClick}
          >
            <path d="M133 440a35.37 35.37 0 0 1-17.5-4.67c-12-6.8-19.46-20-19.46-34.33V111c0-14.37 7.46-27.53 19.46-34.33a35.13 35.13 0 0 1 35.77.45l247.85 148.36a36 36 0 0 1 0 61l-247.89 148.4A35.5 35.5 0 0 1 133 440" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)] "
            onClick={onClick}
          >
            <path
              d="M176 96h16v320h-16zM320 96h16v320h-16z"
              stroke={stroke}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
          </svg>
        ))}

      {skip && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          fill={fill === "none" ? "white" : fill}
          onClick={onClick}
        >
          <path d="M400 64a16 16 0 0 0-16 16v136.43L151.23 77.11a35.13 35.13 0 0 0-35.77-.44C103.46 83.47 96 96.63 96 111v290c0 14.37 7.46 27.53 19.46 34.33a35.14 35.14 0 0 0 35.77-.45L384 295.57V432a16 16 0 0 0 32 0V80a16 16 0 0 0-16-16" />
        </svg>
      )}
    </>
  );
}
