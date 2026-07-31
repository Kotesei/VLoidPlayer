import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  RefObject,
  ReactNode,
} from "react";
import { getMetaData } from "../helpers/metadata";
import { formatTime } from "../helpers/formatTime";

interface SongMetaData {
  songName?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverArt?: string[];
}

interface CoverArtProps {
  metadata: SongMetaData | null;
  isPlaying: boolean;
  audioRef: RefObject<HTMLAudioElement | null>;
}

interface MediaItem {
  src: string;
  currentDuration: string;
}

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  currentSong: MediaItem | null;
  setCurrentSong: (song: MediaItem | null) => void;
  metadata: SongMetaData | null;
  setMetadata: (data: SongMetaData | null) => void;
  nextSong: SongMetaData | null;
  setNextSong: (data: SongMetaData | null) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const sampleTrackList = [
  "sample1.flac",
  "sample2.flac",
  "sample3.flac",
  "sample4.flac",
  "sample5.flac",
];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<MediaItem | null>(null);
  const [metadata, setMetadata] = useState<SongMetaData | null>(null);
  const [nextSong, setNextSong] = useState<SongMetaData | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!metadata) return;
    if (!audioRef.current) return;
    if (!currentSong) return;
    console.log(metadata);
    const currentSongFile =
      currentSong.src.split("/")[currentSong.src.split("/").length - 1];

    const nextTrack =
      sampleTrackList[sampleTrackList.indexOf(currentSongFile) + 1];
    let src;
    if (!nextTrack) {
      src = `./src/assets/${sampleTrackList[0]}`;
    } else {
      src = `./src/assets/${nextTrack}`;
    }

    getMetaData(src, setNextSong);
    const audio = audioRef.current;

    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentSong((prev) => {
        if (!prev) return null;
        return { ...prev, currentDuration: String(metadata?.duration) };
      });
    });
  }, [metadata]);

  // Do stuff if song is playing
  useEffect(() => {
    // Runs the function to get the metadata for a song. Args: (song_location, metadata_state)

    if (!isPlaying) {
      audioRef.current?.pause();
    } else if (isPlaying) {
      audioRef.current?.play();
    }
  }, [isPlaying]);

  useEffect(() => {
    console.log(nextSong);
  }, [nextSong]);

  useEffect(() => {
    if (!currentSong) return;
    if (!metadata) getMetaData(currentSong.src, setMetadata);

    const timer = setInterval(() => {
      setCurrentSong((prev) => {
        if (!prev) {
          return {
            src: "",
            currentDuration: "-:--",
          };
        }

        if (audioRef.current) {
          const meterCompletion =
            (audioRef.current.currentTime / audioRef.current.duration) * 100;
          // if (!isSeeking) {
          //   setSliderPos(+meterCompletion.toFixed(2));
          // }
        }

        return {
          ...prev,
          currentDuration: formatTime(
            audioRef.current ? audioRef.current.currentTime : 0,
          ),
        };
      });
    }, 25);

    return () => clearInterval(timer);
  }, [audioRef.current, isPlaying]);
  // }, [audioRef.current, isSeeking, isPlaying]);

  async function handleLike() {
    if (!metadata) return;
    console.log(metadata);
    // Need to handle if the song already exists in liked list
    await window.dbHandlers.likeSong(null, metadata);
  }

  function handlePlayPause() {
    if (!currentSong) {
      const src = "./src/assets/sample2.flac";
      audioRef.current = new Audio(src);
      const song = {
        src,
        audio: audioRef.current,
        currentDuration: "0:00",
      };
      setCurrentSong(song);
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }

  function handlePreviousTrack() {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 2) {
      audioRef.current.currentTime = 0;
      setCurrentSong((prev) => {
        if (!prev) return null;
        return { ...prev, currentDuration: "0:00" };
      });

      // setSliderPos(0);
    } else {
      if (!currentSong) return;
      const currentSongFile =
        currentSong.src.split("/")[currentSong.src.split("/").length - 1];
      const prevTrack =
        sampleTrackList[sampleTrackList.indexOf(currentSongFile) - 1];
      if (prevTrack) {
        audioRef.current.src = "";
        const src = `./src/assets/${prevTrack}`;
        audioRef.current = new Audio(src);
        const song = {
          src,
          audio: audioRef.current,
          currentDuration: "0:00",
        };
        getMetaData(src, setMetadata);
        setCurrentSong(song);
        audioRef.current.play();
        setIsPlaying(true);
      } else {
        audioRef.current.currentTime = 0;
      }
    }
  }

  function handleNextTrack() {
    if (!currentSong) return;
    if (!audioRef.current) return;
    const currentSongFile =
      currentSong.src.split("/")[currentSong.src.split("/").length - 1];
    audioRef.current.src = "";
    let src;
    const nextTrack =
      sampleTrackList[sampleTrackList.indexOf(currentSongFile) + 1];
    if (!nextTrack) {
      src = `./src/assets/${sampleTrackList[0]}`;
    } else {
      src = `./src/assets/${nextTrack}`;
    }
    // audioRef.current = new Audio(src);
    const song = {
      src,
      audio: audioRef.current,
      currentDuration: "0:00",
    };
    getMetaData(src, setMetadata);
    setCurrentSong(song);
    // audioRef.current.play();
    setIsPlaying(true);
  }

  // useEffect(() => {
  //   if (isSeeking) return;
  //   if (!sliderRef.current) return;
  //   if (!audioRef.current) return;
  //   const sliderThumb = sliderRef.current.querySelector('[role="slider"]');

  //   if (sliderThumb) {
  //     const value = sliderThumb.getAttribute("aria-valuenow");
  //     const meterCompletion = (Number(value) / 100) * audioRef.current.duration;
  //     audioRef.current.currentTime = +meterCompletion;
  //   }
  // }, [isSeeking]);

  return (
    <AudioContext.Provider
      value={
        {
          isPlaying,
          setIsPlaying,
          currentSong,
          setCurrentSong,
          metadata,
          setMetadata,
          nextSong,
          setNextSong,
          audioRef,
          handleNextTrack,
          handlePlayPause,
          handlePreviousTrack,
          handleLike,
        } as AudioContextType
      }
    >
      {children}
      <audio ref={audioRef} src={currentSong?.src || undefined} />
    </AudioContext.Provider>
  );
}

//
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
