"use client";

import { useRouter } from "next/router";
import { Suspense } from "react";
import UserSearched from "@/components/UserSearched";

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;

  return (
    <div className="flex-1 p-4">
      <div className="max-w-6xl">
        {q && (
          <div className="mb-6">
            <h1 className="text-xl font-medium mb-4">
              Search results for ``
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
