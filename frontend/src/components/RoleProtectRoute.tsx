import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../slices/store"
import { Outlet,  useNavigate} from "react-router-dom"
import { useEffect } from "react"
import Loader from "./Loader"
import { fetchCurrentUser } from "../slices/auth/AuthSlice"


interface RoleProtectedRouteProps  {
    allowedRole: string[]
}


const RoleProtectRoute = ({ allowedRole}:  RoleProtectedRouteProps) => {
    const dispatch = useDispatch<AppDispatch>()
    const {
          isLoading,isLoggedIn,user
    } = useSelector((state: RootState) => state.auth)

         const navigate = useNavigate()


         useEffect(() => {
dispatch(fetchCurrentUser())

         }, [])
    useEffect(() => {

        if(!isLoading && !isLoggedIn){
            navigate('/sign-in')
        }

if(user && !allowedRole.includes(user.role)){
       navigate('/')
}

    }, [isLoading, isLoggedIn, user])


    if(isLoading){
        return <Loader />
    }



    return (
   <Outlet />
  )
}

export default RoleProtectRoute