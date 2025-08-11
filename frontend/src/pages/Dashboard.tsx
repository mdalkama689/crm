import { useEffect, useState } from "react"

const Dashboard = () => {
const [login, setLogin] = useState<boolean>(false)


    useEffect(() => {
const isLogin = localStorage.getItem("login")

if(isLogin){
    setLogin(true)
}


    }, [])

    if(!login){
        return <p>You are not loggedin , pleae logi</p>
    }
  return (
    <div>Welcome to the dashboard </div>
  )
}

export default Dashboard