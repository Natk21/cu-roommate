import { useState } from "react";

interface SurveyOptionProps {
  selected: boolean;
  onSelect: () => void;
  option: string;
}

const SurveyOption: React.FC<SurveyOptionProps> = ({
  selected,
  onSelect,
  option,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const toggleSelect = () => {
    onSelect();
  };

  return (
    <div
      className={`w-full p-6 bg-white rounded-xl border-2 transition-all duration-200 cursor-pointer
        ${
          selected
            ? "border-red-600 bg-red-50 shadow-md"
            : "border-gray-200 hover:border-red-300 hover:bg-red-50/50"
        }
        ${isHovered && !selected ? "transform -translate-y-0.5" : ""}`}
      onClick={toggleSelect}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <div
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center
          ${selected ? "bg-red-600 border-red-600" : "border-gray-300"}`}
        >
          {selected && (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
        <span
          className={`text-lg font-medium ${selected ? "text-gray-900" : "text-gray-700"}`}
        >
          {option}
        </span>
      </div>
    </div>
  );
};

export default SurveyOption;
