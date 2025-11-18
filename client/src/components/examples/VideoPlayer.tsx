import VideoPlayer from "../VideoPlayer";
import { useState } from "react";

export default function VideoPlayerExample() {
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <div className="p-6 max-w-4xl">
      <VideoPlayer
        videoUrl="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        currentTime={currentTime}
        onTimeUpdate={setCurrentTime}
        onDurationChange={(duration) => console.log("Duration:", duration)}
      />
    </div>
  );
}
