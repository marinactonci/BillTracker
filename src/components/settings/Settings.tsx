import React, { useEffect, useState } from "react";
import {
  getProfiles,
  updateProfile,
  deleteProfile,
  deleteBill,
} from "../../services/firebaseFirestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebaseAuth";
import { onAuthStateChanged } from "firebase/auth";
import UserSettings from "./UserSettings";
import Profiles from "./profiles/Profiles";

function Settings() {
  const [profiles, setProfiles] = useState([] as any);
  const [user, setUser] = useState({} as any);
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigator = useNavigate();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        setUser(user);
        await fetchProfiles(user.uid);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

  const handleOnCreate = async () => {
    await fetchProfiles(user.uid);
  };

  const handleOnSave = async (newProfile) => {
    await updateProfile(user.uid, newProfile);
    await fetchProfiles(user.uid);
  };

  const handleOnDelete = async (item, profileId, billId) => {
    if (item === "bill") {
      await deleteBill(user.uid, profileId, billId);
    } else {
      await deleteProfile(user.uid, profileId);
    }

    await fetchProfiles(user.uid);
  };

  const fetchProfiles = async (uid) => {
    try {
      const response = await getProfiles(uid);
      if (response.length) {
        response.sort((a, b) => a.id - b.id);
        setProfiles(response);
      }
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    }
  };

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
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab whitespace-nowrap"
            aria-label="Manage Profiles"
            defaultChecked
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <Profiles
              profiles={profiles}
              onCreate={handleOnCreate}
              onSave={handleOnSave}
              onDelete={handleOnDelete}
            />
          </div>
          <input
            type="radio"
            name="my_tabs_2"
            role="tab"
            className="tab whitespace-nowrap"
            aria-label="User Settings"
          />
          <div
            role="tabpanel"
            className="tab-content bg-base-100 border-base-300 rounded-box p-6"
          >
            <UserSettings user={user} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Settings;
