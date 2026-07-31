import { ipcMain } from "electron";

export default function setUpDBHandlers(db: any) {
  ipcMain.handle("liked_songs:add", (_, song: object) => {
    return db.addLikedSong(song);
  });

  ipcMain.handle("liked_songs:remove", (_, id: number) => {
    return db.removeLikedSong(id);
  });

  ipcMain.handle("liked_songs:getAllSongs", () => {
    return db.getLikedSongs();
  });

  ipcMain.handle("liked_songs:increasePlayCount", (id, times_played) => {
    return db.increaseTimesPlayed(id, times_played);
  });
}
