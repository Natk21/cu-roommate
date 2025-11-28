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
  const toggleSelect = () => {
    onSelect();
  };

  return (
    <div
      className={`w-[1274px] h-28 bg-neutral-100 rounded-3xl border-4 ${selected ? "border-customRed" : "border-transparent"}`}
      onClick={toggleSelect}
    >
      <div className="justify-center text-black text-5xl font-medium leading-[72px]">
        {option}
      </div>
    </div>
  );
};

export default SurveyOption;
