import { useEffect, useState } from "react";

import syllabusApiRequest from "@/apiRequests/syllabus";
import {
  MaterialBlockType,
  SyllabusContentType,
  SyllabusMaterialType,
} from "@/schemaValidations/syllabus.schema";

type UseChapterViewerDataResult = {
  syllabus: SyllabusContentType | null;
  chapterName: string;
  materialBlocks: MaterialBlockType[];
  loading: boolean;
};

export const useChapterViewerData = (
  id: string,
  chapterId: string,
): UseChapterViewerDataResult => {
  const [syllabus, setSyllabus] = useState<SyllabusContentType | null>(null);
  const [chapterName, setChapterName] = useState("");
  const [materialBlocks, setMaterialBlocks] = useState<MaterialBlockType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const publishedSyllabusesRes =
          await syllabusApiRequest.getPublishedSyllabusesBySubjectId(id);
        const publishedData = publishedSyllabusesRes?.payload?.data;
        const selectedSyllabusId = Array.isArray(publishedData)
          ? publishedData[0]?.syllabusId
          : undefined;

        if (!selectedSyllabusId) {
          setSyllabus(null);
          setChapterName("");
          setMaterialBlocks([]);
          return;
        }

        const [syllabusRes, materialsRes] = await Promise.all([
          syllabusApiRequest.getSyllabusDetail(selectedSyllabusId),
          syllabusApiRequest.getMaterialsBySyllabusId(selectedSyllabusId),
        ]);

        const syllabusData = syllabusRes?.payload?.data ?? null;
        const materials = (materialsRes?.payload?.data ??
          []) as SyllabusMaterialType[];
        const currentMaterial = materials.find(
          (material) => material.materialId === chapterId,
        );

        setSyllabus(syllabusData);
        setChapterName(currentMaterial?.title ?? "");

        if (!currentMaterial) {
          setMaterialBlocks([]);
          return;
        }

        const blocks: MaterialBlockType[] = [];
        let page = 1;
        let totalPages = 1;

        while (page <= totalPages) {
          const blockRes = await syllabusApiRequest.getMaterialBlocksByMaterialId(
            currentMaterial.materialId,
            page,
            50,
          );
          const blockData = blockRes?.payload?.data;
          if (blockData?.content?.length) {
            blocks.push(...blockData.content);
          }
          totalPages = blockData?.totalPages ?? 0;
          if (totalPages === 0) {
            break;
          }
          page += 1;
        }

        blocks.sort((a, b) => a.idx - b.idx);
        setMaterialBlocks(blocks);
      } catch (error) {
        console.error("Failed to fetch syllabus details", error);
        setSyllabus(null);
        setChapterName("");
        setMaterialBlocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, chapterId]);

  return {
    syllabus,
    chapterName,
    materialBlocks,
    loading,
  };
};
