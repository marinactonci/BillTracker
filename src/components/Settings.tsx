import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import UserSettings from "./UserSettings";

function Settings() {
  const [user, setUser] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState({});

  const navigator = useNavigate();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[92vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">
              You have to be signed in to view this page
            </p>
            <button
              className="p-2 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => navigator("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto min-h-[92vh] py-20">
        <UserSettings user={user} />
      </div>
    </>
  );
}

export default Settings;
