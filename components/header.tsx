import { Bell, User } from "lucide-react";
import Image from "next/image";

export default function Header() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 w-full mx-auto font-sans z-50 bg-[#2D4A22] backdrop-blur-md border-b border-gray-100 sticky top-0">
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center px-6">
        {/* Logo */}
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
        {/* Title */}
        <div className="flex flex-1 justify-center">
          <h1 className="whitespace-nowrap font-[Bricolage_Grotesque] text-2xl font-bold tracking-tight text-[#6AB04C] sm:text-3xl">
            Syllabus
          </h1>
        </div>
        {/* Notification and Profile */}
        <div className="flex flex-1 justify-end items-center gap-2">
          <button className="relative p-2 text-white transition-colors hover:rounded-lg hover:bg-gray-100">
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#EA6227]" />
          </button>
          <button className="p-2 text-white transition-colors hover:rounded-lg hover:bg-gray-100">
            <User size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}
