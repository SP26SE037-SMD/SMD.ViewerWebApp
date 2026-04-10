"use client";

import { Bell, Mail, ShieldCheck, User, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import type { AccountMeResType } from "@/schemaValidations/account.schema";
import ButtonLogout from "./button-logout";
import { useSelector } from "react-redux";
import type { RootState } from "@/provider/store";

type Props = {
  account: AccountMeResType["data"] | null;
};

export default function HeaderClient({ account }: Props) {
  const reduxUser = useSelector((state: RootState) => state.user.user);

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const avatarUrl = isMounted
    ? reduxUser?.avatarUrl || account?.avatarUrl
    : account?.avatarUrl;
  const fullName = isMounted
    ? reduxUser?.fullName || account?.fullName || "User"
    : account?.fullName || "User";
  const email = isMounted
    ? reduxUser?.email || account?.email || ""
    : account?.email || "";
  const roleName = isMounted
    ? (typeof reduxUser?.role === "string"
        ? reduxUser.role
        : reduxUser?.role?.roleName) ||
      account?.role?.roleName ||
      "GUEST"
    : account?.role?.roleName || "GUEST";

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/home" className="relative h-9 w-28 shrink-0">
          <Image
            src="/smd-with-name.png"
            alt="SMD Logo"
            fill
            priority
            className="object-contain"
          />
        </Link>

        {/* Title */}
        <div className="hidden sm:block absolute left-1/2 -translate-x-1/2">
          <p className="font-[Bricolage_Grotesque] text-xl font-bold text-gray-800">
            Syllabus <span className="text-[#6AB04C]">System</span>
          </p>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Notification */}
          <button className="relative p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors">
            <Bell size={20} strokeWidth={1.7} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white" />
          </button>

          {/* Account */}
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="flex items-center gap-2.5 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 px-3 py-2 transition-all active:scale-95">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#6AB04C] text-white text-sm font-bold shrink-0">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      width={32}
                      height={32}
                      className="rounded-xl object-cover"
                    />
                  ) : (
                    <span>{initials}</span>
                  )}
                </div>
                <div className="hidden md:flex flex-col items-start">
                  <span className="text-sm font-semibold text-gray-800 leading-none">
                    {fullName.split(" ").pop()}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 font-medium">
                    {roleName}
                  </span>
                </div>
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content sideOffset={8} align="end" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="z-100 w-72 rounded-3xl bg-white border border-gray-100 shadow-2xl overflow-hidden"
                >
                  {/* User info header */}
                  <div className="px-5 py-5 bg-linear-to-br from-[#EBF5E4] to-[#f8faf7] border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#6AB04C] text-white text-xl font-bold shadow-sm">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={fullName}
                            width={56}
                            height={56}
                            className="rounded-2xl object-cover"
                          />
                        ) : (
                          <span>{initials}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-base truncate">
                          {fullName}
                        </p>
                        {email && (
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 truncate">
                            <Mail size={11} />
                            {email}
                          </p>
                        )}
                        <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full bg-[#6AB04C]/15 text-[#3D6B2C] text-[10px] font-bold">
                          <ShieldCheck size={10} />
                          {roleName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-2">
                    <ButtonLogout className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                      <LogOut size={17} />
                      Log out
                    </ButtonLogout>
                  </div>

                  <Popover.Arrow className="fill-white" />
                </motion.div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
    </nav>
  );
}
