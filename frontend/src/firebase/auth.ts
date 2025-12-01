import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  UserCredential,
  User,
  onAuthStateChanged as onAuthStateChangedFirebase,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./config";

// User type
export interface AuthUser extends User {}

// Sign up with email and password
export const signUp = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing up:", error);
    throw new Error(error.message || "Failed to sign up");
  }
};

// Sign in with email and password
export const signIn = async (
  email: string,
  password: string
): Promise<AuthUser> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return userCredential.user;
  } catch (error: any) {
    console.error("Error signing in:", error);
    throw new Error(error.message || "Failed to sign in");
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    console.error("Error signing out:", error);
    throw new Error(error.message || "Failed to sign out");
  }
};

// Get current user
export const getCurrentUser = (): AuthUser | null => {
  return auth.currentUser;
};

// Auth state observer
export const onAuthStateChanged = (
  callback: (user: AuthUser | null) => void
) => {
  return onAuthStateChangedFirebase(auth, (user) => {
    callback(user);
  });
};

// Password reset
export const sendPasswordResetEmail = async (email: string): Promise<void> => {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error("Error sending password reset email:", error);
    throw new Error(error.message || "Failed to send password reset email");
  }
};
