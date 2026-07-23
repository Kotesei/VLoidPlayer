import { ipcRenderer, contextBridge } from "electron";

contextBridge.exposeInMainWorld("handlers", {
  getMetaData: (filePath: string) =>
    ipcRenderer.invoke("get-metadata", filePath),
});
