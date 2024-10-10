"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import { getBillInstances } from "@/utils/supabaseUtils";
import { BillInstanceType } from "@/types/bill-instance";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "antd";

function Dashboard() {
  const [billInstances, setBillInstances] = useState<BillInstanceType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);
      } catch (error) {
        console.error("Error initializing:", error);
      }
    };

    checkUser();
    fetchBillInstances();
  }, []);

  async function fetchBillInstances() {
    try {
      const instances = await getBillInstances();
      setBillInstances(instances);
    } catch (error) {
      console.error("Error fetching bill instances:", error);
    }
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">
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
    <div className="flex flex-col items-center p-4 md:p-10">
      <Calendar billInstances={billInstances} onChange={fetchBillInstances} />
    </div>
  );
}

export default Dashboard;
