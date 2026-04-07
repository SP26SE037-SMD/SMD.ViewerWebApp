import { SubjectDetailType } from "@/schemaValidations/subject.schema";

export type SyllabusDetail = {
  syllabusId: string;
  syllabusCode: string;
  syllabusName: string;
  englishName: string;
  noCredit: number;
  degreeLevel: string;
  timeAllocation: string;
  preRequisite: string;
  description: string;
  studentTasks: string;
  tools: string;
  scoringScale: number;
  decisionNo: string;
  isApproved: boolean;
  note: string;
  minAvgMarkToPass: number;
  isActive: boolean;
  approvedDate: string;
  materials: Material[];
  learningObjectives: LearningObjective[];
  sessions: Session[];
  constructiveQuestions: ConstructiveQuestion[];
  assessments: Assessment[];
  chapterMaterials?: {
    chapterId: string;
    chapterName: string;
    blocks: {
      id: string;
      type:
        | "H1"
        | "H2"
        | "PARAGRAPH"
        | "ORDERED_LIST"
        | "BULLET_LIST"
        | "CODE_BLOCK"
        | "QUOTE"
        | "TABLE"
        | "DIVIDER"
        | "IMAGE";
      content: string;
    }[];
  }[];
};

export type Material = {
  isMainMaterial?: boolean;
  isOnline?: boolean;
  description?: string;
  author?: string;
  isbn?: string;
  edition?: string;
  publisher?: string;
};

export type LearningObjective = {
  name: string;
  detail: string;
};

export type Session = {
  sessionNo: number;
  topic: string;
  type: string;
  lo: string;
  studentTasks: string;
};

export type ConstructiveQuestion = {
  sessionNo: number;
  name: string;
  details: string;
};

export type Assessment = {
  weight: string;
  category: string;
  part: number;
  type: string;
  duration: string;
  completionCriteria: string;
  questionType: string;
  noQuestion: string;
  gradingGuide: string;
};

export type TabId =
  | "general"
  | "sources"
  | "clos"
  | "sessions"
  | "chapterMaterials"
  | "questions"
  | "assessments";

export type SubjectDetailData = SubjectDetailType;
