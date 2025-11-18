import { TranscriptEntry } from "@/components/TranscriptView";

interface RecallWord {
  text: string;
  start_timestamp: {
    relative: number;
    absolute: string;
  };
  end_timestamp: {
    relative: number;
    absolute: string;
  };
}

interface RecallParticipant {
  id: number;
  name: string;
  extra_data?: any;
  is_host?: boolean;
  platform?: string;
  email?: string | null;
}

interface RecallTranscriptEntry {
  participant: RecallParticipant;
  words: RecallWord[];
}

function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function parseRecallTranscript(jsonData: RecallTranscriptEntry[]): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];

  for (const entry of jsonData) {
    const speaker = entry.participant.name;
    const words = entry.words;

    if (words.length === 0) continue;

    const startTime = words[0].start_timestamp.relative;
    const text = words.map((w) => w.text).join(" ");

    entries.push({
      speaker,
      timestamp: formatTimestamp(startTime),
      timestampSeconds: startTime,
      text,
    });
  }

  return entries;
}

export function parseVTTTranscript(vttContent: string): TranscriptEntry[] {
  const entries: TranscriptEntry[] = [];
  const lines = vttContent.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();
    
    if (line.includes("-->")) {
      const timeMatch = line.match(/(\d{2}):(\d{2}):(\d{2})/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const mins = parseInt(timeMatch[2]);
        const secs = parseInt(timeMatch[3]);
        const timestampSeconds = hours * 3600 + mins * 60 + secs;
        
        i++;
        const text = lines[i]?.trim() || "";
        
        entries.push({
          speaker: "Speaker",
          timestamp: formatTimestamp(timestampSeconds),
          timestampSeconds,
          text,
        });
      }
    }
    i++;
  }

  return entries;
}

export function parseRawText(content: string): TranscriptEntry[] {
  const lines = content.split("\n").filter((line) => line.trim());
  
  return lines.map((line, index) => ({
    speaker: "Speaker",
    timestamp: formatTimestamp(index * 5),
    timestampSeconds: index * 5,
    text: line.trim(),
  }));
}
