"use client";

import { useMemo, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type FormSummary = {
  id: string;
  curriculumId: string;
  googleFormId: string;
  formUrl: string;
  formType: string;
  isActive: boolean;
  createdAt: string;
};

type FormOption = {
  optionId: string;
  text: string;
  goToSectionId: string;
};

type FormQuestion = {
  questionId: string;
  type: string;
  content: string;
  isRequired: boolean;
  options: FormOption[];
};

type FormSection = {
  sectionId: string;
  title: string;
  actionAfter: string;
  targetSectionId: string;
  questions: FormQuestion[];
};

type FormDetail = {
  formId: string;
  title: string;
  description: string;
  sections: FormSection[];
};

type FormWebhookSubmitBody = {
  googleFormId: string;
  submitterEmail: string;
  submittedAt: string;
  answers: Array<{
    googleItemId: string;
    questionTitle: string;
    itemType: string;
    answerValue: string;
  }>;
};

type FormWebhookSubmitResponse = {
  success: true;
  submissionId: string;
  answersProcessed: number;
};

const curriculumOptions = [
  { id: "cur-se-ai-2024", name: "Software Engineering - AI 2024" },
  { id: "cur-se-std-2024", name: "Software Engineering - Standard 2024" },
  { id: "cur-biz-it-2024", name: "Business IT 2024" },
];

const formsByCurriculum: Record<string, FormSummary[]> = {
  "cur-se-ai-2024": [
    {
      id: "form-se-ai-feedback-01",
      curriculumId: "cur-se-ai-2024",
      googleFormId: "google-form-ai-001",
      formUrl: "https://forms.google.com/mock/se-ai-feedback",
      formType: "COURSE_FEEDBACK",
      isActive: true,
      createdAt: "2026-04-10T15:51:30.526Z",
    },
  ],
  "cur-se-std-2024": [
    {
      id: "form-se-std-feedback-01",
      curriculumId: "cur-se-std-2024",
      googleFormId: "google-form-std-001",
      formUrl: "https://forms.google.com/mock/se-standard-feedback",
      formType: "COURSE_FEEDBACK",
      isActive: true,
      createdAt: "2026-04-10T15:51:30.526Z",
    },
  ],
  "cur-biz-it-2024": [],
};

const formDetailsById: Record<string, FormDetail> = {
  "form-se-ai-feedback-01": {
    formId: "form-se-ai-feedback-01",
    title: "SMD Viewer - Curriculum Feedback",
    description:
      "Please share your learning experience so we can improve curriculum quality.",
    sections: [
      {
        sectionId: "section-1",
        title: "General Experience",
        actionAfter: "CONTINUE",
        targetSectionId: "section-2",
        questions: [
          {
            questionId: "q-1",
            type: "SHORT_TEXT",
            content: "Your student email",
            isRequired: true,
            options: [],
          },
          {
            questionId: "q-2",
            type: "MULTIPLE_CHOICE",
            content: "How clear is the syllabus structure?",
            isRequired: true,
            options: [
              { optionId: "q2-o1", text: "Very clear", goToSectionId: "" },
              { optionId: "q2-o2", text: "Clear", goToSectionId: "" },
              { optionId: "q2-o3", text: "Neutral", goToSectionId: "" },
              { optionId: "q2-o4", text: "Unclear", goToSectionId: "" },
            ],
          },
        ],
      },
      {
        sectionId: "section-2",
        title: "Improvement Suggestions",
        actionAfter: "SUBMIT",
        targetSectionId: "",
        questions: [
          {
            questionId: "q-3",
            type: "PARAGRAPH",
            content: "What should we improve in this curriculum?",
            isRequired: false,
            options: [],
          },
        ],
      },
    ],
  },
  "form-se-std-feedback-01": {
    formId: "form-se-std-feedback-01",
    title: "SE Standard - Semester Feedback",
    description: "Your feedback helps improve content and teaching flow.",
    sections: [
      {
        sectionId: "section-1",
        title: "Course Effectiveness",
        actionAfter: "SUBMIT",
        targetSectionId: "",
        questions: [
          {
            questionId: "q-10",
            type: "MULTIPLE_CHOICE",
            content:
              "How useful are prerequisite relationships in your study planning?",
            isRequired: true,
            options: [
              { optionId: "q10-o1", text: "Very useful", goToSectionId: "" },
              { optionId: "q10-o2", text: "Useful", goToSectionId: "" },
              { optionId: "q10-o3", text: "Not sure", goToSectionId: "" },
              { optionId: "q10-o4", text: "Not useful", goToSectionId: "" },
            ],
          },
          {
            questionId: "q-11",
            type: "PARAGRAPH",
            content: "Any suggestion for prerequisite graph in SMD Viewer?",
            isRequired: false,
            options: [],
          },
        ],
      },
    ],
  },
};

const mockFormApi = {
  getFormsByCurriculumId: async (
    curriculumId: string,
  ): Promise<FormSummary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return formsByCurriculum[curriculumId] ?? [];
  },
  getFormDetailByFormId: async (formId: string): Promise<FormDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const data = formDetailsById[formId];
    if (!data) {
      throw new Error("Form not found");
    }
    return data;
  },
  submitFormWebhook: async (
    _webhookSecret: string,
    body: FormWebhookSubmitBody,
  ): Promise<FormWebhookSubmitResponse> => {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return {
      success: true,
      submissionId: `submission-${Date.now()}`,
      answersProcessed: body.answers.length,
    };
  },
};

