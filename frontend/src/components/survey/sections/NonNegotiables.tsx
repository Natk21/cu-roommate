import { SurveyResponse } from "../../../pages/Survey";

interface NonNegotiablesProps {
  responses: SurveyResponse;
  onUpdate: (updates: Partial<SurveyResponse>) => void;
}

const NonNegotiables = ({ responses, onUpdate }: NonNegotiablesProps) => {
  const handleChange = (field: keyof SurveyResponse) => (value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Your Gender</h3>
        <div className="space-y-3 mt-3">
          {["Male", "Female", "Other"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="gender"
                checked={responses.gender === option}
                onChange={() => handleChange("gender")(option)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Gender Preference</h3>
        <div className="space-y-3 mt-3">
          {["My gender", "Any gender"].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="genderPreference"
                checked={responses.genderPreference === option}
                onChange={() => handleChange("genderPreference")(option)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Wake-Up Time Range
        </h3>
        <p className="text-sm text-gray-500">
          What's the latest your roommate can wake up without it being a
          problem?
        </p>
        <div className="space-y-3 mt-3">
          {[
            "Before 8 AM",
            "Before 10 AM",
            "Before noon",
            "Anytime is fine",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="wakeUpTime"
                checked={responses.wakeUpTime === option}
                onChange={() => handleChange("wakeUpTime")(option)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Bedtime Range</h3>
        <p className="text-sm text-gray-500">
          What's the latest acceptable bedtime for your roommate?
        </p>
        <div className="space-y-3 mt-3">
          {[
            "Before 11 PM",
            "Before 1 AM",
            "Before 3 AM",
            "Anytime is fine",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="bedtime"
                checked={responses.bedtime === option}
                onChange={() => handleChange("bedtime")(option)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">Noise in Room</h3>
        <p className="text-sm text-gray-500">
          On a typical day, my room's noise level would ideally be:
        </p>
        <div className="space-y-3 mt-3">
          {[
            "Loud (Social hub)",
            "Moderate (Quiet conversation)",
            "Quiet (No noise)",
            "I’m fine with all of these",
          ].map((option) => (
            <label
              key={option}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="noiseTolerance"
                checked={responses.noiseTolerance === option}
                onChange={() => handleChange("noiseTolerance")(option)}
                className="h-5 w-5 mt-0.5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Cleanliness Minimum Requirement
        </h3>
        <p className="text-sm text-gray-500">My roommate must at least be:</p>
        <div className="space-y-3 mt-3">
          {[
            "Very tidy (everything in place)",
            "Moderately tidy (clean weekly)",
            "Lightly messy is fine",
            "I don’t care",
          ].map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <input
                type="radio"
                name="cleanliness"
                checked={responses.cleanliness === option}
                onChange={() => handleChange("cleanliness")(option)}
                className="h-5 w-5 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-gray-700">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NonNegotiables;
