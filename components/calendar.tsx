// app/calendar/page.tsx
"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { CaretLeftFilled, CaretRightFilled } from "@ant-design/icons";
import { Button } from "antd";
import { BillInstanceType } from "@/types/bill-instance";
import CreateBillInstance from "./create-bill-instance";
import BillInstance from "./bill-instance";
import { EventType } from "@/types/event";
import { supabase } from "@/lib/supabaseClient";

interface CalendarProps {
  billInstances: BillInstanceType[];
  currentDate: Date;
  onChange: () => void;
  onMonthChange: (newDate: Date) => void;
}

const Calendar = ({
  billInstances,
  currentDate,
  onChange,
  onMonthChange,
}: CalendarProps) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [bills, setBills] = useState<
    { id: number; name: string; profile_id: number }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [skeletonDays, setSkeletonDays] = useState<number[]>([]);

  const selectedDateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      addSkeletonDays();

      // Fetch all data in parallel
      await Promise.all([fetchEventDetails(), fetchBills()]);

      setIsLoading(false);
    };

    fetchData();
  }, [billInstances]);

  const addSkeletonDays = () => {
    const daysInCurrentMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    // Generate random days for skeleton loading (e.g., ~30% of the days)
    const newSkeletonDays = Array.from(
      { length: daysInCurrentMonth },
      (_, i) => i + 1
    ).filter(
      () => Math.random() < 0.15 // Adjust the probability as needed
    );

    // Update the skeletonDays state
    setSkeletonDays((prevSkeletonDays) => [
      ...prevSkeletonDays,
      ...newSkeletonDays,
    ]);
  };

  const fetchEventDetails = async () => {
    try {
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*");
      if (billsError) throw billsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*");
      if (profilesError) throw profilesError;

      const enhancedEvents = billInstances.map((instance) => {
        const bill = billsData.find((b) => b.id === instance.bill_id);
        const profile = profilesData.find((p) => p.id === bill?.profile_id);
        return {
          id: instance.id,
          month: new Date(instance.month),
          dueDate: new Date(instance.due_date),
          billName: bill?.name || "",
          profileName: profile?.name || "",
          amount: instance.amount,
          isPaid: instance.is_paid,
          description: instance.description,
        };
      });

      setEvents(enhancedEvents);
    } catch (error) {
      console.error("Error fetching event details:", error);
    }
  };

  const fetchBills = async () => {
    try {
      const { data: billsData, error: billsError } = await supabase
        .from("bills")
        .select("*");
      if (billsError) throw billsError;

      setBills(
        billsData.map((bill) => ({
          id: bill.id,
          name: bill.name,
          profile_id: bill.profile_id,
        }))
      );
    } catch (error) {
      console.error("Error fetching bills:", error);
    }
  };

  const prevMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - 1,
      1
    );
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      1
    );
    onMonthChange(newDate);
  };

  const goToToday = () => {
    const today = new Date();
    onMonthChange(today);
  };

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setTimeout(() => {
      selectedDateRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const renderCalendar = () => {
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);
    const rows = [];
    let cells = [];

    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const adjustedStartDay = startDay === 0 ? 6 : startDay - 1;

    const prevMonthDays = daysInMonth(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    for (let i = adjustedStartDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      cells.push(
        <td
          key={`prev-${day}`}
          className="border border-gray-200 p-1 text-gray-400 align-top"
        >
          <div className="h-full flex flex-col">
            <div className="font-semibold text-sm">{day}</div>
          </div>
        </td>
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dayEvents = events.filter(
        (event) =>
          event.dueDate.getDate() === day &&
          event.dueDate.getMonth() === currentDate.getMonth() &&
          event.dueDate.getFullYear() === currentDate.getFullYear()
      );

      cells.push(
        <td
          key={day}
          className={`border md:h-32 border-gray-200 p-1 align-top ${
            isToday(date) ? "bg-blue-50" : ""
          }`}
          onClick={() => handleSelectDate(date)}
        >
          <div className="h-full flex flex-col">
            <div
              className={`font-semibold text-sm ${
                isToday(date) ? "text-blue-600" : ""
              }`}
            >
              {day}
            </div>
            <div className="md:hidden flex items-center flex-wrap gap-2 mt-1">
              {dayEvents.map((event, index) => (
                <div
                  className={` w-2 h-2 rounded-full ${
                    event.isPaid ? "bg-green-600" : "bg-red-600"
                  }`}
                  key={index}
                ></div>
              ))}
            </div>
            {isLoading ? (
              skeletonDays.includes(day) && (
                <div className="flex w-full flex-col gap-4">
                  <div className="skeleton h-4 w-1/3"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              )
            ) : (
              <div className="hidden md:grid grid-cols-1 gap-2 mt-1">
                {dayEvents.map((event, index) => (
                  <BillInstance event={event} onChange={onChange} key={index} />
                ))}
              </div>
            )}
          </div>
        </td>
      );

      if (cells.length === 7) {
        rows.push(
          <tr key={day} className="h-24">
            {cells}
          </tr>
        );
        cells = [];
      }
    }

    const remainingCells = 7 - cells.length;
    for (let i = 1; i <= remainingCells; i++) {
      cells.push(
        <td
          key={`next-${i}`}
          className="border border-gray-200 p-1 text-gray-400 align-top"
        >
          <div className="h-full flex flex-col">
            <div className="font-semibold text-sm">{i}</div>
          </div>
        </td>
      );
    }
    if (cells.length > 0) {
      rows.push(
        <tr key="last" className="h-24">
          {cells}
        </tr>
      );
    }

    return (
      <div className="flex flex-col gap-6 h-full">
        <div>
          <div className="flex justify-between items-center mb-4 py-2 border-b border-gray-200">
            <h2 className="text-xl font-bold">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <CaretLeftFilled />
              </button>
              <Button className="hidden md:block" onClick={goToToday}>
                Today
              </Button>
              <button
                onClick={nextMonth}
                className="p-1 rounded hover:bg-gray-100"
              >
                <CaretRightFilled />
              </button>
              <CreateBillInstance bills={bills} onChange={onChange} />
            </div>
          </div>
          <table className="w-full border-collapse table-fixed">
            <thead>
              <tr className="hidden md:table-row w-full">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day, index) => (
                  <th
                    key={index}
                    className="border border-gray-200 p-1 text-left text-lg font-bold text-gray-500"
                  >
                    {day}
                  </th>
                ))}
              </tr>
              <tr className="md:hidden">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
                  <th
                    key={index}
                    className="border border-gray-200 p-1 text-left text-lg font-bold text-gray-500"
                  >
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
        {selectedDate && (
          <div
            className="md:hidden bg-gray-100 border p-4 mt-4"
            ref={selectedDateRef}
          >
            <div className="font-bold mb-2">{selectedDate.toDateString()}</div>
            <div className="grid grid-cols-1 gap-2">
              {events
                .filter((event) =>
                  isSameDate(new Date(event.dueDate), selectedDate)
                )
                .map((event, index) => (
                  <BillInstance event={event} onChange={onChange} key={index} />
                ))}
              {events.filter((event) =>
                isSameDate(new Date(event.dueDate), selectedDate)
              ).length === 0 && (
                <div className="text-gray-500 italic">
                  No bill instances for this date.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="w-full min-h-screen p-4 bg-white">{renderCalendar()}</div>
    </Suspense>
  );
};

export default Calendar;
