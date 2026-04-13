import { ChevronDown, GitMerge } from "lucide-react";
import { CurriculumGroupType } from "@/schemaValidations/curriculum.schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Props = {
  totalVisibleSubjects: number;
  totalVisibleCredits: number;
  selectedComboGroup: CurriculumGroupType | null;
  selectedComboGroupId: string | null;
  comboGroups: CurriculumGroupType[];
  onSelectDefaultSubjects: () => void;
  onSelectComboGroup: (groupId: string) => void;
  onOpenGraph: () => void;
};

export default function SubjectsTabHeader({
  totalVisibleSubjects,
  totalVisibleCredits,
  selectedComboGroup,
  selectedComboGroupId,
  comboGroups,
  onSelectDefaultSubjects,
  onSelectComboGroup,
  onOpenGraph,
}: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
      <span className="px-3 py-1 text-xs font-bold rounded-full bg-[#4caf50]/10 text-[#4caf50]">
        {totalVisibleSubjects} subjects · {totalVisibleCredits} credits
      </span>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#4caf50] text-[#4caf50] text-sm font-bold bg-white hover:bg-[#4caf50]/5 transition-all"
            >
              {selectedComboGroup ? selectedComboGroup.groupCode : "COMBO"}
              <ChevronDown size={16} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-72">
            <DropdownMenuItem
              onSelect={(event) => {
                event.preventDefault();
                onSelectDefaultSubjects();
              }}
              className="cursor-pointer"
            >
              Show default subjects
            </DropdownMenuItem>
            {comboGroups.length > 0 ? (
              comboGroups.map((group) => (
                <DropdownMenuItem
                  key={group.groupId}
                  onSelect={(event) => {
                    event.preventDefault();
                    onSelectComboGroup(group.groupId);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex w-full items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">
                        {group.groupCode}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {group.groupName}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-blue-700">
                      {selectedComboGroupId === group.groupId
                        ? "Selected"
                        : "COMBO"}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem disabled>No COMBO groups</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={onOpenGraph}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-bold shadow-sm transition-all"
        >
          <GitMerge size={16} />
          View subject graph
        </button>
      </div>
    </div>
  );
}
