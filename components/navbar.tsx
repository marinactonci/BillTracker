"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { signOut, getCurrentUser } from "@/utils/authUtils";
import {
  CaretDownOutlined,
  PoweroffOutlined,
  SettingOutlined,
  TranslationOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Button } from "antd";
import { UserType } from "@/types/user";

function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Home", to: "/" },
    { name: "Calendar", to: "/calendar" },
    { name: "Profiles", to: "/profiles" },
    { name: "Bills", to: "/bills" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
      const user = await getCurrentUser();
      if (user) {
        setUser({
          id: user.id,
          email: user.email ? user.email : "",
          full_name: user.user_metadata?.full_name || "",
          created_at: new Date(user.created_at),
        });
      } else {
        setUser(null);
      }
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
        <Image
          src="/logo.svg"
          alt=""
          className="w-8 h-8 hover:scale-110 transform transition duration-300 ease-in-out"
          width={32}
          height={32}
        />
        <div className="text-2xl hover:text-blue-300 transition-colors">
          Bill Tracker
        </div>
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
            <div className="flex items-center gap-2 hover:text-blue-300 transition-colors">
              <TranslationOutlined style={{ fontSize: "24px" }} />
              <CaretDownOutlined />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 w-[125px] shadow bg-base-100 rounded-box"
          >
            <li>
              <a className="flex items-center gap-2">
                <Image
                  src="/flags/hr.png"
                  alt="Croatian flag icon"
                  width={15}
                  height={15}
                />
                <span>Croatian</span>
              </a>
            </li>
            <li>
              <a className="flex items-center gap-2">
                <Image
                  src="/flags/en.png"
                  alt="English flag icon"
                  width={15}
                  height={15}
                />
                <span>English</span>
              </a>
            </li>
          </ul>
        </div>

        {isLoggedIn ? (
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="w-auto cursor-pointer">
              <div className="grid place-items-center w-12 h-12 rounded-full bg-blue-600 group hover:bg-blue-300 transition-colors">
                <UserOutlined
                  className="group-hover:scale-125 transition-transform"
                  style={{ fontSize: "24px", color: "white" }}
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box"
            >
              <li>
                <div className="flex items-center gap-2">
                  <UserOutlined />
                  <Link href="#" className="whitespace-nowrap">
                    {user?.full_name ? user.full_name : user?.email}
                  </Link>
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
          <Button type="primary" size="large" href="/login">
            Log In
          </Button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
