import React, { useState, useEffect } from "react";
import ProfileItems from "./profiles/ProfileItems";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebaseAuth";
import {
  getProfiles,
  updateProfile,
  updateBill,
  deleteBill,
  deleteProfile,
} from "../services/firebaseFirestore";
import { useNavigate } from "react-router-dom";

function Profiles() {
  const [user, setUser] = useState({} as any);
  const [profiles, setProfiles] = useState([] as any);
  const [isLoggedIn, setIsLoggedIn] = useState({});

  const navigator = useNavigate();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        setIsLoggedIn(true);
        await fetchProfiles(user.uid);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

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

  const handleOnCreate = async () => {
    await fetchProfiles(user.uid);
  };

  const handleOnSave = async (newProfile) => {
    await updateProfile(user.uid, newProfile);
    await fetchProfiles(user.uid);
  };

  const handleOnSaveEdit = async (newProfile) => {
    await updateBill(user.uid, "1", newProfile);
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

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[84vh] grid place-items-center">
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
      <div className="container mx-auto min-h-[84vh] py-20">
        <h1 className="text-2xl font-medium mb-6">
          Create a new profile or edit the existing ones
        </h1>
        <ProfileItems
          profiles={profiles}
          onCreate={handleOnCreate}
          onSave={handleOnSave}
          onSaveEdit={handleOnSaveEdit}
          onDelete={handleOnDelete}
        />
      </div>
    </>
  );
}

export default Profiles;
