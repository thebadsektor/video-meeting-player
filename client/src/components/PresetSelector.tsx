import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";

export type TranscriptPreset = "recall" | "zoom" | "google-meet" | "teams" | "raw";

interface PresetSelectorProps {
  value: TranscriptPreset;
  onChange: (value: TranscriptPreset) => void;
}

const presets = [
  { value: "recall" as const, label: "Recall.ai" },
  { value: "zoom" as const, label: "Zoom" },
  { value: "google-meet" as const, label: "Google Meet" },
  { value: "teams" as const, label: "Microsoft Teams" },
  { value: "raw" as const, label: "Raw Text" },
];

export default function PresetSelector({ value, onChange }: PresetSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <FileText className="w-4 h-4 text-muted-foreground" />
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48" data-testid="select-preset">
          <SelectValue placeholder="Select preset" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
            <SelectItem key={preset.value} value={preset.value}>
              {preset.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
