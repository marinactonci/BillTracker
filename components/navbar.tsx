"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { signOut } from "@/utils/authUtils";
import {
  CaretDownOutlined,
  PoweroffOutlined,
  SettingOutlined,
  TranslationOutlined,
  UserOutlined,
} from "@ant-design/icons";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Profiles", to: "/profiles" },
    { name: "Bills", to: "/bills" },
    { name: "Months", to: "/months" },
    { name: "Settings", to: "/settings" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignout = async () => {
    try {
      await signOut();
      setIsLoggedIn(false);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 border-b h-[8vh]">
      <Link href="/" className="flex gap-3 items-center">
        <img
          src="/logo.svg"
          alt=""
          className="w-8 h-8 hover:scale-110 transform transition duration-300 ease-in-out"
        />
        <div className="text-2xl transition-colors">Bill Tracker</div>
      </Link>
      <div className="flex gap-8 items-center">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.to}
            className={`transition-colors hover:text-blue-300 ${
              pathname === link.to ? "text-blue-600 font-bold" : "text-gray-800"
            }`}
          >
            {link.name}
          </Link>
        ))}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="w-auto cursor-pointer">
            <div className="flex items-center gap-2 w-max">
              <TranslationOutlined style={{ fontSize: "24px" }} />
              <CaretDownOutlined />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
          >
            <li>
              <a>Croatian</a>
            </li>
            <li>
              <a>English</a>
            </li>
          </ul>
        </div>

        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="w-auto cursor-pointer">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-black group hover:bg-gray-900 transition-colors">
                <UserOutlined
                  className="group-hover:scale-125 transition-transform"
                  style={{ fontSize: "24px", color: "white" }}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content w-auto menu p-2 shadow bg-base-100 rounded-box"
            >
              <li>
                <div className="flex items-center gap-2">
                  <SettingOutlined />
                  <Link href="/settings">Settings</Link>
                </div>
              </li>
              <li onClick={handleSignout}>
                <div className="flex items-center gap-2">
                  <PoweroffOutlined />
                  <a className="whitespace-nowrap">Sign Out</a>
                </div>
              </li>
            </ul>
          </div>
        ) : (
          <Link
            className="w-full p-2 bg-black border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-900 active:bg-gray-700 focus:outline-none focus:border-gray-700 focus:ring ring-gray-300 disabled:opacity-25 transition ease-in-out duration-150"
            href="/login"
          >
            Log In
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;