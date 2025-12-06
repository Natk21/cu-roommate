import SliderQuestion from "../SliderQuestion";
import { SurveyResponse } from "../../../pages/Survey";
import { COLLEGES_AND_MAJORS } from "../../../constants/collegesAndMajors";
import { useEffect, useState } from "react";

interface CorePreferencesProps {
  responses: SurveyResponse;
  onUpdate: (updates: Partial<SurveyResponse>) => void;
}

const CorePreferences = ({ responses, onUpdate }: CorePreferencesProps) => {
  const handleChange = (field: keyof SurveyResponse) => (value: any) => {
    onUpdate({ [field]: value });
  };

  // Inside your component, add these state variables
  const [availableMajors, setAvailableMajors] = useState<string[]>([]);

  // Update available majors when college changes
  useEffect(() => {
    if (responses.college) {
      const selectedCollege = COLLEGES_AND_MAJORS.find(
        (c) => c.name === responses.college
      );
      setAvailableMajors(selectedCollege?.majors || []);
      // Reset major when college changes
      if (responses.major && !availableMajors.includes(responses.major)) {
        handleChange("major")("");
      }
    } else {
      setAvailableMajors([]);
    }
  }, [responses.college]);

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Lifestyle & Habits
        </h2>

        <div className="space-y-6">
          <SliderQuestion
            question="10. How close do you want your sleep schedule to match your roommate's?"
            minLabel="Don't care"
            maxLabel="Very important"
            value={responses.sleepScheduleImportance || 3}
            onChange={handleChange("sleepScheduleImportance")}
          />

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              11. Cleanliness Preferences
            </h3>
            <SliderQuestion
              question="How tidy do you keep your space?"
              minLabel="Not tidy"
              maxLabel="Very tidy"
              value={responses.cleanlinessSelfRating || 3}
              onChange={handleChange("cleanlinessSelfRating")}
              className="pl-4"
            />
            <SliderQuestion
              question="How often do you clean?"
              minLabel="Rarely"
              maxLabel="Very often"
              value={responses.cleaningFrequency || 3}
              onChange={handleChange("cleaningFrequency")}
              className="pl-4"
            />
            <SliderQuestion
              question="How important is it that your roommate matches this?"
              minLabel="Not important"
              maxLabel="Very important"
              value={responses.cleanlinessMatchImportance || 3}
              onChange={handleChange("cleanlinessMatchImportance")}
              className="pl-4"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              12. Study Habits
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              Where do you usually study?
            </p>
            <div className="space-y-3 pl-4">
              {[
                "In the room",
                "Olin/Uris",
                "Duffield/CS spaces",
                "Mann Library",
                "eHub or cafés",
                "Other (please specify)",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="studyLocation"
                    checked={responses.studyLocation === option}
                    onChange={() => handleChange("studyLocation")(option)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
            <SliderQuestion
              question="How important is matching study locations?"
              minLabel="Not important"
              maxLabel="Very important"
              value={responses.studyLocationImportance || 3}
              onChange={handleChange("studyLocationImportance")}
              className="pl-4"
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              13. Introvert / Extrovert Scale
            </h3>
            <div className="space-y-3 pl-4">
              {[
                "Very Introverted",
                "Mostly Introverted",
                "Neutral",
                "Mostly Extroverted",
                "Very Extroverted",
              ].map((option) => (
                <label key={option} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="personalityType"
                    checked={responses.personalityType === option}
                    onChange={() => handleChange("personalityType")(option)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              14. Social Lifestyle
            </h3>
            <p className="text-sm text-gray-500 mb-3">
              How often do you go out?
            </p>
            <div className="space-y-3 pl-4">
              {["Rarely", "Occasionally", "Weekends", "3+ nights a week"].map(
                (option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="socialFrequency"
                      checked={responses.socialFrequency === option}
                      onChange={() => handleChange("socialFrequency")(option)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                )
              )}
            </div>
            <SliderQuestion
              question="How important is matching social habits?"
              minLabel="Not important"
              maxLabel="Very important"
              value={responses.socialHabitsImportance || 3}
              onChange={handleChange("socialHabitsImportance")}
              className="pl-4"
            />
          </div>

          <div className="space-y-2">
            <SliderQuestion
              question="15. Noise Tolerance"
              minLabel="Needs quiet"
              maxLabel="Very tolerant"
              value={responses.noiseToleranceLevel || 3}
              onChange={handleChange("noiseToleranceLevel")}
            />
            <SliderQuestion
              question="16. Mess Tolerance"
              minLabel="Needs very clean"
              maxLabel="Doesn't mind clutter"
              value={responses.messTolerance || 3}
              onChange={handleChange("messTolerance")}
            />
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
          Academics
        </h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              17. Major / College
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="college"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  College
                </label>
                <select
                  id="college"
                  value={responses.college || ""}
                  onChange={(e) => {
                    handleChange("college")(e.target.value);
                    if (responses.major) {
                      handleChange("major")("");
                    }
                  }}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  required
                >
                  <option value="" disabled>
                    Select college
                  </option>
                  {COLLEGES_AND_MAJORS.map((college) => (
                    <option key={college.code} value={college.name}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="major"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Major
                </label>
                <select
                  id="major"
                  value={responses.major || ""}
                  onChange={(e) => handleChange("major")(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-red-500 focus:outline-none focus:ring-red-500 sm:text-sm"
                  disabled={!responses.college}
                  required={!!responses.college}
                >
                  <option value="" disabled>
                    {responses.college
                      ? "Select major"
                      : "Select a college first"}
                  </option>
                  {availableMajors.map((major) => (
                    <option key={major} value={major}>
                      {major}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              18. Workload Style
            </h3>
            <div className="space-y-3 pl-4">
              {["Academic grind", "Balanced", "Light/stress-free"].map(
                (option) => (
                  <label key={option} className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="workloadStyle"
                      checked={responses.workloadStyle === option}
                      onChange={() => handleChange("workloadStyle")(option)}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                )
              )}
              <SliderQuestion
                question="How important is matching workload styles?"
                minLabel="Not important"
                maxLabel="Very important"
                value={responses.workloadMatchImportance || 3}
                onChange={handleChange("workloadMatchImportance")}
                className="pl-4"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium text-gray-900">
              19. Daily Routine
            </h3>
            <p className="text-sm text-gray-500 mb-3">Are you a:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pl-4">
              {[
                "Morning person",
                "Afternoon person",
                "Night owl",
                "Chaos schedule",
              ].map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="dailyRoutine"
                    checked={responses.dailyRoutine === option}
                    onChange={() => handleChange("dailyRoutine")(option)}
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

export default CorePreferences;
