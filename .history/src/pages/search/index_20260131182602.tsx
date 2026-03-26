"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import UserSearched from "@/components/UserSearched";

const SearchPage = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get('q');

    return (
        <div className="flex-1 p-4">
            <div className="max-w-6xl">
                {q && (
                    <div className="mb-6">
                        <h1 className="text-xl font-medium mb-4">
                            Search results for &quot;{q}&quot;
                        </h1>
                    </div>
                )}

                <Suspense fallback={<div>Loading search results...</div>}>
                    <UserSearched query={q as string} />
                </Suspense>
            </div>
        </div>
    );
};

export default SearchPage;
