import { useState, useCallback, useEffect } from "react";
import { Video, FileText } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import VideoPlayer from "@/components/VideoPlayer";
import Waveform from "@/components/Waveform";
import TranscriptView, { TranscriptEntry } from "@/components/TranscriptView";
import PresetSelector, { TranscriptPreset } from "@/components/PresetSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  parseRecallTranscript,
  parseVTTTranscript,
  parseRawText,
} from "@/lib/parsers";

const SAMPLE_VIDEO = "/recallai-recording.mp4";
const SAMPLE_TRANSCRIPT = "/sample-transcript.json";

export default function Home() {
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [transcriptEntries, setTranscriptEntries] = useState<TranscriptEntry[]>(
    []
  );
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [preset, setPreset] = useState<TranscriptPreset>("recall");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (transcriptEntries.length > 0) {
      const index = transcriptEntries.findIndex(
        (entry, idx, arr) =>
          entry.timestampSeconds <= currentTime &&
          (idx === arr.length - 1 || arr[idx + 1].timestampSeconds > currentTime)
      );
      if (index !== -1) {
        setActiveIndex(index);
      }
    }
  }, [currentTime, transcriptEntries]);

  const handleVideoSelect = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("video", file);

    try {
      const response = await fetch("/api/upload/video", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      setVideoUrl(data.url);
      toast({
        title: "Video loaded",
        description: `${file.name} has been uploaded successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload the video file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleTranscriptSelect = useCallback(async (file: File) => {
    const formData = new FormData();
    formData.append("transcript", file);

    try {
      const response = await fetch("/api/upload/transcript", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const content = data.content;
      let entries: TranscriptEntry[] = [];

      try {
        if (preset === "recall") {
          const jsonData = JSON.parse(content);
          entries = parseRecallTranscript(jsonData);
        } else if (file.name.endsWith(".vtt")) {
          entries = parseVTTTranscript(content);
        } else {
          entries = parseRawText(content);
        }

        setTranscriptEntries(entries);
        toast({
          title: "Transcript loaded",
          description: `Parsed ${entries.length} transcript entries.`,
        });
      } catch (error) {
        toast({
          title: "Parse error",
          description: "Could not parse the transcript file. Using raw text mode.",
          variant: "destructive",
        });
        entries = parseRawText(content);
        setTranscriptEntries(entries);
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Could not upload the transcript file.",
        variant: "destructive",
      });
    }
  }, [preset, toast]);

  const handleLoadSample = async () => {
    try {
      const response = await fetch(SAMPLE_TRANSCRIPT);
      const jsonData = await response.json();
      const entries = parseRecallTranscript(jsonData);

      setVideoUrl(SAMPLE_VIDEO);
      setTranscriptEntries(entries);
      setPreset("recall");
      toast({
        title: "Sample loaded",
        description: "Sample meeting has been loaded successfully.",
      });
    } catch (error) {
      toast({
        title: "Failed to load sample",
        description: "Could not load the sample meeting.",
        variant: "destructive",
      });
    }
  };

  const showUploader = !videoUrl || transcriptEntries.length === 0;

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="h-16 border-b flex items-center justify-between px-6">
        <h1 className="text-xl font-semibold">Video Meeting Viewer</h1>
        <div className="flex items-center gap-4">
          <PresetSelector value={preset} onChange={setPreset} />
          <Button variant="outline" onClick={handleLoadSample} data-testid="button-load-sample">
            Load Sample Meeting
          </Button>
        </div>
      </header>

      {showUploader ? (
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-2xl w-full space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Get Started</h2>
              <p className="text-muted-foreground">
                Upload a video and transcript file, or load a sample meeting
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <FileUpload
                label="Upload Video"
                accept="video/mp4,video/webm"
                helperText="Drag and drop or click to browse (MP4, WebM)"
                onFileSelect={handleVideoSelect}
                icon={<Video className="w-full h-full" />}
              />
              <FileUpload
                label="Upload Transcript"
                accept=".json,.txt,.vtt,.srt"
                helperText="Drag and drop or click to browse (JSON, TXT, VTT)"
                onFileSelect={handleTranscriptSelect}
                icon={<FileText className="w-full h-full" />}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex gap-4 p-6 overflow-hidden">
          <div className="flex-1 flex flex-col gap-4 min-w-0">
            <VideoPlayer
              videoUrl={videoUrl}
              currentTime={currentTime}
              onTimeUpdate={setCurrentTime}
              onDurationChange={setDuration}
              onVideoElement={setVideoElement}
            />
            {videoElement && (
              <Waveform
                audioElement={videoElement}
                currentTime={currentTime}
                onSeek={setCurrentTime}
              />
            )}
          </div>

          <div className="w-[40%] border-l">
            <TranscriptView
              entries={transcriptEntries}
              activeIndex={activeIndex}
              onSeek={setCurrentTime}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      )}
    </div>
  );
}
