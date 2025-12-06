// src/components/survey/sections/DormLogistics.tsx
import { SurveyResponse } from "../../../pages/Survey";

const dorms = [
  "Donlon",
  "Low Rise",
  "Jameson",
  "Balch",
  "Bethe",
  "Keeton",
  "Cook",
  "Becker",
  "Mews/Court",
  "Any",
];

const roomTypes = [
  "Single",
  "Double",
  "Suite",
  "Traditional Hall",
  "No preference",
];

const DormLogistics = ({
  responses,
  onUpdate,
}: {
  responses: SurveyResponse;
  onUpdate: (updates: Partial<SurveyResponse>) => void;
}) => {
  const handleChange = (field: keyof SurveyResponse) => (value: any) => {
    onUpdate({ [field]: value });
  };

  const handleCheckboxChange =
    (field: keyof SurveyResponse, value: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const currentValues = new Set((responses[field] as string[]) || []);
      if (e.target.checked) {
        currentValues.add(value);
      } else {
        currentValues.delete(value);
      }
      onUpdate({ [field]: Array.from(currentValues) });
    };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Desired Dorms</h3>
        <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {dorms.map((dorm) => (
            <label
              key={dorm}
              className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
            >
              <input
                type="checkbox"
                checked={(responses.desiredDorms || []).includes(dorm)}
                onChange={handleCheckboxChange("desiredDorms", dorm)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">{dorm}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Room Type Preference
        </h3>
        <div className="space-y-3 mt-3">
          {roomTypes.map((type) => (
            <label
              key={type}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="roomType"
                checked={responses.roomType === type}
                onChange={() => handleChange("roomType")(type)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">AC Requirement</h3>
        <div className="space-y-3 mt-3">
          {["Must have A/C", "Prefer A/C", "Don’t care"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="acRequirement"
                checked={responses.acRequirement === option}
                onChange={() => handleChange("acRequirement")(option)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Move-in Time Flexibility
        </h3>
        <div className="space-y-3 mt-3">
          {["Early", "Normal", "Late", "Flexible"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="moveInFlexibility"
                checked={responses.moveInFlexibility === option}
                onChange={() => handleChange("moveInFlexibility")(option)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DormLogistics;
