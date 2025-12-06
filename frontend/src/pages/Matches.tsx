// src/pages/Matches.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { getAllUsersBasicInfo } from "../services/userService";
import { getUserSurvey } from "../services/surveyService";
import { calculateMatchScore } from "../services/similarityService";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  profile: any;
  score: number;
}

const ProfileCard = ({ profile, score }: ProfileCardProps) => {
  return (
    <div className="rounded-20 relative w-full bg-white rounded-xl shadow-md overflow-visible hover:shadow-lg transition-shadow duration-300">
      {/* Score circle positioned absolutely to overlap the top */}
      <div className="absolute bottom-12 right-6 z-10">
        <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center text-2xl font-bold shadow-lg border-4 border-white">
          {Math.round(score)}
        </div>
      </div>
      <div className="flex flex-col md:flex-row">
        {/* Profile Image - Square Container */}
        <div className="md:w-64 flex-shrink-0">
          <div className="h-full w-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            {profile.profilePhotoURL ? (
              <img
                src={profile.profilePhotoURL}
                alt={`${profile.firstName} ${profile.lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <span className="text-6xl font-bold text-red-300">
                  {profile.firstName[0].toUpperCase()}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Profile Info */}
        <div className="p-6 flex-1 flex flex-col">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile.firstName} {profile.lastName}
              {/* {profile.graduationYear && (
                <span className="text-gray-500 font-normal ml-">
                  Class of {profile.graduationYear}
                </span>
              )} */}
            </h2>
            {profile.major && (
              <p className="text-lg text-gray-600 mt-1">{profile.major}</p>
            )}
          </div>

          {/* Bio/Description */}
          {profile.bio && (
            <div className="mt-4 flex-1">
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          )}

          {/* Quick Stats */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {profile.bedtime && (
              <div>
                <p className="text-sm text-gray-500">Bedtime</p>
                <p className="font-medium">{profile.bedtime}</p>
              </div>
            )}
            {profile.cleanliness && (
              <div>
                <p className="text-sm text-gray-500">Cleanliness</p>
                <p className="font-medium">{profile.cleanliness}</p>
              </div>
            )}
            {profile.noiseTolerance && (
              <div>
                <p className="text-sm text-gray-500">Noise Level</p>
                <p className="font-medium">{profile.noiseTolerance}</p>
              </div>
            )}
          </div>

          {/* Bottom Section with Match Score and Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex space-x-4">
              <Link
                to={`/profile/${profile.userId}`}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
              >
                View Full Profile
              </Link>
            </div>
            <div className="w-14 h-14">
              {/* Empty div to maintain layout */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Matches = () => {
  const { currentUser } = useAuth() || {};
  const [profiles, setProfiles] = useState<
    Array<{ profile: any; score: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        // Get current user's survey data
        const currentUserSurvey = await getUserSurvey(currentUser.uid);
        if (!currentUserSurvey) {
          setError("Please complete your profile to see matches");
          return;
        }

        // Get all other users' basic info
        const allUsers = await getAllUsersBasicInfo();
        const otherUsers = allUsers.filter(
          (user) => user.userId !== currentUser.uid
        );

        // Calculate match scores for each user
        const profilesWithScores = await Promise.all(
          otherUsers.map(async (user) => {
            const userSurvey = await getUserSurvey(user.userId);
            if (!userSurvey) return null;

            const score = calculateMatchScore(
              currentUserSurvey.responses,
              userSurvey.responses
            );

            return {
              profile: user,
              score,
            };
          })
        );

        // Filter out nulls and sort by score (highest first)
        const validProfiles = profilesWithScores.filter(Boolean) as Array<{
          profile: any;
          score: number;
        }>;
        validProfiles.sort((a, b) => b.score - a.score);

        setProfiles(validProfiles);
      } catch (err) {
        console.error("Error loading matches:", err);
        setError("Failed to load matches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/profile"
            className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Complete Your Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Matches</h1>

        {profiles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No matches found. Complete your profile to see potential matches!
            </p>
            <Link
              to="/profile"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div
            className="overflow-y-auto"
            style={{ maxHeight: "calc(100vh - 200px)" }}
          >
            <div className="flex flex-wrap -mx-6">
              {profiles.map(({ profile, score }) => (
                <div key={profile.userId} className="px-6 mb-8">
                  <ProfileCard profile={profile} score={score} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
