import UserSearched from "@/components/UserSearched"
import { useRouter } from "next/router"
import { Suspense } from "react"
const SearchHolder = () => {

    const UserRouter = useRouter()
    const { search } = UserRouter.query //object containing URL query values
    return (
        <div className="flex-1 p-4">
            <div className="max-w-6xl">
                {search && (
                    <div className="mb-6">
                        <h1 className="text-xl font-medium mb-4">Search results for `{search}`
                        </h1>
                    </div>
                )}
                <Suspense fallback={<div>Loading search results...</div>}>
                    <UserSearched query='/>
                </Suspense>
            </div>

        </div>
    )
}

export default SearchHolder