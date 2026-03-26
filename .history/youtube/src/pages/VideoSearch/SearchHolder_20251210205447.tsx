import UserSearched from "@/components/UserSearched"
import { useRouter } from "next/router"
const SearchHolder = () => {

    const UserRouter = useRouter()
    const { searc } = UserRouter.query
    return (
        <div><SearchHolder />
        </div>
    )
}

export default SearchHolder