import { useState } from "react";
import { DBFile, useFiles } from "../context/FileContext";
import { clearDB, loadDB, readDB, removeFromDB } from "../helpers/database/db";
import { useAudio } from "../context/AudioContext";
import { handleShuffle } from "../helpers/audio/shuffle";

// Starting point for new visitors (Web Version)
export function Upload() {
  const {
    files,
    drag_drop_zone,
    handleLoadRandomSamples,
    setFiles,
    setUploadState,
    validFiles,
    setDB,
    db,
    usingDBFiles,
    setUsingDBFiles,
  } = useFiles();

  const { isShuffling, currentSong, setIsShuffling } = useAudio();

  const [isHovering, setIsHovering] = useState<boolean>(false);
  const [showDBNotice, setDBNotice] = useState<boolean>(true);

  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  function handleRemoveFile(target: File) {
    if (!files) return;
    if (usingDBFiles && db) {
      db.find((item) => {
        if (item.file.name === target.name) {
          removeFromDB(item);
          loadDB(setDB, true);
        }
      });
    }
    setFiles(files.filter((file) => file !== target));
  }

  function handleLoadValidFiles() {
    if (!validFiles) return;
    setFiles(validFiles);
    setUploadState(false);
    if (isShuffling) {
      handleShuffle({
        currentSong,
        validFiles,
        setIsShuffling,
      });
    }
  }

  function handleHover(active: boolean) {
    if (active) {
      setIsHovering(true);
    } else {
      setIsHovering(false);
    }
  }

  async function handleClearDB() {
    await clearDB();
    setIsConfirming(false);
    loadDB(setDB, false);
  }

  function handleUseDBFiles(load: boolean) {
    if (!showDBNotice) return;
    setDBNotice(false);
    if (load) {
      setUsingDBFiles(true);
      if (!db) return;
      let uniqueFiles: DBFile[] = db;
      // Checks if file has been added to upload list before putting the DB file in
      if (files) {
        uniqueFiles = db.filter((dbFile) => {
          const exists = files.some((file) => file.name === dbFile.file.name);
          if (!exists) setFiles((prev) => [...(prev || []), dbFile.file]);
        });
      } else {
        uniqueFiles.map((dbFile) => {
          setFiles((prev) => [...(prev || []), dbFile.file]);
        });
      }
    }
  }

  return (
    <div className="flex flex-col justify-center items-center w-full gap-5 h-full">
      {isConfirming && (
        <div className="absolute w-dvw h-dvh z-1 flex justify-center items-center bg-[#110a1adf]">
          <div className="px-20 py-5 rounded-xl flex justify-center flex-col gap-3 items-center bg-[#000000f1] border-2 border-white">
            <p className="text-white">
              Are you sure you want to delete the database?
            </p>
            <div className="text-white flex gap-5">
              <button
                className="bg-white px-5 text-black rounded-full"
                onClick={handleClearDB}
              >
                Yes
              </button>
              <button
                className="bg-white px-5 text-black rounded-full"
                onClick={() => setIsConfirming(false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
      <div
        ref={drag_drop_zone}
        id="drag_drop_zone"
        className="p-5 w-[80dvw] h-[50dvh] bg-black border-2 border-white border-dashed rounded-2xl relative flex flex-col gap-5"
      >
        {db && db.length > 0 && (
          <div
            className=" hover:bg-red-400 hover:text-black border-white  absolute bottom-full -translate-y-0.5 border-2 text-white px-2 py-2 border-b-0 right-5 rounded-t-xl flex gap-2 h-10 items-center"
            onClick={() => setIsConfirming(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ionicon h-full"
              stroke="white"
            >
              <path
                d="m112 112 20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <path
                d="M80 112h352"
                stroke="currentColor"
                strokeLinecap="round"
                strokeMiterlimit="10"
                strokeWidth="32px"
              />
              <path
                d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
            </svg>
            <p className="whitespace-nowrap">Clear Database</p>
          </div>
        )}
        <div
          className={`h-full flex-col gap-7 flex ${!files ? "justify-center" : "overflow-y-auto scrollbar-thin scrollbar-thumb-white"} items-center`}
        >
          {!usingDBFiles && db && db.length > 0 && showDBNotice && (
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
              <p>Liked Songs Found in Database! Would you like to use those?</p>
            </div>
          )}
          {files && (
            <>
              <div className="flex flex-col bg-black w-full flex-1 gap-4">
                {files.map((file, key) => {
                  // Checks if file is in DB
                  let inDB;
                  let songName;
                  if (db) {
                    db.find((dbFile) => {
                      if (
                        dbFile.file.size === file.size &&
                        dbFile.file.name === file.name
                      ) {
                        songName = dbFile.metadata.song_name;
                        inDB =
                          dbFile.file.name === file.name &&
                          dbFile.file.size === file.size;
                      }
                    });
                  }
                  return (
                    <div key={key} className="flex gap-5 items-center">
                      <button
                        onClick={() => handleRemoveFile(file)}
                        className="rounded-full flex justify-center items-center leading-1 pb-1 min-h-5 min-w-5 bg-amber-50 text-black"
                      >
                        x
                      </button>
                      <p
                        className={`px-2 ${/\.(mp3|wav|m4a|flac|ogg|opus|webm|aac)$/i.test(file.name) ? (inDB ? "text-blue-300" : "text-green-300") : "text-red-400"}`}
                      >
                        {songName ?? file.name}
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
              {db && usingDBFiles && (
                <p className="text-blue-300 text-end text-sm leading-4">
                  Database Entries: {db.length}
                </p>
              )}
              <p className="text-green-300 text-end text-sm leading-4">
                Valid Entries:{" "}
                {usingDBFiles && db
                  ? validFiles.length - db.length
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
