import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WaveformProps {
  audioElement: HTMLVideoElement;
  currentTime: number;
  onSeek: (time: number) => void;
}

export default function Waveform({
  audioElement,
  currentTime,
  onSeek,
}: WaveformProps) {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "hsl(var(--muted-foreground))",
        progressColor: "hsl(var(--primary))",
        cursorColor: "hsl(var(--primary))",
        barWidth: 2,
        barGap: 1,
        barRadius: 2,
        height: 96,
        normalize: true,
        interact: true,
      });

      wavesurferRef.current.on("click", (relativeX) => {
        if (wavesurferRef.current) {
          const duration = wavesurferRef.current.getDuration();
          onSeek(relativeX * duration);
        }
      });

      wavesurferRef.current.load(audioElement.src);
    }

    return () => {
      if (wavesurferRef.current) {
        wavesurferRef.current.destroy();
        wavesurferRef.current = null;
      }
    };
  }, [audioElement, onSeek]);

  useEffect(() => {
    if (wavesurferRef.current) {
      const duration = wavesurferRef.current.getDuration();
      if (duration > 0) {
        wavesurferRef.current.seekTo(currentTime / duration);
      }
    }
  }, [currentTime]);

  useEffect(() => {
    if (wavesurferRef.current && wavesurferRef.current.getDuration() > 0) {
      wavesurferRef.current.zoom(zoomLevel);
    }
  }, [zoomLevel]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 50, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 50, 1));
  };

  return (
    <div className="rounded-lg border p-4 relative">
      <div className="absolute top-2 right-2 flex gap-2 z-10">
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomOut}
          disabled={zoomLevel <= 1}
          className="h-8 w-8"
          data-testid="button-zoom-out"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={handleZoomIn}
          disabled={zoomLevel >= 200}
          className="h-8 w-8"
          data-testid="button-zoom-in"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
      </div>
      <div ref={waveformRef} className="w-full h-24" data-testid="waveform-container" />
    </div>
  );
}
