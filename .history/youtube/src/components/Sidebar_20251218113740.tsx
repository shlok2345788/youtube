import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import ChannelDialog from "./ChannelDialog";
import { useUser } from "@/lib/AuthContext";
import { useSidebar } from "@/lib/SidebarContext";

const Sidebar = ({ className = "" }: { className?: string }) => {
  const { user } = useUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();

  const [isdialogeopen, setisdialogeopen] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 bg-white border-r min-h-screen p-2 fixed md:relative z-50 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${className}`}
      >
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h2 className="text-xl font-bold">Menu</h2>
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="w-6 h-6" />
          </Button>
        </div>

        <nav className="space-y-1">
          <Link href="/" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start">
              <Home className="w-5 h-5 mr-3" />
              Home
            </Button>
          </Link>
          <Link href="/explore" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start">
              <Compass className="w-5 h-5 mr-3" />
              Explore
            </Button>
          </Link>
          <Link href="/subscriptions" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start">
              <PlaySquare className="w-5 h-5 mr-3" />
              Subscriptions
            </Button>
          </Link>

          {/* Temporary debug info */}
          {user ? (
            <div className="text-xs text-green-500 px-2 py-1">User logged in</div>
          ) : (
            <div className="text-xs text-red-500 px-2 py-1">No user logged in</div>
          )}

          {user && (
            <>
              <div className="border-t pt-4 mt-4">
                {/* User section - visible when logged in */}
                <div className="text-xs text-gray-500 px-2 py-1">User section</div>
                <Link href="/history" onClick={closeSidebar}>
                  <Button variant="ghost" className="w-full justify-start">
                    <History className="w-5 h-5 mr-3" />
                    History
                  </Button>
                </Link>
                <Link href="/liked" onClick={closeSidebar}>
                  <Button variant="ghost" className="w-full justify-start">
                    <ThumbsUp className="w-5 h-5 mr-3" />
                    Liked videos
                  </Button>
                </Link>
                <Link href="/watch-later" onClick={closeSidebar}>
                  <Button variant="ghost" className="w-full justify-start">
                    <Clock className="w-5 h-5 mr-3" />
                    Watch later
                  </Button>
                </Link>
                {user?.channelname && user.channelname.trim() !== "" ? (
                  <Link href={`/channel/${user.id}`} onClick={closeSidebar}>
                    <Button variant="ghost" className="w-full justify-start">
                      <User className="w-5 h-5 mr-3" />
                      Your channel
                    </Button>
                  </Link>
                ) : (
                  <div className="px-2 py-1.5">
                    <Button
                      variant="default"
                      size="sm"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold border border-blue-700"
                      onClick={() => {
                        setisdialogeopen(true);
                        closeSidebar();
                      }}
                    >
                      Create Channel
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
        <Channeldialogue
          isOpen={isdialogeopen}
          onClose={() => setisdialogeopen(false)}
          onChannelCreated={(name) => console.log("Channel created:", name)}
          userId={user?.id || ""}
        />
      </aside>
    </>
  );
};

export default Sidebar;
