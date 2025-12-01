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
