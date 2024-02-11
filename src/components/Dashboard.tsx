import React, { useEffect, useState } from "react";
import { auth } from "../services/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { DatePicker, Select, Tooltip } from "antd";
import dayjs from "dayjs";
import { getProfiles } from "../services/firebaseFirestore";
import { CheckSquareOutlined, EditOutlined } from "@ant-design/icons";

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const navigator = useNavigate();

  const [month, setMonth] = useState(dayjs().format("MM.YYYY"));
  const [profiles, setProfiles] = useState([] as any);
  const [selectedProfile, setSelectedProfile] = useState(null as any);
  const [bills, setBills] = useState([] as any);

  useEffect(() => {
    const listener = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setIsLoggedIn(true);
        const response = await getProfiles(user.uid);
        setProfiles(response);
        setSelectedProfile(response[0]);
        getBills(response[0], month);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

  const calculateTotalExpenses = (month) => {
    let total = 0;
    for (let profile of profiles) {
      for (let bill of profile.bills) {
        for (let item of bill.items) {
          if (item.month === month) {
            total += item.amount;
          }
        }
      }
    }
    return total;
  };

  const calculateDifference = () => {
    const lastMonth = dayjs(month, "MM.YYYY")
      .subtract(1, "month")
      .format("MM.YYYY");
    const lastMonthTotal = calculateTotalExpenses(lastMonth);
    if (lastMonthTotal === 0) return 0;
    const currentMonthTotal = calculateTotalExpenses(month);
    console.log(
      lastMonthTotal,
      currentMonthTotal,
      ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    );
    return ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
  };

  const countDueBills = () => {
    let counter = 0;
    for (let profile of profiles) {
      for (let bill of profile.bills) {
        for (let item of bill.items) {
          if (!item.isPaid && item.dueDate < dayjs().format("DD.MM.YYYY.")) {
            counter++;
          }
        }
      }
    }
    return counter;
  };

  const countOverdueBills = () => {
    let counter = 0;
    for (let profile of profiles) {
      for (let bill of profile.bills) {
        for (let item of bill.items) {
          if (!item.isPaid && item.dueDate > dayjs().format("DD.MM.YYYY.")) {
            counter++;
          }
        }
      }
    }
    return counter;
  };

  const handleChangeProfile = async (value) => {
    setBills([]);
    if (!value) return;
    const profile = await profiles.find((profile) => profile.name === value);
    setSelectedProfile(profile);
    getBills(profile, month);
  };

  const handleChangeMonth = (value) => {
    setBills([]);
    if (!value) return;
    setMonth(value.format("MM.YYYY"));
    getBills(selectedProfile, value.format("MM.YYYY"));
  };

  const getBills = (profile, month) => {
    if (profile.bills && profile.bills.length) {
      for (let bill of profile.bills) {
        for (let item of bill.items) {
          if (item.month === month && !bills.includes(item)) {
            item.name = bill.name;
            setBills((prev) => [...prev, item]);
          }
        }
      }
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
            <button
              className="p-2 bg-black border border-transparent rounded-md font-semibold text-sm text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
              onClick={() => navigator("/login")}
            >
              Log In
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="container mx-auto flex flex-col gap-10 min-h-[84vh]">
        <div className="grid gap-4 grid-cols-3 mt-16">
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">
                Total Expenses for {month}
              </h1>
              <i className="fa-solid fa-dollar-sign text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {calculateTotalExpenses(month)} €
              </div>
              {calculateDifference() !== 0 && (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {calculateDifference() > 0
                    ? `+${calculateDifference()}`
                    : calculateDifference()}
                  {"% "}
                  from last month
                </p>
              )}
            </div>
          </div>
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">Bills Due</h1>
              <i className="fa-regular fa-calendar text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">{countDueBills()}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Total ammount of due bills
              </p>
            </div>
          </div>
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">Unpaid Bills</h1>
              <i className="fa-solid fa-circle-exclamation text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">{countOverdueBills()}</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Overdue bills
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex gap-3 items-center">
            {selectedProfile && (
              <Select
                style={{ width: 120 }}
                defaultValue={{
                  value: selectedProfile?.name,
                  label: selectedProfile?.name,
                }}
                options={profiles.map((profile) => ({
                  value: profile.name,
                  label: profile.name,
                }))}
                onChange={(value) => handleChangeProfile(value)}
              />
            )}
            <DatePicker
              picker="month"
              format={"MM.YYYY."}
              defaultValue={dayjs(month, "MM.YYYY")}
              onChange={(value) => handleChangeMonth(value)}
            />
          </div>
          <div className="overflow-x-auto border-2 rounded-lg mt-3">
            <table className="table">
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Due Date</th>
                  <th>Ammount</th>
                  <th>For Month</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.length > 0 ? (
                  bills.map((bill, index) => (
                    <tr className="hover" key={index}>
                      <th>{bill.name}</th>
                      <td>{bill.dueDate}</td>
                      <td>{bill.amount}</td>
                      <td>{bill.month}</td>

                      {bill.isPaid ? (
                        <td>
                          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-500" />
                          <span>Paid</span>
                        </td>
                      ) : bill.dueDate < dayjs().format("DD.MM.YYYY") ? (
                        <td>
                          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-red-500" />
                          <span>Overdue</span>
                        </td>
                      ) : (
                        <td>
                          <span className="inline-block w-3 h-3 mr-2 rounded-full bg-yellow-500" />
                          <span>Unpaid</span>
                        </td>
                      )}
                      <td className="flex gap-3 items-center">
                        <Tooltip title="Edit bill">
                          <button>
                            <EditOutlined />
                          </button>
                        </Tooltip>
                        <Tooltip title="Mark as paid">
                          <button>
                            <CheckSquareOutlined />
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">
                      No bills for this month
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
