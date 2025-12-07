import { type ReactNode, useEffect } from "react";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { authApi } from "@/features/auth/api/auth.api";
import { useQueryClient } from "@tanstack/react-query";

export function AuthProvider({ children }: { children: ReactNode }) {
  const { setAuth, clearAuth } = useAuthStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const data = await authApi.refresh(); // tries silent refresh
        if (data?.access_token && data?.user) {
          setAuth(data.user, data.access_token);
          queryClient.setQueryData(["me"], data.user);
        }
      } catch {
        clearAuth();
      }
    };
    initAuth();
  }, [setAuth, clearAuth, queryClient]);

  return <>{children}</>;
}
