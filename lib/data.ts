import { BookOpen, Map, Milestone, GraduationCap } from "lucide-react";

export const homeItems = [
  {
    id: 1,
    title: "View Syllabus",
    desc: "Explore a clearly structured learning path for your major.",
    icon: BookOpen,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/syllabus",
  },
  {
    id: 2,
    title: "Curriculum",
    desc: "Detailed step-by-step guide in the training program.",
    icon: Milestone,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/curriculum",
  },
  {
    id: 3,
    title: "Learning Path",
    desc: "View the entire roadmap and key milestones by semester.",
    icon: Map,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/learning-path",
  },
  {
    id: 4,
    title: "Pre-requisite",
    desc: "Check mandatory subjects that must be completed first.",
    icon: GraduationCap,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/pre-requisite",
  },
];
