import { AnalysisResult, ReadinessTier, SeniorityLevel, AIProvider, RewriteSuggestion } from "../types";

/**
 * Validate and safely sanitize an LLM response into a guaranteed valid AnalysisResult.
 * If critical fields are missing or corrupted, returns null so the caller can cascade fallback.
 */
export function validateAndSanitizeAnalysisResult(
  raw: any,
  provider: AIProvider,
  model?: string
): AnalysisResult | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }

  // Check required core fields
  const hasSkills = Array.isArray(raw.matched_skills) || Array.isArray(raw.missing_skills);
  const hasRationale = typeof raw.readiness_rationale === "string" || typeof raw.qualitative_summary === "string";

  // If both skills and rationale are completely absent, response is invalid
  if (!hasSkills && !hasRationale) {
    return null;
  }

  // Sanitize readiness tier (1 to 5)
  let readinessTier: ReadinessTier = 3;
  if (typeof raw.readiness_tier === "number" && raw.readiness_tier >= 1 && raw.readiness_tier <= 5) {
    readinessTier = Math.round(raw.readiness_tier) as ReadinessTier;
  } else if (typeof raw.readiness_tier === "string") {
    const parsedTier = parseInt(raw.readiness_tier, 10);
    if (!isNaN(parsedTier) && parsedTier >= 1 && parsedTier <= 5) {
      readinessTier = parsedTier as ReadinessTier;
    }
  }

  // Sanitize seniority level
  const validSeniorities: SeniorityLevel[] = ["Junior", "Mid-Level", "Senior", "Lead", "Overqualified"];
  let seniority: SeniorityLevel = "Mid-Level";
  if (typeof raw.seniority_assessment === "string") {
    const matched = validSeniorities.find(
      (s) => s.toLowerCase() === raw.seniority_assessment.toLowerCase()
    );
    if (matched) seniority = matched;
  }

  // Sanitize skills arrays
  const matchedSkills = Array.isArray(raw.matched_skills)
    ? raw.matched_skills.map(String).filter((s: string) => s.trim().length > 0)
    : [];

  const missingSkills = Array.isArray(raw.missing_skills)
    ? raw.missing_skills.map(String).filter((s: string) => s.trim().length > 0)
    : [];

  // Sanitize ATS warnings
  const atsWarnings = Array.isArray(raw.ats_warnings)
    ? raw.ats_warnings.map(String).filter((w: string) => w.trim().length > 0)
    : [];

  // Sanitize rewrite suggestions
  const rewriteSuggestions: RewriteSuggestion[] = Array.isArray(raw.rewrite_suggestions)
    ? raw.rewrite_suggestions
        .filter((item: any) => item && (item.original_bullet || item.suggested_bullet))
        .map((item: any) => ({
          original_bullet: String(item.original_bullet || "").trim(),
          suggested_bullet: String(item.suggested_bullet || item.original_bullet || "").trim(),
          rationale: String(item.rationale || "Optimized for keyword alignment and active impact").trim(),
          section: String(item.section || "Professional Experience").trim(),
          grounding_confidence: typeof item.grounding_confidence === "number" ? item.grounding_confidence : 85,
          grounding_tier: item.grounding_tier || "HIGH",
          flagged_unverifiable: Boolean(item.flagged_unverifiable),
          ungrounded_tokens: Array.isArray(item.ungrounded_tokens) ? item.ungrounded_tokens : [],
          matched_tokens: Array.isArray(item.matched_tokens) ? item.matched_tokens : [],
        }))
    : [];

  // Fallback summaries if empty
  const readinessRationale =
    typeof raw.readiness_rationale === "string" && raw.readiness_rationale.trim()
      ? raw.readiness_rationale.trim()
      : `Candidate demonstrates moderate alignment with key requirements, possessing core technical proficiencies while presenting opportunities for refinement in domain-specific tooling.`;

  const qualitativeSummary =
    typeof raw.qualitative_summary === "string" && raw.qualitative_summary.trim()
      ? raw.qualitative_summary.trim()
      : `The candidate possesses foundational background relevant to the target role. Strategic emphasis on demonstrated accomplishments and alignment of specific technical competencies will substantially increase ATS visibility.`;

  return {
    matched_skills: matchedSkills,
    missing_skills: missingSkills,
    readiness_tier: readinessTier,
    readiness_rationale: readinessRationale,
    qualitative_summary: qualitativeSummary,
    rewrite_suggestions: rewriteSuggestions,
    ats_warnings: atsWarnings.length > 0 ? atsWarnings : ["Ensure standard single-column formatting without embedded graphics or text boxes."],
    seniority_assessment: seniority,
    provider_used: provider,
    provider_model: model,
    bias_flagged: Boolean(raw.bias_flagged),
    bias_warnings: Array.isArray(raw.bias_warnings) ? raw.bias_warnings : [],
    latency_ms: typeof raw.latency_ms === "number" ? raw.latency_ms : undefined,
    timestamp: new Date().toISOString(),
  };
}
