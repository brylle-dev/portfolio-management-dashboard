import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.api";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: userApi.getMe,
    staleTime: 1000 * 60 * 5, // 5 min
  });
