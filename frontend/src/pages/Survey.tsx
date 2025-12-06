import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { getUserSurvey, submitSurvey } from "../services/surveyService";
import { getUserBasicInfo } from "../services/userService";
import SurveyLayout from "../components/survey/SurveyLayout";
import NonNegotiables from "../components/survey/sections/NonNegotiables";
import CorePreferences from "../components/survey/sections/CorePreferences";
import VibeReading from "../components/survey/sections/VibeReading";
import OptionalPersonality from "../components/survey/sections/OptionalPersonality";

// Define the SurveyResponse interface
export interface SurveyResponse {
  // Non-negotiables
  gender?: string;
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
  personalityType?: string;
  socialFrequency?: string;
  socialHabitsImportance?: number;
  noiseToleranceLevel?: number;
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
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const checkSurveyStatus = async () => {
      if (currentUser) {
        setIsLoading(true);
        try {
          // First, check if user has completed basic info
          const basicInfo = await getUserBasicInfo(currentUser.uid);
          if (!basicInfo) {
            // Redirect to basic info survey if not completed
            navigate("/basic-info");
            return;
          }

          // Then check survey status
          const survey = await getUserSurvey(currentUser.uid);
          if (survey) {
            setResponses(survey.responses || {});
            setHasSubmitted(true);
          }
        } catch (error) {
          console.error("Error checking survey status:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    checkSurveyStatus();
  }, [currentUser, navigate]);

  const handleResponseUpdate = (updates: Partial<SurveyResponse>) => {
    setResponses((prev) => ({ ...prev, ...updates }));
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      setSubmitError("You must be logged in to submit the survey");
      scrollToTop();
      return false;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await submitSurvey(currentUser.uid, responses);
      setHasSubmitted(true);
      setSubmitSuccess(true);
      scrollToTop();
      return true;
    } catch (error) {
      setHasSubmitted(false);
      setSubmitSuccess(false);
      console.error("Error submitting survey:", error);
      scrollToTop();
      setSubmitError(
        error instanceof Error ? error.message : "Failed to submit survey"
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

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
      title: "Optional",
      component: (
        <OptionalPersonality
          responses={responses}
          onUpdate={handleResponseUpdate}
        />
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your survey data...</p>
        </div>
      </div>
    );
  }

  if (submitSuccess && isUpdating) {
    return (
      <div className="min-h-[calc(64vh)] max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Responses Updated!</h2>
        <p className="mb-6 text-gray-600">
          Your survey responses have been successfully updated.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => {
              setSubmitSuccess(false);
              setHasSubmitted(false);
              setCurrentSection(0);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Edit Again
          </button>
          <button
            onClick={() => {
              navigate("/");
              scrollToTop();
            }}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  } else if (submitSuccess) {
    return (
      <div className="min-h-[calc(64vh)] max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">
          Survey Submitted Successfully!
        </h2>
        <p className="mb-6 text-gray-600">
          Thank you for completing the survey. Your responses have been saved.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => {
              setHasSubmitted(false);
              setIsUpdating(true);
              setSubmitSuccess(false);
              setCurrentSection(0);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Edit My Responses
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  } else if (hasSubmitted) {
    return (
      <div className="min-h-[calc(64vh)] max-w-3xl mx-auto p-8 bg-white rounded-lg shadow-md text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-4">Survey Already Submitted!</h2>
        <p className="mb-6 text-gray-600">
          Thank you for completing the survey. Your responses have been saved.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => {
              setHasSubmitted(false);
              setSubmitSuccess(false);
              setIsUpdating(true);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Edit My Responses
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submitError && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4"
          role="alert"
        >
          <p>{submitError}</p>
        </div>
      )}
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
    </div>
  );
};

export default Survey;
