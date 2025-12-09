import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginDTO, type RegisterDTO } from "../api/auth.api";
import { useAuthStore } from "../store/auth.store";
import { useNavigate } from "@tanstack/react-router";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data: LoginDTO) => authApi.login(data),
    onSuccess: (data) => {
      console.log("🚀 ~ useLogin ~ data:", data);
      setAuth(data.user, data.access_token, data.expires_in);
      queryClient.setQueryData(["me"], data.user);
      navigate({ to: "/dashboard" });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (data: RegisterDTO) => authApi.register(data),
  });
};

export function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearAuth();
      queryClient.clear();
      navigate({ to: "/login" }); // redirect to login
    },
  });
}
