import { Suspense } from "react";
import CurriculumContent from "./curriculum";

export const metadata = {
  title: "Curriculum | SMD",
  description: "Explore the curricullum here.",
};

export default function CurriculumPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex flex-col items-center justify-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#3D7EE8]" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      }
    >
      <CurriculumContent />
    </Suspense>
  );
}
