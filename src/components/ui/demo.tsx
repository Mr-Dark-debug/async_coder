"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Settings, 
  Search,
  ChevronDown,
  ChevronRight,
  Github,
  Clock,
  FileText,
  MessageCircle,
  Twitter,
  Lock,
  Globe
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { VercelV0Chat } from "@/components/ui/v0-ai-chat";
import sidebarData from "@/json/sidebar-data.json";

export function SidebarDemo({ children }: { children?: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecentTasksOpen, setIsRecentTasksOpen] = useState(true);
  const [isCodebasesOpen, setIsCodebasesOpen] = useState(true);
  
  const [open, setOpen] = useState(false);

  const filteredCodebases = sidebarData.codebases.filter(codebase =>
    codebase.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    codebase.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentTasks = sidebarData.recentTasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 max-w-full mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen" // Use full screen height for task page
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-4">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
            {/* Logo */}
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Search Bar */}
            <div className="mt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search for repo or tasks"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-200 text-sm placeholder-neutral-500 focus:outline-none focus:border-neutral-600"
                />
              </div>
            </div>

            {/* Main Navigation - Only Dashboard */}
            <div className="mt-6 flex flex-col gap-2">
              <SidebarLink 
                link={{
                  label: "Dashboard",
                  href: "/task",
                  icon: (
                    <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>

            {/* Recent Tasks Section */}
            <div className="mt-6">
              <button
                onClick={() => setIsRecentTasksOpen(!isRecentTasksOpen)}
                className="flex items-center justify-between w-full text-left text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <span className="text-sm font-medium">Recent tasks</span>
                {isRecentTasksOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isRecentTasksOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 space-y-1"
                >
                  {filteredRecentTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center gap-2 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer"
                    >
                      <Clock className="h-3 w-3 text-neutral-500 flex-shrink-0" />
                      <span className="text-xs text-neutral-300 truncate">
                        {task.title}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Codebases Section */}
            <div className="mt-6">
              <button
                onClick={() => setIsCodebasesOpen(!isCodebasesOpen)}
                className="flex items-center justify-between w-full text-left text-neutral-400 hover:text-neutral-200 transition-colors"
              >
                <span className="text-sm font-medium">Codebases</span>
                {isCodebasesOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {isCodebasesOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-2 space-y-1"
                >
                  {filteredCodebases.map((codebase) => (
                    <div
                      key={codebase.id}
                      className="flex items-center gap-2 p-2 hover:bg-neutral-800 rounded-lg cursor-pointer group"
                    >
                      <Github className="h-4 w-4 text-neutral-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-300 truncate">
                            {codebase.fullName}
                          </span>
                          {codebase.isPrivate && (
                            <Lock className="h-3 w-3 text-neutral-500" />
                          )}
                          {!codebase.isPrivate && (
                            <Globe className="h-3 w-3 text-neutral-500" />
                          )}
                        </div>
                      </div>
                      {codebase.hasNotifications && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0">
                          {codebase.notificationCount && (
                            <span className="sr-only">{codebase.notificationCount}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-neutral-700 pt-4">
            {/* Settings Link */}
            <div className="mb-4">
              <SidebarLink 
                link={{
                  label: "Settings",
                  href: "/task/settings",
                  icon: (
                    <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>

            {/* Daily Task Limit */}
            <div className="mb-4 px-2">
              <div className="text-xs text-neutral-400 mb-1">
                Daily task limit ({sidebarData.dailyTaskLimit.current}/{sidebarData.dailyTaskLimit.maximum})
              </div>
              <div className="w-full bg-neutral-700 rounded-full h-1">
                <div 
                  className="bg-blue-500 h-1 rounded-full transition-all"
                  style={{ 
                    width: `${(sidebarData.dailyTaskLimit.current / sidebarData.dailyTaskLimit.maximum) * 100}%` 
                  }}
                ></div>
              </div>
            </div>

            {/* Footer Links */}
            <div className="flex items-center justify-center gap-4">
              {sidebarData.footerLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className="text-neutral-400 hover:text-neutral-200 transition-colors"
                  title={link.name}
                >
                  {link.icon === 'FileText' && <FileText className="h-4 w-4" />}
                  {link.icon === 'MessageCircle' && <MessageCircle className="h-4 w-4" />}
                  {link.icon === 'Twitter' && <Twitter className="h-4 w-4" />}
                </a>
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard>{children}</Dashboard>
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

// AI Chat Dashboard component
const Dashboard = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex flex-1 items-center justify-center">
          {children || <VercelV0Chat />}
        </div>
      </div>
    </div>
  );
};