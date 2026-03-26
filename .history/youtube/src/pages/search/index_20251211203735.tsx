import { useRouter } from "next/router";
import UserSearched from "@/components/UserSearched";

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;

  const query = typeof q === "string" ? q : "";

  return (
    <div className="p-4 flex-1">
      <h1 className="text-xl mb-4 font-semibold">
        Search results for "{query}"
      </h1>

      <UserSearched query={query} />
    </div>
  );
}
