/**
 * Safe clipboard copy with automatic fallback when permissions/APIs fail
 */
export async function safeCopyToClipboard(text: string): Promise<{ success: boolean; fallbackUsed?: boolean }> {
  if (!text) return { success: false };

  // Attempt standard modern Clipboard API
  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return { success: true };
    } catch (err) {
      console.warn("navigator.clipboard.writeText failed, attempting textarea fallback:", err);
    }
  }

  // Fallback: Create invisible textarea and execCommand
  try {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.width = "2em";
    textArea.style.height = "2em";
    textArea.style.padding = "0";
    textArea.style.border = "none";
    textArea.style.outline = "none";
    textArea.style.boxShadow = "none";
    textArea.style.background = "transparent";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    const successful = document.execCommand("copy");
    document.body.removeChild(textArea);

    if (successful) {
      return { success: true, fallbackUsed: true };
    }
  } catch (fallbackErr) {
    console.error("ExecCommand copy fallback failed:", fallbackErr);
  }

  return { success: false };
}

/**
 * Safe file download helper with error handling
 */
export function safeDownloadFile(
  content: string,
  fileName: string,
  mimeType: string = "text/plain;charset=utf-8"
): { success: boolean; error?: string } {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return { success: true };
  } catch (err: any) {
    console.error("Safe file download error:", err);
    return { success: false, error: err?.message || "File download failed." };
  }
}
