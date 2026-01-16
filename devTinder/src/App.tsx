import { useState } from "react";
import logo from "./public/logo.png";
import NavBar from "./NavBar";
import { BrowserRouter, Route, Routes } from "react-router";


const App: React.FC = () => {


  return (
  <>
  <BrowserRouter basename="/" >
    <Routes>
      <Route path="/login" element={<><div>Login Page</div></>} />
    </Routes>
  </BrowserRouter>
  <NavBar username={"Soubhagya"} />;
  </>
)};

export default App;
