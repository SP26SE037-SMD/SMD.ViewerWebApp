import { ReactNode } from "react";
import SectionCard from "./section-card";

type Props = {
  title: ReactNode;
  tableClassName?: string;
  children: ReactNode;
  className?: string;
};

export default function TableSection({
  title,
  tableClassName = "",
  children,
  className = "",
}: Props) {
  return (
    <SectionCard className={className}>
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table
          className={`w-full text-left border-collapse ${tableClassName}`.trim()}
        >
          {children}
        </table>
      </div>
    </SectionCard>
  );
}
