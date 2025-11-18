import { cn } from "@/lib/utils";

interface TranscriptBlockProps {
  speaker: string;
  timestamp: string;
  text: string;
  isActive: boolean;
  onClick: () => void;
}

export default function TranscriptBlock({
  speaker,
  timestamp,
  text,
  isActive,
  onClick,
}: TranscriptBlockProps) {
  return (
    <div
      className={cn(
        "mb-6 p-4 rounded-lg cursor-pointer transition-all duration-200 hover-elevate",
        isActive && "bg-accent"
      )}
      onClick={onClick}
      data-testid={`transcript-block-${timestamp}`}
    >
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-semibold text-sm" data-testid="text-speaker">
          {speaker}
        </span>
        <span className="font-mono text-xs text-muted-foreground opacity-70" data-testid="text-timestamp">
          {timestamp}
        </span>
      </div>
      <p className="text-sm leading-relaxed select-text" data-testid="text-content">
        {text}
      </p>
    </div>
  );
}
