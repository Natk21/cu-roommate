import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  DocumentReference,
  DocumentData,
  query,
  where,
  updateDoc,
  doc,
} from "firebase/firestore";
import { SurveyResponse } from "../pages/Survey.tsx";
import { getAllUsersBasicInfo as getUsersFromUserService } from "./userService";


const SURVEYS_COLLECTION = "surveys";

export interface SurveyDocument {
  id: string;
  userId: string;
  responses: SurveyResponse;
  submittedAt: string;
}

export const submitSurvey = async (
  userId: string,
  responses: SurveyResponse
) => {
  try {
    // Check if user already has a survey
    const querySnapshot = await getDocs(
      query(collection(db, SURVEYS_COLLECTION), where("userId", "==", userId))
    );

    let docRef: DocumentReference<DocumentData>;
    if (!querySnapshot.empty) {
      // Update existing document
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, SURVEYS_COLLECTION, docId), {
        responses,
        updatedAt: new Date().toISOString(),
      });
      docRef = doc(db, SURVEYS_COLLECTION, docId);
    } else {
      // Create new document
      docRef = await addDoc(collection(db, SURVEYS_COLLECTION), {
        userId,
        responses,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error in submitSurvey:", error);
    throw error;
  }
};

export const getUserSurvey = async (
  userId: string
): Promise<SurveyDocument | null> => {
  try {
    const q = query(
      collection(db, SURVEYS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    // Return the first survey (assuming one survey per user)
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() } as SurveyDocument;
  } catch (error) {
    console.error("Error getting survey:", error);
    throw error;
  }
};

// Get all surveys except the current user's
export const getAllOtherSurveys = async (
  currentUserId: string
): Promise<SurveyDocument[]> => {
  try {
    // Query all surveys
    const q = query(collection(db, SURVEYS_COLLECTION));
    const querySnapshot = await getDocs(q);

    // Filter out current user and map to array
    const surveys: SurveyDocument[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      // Only add if it's not the current user
      if (data.userId !== currentUserId) {
        surveys.push({ id: doc.id, ...data } as SurveyDocument);
      }
    });

    return surveys;
  } catch (error) {
    console.error("Error getting surveys:", error);
    throw error;
  }
};

// Get all users with completed surveys (for homepage display)

export const getAllUsersBasicInfo = async (): Promise<
  Array<{
    userId: string;
    firstName: string;
    lastName: string;
    major: string;
    graduationYear: number;
  }>
> => {
  try {
    // Get all users from users collection
    const users = await getUsersFromUserService();
    
    // Get all surveys to match with majors
    const surveysQuery = query(collection(db, SURVEYS_COLLECTION));
    const surveysSnapshot = await getDocs(surveysQuery);
    
    const surveysMap = new Map();
    surveysSnapshot.forEach((doc) => {
      const data = doc.data();
      surveysMap.set(data.userId, data.responses);
    });

    // Combine user info with survey data
    return users.map(user => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      major: surveysMap.get(user.userId)?.major || "Undeclared",
      graduationYear: user.graduationYear,
    }));
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
};