import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Body } from "./components/Body.tsx";
import { Profile } from "./components/Profile.tsx";
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
      <Route path="/app" element={<Body/>} >
       <Route path="profile" element = {<Profile/>} />
       <Route path="home" element = {<Feed/>} /> 
       <Route path="settings" element = {<Settings/>} />
    </Route> 
    </Routes>
  </BrowserRouter>
  </>
)};

export default App;
