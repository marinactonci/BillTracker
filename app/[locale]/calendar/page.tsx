"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import { getBillInstances } from "@/utils/supabaseUtils";
import { BillInstanceType } from "@/types/bill-instance";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "antd";
import { useTranslations } from "next-intl";

function Dashboard() {
  const [billInstances, setBillInstances] = useState<BillInstanceType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const t = useTranslations("calendar");

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
              {t("you_have_to_login")}
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
    <div className="flex flex-col items-center p-4 md:p-10">
      <Calendar billInstances={billInstances} onChange={fetchBillInstances} />
    </div>
  );
}

export default Dashboard;
