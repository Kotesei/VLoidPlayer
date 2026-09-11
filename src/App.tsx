import "./App.css";
import { Button } from "./components/Button";
import { CoverArt } from "./components/CoverArt";
import { Queue } from "./components/Queue";
import { SongDetails } from "./components/SongDetails";
import { SongNavi } from "./components/SongNavi";
import { useAudio } from "./context/AudioContext";
import { handleLoop } from "./helpers/audio/loop";
import { handleNextTrack } from "./helpers/audio/next";
import { handlePlayPause } from "./helpers/audio/play_pause";
import { handlePreviousTrack } from "./helpers/audio/previous";
import { handleShuffle } from "./helpers/audio/shuffle";
import { handleLike } from "./helpers/database/likeSong";
import { Upload } from "./components/Upload";
import { Playlist, useFiles } from "./context/FileContext";
import { ChangeEvent, useState } from "react";
import {
  addToPlaylist,
  createPlaylist,
  removeFromPlaylist,
} from "./helpers/database/playlist";

function App() {
  const {
    isPlaying,
    currentSong,
    audio,
    loopState,
    setIsPlaying,
    setIsReset,
    setCurrentSong,
    onEnded,
    setLoopState,
    isShuffling,
    setIsShuffling,
  } = useAudio();

  const {
    uploadState,
    playlists,
    playlistSongs,
    fetchPlaylists,
    db,
    setDB,
    validFiles,
  } = useFiles();
  const [handlingPlaylists, setHandlingPlaylists] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [value, setValue] = useState("");
  const [selectingExistingPlaylist, setSelectingExistingPlaylist] =
    useState(false);

  async function openPlaylistOptions() {
    setHandlingPlaylists(!handlingPlaylists);
    setSelectingExistingPlaylist(false);
    setCreatingPlaylist(false);
  }

  async function openExistingPlaylists() {
    await fetchPlaylists();
    setSelectingExistingPlaylist(true);
    setHandlingPlaylists(false);
  }

  async function createNewPlaylist(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault();
    createPlaylist(value);
    const updatedPlaylists: Playlist[] = (await fetchPlaylists()) ?? [];

    const playlistId = updatedPlaylists?.reduce(
      (highestID, playlist) => Math.max(highestID, playlist.playlistId),
      0,
    );

    addToPlaylist(currentSong, playlistId);
    setCreatingPlaylist(false);
    setValue("");
  }

  return (
    <>
      {(creatingPlaylist || handlingPlaylists || selectingExistingPlaylist) && (
        <div
          className="absolute left-0 top-0 w-dvw h-dvh backdrop-blur-[1px] z-1"
          onClick={() => {
            setCreatingPlaylist(false);
            setHandlingPlaylists(false);
            setSelectingExistingPlaylist(false);
            setValue("");
          }}
        ></div>
      )}

      {uploadState && <Upload />}
      {!uploadState && (
        <div className="h-full w-full flex-col flex items-center justify-end gap-3">
          <SongDetails />
          <div
            className="max-h-[62dvh] flex flex-col items-center px-13 w-[clamp(5.5rem,85vmin,55.5rem)] min-w-76 max-w-225 flex-1 relative"
            id="songContainer"
          >
            <CoverArt />
            <div className="w-full flex-1 flex flex-col pt-[5dvh]">
              <div className="flex justify-between">
                <Button
                  shuffle
                  isShuffling={isShuffling}
                  stroke="oklch(82.7% 0.119 306.383)"
                  onClick={() =>
                    handleShuffle({
                      currentSong,
                      validFiles,
                      isShuffling,
                      setIsShuffling,
                    })
                  }
                />
                <Button
                  like
                  file={currentSong}
                  db={db}
                  likeSong={() => {
                    handleLike(currentSong, setDB);
                  }}
                  stroke="oklch(82.7% 0.119 306.383)"
                  fill="oklch(82.7% 0.119 306.383)"
                />
                <div className="relative">
                  {selectingExistingPlaylist && (
                    <div className="flex flex-col absolute z-40 text-black items-center bottom-[125%] -translate-x-1/2 left-[50%] w-100 rounded-lg h-100 border-2 border-white py-5 px-3 backdrop-blur-xl gap-2">
                      <h2 className="text-white text-3xl pb-5">Playlists</h2>
                      <div className="w-full flex flex-col gap-2 overflow-auto px-2 scrollbar-thin scrollbar-thumb-white">
                        {playlists?.map((playlist, key) => {
                          const playlistData = playlistSongs?.find(
                            (playlistSong) =>
                              playlistSong.playlistId === playlist.playlistId,
                          );

                          const existsInPlaylist = playlistData?.songs.find(
                            (song) =>
                              (song.song_name ===
                                currentSong?.metadata.song_name ||
                                song.song_name === currentSong?.file.name) &&
                              song.size === currentSong?.file.size,
                          );

                          return (
                            <div
                              onClick={() => {
                                existsInPlaylist
                                  ? removeFromPlaylist(
                                      currentSong,
                                      playlist.playlistId,
                                    )
                                  : addToPlaylist(
                                      currentSong,
                                      playlist.playlistId,
                                    );
                                setSelectingExistingPlaylist(false);
                              }}
                              className={`border-2 border-white  py-1.5 px-5 w-full text-center rounded-lg ${existsInPlaylist ? "bg-green-200 text-black" : "text-white"}`}
                              key={key}
                            >
                              <p>{playlist.name}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  {creatingPlaylist && (
                    <form
                      onSubmit={createNewPlaylist}
                      className="flex flex-col absolute items-center justify-center z-40 text-black bottom-full -translate-x-1/2 left-[50%]"
                    >
                      <div className="bg-[#0f00009c] backdrop-blur-sm text-white px-5 py-5 rounded-2xl rounded-tr-none border-2 border-amber-50 gap-2 items-center flex flex-col">
                        <p>Enter Playlist Name</p>
                        <input
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="bg-white text-black outline-0 px-1 rounded-sm"
                        ></input>
                      </div>
                    </form>
                  )}
                  {handlingPlaylists && (
                    <div className="absolute translate-x-1/2 right-[50%] bottom-[125%] z-30">
                      <div className="w-[clamp(15rem,50vmin,50rem)] flex flex-col relative rounded-lg gap-2 items-center">
                        <button
                          onClick={openExistingPlaylists}
                          className="w-fit px-3 py-1 rounded-lg bg-white"
                        >
                          Add to Existing Playlist
                        </button>
                        <button
                          onClick={() => {
                            setCreatingPlaylist(true);
                            setHandlingPlaylists(false);
                          }}
                          className="w-fit px-3 py-1 rounded-lg bg-white"
                        >
                          Add to New Playlist
                        </button>
                      </div>
                    </div>
                  )}
                  <Button
                    onClick={() => openPlaylistOptions()}
                    playlist
                    stroke="oklch(82.7% 0.119 306.383)"
                  />
                </div>

                <Button
                  repeat
                  loop={loopState}
                  stroke="oklch(82.7% 0.119 306.383)"
                  onClick={() => handleLoop({ audio, onEnded, setLoopState })}
                />
              </div>
              <SongNavi />
              <div className="flex justify-around px-5">
                <Button
                  previous
                  onClick={() =>
                    handlePreviousTrack({
                      audio,
                      setIsReset,
                      currentSong,
                      validFiles,
                      setCurrentSong,
                      isPlaying,
                      setIsPlaying,
                      isShuffling,
                    })
                  }
                  fill="oklch(82.7% 0.119 306.383)"
                />
                <Button
                  playPause
                  isPlaying={isPlaying}
                  onClick={() => handlePlayPause({ isPlaying, setIsPlaying })}
                  stroke="oklch(82.7% 0.119 306.383)"
                />
                <Button
                  fill="oklch(82.7% 0.119 306.383)"
                  skip
                  onClick={() =>
                    handleNextTrack(null, false, {
                      currentSong,
                      audio,
                      loopState,
                      validFiles,
                      setIsPlaying,
                      setIsReset,
                      setCurrentSong,
                      isShuffling,
                    })
                  }
                />
              </div>
            </div>
          </div>
          <Queue />
        </div>
      )}
    </>
  );
}

export default App;
