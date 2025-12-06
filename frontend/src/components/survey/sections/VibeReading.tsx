// src/components/survey/sections/VibeReading.tsx
import { SurveyResponse } from "../../../pages/Survey";
import SliderQuestion from "../SliderQuestion";

interface VibeReadingProps {
  responses: SurveyResponse;
  onUpdate: (updates: Partial<SurveyResponse>) => void;
}

const VibeReading = ({ responses, onUpdate }: VibeReadingProps) => {
  const handleChange = (field: keyof SurveyResponse) => (value: any) => {
    onUpdate({ [field]: value });
  };

  const handleMultiSelect = (field: keyof SurveyResponse, value: string) => {
    const currentValues = new Set((responses[field] as string[]) || []);
    if (currentValues.has(value)) {
      currentValues.delete(value);
    } else {
      currentValues.add(value);
    }
    onUpdate({ [field]: Array.from(currentValues) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Room Atmosphere
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Ideal Room Atmosphere
            </h3>
            <p className="text-sm text-gray-500 mb-3">Select all that apply</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Cozy/quiet",
                "Academic focus",
                "Social hub",
                "Minimalist",
                "Artsy/creative",
                "Gym-focused",
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${
                    (responses.roomAtmosphere || []).includes(option)
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={(responses.roomAtmosphere || []).includes(option)}
                    onChange={() => handleMultiSelect("roomAtmosphere", option)}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Music in the Room
            </h3>
            <div className="space-y-3">
              {[
                "No music out loud",
                "Music allowed at low volume",
                "Music is always playing",
                "I use speakers regularly",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="musicPreference"
                    checked={responses.musicPreference === option}
                    onChange={() => handleChange("musicPreference")(option)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
              <div className="pl-7 mt-2">
                <SliderQuestion
                  question="How important is matching music preferences?"
                  minLabel="Not important"
                  maxLabel="Very important"
                  value={responses.musicPreferenceImportance || 3}
                  onChange={handleChange("musicPreferenceImportance")}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Ideal Friday Night
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Select your typical Friday night preference
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Studying",
                "Gaming",
                "Hanging with friends",
                "Out in Collegetown",
                "Watching Netflix",
                "Cooking / chilling in",
              ].map((option) => (
                <label
                  key={option}
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-colors cursor-pointer ${
                    responses.fridayNight === option
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="radio"
                    name="fridayNight"
                    checked={responses.fridayNight === option}
                    onChange={() => handleChange("fridayNight")(option)}
                    className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Communication Style
            </h3>
            <SliderQuestion
              question="How do you prefer to communicate with your roommate?"
              minLabel="Talk everything out"
              maxLabel="Mostly quiet"
              value={responses.communicationStyle || 3}
              onChange={handleChange("communicationStyle")}
            />
            <p className="text-xs text-gray-500 mt-1">
              {responses.communicationStyle === 1 &&
                "You prefer open and frequent communication about everything."}
              {responses.communicationStyle === 2 &&
                "You like to communicate but value some personal space."}
              {responses.communicationStyle === 3 &&
                "You're comfortable with a balance of communication and quiet time."}
              {responses.communicationStyle === 4 &&
                "You prefer minimal but important communication."}
              {responses.communicationStyle === 5 &&
                "You prefer a mostly quiet living space with little conversation."}
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              Openness to Sharing Items
            </h3>
            <div className="space-y-3">
              {[
                "Never share",
                "Only borrowing with permission",
                "Don’t care",
                "Share anything",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <input
                    type="radio"
                    name="sharingPreference"
                    checked={responses.sharingPreference === option}
                    onChange={() => handleChange("sharingPreference")(option)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VibeReading;
