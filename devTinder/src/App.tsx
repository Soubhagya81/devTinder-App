import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Body } from "./components/Body.tsx";
import { Account } from "./components/Account.tsx";
import { Feed } from "./components/Feed.tsx";
import { Settings } from "./components/Settings.tsx";
import { Login } from "./components/Login.tsx";

const App: React.FC = () => {
  return (
  <>
  <BrowserRouter basename="/" >
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element= {<Login/>} />
      <Route path="/app" element={<Body username="Soubhagya"/>} >
       <Route path="account" element = {<Account/>} />
       <Route path="home" element = {<Feed/>} /> 
       <Route path="settings" element = {<Settings/>} />
    </Route> 
    </Routes>
  </BrowserRouter>
  </>
)};

export default App;
