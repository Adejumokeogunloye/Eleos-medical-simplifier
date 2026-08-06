import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 20 * 1024 * 1024;
const READ_ERROR = "We couldn't read this file — try a clearer scan or a text-based PDF.";

function extractionError(status = 422) {
  return NextResponse.json({ error: READ_ERROR }, { status });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a PDF or image file to continue." }, { status: 400 });
    }
    if (file.size === 0 || file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Choose a file smaller than 20 MB." }, { status: 400 });
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isImage = file.type.startsWith("image/");
    if (!isPdf && !isImage) {
      return NextResponse.json({ error: "Only PDF and image files are supported." }, { status: 400 });
    }

    // The uploaded bytes exist only in this request's memory and are discarded after the response.
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    if (isPdf) {
      const pdf = (await import("pdf-parse")).default;
      const result = await pdf(buffer);
      rawText = result.text.trim();
    } else {
      const { recognize } = await import("tesseract.js");
      // A cloud OCR provider can be swapped in here later if higher accuracy is required.
      const result = await recognize(buffer, "eng", { logger: () => undefined });
      rawText = result.data.text.trim();
    }

    if (!rawText) return extractionError();
    return NextResponse.json({ text: rawText });
  } catch {
    return extractionError();
  }
}
