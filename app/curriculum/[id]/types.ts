export type PLO = {
  ploName: string;
  ploDescription: string;
};

export type Subject = {
  subjectCode: string;
  subjectName: string;
  semester: number;
  noCredit: number;
  preRequisite: string;
};

export type CurriculumDetail = {
  curriculumId: string;
  curriculumCode: string;
  curriculumName: string;
  englishName?: string;
  description: string;
  decisionNo?: string;
  totalCredits: number;
  totalSubjects: number;
  startYear?: number;
  status?: string;
  plos: PLO[];
  subjects: Subject[];
};

export type TabKey = "general" | "plos" | "subjects";
