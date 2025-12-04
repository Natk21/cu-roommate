import { ReactNode, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface SurveyLayoutProps {
  title: string;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  isLastStep: boolean;
  children: ReactNode;
  isSubmitting?: boolean;
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const SurveyLayout = ({
  title,
  currentStep,
  totalSteps,
  onNext,
  onBack,
  isLastStep,
  children,
  isSubmitting = false,
}: SurveyLayoutProps) => {
  useEffect(() => {
    scrollToTop();
  }, [currentStep]);

  const handleNext = () => {
    onNext();
  };

  const handleBack = () => {
    onBack();
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Section Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{title}</h1>

        {/* Survey Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          {children}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 1 || isSubmitting}
            className={`flex items-center px-6 py-3 rounded-lg font-medium ${
              currentStep === 1 || isSubmitting
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              "Submitting..."
            ) : isLastStep ? (
              "Submit Survey"
            ) : (
              <>
                Next Section
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SurveyLayout;
