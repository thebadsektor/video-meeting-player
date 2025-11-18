import Waveform from "../Waveform";
import { useState } from "react";

export default function WaveformExample() {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="p-6">
      <Waveform
        audioUrl="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        currentTime={currentTime}
        onSeek={(time) => {
          setCurrentTime(time);
          console.log("Seek to:", time);
        }}
      />
    </div>
  );
}
