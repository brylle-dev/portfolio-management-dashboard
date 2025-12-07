import { api } from "@/lib/client";

export const userApi = {
  getMe: async () => {
    const res = await api.get("/user/me");
    return res.data.user;
  },
};
