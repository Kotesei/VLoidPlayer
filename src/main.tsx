import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AudioProvider } from "./context/AudioContext.tsx";
import { TracksProvider } from "./context/FileContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <TracksProvider>
      <AudioProvider>
        <App />
      </AudioProvider>
    </TracksProvider>
  </React.StrictMode>,
);
