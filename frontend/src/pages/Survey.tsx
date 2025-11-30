import { useState } from "react";
import SurveyLayout from "../components/survey/SurveyLayout";
import NonNegotiables from "../components/survey/sections/NonNegotiables";
import CorePreferences from "../components/survey/sections/CorePreferences";
import VibeReading from "../components/survey/sections/VibeReading";
import DormLogistics from "../components/survey/sections/DormLogistics";
import OptionalPersonality from "../components/survey/sections/OptionalPersonality";

// Define the SurveyResponse interface
export interface SurveyResponse {
  // Non-negotiables
  genderPreference?: string;
  wakeUpTime?: string;
  bedtime?: string;
  noiseTolerance?: string;
  cleanliness?: string;
  smoking?: string;
  guests?: string;
  studyInRoom?: string;
  pets?: string;

  // Core Preferences
  sleepScheduleImportance?: number;
  cleanlinessSelfRating?: number;
  cleaningFrequency?: number;
  cleanlinessMatchImportance?: number;
  studyLocation?: string;
  studyLocationImportance?: number;
  personalityType?: string;
  socialFrequency?: string;
  socialHabitsImportance?: number;
  noiseToleranceLevel?: number;
  messTolerance?: number;
  major?: string;
  college?: string;
  workloadStyle?: string;
  workloadMatchImportance?: number;
  dailyRoutine?: string;

  // Vibe Reading
  roomAtmosphere?: string | string[];
  musicPreference?: string;
  musicPreferenceImportance?: number;
  fridayNight?: string;
  communicationStyle?: number;
  sharingPreference?: string;

  // Dorm Logistics
  desiredDorms?: string[];
  roomType?: string;
  acRequirement?: string;
  moveInFlexibility?: string;

  // Optional
  favoriteStudySpot?: string;
  petPeeves?: string;
  hobbies?: string;
  redFlags?: string;
}

const Survey = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sections = [
    {
      title: "Non-Negotiables",
      component: (
        <NonNegotiables responses={responses} onUpdate={handleResponseUpdate} />
      ),
    },
    {
      title: "Core Preferences",
      component: (
        <CorePreferences
          responses={responses}
          onUpdate={handleResponseUpdate}
        />
      ),
    },
    {
      title: "Vibe Reading",
      component: (
        <VibeReading responses={responses} onUpdate={handleResponseUpdate} />
      ),
    },
    {
      title: "Dorm & Logistics",
      component: (
        <DormLogistics responses={responses} onUpdate={handleResponseUpdate} />
      ),
    },
    {
      title: "Optional",
      component: (
        <OptionalPersonality
          responses={responses}
          onUpdate={handleResponseUpdate}
        />
      ),
    },
  ];

  function handleResponseUpdate(updates: Partial<SurveyResponse>) {
    setResponses((prev) => ({ ...prev, ...updates }));
  }

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      console.log("Submitting survey responses:", responses);

      // Example API call (uncomment and modify as needed):
      /*
      const response = await fetch('/api/survey', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
      });

      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }
      */

      // Handle successful submission
      // You might want to redirect to a success page or show a success message
      console.log("Survey submitted successfully!");
    } catch (error) {
      console.error("Error submitting survey:", error);
      // Handle error (show error message to user, etc.)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SurveyLayout
      title={sections[currentSection].title}
      currentStep={currentSection + 1}
      totalSteps={sections.length}
      onNext={handleNext}
      onBack={handleBack}
      isLastStep={currentSection === sections.length - 1}
      isSubmitting={isSubmitting}
    >
      {sections[currentSection].component}
    </SurveyLayout>
  );
};

export default Survey;
