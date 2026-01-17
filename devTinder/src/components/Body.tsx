import { Outlet } from "react-router"
import NavBar from "../NavBar"
import { Footer } from "./Footer"

interface bodyProps {
    username : string
}

export const Body:React.FC<bodyProps> = ({username}) => {

    return (
        <>
        <NavBar username={username}/>
        <Outlet/>
        <Footer/>
        </>
    )
}