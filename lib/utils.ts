import { EntityError } from "@/lib/http";
import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item: any) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    const message =
      error?.payload?.message ?? error?.message ?? "Something went wrong.";

    toast.error(message, {
      duration: duration ?? 5000,
    });
  }
};

/**
 * Xóa đi kí tự "/" đầu tiên của Path
 */
export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};
