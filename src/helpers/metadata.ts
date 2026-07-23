import { formatTime } from "./formatTime";

export async function getMetaData(song: string, setState: any) {
  // Get metadata
  const data = await window.handlers.getMetaData(song);

  // Convert time to the duration
  data.duration = formatTime(data.duration);

  // Handle the artwork
  const coverArt = data.coverArt[0];
  const blob = new Blob([coverArt.data], {
    type: coverArt.format,
  });
  const url = URL.createObjectURL(blob);
  data.coverArt = url;

  setState(data);
}
