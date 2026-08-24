import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Initialize PDF.js worker safely
try {
  if (typeof window !== "undefined") {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "4.10.38"}/pdf.worker.min.mjs`;
  }
} catch (e) {
  console.warn("PDF.js worker initialization notice:", e);
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

/**
 * Extract clean plain text from DOCX files using mammoth
 */
async function extractTextFromDOCX(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value ? result.value.trim() : "";

    if (!text || text.length === 0) {
      throw new Error("No readable text found in the DOCX file. It might be empty or contain non-text images.");
    }
    return text;
  } catch (err: any) {
    console.error("DOCX parsing error:", err);
    throw new Error(
      "We couldn't read this file. Try re-saving it or pasting the text manually."
    );
  }
}

/**
 * Extract clean plain text from PDF files using pdfjs-dist
 */
async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();

      let lastY: number | null = null;
      let pageText = "";

      for (const item of textContent.items as any[]) {
        if (!item.str) continue;
        if (lastY !== null && Math.abs(item.transform[5] - lastY) > 5) {
          pageText += "\n";
        } else if (pageText.length > 0 && !pageText.endsWith("\n") && !pageText.endsWith(" ")) {
          pageText += " ";
        }
        pageText += item.str;
        lastY = item.transform[5];
      }

      if (pageText.trim()) {
        fullText += (pageNum > 1 ? "\n\n" : "") + pageText.trim();
      }
    }

    const trimmed = fullText.trim();
    if (!trimmed) {
      throw new Error("No selectable text in PDF");
    }
    return trimmed;
  } catch (err: any) {
    console.error("PDF parsing error:", err);
    throw new Error(
      "We couldn't read this file. Try re-saving it or pasting the text manually."
    );
  }
}

/**
 * Extract plain text from text-based formats (.txt, .md, .rtf)
 */
function extractPlainText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || "";
      if (!text.trim()) {
        reject(new Error("We couldn't read this file. Try re-saving it or pasting the text manually."));
        return;
      }
      resolve(text.trim());
    };
    reader.onerror = () =>
      reject(new Error("We couldn't read this file. Try re-saving it or pasting the text manually."));
    reader.readAsText(file, "utf-8");
  });
}

/**
 * Universal Client-Side Document Parser for Resumes
 * Validates file size (max 5MB), format constraints, and handles corruptions gracefully.
 */
export async function parseDocumentFile(file: File): Promise<string> {
  // 1. File Size Validation
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds 5MB limit. Try a smaller file or paste text instead.");
  }

  const fileName = file.name.toLowerCase();

  // 2. Strict Unsupported File Formats (.png, .jpg, .zip, .exe, etc.)
  const supportedExtensions = [".pdf", ".docx", ".txt", ".md", ".markdown", ".rtf"];
  const isSupportedExtension = supportedExtensions.some((ext) => fileName.endsWith(ext));

  if (!isSupportedExtension && !file.type.startsWith("text/")) {
    throw new Error("Unsupported format. Please upload PDF, DOCX, or TXT.");
  }

  // 3. Microsoft Word DOCX
  if (
    fileName.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return await extractTextFromDOCX(file);
  }

  // 4. Legacy Word (.doc)
  if (fileName.endsWith(".doc") || file.type === "application/msword") {
    throw new Error(
      "Legacy .doc format is not supported. Please save/export as .docx or .pdf, or paste the text directly."
    );
  }

  // 5. Adobe PDF
  if (fileName.endsWith(".pdf") || file.type === "application/pdf") {
    return await extractTextFromPDF(file);
  }

  // 6. Plain Text / Markdown / RTF
  if (
    fileName.endsWith(".txt") ||
    fileName.endsWith(".md") ||
    fileName.endsWith(".markdown") ||
    fileName.endsWith(".rtf") ||
    file.type.startsWith("text/")
  ) {
    return await extractPlainText(file);
  }

  throw new Error("Unsupported format. Please upload PDF, DOCX, or TXT.");
}
