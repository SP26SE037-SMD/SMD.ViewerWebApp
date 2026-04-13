import { BookOpen, Map, Milestone, GraduationCap } from "lucide-react";

export const homeItems = [
  {
    id: 1,
    title: "Syllabus",
    desc: "Detailed step-by-step guide in the training program.",
    icon: BookOpen,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/syllabus",
  },
  {
    id: 2,
    title: "Curriculum",
    desc: "View the entire roadmap and key milestones by semester.",
    icon: Milestone,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/curriculum",
  },
  {
    id: 3,
    title: "Learning Path",
    desc: "Check mandatory subjects that must be completed first.",
    icon: Map,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/learning-path",
  },
  {
    id: 4,
    title: "Is Pre-Requisite",
    desc: "Explore that subject is the pre-requisite of which subjects.",
    icon: GraduationCap,
    bg: "bg-white",
    iconBg: "bg-[#6AB04C]",
    path: "/pre-requisite",
  },
];
