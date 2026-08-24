import { RewriteSuggestion, GuardAnalysis, GroundingTier } from "../types";

// Common stop words to exclude from grounding token matching
const STOP_WORDS = new Set([
  "a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't",
  "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by",
  "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't",
  "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have",
  "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself",
  "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into",
  "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my",
  "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our",
  "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's",
  "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs",
  "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're",
  "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't",
  "we", "we'd", "we'll", "we're", "we've", "were", "weren't", "what", "what's", "when", "when's",
  "where", "where's", "which", "while", "who", "who's", "whom", "why", "why's", "with", "won't",
  "would", "wouldn't", "you", "you'd", "you'll", "you're", "you've", "your", "yours", "yourself",
  "yourselves", "using", "used", "via", "across", "within", "per", "based", "including"
]);

// Bias scanner pattern dictionary
const BIAS_PATTERNS = [
  {
    category: "Age & Graduation Triggers",
    regex: /\b(digital native|recent graduate|energetic youth|young professional|born in \d{4}|over 50|mature candidate|retiree)\b/i,
    warning: "Potential age bias marker detected. Use experience-based competence metrics rather than generational or age-correlated descriptors."
  },
  {
    category: "Marital & Family Status",
    regex: /\b(married|single|divorced|has children|mother of|father of|family man|family-oriented|unmarried)\b/i,
    warning: "Marital or parental status detected. Remove non-job-related personal characteristics to maintain EEOC compliance."
  },
  {
    category: "Gendered or Stereotypical Phrasing",
    regex: /\b(rockstar developer|ninja coder|guru|aggressive closer|gentlemanly|lady-like|maternal)\b/i,
    warning: "Gender-coded or hyper-aggressive jargon detected. Standardize on professional competencies (e.g., 'Principal Engineer', 'High-Performing Contributor')."
  },
  {
    category: "Religious & Political References",
    regex: /\b(church member|pastor|parishioner|synagogue|mosque|devout|political party|democrat|republican|partisan)\b/i,
    warning: "Personal religious or political affiliation detected. Exclude non-occupational associations unless directly relevant to a non-profit role."
  },
  {
    category: "Physical Appearance & Health",
    regex: /\b(attractive|energetic presence|able-bodied|athletic build|clean-cut|photogenic)\b/i,
    warning: "Physical appearance or capability marker detected. Focus exclusively on technical and occupational deliverables."
  }
];

/**
 * Tokenize and normalize text into clean substantive tokens
 */
