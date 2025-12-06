import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import { SurveyResponse } from "../pages/Survey";

interface UserSurvey {
  userId: string;
  responses: SurveyResponse;
}

export const calculateSimilarityScores = async (currentUserId: string) => {
  // Fetch all surveys except current user's
  const surveysRef = collection(db, "surveys");
  const q = query(surveysRef, where("userId", "!=", currentUserId));
  const snapshot = await getDocs(q);

  const currentUserSurvey = await getCurrentUserSurvey(currentUserId);
  if (!currentUserSurvey) return [];

  const scores = [];

  for (const doc of snapshot.docs) {
    const otherUserSurvey = doc.data() as UserSurvey;
    const score = calculateMatchScore(
      currentUserSurvey.responses,
      otherUserSurvey.responses
    );

    scores.push({
      userId: otherUserSurvey.userId,
      score,
      survey: otherUserSurvey.responses,
    });
  }

  return scores.sort((a, b) => b.score - a.score); // Sort by highest score first
};

const calculateMatchScore = (
  userA: SurveyResponse,
  userB: SurveyResponse
): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // Example: Compare sleep schedules
  if (userA.bedtime && userB.bedtime) {
    const timeDiff = Math.abs(
      parseTimeToMinutes(userA.bedtime) - parseTimeToMinutes(userB.bedtime)
    );
    // Closer bedtimes = higher score (max 1 hour difference)
    const timeScore = Math.max(0, 60 - timeDiff) / 60;
    totalScore += timeScore * 10; // Weight for this category
    maxPossibleScore += 10;
  }

  // Add more comparisons for other important factors
  if (userA.cleanliness && userB.cleanliness) {
    const cleanDiff = Math.abs(
      Number(userA.cleanliness) - Number(userB.cleanliness)
    );
    const cleanScore = 1 - cleanDiff / 4; // Normalize to 0-1
    totalScore += cleanScore * 15; // Higher weight for cleanliness
    maxPossibleScore += 15;
  }

  // Add more factors here...

  // Calculate final score (0-100)
  return maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
};

const parseTimeToMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(" ");
  const [hours, minutes] = time.split(":").map(Number);
  let totalMinutes = hours * 60 + minutes;
  if (period === "PM" && hours < 12) totalMinutes += 12 * 60;
  if (period === "AM" && hours === 12) totalMinutes -= 12 * 60;
  return totalMinutes;
};

const getCurrentUserSurvey = async (
  userId: string
): Promise<UserSurvey | null> => {
  const surveysRef = collection(db, "surveys");
  const q = query(surveysRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return {
    userId,
    responses: snapshot.docs[0].data().responses as SurveyResponse,
  };
};
