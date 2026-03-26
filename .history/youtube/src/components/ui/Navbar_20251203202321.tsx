import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from './button'
import Link from "next/link";
import { useRouter } from "next/router";
import { Input } from "./input";

const Navbar = () => {
    const user: any = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      image: "https://github.com/shadcn.png?height=32&width=32",
    };
    const [searchQuery, setsearchQuery] = useState('');
    const [isDialogueopen, setisDialogueopen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch(e as any)
        }
    }

    return (
        <header className="flex items-center justify-between px-4 py-2  bg-white  border-b">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon">
                    <Menu className="w-6 h-6" />
                </Button>
                <Link href="/" className="flex items-center gap-1">
                    <div className="bg-red-600 p-1 rounded">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                    <span className="text-xl font-medium">YourTube</span>
                    <span className="text-xs text-gray-400 ml-1">IN</span>
                </Link>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2  max-w-4xl">
                <div>
                    <input type="search" value={searchQuery} placeholder="Search" onKeyPress={handleKeyPress} onChange={(e) => { e.target.value }}
                        className="rounded-l-full border-r-0 w-20xl focus-visible:ring-0 text-gray-900"
                    />
                    <Button
                        type="submit"
                        className="rounded-r-full px-6 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-l-0"
                    >
                        <Search className="w-5 h-5" />
                    </Button>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Mic className="w-5 h-5" />
                </Button>
            </form>
        </header>
    )
}

export default Navbar