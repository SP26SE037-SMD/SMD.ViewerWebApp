import PreRequisiteContent from "@/app/pre-requisite/pre-requisite";
import { Suspense } from "react";

export const metadata = {
  title: "Pre-Requisite | SMD",
  description: "Explore the pre-requisites here.",
};

export default function PreRequisitePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#4caf50]" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      }
    >
      <PreRequisiteContent />
    </Suspense>
  );
}
