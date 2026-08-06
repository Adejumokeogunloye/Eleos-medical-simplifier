import { NextResponse } from "next/server";
import { REPORT_DISCLAIMER, type SimplifiedReport } from "@/types/report";

export const runtime = "nodejs";

const MAX_REPORT_LENGTH = 50_000;
const FALLBACK_MESSAGE = "We couldn't simplify this report right now. Please try again in a moment.";

const reportSchema = {
  type: "object",
  additionalProperties: false,
  required: ["summary", "keyFindings", "termsExplained", "questionsForDoctor", "disclaimer"],
  properties: {
    summary: { type: "string" },
    keyFindings: { type: "array", items: { type: "string" } },
    termsExplained: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["term", "explanation"],
        properties: { term: { type: "string" }, explanation: { type: "string" } },
      },
    },
    questionsForDoctor: { type: "array", items: { type: "string" } },
    disclaimer: { type: "string" },
  },
} as const;

const systemPrompt = `You simplify medical report text for educational purposes only.

Write in simple, calm, non-alarming language for a person without medical training. Define every medical term you use. Clearly organize the response into these parts within the matching JSON fields: "What this says" (summary), "What this might mean" (keyFindings), and "Questions to ask your doctor" (questionsForDoctor).

Never state or imply a diagnosis. Never recommend treatment. Never tell the person what to do medically. Do not add urgency language, risk predictions, or instructions. If the input does not look like a medical report, say that plainly in the summary and do not guess.

Set disclaimer exactly to: "${REPORT_DISCLAIMER}"`;

function fallback() {
  const result: SimplifiedReport = {
    summary: FALLBACK_MESSAGE,
    keyFindings: [],
    termsExplained: [],
    questionsForDoctor: [],
    disclaimer: REPORT_DISCLAIMER,
  };
  return NextResponse.json({ error: FALLBACK_MESSAGE, result }, { status: 502 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { text?: unknown };
    const text = typeof body.text === "string" ? body.text.trim() : "";

    if (!text) return NextResponse.json({ error: "Add report text before requesting a summary." }, { status: 400 });
    if (text.length > MAX_REPORT_LENGTH) return NextResponse.json({ error: "This report is too long to simplify in one request." }, { status: 400 });

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return fallback();

    // store: false avoids retaining this report in the Responses API application state.
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-5",
        store: false,
        input: [
          { role: "system", content: [{ type: "input_text", text: systemPrompt }] },
          { role: "user", content: [{ type: "input_text", text: `Medical report text:\n${text}` }] },
        ],
        text: { format: { type: "json_schema", name: "medical_report_simplification", strict: true, schema: reportSchema } },
      }),
    });

    if (!response.ok) return fallback();
    const payload = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
    const outputText = payload.output
      ?.flatMap((item) => item.content ?? [])
      .find((item) => item.type === "output_text")?.text;
    if (!outputText) return fallback();

    const result = JSON.parse(outputText) as SimplifiedReport;
    if (!result.summary || !Array.isArray(result.keyFindings) || !Array.isArray(result.termsExplained) || !Array.isArray(result.questionsForDoctor)) return fallback();
    return NextResponse.json({ ...result, disclaimer: REPORT_DISCLAIMER });
  } catch {
    return fallback();
  }
}
