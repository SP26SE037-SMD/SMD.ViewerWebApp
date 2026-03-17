"use client";

import { Bell, Mail, ShieldCheck, User } from "lucide-react";
import Image from "next/image";
import * as Popover from "@radix-ui/react-popover";
import { motion } from "motion/react";
import type { AccountMeResType } from "@/schemaValidations/account.schema";
import ButtonLogout from "./button-logout";

type Props = {
  account: AccountMeResType["data"] | null;
};

export default function HeaderClient({ account }: Props) {
  const avatarUrl = account?.avatarUrl;
  const fullName = account?.fullName || "User";
  const email = account?.email || "No email";
  const roleName = account?.role?.roleName || "GUEST";

  return (
    <nav className="flex justify-between items-center px-6 py-4 w-full mx-auto font-sans z-50 bg-[#2D4A22] backdrop-blur-md border-b border-gray-100 sticky top-0">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center px-6">
        <div className="flex flex-1 justify-start">
          <div className="relative h-10 w-32">
            <Image
              src="/smd-with-name.png"
              alt="SMD Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
        </div>

        <div className="flex flex-1 justify-center">
          <h1 className="whitespace-nowrap font-[Bricolage_Grotesque] text-2xl font-bold tracking-tight text-[#6AB04C] sm:text-3xl">
            Syllabus
          </h1>
        </div>

        <div className="flex flex-1 items-center justify-end gap-3">
          <button className="group relative rounded-full p-2 text-white/80 transition-all hover:bg-white/10 hover:text-white">
            <Bell size={20} />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full border-2 border-[#2D4A22] bg-[#EA6227]" />
          </button>

          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 p-1 pr-3 transition-all hover:bg-white/10 active:scale-95">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#6AB04C] text-white">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt={fullName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="hidden text-sm font-medium text-white lg:block">
                  Account
                </span>
              </button>
            </Popover.Trigger>

            <Popover.Portal>
              <Popover.Content sideOffset={8} align="end" asChild>
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className="z-100 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl"
                >
                  <div className="flex flex-col items-center border-b border-gray-50 px-4 py-6 text-center">
                    <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0f7ed] text-[#3D6B2C]">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={fullName}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <User size={32} />
                      )}
                    </div>
                    <h3 className="font-[Lexend] text-base font-bold text-[#1A2E12]">
                      {fullName}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                      <Mail size={12} /> {email}
                    </p>
                  </div>

                  <div className="space-y-1 py-2">
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#5C7250] transition-colors hover:bg-[#f8faf7]">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={16} className="text-[#6AB04C]" />
                        <span>Role</span>
                      </div>
                      <span className="font-bold text-[#2D4A22]">
                        {roleName}
                      </span>
                    </div>
                  </div>

                  <div className="mt-1 border-t border-gray-50 pt-1">
                    <ButtonLogout className="flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold text-red-500 transition-colors hover:bg-red-50">
                      Sign out
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
