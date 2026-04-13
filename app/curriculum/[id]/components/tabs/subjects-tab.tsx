"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { useRouter } from "next/navigation";
import curriculumApiRequest from "@/apiRequests/curriculum";
import {
  CurriculumGroupType,
  CurriculumSemesterMappingType,
} from "@/schemaValidations/curriculum.schema";
import { DisplaySubjectRow } from "@/app/curriculum/[id]/components/tabs/subjects/types";
import SubjectsTabHeader from "@/app/curriculum/[id]/components/tabs/subjects/subjects-tab-header";
import SemesterSection from "@/app/curriculum/[id]/components/tabs/subjects/semester-section";
import ElectiveGroupModal from "@/app/curriculum/[id]/components/tabs/subjects/elective-group-modal";

type Props = {
  curriculumId: string;
  onNavigateSyllabus: (subjectId: string) => void;
};

const uniqueCodes = (codes: string[]) => Array.from(new Set(codes));

export default function SubjectsTab({
  curriculumId,
  onNavigateSyllabus,
}: Props) {
  const router = useRouter();
  const [semesterMappings, setSemesterMappings] = useState<
    CurriculumSemesterMappingType[]
  >([]);
  const [groupsById, setGroupsById] = useState<
    Record<string, CurriculumGroupType>
  >({});
  const [loading, setLoading] = useState(true);
  const [expandedSemesters, setExpandedSemesters] = useState<Set<number>>(
    new Set(),
  );
  const [selectedElectiveGroup, setSelectedElectiveGroup] =
    useState<DisplaySubjectRow | null>(null);
  const [selectedComboGroupId, setSelectedComboGroupId] = useState<
    string | null
  >(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (!curriculumId) {
        setSemesterMappings([]);
        setGroupsById({});
        setExpandedSemesters(new Set());
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res =
          await curriculumApiRequest.getSemesterMappingsByCurriculumId(
            curriculumId,
          );
        const mappings = res?.payload?.data?.semesterMappings ?? [];

        const groupIds = Array.from(
          new Set(
            mappings.flatMap((semester) =>
              semester.subjects
                .map((subject) => subject.groupId)
                .filter((groupId): groupId is string => Boolean(groupId)),
            ),
          ),
        );

        const groupEntries = await Promise.all(
          groupIds.map(async (groupId) => {
            try {
              const groupRes = await curriculumApiRequest.getGroupById(groupId);
              return groupRes?.payload?.data ?? null;
            } catch (error) {
              console.error(`Failed to fetch group ${groupId}`, error);
              return null;
            }
          }),
        );

        const nextGroupsById: Record<string, CurriculumGroupType> = {};
        groupEntries.forEach((group) => {
          if (group) {
            nextGroupsById[group.groupId] = group;
          }
        });

        setSemesterMappings(mappings);
        setGroupsById(nextGroupsById);
        setExpandedSemesters(
          new Set(mappings.map((semester) => semester.semesterNo)),
        );
      } catch (error) {
        console.error("Failed to fetch curriculum subjects", error);
        setSemesterMappings([]);
        setGroupsById({});
        setExpandedSemesters(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [curriculumId]);

  const groupedSubjects = useMemo(() => {
    const result: Record<number, DisplaySubjectRow[]> = {};

    semesterMappings.forEach((semester) => {
      const rows: DisplaySubjectRow[] = [];
      const pushedGroupsBySemester = new Set<string>();

      semester.subjects.forEach((subject) => {
        if (!subject.groupId) {
          rows.push({
            key: subject.subjectId,
            semesterNo: semester.semesterNo,
            subjectId: subject.subjectId,
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            credits: subject.credit,
            prerequisiteSubjectCodes: subject.prerequisiteSubjectCodes,
            subjects: [subject],
            kind: "subject",
          });
          return;
        }

        const group = groupsById[subject.groupId];

        if (group?.type === "COMBO") {
          if (selectedComboGroupId !== group.groupId) {
            return;
          }

          rows.push({
            key: `combo-${subject.subjectId}`,
            semesterNo: semester.semesterNo,
            subjectId: subject.subjectId,
            subjectCode: subject.subjectCode,
            subjectName: subject.subjectName,
            credits: subject.credit,
            prerequisiteSubjectCodes: subject.prerequisiteSubjectCodes,
            subjects: [subject],
            group,
            kind: "combo",
          });
          return;
        }

        if (pushedGroupsBySemester.has(subject.groupId)) {
          return;
        }

        pushedGroupsBySemester.add(subject.groupId);
        const groupSubjects = semester.subjects.filter(
          (item) => item.groupId === subject.groupId,
        );

        const representativeSubjects = groupSubjects.length
          ? groupSubjects
          : [subject];

        rows.push({
          key: `elective-${subject.groupId}`,
          semesterNo: semester.semesterNo,
          subjectId: subject.subjectId,
          subjectCode: group?.groupCode ?? subject.subjectCode,
          subjectName: group?.groupName ?? subject.subjectName,
          credits: representativeSubjects[0]?.credit ?? subject.credit,
          prerequisiteSubjectCodes: uniqueCodes(
            representativeSubjects.flatMap(
              (item) => item.prerequisiteSubjectCodes,
            ),
          ),
          subjects: representativeSubjects,
          group,
          kind: "elective",
        });
      });

      if (rows.length > 0) {
        result[semester.semesterNo] = rows;
      }
    });

    return result;
  }, [semesterMappings, groupsById, selectedComboGroupId]);

  const sortedSemesters = useMemo(
    () =>
      Object.keys(groupedSubjects)
        .map(Number)
        .sort((a, b) => a - b),
    [groupedSubjects],
  );

  const comboGroups = useMemo(() => {
    const comboGroupIds = new Set<string>();
    semesterMappings.forEach((semester) => {
      semester.subjects.forEach((subject) => {
        if (!subject.groupId) {
          return;
        }

        const group = groupsById[subject.groupId];
        if (group?.type === "COMBO") {
          comboGroupIds.add(group.groupId);
        }
      });
    });

    return Array.from(comboGroupIds)
      .map((groupId) => groupsById[groupId])
      .filter((group): group is CurriculumGroupType => Boolean(group))
      .sort((a, b) => a.groupCode.localeCompare(b.groupCode));
  }, [semesterMappings, groupsById]);

  const selectedComboGroup = useMemo(() => {
    if (!selectedComboGroupId) {
      return null;
    }

    return groupsById[selectedComboGroupId] ?? null;
  }, [groupsById, selectedComboGroupId]);

  const visibleRows = useMemo(
    () => Object.values(groupedSubjects).flat(),
    [groupedSubjects],
  );

  const totalVisibleSubjects = visibleRows.length;
  const totalVisibleCredits = visibleRows.reduce(
    (sum, row) => sum + row.credits,
    0,
  );

  const toggleSemester = (semester: number) => {
    setExpandedSemesters((prev) => {
      const next = new Set(prev);
      if (next.has(semester)) next.delete(semester);
      else next.add(semester);
      return next;
    });
  };

  if (loading) {
    return (
      <motion.div
        key="subjects"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <p className="text-gray-500 font-medium">Loading subject data...</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="subjects"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.2 }}
    >
      {sortedSemesters.length > 0 ? (
        <>
          <SubjectsTabHeader
            totalVisibleSubjects={totalVisibleSubjects}
            totalVisibleCredits={totalVisibleCredits}
            selectedComboGroup={selectedComboGroup}
            selectedComboGroupId={selectedComboGroupId}
            comboGroups={comboGroups}
            onSelectDefaultSubjects={() => setSelectedComboGroupId(null)}
            onSelectComboGroup={setSelectedComboGroupId}
            onOpenGraph={() => router.push(`/curriculum/${curriculumId}/graph`)}
          />

          <div className="space-y-4">
            {sortedSemesters.map((semesterNo) => (
              <SemesterSection
                key={semesterNo}
                semesterNo={semesterNo}
                rows={groupedSubjects[semesterNo]}
                isExpanded={expandedSemesters.has(semesterNo)}
                onToggle={toggleSemester}
                onNavigateSyllabus={onNavigateSyllabus}
                onOpenElectiveGroup={setSelectedElectiveGroup}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-10 border-2 border-gray-200 text-center">
          <Layers size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No subject data</p>
        </div>
      )}

      <ElectiveGroupModal
        selectedElectiveGroup={selectedElectiveGroup}
        onClose={() => setSelectedElectiveGroup(null)}
        onNavigateSyllabus={onNavigateSyllabus}
      />
    </motion.div>
  );
}
