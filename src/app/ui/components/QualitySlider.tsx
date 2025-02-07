"use client";

import { Slider } from "@/ui/shadcn/slider";
import { useState } from "react";

interface Props {
  value: number[];
  onChanged: (value: number[]) => void;
  disabled?: boolean;
}

const QualitySlider = ({ value, onChanged, disabled = false }: Props) => {
  const [quality, setQuality] = useState<number[]>(value);

  return (
    <div>
      <div className="text-center mb-1">Quality: {quality[0]}%</div>
      <Slider
        value={quality}
        onValueChange={(value) => {
          setQuality(value);
        }}
        onValueCommit={(value) => {
          onChanged(value);
        }}
        min={1}
        max={100}
        step={1}
        disabled={disabled}
      />
    </div>
  );
};

export default QualitySlider;
