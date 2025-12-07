// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { router } from "@/lib/router";

import AppProviders from "./providers/AppProviders";
import { queryClient } from "./providers/QueryProviders";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider";

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    // <StrictMode>
    <AppProviders>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} context={{ queryClient }} />
      </ThemeProvider>
    </AppProviders>
    // </StrictMode>
  );
}
