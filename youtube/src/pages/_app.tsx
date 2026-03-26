import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { UserProvider } from "../lib/AuthContext";
import { SidebarProvider } from "../lib/SidebarContext";
import { ContextProvider } from "../context/SocketContext";

import { useEffect, useState } from "react";
import { getGeoLocation, isSouthIndia, isWhiteThemeTime } from "@/lib/themeUtils";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isWatchPage = (router.pathname.includes("/watch") && !router.pathname.includes("/watch-later")) || router.pathname.includes("/VideoOpenToWatch");

  const [themeClass, setThemeClass] = useState("dark"); // Default to dark

  useEffect(() => {
    const applyTheme = async () => {
      const geo = await getGeoLocation();
      const isSouth = isSouthIndia(geo?.region);
      const isWhiteTime = isWhiteThemeTime();

      // South India + 10 AM to 12 PM = White
      if (isSouth && isWhiteTime) {
        setThemeClass("");
      } else {
        setThemeClass("dark");
      }
    };
    applyTheme();
    const onFocus = () => applyTheme();
    window.addEventListener("focus", onFocus);
    const interval = window.setInterval(applyTheme, 5 * 60 * 1000); // every 5 min

    return () => {
      window.removeEventListener("focus", onFocus);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <UserProvider>
      <ContextProvider>
        <SidebarProvider>
          <div className={`min-h-screen flex flex-col ${themeClass}`}>
            <title>Your-Tube Clone</title>
            <Navbar />
            <Toaster />
            <div className={`flex flex-1 relative overflow-hidden bg-background text-foreground`}>
              {/* Only show persistent sidebar if NOT on watch page */}
              <Sidebar className={isWatchPage ? "hidden" : ""} />
              <main 
                className={`flex-1 overflow-y-auto transition-all duration-300 ${
                  isWatchPage ? "w-full" : ""
                }`}
              >
                <Component {...pageProps} />
              </main>
            </div>
          </div>
        </SidebarProvider>
      </ContextProvider>
    </UserProvider>
  );
}

