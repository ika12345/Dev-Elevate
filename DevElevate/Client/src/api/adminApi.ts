// src/api/adminApi.ts
import axiosInstance from "./axiosinstance.ts";
import { User } from "../types/User";
import { adminApi } from "../config/routes.ts";

// Define the response type explicitly
interface GetAllUsersResponse {
  users: User[];
  totalUsers: number;
  totalAdmins:number;
}

export const getAllUsers = async (): Promise<GetAllUsersResponse> => {
  const response = await axiosInstance.get<GetAllUsersResponse>(`${adminApi.allUser}`);
  return response.data;
};
