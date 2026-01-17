import { BrowserRouter, Route, Routes } from "react-router";
import { Body } from "./components/Body.tsx";
import { Account } from "./components/Account.tsx";
import { Home } from "./components/Home.tsx";
import { Settings } from "./components/Settings.tsx";
import { Login } from "./components/Login.tsx";
import { Footer } from "./components/Footer.tsx";

const App: React.FC = () => {
  return (
  <>
  <BrowserRouter basename="/" >
    <Routes>
      <Route path="/login" element= {<Login/>} />
      <Route path="/" element={<Body username="Soubhagya"/>} >
       <Route path="/account" element = {<Account/>} />
       <Route path="/home" element = {<Home/>} /> 
       <Route path="/settings" element = {<Settings/>} />
    </Route> 
    </Routes>
  </BrowserRouter>
  </>
)};

export default App;
