import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function SectionCard({ children, className = "" }: Props) {
  return (
    <div
      className={`bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden ${className}`.trim()}
    >
      {children}
    </div>
  );
}
