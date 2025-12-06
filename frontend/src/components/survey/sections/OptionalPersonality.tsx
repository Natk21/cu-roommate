// src/components/survey/sections/OptionalPersonality.tsx
import { SurveyResponse } from "../../../pages/Survey";

const OptionalPersonality = ({
  responses,
  onUpdate,
}: {
  responses: SurveyResponse;
  onUpdate: (updates: Partial<SurveyResponse>) => void;
}) => {
  const handleChange =
    (field: keyof SurveyResponse) =>
    (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
      onUpdate({ [field]: e.target.value });
    };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Favorite Cornell Study Spot
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          (Optional) Where's your go-to place to study on campus?
        </p>
        <input
          type="text"
          value={responses.favoriteStudySpot || ""}
          onChange={handleChange("favoriteStudySpot")}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
          placeholder="e.g., Olin Library, Upson Hall, etc."
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Biggest Pet Peeve in a Roommate
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          (Optional) What's one thing a roommate could do that would really
          bother you?
        </p>
        <textarea
          value={responses.petPeeves || ""}
          onChange={handleChange("petPeeves")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
          placeholder="e.g., Leaving dishes in the sink, being loud late at night, etc."
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          Something You Love Doing
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          (Optional) Share a hobby or interest you're passionate about
        </p>
        <textarea
          value={responses.hobbies || ""}
          onChange={handleChange("hobbies")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
          placeholder="e.g., Hiking, gaming, cooking, etc."
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium text-gray-900">
          What "Red Flags" Are You Trying to Avoid?
        </h3>
        <p className="text-sm text-gray-500 mb-2">
          (Optional) Any deal-breakers we should know about?
        </p>
        <textarea
          value={responses.redFlags || ""}
          onChange={handleChange("redFlags")}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm p-3 border"
          placeholder="e.g., Smoking, frequent overnight guests, etc."
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Thanks for taking the time to complete this survey! Your responses
          will help us find you the best possible roommate match.
        </p>
      </div>
    </div>
  );
};

export default OptionalPersonality;
