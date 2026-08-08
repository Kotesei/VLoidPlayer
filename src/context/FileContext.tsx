import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { shuffleArray } from "../helpers/shuffleArray";
interface FileContextType {
  uploadState: boolean;
  setUploadState: React.Dispatch<React.SetStateAction<boolean>>;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  drag_drop_zone: React.RefObject<HTMLInputElement>;
  handleLoadRandomSamples: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function TracksProvider({ children }: { children: ReactNode }) {
  const [uploadState, setUploadState] = useState(false);
  const [files, setFiles] = useState<File[] | null>(null);
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
      e.preventDefault();
      const transferedFiles = e.dataTransfer?.files;
      console.log(transferedFiles);
      setFiles(Array.from(transferedFiles || []));
    };

    el.addEventListener("dragover", dragOver);
    el.addEventListener("dragleave", dragLeave);
    el.addEventListener("drop", dropFiles);

    return () => {
      el.removeEventListener("dragover", dragOver);
      el.removeEventListener("dragleave", dragLeave);
      el.removeEventListener("drop", dropFiles);
    };
  }, [drag_drop_zone]);

  useEffect(() => {
    if (!files) return;
    drag_drop_zone.current?.classList.add("dropped_files");
  }, [files]);

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

      console.log(song);
      const songFile = new File([song], sample, {
        type: song.type,
        lastModified: Date.now(),
      });

      return songFile;
    });

    const songFiles = await Promise.all(songs);

    console.log(songFiles);
    setFiles(Array.from(songFiles || []));
  }

  return (
    <FileContext.Provider
      value={{
        uploadState,
        setUploadState,
        files,
        setFiles,
        drag_drop_zone,
        handleLoadRandomSamples,
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
