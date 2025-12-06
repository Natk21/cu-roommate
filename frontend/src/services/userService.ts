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
  email?: string;
  phone?: string;
  instagram?: string;
  createdAt: string;
  updatedAt: string;
}

// Submit or update basic user info
export const submitBasicInfo = async (
  userId: string,
  basicInfo: BasicUserInfo
): Promise<{ id: string; success: boolean }> => {
  try {
    console.log("Starting submitBasicInfo with userId:", userId);
    console.log("Basic info data:", basicInfo);

    // Check if user already has basic info
    const querySnapshot = await getDocs(
      query(collection(db, USERS_COLLECTION), where("userId", "==", userId))
    );

    console.log("Query completed. Empty?", querySnapshot.empty);

    const userData = {
      userId,
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      graduationYear: basicInfo.graduationYear,
      bio: basicInfo.bio,
      profilePhotoURL: basicInfo.profilePhotoURL,
      email: basicInfo.email || "",
      phone: basicInfo.phone || "",
      instagram: basicInfo.instagram || "",
      updatedAt: new Date().toISOString(),
    };

    console.log("Prepared user data:", userData);

    let docRef: DocumentReference<DocumentData>;

    if (!querySnapshot.empty) {
      // Update existing document
      console.log("Updating existing document");
      const docId = querySnapshot.docs[0].id;
      await updateDoc(doc(db, USERS_COLLECTION, docId), userData);
      docRef = doc(db, USERS_COLLECTION, docId);
      console.log("Update successful");
    } else {
      // Create new document
      console.log("Creating new document");
      docRef = await addDoc(collection(db, USERS_COLLECTION), {
        ...userData,
        createdAt: new Date().toISOString(),
      });
      console.log("Creation successful, doc ID:", docRef.id);
    }

    return { id: docRef.id, success: true };
  } catch (error) {
    console.error("FULL Error in submitBasicInfo:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
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
    const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
    return querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        }) as UserDocument
    );
  } catch (error) {
    console.error("Error getting users:", error);
    return [];
  }
};

// Update user's profile photo
export const updateUserProfilePhoto = async (
  userId: string,
  photoURL: string
): Promise<{ success: boolean }> => {
  try {
    // Find the user document
    const q = query(
      collection(db, USERS_COLLECTION),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("User not found");
    }

    // Update the profile photo URL
    const userDoc = querySnapshot.docs[0];
    await updateDoc(doc(db, USERS_COLLECTION, userDoc.id), {
      profilePhotoURL: photoURL,
      updatedAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error("Error updating profile photo:", error);
    throw error;
  }
};
