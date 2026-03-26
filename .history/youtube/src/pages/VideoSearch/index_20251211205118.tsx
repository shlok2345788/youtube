import React from "react";
import { useRouter } from "next/router";
import UserSearched from "@/components/UserSearched";

const SearchPage = () => {
  const router = useRouter();
  const { q } = router.query;

  return (
    <div>
      <UserSearched query={String(q || "")} />
    </div>
  );
};

export default SearchPage;
