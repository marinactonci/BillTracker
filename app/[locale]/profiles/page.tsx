"use client";

import React, { useEffect, useState } from "react";
import { getProfiles } from "@/utils/supabaseUtils";
import { supabase } from "@/lib/supabaseClient";
import Profile from "@/components/profile";
import CreateProfile from "@/components/create-profile";
import { Button } from "antd";
import { useTranslations } from "next-intl";
import { ProfileType } from "@/types/profile";

function Profiles() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = useTranslations("profiles");

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
              {t("not_logged_in")}
            </p>
            <Button type="primary" size="large" href="/login">
              {t("login")}
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
          {t("title")}
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
