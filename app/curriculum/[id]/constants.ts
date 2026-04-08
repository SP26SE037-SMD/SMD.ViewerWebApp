import { Globe, Info, Layers } from "lucide-react";
import { TabKey } from "./types";

export const TABS: { key: TabKey; label: string; icon: typeof Info }[] = [
  { key: "general", label: "General", icon: Info },
  { key: "plos", label: "PLOs", icon: Globe },
  { key: "subjects", label: "Subjects", icon: Layers },
];
