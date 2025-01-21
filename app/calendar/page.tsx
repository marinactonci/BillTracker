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
  const [isLoading, setIsLoading] = useState(true);

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

  async function generateMissingInstances() {
    try {
      const { data, error } = await supabase.rpc(
        "generate_missing_bill_instances"
      );

      if (error) throw error;

      if (data.inserted_count > 0) {
        console.log(
          `Generated ${data.inserted_count} new bill instances for ${data.month}`
        );
      }
    } catch (error) {
      console.error("Error generating missing bill instances:", error);
    }
  }

  async function fetchBillInstances() {
    try {
      setIsLoading(true);

      // First, generate any missing instances
      await generateMissingInstances();

      // Then fetch all instances (including newly generated ones)
      const instances = await getBillInstances();
      setBillInstances(instances);
    } catch (error) {
      console.error("Error fetching bill instances:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">
              You have to be signed in to view this page.
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
      {isLoading ? (
        <div className="min-h-[84vh] grid place-items-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-xl">Loading...</p>
          </div>
        </div>
      ) : (
        <Calendar billInstances={billInstances} onChange={fetchBillInstances} />
      )}
    </div>
  );
}

export default Dashboard;
