import { useState, useEffect } from "react";

interface SliderQuestionProps {
  question: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  className?: string;
}

const SliderQuestion = ({
  question,
  value = 3,
  min = 1,
  max = 5,
  step = 1,
  onChange,
  minLabel = "Not important",
  maxLabel = "Very important",
  className = "",
}: SliderQuestionProps) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Generate step markers
  const steps = [];
  for (let i = min; i <= max; i += step) {
    steps.push(i);
  }

  return (
    <div className={`space-y-4 py-4 ${className}`}>
      <div className="flex justify-between items-center">
        <label className="block text-lg font-medium text-gray-700">
          {question}
        </label>
        <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
          {localValue}
        </span>
      </div>

      <div className="px-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localValue}
          onChange={(e) => {
            const newValue = parseFloat(e.target.value);
            setLocalValue(newValue);
            onChange(newValue);
          }}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />

        {/* Step markers */}
        <div className="flex justify-between mt-1 px-1">
          {steps.map((step) => (
            <div
              key={step}
              className={`w-1 h-1 rounded-full ${localValue >= step ? "bg-red-500" : "bg-gray-300"}`}
            />
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );
};

export default SliderQuestion;
