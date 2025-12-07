// src/pages/Matches.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  getAllUserMatchingInfo,
  getUserSurvey,
} from "../services/surveyService";
import { calculateMatchScore } from "../services/similarityService";
import { Link } from "react-router-dom";
import Tag from "../components/Tag";
import generateLookingForPoints from "../utils/profileTags";

interface MatchCardProps {
  profile: any;
  lookingFor: string[];
  score: number;
}

const MatchScoreBadge = ({ score }: { score: number }) => {
  return (
    <div
      className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-full
                 w-12 h-12 sm:w-14 sm:h-14
                 flex items-center justify-center
                 text-base sm:text-lg font-bold
                 shadow-sm border-2 border-white"
      aria-label={`Match score ${Math.round(score)}`}
      title={`Match score ${Math.round(score)}`}
    >
      {Math.round(score)}
    </div>
  );
};

const getFirstSentence = (bio?: string) => {
  if (!bio) return "";

  const text = bio.trim();
  if (!text) return "";

  const sentences =
    text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((s) => s.trim()) ?? [];

  const greetingRegex =
    /^(hi|hey|hello|yo|hiya|howdy|sup|what'?s up|whats up)[!.\s]*$/i;

  const isTrivial = (s: string) => {
    const cleaned = s.replace(/["'“”‘’]/g, "").trim();
    if (cleaned.length <= 4) return true;
    if (greetingRegex.test(cleaned)) return true;
    return false;
  };

  const firstUseful =
    sentences.find((s) => !isTrivial(s)) ?? sentences[0] ?? text;

  const maxLen = 140;
  return firstUseful.length > maxLen
    ? firstUseful.slice(0, maxLen).trim() + "…"
    : firstUseful;
};

const MatchCard = ({ profile, lookingFor, score }: MatchCardProps) => {
  const bioPreview = getFirstSentence(profile?.bio);

  const firstInitial =
    profile?.firstName && profile.firstName.length > 0
      ? profile.firstName[0].toUpperCase()
      : "?";

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-64 flex-shrink-0">
          <div className="h-full w-full md:w-64 bg-gray-100 flex items-center justify-center overflow-hidden">
            {profile?.profilePhotoURL ? (
              <img
                src={profile.profilePhotoURL}
                alt={`${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
                <span className="text-6xl font-bold text-red-300">
                  {firstInitial}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {profile?.firstName} {profile?.lastName}
            </h2>
            {profile?.major && (
              <p className="text-lg text-gray-600 mt-1">{profile.major}</p>
            )}
          </div>

          {/* Looking for */}
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                I am looking for:
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {(lookingFor?.length ? lookingFor : ["good overall fit"]).map(
                (point, index) => (
                  <Tag key={`${point}-${index}`} label={point} />
                )
              )}
            </div>

            {bioPreview && (
              <p className="mt-3 text-sm text-gray-600">{bioPreview}</p>
            )}
          </div>

          {/* Footer (button + score aligned, below the line) */}
          <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              to={`/profile/${profile?.userId}`}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              View Full Profile
            </Link>

            <MatchScoreBadge score={score} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Matches = () => {
  const { currentUser } = useAuth();

  const [profiles, setProfiles] = useState<
    Array<{ profile: any; lookingFor: string[]; score: number }>
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const currentUserSurvey = await getUserSurvey(currentUser.uid);
        if (!currentUserSurvey) {
          setError("Please complete your profile to see matches");
          return;
        }

        const allUsers = await getAllUserMatchingInfo();
        const otherUsers = allUsers.filter(
          (user) => user.userId !== currentUser.uid
        );

        const profilesWithScores = await Promise.all(
          otherUsers.map(async (user) => {
            const userSurvey = await getUserSurvey(user.userId);
            if (!userSurvey) return null;

            const score = calculateMatchScore(
              currentUserSurvey.responses ?? {},
              userSurvey.responses ?? {}
            );

            const lookingFor = generateLookingForPoints(user);

            return {
              profile: user,
              score,
              lookingFor,
            };
          })
        );

        const validProfiles = profilesWithScores.filter(Boolean) as Array<{
          profile: any;
          lookingFor: string[];
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
        <div className="flex items-end justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Your Matches</h1>
          <p className="hidden sm:block text-sm text-gray-500">
            Sorted by best fit
          </p>
        </div>

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
          <div className="space-y-6">
            {profiles.map(({ profile, lookingFor, score }) => (
              <MatchCard
                key={profile.userId}
                profile={profile}
                score={score}
                lookingFor={lookingFor || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
