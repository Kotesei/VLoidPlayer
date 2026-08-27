import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { handleNextTrack } from "../helpers/audio/next";
import { DBFile, useFiles } from "./FileContext";
import { IPicture } from "music-metadata";
import { handleShuffle } from "../helpers/audio/shuffle";

// Types
export interface SongMetaData {
  song_name?: string;
  artist?: string;
  album?: string;
  duration?: string;
  coverArt?: IPicture | null;
  coverArtURL?: string | null;
}

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  currentSong: DBFile | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<DBFile | null>>;

  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  audio: HTMLAudioElement | null;

  loopState: string;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;

  onEnded: (e: Event) => void;

  showingQueue: boolean;
  setShowingQueue: React.Dispatch<React.SetStateAction<boolean>>;

  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}

export interface ShuffledTracks {
  validFiles: DBFile[];
  shuffledTrackList: DBFile[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const { validFiles, uploadState } = useFiles();
  // State for shuffling the song list, contains the original array of songs and the shuffled version
  const [isShuffling, setIsShuffling] = useState<ShuffledTracks | false>(false);
  // Checks/Sets when user is playing a song
  const [isPlaying, setIsPlaying] = useState(false);
  // CurrentSong contains the file and metadata of the song.
  const [currentSong, setCurrentSong] = useState<DBFile | null>(null);
  // Checks if song has been reset (Useful for single loop)
  const [isReset, setIsReset] = useState<boolean>(false);
  // Loop state to handle repeat once/list/disabled
  const [loopState, setLoopState] = useState("disabled");
  // Audio container
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Checks if the queue menu is showing or not (This contains a list of all the songs from validFiles or the isShuffling shuffled tracks)
  const [showingQueue, setShowingQueue] = useState<boolean>(false);
  // Store the audio ref in a const for easier usage
  const audio = audioRef.current;

  // Turns off the music when going to upload page
  useEffect(() => {
    if (!uploadState) return;
    setIsPlaying(false);
  }, [uploadState, audioRef]);

  // Used to memorize the function in order to change the listener when switching between loop/shuffle modes or when metadata changes
  const onEnded = useCallback(
    (e: Event) =>
      handleNextTrack(e, true, {
        currentSong,
        audio,
        loopState,
        validFiles,
        setIsPlaying,
        setIsReset,
        setCurrentSong,
        isShuffling,
      }),
    [loopState, currentSong, isShuffling, validFiles],
  );

  // Updates the event listener when the song ends
  useEffect(() => {
    if (!currentSong) return;
    audio?.addEventListener("ended", onEnded);
    return () => audio?.removeEventListener("ended", onEnded);
  }, [loopState, currentSong, isShuffling, onEnded]);

  // Updates the tab to current song or if uploading/not playing
  useEffect(() => {
    if (!currentSong) return;
    if (uploadState) {
      document.title = "Upload Files - VLoid Player ";
    } else {
      document.title = "Not Playing - VLoid Player";
    }
    if (!isPlaying) return;
    document.title = currentSong?.metadata.song_name ?? "VLoid Player";
  }, [currentSong, isPlaying, uploadState]);

  // Pause/Play the audio
  useEffect(() => {
    if (!currentSong) return;
    if (!isPlaying) {
      audio?.pause();
    } else if (isPlaying) {
      audio?.play();
    }
  }, [isPlaying]);

  // Updates whenever files are added/removed and ensures the app will change the current song if it is deleted.
  useEffect(() => {
    if (!validFiles?.length) return;
    if (!audio) return;

    if (uploadState) {
      if (isShuffling) {
        const song = validFiles.find((song) => song.file === currentSong?.file);
        handleShuffle({
          currentSong: song ?? validFiles[0],
          validFiles,
          setIsShuffling,
        });
        audio.src = URL.createObjectURL(song?.file ?? validFiles[0].file);
        setCurrentSong(song ?? validFiles[0]);
      } else {
        setCurrentSong(validFiles[0]);
        audio.src = URL.createObjectURL(validFiles[0].file);
      }
    }
  }, [validFiles, uploadState]);

  return (
    <AudioContext.Provider
      value={
        {
          isPlaying,
          setIsPlaying,
          currentSong,
          setCurrentSong,
          audio,
          isReset,
          setIsReset,
          loopState,
          setLoopState,
          onEnded,
          isShuffling,
          setIsShuffling,
          showingQueue,
          setShowingQueue,
        } as AudioContextType
      }
    >
      {children}
      <audio ref={audioRef} />
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