export function extractSubstantiveTokens(text: string): string[] {
  try {
    if (!text || typeof text !== "string") return [];
    const words = text
      .toLowerCase()
      .replace(/[^\w\s+#./-]/g, " ")
      .split(/\s+/)
      .map((w) => w.trim())
      .filter((w) => w.length > 1 && !STOP_WORDS.has(w));

    return Array.from(new Set(words));
  } catch (err) {
    console.warn("Token extraction error:", err);
    return [];
  }
}

/**
 * Stem-like fuzzy comparator to account for pluralization / verb forms
 */
function isTokenSimilar(tokenA: string, tokenB: string): boolean {
  if (tokenA === tokenB) return true;
  if (tokenA.startsWith(tokenB) || tokenB.startsWith(tokenA)) {
    const minLen = Math.min(tokenA.length, tokenB.length);
    if (minLen >= 4 && Math.abs(tokenA.length - tokenB.length) <= 3) return true;
  }
  return false;
}

/**
 * Audit rewrite suggestions against the raw candidate resume
 * Checks for token grounding (anti-hallucination) and unverifiable additions.
 * If grounding check throws, defaults to 0% confidence, "LOW" tier, and flagged_unverifiable: true
 */
export function evaluateGrounding(
  resumeText: string,
  suggestions: RewriteSuggestion[]
): { suggestions: RewriteSuggestion[]; overall_grounding_score: number } {
  try {
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      return { suggestions: [], overall_grounding_score: 100 };
    }

    const resumeTokens = new Set(extractSubstantiveTokens(resumeText));
    const resumeTokensArray = Array.from(resumeTokens);

    let totalConfidenceSum = 0;

    const processedSuggestions = suggestions.map((s) => {
      try {
        const originalBulletTokens = new Set(extractSubstantiveTokens(s.original_bullet));
        const suggestedTokens = extractSubstantiveTokens(s.suggested_bullet);

        if (suggestedTokens.length === 0) {
          // If no substantive tokens can be extracted, fail safe toward distrust
          return {
            ...s,
            grounding_confidence: 0,
            grounding_tier: "LOW" as GroundingTier,
            flagged_unverifiable: true,
            ungrounded_tokens: [],
            matched_tokens: [],
          };
        }

        const matchedTokens: string[] = [];
        const ungroundedTokens: string[] = [];

        for (const token of suggestedTokens) {
          const existsInResume =
            resumeTokens.has(token) ||
            originalBulletTokens.has(token) ||
            resumeTokensArray.some((rt) => isTokenSimilar(rt, token));

          if (existsInResume) {
            matchedTokens.push(token);
          } else {
            ungroundedTokens.push(token);
          }
        }

        const matchRatio = matchedTokens.length / suggestedTokens.length;
        let confidence = Math.round(matchRatio * 100);

        // Apply penalty if ungrounded tokens contain specific metrics or claims
        const hasUnverifiedMetric = ungroundedTokens.some((t) => /^\d+(%|x|k|m)$/i.test(t));
        if (hasUnverifiedMetric) {
          confidence = Math.max(20, confidence - 15);
        }

        let grounding_tier: GroundingTier = "HIGH";
        let flagged_unverifiable = false;

        if (confidence >= 85) {
          grounding_tier = "HIGH";
        } else if (confidence >= 65) {
          grounding_tier = "MEDIUM";
        } else {
          grounding_tier = "LOW";
          flagged_unverifiable = true;
        }

        totalConfidenceSum += confidence;

        return {
          ...s,
          grounding_confidence: confidence,
          grounding_tier,
          flagged_unverifiable,
          ungrounded_tokens: ungroundedTokens.slice(0, 5),
          matched_tokens: matchedTokens.slice(0, 8),
        };
      } catch (itemErr) {
        console.warn("[Grounding Check Item Error - Falling back to distrust]:", itemErr);
        return {
          ...s,
          grounding_confidence: 0,
          grounding_tier: "LOW" as GroundingTier,
          flagged_unverifiable: true,
          ungrounded_tokens: [],
          matched_tokens: [],
        };
      }
    });

    const overall_grounding_score =
      processedSuggestions.length > 0
        ? Math.round(totalConfidenceSum / processedSuggestions.length)
        : 100;

    return {
      suggestions: processedSuggestions,
      overall_grounding_score,
    };
  } catch (err) {
    console.error("[Grounding Check Fatal Error - Defaulting to distrust]:", err);
    const fallbackSuggestions = (suggestions || []).map((s) => ({
      ...s,
      grounding_confidence: 0,
      grounding_tier: "LOW" as GroundingTier,
      flagged_unverifiable: true,
      ungrounded_tokens: [],
      matched_tokens: [],
    }));
    return {
      suggestions: fallbackSuggestions,
      overall_grounding_score: 0,
    };
  }
}

/**
 * Scan resume text and generated suggestions for bias and compliance flags
 * If bias scanner throws: catch and default bias_flagged to false with console warning
 */
export function scanForBias(textToCheck: string): { bias_flagged: boolean; bias_warnings: string[] } {
  try {
    if (!textToCheck || typeof textToCheck !== "string") {
      return { bias_flagged: false, bias_warnings: [] };
    }

    const warnings: string[] = [];

    for (const pattern of BIAS_PATTERNS) {
      if (pattern.regex.test(textToCheck)) {
        warnings.push(`[${pattern.category}] ${pattern.warning}`);
      }
    }

    return {
      bias_flagged: warnings.length > 0,
      bias_warnings: warnings,
    };
  } catch (err) {
    console.warn("[Bias Scanner Error - Safe bypass]:", err);
    return {
      bias_flagged: false,
      bias_warnings: [],
    };
  }
}

/**
 * Complete Guard pipeline execution
 */
export function runGuardPipeline(
  resumeText: string,
  suggestions: RewriteSuggestion[]
): GuardAnalysis {
  const { suggestions: guardedSuggestions, overall_grounding_score } = evaluateGrounding(
    resumeText,
    suggestions
  );

  const fullTextToScan = [
    resumeText || "",
    ...(suggestions || []).map((s) => `${s.original_bullet || ""} ${s.suggested_bullet || ""}`),
  ].join(" ");

  const { bias_flagged, bias_warnings } = scanForBias(fullTextToScan);

  return {
    overall_grounding_score,
    suggestions: guardedSuggestions,
    bias_flagged,
    bias_warnings,
  };
}
