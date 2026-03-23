import type React from "react";
import logo from "../public/logo.png";
import { useLocation } from "react-router";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps>= () => {
  const { state } = useLocation();
  const username = state?.userName || "Guest";
  return (
    <>
      <div className="navbar bg-base-300 shadow-sm">
        <div className="flex-1">
          <img className="btn btn-ghost" src={logo}></img>
        </div>
        <div className="flex gap-2">
          
          <p className="text-lg font-semibold ">Welcome, {username}</p>
          <div className="dropdown dropdown-end pr-4">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt="Tailwind CSS Navbar component"
                  src="https://static.vecteezy.com/system/resources/previews/021/190/188/non_2x/user-profile-outline-icon-in-transparent-background-basic-app-and-web-ui-bold-line-icon-eps10-free-vector.jpg"
                />
              </div>
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="justify-between">
                  Profile
                  <span className="badge">{username}</span>
                </a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavBar;
