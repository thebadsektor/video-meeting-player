import PresetSelector, { TranscriptPreset } from "../PresetSelector";
import { useState } from "react";

export default function PresetSelectorExample() {
  const [preset, setPreset] = useState<TranscriptPreset>("recall");

  return (
    <div className="p-6">
      <PresetSelector
        value={preset}
        onChange={(value) => {
          setPreset(value);
          console.log("Preset changed to:", value);
        }}
      />
    </div>
  );
}
