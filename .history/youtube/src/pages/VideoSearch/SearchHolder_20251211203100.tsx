"use client";

import UserSearched from "@/components/UserSearched";
import { useRouter } from "next/router";
import { Suspense } from "react";

const SearchHolder = () => {
    const router = useRouter();
    const { q } = router.query;

    const searchQuery = typeof q === "string" ? q : "";

    return (
        <div className="flex-1 p-4">
            <div className="max-w-6xl">
                {searchQuery && (
                    <div className="mb-6">
                        <h1 className="text-xl font-medium mb-4">
                            Search results for "{searchQuery}
                        </h1>
                    </div>
                )}

                <Suspense fallback={<div>Loading search results...</div>}>
                    <UserSearched query={searchQuery} />
                </Suspense>
            </div>
        </div>
    );
};

export default SearchHolder;
