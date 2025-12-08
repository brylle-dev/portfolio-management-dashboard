// src/features/portfolio/components/WelcomeScreen.tsx
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

export function WelcomeScreen() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-6">
      <FolderPlus className="w-16 h-16 text-muted-foreground" />
      <div>
        <h1 className="text-2xl font-bold">
          Welcome to Your Portfolio Dashboard
        </h1>
        <p className="text-muted-foreground mt-2 max-w-md">
          You don’t have any portfolios yet. Create your first portfolio to
          start tracking your investments.
        </p>
      </div>
      <Button onClick={() => router.navigate({ to: "/dashboard" })} size="lg">
        Create Portfolio
      </Button>
    </div>
  );
}
