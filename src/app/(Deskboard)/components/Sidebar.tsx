"use client";

import { useAuth } from "@/context/AuthContext";
import { Bell, Home, MessageSquare, LogOut, User, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import React from "react";

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/chat", icon: MessageSquare, label: "Chat" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/profile", icon: User, label: "Profile" },
];

const Sidebar = () => {
  const { user } = useAuth();
  const pathname = usePathname();
  const userImage = user?.image || "/Animation - 1742373757643.gif";

  return (
    <aside className="bg-[#f3f3f2] p-6 w-28 h-screen flex flex-col items-center shadow-md">
      {/* Top Section: Profile Image & Navigation */}
      <div className="flex flex-col items-center gap-8 w-full">
        {/* User Profile Image */}
        <div className="relative">
          <Image
            src={userImage}
            width={80}
            height={80}
            className="rounded-xl border-2 border-gray-300"
            alt="User profile picture"
            priority
          />
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col items-center gap-6 w-full">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;

            return (
              <Link key={href} href={href} passHref>
                <div
                  title={label}
                  className={`w-12 h-12 flex items-center justify-center rounded-lg transition-colors ${isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:text-black"
                    }`}
                >
                  <Icon className="w-7 h-7" />
                </div>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Logout Button */}
      <button
        onClick={() => signOut({ redirect: true, callbackUrl: "/login" })}
        className="mt-auto w-12 h-12 flex items-center justify-center rounded-lg text-red-600 hover:bg-red-200 transition-colors"
        aria-label="Logout"
      >
        <LogOut className="w-7 h-7" />
      </button>
    </aside>
  );
};

export default Sidebar;