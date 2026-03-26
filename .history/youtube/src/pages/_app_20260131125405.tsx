import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { SidebarProvider } from "../lib/SidebarContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-white text-black flex flex-col">
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
      </SidebarProvider>
    </UserProvider>
  );
}
