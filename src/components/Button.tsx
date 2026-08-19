import { ShuffledTracks } from "../context/AudioContext";
import { DBFile } from "../context/FileContext";

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
  likeSong,
  isPlaying,
  isShuffling,
  db,
  file,
  nextLike,
  loop,
  animation,
  visible,
  upload,
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
  likeSong?: () => any;
  isPlaying?: boolean;
  isShuffling?: ShuffledTracks;
  db?: DBFile[] | null;
  file?: DBFile | null;
  nextLike?: boolean;
  loop?: string;
  animation?: boolean;
  visible?: boolean;
  upload?: boolean;
}) {
  return (
    <>
      {upload && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          fill={fill}
          onClick={onClick}
        >
          <path d="M473.66 210c-14-10.38-31.2-18-49.36-22.11a16.11 16.11 0 0 1-12.19-12.22c-7.8-34.75-24.59-64.55-49.27-87.13C334.15 62.25 296.21 47.79 256 47.79c-35.35 0-68 11.08-94.37 32.05a150.1 150.1 0 0 0-42.06 53 16 16 0 0 1-11.31 8.87c-26.75 5.4-50.9 16.87-69.34 33.12C13.46 197.33 0 227.24 0 261.39c0 34.52 14.49 66 40.79 88.76 25.12 21.69 58.94 33.64 95.21 33.64h104V230.42l-36.69 36.69a16 16 0 0 1-23.16-.56c-5.8-6.37-5.24-16.3.85-22.39l63.69-63.68a16 16 0 0 1 22.62 0L331 244.14c6.28 6.29 6.64 16.6.39 22.91a16 16 0 0 1-22.68.06L272 230.42v153.37h124c31.34 0 59.91-8.8 80.45-24.77 23.26-18.1 35.55-44 35.55-74.83 0-29.94-13.26-55.61-38.34-74.19M240 448.21a16 16 0 1 0 32 0v-64.42h-32Z" />
        </svg>
      )}
      {visible
        ? animation && (
            <svg
              onClick={onClick}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
            >
              <circle
                cx="256"
                cy="56"
                r="40"
                fill={fill}
                stroke={stroke}
                strokeLinejoin="round"
                strokeWidth="32"
              />
              <path
                fill={fill}
                stroke={stroke}
                strokeLinejoin="round"
                strokeWidth="32"
                d="M204.23 274.44c2.9-18.06 4.2-35.52-.5-47.59-4-10.38-12.7-16.19-23.2-20.15L88 176.76c-12-4-23.21-10.7-24-23.94-1-17 14-28 29-24 0 0 88 31.14 163 31.14s162-31 162-31c18-5 30 9 30 23.79 0 14.21-11 19.21-24 23.94l-88 31.91c-8 3-21 9-26 18.18-6 10.75-5 29.53-2.1 47.59l5.9 29.63 37.41 163.9c2.8 13.15-6.3 25.44-19.4 27.74S308 489 304.12 476.28l-37.56-115.93q-2.71-8.34-4.8-16.87L256 320l-5.3 21.65q-2.52 10.35-5.8 20.48L208 476.18c-4 12.85-14.5 21.75-27.6 19.46s-22.4-15.59-19.46-27.74l37.39-163.83Z"
              />
            </svg>
          )
        : animation && (
            <svg
              onClick={onClick}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
            >
              <circle
                cx="256"
                cy="56"
                r="40"
                fill="none"
                stroke="red"
                strokeLinejoin="round"
                strokeWidth="32"
              />
              <path
                fill="none"
                stroke="red"
                strokeLinejoin="round"
                strokeWidth="32"
                d="M204.23 274.44c2.9-18.06 4.2-35.52-.5-47.59-4-10.38-12.7-16.19-23.2-20.15L88 176.76c-12-4-23.21-10.7-24-23.94-1-17 14-28 29-24 0 0 88 31.14 163 31.14s162-31 162-31c18-5 30 9 30 23.79 0 14.21-11 19.21-24 23.94l-88 31.91c-8 3-21 9-26 18.18-6 10.75-5 29.53-2.1 47.59l5.9 29.63 37.41 163.9c2.8 13.15-6.3 25.44-19.4 27.74S308 489 304.12 476.28l-37.56-115.93q-2.71-8.34-4.8-16.87L256 320l-5.3 21.65q-2.52 10.35-5.8 20.48L208 476.18c-4 12.85-14.5 21.75-27.6 19.46s-22.4-15.59-19.46-27.74l37.39-163.83Z"
              />
            </svg>
          )}
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
      {like && db?.find((dbFile) => dbFile === file) ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          onClick={likeSong}
        >
          <path
            d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81"
            fill={fill}
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32px"
          />
        </svg>
      ) : (
        like && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
            onClick={likeSong}
          >
            <path
              d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81"
              stroke={stroke}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
          </svg>
        )
      )}
      {nextLike && db?.find((dbFile) => dbFile === file) ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
          className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
          onClick={likeSong}
        >
          <path
            d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81"
            fill={fill}
            stroke={fill}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="32px"
          />
        </svg>
      ) : (
        nextLike && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)]"
            onClick={likeSong}
          >
            <path
              d="M352.92 80C288 80 256 144 256 144s-32-64-96.92-64c-52.76 0-94.54 44.14-95.08 96.81-1.1 109.33 86.73 187.08 183 252.42a16 16 0 0 0 18 0c96.26-65.34 184.09-143.09 183-252.42-.54-52.67-42.32-96.81-95.08-96.81"
              stroke={stroke}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="32px"
            />
          </svg>
        )
      )}
      {repeat &&
        (loop !== "single" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className={`ionicon w-[clamp(1.5rem,4vmin,2.5rem)] ${loop === "disabled" ? "" : "drop-shadow-[0_0_2px_#fff]"}`}
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
