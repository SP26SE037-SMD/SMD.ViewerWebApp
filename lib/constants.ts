import {
  Award,
  BookOpen,
  Calendar,
  FileCheck2,
  FileText,
  LucideIcon,
  Globe,
  Info,
  Layers,
} from "lucide-react";
import { CurriculumTab, SyllabusTab } from "@/lib/type";

export const TabSyllabus: {
  id: SyllabusTab;
  label: string;
  icon: LucideIcon;
}[] = [
  { id: "general", label: "General", icon: FileText },
  { id: "sources", label: "Sources", icon: BookOpen },
  { id: "clos", label: "CLOs", icon: Award },
  { id: "sessions", label: "Teaching Plan", icon: Calendar },
  { id: "chapterMaterials", label: "Course Materials", icon: BookOpen },
  { id: "assessments", label: "Assessments", icon: FileCheck2 },
  { id: "compare", label: "Compare", icon: Info },
];

export const TabCurriculum: {
  key: CurriculumTab;
  label: string;
  icon: typeof Info;
}[] = [
  { key: "general", label: "General", icon: Info },
  { key: "plos", label: "PLOs", icon: Globe },
  { key: "subjects", label: "Subjects", icon: Layers },
];
