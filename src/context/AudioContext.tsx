import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
} from "react";
import { getMetaData } from "../helpers/metadata";

// Types
export interface SongMetaData {
  songName?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverArt?: string[];
}

export interface MediaItem {
  src: string;
  currentDuration: string;
}

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  currentSong: string | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<MediaItem | null>>;

  metadata: SongMetaData | null;
  setMetadata: React.Dispatch<React.SetStateAction<MediaItem | null>>;

  nextSong: SongMetaData | null;
  setNextSong: React.Dispatch<React.SetStateAction<MediaItem | null>>;

  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  audioRef: React.RefObject<HTMLAudioElement | null>;

  handleLike: () => Promise<void>;
  handlePreviousTrack: () => Promise<void>;
  handleNextTrack: () => Promise<void>;
  handlePlayPause: () => Promise<void>;
}

// Sample track list (Will change this for more real world usage later on)
const sampleTrackList = [
  "sample1.flac",
  "sample2.flac",
  "sample3.flac",
  "sample4.flac",
  "sample5.flac",
];

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  // check/set when user is playing song
  const [isPlaying, setIsPlaying] = useState(false);
  // currentsong is just file location of the song
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  // holds the data such as the cover art, song, artist, album, song duration etc
  const [metadata, setMetadata] = useState<SongMetaData | null>(null);
  // same as metadata but contains the next set of data
  // Will probably have to make something just like this for a queue system (Skipping current and next song to avoid duplicate calls)
  const [nextSong, setNextSong] = useState<SongMetaData | null>(null);

  const [isReset, setIsReset] = useState<boolean>(false);
  // Container for the song
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!metadata) return;
    if (!audioRef.current) return;
    if (!currentSong) return;
    // Don't really like this might clean it a bit more later on
    //////////////////////////////////
    const currentSongFile =
      currentSong.split("/")[currentSong.split("/").length - 1];

    const nextTrack =
      sampleTrackList[sampleTrackList.indexOf(currentSongFile) + 1];
    let src;
    if (!nextTrack) {
      // For now have the list of songs loop back to the first song when out of songs in queue
      src = `./src/assets/${sampleTrackList[0]}`;
    } else {
      // Proceed to next track
      src = `./src/assets/${nextTrack}`;
    }
    //////////////////////////////////

    //Gets the metadata for the next song once current metadata is found
    getMetaData(src, setNextSong);
    // Go to next track in the queue once song ends
    audioRef.current.addEventListener("ended", handleNextTrack);
    return () =>
      audioRef.current?.removeEventListener("ended", handleNextTrack);
  }, [metadata]);

  // Do stuff if song is playing
  useEffect(() => {
    if (!isPlaying) {
      // Pause song
      audioRef.current?.pause();
    } else if (isPlaying) {
      // Runs the function to get the metadata for a song. Args: (song_location, metadata_state) only if there is no metadata
      if (!metadata) getMetaData(songSrc, setMetadata);
      // Play song
      audioRef.current?.play();
    }
  }, [isPlaying]);

  async function handleLike() {
    if (!metadata) return;
    console.log(metadata);
    ///////////// IndexedDB /////////////////
    // Need to figure out how this works for web version release

    ///////////// SQLite /////////////////
    // Need to handle if the song already exists in liked list
    await window.dbHandlers.likeSong(null, metadata);
  }

  const songSrc = "./src/assets/sample3.flac";
  useEffect(() => {
    setCurrentSong(songSrc);
  }, []);

  function handlePlayPause() {
    setIsPlaying(!isPlaying);
  }

  function handlePreviousTrack() {
    if (!audioRef.current) return;
    if (audioRef.current.currentTime > 2) {
      audioRef.current.currentTime = 0;
      setIsReset(true);
    } else {
      if (!currentSong) return;
      const currentSongFile =
        currentSong.split("/")[currentSong.split("/").length - 1];
      const prevTrack =
        sampleTrackList[sampleTrackList.indexOf(currentSongFile) - 1];
      if (prevTrack) {
        audioRef.current.src = "";
        const src = `./src/assets/${prevTrack}`;
        setIsReset(false);
        getMetaData(src, setMetadata);
        setCurrentSong(src);
        if (!isPlaying) setIsPlaying(true);
      } else {
        // This is when trying to go to previous track on the start of a list
        audioRef.current.currentTime = 0;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  }

  function handleNextTrack() {
    if (!currentSong) return;
    if (!audioRef.current) return;
    const currentSongFile =
      currentSong.split("/")[currentSong.split("/").length - 1];
    let src;
    const nextTrack =
      sampleTrackList[sampleTrackList.indexOf(currentSongFile) + 1];
    if (!nextTrack) {
      src = `./src/assets/${sampleTrackList[0]}`;
    } else {
      src = `./src/assets/${nextTrack}`;
    }
    // audioRef.current = new Audio(src);
    getMetaData(src, setMetadata);
    setCurrentSong(src);
    setIsPlaying(true);
  }

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
          isReset,
          setIsReset,
        } as AudioContextType
      }
    >
      {children}
      <audio ref={audioRef} src={currentSong || undefined} />
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
