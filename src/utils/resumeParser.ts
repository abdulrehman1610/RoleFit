export interface StructuredExperienceItem {
  title: string;
  organization?: string;
  date?: string;
  location?: string;
  bullets: string[];
}

export interface StructuredSection {
  title: string;
  items?: StructuredExperienceItem[];
  rawLines?: string[];
}

export interface StructuredResume {
  name: string;
  headline?: string;
  contactDetails: string[];
  sections: StructuredSection[];
}

/**
 * Intelligent text parser that turns plain text or markdown resumes
 * into clean structured sections for ATS Harvard/Stanford rendering.
 */
export function parseResumeToStructure(rawText: string): StructuredResume {
  if (!rawText || !rawText.trim()) {
    return {
      name: "Candidate Name",
      headline: "Professional Title",
      contactDetails: ["email@example.com", "+1 (555) 000-0000", "Location", "linkedin.com/in/profile"],
      sections: [],
    };
  }

  const lines = rawText.split("\n").map((l) => l.trimEnd());
  const structured: StructuredResume = {
    name: "",
    headline: "",
    contactDetails: [],
    sections: [],
  };

  // 1. Identify Name & Contact Header (first 5 non-empty lines)
  let lineIdx = 0;
  while (lineIdx < lines.length && lines[lineIdx].trim() === "") lineIdx++;

  if (lineIdx < lines.length) {
    // First line is usually Name
    structured.name = lines[lineIdx].replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
    lineIdx++;
  }

  // Next 1-4 lines often contain title and contact info
  const commonSectionKeywords = [
    "experience",
    "work experience",
    "professional experience",
    "employment",
    "education",
    "skills",
    "technical skills",
    "projects",
    "certifications",
    "summary",
    "professional summary",
    "profile",
    "objective",
  ];

  while (lineIdx < lines.length) {
    const line = lines[lineIdx].trim();
    if (!line) {
      lineIdx++;
      continue;
    }

    const cleanLower = line.toLowerCase().replace(/^#+\s*/, "").replace(/[:\-_*#]/g, "").trim();
    if (commonSectionKeywords.includes(cleanLower)) {
      break; // Found first section header
    }

    if (
      line.includes("@") ||
      line.includes("linkedin") ||
      line.includes("github") ||
      line.includes("http") ||
      /\+?\d[\d\s\-()]{7,}/.test(line) ||
      line.includes("|") ||
      line.includes("•")
    ) {
      const parts = line.split(/[|•·]/).map((p) => p.trim()).filter(Boolean);
      structured.contactDetails.push(...parts);
    } else if (!structured.headline && line.length < 80) {
      structured.headline = line.replace(/^#+\s*/, "").replace(/\*\*/g, "");
    }
    lineIdx++;
  }

  // 2. Parse Remaining Sections
  let currentSection: StructuredSection | null = null;
  let currentItem: StructuredExperienceItem | null = null;

  const isSectionHeader = (line: string): boolean => {
    const clean = line.replace(/^#+\s*/, "").replace(/[:\-_*#]/g, "").trim().toLowerCase();
    return commonSectionKeywords.includes(clean);
  };

  const isDateOrRoleLine = (line: string): boolean => {
    return (
      /\b(20\d\d|19\d\d|present|current|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\b/i.test(line) ||
      line.includes("—") ||
      line.includes(" - ") ||
      line.includes("|")
    );
  };

  const isBulletLine = (line: string): boolean => {
    const trimmed = line.trim();
    return (
      trimmed.startsWith("•") ||
      trimmed.startsWith("-") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("–") ||
      /^\d+\.\s/.test(trimmed)
    );
  };

  for (; lineIdx < lines.length; lineIdx++) {
    const rawLine = lines[lineIdx];
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    if (isSectionHeader(trimmed)) {
      if (currentItem && currentSection) {
        currentSection.items = currentSection.items || [];
        currentSection.items.push(currentItem);
        currentItem = null;
      }
      if (currentSection) {
        structured.sections.push(currentSection);
      }
      currentSection = {
        title: trimmed.replace(/^#+\s*/, "").replace(/[:\-_*#]/g, "").trim(),
        items: [],
        rawLines: [],
      };
      continue;
    }

    if (!currentSection) {
      currentSection = {
        title: "Overview",
        items: [],
        rawLines: [],
      };
    }

    // Check if bullet point
    if (isBulletLine(trimmed)) {
      const cleanBullet = trimmed
        .replace(/^[•\-*–]\s*/, "")
        .replace(/^\d+\.\s*/, "")
        .replace(/\*\*/g, "")
        .trim();

      if (currentItem) {
        currentItem.bullets.push(cleanBullet);
      } else {
        currentSection.rawLines = currentSection.rawLines || [];
        currentSection.rawLines.push(cleanBullet);
      }
      continue;
    }

    // Check if new experience/education/project item header
    const isHeaderLine =
      rawLine.startsWith("###") ||
      rawLine.startsWith("##") ||
      rawLine.startsWith("**") ||
      isDateOrRoleLine(trimmed);

    if (isHeaderLine) {
      if (currentItem) {
        currentSection.items = currentSection.items || [];
        currentSection.items.push(currentItem);
      }

      // Try extracting date, role, company
      let title = trimmed.replace(/^#+\s*/, "").replace(/\*\*/g, "").trim();
      let date = "";
      let organization = "";

      if (title.includes("|")) {
        const parts = title.split("|").map((p) => p.trim());
        title = parts[0];
        if (parts.length > 1) organization = parts[1];
        if (parts.length > 2) date = parts[2];
      } else if (title.includes("—") || title.includes(" - ")) {
        const parts = title.split(/[—\-]/).map((p) => p.trim());
        if (parts.length >= 2 && /\d{4}/.test(parts[parts.length - 1])) {
          date = parts.pop() || "";
          title = parts.join(" — ");
        }
      }

      currentItem = {
        title,
        organization: organization || undefined,
        date: date || undefined,
        bullets: [],
      };
    } else {
      if (currentItem) {
        // Additional description or bullet
        currentItem.bullets.push(trimmed.replace(/\*\*/g, ""));
      } else {
        currentSection.rawLines = currentSection.rawLines || [];
        currentSection.rawLines.push(trimmed);
      }
    }
  }

  if (currentItem && currentSection) {
    currentSection.items = currentSection.items || [];
    currentSection.items.push(currentItem);
  }
  if (currentSection) {
    structured.sections.push(currentSection);
  }

  // Fallback sanity checks
  if (!structured.name) {
    structured.name = "Candidate Resume";
  }

  return structured;
}
