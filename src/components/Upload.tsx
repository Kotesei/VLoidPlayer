import { useEffect, useRef, useState } from "react";

// Starting point for new visitors (Web Version)
export function Upload() {
  const drag_drop_zone = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[] | null>(null);
  useEffect(() => {
    const el = drag_drop_zone.current;
    if (!el) return;

    const dragOver = (e: Event) => {
      e.preventDefault();
      drag_drop_zone.current?.classList.add("dragging_over");
    };

    const dragLeave = (e: Event) => {
      e.preventDefault();
      drag_drop_zone.current?.classList.remove("dragging_over");
    };

    const dropFiles = (e: DragEvent) => {
      e.preventDefault();
      const transferedFiles = e.dataTransfer?.files;
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
  }, []);

  useEffect(() => {
    if (!files) return;
    files.map((file) => {
      console.log(file);
    });
    drag_drop_zone.current?.classList.add("dropped_files");
  }, [files]);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div
        ref={drag_drop_zone}
        id="drag_drop_zone"
        className="w-[80dvw] h-[50dvh] border-2 border-white border-dashed rounded-2xl flex-col gap-7 flex justify-center items-center"
      >
        {files && (
          <>
            {files.map((file, i) => {
              return (
                <p key={i} className="text-white">
                  {file.name}
                </p>
              );
            })}
          </>
        )}
        {!files && (
          <>
            <h1 className="text-white text-3xl italic text-center px-30">
              Please drop/upload any audio files here to proceed or use the
              sample audio instead.
            </h1>
            <div className="flex gap-5">
              <button className="bg-white px-20 py-2 rounded-full text-2xl">
                Upload
              </button>
              <button className="bg-white px-20 py-2 rounded-full text-2xl">
                Use Samples
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
