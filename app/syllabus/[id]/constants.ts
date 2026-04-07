import {
  Award,
  BookOpen,
  Calendar,
  FileCheck2,
  FileText,
  HelpCircle,
  LucideIcon,
} from "lucide-react";
import { TabId } from "./types";

export const TABS: { id: TabId; label: string; icon: LucideIcon }[] = [
  { id: "general", label: "General", icon: FileText },
  { id: "sources", label: "Sources", icon: BookOpen },
  { id: "los", label: "Learning Objectives (LOs)", icon: Award },
  { id: "sessions", label: "Teaching Plan", icon: Calendar },
  { id: "chapterMaterials", label: "Course Materials", icon: BookOpen },
  { id: "questions", label: "Constructive Questions", icon: HelpCircle },
  { id: "assessments", label: "Assessments", icon: FileCheck2 },
];
