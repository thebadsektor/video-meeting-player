import TranscriptBlock from "../TranscriptBlock";
import { useState } from "react";

export default function TranscriptBlockExample() {
  const [activeIndex, setActiveIndex] = useState(0);

  const blocks = [
    {
      speaker: "Gerald Villaran",
      timestamp: "0:06",
      text: "Mic check, mic check. 1, 2, 3.",
    },
    {
      speaker: "Gerald Villaran",
      timestamp: "0:17",
      text: "Mic check, mic check. 1, 2', 3, 4, 5.",
    },
    {
      speaker: "John Smith",
      timestamp: "0:45",
      text: "Thanks for joining everyone. Let's get started with today's discussion.",
    },
  ];

  return (
    <div className="p-6 max-w-2xl">
      {blocks.map((block, index) => (
        <TranscriptBlock
          key={index}
          speaker={block.speaker}
          timestamp={block.timestamp}
          text={block.text}
          isActive={activeIndex === index}
          onClick={() => setActiveIndex(index)}
        />
      ))}
    </div>
  );
}
