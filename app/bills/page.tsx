"use client";

import React, { useState, useEffect } from "react";
import { notification } from "antd";
import { supabase } from "@/lib/supabaseClient";
import { getBills, getProfiles } from "@/utils/supabaseUtils";
import Link from "next/link";
import Bill from "@/components/bill";
import CreateBill from "@/components/create-bill";
import { ProfileType } from "@/types/profile";
import { BillType } from "@/types/bill";

function Bills() {
  const [error, setError] = useState<string | null>(null);
  const [profiles, setProfiles] = useState<ProfileType[]>([]);
  const [bills, setBills] = useState<BillType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    const initialize = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
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
        setError("An error occurred while loading data.");
      } finally {
        setIsLoading(false);
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
      setError("An error occurred while fetching bills.");
    }
  };

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
      {contextHolder}
      <div className="container mx-auto min-h-[84vh] py-20">
        <h1 className="text-3xl font-medium mb-6">
          Add a new bill or edit the existing ones
        </h1>
        <div className="flex flex-col gap-6">
          {profiles.map((profile) => (
            <div key={profile.id}>
              <h2 className="text-2xl font-semibold mb-4">
                Bills for {profile.name}
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {bills &&
                  bills.map((bill: any) => {
                    if (bill.profile_id === profile.id) {
                      return (
                        <Bill
                          profileId={profile.id}
                          bill={bill}
                          key={bill.id}
                          onChange={fetchBills}
                        />
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
