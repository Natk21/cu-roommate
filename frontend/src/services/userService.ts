// src/services/userService.ts
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
import { BasicUserInfo } from "../pages/BasicInfoSurvey";

const USERS_COLLECTION = "users";

export interface UserDocument {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  graduationYear: number;
  bio: string;
  profilePhotoURL?: string;
  createdAt: string;
  updatedAt: string;
}

// Submit or update basic user info
export const submitBasicInfo = async (
  userId: string,
  basicInfo: BasicUserInfo
): Promise<{ id: string; success: boolean }> => {
  try {
    // Check if user already has basic info
    const querySnapshot = await getDocs(
      query(collection(db, USERS_COLLECTION), where("userId", "==", userId))
    );

    const userData = {
      userId,
      ...basicInfo,
      updatedAt: new Date().toISOString(),
    };

    let docRef: DocumentReference<DocumentData>;
    
    if (!querySnapshot.empty) {
      // Update existing document
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, USERS_COLLECTION, docId), userData);
      docRef = doc(db, USERS_COLLECTION, docId);
    } else {
      // Create new document
      docRef = await addDoc(collection(db, USERS_COLLECTION), {
        ...userData,
        createdAt: new Date().toISOString(),
      });
    }

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("Error in submitBasicInfo:", error);
    throw error;
  }
};

// Get user's basic info
export const getUserBasicInfo = async (
  userId: string
): Promise<UserDocument | null> => {
  try {
    const q = query(
      collection(db, USERS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const docSnap = querySnapshot.docs[0];
    return { id: docSnap.id, ...docSnap.data() } as UserDocument;
  } catch (error) {
    console.error("Error getting basic info:", error);
    throw error;
  }
};

// Get all users' basic info (for displaying on homepage/matches)
export const getAllUsersBasicInfo = async (): Promise<UserDocument[]> => {
  try {
    const q = query(collection(db, USERS_COLLECTION));
    const querySnapshot = await getDocs(q);

    const users: UserDocument[] = [];
    querySnapshot.forEach((docSnap) => {
      users.push({ id: docSnap.id, ...docSnap.data() } as UserDocument);
    });

    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    throw error;
  }
};