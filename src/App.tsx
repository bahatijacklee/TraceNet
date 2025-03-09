import { Suspense, useState, useEffect } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./lib/web3config";
import routes from "tempo-routes";
import Home from "./pages/Home";
import Devices from "./pages/Devices";
import Data from "./pages/Data";
import Admin from "./pages/Admin";
import Rewards from "./pages/Rewards";
import Header from "./components/layout/Header";
import Navbar from "./components/layout/Navbar";
import { ThemeProvider } from "./lib/ThemeProvider";
import { Toaster } from "sonner";

import "@rainbow-me/rainbowkit/styles.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Check system preference on initial load
  useEffect(() => {
    const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);

    // Apply theme class to document
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const handleThemeToggle = (isDark: boolean) => {
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  };

  return (
    <ThemeProvider defaultTheme={isDarkMode ? "dark" : "light"}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <Suspense fallback={<p>Loading...</p>}>
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                {/* Use either Header or Navbar based on your preference */}
                {/* <Header isDarkMode={isDarkMode} onThemeToggle={handleThemeToggle} /> */}
                <Navbar />
                <main className="flex-1 animate-fadeIn">
                  {/* For the tempo routes */}
                  {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}

                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/devices" element={<Devices />} />
                    <Route path="/data" element={<Data />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/rewards" element={<Rewards />} />
                    {/* Add a catch-all route to handle any undefined routes */}
                    <Route path="*" element={<Home />} />
                  </Routes>
                </main>
                <Toaster position="top-right" richColors closeButton />
              </div>
            </Suspense>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}

export default App;
