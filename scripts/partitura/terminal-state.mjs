/** Interpreta apenas o estado mais recente do transcript do terminal. */
export function terminalIsBusy(output) {
  const transcript = String(output || '').replace(/\r\n/g, '\n');
  let lastBusy = -1;
  const busyIndicator = /(?:^|\n)\s*[◦•]\s+(?:Working|Exploring)\s*\(/giu;
  for (const match of transcript.matchAll(busyIndicator)) lastBusy = match.index;

  const lastCompleted = Math.max(
    transcript.lastIndexOf('Worked for'),
    transcript.lastIndexOf('Passagem concluída'),
    transcript.lastIndexOf('Passagem finalizada'),
  );
  return lastBusy > lastCompleted;
}
