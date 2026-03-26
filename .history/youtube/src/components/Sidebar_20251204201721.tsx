import {
    Home,
    Compass,
    PlaySquare,
    Clock,
    ThumbsUp,
    History,
    User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
// import Channeldialogue from "./channeldialogue";
// import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
    //   const { user } = useUser();
    const user: any = {
        id: "1",
        name: "John Doe",
        email: "john@example.com",
        image: "https://github.com/shadcn.png?height=32&width=32",
    };

    const [isdialogeopen, setisdialogeopen] = useState(false);
    return (

        <aside className="w-64 bg-white top-0 border-r min-h-screen p-2">
            <nav className=" ">
                <Link href="/">
                    <Button variant="outline" className="w-full justify-start">
                        <Home className="w-5 h-5 mr-3" />
                        Home
                    </Button>
                </Link>
                <Link href="/explore">
                    <Button variant="outline" className="w-full justify-start">
                        <Compass className="w-5 h-5 mr-3" />
                        Explore
                    </Button>
                </Link>
                <Link href="/subscriptions">
                    <Button variant="outline" className="w-full justify-start">
                        <PlaySquare className="w-5 h-5 mr-3" />
                        Subscriptions
                    </Button>
                </Link>

                {user && (
                    <>
                        <div className="  pt-2 mt-2">
                            <Link href="/history">
                                <Button variant="outline" className="w-full justify-start">
                                    <History className="w-5 h-5 mr-3" />
                                    History
                                </Button>
                            </Link>
                            <Link href="/liked">
                                <Button variant="outline" className="w-full justify-start">
                                    <ThumbsUp className="w-5 h-5 mr-3" />
                                    Liked videos
                                </Button>
                            </Link>
                            <Link href="/watch-later">
                                <Button variant="outline" className="w-full justify-start">
                                    <Clock className="w-5 h-5 mr-3" />
                                    Watch later
                                </Button>
                            </Link>
                            {user?.channelname ? (
                                <Link href={`/channel/${user.id}`}>
                                    <Button variant="outline" className="w-full justify-start">
                                        <User className="w-5 h-5 mr-3" />
                                        Your channel
                                    </Button>
                                </Link>
                            ) : (
                                <div className="px-2 py-1.5">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full"
                                        onClick={() => setisdialogeopen(true)}
                                    >
                                        Create Channel
                                    </Button>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </nav>
            {/* <Channeldialogue
                isopen={isdialogeopen}
                onclose={() => setisdialogeopen(false)}
                mode="create"
            /> */}
        </aside>
    );
};

export default Sidebar;
