import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => {
    return redirect({ to: "/dashboard" });
  },
  component: Index,
});

function Index() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome to Investment Manage App</h1>
    </div>
  );
}
