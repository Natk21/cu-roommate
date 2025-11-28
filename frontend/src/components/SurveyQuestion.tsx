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
    setSelectedIndex(index);
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <div className="w-[1274px] justify-center text-black text-5xl font-semibold leading-[72px]">
        {question}
      </div>
      <div>
        {options.map((option, index) => (
          <SurveyOption
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
