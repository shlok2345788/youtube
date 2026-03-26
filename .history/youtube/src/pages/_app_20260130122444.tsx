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
              <Component {...pageProps} />Tasks
6
We should have translator option on comment section for user comments along with like and dislike options.. user can comment on any language as well as we should have an option to translate the comment in desired language. we should show user exact city name as well along with comments . we should not allow comments which has special characters and remove the comments automatically if its get 2 dislike from others.
            </main>
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