export default function Form() {
  const [selectedCurriculumId, setSelectedCurriculumId] = useState("");
  const [forms, setForms] = useState<FormSummary[]>([]);
  const [selectedFormId, setSelectedFormId] = useState("");
  const [formDetail, setFormDetail] = useState<FormDetail | null>(null);
  const [submitterEmail, setSubmitterEmail] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoadingForms, setIsLoadingForms] = useState(false);
  const [isLoadingFormDetail, setIsLoadingFormDetail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedForm = useMemo(
    () => forms.find((item) => item.id === selectedFormId) ?? null,
    [forms, selectedFormId],
  );

  const handleLoadForms = async () => {
    if (!selectedCurriculumId) {
      toast.error("Please select a curriculum first.");
      return;
    }

    setIsLoadingForms(true);
    setFormDetail(null);
    setAnswers({});

    try {
      const data =
        await mockFormApi.getFormsByCurriculumId(selectedCurriculumId);
      setForms(data);

      if (data.length === 0) {
        setSelectedFormId("");
        toast.info("No feedback form found for this curriculum.");
        return;
      }

      const defaultForm = data.find((item) => item.isActive) ?? data[0];
      setSelectedFormId(defaultForm.id);
      await handleLoadFormDetail(defaultForm.id);
    } catch {
      toast.error("Cannot load forms. Please try again.");
    } finally {
      setIsLoadingForms(false);
    }
  };

  const handleLoadFormDetail = async (formId: string) => {
    setIsLoadingFormDetail(true);
    setAnswers({});

    try {
      const detail = await mockFormApi.getFormDetailByFormId(formId);
      setFormDetail(detail);
      toast.success("Form loaded successfully.");
    } catch {
      setFormDetail(null);
      toast.error("Cannot load form detail.");
    } finally {
      setIsLoadingFormDetail(false);
    }
  };

  const validateRequiredFields = () => {
    if (!formDetail) {
      return false;
    }

    for (const section of formDetail.sections) {
      for (const question of section.questions) {
        if (question.isRequired && !answers[question.questionId]?.trim()) {
          toast.error(`Missing answer for: ${question.content}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!selectedForm || !formDetail) {
      toast.error("Please load a form before submitting.");
      return;
    }

    if (!submitterEmail.trim()) {
      toast.error("Submitter email is required.");
      return;
    }

    if (!validateRequiredFields()) {
      return;
    }

    const payload: FormWebhookSubmitBody = {
      googleFormId: selectedForm.googleFormId,
      submitterEmail,
      submittedAt: new Date().toISOString(),
      answers: formDetail.sections.flatMap((section) =>
        section.questions
          .filter((question) => answers[question.questionId]?.trim())
          .map((question) => ({
            googleItemId: question.questionId,
            questionTitle: question.content,
            itemType: question.type,
            answerValue: answers[question.questionId],
          })),
      ),
    };

    setIsSubmitting(true);

    try {
      const response = await mockFormApi.submitFormWebhook(
        "mock-webhook-secret",
        payload,
      );
      toast.success(
        `Submitted successfully (${response.answersProcessed} answers).`,
      );
      setAnswers({});
    } catch {
      toast.error("Submit failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8fafb] px-4 py-8 font-[Lexend] sm:px-6 md:px-12 lg:px-24">
      <div className="mx-auto max-w-5xl space-y-6">
        <header>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#3D6B2C]">
            Feedback Center
          </p>
          <h1 className="font-[Bricolage_Grotesque] text-3xl leading-tight font-extrabold tracking-tight text-[#1A2E12] md:text-4xl lg:text-5xl">
            Curriculum Feedback Form
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-[#5A6B52]">
            Select a curriculum first, then load and submit feedback form data
            based on mocked APIs.
          </p>
        </header>

        <Card className="rounded-4xl border-[#D4ECC8] bg-white shadow-[0_8px_32px_0_rgba(61,107,44,0.15)]">
          <CardHeader>
            <CardTitle className="font-[Bricolage_Grotesque] text-xl text-[#1A2E12]">
              Step 1: Select Curriculum
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[1fr_auto]">
              <select
                value={selectedCurriculumId}
                onChange={(event) =>
                  setSelectedCurriculumId(event.target.value)
                }
                className="h-10 w-full rounded-md border border-[#D4ECC8] bg-white px-3 text-sm text-[#1A2E12] outline-none ring-[#3D6B2C] focus:border-[#3D6B2C] focus:ring-2"
              >
                <option value="">Choose curriculum for feedback...</option>
                {curriculumOptions.map((curriculum) => (
                  <option key={curriculum.id} value={curriculum.id}>
                    {curriculum.name}
                  </option>
                ))}
              </select>

              <Button
                onClick={handleLoadForms}
                disabled={isLoadingForms}
                className="bg-[#3D6B2C] text-white hover:bg-[#2E5020]"
              >
                {isLoadingForms && <Loader2 className="size-4 animate-spin" />}
                Load Forms
              </Button>
            </div>

            {forms.length > 0 && (
              <div className="grid gap-4 md:grid-cols-[1fr_auto]">
                <select
                  value={selectedFormId}
                  onChange={(event) => setSelectedFormId(event.target.value)}
                  className="h-10 w-full rounded-md border border-[#D4ECC8] bg-white px-3 text-sm text-[#1A2E12] outline-none ring-[#3D6B2C] focus:border-[#3D6B2C] focus:ring-2"
                >
                  {forms.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.formType} - {item.id}
                    </option>
                  ))}
                </select>

                <Button
                  variant="outline"
                  onClick={() => handleLoadFormDetail(selectedFormId)}
                  disabled={!selectedFormId || isLoadingFormDetail}
                  className="border-[#3D6B2C] text-[#3D6B2C] hover:bg-[#3D6B2C] hover:text-white"
                >
                  {isLoadingFormDetail && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Load Form Detail
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {formDetail && selectedForm && (
          <Card className="rounded-4xl border-[#D4ECC8] bg-white shadow-[0_8px_32px_0_rgba(61,107,44,0.15)]">
            <CardHeader>
              <CardTitle className="font-[Bricolage_Grotesque] text-2xl text-[#1A2E12]">
                {formDetail.title}
              </CardTitle>
              <p className="text-sm leading-relaxed text-[#5A6B52]">
                {formDetail.description}
              </p>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#1A2E12]">
                  Submitter email <span className="text-red-500">*</span>
                </label>
                <Input
                  type="email"
                  placeholder="student@fpt.edu.vn"
                  value={submitterEmail}
                  onChange={(event) => setSubmitterEmail(event.target.value)}
                  className="border-[#D4ECC8] focus-visible:border-[#3D6B2C]"
                />
              </div>

              {formDetail.sections.map((section, sectionIndex) => (
                <section
                  key={section.sectionId}
                  className="rounded-xl border border-[#D4ECC8] bg-[#E8F5E0] p-4 md:p-6"
                >
                  <h2 className="font-[Bricolage_Grotesque] text-xl font-bold text-[#1A2E12]">
                    Section {sectionIndex + 1}: {section.title}
                  </h2>

                  <div className="mt-4 space-y-5">
                    {section.questions.map((question, questionIndex) => (
                      <div key={question.questionId} className="space-y-2">
                        <p className="text-sm font-semibold leading-relaxed text-[#1A2E12]">
                          {sectionIndex + 1}.{questionIndex + 1}{" "}
                          {question.content}{" "}
                          {question.isRequired ? (
                            <span className="text-red-500">*</span>
                          ) : null}
                        </p>

                        {question.type === "MULTIPLE_CHOICE" ? (
                          <div className="space-y-2">
                            {question.options.map((option) => (
                              <label
                                key={option.optionId}
                                className="flex cursor-pointer items-center gap-2 rounded-md border border-[#D4ECC8] bg-white px-3 py-2 text-sm text-[#1A2E12]"
                              >
                                <input
                                  type="radio"
                                  name={question.questionId}
                                  checked={
                                    answers[question.questionId] === option.text
                                  }
                                  onChange={() =>
                                    setAnswers((prev) => ({
                                      ...prev,
                                      [question.questionId]: option.text,
                                    }))
                                  }
                                />
                                <span>{option.text}</span>
                              </label>
                            ))}
                          </div>
                        ) : question.type === "PARAGRAPH" ? (
                          <textarea
                            value={answers[question.questionId] ?? ""}
                            onChange={(event) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.questionId]: event.target.value,
                              }))
                            }
                            rows={4}
                            className="w-full rounded-md border border-[#D4ECC8] bg-white px-3 py-2 text-sm text-[#1A2E12] outline-none ring-[#3D6B2C] focus:border-[#3D6B2C] focus:ring-2"
                            placeholder="Type your answer..."
                          />
                        ) : (
                          <Input
                            value={answers[question.questionId] ?? ""}
                            onChange={(event) =>
                              setAnswers((prev) => ({
                                ...prev,
                                [question.questionId]: event.target.value,
                              }))
                            }
                            placeholder="Type your answer..."
                            className="border-[#D4ECC8] focus-visible:border-[#3D6B2C]"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}

              <div className="rounded-xl border border-dashed border-[#D4ECC8] bg-[#F5FAF2] p-4 text-xs leading-relaxed text-[#5A6B52]">
                Submit payload will follow: POST /api/v1/forms/webhook/submit
                with fields googleFormId, submitterEmail, submittedAt,
                answers[].
              </div>

              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-[#3D6B2C] text-white hover:bg-[#2E5020]"
              >
                {isSubmitting ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
