import { app, BrowserWindow, ipcMain } from "electron";
// import { createRequire } from "node:module";
import { parseFile } from "music-metadata";
import { fileURLToPath } from "node:url";
import path from "node:path";
import Database from "better-sqlite3";
import setUpDBHandlers from "./ipcHandlers";

// const require = createRequire(import.meta.url);
const dbPath = path.join(app.getPath("userData"), "libraries.sqlite");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

const dbHandlers = {
  addLikedSong,
  removeLikedSong,
  increaseTimesPlayed,
  getLikedSongs,
  closedb,
};

function setUpDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS liked_songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_name TEXT NOT NULL,
    album TEXT NOT NULL,
    artist TEXT NOT NULL,
    times_played INTEGER NOT NULL DEFAULT 0,
    duration TEXT NOT NULL
    )
    `);
  console.log("db init");
}

function addLikedSong(song: object) {
  console.log(song);
  const stmt = db.prepare(
    "INSERT INTO liked_songs (song_name, album, artist, duration) VALUES (?, ?, ?, ?)",
  );
  const info = stmt.run(song.songName, song.album, song.artist, song.duration);
  // return {
  //   id: info.lastInsertRowid,
  //   song_name: song.songName,
  //   album: song.album,
  //   artist: song.artist,
  // };
}

function removeLikedSong(id: number) {
  console.log(id);
  const stmt = db.prepare("DELETE FROM liked_songs WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
}

function increaseTimesPlayed(id, times_played) {
  const stmt = db.prepare(
    "UPDATE liked_songs SET times_played = ? WHERE id = ?",
  );
  const info = stmt.run();
  return info.changes > 0;
}

function getLikedSongs() {
  const stmt = db.prepare("SELECT * from liked_songs ORDER BY id DESC");
  return stmt.all();
}

function closedb() {
  db.close();
  console.log("db closed");
}
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.mjs
// │
process.env.APP_ROOT = path.join(__dirname, "..");

// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
export const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
export const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
export const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, "public")
  : RENDERER_DIST;

let win: BrowserWindow | null;

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 320,
    height: 568,
    minWidth: 320,
    minHeight: 568,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  win.removeMenu();
  win.webContents.openDevTools();
  // Test active push message to Renderer-process.
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  ipcMain.handle("get-metadata", async (_, filePath: string) => {
    const metadata = await parseFile(filePath);

    return {
      songName: metadata.common.title,
      artist: metadata.common.artist,
      album: metadata.common.album,
      coverArt: metadata.common.picture,
      duration: metadata.format.duration,
    };
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.once("ready-to-show", () => {
    win?.show();
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createWindow();
  setUpDatabase();
  setUpDBHandlers(dbHandlers);
});
