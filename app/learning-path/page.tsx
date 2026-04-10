import LearningPathContent from "@/app/learning-path/learning-path";
import { Suspense } from "react";

export const metadata = {
  title: "Learning Path | SMD",
  description: "Explore the learning path here.",
};

export default function LearningPathPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafb] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#6AB04C]" />
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      }
    >
      <LearningPathContent />
    </Suspense>
  );
}
