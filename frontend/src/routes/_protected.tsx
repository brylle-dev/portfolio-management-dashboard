import AppLayout from "@/components/AppLayout";
import { useAuthStore } from "@/features/auth/store/auth.store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected")({
  beforeLoad: () => {
    const token = useAuthStore.getState().access_token;
    if (!token) throw redirect({ to: "/login" });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
