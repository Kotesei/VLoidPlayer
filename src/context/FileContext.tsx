import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { shuffleArray } from "../helpers/shuffleArray";
import { loadDB } from "../helpers/database/db";
import { SongMetaData } from "./AudioContext";
interface FileContextType {
  usingDBFiles: boolean;
  setUsingDBFiles: React.Dispatch<React.SetStateAction<boolean>>;
  uploadState: boolean;
  setUploadState: React.Dispatch<React.SetStateAction<boolean>>;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  drag_drop_zone: React.RefObject<HTMLInputElement>;
  handleLoadRandomSamples: () => void;
  validFiles: File[] | null;
  db: DBFile[] | null;
  setDB: React.Dispatch<React.SetStateAction<DBFile[] | null>>;
}
export interface DBFile {
  metadata: SongMetaData;
  file: File;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function TracksProvider({ children }: { children: ReactNode }) {
  const [usingDBFiles, setUsingDBFiles] = useState<boolean>(false);
  const [uploadState, setUploadState] = useState(true);
  const [files, setFiles] = useState<File[] | null>(null);
  const [validFiles, setValidFiles] = useState<null | File[]>(null);

  const drag_drop_zone = useRef<HTMLInputElement>(null);
  const [db, setDB] = useState<DBFile[] | null>(null);
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
    setValidFiles(audioFiles);
  }, [files, uploadState]);

  async function handleLoadRandomSamples() {
    const samples = [
      "A Serious Time.wav",
      "Bard's Shop.wav",
      "Early Bird's Stroll.wav",
      "Fat Cat.wav",
      "It's Time for Rest...wav",
      "Main Menu.wav",
      "Meow.wav",
      "Might Float.wav",
      "Night Owl's Stroll.wav",
      "Sneaking By.wav",
      "Stuck Cave Diving.wav",
      "The Trenches.wav",
      "Thinking of Another Way.wav",
    ];
    const selectedSamples = shuffleArray(samples).splice(0, 3);

    const songs = selectedSamples.map(async (sample: string) => {
      const res = await fetch(`./src/assets/sample_audio/${sample}`);
      const song: Blob = await res.blob();

      const songFile = new File([song], sample, {
        type: song.type,
        lastModified: Date.now(),
      });

      return songFile;
    });

    const songFiles = await Promise.all(songs);

    setFiles(Array.from(songFiles || []));
    setUploadState(false);
  }

  // For debugging purposes or maybe page loading [Could be useful for removing audio that is stored in the database if user wishes to remove songs, or even skipping the upload page sequence completely]
  useEffect(() => {
    return () => {
      loadDB(setDB, false);
    };
  }, []);

  // Logs files in the database after reading
  // useEffect(() => {
  //   if (!loadedDBFiles) return;
  //   console.log(loadedDBFiles);
  //   console.log(loadedDBMetadata);
  //   console.log(files);
  //   console.log(validFiles);
  //   console.log(db);
  // }, [loadedDBFiles]);

  return (
    <FileContext.Provider
      value={{
        uploadState,
        setUploadState,
        files,
        setFiles,
        drag_drop_zone,
        handleLoadRandomSamples,
        validFiles,
        setDB,
        db,
        usingDBFiles,
        setUsingDBFiles,
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
