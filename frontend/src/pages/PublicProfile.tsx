// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { getUserSurvey } from "../services/surveyService";
import { getUserBasicInfo } from "../services/userService";
import { SurveyResponse } from "./Survey";
import { useNavigate, useParams } from "react-router-dom";
import { calculateMatchScore } from "../services/similarityService";
interface ProfileData extends SurveyResponse {
  firstName?: string;
  lastName?: string;
  bio?: string;
  profilePhotoURL?: string;
  graduationYear?: number;
  tags?: string[];
}

const Profile = () => {
  const { currentUser } = useAuth();
  const { userId } = useParams();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        // Load both basic info and survey data in parallel
        const [userBasicInfo, survey] = await Promise.all([
          getUserBasicInfo(userId || ""),
          getUserSurvey(userId || ""),
        ]);

        // Set basic info separately if needed
        setBasicInfo(userBasicInfo);
        const currentUserSurvey = await getUserSurvey(currentUser.uid);
        if (currentUserSurvey && survey) {
          const score = calculateMatchScore(
            currentUserSurvey.responses,
            survey.responses
          );
          setSimilarityScore(score);
        }
        // Merge both data sources into profile state
        setProfile((prev) => ({
          ...prev, // Keep any existing profile data
          ...userBasicInfo, // Add/overwrite with basic info
          ...(survey?.responses || {}), // Add survey responses if they exist
        }));
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Please log in to view your profile
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Log In
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            No profile data found. Please complete the survey first.
          </p>
          <button
            onClick={() => (window.location.href = "/survey")}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Complete Survey
          </button>
        </div>
      </div>
    );
  }

  // Generate tags based on survey responses
  const generateTags = () => {
    const tags: string[] = [];
    if (profile.hobbies?.toLowerCase().includes("music")) tags.push("Musician");
    if (
      profile.hobbies?.toLowerCase().includes("gym") ||
      profile.hobbies?.toLowerCase().includes("fitness")
    )
      tags.push("Gym");
    if (
      profile.noiseTolerance === "Needs quiet" ||
      profile.bedtime === "Before 11 PM"
    )
      tags.push("Wants Room Quiet");
    if (profile.socialFrequency === "Rarely") tags.push("Introvert");
    if (profile.socialFrequency === "3+ nights a week") tags.push("Social");
    return tags.slice(0, 3); // Limit to 3 tags
  };

  const tags = generateTags();
  const images = ["/api/placeholder/400/400"]; // Add actual image URLs from storage

  // Helper function to get user's first name from email
  const getFirstName = () => {
    return currentUser.email?.split("@")[0] || "User";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section with Gradient Background */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-3xl shadow-2xl overflow-hidden relative">
          {/* Similarity Score Badge */}
          {similarityScore !== null && (
            <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-sm rounded-2xl w-32 h-32 flex flex-col items-center justify-center border-2 border-white/30 shadow-lg">
              <span className="text-white/80 text-md font-medium">
                Match Score
              </span>
              <span className="text-white text-4xl font-bold">
                {Math.round(similarityScore)}
              </span>
            </div>
          )}
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              {/* Profile Image */}
              <div className="relative group">
                <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center overflow-hidden border-4 border-white/30 shadow-xl">
                  {basicInfo?.profilePhotoURL ? (
                    <img
                      src={basicInfo.profilePhotoURL}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white/80 text-4xl font-bold">
                      {getFirstName().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="text-white flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-1">
                      {basicInfo
                        ? `${basicInfo.firstName} ${basicInfo.lastName}`
                        : getFirstName()}
                    </h1>
                    <div className="flex items-center gap-2 text-white/90">
                      <span>{profile.major || "Undeclared"}</span>
                      <span>•</span>
                      <span>
                        Class of {basicInfo?.graduationYear || "20XX"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-sm font-medium transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bio */}
                <p className="mt-4 text-white/90 leading-relaxed max-w-2xl">
                  {profile.bio ? profile.bio : "No bio provided"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">Contact</h2>
              </div>
              <div className="p-6 space-y-4">
                {basicInfo?.email && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                    </div>
                    <div>
                      <a
                        href={`mailto:${basicInfo.email}`}
                        className="text-gray-700 hover:text-red-600 transition-colors break-all"
                      >
                        {basicInfo.email}
                      </a>
                    </div>
                  </div>
                )}
                {basicInfo?.phone && (
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                    </div>
                    <a
                      href={`tel:${basicInfo.phone}`}
                      className="text-gray-700 hover:text-red-600 transition-colors"
                    >
                      {basicInfo.phone}
                    </a>
                  </div>
                )}
                {basicInfo?.instagram && (
                  <div className="flex items-center gap-3">
                    <div className="text-gray-400">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.415-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.976.045-1.505.207-1.858.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.976.207 1.504.344 1.858.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <a
                      href={`https://instagram.com/${basicInfo.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-red-600 transition-colors"
                    >
                      @{basicInfo.instagram}
                    </a>
                  </div>
                )}
                {!basicInfo?.email &&
                  !basicInfo?.phone &&
                  !basicInfo?.instagram && (
                    <p className="text-gray-500 text-sm">
                      No contact information provided
                    </p>
                  )}
              </div>
            </div>

            {/* Lifestyle Card */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Lifestyle
                </h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Sleep Schedule
                  </span>
                  <p className="text-base font-medium text-gray-900">
                    {profile.bedtime || "--:--"} -{" "}
                    {profile.wakeUpTime || "--:--"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Cleanliness
                  </span>
                  <p className="text-base font-medium text-gray-900">
                    {profile.cleanliness || "Not specified"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Noise Level
                  </span>
                  <p className="text-base font-medium text-gray-900">
                    {profile.noiseTolerance || "Not specified"}
                  </p>
                </div>

                <div className="space-y-1">
                  <span className="text-sm font-medium text-gray-500">
                    Social Life
                  </span>
                  <p className="text-base font-medium text-gray-900">
                    {profile.socialFrequency || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column */}
          <div className="space-y-6">
            {/* About Me */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  About Me
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Personality Type
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {profile.personalityType || "Not specified"}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900">
                      Ideal Friday Night
                    </h3>
                    <p className="text-gray-600 mt-1">
                      {profile.fridayNight || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Preferences */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Room Preferences
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Room Type
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.roomType || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Dorm Preference
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.desiredDorms?.join(", ") || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      AC Required
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.acRequirement || "Not specified"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Guests
                    </h3>
                    <p className="mt-1 text-gray-900">
                      {profile.guests || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Non-Negotiables */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Non-Negotiables
                </h2>
              </div>
              <div className="p-6">
                <ul className="space-y-3">
                  {profile.noiseTolerance && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">
                        Noise Level: {profile.noiseTolerance}
                      </span>
                    </li>
                  )}
                  {profile.cleanliness && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">
                        Cleanliness: {profile.cleanliness}
                      </span>
                    </li>
                  )}
                  {profile.guests && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">
                        Guest Policy: {profile.guests}
                      </span>
                    </li>
                  )}
                  {profile.musicPreference && (
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 text-red-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">
                        Music: {profile.musicPreference}
                      </span>
                    </li>
                  )}
                  {!profile.noiseTolerance &&
                    !profile.cleanliness &&
                    !profile.guests &&
                    !profile.musicPreference && (
                      <p className="text-gray-500 text-sm">
                        No non-negotiables specified
                      </p>
                    )}
                </ul>
              </div>
            </div>

            {/* Fun Facts */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-6 py-4 border-b">
                <h2 className="text-lg font-semibold text-gray-900">
                  Fun Facts
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    Favorite Study Spot
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {profile.favoriteStudySpot || "Not specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Pet Peeves</h3>
                  <p className="text-gray-600 mt-1">
                    {profile.petPeeves || "None specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Something I Love
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {profile.hobbies || "Not specified"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
