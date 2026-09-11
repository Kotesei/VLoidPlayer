import { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";
import { DBFile, useFiles } from "../context/FileContext";
import { handleLike } from "../helpers/database/likeSong";
import { Button } from "./Button";
import { ReactSortable } from "react-sortablejs";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react";

type SortableDBFile = DBFile & {
  id: number;
};

export function Queue() {
  const {
    currentSong,
    loopState,
    setCurrentSong,
    audio,
    isShuffling,
    setIsShuffling,
    setShowingQueue,
    showingQueue,
  } = useAudio();

  const { db, setDB, validFiles, setValidFiles, playlistSongs, playlists } =
    useFiles();
  const [selectedPlaylist, setSelectedPlaylist] = useState("Loaded Songs");

  const [sortableList, setSortableList] = useState<SortableDBFile[]>(() =>
    (isShuffling
      ? (isShuffling.shuffledTrackList ?? [])
      : (validFiles ?? [])
    ).map((file, key) => ({
      ...file,
      id: key,
    })),
  );
  const [nextSong, setNextSong] = useState(
    sortableList[
      sortableList.findIndex(
        (item) => item.file.name === currentSong?.file.name,
      ) + 1
    ],
  );
  function handleShowQueue() {
    setShowingQueue(!showingQueue);
    if (!validFiles) return;
  }

  function handleChangeSong(song: DBFile) {
    if (!audio?.src) return;
    setCurrentSong(song);
    audio.src = URL.createObjectURL(song.file);
  }

  useEffect(() => {
    if (!showingQueue) return;
    if (!playlistSongs?.length) return;

    playlistSongs[1].songs.map((songData) => {
      const song = {
        ...(songData.songId !== undefined && { id: songData.songId }),
        ...(songData.playlistId !== undefined && {
          playlistId: songData.playlistId,
        }),
        file: {
          ...(songData.name !== undefined && {
            name: songData.name,
          }),
          size: songData.size,
        },
        metadata: {
          ...(songData.song_name !== undefined && {
            song_name: songData.song_name,
          }),
        },
      };
    });
  }, [showingQueue]);

  useEffect(() => {
    // Handle selected playlist here:
    if (selectedPlaylist) return;

    ///////////////////////////////////
    if (!validFiles) return;
    if (!isShuffling) {
      setSortableList(validFiles.map((file, key) => ({ ...file, id: key })));
    } else {
      setSortableList(
        isShuffling.shuffledTrackList.map((file, key) => ({
          ...file,
          id: key,
        })),
      );
    }
  }, [selectedPlaylist, isShuffling]);

  useEffect(() => {
    if (!currentSong) return;
    setNextSong(
      sortableList[
        sortableList.findIndex(
          (item) => item.file.name === currentSong?.file.name,
        ) + 1
      ],
    );
  }, [currentSong, sortableList]);

  function handleChangeQueue({
    all,
    liked,
    playlist,
    playlistId,
  }: {
    all?: boolean;
    liked?: boolean;
    playlist?: boolean;
    playlistId?: number;
  }) {
    if (all) {
      console.log(all);
      return;
    }

    if (liked) {
      console.log(liked);
      return;
    }

    if (playlist) {
      console.log(playlistId);
      return;
    }
  }

  return (
    <div className="h-[18dvh] w-full items-center gap-2 flex flex-col justify-end">
      <div className="flex flex-col flex-1 py-[3dvh] gap-1 items-center justify-end">
        <h2 className="text-purple-300 text-[11px]">Playing From</h2>
        <Listbox value={selectedPlaylist} onChange={setSelectedPlaylist}>
          <ListboxButton className="text-[11px] bg-indigo-200 px-2 rounded-sm">
            {selectedPlaylist}
          </ListboxButton>
          <ListboxOptions
            anchor={{ to: "bottom", gap: "3px" }}
            className="text-white backdrop-blur-xs text-[11px] border border-white rounded-sm flex flex-col"
          >
            <>
              <ListboxOption
                onClick={() => handleChangeQueue({ all: true })}
                value={"Loaded Songs"}
                className={
                  "data-focus:bg-blue-100 text-center data-focus:text-black"
                }
              >
                Loaded Songs
              </ListboxOption>
              <ListboxOption
                value={"Liked Songs"}
                onClick={() => handleChangeQueue({ liked: true })}
                className={
                  "data-focus:bg-blue-100 text-center data-focus:text-black"
                }
              >
                Liked Songs
              </ListboxOption>
              {playlists?.map((playlist, key) => (
                <ListboxOption
                  onClick={() =>
                    handleChangeQueue({
                      playlist: true,
                      playlistId: playlist.playlistId,
                    })
                  }
                  className={
                    "data-focus:bg-blue-100 text-center px-3 data-focus:text-black"
                  }
                  key={key}
                  value={playlist.name}
                >
                  {playlist.name}
                </ListboxOption>
              ))}
            </>
          </ListboxOptions>
        </Listbox>
      </div>
      <div className="min-h-[35%] flex justify-center relative w-full">
        <div
          id="queue"
          className={`gap-5 flex absolute border-b-0  rounded-b-none border-purple-300 ${showingQueue ? "justify-end w-[85%] h-[70dvh] border rounded-xl bg-[#16044e94] items-start p-4 flex-col-reverse" : "px-2 w-full border-t items-center justify-center"} min-h-full bottom-0  backdrop-blur-sm shadow-2xl shadow-purple-500`}
        >
          {showingQueue && (
            <>
              <div className="w-full h-full text-white overflow-auto scrollbar-thin scrollbar-thumb-white px-[clamp(0rem,2%,5rem)]">
                <ReactSortable
                  className="px-2 text-xs pt-3 w-full h-full flex flex-col gap-2"
                  list={sortableList}
                  setList={(newList) => {
                    if (!validFiles) return;
                    setSortableList(newList);
                    if (!isShuffling) setValidFiles(newList);
                    if (isShuffling)
                      setIsShuffling({
                        validFiles,
                        shuffledTrackList: newList,
                      });
                    setNextSong(
                      newList[
                        newList.findIndex(
                          (item) => item.file.name === currentSong?.file.name,
                        ) + 1
                      ],
                    );
                  }}
                >
                  {sortableList?.map((song, key) => {
                    return (
                      <div
                        onClick={() => handleChangeSong(song)}
                        key={key}
                        className={`${song.file === currentSong?.file ? "bg-[#403b9ca5]" : "bg-[#000c32a5]"} p-3 rounded-lg border-white flex justify-between items-center border-2 gap-5 relative`}
                      >
                        {db?.find(
                          (dbFile) =>
                            dbFile.file.name === song.file.name &&
                            dbFile.file.size === song.file.size,
                        ) && (
                          <div
                            className="absolute left-0 -translate-x-1/2 top-1 -translate-y-1/2"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Button
                              altSizing
                              like
                              file={song}
                              db={db}
                              likeSong={() => {
                                handleLike(song, setDB);
                              }}
                              stroke="oklch(82.7% 0.119 306.383)"
                              fill="oklch(82.7% 0.119 306.383)"
                            />
                          </div>
                        )}
                        <div>
                          <p>{song?.metadata?.song_name ?? song?.file.name}</p>
                          <p className="text-gray-400">
                            {song?.metadata?.artist}
                          </p>
                        </div>
                        <p>{song?.metadata?.duration}</p>
                      </div>
                    );
                  })}
                </ReactSortable>
              </div>
            </>
          )}
          <div
            className={`text-purple-300 flex ${showingQueue ? "h-20 max-h-25" : ""} flex-col text-xs px-[clamp(3rem,7vmin,5rem)] items-center w-full relative justify-center`}
          >
            <svg
              onClick={handleShowQueue}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
              className="ionicon w-[clamp(1.5rem,4vmin,2.5rem)] absolute left-[clamp(1rem,1vmin,5rem)]  top-1/2 -translate-y-1/2"
            >
              <path
                d="M160 144h288M160 256h288M160 368h288"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="144"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="256"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
              <circle
                cx="80"
                cy="368"
                r="16"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="32px"
              />
            </svg>
            <p className="text-[9px] w-fit text-center ">Up Next</p>
            {loopState === "single" ? (
              <>
                <p className="text-center">
                  {currentSong?.metadata?.song_name}
                </p>
              </>
            ) : (
              <>
                {currentSong?.metadata &&
                  (nextSong || loopState === "list") && (
                    <div className="max-w-full w-fit self-center">
                      <div className="absolute translate-y-1/2 bottom-1/2 right-[clamp(1rem,1vmin,5rem)]">
                        {nextSong && (
                          <Button
                            nextLike
                            file={nextSong}
                            db={db}
                            likeSong={() => {
                              handleLike(nextSong, setDB);
                            }}
                            stroke="oklch(82.7% 0.119 306.383)"
                            fill="oklch(82.7% 0.119 306.383)"
                          />
                        )}
                        {!nextSong && loopState === "list" && (
                          <Button
                            nextLike
                            file={sortableList[0]}
                            db={db}
                            likeSong={() => {
                              handleLike(sortableList[0], setDB);
                            }}
                            stroke="oklch(82.7% 0.119 306.383)"
                            fill="oklch(82.7% 0.119 306.383)"
                          />
                        )}
                      </div>
                      {loopState === "list" && (
                        <p className="text-center">
                          {nextSong?.metadata.song_name ??
                            sortableList[0].metadata.song_name}
                        </p>
                      )}
                    </div>
                  )}
                {loopState === "disabled" && (
                  <p className="text-center">
                    {sortableList[sortableList.length - 1].file.name ===
                    currentSong?.file.name
                      ? "End Of List"
                      : `${nextSong?.metadata.song_name}`}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
