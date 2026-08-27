import { DBFile } from "../../context/FileContext";
import { getMetaData } from "../metadata";
import { shuffleArray } from "../shuffleArray";

export async function handleLoadRandomSamples(
  setUsingSamples: React.Dispatch<React.SetStateAction<boolean>>,
  setValidFiles: React.Dispatch<React.SetStateAction<DBFile[] | null>>,
) {
  const samples = [
    "A Serious Time.wav",
    "Bard's Shop.wav",
    "Early Bird's Stroll.wav",
    "Fat Cat.wav",
    "It's Time for Rest...wav",
    "Main Menu.wav",
    "Meow.wav",
    "Might Float.wav",
    "Night Owl's Stroll.wav",
    "Sneaking By.wav",
    "Stuck Cave Diving.wav",
    "The Trenches.wav",
    "Thinking of Another Way.wav",
  ];
  const selectedSamples = shuffleArray(samples).splice(0, 3);

  const songs = selectedSamples.map(async (sample: string) => {
    const res = await fetch(`./src/assets/sample_audio/${sample}`);
    const songData: Blob = await res.blob();

    const file = new File([songData], sample, {
      type: songData.type,
      lastModified: Date.now(),
    });

    const metadata = await getMetaData(file);

    return { file, metadata };
  });

  const songFiles = await Promise.all(songs);

  setUsingSamples(true);
  setValidFiles(songFiles);
}
