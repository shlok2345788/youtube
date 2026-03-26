import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { SidebarProvider } from "../lib/SidebarContext";
import { ThemeProvider, useTheme } from "../lib/ThemeContext";
import Login from "@/components/Login";
import { useState } from "react";
interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

const AppContent = ({ Component, pageProps }: AppProps) => {
  const { theme, isLoading } = useTheme();
  const [user, setUser] = useState<User | null>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Detecting your location...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-white text-black' : 'bg-gray-900 text-white'} flex flex-col`}>
      <title>Your-Tube Clone</title>
      <Navbar />
      <Toaster />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:block" />
        <main className="flex-1 overflow-y-auto">
          <Component {...pageProps} />
        </main>
      </div>
    </div>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <UserProvider>
        <SidebarProvider>
          <AppContent Component={Component} pageProps={pageProps} />
        </SidebarProvider>
      </UserProvider>
    </ThemeProvider>
  );
}
