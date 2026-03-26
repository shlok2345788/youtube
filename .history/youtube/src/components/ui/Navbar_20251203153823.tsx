import { Bell, Menu, Mic, Search, User, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import {Button} from './button'
import Link from "next/link";
// import { Input } from "./ui/input";

const Navbar = () => {
    return (
        <header className="flex items-center justify-between px-4 py-2 bg-white border-b">
            <div className="flex items-center gap-4">
                <button></button>
                <Link href='/'>
                    <div>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                        </svg>
                    </div>
                    <span>Youtube</span>
                    <span>IN</span>
                </Link>
            </div>
        </header>
    )
}

export default Navbar