import { useState } from "react";
import { createPlaylist } from "../helpers/database/createPlaylist";
import { useFiles } from "../context/FileContext";
import { Search } from "./Search";
import { getPlaylistSongs } from "../helpers/database/getPlaylistSongs";

export function Sidebar() {
  const { playlists } = useFiles();

  return (
    <>
      <div className="flex flex-col absolute h-full max-sm:w-full sm:w-full lg:w-[25%] backdrop-blur-lg bg-[#dedbdb79] top-0 z-5 text-white gap-2 justify-center items-center">
        <div className="relative">
          <Search />
          <h2 className="text-2xl mb-20 underline">Playlists</h2>
        </div>
        {playlists?.map((playlist, key) => (
          <div
            onClick={() => getPlaylistSongs(playlist.id)}
            className="px-6 rounded-sm border-2 border-white py-1"
            key={key}
          >
            <p>{playlist.playlistName}</p>
          </div>
        ))}
      </div>
    </>
  );
}
