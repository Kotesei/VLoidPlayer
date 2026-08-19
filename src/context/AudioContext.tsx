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

  nextSong: DBFile | null;
  setNextSong: React.Dispatch<React.SetStateAction<DBFile | null>>;

  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  audio: HTMLAudioElement | null;

  loopState: string;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;

  onEnded: (e: Event) => void;

  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}

export interface ShuffledTracks {
  validFiles: DBFile[];
  shuffledTrackList: DBFile[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Contains the tracklist
  const { validFiles, uploadState } = useFiles();

  useEffect(() => {
    if (!validFiles) return;
    if (!audio) return;
    if (uploadState) return;

    const firstTrack = validFiles[0].file;
    audio.src = URL.createObjectURL(firstTrack);
  }, [validFiles, uploadState]);

  const [isShuffling, setIsShuffling] = useState<ShuffledTracks | false>(false);
  // check/set when user is playing song
  const [isPlaying, setIsPlaying] = useState(false);
  // currentsong is just file location of the song
  const [currentSong, setCurrentSong] = useState<DBFile | null>(null);
  // same as metadata but contains the next set of data
  // Will probably have to make something just like this for a queue system (Skipping current and next song to avoid duplicate calls)
  const [nextSong, setNextSong] = useState<DBFile | null>(null);
  // Checks if song has been reset
  const [isReset, setIsReset] = useState<boolean>(false);
  // Loop state to handle repeat once or repeat list or repeat none
  const [loopState, setLoopState] = useState("disabled");
  // Audio container
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;

  useEffect(() => {
    if (!uploadState) return;
    setIsPlaying(false);
  }, [uploadState, audioRef]);

  // Used to memorize the function in order to change the listener when switching between loop modes or when metadata changes
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
    [loopState, currentSong, isShuffling],
  );

  // Runs after song ends
  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [onEnded]);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!audio) return;
    if (!currentSong) return;
    if (!validFiles) return;
    // Don't really like this might clean it a bit more later on
    //////////////////////////////////

    // Set the next song file name.
    const currentIndex = validFiles.findIndex((item) => item === currentSong);

    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.findIndex(
            (item) => item === currentSong,
          ) + 1
        ]
      : validFiles[currentIndex + 1];
    let song;

    // Checks if there is another track afterwards, if not then it will just set the next track to be the first song in the list.
    if (!nextTrack) {
      song = isShuffling ? isShuffling.shuffledTrackList[0] : validFiles[0];

      if (loopState === "list") {
        // If the loop mode is set to "list", it will update the Queue to show the first song of a list be the next song.
        // getMetaData(song, { setNextSong });
      } else {
        // If not list mode then there will be no next song in the Queue.
        setNextSong(null);
      }
      // Else if not the last track on the list.
    } else {
      song = nextTrack;
    }
    //////////////////////////////////
    //Gets the metadata for the next song (ONLY if there is a next song!!) once current metadata is found.
    // if (nextTrack) getMetaData(song, { setNextSong });
    console.log(nextTrack);
    console.log(validFiles);

    // Go to next track in the queue once song ends
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [currentSong, isShuffling]);

  useEffect(() => {
    if (!isPlaying) return;
    document.title = currentSong?.metadata.song_name ?? "VLoid Player";
  }, [currentSong, isPlaying]);

  // Do stuff if song is playing
  useEffect(() => {
    if (!currentSong) return;
    if (!isPlaying) {
      // Pause song
      audio?.pause();
    } else if (isPlaying) {
      // Runs the function to get the metadata for a song. Args: (song_location, metadata_state) only if there is no metadata
      // if (!metadata) getMetaData(currentSong.file, { setMetadata });
      // Play song
      audio?.play();
    }
  }, [isPlaying, validFiles]);

  ///////////////////////////
  // Starting State (This is mostly for debugging) //
  useEffect(() => {
    if (!validFiles) return;
    if (uploadState) return;
    setCurrentSong(validFiles[0]);
    // setUploadState(false);
  }, [validFiles, uploadState]);
  ///////////////////////////

  // This is for any loop state changes
  useEffect(() => {
    if (!currentSong) return;
    if (!validFiles) return;
    const currentIndex = validFiles.findIndex((item) => {
      const file = "file" in item.file ? item.file : item;

      return file === currentSong;
    });
    audio?.removeEventListener("ended", onEnded);
    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSong) + 1
        ]
      : validFiles[currentIndex + 1];
    switch (loopState) {
      // Loop List
      case "list":
        if (!nextTrack) {
          const firstSongOfList = isShuffling
            ? isShuffling.shuffledTrackList[0]
            : validFiles[0];

          // getMetaData(firstSongOfList, { setNextSong });
        }
        break;
      // Single Song
      case "single":
        if (!nextTrack) {
          setNextSong(null);
        }
        break;
      // Disable Loop
      case "disabled":
        if (!nextTrack) {
          setNextSong(null);
        }
        break;
    }
    audio?.addEventListener("ended", onEnded);
    return () => audio?.removeEventListener("ended", onEnded);
  }, [loopState]);

  return (
    <AudioContext.Provider
      value={
        {
          isPlaying,
          setIsPlaying,
          currentSong,
          setCurrentSong,
          nextSong,
          setNextSong,
          audio,
          isReset,
          setIsReset,
          loopState,
          setLoopState,
          onEnded,
          isShuffling,
          setIsShuffling,
        } as AudioContextType
      }
    >
      {children}
      <audio ref={audioRef} />
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
