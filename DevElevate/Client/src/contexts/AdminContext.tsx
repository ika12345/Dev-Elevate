
// src/contexts/AdminContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getAllUsers } from "../api/adminApi.ts";
import { User } from "../types/User.ts";

interface AdminContextType {
  users: User[];
  totalUsers: number;
  loading: boolean;
  fetchAllUsers: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data.users);
      setTotalUsers(data.totalUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  return (
    <AdminContext.Provider value={{ users, totalUsers, loading, fetchAllUsers }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = (): AdminContextType => {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used inside AdminProvider");
  return context;
};
