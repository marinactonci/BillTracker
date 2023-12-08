import React, { useEffect, useState } from "react";
import { auth } from "../services/firebaseAuth";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState({});
  const navigator = useNavigate();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => listener();
  }, []);

  if (!isLoggedIn) {
    return (
      <>
        <div className="min-h-[92vh] grid place-items-center">
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
      <div className="container mx-auto flex flex-col gap-10 min-h-[92vh]">
        <div className="grid gap-4 grid-cols-3 mt-16">
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">Total Expenses</h1>
              <i className="fa-solid fa-dollar-sign text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">$1,231.89</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                +10.1% from last month
              </p>
            </div>
          </div>
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">Bills Due</h1>
              <i className="fa-regular fa-calendar text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Due in the next 7 days
              </p>
            </div>
          </div>
          <div className="border-2 rounded-lg p-6">
            <div className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h1 className="text-sm font-medium">Unpaid Bills</h1>
              <i className="fa-solid fa-circle-exclamation text-zinc-500"></i>
            </div>
            <div>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Overdue bills
              </p>
            </div>
          </div>
        </div>

        <div>
          <input type="month" name="" id="" />
          <div className="overflow-x-auto border-2 rounded-lg">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Due Date</th>
                  <th>Ammount</th>
                  <th>For Month</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {/* row 1 */}
                <tr className="hover">
                  <th>Electricity</th>
                  <td>25.11.2023.</td>
                  <td>25 €</td>
                  <td>10</td>
                  <td>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full bg-green-500" />
                    <span>Paid</span>
                  </td>
                </tr>
                {/* row 2 */}
                <tr className="hover">
                  <th>Electricity</th>
                  <td>25.11.2023.</td>
                  <td>25 €</td>
                  <td>10</td>
                  <td>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full bg-orange-500" />
                    <span>Unpaid</span>
                  </td>
                </tr>
                {/* row 3 */}
                <tr className="hover">
                  <th>Electricity</th>
                  <td>25.11.2023.</td>
                  <td>25 €</td>
                  <td>10</td>
                  <td>
                    <span className="inline-block w-3 h-3 mr-2 rounded-full bg-red-500" />
                    <span>Overdue</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
