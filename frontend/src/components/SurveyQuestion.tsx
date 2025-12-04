import SurveyOption from "./SurveyOption";
import { useState } from "react";

interface SurveyQuestionProps {
  question: string;
  options: string[];
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({
  question,
  options,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{question}</h2>
      <div className="space-y-4">
        {options.map((option, index) => (
          <SurveyOption
            key={index}
            selected={selectedIndex === index}
            onSelect={() => handleSelect(index)}
            option={option}
          />
        ))}
      </div>
    </div>
  );
};

export default SurveyQuestion;
