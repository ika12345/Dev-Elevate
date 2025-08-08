import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  User as FirebaseUser,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { auth, provider } from "./firebase";
import { User } from "../contexts/AuthContext";

// Helper function to convert Firebase user to app User type
export const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
    role: 'user', // Default role, can be updated based on custom claims or Firestore
    bio: 'DevElevate User',
    socialLinks: {},
    joinDate: firebaseUser.metadata.creationTime || new Date().toISOString(),
    lastLogin: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
    isActive: true,
    preferences: {
      theme: 'light',
      notifications: true,
      language: 'en',
      emailUpdates: true,
    },
    progress: {
      coursesEnrolled: [],
      completedModules: 0,
      totalPoints: 0,
      streak: 0,
      level: 'Beginner',
    },
  };
};

// Email/Password Authentication
export const registerWithEmailAndPassword = async (
  email: string,
  password: string,
  name: string
): Promise<User> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(result.user, {
      displayName: name,
    });

    // Send email verification
    await sendEmailVerification(result.user);
    
    return mapFirebaseUserToAppUser(result.user);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export const loginWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<User> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUserToAppUser(result.user);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Google Authentication
export const loginWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, provider);
    return mapFirebaseUserToAppUser(result.user);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Sign out
export const logoutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Password Reset
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
};

// Auth State Listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (firebaseUser) => {
    if (firebaseUser) {
      const appUser = mapFirebaseUserToAppUser(firebaseUser);
      callback(appUser);
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = (): User | null => {
  const firebaseUser = auth.currentUser;
  return firebaseUser ? mapFirebaseUserToAppUser(firebaseUser) : null;
};

// Update user profile
export const updateUserProfile = async (updates: {
  displayName?: string;
  photoURL?: string;
}): Promise<void> => {
  if (auth.currentUser) {
    await updateProfile(auth.currentUser, updates);
  }
};
