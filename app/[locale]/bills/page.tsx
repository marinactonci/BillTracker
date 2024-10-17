"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getBills, getProfiles } from "@/utils/supabaseUtils";
import Bill from "@/components/bill";
import CreateBill from "@/components/create-bill";
import { ProfileType } from "@/types/profile";
import { BillType } from "@/types/bill";
import { Button } from "antd";

function Bills() {
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [bills, setBills] = useState<BillType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        if (session) {
          const fetchedProfiles = await getProfiles();
          setProfiles(fetchedProfiles);

          let allBills: BillType[] = [];
          for (const profile of fetchedProfiles) {
            const profileBills = await getBills(profile.id);
            allBills = [...allBills, ...profileBills];
          }
          setBills(allBills);
        }
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    initialize();
  }, []);

  const fetchBills = async () => {
    try {
      let allBills: BillType[] = [];
      for (const profile of profiles) {
        const profileBills = await getBills(profile.id);
        allBills = [...allBills, ...profileBills];
      }
      setBills(allBills);
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <div className="px-4 sm:px-0 min-h-[84vh] grid place-items-center">
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

  if (!profiles.length) {
    return (
      <>
        <div className="px-4 sm:px-0 min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl text-center">
              You don&apos;t have any profiles yet. Please create a profile first.
            </p>
            <Button type="primary" size="large" href="/profiles">
              Create Profile
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="px-4 sm:px-0 container mx-auto min-h-[84vh] py-20">
        <h1 className="text-3xl font-medium mb-6">
          Add a new bill or edit the existing ones
        </h1>
        <div className="flex flex-col gap-6">
          {profiles.map((profile) => (
            <div key={profile.id}>
              <h2 className="text-2xl font-semibold mb-4">
                Bills for {profile.name}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {bills &&
                  bills.map((bill: BillType) => {
                    if (bill.profile_id === profile.id) {
                      return (
                        <Bill bill={bill} key={bill.id} onChange={fetchBills} />
                      );
                    }
                  })}
                <CreateBill profileId={profile.id} onChange={fetchBills} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Bills;
