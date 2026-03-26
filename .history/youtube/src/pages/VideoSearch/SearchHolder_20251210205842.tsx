import UserSearched from "@/components/UserSearched"
import { useRouter } from "next/router"
import { Suspense } from "react"
const SearchHolder = () => {

    const UserRouter = useRouter()
    const { search } = UserRouter.query
    return (
        <div>
            <div>
                {search && (
                    <div>
                        <h1>Search results for `{search}`
                        </h1>
                    </div>
                )}
                <Suspense fallback={<div>Loading search results...</div>}>
                    <UserSearched />//query={q || ""} />
                </Suspense>
            </div>

        </div>
    )
}

export default SearchHolder