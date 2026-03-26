import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  User,
  X,
  Download,
  Video,
  Library,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import ChannelDialog from "./ChannelDialog";
import { useUser } from "@/lib/AuthContext";
import { useSidebar } from "@/lib/SidebarContext";
import { useRouter } from "next/router";

const Sidebar = ({ className = "" }: { className?: string }) => {
  const { user, login } = useUser();
  const { isSidebarOpen, closeSidebar } = useSidebar();
  const [isdialogeopen, setisdialogeopen] = useState(false);
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  const sidebarLinks = [
    { name: "Home", icon: Home, path: "/" },
    { name: "Explore", icon: Compass, path: "/explore" },
    { name: "Subscriptions", icon: PlaySquare, path: "/subscriptions" },
    { name: "Downloads", icon: Download, path: "/downloads" },
    { name: "Video Call", icon: Video, path: "/video-call", className: "text-blue-600" },
  ];

  const userLinks = [
    { name: "History", icon: History, path: "/history" },
    { name: "Liked videos", icon: ThumbsUp, path: "/liked" },
    { name: "Watch later", icon: Clock, path: "/watch-later" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/50 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Expanded Sidebar (Mobile Overlay + Large Desktop) */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-background transition-all duration-300 z-[70] 
          ${isSidebarOpen 
            ? 'w-64 translate-x-0' 
            : 'w-64 -translate-x-full md:translate-x-0 md:w-[72px] overflow-hidden'
          } ${className} border-r overflow-y-auto no-scrollbar`}
      >
        {/* Mobile Header */}
        <div className="flex items-center px-4 h-14 md:hidden">
          <Button variant="ghost" size="icon" onClick={closeSidebar}>
            <X className="w-6 h-6" />
          </Button>
          <span className="ml-4 font-bold text-xl">Menu</span>
        </div>

        {/* Sidebar Content */}
        <div className={`p-2 ${!isSidebarOpen && 'md:p-1'}`}>
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <Link key={link.name} href={link.path}>
                <div className={`flex ${isSidebarOpen ? 'flex-row items-center px-3 py-2' : 'md:flex-col md:items-center md:justify-center md:py-4 md:px-1'} 
                  rounded-lg hover:bg-accent transition-colors 
                  ${isActive(link.path) ? 'bg-accent font-bold' : ''} ${link.className || ''}`}
                >
                  <link.icon className={`${isSidebarOpen ? 'w-5 h-5 mr-5' : 'w-6 h-6 mb-1'}`} />
                  <span className={`${isSidebarOpen ? 'text-sm' : 'text-[10px] text-center'}`}>
                    {link.name}
                  </span>
                </div>
              </Link>
            ))}

            <div className={`my-4 border-t ${!isSidebarOpen && 'hidden md:block'}`} />

            {user && (
              <>
                {userLinks.map((link) => (
                  <Link key={link.name} href={link.path}>
                    <div className={`flex ${isSidebarOpen ? 'flex-row items-center px-3 py-2' : 'md:flex-col md:items-center md:justify-center md:py-4 md:px-1'} 
                      rounded-lg hover:bg-accent transition-colors
                      ${isActive(link.path) ? 'bg-accent font-bold' : ''}`}
                    >
                      <link.icon className={`${isSidebarOpen ? 'w-5 h-5 mr-5' : 'w-6 h-6 mb-1'}`} />
                      <span className={`${isSidebarOpen ? 'text-sm' : 'text-[10px] text-center'}`}>
                        {link.name}
                      </span>
                    </div>
                  </Link>
                ))}

                {!isSidebarOpen && (
                  <Link href="/library">
                    <div className="hidden md:flex flex-col items-center justify-center py-4 px-1 rounded-lg hover:bg-accent transition-colors">
                      <Library className="w-6 h-6 mb-1" />
                      <span className="text-[10px]">You</span>
                    </div>
                  </Link>
                )}

                {isSidebarOpen && (
                  <>
                    <div className="my-4 border-t" />
                    <Link href="/premium" onClick={closeSidebar}>
                      <div className={`flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors`}>
                        <div className="w-5 h-5 mr-5 flex items-center justify-center bg-red-600 rounded-sm">
                           <div className="w-0 h-0 border-t-[3px] border-t-transparent border-l-[6px] border-l-white border-b-[3px] border-b-transparent"></div>
                        </div>
                        <span className="text-sm">Try Premium</span>
                      </div>
                    </Link>
                    <div className="my-4 border-t" />
                    <h3 className="px-4 mb-2 text-sm font-semibold">Subscriptions</h3>
                    {/* Channel List could go here */}
                    {user?.channelname && user.channelname.trim() !== "" ? (
                      <Link href={`/channel/${user.id}`}>
                        <div className={`flex items-center px-3 py-2 rounded-lg hover:bg-accent transition-colors ${isActive(`/channel/${user.id}`) ? 'bg-accent font-bold' : ''}`}>
                          <User className="w-5 h-5 mr-5" />
                          <span className="text-sm">Your channel</span>
                        </div>
                      </Link>
                    ) : (
                      <div className="px-3 py-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-blue-600 border-blue-600 hover:bg-blue-50"
                          onClick={() => {
                            setisdialogeopen(true);
                            closeSidebar();
                          }}
                        >
                          Create Channel
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </nav>
        </div>

      </aside>

      <ChannelDialog
        isOpen={isdialogeopen}
        onClose={() => setisdialogeopen(false)}
        onChannelCreated={(updatedUser) => {
          login(updatedUser);
          console.log("Channel created for:", updatedUser.username);
        }}
        userId={user?._id || user?.id || ""}
      />
    </>
  );
};

export default Sidebar;

