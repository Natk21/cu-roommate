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

// Weighted scoring for different categories
const WEIGHTS = {
  // Sleep schedule (high importance)
  sleepSchedule: 20,

  // Cleanliness (high importance)
  cleanliness: 20,

  // Social preferences (medium importance)
  noiseTolerance: 15,
};

export const calculateMatchScore = (
  userA: SurveyResponse,
  userB: SurveyResponse
): number => {
  let totalScore = 0;
  let maxPossibleScore = 0;

  // 1. Sleep Schedule Compatibility (high weight)
  if (userA.bedtime && userB.bedtime && userA.wakeUpTime && userB.wakeUpTime) {
    // Map bedtime options to numerical values (hours, where 22 = 10 PM, 24 = 12 AM, etc.)
    const bedtimeMap: Record<string, number> = {
      "Before 11 PM": 22,
      "Before 1 AM": 24,
      "Before 3 AM": 26,
      "Anytime is fine": 24, // Treat 'Anytime' as average of the range
    };

    // Map wake-up time options to numerical values (hours)
    const wakeupMap: Record<string, number> = {
      "Before 8 AM": 8,
      "Before 10 AM": 10,
      "Before noon": 12,
      "Anytime is fine": 10, // Treat 'Anytime' as average of the range
    };

    // Calculate bedtime compatibility (0-1, where 1 is identical, 0 is max difference)
    const bedtimeDiff = Math.abs(
      bedtimeMap[userA.bedtime] - bedtimeMap[userB.bedtime]
    );
    const maxBedtimeDiff = 4; // Max possible difference (26-22=4)
    const bedTimeScore = Math.max(0, 1 - bedtimeDiff / maxBedtimeDiff);

    // Calculate wake-up time compatibility (0-1, where 1 is identical, 0 is max difference)
    const wakeupDiff = Math.abs(
      wakeupMap[userA.wakeUpTime] - wakeupMap[userB.wakeUpTime]
    );
    const maxWakeupDiff = 4; // Max possible difference (12-8=4)
    const wakeupTimeScore = Math.max(0, 1 - wakeupDiff / maxWakeupDiff);

    // Calculate overall sleep compatibility score (weighted average)
    const sleepScore = bedTimeScore * 0.6 + wakeupTimeScore * 0.4;

    // Add to total score with high weight
    totalScore += sleepScore * WEIGHTS.sleepSchedule;
    maxPossibleScore += WEIGHTS.sleepSchedule;
  }

  // 2. Cleanliness (high weight)
  if (userA.cleanliness && userB.cleanliness) {
    // Map cleanliness options to numerical values (1-4)
    const cleanlinessMap: Record<string, number> = {
      "Very tidy (everything in place)": 4,
      "Moderately tidy (clean weekly)": 3,
      "Lightly messy is fine": 2,
      "I don't care": 2.5, // Average of the scale
    };

    // Get numerical values for both users
    const cleanA = cleanlinessMap[userA.cleanliness];
    const cleanB = cleanlinessMap[userB.cleanliness];

    if (cleanA !== undefined && cleanB !== undefined) {
      // Calculate score based on difference (1 = identical, 0 = max difference)
      const maxDiff = 2; // Max possible difference (4-2=2)
      const diff = Math.abs(cleanA - cleanB);
      const cleanScore = 1 - diff / maxDiff;

      // Add to total score with high weight
      totalScore += cleanScore * WEIGHTS.cleanliness;
      maxPossibleScore += WEIGHTS.cleanliness;
    }
  }

  // 5. Noise Tolerance
  if (userA.noiseTolerance && userB.noiseTolerance) {
    // Map noise tolerance options to numerical values (1-4)
    const noiseToleranceMap: Record<string, number> = {
      "Loud (Social hub)": 1,
      "Moderate (Quiet conversation)": 2,
      "Quiet (No noise)": 3,
      "I'm fine with all of these": 2, // Middle ground
    };

    // Get numerical values for both users
    const noiseA = noiseToleranceMap[userA.noiseTolerance];
    const noiseB = noiseToleranceMap[userB.noiseTolerance];

    if (noiseA !== undefined && noiseB !== undefined) {
      // Calculate score based on difference (1 = identical, 0 = max difference)
      // For noise tolerance, we'll be more lenient with differences
      const maxDiff = 2; // Max possible difference (3-1=2)
      const diff = Math.abs(noiseA - noiseB);

      // More gradual decrease in score for noise tolerance
      const noiseScore = 1 - diff / (maxDiff * 1.5);

      // Ensure score doesn't go below 0.3 (more lenient than cleanliness)
      const finalScore = Math.max(0.3, noiseScore);

      // Add to total score
      totalScore += finalScore * WEIGHTS.noiseTolerance;
      maxPossibleScore += WEIGHTS.noiseTolerance;
    }
  }

  // Gender: non-negotiable
  let genderCompatible = false;
  if (
    userA.genderPreference &&
    userB.genderPreference &&
    userA.gender &&
    userB.gender
  ) {
    // Convert to lowercase for case-insensitive comparison
    const genderA = userA.gender.toLowerCase();
    const genderB = userB.gender.toLowerCase();
    const prefA = userA.genderPreference.toLowerCase();
    const prefB = userB.genderPreference.toLowerCase();

    // If either preference is "any gender", always compatible
    if (prefA === "any gender" || prefB === "any gender") {
      genderCompatible = true;
    }

    // If preference is "my gender", check if genders match
    else if (
      prefA === "my gender" &&
      prefB === "my gender" &&
      genderA === genderB
    ) {
      genderCompatible = true;
    }
    // If one preference is "my gender", check if it matches the other's gender
    else if (prefA === "my gender" && genderA === genderB) {
      genderCompatible = true;
    } else if (prefB === "my gender" && genderA === genderB) {
      genderCompatible = true;
    }
    // Exact match of preferences
    else if (prefA === genderB && prefB === genderA) {
      genderCompatible = true;
    }

    if (!genderCompatible) {
      return 0;
    }
  }

  // Calculate final score (0-100)
  if (maxPossibleScore === 0) return 0;

  // Normalize score to 0-100 range
  let finalScore = (totalScore / maxPossibleScore) * 100;

  // Apply non-linear scaling to make differences more noticeable
  // This makes scores below 50% drop faster, and above 50% rise faster
  if (finalScore < 50) {
    finalScore = 50 * Math.pow(finalScore / 50, 0.8);
  } else {
    finalScore = 100 - 50 * Math.pow((100 - finalScore) / 50, 1.2);
  }

  // Ensure score is within bounds
  return Math.min(100, Math.max(0, Math.round(finalScore)));
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
