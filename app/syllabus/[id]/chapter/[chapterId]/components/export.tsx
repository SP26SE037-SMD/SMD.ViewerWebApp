"use client";

import React, { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface ExportProps {
  chapterName: string;
}

export default function Export({ chapterName }: ExportProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState("");

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress("Initializing...");
    
    // Save the original document title
    const originalTitle = document.title;
    
    // Use the chapter name as the document title so that the default saved PDF filename is clean and correct
    const cleanChapterName = chapterName ? chapterName.replace(/[\\/:*?"<>|]/g, "") : "Chapter";
    document.title = cleanChapterName;

    try {
      // Add a class to the body to activate the custom print layout styles
      document.body.classList.add("html2pdf-active");

      // Dynamically import html2canvas-pro and jspdf to avoid Next.js SSR issues
      // @ts-ignore
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");

      const pagesElements = document.querySelectorAll(".printable-document-container .print-page");
      if (pagesElements.length === 0) {
        throw new Error("Printable document container not found.");
      }

      // Initialize jsPDF (A4 dimensions: 210mm x 297mm)
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      const totalPages = pagesElements.length;

      for (let i = 0; i < totalPages; i++) {
        setExportProgress(`Page ${i + 1}/${totalPages}...`);
        
        const pageEl = pagesElements[i] as HTMLElement;
        
        // Capture individual page
        const canvas = await html2canvas(pageEl, {
          scale: 2, // high quality
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff"
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.98);

        // Add page to PDF (except first page, which is initialized by new jsPDF())
        if (i > 0) {
          pdf.addPage("a4", "portrait");
        }

        // Add image to fill the entire A4 page
        pdf.addImage(imgData, "JPEG", 0, 0, 210, 297);
      }

      setExportProgress("Saving PDF...");
      // Download PDF
      pdf.save(`${cleanChapterName}.pdf`);
    } catch (error) {
      console.error("Direct PDF export failed, falling back to window.print():", error);
      // Fallback to native print if library fails
      window.print();
    } finally {
      // Cleanup body class and restore document title
      document.body.classList.remove("html2pdf-active");
      document.title = originalTitle;
      setIsExporting(false);
      setExportProgress("");
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={`
        relative overflow-hidden flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold
        bg-emerald-600 text-white shadow-[0_2px_8px_rgba(16,185,129,0.25)] hover:bg-emerald-500 hover:shadow-[0_4px_12px_rgba(16,185,129,0.35)] 
        active:scale-95 transition-all duration-200 border border-emerald-700/20 cursor-pointer 
        disabled:opacity-75 disabled:cursor-not-allowed select-none
      `}
      title="Export Chapter to PDF"
    >
      {isExporting ? (
        <>
          <Loader2 size={14} className="animate-spin text-emerald-100" />
          <span className="tracking-wide animate-pulse">
            {exportProgress || "Generating..."}
          </span>
        </>
      ) : (
        <>
          <FileDown size={14} className="text-emerald-100" />
          <span className="tracking-wide">Export PDF</span>
        </>
      )}
    </button>
  );
}
