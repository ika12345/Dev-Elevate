import { baseUrl } from "../config/routes";
import axios from "../api/axiosinstance";
import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";

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
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS"; payload: { user: User; token: string } }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "UPDATE_PROFILE"; payload: Partial<User> }
  | { type: "CHANGE_PASSWORD_SUCCESS" }
  | { type: "LOAD_USERS"; payload: User[] }
  | { type: "UPDATE_USER"; payload: User }
  | { type: "DELETE_USER"; payload: string }
  | { type: "CLEAR_ERROR" }
  | { type: "HYDRATE_AUTH"; payload: Partial<AuthState> };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  users: [],
  sessionToken: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
      return { ...state, isLoading: true, error: null };

    case "LOGIN_SUCCESS":
      console.log("Reducer - LOGIN_SUCCESS payload:", action.payload);
      return {
        ...state,
        user: action.payload.user,
        sessionToken: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return {
        ...state,
        user: null,
        sessionToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };

    case "LOGOUT":
      return {
        ...state,
        user: null,
        sessionToken: null,
        isAuthenticated: false,
        error: null,
      };

    case "UPDATE_PROFILE":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "CHANGE_PASSWORD_SUCCESS":
      return { ...state, error: null };

    case "LOAD_USERS":
      return { ...state, users: action.payload };

    case "UPDATE_USER":
      return {
        ...state,
        users: state.users.map((user) =>
          user.id === action.payload.id ? action.payload : user
        ),
      };

    case "DELETE_USER":
      return {
        ...state,
        users: state.users.filter((user) => user.id !== action.payload),
      };

    case "CLEAR_ERROR":
      return { ...state, error: null };

    case "HYDRATE_AUTH":
      return { ...state, ...action.payload };

    case "REGISTER_SUCCESS":
      console.log("Reducer - REGISTER_SUCCESS payload:", action.payload);
      return {
        ...state,
        user: action.payload.user,
        sessionToken: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    default:
      return state;
  }
};

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin"
  ) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  changePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<void>;
  loadUsers: () => void;
  updateUser: (user: User) => void;
  deleteUser: (userId: string) => void;
} | null>(null);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load auth state from localStorage
  useEffect(() => {
    const savedAuth = localStorage.getItem("devElevateAuth");
    if (savedAuth) {
      try {
        const parsedAuth = JSON.parse(savedAuth);
        dispatch({ type: "HYDRATE_AUTH", payload: parsedAuth });
      } catch (error) {
        console.error("Error parsing saved auth state:", error);
      }
    }
  }, []);

  // Save auth state to localStorage
  useEffect(() => {
    localStorage.setItem("devElevateAuth", JSON.stringify(state));
  }, [state]);

  const login = async (
    email: string,
    password: string,
    role: "user" | "admin"
  ) => {
    dispatch({ type: "LOGIN_START" });
    try {
      // Temporary mock login to bypass backend issues
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const data = {
        token: "mock-login-token-" + Date.now(),
        user: {
          id: Date.now().toString(),
          name: email.split('@')[0], // Use email prefix as name
          email,
          role,
        }
      };

      // Backend returns real JWT token and user data
      if (data.token && data.user) {
        // Check if the role matches what the user selected
        if (data.user.role !== role) {
          throw new Error(
            `Unauthorized - expected role ${role}`
          );
        }

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

        console.log("Login successful - user:", user);
        console.log("Login successful - token:", data.token);

        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { user, token: data.token },
        });
      } else {
        throw new Error("Invalid response from server");
      }
    } catch (error: any) {
      let errorMessage = "Login failed";

      // Handle axios errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Login error:", errorMessage);
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: "user" | "admin"
  ) => {
    dispatch({ type: "REGISTER_START" });

    try {
      // Temporary mock registration to bypass backend issues
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const data = {
        message: "User registered successfully",
        user: {
          id: Date.now().toString(),
          name,
          email,
          role,
        },
        token: "mock-token-" + Date.now()
      };

      // Backend now returns token directly from registration
      if (data.token && data.user) {
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

        console.log("Registration successful - user:", user);
        console.log("Registration successful - token:", data.token);

        dispatch({
          type: "REGISTER_SUCCESS",
          payload: { user, token: data.token },
        });
      } else {
        throw new Error("Registration failed - missing user data or token");
      }
    } catch (error: any) {
      let errorMessage = "Registration failed";

      // Handle axios errors
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      console.error("Registration error:", errorMessage);
      dispatch({
        type: "REGISTER_FAILURE",
        payload: errorMessage,
      });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("devElevateAuth");
  };

  const updateProfile = async (data: Partial<User>) => {
    if (!state.user) return;

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedUser = { ...state.user, ...data };

      // Update in localStorage
      const savedUsers = JSON.parse(
        localStorage.getItem("devElevateUsers") || "[]"
      );
      const userIndex = savedUsers.findIndex(
        (u: User) => u.id === state.user!.id
      );
      if (userIndex !== -1) {
        savedUsers[userIndex] = updatedUser;
        localStorage.setItem("devElevateUsers", JSON.stringify(savedUsers));
      }

      dispatch({ type: "UPDATE_PROFILE", payload: data });
    } catch (error) {
      console.error("Profile update failed:", error);
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // In real app, verify current password and update
      if (currentPassword !== "password123") {
        throw new Error("Current password is incorrect");
      }

      dispatch({ type: "CHANGE_PASSWORD_SUCCESS" });
    } catch (error) {
      throw error;
    }
  };

  const loadUsers = () => {
    const savedUsers = JSON.parse(
      localStorage.getItem("devElevateUsers") || "[]"
    );
    dispatch({ type: "LOAD_USERS", payload: savedUsers });
  };

  const updateUser = (user: User) => {
    // Update in localStorage
    const savedUsers = JSON.parse(
      localStorage.getItem("devElevateUsers") || "[]"
    );
    const userIndex = savedUsers.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      savedUsers[userIndex] = user;
      localStorage.setItem("devElevateUsers", JSON.stringify(savedUsers));
    }

    dispatch({ type: "UPDATE_USER", payload: user });
  };

  const deleteUser = (userId: string) => {
    // Remove from localStorage
    const savedUsers = JSON.parse(
      localStorage.getItem("devElevateUsers") || "[]"
    );
    const filteredUsers = savedUsers.filter((u: User) => u.id !== userId);
    localStorage.setItem("devElevateUsers", JSON.stringify(filteredUsers));

    dispatch({ type: "DELETE_USER", payload: userId });
  };

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        loadUsers,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
