import TranscriptView, { TranscriptEntry } from "../TranscriptView";
import { useState } from "react";

const mockEntries: TranscriptEntry[] = [
  {
    speaker: "Gerald Villaran",
    timestamp: "0:06",
    timestampSeconds: 6.45,
    text: "Mic check, mic check. 1, 2, 3.",
  },
  {
    speaker: "Gerald Villaran",
    timestamp: "0:17",
    timestampSeconds: 17.25,
    text: "Mic check, mic check. 1, 2', 3, 4, 5.",
  },
  {
    speaker: "John Smith",
    timestamp: "0:45",
    timestampSeconds: 45.0,
    text: "Thanks for joining everyone. Let's get started with today's discussion about the quarterly roadmap.",
  },
  {
    speaker: "Sarah Johnson",
    timestamp: "1:02",
    timestampSeconds: 62.0,
    text: "I've prepared some slides that outline our progress over the last three months. We've made significant improvements to the user experience.",
  },
  {
    speaker: "Gerald Villaran",
    timestamp: "1:30",
    timestampSeconds: 90.0,
    text: "That's great to hear. Can you walk us through the key metrics?",
  },
];

export default function TranscriptViewExample() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-[600px] border rounded-lg">
      <TranscriptView
        entries={mockEntries}
        activeIndex={activeIndex}
        onSeek={(time) => {
          console.log("Seek to:", time);
          const index = mockEntries.findIndex((e) => e.timestampSeconds === time);
          if (index !== -1) setActiveIndex(index);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
    </div>
  );
}
