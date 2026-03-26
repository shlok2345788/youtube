"use client";

import {
    Bell,
    Menu,
    Mic,
    Search,
    User,
    VideoIcon,
} from "lucide-react";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from '../lib/AuthContext'
import ChannelDialog from '../components/'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ChannelDialog from "@/components/ChannelDialog";

const Navbar = () => {

    
    const [searchQuery, setSearchQuery] = useState("");
    const [isdialogeopen, setisdialogeopen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };


    const handleKeypress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e as any);
        }
    }
    function logout() {

    }

    return (
        <header className="flex items-center justify-between px-4 py-2 bg-white border-b">

            <div className="flex items-center gap-4 w-1/4">
                <Button variant="secondary" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>

                <Link href="/" className="flex items-center gap-1">
                    <div className="bg-red-600 p-1 rounded">
                        <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>

                    <span className="text-xl font-medium text-gray-700">YourTube</span>
                    <span className="text-xs text-gray-400 ml-1">IN</span>
                </Link>
            </div>

            {/* CENTER SEARCH BAR */}
            <form
                onSubmit={handleSearch}
                className="flex items-center justify-center w-1/2"
            >
                <div className="flex  border rounded-full overflow-hidden max-w-2xl w-full">
                    <input
                        type="search"
                        onKeyPress={handleKeypress}
                        value={searchQuery}
                        placeholder="Search"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 px-4 py-1 text-gray-700 focus:outline-none"
                    />

                    <Button type="submit" variant='secondary' className="rounded-none px-6 bg-gray-100">
                        <Search className="w-5 h-5" />
                    </Button>
                </div>

                <Button variant="secondary" size="icon" className="ml-2">
                    <Mic className="w-5 h-5" />
                </Button>
            </form>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3 w-1/4 justify-end">
                {user ? (
                    <>
                        <Button variant="secondary" size="icon">
                            <VideoIcon className="w-6 h-6" />
                        </Button>

                        <Button variant="secondary" size="icon">
                            <Bell className="w-6 h-6" />
                        </Button>

                        {/* Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="ghost"
                                    className="relative h-8 w-8 rounded-full"
                                >
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage src={user.image} />
                                        <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                {user?.channelname ? (
                                    <DropdownMenuItem asChild>
                                        <Link href={`/channel/${user?.id}`}>Your channel</Link>
                                    </DropdownMenuItem>
                                ) : (
                                    <div className="px-2 py-1.5">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="w-full"
                                            onClick={() => setisdialogeopen(true)}
                                        >
                                            Create Channel
                                        </Button>
                                    </div>
                                )}
                                <DropdownMenuItem asChild>
                                    <Link href="/history">History</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/liked">Liked videos</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/watch-later">Watch later</Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={logout}>Sign out</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </>
                ) : (
                    <Button>
                        <User className="w-4 h-4" /> Sign in
                    </Button>
                )}
            </div>
           <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
        </header>
    );

}

export default Navbar;
