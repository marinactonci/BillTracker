"use client";

import React, { useEffect, useState } from "react";
import { getProfiles } from "@/utils/supabaseUtils";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import Profile from "@/components/profile";
import CreateProfile from "@/components/create-profile";

interface ProfileType {
  id: number;
  name: string;
  street: string;
  city: string;
  country: string;
}

function Profiles() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    fetchProfiles();

    return () => {};
  }, [supabase.auth]);

  async function fetchProfiles() {
    const fetchedProfiles = await getProfiles();
    setProfiles(fetchedProfiles);
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">
              You have to be signed in to view this page
            </p>
            <Link
              href="/login"
              className="p-2 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            >
              Log In
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto min-h-[84vh] py-20">
        <h1 className="text-3xl font-medium mb-6">
          Create a new profile or edit the existing ones
        </h1>
        <div className="grid grid-cols-3 gap-4">
          {profiles &&
            profiles.map((profile: any) => {
              return (
                <Profile
                  profile={profile}
                  key={profile.id}
                  onChange={fetchProfiles}
                />
              );
            })}
          <CreateProfile onChange={fetchProfiles} />
        </div>
      </div>
    </>
  );
}

export default Profiles;
