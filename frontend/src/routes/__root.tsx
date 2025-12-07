import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";

const RootLayout = () => {
  return (
    <div className="min-h-screen w-screen bg-gray-500">
      <Outlet />
    </div>
  );
};

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootLayout,
  }
);
