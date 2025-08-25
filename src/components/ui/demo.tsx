"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { SignOutButton, useUser } from "@clerk/nextjs";

export function SidebarDemo() {
  const { user } = useUser();
  const links = [
    {
      label: "Dashboard",
      href: "/task",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "/task/profile",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "/task/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // Use full screen height for task page
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex flex-col gap-2">
              <SidebarLink
                link={{
                  label: user?.fullName || user?.firstName || "User",
                  href: "/task/profile",
                  icon: (
                    <div className="h-7 w-7 flex-shrink-0 rounded-full overflow-hidden">
                      {user?.imageUrl ? (
                        <Image
                          src={user.imageUrl}
                          className="h-7 w-7 flex-shrink-0 rounded-full object-cover"
                          width={28}
                          height={28}
                          alt="User Avatar"
                        />
                      ) : (
                        <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">
                            {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  ),
                }}
              />
              <SignOutButton>
                <div className="flex items-center justify-start gap-2 group/sidebar py-2 cursor-pointer">
                  <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <motion.span
                    animate={{
                      display: open ? "inline-block" : "none",
                      opacity: open ? 1 : 0,
                    }}
                    className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
                  >
                    Logout
                  </motion.span>
                </div>
              </SignOutButton>
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/logo.png"
        alt="Async Coder Logo"
        width={24}
        height={24}
        className="h-6 w-6 flex-shrink-0 rounded"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
      >
        Async Coder
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <Image
        src="/logo.png"
        alt="Async Coder Logo"
        width={24}
        height={24}
        className="h-6 w-6 flex-shrink-0 rounded"
      />
    </Link>
  );
};

// Dashboard component with AI coding assistant themed content
const Dashboard = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Welcome to Async Coder Dashboard
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            Your AI-powered coding assistant is ready to help you build amazing software.
          </p>
        </div>
        
        <div className="flex gap-2 mb-4">
          {[
            { title: "Active Projects", value: "3", color: "bg-blue-100 dark:bg-blue-900" },
            { title: "Code Reviews", value: "12", color: "bg-green-100 dark:bg-green-900" },
            { title: "AI Suggestions", value: "47", color: "bg-purple-100 dark:bg-purple-900" },
            { title: "Lines Generated", value: "2.1K", color: "bg-orange-100 dark:bg-orange-900" }
          ].map((stat, i) => (
            <div
              key={"stat-" + i}
              className={cn(
                "h-20 w-full rounded-lg flex flex-col justify-center items-center p-4",
                stat.color
              )}
            >
              <div className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                {stat.value}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400 text-center">
                {stat.title}
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex gap-2 flex-1">
          <div className="h-full w-2/3 rounded-lg bg-gray-100 dark:bg-neutral-800 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 flex-1">
              {[
                "Generated authentication middleware for Next.js project",
                "Reviewed pull request for API optimization",
                "Created unit tests for user service module",
                "Refactored database connection logic"
              ].map((activity, i) => (
                <div
                  key={"activity-" + i}
                  className="p-3 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600"
                >
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    {activity}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="h-full w-1/3 rounded-lg bg-gray-100 dark:bg-neutral-800 p-6 flex flex-col">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              {[
                "Start New Project",
                "Review Code",
                "Generate Tests",
                "Ask AI Assistant"
              ].map((action, i) => (
                <button
                  key={"action-" + i}
                  className="w-full p-3 bg-white dark:bg-neutral-700 rounded border border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors text-left"
                >
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {action}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};