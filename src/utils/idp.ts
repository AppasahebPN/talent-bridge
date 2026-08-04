import type { CompetencyGapItem, GenerateIdpResponse, IdpData } from "@/types";

/**
 * Safely normalizes the backend AI response into a structured IdpData object.
 * Handles both structured JSON (Fallback AI / Gemini AI object) and raw string formats gracefully.
 */
export function normalizeIdpResponse(response: GenerateIdpResponse): IdpData {
  let readinessScore = 80;
  let readinessSummary = "Employee demonstrates leadership potential and is suitable for succession planning.";
  let competencyGaps: CompetencyGapItem[] = response.gaps || [];
  let training: string[] = [];
  let certifications: string[] = [];
  let mentor = "Not assigned";
  let jobRotation = "Not specified";
  let timeline = "6 Months";

  if (response.idp) {
    if (typeof response.idp === "object" && response.idp !== null) {
      const data = response.idp as Partial<IdpData>;
      if (typeof data.readinessScore === "number") readinessScore = data.readinessScore;
      if (data.readinessSummary) readinessSummary = data.readinessSummary;
      
      if (Array.isArray(data.competencyGaps) && data.competencyGaps.length > 0) {
        competencyGaps = data.competencyGaps as CompetencyGapItem[];
      }
      if (Array.isArray(data.training)) training = data.training;
      if (Array.isArray(data.certifications)) certifications = data.certifications;
      if (data.mentor) mentor = data.mentor;
      if (data.jobRotation) jobRotation = data.jobRotation;
      if (data.timeline) timeline = data.timeline;
    } else if (typeof response.idp === "string") {
      try {
        const parsed = JSON.parse(response.idp);
        if (typeof parsed === "object" && parsed !== null) {
          return normalizeIdpResponse({ ...response, idp: parsed });
        }
      } catch {
        readinessSummary = response.idp;
      }
    }
  }

  // Fallback to response.gaps if competencyGaps is empty
  if ((!competencyGaps || competencyGaps.length === 0) && response.gaps) {
    competencyGaps = response.gaps;
  }

  return {
    readinessScore,
    readinessSummary,
    competencyGaps,
    training,
    certifications,
    mentor,
    jobRotation,
    timeline,
  };
}
