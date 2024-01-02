import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout, auth } from "../services/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";

function Navbar() {
  const [activeLink, setActiveLink] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState({} as any);

  const navigate = useNavigate();

  const location = useLocation();

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };

  const handleSignout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser({});
      }
    });

    const currentPath = location.pathname.substring(1);

    if (currentPath === "") {
      setActiveLink("home");
    } else {
      setActiveLink(currentPath);
    }

    return () => listener();
  }, [location]);

  return (
    <>
      <nav className="flex items-center justify-between px-6 border-b h-[8vh]">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/logo.svg"
            alt=""
            className="w-8 h-8 hover:scale-110 transform transition duration-300 ease-in-out"
          />
          <div className="text-2xl transition-colors">Bill Tracker</div>
        </Link>
        <div className="flex gap-8 items-center">
          <Link to="/" className={activeLink === "home" ? "font-bold" : ""}>
            Home
          </Link>
          <Link
            to="/dashboard"
            className={activeLink === "dashboard" ? "font-bold" : ""}
          >
            Dashboard
          </Link>
          <Link
            to="/profiles"
            className={activeLink === "profiles" ? "font-bold" : ""}
          >
            Profiles
          </Link>
          <Link
            to="/settings"
            className={activeLink === "settings" ? "font-bold" : ""}
          >
            Settings
          </Link>
          <div className="dropdown">
            <label tabIndex={0} className="w-auto cursor-pointer">
              <div className="flex items-center gap-2 w-max">
                <i className="fa-solid fa-language text-xl"></i>
                <i className="fa-solid fa-chevron-down text-sm"></i>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
            >
              <li>
                <a>Croatian</a>
              </li>
              <li>
                <a>English</a>
              </li>
            </ul>
          </div>

          {isLoggedIn ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="w-auto cursor-pointer">
                <div className="flex items-center gap-1">
                  <img
                    src="user.webp"
                    alt="Change language"
                    className="w-12 rounded-full border-2"
                  />
                </div>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content w-auto menu p-2 shadow bg-base-100 rounded-box"
              >
                <li>
                  <Link className="whitespace-nowrap" to="/settings">
                    {user && user.displayName}
                  </Link>
                </li>
                <li onClick={handleSignout}>
                  <a className="whitespace-nowrap">Sign Out</a>
                </li>
              </ul>
            </div>
          ) : (
            <Link
              className="w-full p-2 bg-black border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              to="/login"
              onClick={() => handleLinkClick("login")}
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
