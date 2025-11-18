import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import TranscriptBlock from "./TranscriptBlock";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export interface TranscriptEntry {
  speaker: string;
  timestamp: string;
  timestampSeconds: number;
  text: string;
}

interface TranscriptViewProps {
  entries: TranscriptEntry[];
  activeIndex: number;
  onSeek: (time: number) => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export default function TranscriptView({
  entries,
  activeIndex,
  onSeek,
  searchQuery = "",
  onSearchChange,
}: TranscriptViewProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const activeBlockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeBlockRef.current && scrollAreaRef.current) {
      const container = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (container) {
        const blockRect = activeBlockRef.current.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const offset = blockRect.top - containerRect.top - 100;
        
        container.scrollBy({
          top: offset,
          behavior: "smooth",
        });
      }
    }
  }, [activeIndex]);

  const filteredEntries = searchQuery
    ? entries.filter(
        (entry) =>
          entry.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.speaker.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : entries;

  return (
    <div className="h-full flex flex-col">
      {onSearchChange && (
        <div className="p-6 pb-4 sticky top-0 bg-background z-10 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>
      )}

      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-6">
          {filteredEntries.map((entry, index) => (
            <div
              key={index}
              ref={index === activeIndex ? activeBlockRef : undefined}
            >
              <TranscriptBlock
                speaker={entry.speaker}
                timestamp={entry.timestamp}
                text={entry.text}
                isActive={index === activeIndex}
                onClick={() => onSeek(entry.timestampSeconds)}
              />
            </div>
          ))}
          {filteredEntries.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              No results found
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
