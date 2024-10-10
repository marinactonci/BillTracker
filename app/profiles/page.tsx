"use client";

import React, { useEffect, useState } from "react";
import { getProfiles } from "@/utils/supabaseUtils";
import { supabase } from "@/lib/supabaseClient";
import Profile from "@/components/profile";
import CreateProfile from "@/components/create-profile";
import { Button } from "antd";

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
        <div className="min-h-[84vh] px-4 sm:px-0 grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl text-center">
              You have to be signed in to view this page
            </p>
            <Button type="primary" size="large" href="/login">
              Log In
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container px-4 sm:px-0 mx-auto min-h-[84vh] py-20">
        <h1 className="text-3xl font-medium mb-6">
          Create a new profile or edit the existing ones
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {profiles &&
            profiles.map((profile: ProfileType) => {
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
