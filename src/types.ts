export type ReadinessTier = 1 | 2 | 3 | 4 | 5;

export type SeniorityLevel = "Junior" | "Mid-Level" | "Senior" | "Lead" | "Overqualified";

export type AIProvider = "Groq" | "Gemini" | "Mock";

export type GroundingTier = "HIGH" | "MEDIUM" | "LOW";

export interface RewriteSuggestion {
  original_bullet: string;
  suggested_bullet: string;
  rationale: string;
  section: string;
  grounding_confidence?: number; // 0 - 100%
  grounding_tier?: GroundingTier;
  flagged_unverifiable?: boolean;
  ungrounded_tokens?: string[];
  matched_tokens?: string[];
}

export type CoverLetterTone = "confident" | "enthusiastic" | "executive";

export interface AnalysisResult {
  matched_skills: string[];
  missing_skills: string[];
  readiness_tier: ReadinessTier;
  readiness_rationale: string;
  qualitative_summary: string;
  rewrite_suggestions: RewriteSuggestion[];
  ats_warnings: string[];
  seniority_assessment: SeniorityLevel;
  provider_used: AIProvider;
  provider_model?: string;
  fallback_triggered?: boolean;
  fallback_reason?: string;
  bias_flagged?: boolean;
  bias_warnings?: string[];
  latency_ms?: number;
  timestamp?: string;
  overall_grounding_score?: number;
  raw_token_count?: {
    resume_words: number;
    job_words: number;
  };
  cover_letter?: string;
}

export interface AISettings {
  groqApiKey: string;
  groqModel: string;
  geminiApiKey: string;
  geminiModel: string;
  enableGeminiFallback: boolean;
  forceMockMode: boolean;
}

export interface GuardAnalysis {
  overall_grounding_score: number;
  suggestions: RewriteSuggestion[];
  bias_flagged: boolean;
  bias_warnings: string[];
}
