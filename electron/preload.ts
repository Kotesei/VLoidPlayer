import { ipcRenderer, contextBridge } from "electron";

const dbHandlers = {
  likeSong: (_: any, song: object) =>
    ipcRenderer.invoke("liked_songs:add", song),
  removeLikedSong: (_: any, song: object) =>
    ipcRenderer.invoke("liked_songs:remove", song),
  getAllSongs: () => ipcRenderer.invoke("liked_songs:getAllSongs"),
};
contextBridge.exposeInMainWorld("handlers", {
  getMetaData: (filePath: string) =>
    ipcRenderer.invoke("get-metadata", filePath),
});
contextBridge.exposeInMainWorld("dbHandlers", dbHandlers);
