import { api } from "@/lib/client";
import type { User } from "@/types/user";

export interface LoginDTO {
  identifier: string;
  password: string;
}

export interface RegisterDTO {
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  expires_in?: string;
  token_type?: string;
}

export const authApi = {
  login: async (payload: LoginDTO): Promise<AuthResponse> => {
    const res = await api.post("/auth/login", payload);
    console.log("🚀 ~ res.data:", res.data);
    return res.data;
  },
  register: async (payload: RegisterDTO): Promise<{ user: User }> => {
    const res = await api.post("/auth/register", payload);
    return res.data;
  },
  refresh: async (): Promise<AuthResponse> => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },
};
