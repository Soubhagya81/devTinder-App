import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import { Footer } from "./Footer"

interface bodyProps {
}

export const Body:React.FC<bodyProps> = () => {

    return (
        <>
        <NavBar/>
        <Outlet/>
        <Footer/>
        </>
    )
}