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
import { useFiles } from "./FileContext";

// Types
export interface SongMetaData {
  song_name?: string;
  artist?: string;
  album?: string;
  duration?: number;
  coverArt?: string[];
  coverArtURL?: string | null;
}

interface AudioContextType {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;

  currentSong: File | null;
  setCurrentSong: React.Dispatch<React.SetStateAction<File | null>>;

  metadata: SongMetaData | null;
  setMetadata: React.Dispatch<React.SetStateAction<SongMetaData | null>>;

  nextSong: SongMetaData | null;
  setNextSong: React.Dispatch<React.SetStateAction<File | null>>;

  isReset: boolean;
  setIsReset: React.Dispatch<React.SetStateAction<boolean>>;

  audio: HTMLAudioElement | null;

  loopState: string;
  setLoopState: React.Dispatch<React.SetStateAction<string>>;

  onEnded: (e: Event) => void;

  trackList: File[];

  isShuffling: ShuffledTracks;
  setIsShuffling: React.Dispatch<React.SetStateAction<ShuffledTracks | false>>;
}

export interface ShuffledTracks {
  trackList: File[];
  shuffledTrackList: File[];
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Contains the tracklist
  const [trackList, setTrackList] = useState<File[] | null>(null);
  const { files, setUploadState, uploadState } = useFiles();

  useEffect(() => {
    if (!files) return;
    if (!audio) return;
    if (uploadState) return;

    files.map((file) => {
      setTrackList((prev) => [...(prev ?? []), file]);
    });
    const firstTrack = files[0];
    audio.src = URL.createObjectURL(firstTrack);
  }, [files, uploadState]);

  const [isShuffling, setIsShuffling] = useState<ShuffledTracks | false>(false);
  // check/set when user is playing song
  const [isPlaying, setIsPlaying] = useState(false);
  // currentsong is just file location of the song
  const [currentSong, setCurrentSong] = useState<File | null>(null);
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
    [loopState, metadata, isShuffling],
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
    if (!trackList) return;
    // Don't really like this might clean it a bit more later on
    //////////////////////////////////
    // Set the current song name.

    // Set the next song file name.
    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSong) + 1
        ]
      : trackList[trackList.indexOf(currentSong) + 1];
    let song;

    // Checks if there is another track afterwards, if not then it will just set the next track to be the first song in the list.
    if (!nextTrack) {
      song = isShuffling ? isShuffling.shuffledTrackList[0] : trackList[0];

      if (loopState === "list") {
        // If the loop mode is set to "list", it will update the Queue to show the first song of a list be the next song.
        getMetaData(song, setNextSong);
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
    if (nextTrack) getMetaData(song, setNextSong);

    document.title = metadata.song_name ?? "VLoid Player";
    // Go to next track in the queue once song ends
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, [metadata, isShuffling]);

  // Do stuff if song is playing
  useEffect(() => {
    if (!currentSong) return;
    if (!trackList) return;
    if (!isPlaying) {
      // Pause song
      audio?.pause();
    } else if (isPlaying) {
      // Runs the function to get the metadata for a song. Args: (song_location, metadata_state) only if there is no metadata
      if (!metadata) getMetaData(currentSong, setMetadata);
      // Play song
      audio?.play();
    }
  }, [isPlaying, trackList]);

  ///////////////////////////
  // Starting State (This is mostly for debugging) //
  useEffect(() => {
    if (!files) return;
    if (!trackList) return;
    setCurrentSong(trackList[0]);
    // setUploadState(false);
  }, [files, trackList]);
  ///////////////////////////

  // This is for any loop state changes
  useEffect(() => {
    if (!currentSong) return;
    if (!trackList) return;
    if (!metadata) return;
    audio?.removeEventListener("ended", onEnded);
    const nextTrack = isShuffling
      ? isShuffling.shuffledTrackList[
          isShuffling.shuffledTrackList.indexOf(currentSong) + 1
        ]
      : trackList[trackList.indexOf(currentSong) + 1];
    switch (loopState) {
      // Loop List
      case "list":
        if (!nextTrack) {
          const firstSongOfList = isShuffling
            ? isShuffling.shuffledTrackList[0]
            : trackList[0];
          getMetaData(firstSongOfList, setNextSong);
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
          setTrackList,
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
