import { LyricLine } from '../types';

export function parseLRC(lrcText: string): LyricLine[] {
  if (!lrcText) return [];
  const lines = lrcText.split('\n');
  const result: LyricLine[] = [];
  
  // Matches timestamps like [01:23.45] or [02:34] or [00:12:30]
  const timeRegex = /\[(\d+):(\d+)(?:[.:](\d+))?\]/g;

  for (const line of lines) {
    const text = line.replace(/\[\d+:\d+(?:[.:]\d+)?\]/g, '').trim();
    if (!text && line.includes(']')) {
      // Keep blank lines for timing gaps/pauses, sometimes useful
    }
    
    let match;
    timeRegex.lastIndex = 0; // reset RegExp index for multiple matches on the same line
    
    while ((match = timeRegex.exec(line)) !== null) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const millisecondsVal = match[3] ? parseInt(match[3], 10) : 0;
      
      let msFraction = 0;
      if (match[3]) {
        const len = match[3].length;
        if (len === 2) {
          msFraction = millisecondsVal / 100;
        } else if (len === 3) {
          msFraction = millisecondsVal / 1000;
        } else {
          msFraction = millisecondsVal / Math.pow(10, len);
        }
      }
      
      const timeInSeconds = minutes * 60 + seconds + msFraction;
      
      // Ignore some metadata tags like [ti:Song Title] or [ar:Artist]
      if (isNaN(timeInSeconds)) continue;

      result.push({
        time: timeInSeconds,
        text: text,
      });
    }
  }

  // Sort chronologically
  return result.sort((a, b) => a.time - b.time);
}
