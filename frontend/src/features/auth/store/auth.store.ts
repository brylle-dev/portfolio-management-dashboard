import type { User } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  access_token: string | null;
  expires_in: string | null;
  token_type: string | null;
  setAuth: (user: AuthState["user"], token: string, expiresIn?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      access_token: null,
      expires_in: null,
      token_type: null,
      setAuth: (user, token, expiresIn) =>
        set({
          user,
          access_token: token,
          expires_in: expiresIn,
        }),
      clearAuth: () =>
        set({ user: null, expires_in: null, access_token: null }),
    }),
    { name: "auth-storage" }
  )
);
