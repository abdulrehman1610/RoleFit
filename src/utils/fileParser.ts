import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import { parseDocumentFile } from "../services/documentParser";

/**
 * Universal client-side resume extractor
 */
export async function parseResumeFile(file: File): Promise<{ text: string; fileName: string; fileSize: string }> {
  const sizeKb = (file.size / 1024).toFixed(1) + " KB";
  const text = await parseDocumentFile(file);

  return {
    text,
    fileName: file.name,
    fileSize: sizeKb
  };
}

