import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import { getMetaData } from "../helpers/metadata";
import { handleNextTrack } from "../helpers/audio/next";

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
  setCurrentSong: React.Dispatch<React.SetStateAction<string | null>>;

  metadata: SongMetaData | null;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;

  nextSong: SongMetaData | null;
  setNextSong: React.Dispatch<React.SetStateAction<MediaItem | null>>;

  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  audio: HTMLAudioElement | null;

  loopState: string;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;

  onEnded: (e: Event) => void;

  trackList: string[];

  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}

export interface ShuffledTracks {
  trackList: string[];
  shuffledTrackList: string[];
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
  // Contains the tracklist
  const [trackList, setTrackList] = useState<string[]>(sampleTrackList);
  const [isShuffling, setIsShuffling] = useState<ShuffledTracks | false>(false);
  // check/set when user is playing song
  const [isPlaying, setIsPlaying] = useState(false);
  // currentsong is just file location of the song
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  // holds the data such as the cover art, song, artist, album, song duration etc
  const [metadata, setMetadata] = useState<SongMetaData | null>(null);
  // same as metadata but contains the next set of data
  // Will probably have to make something just like this for a queue system (Skipping current and next song to avoid duplicate calls)
  const [nextSong, setNextSong] = useState<SongMetaData | null>(null);
  // Checks if song has been reset
  const [isReset, setIsReset] = useState<boolean>(false);
  // Loop state to handle repeat once or repeat list or repeat none
  const [loopState, setLoopState] = useState("disabled");
  // Audio container
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audio = audioRef.current;

  // Used to memorize the function in order to change the listener when switching between loop modes or when metadata changes
  const onEnded = useCallback(
    (e: Event) =>
      handleNextTrack(e, true, {
        metadata,
        currentSong,
        audio,
        loopState,
        trackList,
        setIsPlaying,
        setIsReset,
        setMetadata,
        setCurrentSong,
        isShuffling,
      }),
    [loopState, metadata],
  );

  // Runs after song ends
  useEffect(() => {
    if (!audio) return;
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [onEnded]);

  // Checks if there is metadata [Debugging]
  useEffect(() => {
    if (!metadata) return;
    if (!audio) return;
    if (!currentSong) return;

    // Don't really like this might clean it a bit more later on
    //////////////////////////////////
    // Set the current song name.

    const currentSongFile =
      currentSong.split("/")[currentSong.split("/").length - 1];
    // Set the next song file name.
    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSongFile) + 1
        ]
      : trackList[trackList.indexOf(currentSongFile) + 1];
    let src;

    // Checks if there is another track afterwards, if not then it will just set the next track to be the first song in the list.
    if (!nextTrack) {
      src = isShuffling
        ? `./src/assets/${isShuffling.shuffledTrackList[0]}`
        : `./src/assets/${trackList[0]}`;

      if (loopState === "list") {
        // If the loop mode is set to "list", it will update the Queue to show the first song of a list be the next song.
        getMetaData(src, setNextSong);
      } else {
        // If not list mode then there will be no next song in the Queue.
        setNextSong(null);
      }
      // Else if not the last track on the list.
    } else {
      src = `./src/assets/${nextTrack}`;
    }
    //////////////////////////////////
    //Gets the metadata for the next song (ONLY if there is a next song!!) once current metadata is found.
    if (nextTrack) getMetaData(src, setNextSong);

    // Go to next track in the queue once song ends
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [metadata, isShuffling]);

  // Do stuff if song is playing
  useEffect(() => {
    if (!isPlaying) {
      // Pause song
      audio?.pause();
    } else if (isPlaying) {
      // Runs the function to get the metadata for a song. Args: (song_location, metadata_state) only if there is no metadata
      if (!metadata) getMetaData(songSrc, setMetadata);
      // Play song
      audio?.play();
    }
  }, [isPlaying]);

  ///////////////////////////
  // Starting State (This is mostly for debugging) //
  const songSrc = "./src/assets/sample3.flac";
  useEffect(() => {
    setCurrentSong(songSrc);
  }, []);
  ///////////////////////////

  // This is for any loop state changes
  useEffect(() => {
    if (!metadata) return;
    audio?.removeEventListener("ended", onEnded);
    const currentSongFile =
      currentSong?.split("/")[currentSong.split("/").length - 1];
    if (!currentSongFile) return;
    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSongFile) + 1
        ]
      : trackList[trackList.indexOf(currentSongFile) + 1];
    switch (loopState) {
      // Loop List
      case "list":
        if (!nextTrack) {
          const src = isShuffling
            ? `./src/assets/${isShuffling.shuffledTrackList[0]}`
            : `./src/assets/${trackList[0]}`;
          getMetaData(src, setNextSong);
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
          metadata,
          setMetadata,
          nextSong,
          setNextSong,
          audio,
          isReset,
          setIsReset,
          loopState,
          setLoopState,
          trackList,
          onEnded,
          isShuffling,
          setIsShuffling,
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
