export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function unformatTime(time: string) {
  const parts = time.split(":").map(Number);

  if (parts.length === 2) {
    const [mins, secs] = parts;
    return mins * 60 + secs;
  }

  if (parts.length === 3) {
    const [hours, mins, secs] = parts;
    return hours * 3600 + mins * 60 + secs;
  }

  return 0;
}
