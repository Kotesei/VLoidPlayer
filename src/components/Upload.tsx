import { useState } from "react";
import { useFiles } from "../context/FileContext";

// Starting point for new visitors (Web Version)
export function Upload() {
  const {
    files,
    drag_drop_zone,
    handleLoadRandomSamples,
    setFiles,
    setUploadState,
    validFiles,
    loadedDBFiles,
  } = useFiles();

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showDBNotice, setDBNotice] = useState<boolean>(true);
  const [usingDBFiles, setUsingDBFiles] = useState<boolean>(false);

  function handleRemoveFile(target: File) {
    if (!files) return;
    setFiles(files.filter((file) => file !== target));
  }

  function handleLoadValidFiles() {
    setFiles(validFiles);
    setUploadState(false);
  }

  function handleHover(active: boolean) {
    if (active) {
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  }

  function handleUseDBFiles(load: boolean) {
    if (!showDBNotice) return;
    setDBNotice(false);
    setUsingDBFiles(false);
    if (load) {
      setUsingDBFiles(true);
      if (!loadedDBFiles) return;
      let uniqueFiles: File[] = loadedDBFiles;
      // Checks if file has been added to upload list before putting the DB file in
      if (files) {
        uniqueFiles = loadedDBFiles.filter((dbFile) => {
          const exists = files.some(
            (file) => file.name === dbFile.name && file.size === dbFile.size,
          );
          return !exists;
        });
      }
      setFiles((prev) => [...(prev || []), ...uniqueFiles]);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full gap-5 h-full">
      <div className="p-5 w-[80dvw] h-[50dvh] bg-black border-2 border-white border-dashed rounded-2xl relative flex flex-col gap-5">
        <div
          ref={drag_drop_zone}
          id="drag_drop_zone"
          className={`h-full flex-col gap-7 flex ${!files ? "justify-center" : "overflow-y-auto scrollbar-thin scrollbar-thumb-white"} items-center`}
        >
          {loadedDBFiles && showDBNotice && (
            <div
              onMouseEnter={() => handleHover(true)}
              onMouseLeave={() => handleHover(false)}
              className="shadow-inner shadow-white flex items-center justify-center rounded-t-2xl border-dashed absolute w-[55%] bottom-full h-[10%] text-white"
            >
              <div
                className={`w-full absolute bottom-full h-10 gap-10 flex items-center text-black transition-all duration-300 ${isHovering ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0 pointer-events-none"}`}
              >
                <button
                  onClick={() => handleUseDBFiles(true)}
                  className="bg-white flex-1 rounded-full"
                >
                  Yes
                </button>
                <button
                  onClick={() => handleUseDBFiles(false)}
                  className="bg-white flex-1 rounded-full"
                >
                  No
                </button>
              </div>

              <p>Files Found in Database! Would you like to use those?</p>
            </div>
          )}
          {files && (
            <>
              <div className="flex flex-col bg-black w-full flex-1 gap-4">
                {files.map((file, key) => {
                  // Checks if file is in DB
                  let inDB;
                  if (loadedDBFiles) {
                    if (
                      loadedDBFiles.find((dbfile) => dbfile.name === file.name)
                    )
                      inDB = true;
                  }
                  return (
                    <div key={key} className="flex gap-5 items-center">
                      <button
                        onClick={() => handleRemoveFile(file)}
                        className="rounded-full flex justify-center items-center leading-1 pb-1 h-5 w-5 bg-amber-50 text-black"
                      >
                        x
                      </button>
                      <p
                        className={`${/\.(mp3|wav|m4a|flac|ogg|opus|webm|aac)$/i.test(file.name) ? (inDB ? "text-blue-300" : "text-green-300") : "text-red-400"}`}
                      >
                        {file.name}
                      </p>
                    </div>
                  );
                })}
              </div>
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
                <button
                  onClick={handleLoadRandomSamples}
                  className="bg-white px-20 py-2 rounded-full text-2xl"
                >
                  Use Samples
                </button>
              </div>
            </>
          )}
        </div>
        {validFiles && files && (
          <div className="flex justify-end gap-3">
            <div className="flex flex-col">
              {loadedDBFiles && (
                <p className="text-blue-300 text-end text-sm leading-4">
                  Database Entries: {loadedDBFiles.length}
                </p>
              )}
              <p className="text-green-300 text-end text-sm leading-4">
                Valid Entries:{" "}
                {usingDBFiles && loadedDBFiles
                  ? validFiles.length - loadedDBFiles?.length
                  : validFiles.length}
              </p>
              <p className="text-red-400 text-end text-sm leading-4">
                Invalid Entries: {files.length - validFiles.length}
              </p>
            </div>
            {validFiles.length > 0 && (
              <button
                onClick={handleLoadValidFiles}
                className="bg-amber-50 px-8 pb-1 justify-center items-center rounded-xl w-fit flex text-2xl "
              >
                {validFiles.length === 1 ? "Import File" : "Import Files"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
