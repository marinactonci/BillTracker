"use client";

import React, { useState, useEffect } from "react";
import Calendar from "@/components/calendar";
import { getBillInstances } from "@/utils/supabaseUtils";
import { BillInstance } from "@/types/bill-instance";

function Months() {
  const [billInstances, setBillInstances] = useState<BillInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchBillInstances() {
      try {
        const instances = await getBillInstances();
        setBillInstances(instances);
      } catch (error) {
        console.error("Error fetching bill instances:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchBillInstances();
  }, []);

  return (
    <div className="flex flex-col items-center p-10">
      <Calendar billInstances={billInstances} />
    </div>
  );
}

export default Months;