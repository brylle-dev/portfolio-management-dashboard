import type { ReactNode, FC } from "react";
import { QueryProvider } from "./QueryProviders";
import { AuthProvider } from "./AuthProviders";

const AppProviders: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
};

export default AppProviders;
