import WishlistContent from "@/app/wishlist/wishlist";
import { Suspense } from "react";

export const metadata = {
  title: "Wishlist | SMD",
  description: "Explore the wishlist here.",
};

export default function WishlistPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6AB04C]" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      }
    >
      <WishlistContent />
    </Suspense>
  );
}
