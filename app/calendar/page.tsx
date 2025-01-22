// app/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import { BillInstanceType } from "@/types/bill-instance";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "antd";
import { useSearchParams, useRouter } from "next/navigation";

function Dashboard() {
  const [billInstances, setBillInstances] = useState<BillInstanceType[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  // Get the month from the URL or default to the current month
  const monthParam = searchParams.get("month");
  let initialDate = new Date(); // Default to current month

  if (monthParam) {
    const [year, month] = monthParam.split("-").map(Number);
    initialDate = new Date(year, month - 1); // Subtract 1 to make it zero-based
  }

  const [currentDate, setCurrentDate] = useState(initialDate);

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
    fetchBillInstances(currentDate);
  }, [currentDate]);

  const handleMonthChange = (newDate: Date) => {
    // Convert zero-based month to one-based
    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1; // Add 1 to make it one-based
    const newMonth = `${year}-${String(month).padStart(2, "0")}`; // Format as YYYY-MM
    router.push(`/calendar?month=${newMonth}`);
    setCurrentDate(newDate);
  };

  async function fetchBillInstances(month: Date) {
    try {
      // Fetch bill instances for the specified month
      const startOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
      const endOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("bill_instances")
        .select("*")
        .gte("due_date", startOfMonth.toISOString())
        .lte("due_date", endOfMonth.toISOString());

      if (error) throw error;
      setBillInstances(data);
    } catch (error) {
      console.error("Error fetching bill instances:", error);
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[84vh] grid place-items-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <p className="text-xl">You have to be signed in to view this page.</p>
          <Button type="primary" size="large" href="/login">
            Log In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 md:p-10">
      <Calendar
        billInstances={billInstances}
        currentDate={currentDate}
        onChange={() => fetchBillInstances(currentDate)}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}

export default Dashboard;
