"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SearchType = "name" | "code";

type SearchBarProps = {
  value: string;
  onValueChange: (value: string) => void;
  searchType: SearchType;
  onSearchTypeChange: (type: SearchType) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
  namePlaceholder: string;
  codePlaceholder: string;
  submitLabel?: string;
  className?: string;
  inputWrapperClassName?: string;
  submitButtonClassName?: string;
  activeOptionClassName?: string;
};

export default function SearchBar({
  value,
  onValueChange,
  searchType,
  onSearchTypeChange,
  onSubmit,
  onClear,
  namePlaceholder,
  codePlaceholder,
  submitLabel = "Search",
  className,
  inputWrapperClassName,
  submitButtonClassName,
  activeOptionClassName,
}: SearchBarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <form onSubmit={onSubmit} className={className}>
      <div className="flex flex-col md:flex-row gap-3">
        <div
          className={cn(
            "flex-1 flex items-center bg-white rounded-3xl border border-gray-200 shadow-sm transition-all p-1.5 min-w-0",
            inputWrapperClassName,
          )}
        >
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 transition-all min-w-20 justify-between"
            >
              {searchType === "name" ? "Name" : "Code"}
              <motion.div
                animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="text-gray-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 5, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full left-0 z-50 mt-1 w-32 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => {
                      onSearchTypeChange("name");
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-gray-50 text-gray-600",
                      searchType === "name" &&
                        cn(
                          "bg-emerald-50 text-emerald-600",
                          activeOptionClassName,
                        ),
                    )}
                  >
                    Name
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSearchTypeChange("code");
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-4 py-3 text-sm font-bold transition-colors hover:bg-gray-50 text-gray-600",
                      searchType === "code" &&
                        cn(
                          "bg-emerald-50 text-emerald-600",
                          activeOptionClassName,
                        ),
                    )}
                  >
                    Code
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 flex items-center px-4 gap-3">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              value={value}
              onChange={(e) => onValueChange(e.target.value)}
              placeholder={
                searchType === "name" ? namePlaceholder : codePlaceholder
              }
              className="flex-1 text-sm outline-none text-gray-800 bg-transparent placeholder-gray-400"
            />
            {value && (
              <button
                type="button"
                onClick={onClear}
                className="p-1 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        <button
          type="submit"
          className={cn(
            "px-10 py-4 text-white text-sm font-bold rounded-3xl transition-all active:scale-95 shrink-0",
            submitButtonClassName,
          )}
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
