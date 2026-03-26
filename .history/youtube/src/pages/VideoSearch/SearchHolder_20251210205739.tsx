import UserSearched from "@/components/UserSearched"
import { useRouter } from "next/router"
const SearchHolder = () => {

    const UserRouter = useRouter()
    const { search } = UserRouter.query
    return (
        <div>
            <div>
                {search && (
                    <div>
                        <h1>Search results for "{search}``
                        </h1>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SearchHolder