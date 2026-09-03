import { useState } from "react";
import { createPlaylist } from "../helpers/database/createPlaylist";
import { useFiles } from "../context/FileContext";
import { Search } from "./Search";

export function Sidebar() {
  const [value, setValue] = useState("");
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const { fetchPlaylists, playlists } = useFiles();
  return (
    <>
      {creatingPlaylist && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            createPlaylist(value);
            setValue("");
            fetchPlaylists();
          }}
          className="absolute bg-amber-50 text-black"
        >
          <p>Enter Playlist Name</p>
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-red-400"
          ></input>
        </form>
      )}
      <div className="flex flex-col absolute h-full max-sm:w-full sm:w-full lg:w-[25%] backdrop-blur-lg bg-[#dedbdb79] top-0 z-5 text-white gap-2 justify-center items-center">
        <div className="relative">
          <Search />
          <h2 className="text-2xl mb-20 underline">Playlists</h2>
        </div>
        {playlists?.map((playlist, key) => (
          <div className="px-6 rounded-sm border-2 border-white py-1" key={key}>
            <p>{playlist.playlistName}</p>
          </div>
        ))}
      </div>
    </>
  );
}
