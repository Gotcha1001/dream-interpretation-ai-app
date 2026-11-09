"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUserContext } from "../context/UserContext";
import { ThemeToggle } from "./ThemeToggle";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Navbar() {
  return (
    <motion.nav
      className="flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-gradient-to-r dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 border-accent-400/25 dark:border-accent-400/20 shadow-[0_0_24px_-10px_color-mix(in_srgb,var(--accent-400)_30%,transparent)]"
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <SidebarTrigger className="md:hidden mr-2" />
      <Link
        href="/"
        className="text-xl font-black text-black dark:text-white tracking-tight"
      >
        🌙{" "}
        <span className="text-accent-500 [filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--accent-400)_40%,transparent))]">
          DREAM
        </span>{" "}
        <span className="text-accent-400 [filter:drop-shadow(0_0_12px_color-mix(in_srgb,var(--accent-400)_40%,transparent))]">
          READER
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <SignedOut>
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="text-gray-700 dark:text-gray-200 hover:text-accent-600"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-accent-600 dark:bg-accent-700 text-white hover:bg-accent-500">
              Sign Up
            </Button>
          </Link>
        </SignedOut>
        <SignedIn>
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </SignedIn>
      </div>
    </motion.nav>
  );
}
