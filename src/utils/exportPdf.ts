import jsPDF from "jspdf";
import type { CompetencyGapItem } from "@/types";

export interface ExportIdpParams {
  employeeId: string;
  employeeName: string;
  currentRole?: string;
  department?: string;
  currentReadiness: number | string;
  expectedReadiness: number | string;
  readinessSummary: string;
  competencyGaps: CompetencyGapItem[] | string[];
  training: string[];
  certifications: string[];
  mentor: string;
  jobRotation: string;
  timeline: string;
  source?: string;
}

/**
 * Generates and downloads a clean A4 PDF document for the AI Individual Development Plan
 * Saved as IDP_<employeeId>.pdf
 */
export function exportIdpPdf(params: ExportIdpParams) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const margin = 15;
  const contentWidth = pageWidth - margin * 2; // 180mm
  let y = 20;

  const addHeaderFooter = () => {
    // Top branding bar
    doc.setFillColor(15, 62, 120); // POWERGRID Blue
    doc.rect(0, 0, pageWidth, 5, "F");

    // Footer text
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("POWERGRID Succession Planning & Leadership Development System", margin, pageHeight - 10);
    doc.text(`IDP Reference: IDP_${params.employeeId}`, pageWidth - margin, pageHeight - 10, { align: "right" });
  };

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - 18) {
      doc.addPage();
      y = 20;
      addHeaderFooter();
    }
  };

  addHeaderFooter();

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(15, 62, 120);
  doc.text("POWERGRID CORPORATION OF INDIA LIMITED", margin, y);
  y += 6;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text("AI-Powered Individual Development Plan (IDP)", margin, y);
  y += 8;

  // Divider Line
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Employee Metadata Box
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, "FD");

  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 62, 120);
  doc.text(`Employee Name: ${params.employeeName}`, margin + 5, y + 7);
  doc.text(`Employee ID: ${params.employeeId}`, margin + 100, y + 7);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(51, 65, 85);
  doc.text(`Current Role: ${params.currentRole || "Executive"}`, margin + 5, y + 14);
  doc.text(`Department: ${params.department || "POWERGRID Operations"}`, margin + 100, y + 14);

  doc.setFontSize(8.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated Via: ${params.source || "AI System"}`, margin + 5, y + 20);
  doc.text(`Date Generated: ${new Date().toLocaleDateString("en-IN")}`, margin + 100, y + 20);
  y += 30;

  // Helper for Section Titles
  const addSectionTitle = (title: string) => {
    checkPageBreak(12);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11.5);
    doc.setTextColor(15, 62, 120);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(15, 62, 120);
    doc.setLineWidth(0.4);
    doc.line(margin, y, margin + 45, y);
    y += 6;
  };

  // 1. Readiness Assessment
  addSectionTitle("1. READINESS ASSESSMENT");
  checkPageBreak(22);

  doc.setFillColor(241, 245, 249);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, "F");

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text(`Current Readiness: ${params.currentReadiness}%`, margin + 5, y + 9);
  doc.text(`Expected Readiness: ${params.expectedReadiness}%`, margin + 95, y + 9);
  y += 18;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(51, 65, 85);
  doc.text("Readiness Summary:", margin, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  const summaryLines = doc.splitTextToSize(params.readinessSummary, contentWidth);
  checkPageBreak(summaryLines.length * 4.5 + 4);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4.5 + 8;

  // 2. Competency Gaps
  addSectionTitle("2. COMPETENCY GAP ANALYSIS");
  if (!params.competencyGaps || params.competencyGaps.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("• No critical competency gaps identified.", margin + 3, y);
    y += 6;
  } else {
    params.competencyGaps.forEach((gap) => {
      checkPageBreak(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);

      let text = "";
      if (typeof gap === "string") {
        text = `• ${gap}`;
      } else {
        const status = gap.status || "Needs Improvement";
        const scoreInfo = gap.employeeScore !== undefined && gap.requiredScore !== undefined
          ? ` (Score: ${gap.employeeScore}/${gap.requiredScore})`
          : "";
        text = `• ${gap.competency} — Status: ${status}${scoreInfo}`;
      }
      const gapLines = doc.splitTextToSize(text, contentWidth - 5);
      doc.text(gapLines, margin + 3, y);
      y += gapLines.length * 4.5 + 1.5;
    });
    y += 4;
  }

  // 3. Recommended Training
  addSectionTitle("3. RECOMMENDED TRAINING & DEVELOPMENT");
  if (!params.training || params.training.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("• No specific training modules specified.", margin + 3, y);
    y += 6;
  } else {
    params.training.forEach((tr) => {
      checkPageBreak(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      const trLines = doc.splitTextToSize(`[ ]  ${tr}`, contentWidth - 5);
      doc.text(trLines, margin + 3, y);
      y += trLines.length * 4.5 + 1.5;
    });
    y += 4;
  }

  // 4. Certifications
  addSectionTitle("4. TARGET CERTIFICATIONS");
  if (!params.certifications || params.certifications.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text("• None specified.", margin + 3, y);
    y += 6;
  } else {
    params.certifications.forEach((cert) => {
      checkPageBreak(7);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(30, 41, 59);
      const certLines = doc.splitTextToSize(`• ${cert}`, contentWidth - 5);
      doc.text(certLines, margin + 3, y);
      y += certLines.length * 4.5 + 1.5;
    });
    y += 4;
  }

  // 5. Mentorship, Job Rotation & Timeline
  addSectionTitle("5. MENTORSHIP & ROTATION");
  checkPageBreak(18);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(30, 41, 59);

  const mentorText = doc.splitTextToSize(`• Recommended Mentor: ${params.mentor || "Executive Director"}`, contentWidth - 5);
  doc.text(mentorText, margin + 3, y);
  y += mentorText.length * 4.5 + 2;

  const rotationText = doc.splitTextToSize(`• Job Rotation Division: ${params.jobRotation || "Target Functional Division"}`, contentWidth - 5);
  doc.text(rotationText, margin + 3, y);
  y += rotationText.length * 4.5 + 2;

  const timelineText = doc.splitTextToSize(`• Execution Timeline: ${params.timeline || "6 Months"}`, contentWidth - 5);
  doc.text(timelineText, margin + 3, y);
  y += timelineText.length * 4.5 + 6;

  // Save document as IDP_<employeeId>.pdf
  doc.save(`IDP_${params.employeeId}.pdf`);
}
