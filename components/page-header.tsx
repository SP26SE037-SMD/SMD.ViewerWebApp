"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeaderProps = {
  title: string;
  description: string;
  icon: ReactNode;
  backHref?: string;
  backLabel?: string;
  iconContainerClassName?: string;
};

export default function PageHeader({
  title,
  description,
  icon,
  backHref = "/home",
  backLabel = "Back To Home",
  iconContainerClassName,
}: PageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href={backHref}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-5 group transition-colors"
        >
          <ArrowLeft
            size={18}
            className="group-hover:-translate-x-1 transition-transform"
          />
          {backLabel}
        </Link>
        <div className="flex items-center gap-3 mb-1">
          <div
            className={cn(
              "p-2.5 rounded-2xl bg-[#4caf50]/10",
              iconContainerClassName,
            )}
          >
            {icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-[Bricolage_Grotesque]">
              {title}
            </h1>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
