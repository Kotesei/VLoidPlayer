import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { shuffleArray } from "../helpers/shuffleArray";
import { readDB } from "../helpers/database/db";
interface FileContextType {
  uploadState: boolean;
  setUploadState: React.Dispatch<React.SetStateAction<boolean>>;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  drag_drop_zone: React.RefObject<HTMLInputElement>;
  handleLoadRandomSamples: () => void;
  validFiles: File[] | null;
  loadedDBFiles: File[] | null;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function TracksProvider({ children }: { children: ReactNode }) {
  const [uploadState, setUploadState] = useState(true);
  const [files, setFiles] = useState<File[] | null>(null);
  const [validFiles, setValidFiles] = useState<null | File[]>(null);
  const [loadedDBFiles, setLoadedDBFiles] = useState<File[] | null>(null);
  const drag_drop_zone = useRef<HTMLInputElement>(null);
  useEffect(() => {
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

      setFiles(transferedFiles);
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
  }, [drag_drop_zone, files]);

  useEffect(() => {
    if (!files) return;
    const filteredFiles = files.filter((file) => file.type.includes("audio"));
    if (!filteredFiles) return;
    setValidFiles(filteredFiles);
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
    async function loadDB() {
      const dbFiles = await readDB();
      dbFiles.map((dbFile) =>
        setLoadedDBFiles((prev) => [...(prev || []), dbFile.file]),
      );
    }

    return () => {
      loadDB();
    };
  }, []);

  // Logs files in the database
  useEffect(() => {
    if (!loadedDBFiles) return;
    console.log(loadedDBFiles);
  }, [loadedDBFiles]);

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
        loadedDBFiles,
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
