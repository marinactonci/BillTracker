"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import { getBillInstances } from "@/utils/supabaseUtils";
import { BillInstanceType } from "@/types/bill-instance";

function Dashboard() {
  const [billInstances, setBillInstances] = useState<BillInstanceType[]>([]);

  useEffect(() => {
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

  return (
    <div className="flex flex-col items-center p-10">
      <Calendar billInstances={billInstances} onChange={fetchBillInstances} />
    </div>
  );
}

export default Dashboard;