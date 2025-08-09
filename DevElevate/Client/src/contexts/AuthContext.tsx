import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  User as FirebaseUser
} from "firebase/auth";
import { auth, provider } from "../utils/firebase";

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
  preferences: {
    theme: "light" | "dark";
    notifications: boolean;
    language: "en" | "hi";
    emailUpdates: boolean;
  };
  progress: {
    coursesEnrolled: string[];
    completedModules: number;
    totalPoints: number;
    streak: number;
    level: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  users: User[]; // For admin management
  sessionToken: string | null;
}

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_ERROR"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }
  | { type: "SET_LOADING"; payload: boolean };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  users: [],
  sessionToken: null,
};

// Helper function to convert Firebase user to app User type
const mapFirebaseUserToAppUser = (firebaseUser: FirebaseUser): User => {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
    role: firebaseUser.email === 'admin@develevate.com' ? 'admin' : 'user', // Simple admin check
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

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true, error: null };
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
        sessionToken: 'firebase-token', // Firebase handles tokens internally
      };
    case "AUTH_ERROR":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
        sessionToken: null,
      };
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        sessionToken: null,
      };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType {
  state: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
  dispatch: React.Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const appUser = mapFirebaseUserToAppUser(firebaseUser);
        dispatch({ type: "AUTH_SUCCESS", payload: appUser });
      } else {
        dispatch({ type: "AUTH_LOGOUT" });
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      await signInWithEmailAndPassword(auth, email, password);
      // Auth state change will handle the success dispatch
    } catch (error: any) {
      let errorMessage = "Login failed";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many attempts. Please try again later";
          break;
        default:
          errorMessage = error.message;
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(result.user, {
        displayName: name,
      });

<<<<<<< HEAD
      // Send email verification
      if (result.user) {
        await sendEmailVerification(result.user);
      }
      
      // Auth state change will handle the success dispatch
    } catch (error: any) {
      let errorMessage = "Registration failed";
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters";
          break;
        default:
          errorMessage = error.message;
=======
      if (!response.ok) {
        let errorMessage = "Registration failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use default error message
          errorMessage = `Registration failed (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (e) {
        throw new Error("Invalid response from server");
      }

      // Handle both production and dev mode responses
      if (data.message?.includes("User registered successfully")) {
        // If backend returns a token (dev mode), use it directly
        if (data.token) {
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            role: data.user.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.user.name}`,
            bio:
              data.user.role === "admin"
                ? "System Administrator"
                : "DevElevate User",
            socialLinks: {},
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
            preferences: {
              theme: "light",
              notifications: true,
              language: "en",
              emailUpdates: true,
            },
            progress: {
              coursesEnrolled: [],
              completedModules: 0,
              totalPoints: 0,
              streak: 0,
              level: "Beginner",
            },
          };

          dispatch({
            type: "REGISTER_SUCCESS",
            payload: {
              user,
              token: data.token,
              message: data.message,
            },
          });
          return;
        }
        // Auto-login after successful registration
        const loginResponse = await fetch(`${baseUrl}/api/v1/auth/login`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          }
        );

        if (!loginResponse.ok) {
          throw new Error("Auto-login failed after registration");
        }

        let loginData;
        try {
          loginData = await loginResponse.json();
        } catch (e) {
          throw new Error("Invalid login response after registration");
        }

        if (loginData.token && loginData.user) {
          const user: User = {
            id: loginData.user.id,
            name: loginData.user.name,
            email: loginData.user.email,
            role: loginData.user.role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${loginData.user.name}`,
            bio:
              loginData.user.role === "admin"
                ? "System Administrator"
                : "DevElevate User",
            socialLinks: {},
            joinDate: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
            isActive: true,
            preferences: {
              theme: "light",
              notifications: true,
              language: "en",
              emailUpdates: true,
            },
            progress: {
              coursesEnrolled: [],
              completedModules: 0,
              totalPoints: 0,
              streak: 0,
              level: "Beginner",
            },
          };

          console.log("Registration successful - user:", user);
          console.log("Registration successful - token:", loginData.token);

          dispatch({
            type: "REGISTER_SUCCESS",
            payload: { user, token: loginData.token },
          });
        } else {
          throw new Error("Registration successful but auto-login failed");
        }
      } else {
        throw new Error("Registration failed");
>>>>>>> f2cd3fd5 (Added the feature of apply page in placement prep)
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      dispatch({ type: "AUTH_START" });
      await signInWithPopup(auth, provider);
      // Auth state change will handle the success dispatch
    } catch (error: any) {
      let errorMessage = "Google sign-in failed";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Sign-in cancelled";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Pop-up blocked. Please allow pop-ups and try again";
      }
      dispatch({ type: "AUTH_ERROR", payload: errorMessage });
      throw new Error(errorMessage);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      // Auth state change will handle the logout dispatch
    } catch (error: any) {
      dispatch({ type: "AUTH_ERROR", payload: "Logout failed" });
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      let errorMessage = "Password reset failed";
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address";
          break;
        default:
          errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  const clearError = (): void => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    state,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError,
    dispatch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
