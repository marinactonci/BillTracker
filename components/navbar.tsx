"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { signOut, getCurrentUser } from "@/utils/authUtils";
import {
  MenuOutlined,
  PoweroffOutlined,
  UserOutlined,
} from "@ant-design/icons";
import Image from "next/image";
import { Button, Drawer } from "antd";
import { UserType } from "@/types/user";

function Navbar() {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const links = [
    { name: "Home", to: "/" },
    { name: "Dashboard", to: "/dashboard" },
    { name: "Calendar", to: "/calendar" },
    { name: "Profiles", to: "/profiles" },
    { name: "Bills", to: "/bills" },
  ];

  useEffect(() => {
    const checkUser = async () => {
      try {
        setIsLoading(true);
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setIsLoggedIn(!!session);

        if (session) {
          const user = await getCurrentUser();
          if (user) {
            setUser({
              id: user.id,
              email: user.email ? user.email : "",
              full_name: user.user_metadata?.full_name || "",
              created_at: new Date(user.created_at),
            });
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
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
    <>
      <nav className="flex items-center justify-between px-6 border-b h-[8vh]">
        <Link href="/" className="flex gap-3 items-center">
          <Image
            src="/logo.svg"
            alt=""
            className="w-8 h-8 hover:scale-110 transform transition duration-300 ease-in-out"
            width={32}
            height={32}
          />
          <div className="hidden sm:block text-2xl hover:text-blue-300 transition-colors">
            Bill Tracker
          </div>
        </Link>
        <div className="hidden sm:flex gap-8 items-center">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.to}
              className={`transition-colors hover:text-blue-300 ${
                pathname.endsWith(link.to) ||
                (link.to === "/" && (pathname === "/en" || pathname === "/hr"))
                  ? "text-blue-600 font-bold"
                  : "text-gray-800"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {isLoggedIn && !isLoading ? (
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
                      {user?.full_name || user?.email || "Loading..."}
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
              Login
            </Button>
          )}
        </div>
        <div className="flex sm:hidden items-center gap-4">
          <Button onClick={() => setOpen(true)}>
            <MenuOutlined />
          </Button>
        </div>
      </nav>

      <Drawer
        title="Navigation Menu"
        onClose={() => setOpen(false)}
        open={open}
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-8 items-center text-xl">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.to}
                className={`transition-colors hover:text-blue-300 ${
                  pathname.endsWith(link.to) ||
                  (link.to === "/" &&
                    (pathname === "/en" || pathname === "/hr"))
                    ? "text-blue-600 font-bold"
                    : "text-gray-800"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>
          {isLoggedIn && !isLoading ? (
            <div className="flex justify-center">
              <Button type="primary" size="large" onClick={handleSignout}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex justify-center">
              <Button type="primary" size="large" href="/login">
                Login
              </Button>
            </div>
          )}
        </div>
      </Drawer>
    </>
  );
}

export default Navbar;
