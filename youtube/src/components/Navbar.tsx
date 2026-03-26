"use client";

import {
    Bell,
    Menu,
    Mic,
    Search,
    User,
    VideoIcon,
    ArrowLeft
} from "lucide-react";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/router";
import { useUser } from '../lib/AuthContext'
import { useSidebar } from '../lib/SidebarContext'
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
    const { user, login, logout, handlegooglesignin } = useUser();
    const { toggleSidebar } = useSidebar();
    const [searchQuery, setSearchQuery] = useState("");
    const [isdialogeopen, setisdialogeopen] = useState(false);
    const router = useRouter();
    const [showMobileSearch, setShowMobileSearch] = useState(false);

    const handleChannelCreated = (updatedUser: any) => {
        login(updatedUser);
        setisdialogeopen(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
            setShowMobileSearch(false);
        }
    };

    const handleKeypress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSearch(e as React.FormEvent);
        }
    }

    return (
        <header className="flex items-center justify-between px-2 md:px-4 py-2 bg-background sticky top-0 z-[100] h-14 border-b">
            {/* Mobile Search Overlay */}
            {showMobileSearch ? (
                <div className="flex items-center w-full gap-2 transition-all duration-200">
                    <Button variant="ghost" size="icon" onClick={() => setShowMobileSearch(false)} className="rounded-full">
                        <ArrowLeft className="w-6 h-6" />
                    </Button>
                    <form onSubmit={handleSearch} className="flex-1 flex items-center ml-1">
                        <div className="flex w-full items-center bg-secondary rounded-full px-4 overflow-hidden border border-border focus-within:border-blue-500 focus-within:bg-background">
                            <input
                                autoFocus
                                type="search"
                                onKeyPress={handleKeypress}
                                value={searchQuery}
                                placeholder="Search"
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 py-1.5 bg-transparent focus:outline-none text-sm md:text-base"
                            />
                        </div>
                        <Button type="submit" variant='ghost' size="icon" className="ml-1 rounded-full bg-secondary">
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>
                    <Button variant="ghost" size="icon" className="rounded-full bg-secondary ml-1">
                        <Mic className="w-5 h-5" />
                    </Button>
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-1 md:gap-4 shrink-0">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="rounded-full hover:bg-secondary">
                            <Menu className="w-6 h-6" />
                        </Button>

                        <Link href="/" className="flex items-center gap-1 focus:outline-none ml-1">
                            <div className="text-red-600">
                                <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold tracking-tighter text-foreground hidden sm:inline-block">YourTube</span>
                            <span className="text-[10px] text-gray-500 mb-2 ml-0.5 hidden sm:inline-block">IN</span>
                        </Link>
                    </div>

                    {/* CENTER SEARCH BAR - Responsive */}
                    <div className="hidden md:flex flex-1 items-center justify-center max-w-[720px] px-4">
                        <form
                            onSubmit={handleSearch}
                            className="flex items-center w-full"
                        >
                            <div className="flex flex-1 items-center border border-border rounded-full overflow-hidden focus-within:border-blue-500 focus-within:shadow-inner">
                                <div className="pl-4 md:flex hidden items-center group-focus-within:block">
                                   <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500" />
                                </div>
                                <input
                                    type="search"
                                    onKeyPress={handleKeypress}
                                    value={searchQuery}
                                    placeholder="Search"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="flex-1 px-4 py-2 text-foreground bg-transparent focus:outline-none"
                                />
                                <Button type="submit" variant='secondary' className="rounded-none px-6 bg-secondary border-l border-border hover:bg-accent h-10">
                                    <Search className="w-5 h-5 text-gray-700" />
                                </Button>
                            </div>

                            <Button variant="secondary" size="icon" className="ml-3 bg-secondary rounded-full shrink-0 hover:bg-gray-200 transition-colors">
                                <Mic className="w-5 h-5" />
                            </Button>
                        </form>
                    </div>

                    {/* RIGHT SECTION AND MOBILE SEARCH */}
                    <div className="flex items-center gap-1 md:gap-2 shrink-0">
                        {/* Mobile Search Icon (visible only on mobile) */}
                        <div className="md:hidden flex items-center">
                            <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowMobileSearch(true)}>
                                <Search className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Mic className="w-6 h-6" />
                            </Button>
                        </div>
                        
                        <div className="hidden sm:flex items-center gap-1">
                             <Button variant="ghost" size="icon" className="rounded-full">
                                <VideoIcon className="w-6 h-6" />
                            </Button>
                            <Button variant="ghost" size="icon" className="rounded-full">
                                <Bell className="w-6 h-6" />
                            </Button>
                        </div>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="relative h-8 w-8 rounded-full ml-1"
                                    >
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback className="bg-blue-600 text-white">{user.name?.[0] || user.channelname?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-72 mt-2 p-4 rounded-xl" align="end" forceMount>
                                    <div className="flex gap-4 mb-4">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={user.image} />
                                            <AvatarFallback className="bg-blue-600 text-white">{user.name?.[0] || "U"}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col overflow-hidden">
                                            <p className="text-base font-semibold truncate leading-tight">{user.name || user.channelname || "User"}</p>
                                            <p className="text-sm text-gray-500 truncate lowercase mt-1">@{user.channelname || user.name || "handle"}</p>
                                            <Link href="/channel/dashboard" className="text-blue-600 text-sm mt-2 hover:underline">View channel</Link>
                                        </div>
                                    </div>
                                    {/* Additional items same as YouTube */}
                                    <DropdownMenuItem className="py-2.5 cursor-pointer rounded-lg">
                                        <Link href="/premium" className="flex items-center gap-2">
                                            <span className="text-red-600 font-bold underline font-sans">Get Premium</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={logout} className="py-2.5 cursor-pointer rounded-lg text-red-600 focus:bg-red-50 focus:text-red-700">
                                        Sign out
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 rounded-full border-gray-300 text-blue-600 px-3 py-1.5 ml-1"
                                onClick={handlegooglesignin}
                            >
                                <User className="w-4 h-4 border border-blue-600 rounded-full" />
                                <span className="text-sm font-medium">Sign in</span>
                            </Button>
                        )}
                    </div>
                    <ChannelDialog
                        isOpen={isdialogeopen}
                        onClose={() => setisdialogeopen(false)}
                        onChannelCreated={handleChannelCreated}
                        userId={user?._id || user?.id || ""}
                    />
                </>
            )}
        </header>
    );
}

export default Navbar;

