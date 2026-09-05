import {
  createContext,
  MutableRefObject,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { loadDB } from "../helpers/database/db";
import { SongMetaData } from "./AudioContext";
import { getMetaData } from "../helpers/metadata";
import { AnimationItem } from "lottie-web";
import { loadPlaylists } from "../helpers/database/loadPlaylists";
interface FileContextType {
  usingDBFiles: boolean;
  setUsingDBFiles: React.Dispatch<React.SetStateAction<boolean>>;
  uploadState: boolean;
  setUploadState: React.Dispatch<React.SetStateAction<boolean>>;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  drag_drop_zone: React.RefObject<HTMLInputElement>;
  coverArtRef: React.RefObject<HTMLDivElement>;
  animationRef: MutableRefObject<AnimationData | null>;
  validFiles: DBFile[] | null;
  setValidFiles: React.Dispatch<React.SetStateAction<DBFile[] | null>>;
  setUsingSamples: React.Dispatch<React.SetStateAction<boolean>>;
  db: DBFile[] | null;
  setDB: React.Dispatch<React.SetStateAction<DBFile[] | null>>;
  fetchPlaylists: () => void;
  playlists: Playlist[] | null;
}
export interface DBFile {
  metadata: SongMetaData;
  file: File;
}

export interface AnimationData {
  src: string | null;
  item: AnimationItem | null;
}

export interface Playlist {
  playlistName: string;
  id: number;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function TracksProvider({ children }: { children: ReactNode }) {
  // State to check if user is using DB files or not.
  const [usingDBFiles, setUsingDBFiles] = useState<boolean>(false);
  // Used to switch between upload page and player
  const [uploadState, setUploadState] = useState<boolean>(true);
  // Used to store the files dropped in the upload page (Used to visually show files regardless of type)
  const [files, setFiles] = useState<File[] | null>(null);
  // Contains only validated files from the files (Used to handle the actual files needed)
  const [validFiles, setValidFiles] = useState<DBFile[] | null>(null);
  // Used for if the user does not want to upload any songs for the music player and instead recieves an array of songs I made randomly.
  const [usingSamples, setUsingSamples] = useState<boolean>(false);
  // Container for the drop zone where users drop files
  const drag_drop_zone = useRef<HTMLInputElement>(null);
  // Files from the local database on user's device
  const [db, setDB] = useState<DBFile[] | null>(null);
  const [playlists, setPlaylists] = useState<Playlist[] | null>(null);

  // Contains the animation data and cover art
  const coverArtRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<AnimationData | null>(null);

  // Updates the dropped files event listener whenever new files are added or when uploadState changes
  useEffect(() => {
    if (!uploadState) return;
    if (!drag_drop_zone) return;
    const el = drag_drop_zone.current;
    if (!el) return;

    const dragOver = (e: Event) => {
      e.preventDefault();
      el.classList.add("dragging_over");
    };

    const dragLeave = (e: Event) => {
      e.preventDefault();
      el.classList.remove("dragging_over");
    };

    const dropFiles = (e: DragEvent) => {
      if (e.dataTransfer?.dropEffect !== "copy") return;
      e.preventDefault();
      const transferedFiles = files
        ? [...files, ...Array.from(e.dataTransfer?.files || [])]
        : Array.from(e.dataTransfer?.files || []);

      // Only allow unique files into the list
      const uniqueFiles = transferedFiles.filter(
        (curFile, i, self) =>
          i ===
          self.findIndex(
            (file) => file.name === curFile.name && file.size === curFile.size,
          ),
      );
      setFiles(uniqueFiles);
      drag_drop_zone.current?.classList.add("dropped_files");
    };

    el.addEventListener("dragover", dragOver);
    el.addEventListener("dragleave", dragLeave);
    el.addEventListener("drop", dropFiles);

    return () => {
      el.removeEventListener("dragover", dragOver);
      el.removeEventListener("dragleave", dragLeave);
      el.removeEventListener("drop", dropFiles);
    };
  }, [drag_drop_zone, files, uploadState]);

  // Checks whenever files are added and filters them by regex rule to determine if it's an audio file
  useEffect(() => {
    if (!files) return;
    const audioFiles = files.filter((file) =>
      /\.(mp3|wav|m4a|flac|ogg|opus|webm|aac)$/i.test(file.name),
    );
    if (!audioFiles) return;

    const attachMetadata = async () => {
      const filesWithMetadata = await Promise.all(
        audioFiles.map(async (file) => {
          const metadata = await getMetaData(file);
          return { file, metadata };
        }),
      );
      setValidFiles(filesWithMetadata);
    };

    attachMetadata();
  }, [files]);

  // Quick handling for using samples (Only disable the upload state after samples have been loaded into validFiles)
  useEffect(() => {
    if (usingSamples) {
      setUploadState(false);
      setUsingSamples(false);
    }
  }, [validFiles]);

  // Loads the database on init, logs if there are no songs found (Will leave the log alone for now).
  useEffect(() => {
    return () => {
      loadDB(setDB, false);
    };
  }, []);

  async function fetchPlaylists() {
    const playlists = await loadPlaylists();
    if (!playlists) return;
    setPlaylists(playlists);
  }

  useEffect(() => {
    return () => {
      fetchPlaylists();
    };
  }, []);
  // useEffect(() => {
  //   if (!playlists) return;
  //   console.log(playlists);
  // }, [playlists]);

  return (
    <FileContext.Provider
      value={{
        uploadState,
        setUploadState,
        files,
        setFiles,
        drag_drop_zone,
        setValidFiles,
        validFiles,
        setDB,
        db,
        usingDBFiles,
        setUsingDBFiles,
        animationRef,
        coverArtRef,
        setUsingSamples,
        fetchPlaylists,
        playlists,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error("useFiles must be used within a FileProvider");
  }
  return context;
}
