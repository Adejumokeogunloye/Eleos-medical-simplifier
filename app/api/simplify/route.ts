import { NextResponse } from "next/server";
import { REPORT_DISCLAIMER, type SimplifiedReport } from "@/types/report";
import { getClientIdentifier, limitRequest } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_REPORT_LENGTH = 50_000;
const RATE_LIMIT_MAX = Number(process.env.SIMPLIFY_RATE_LIMIT_MAX ?? 5);
const RATE_LIMIT_WINDOW_MS = Number(process.env.SIMPLIFY_RATE_LIMIT_WINDOW_MS ?? 600_000);
const FALLBACK_MESSAGE = "We couldn't simplify this report right now. Please try again in a moment.";
const unsafePhrases = /\b(you have|you should|you need to|start taking|stop taking|your diagnosis|this means you have|diagnos(?:is|ed|tic)|prescrib(?:e|ed|ing)|medication|dosage|treatment plan)\b/i;

const reportSchema = { type: "object", additionalProperties: false, required: ["summary", "keyFindings", "termsExplained", "questionsForDoctor", "disclaimer"], properties: { summary: { type: "string" }, keyFindings: { type: "array", items: { type: "string" } }, termsExplained: { type: "array", items: { type: "object", additionalProperties: false, required: ["term", "explanation"], properties: { term: { type: "string" }, explanation: { type: "string" } } } }, questionsForDoctor: { type: "array", items: { type: "string" } }, disclaimer: { type: "string" } } } as const;

const systemPrompt = `You simplify medical report text for educational purposes only. Write in simple, calm, non-alarming language for someone without medical training and define every medical term you use. Use the JSON fields to clearly separate: "What this says" (summary), "What this might mean" (keyFindings), and "Questions to ask your doctor" (questionsForDoctor).

You must never diagnose, state or imply that the person has a condition, recommend or describe treatment, recommend medication, or give medical instructions. Do not use phrases such as "you have", "diagnosis is", "you should take", "you need to", "start taking", or "stop taking". Do not add urgency language, risk predictions, or instructions. If the input does not look like a medical report, say that plainly in the summary and do not guess.

Set disclaimer exactly to: "${REPORT_DISCLAIMER}"`;

const stricterPrompt = `${systemPrompt}\n\nSafety rewrite: The prior draft contained prohibited diagnostic or treatment-like language. Remove every diagnostic conclusion, medication reference, directive, and second-person clinical claim. If a safe educational explanation cannot be made, state that the report wording should be discussed with a qualified clinician without guessing.`;

function fallback() { const result: SimplifiedReport = { summary: FALLBACK_MESSAGE, keyFindings: [], termsExplained: [], questionsForDoctor: [], disclaimer: REPORT_DISCLAIMER }; return NextResponse.json({ error: FALLBACK_MESSAGE, result }, { status: 502 }); }
function hasUnsafeLanguage(result: SimplifiedReport) { return unsafePhrases.test([result.summary, ...result.keyFindings, ...result.termsExplained.flatMap((term) => [term.term, term.explanation]), ...result.questionsForDoctor].join(" ")); }
function isValidResult(result: SimplifiedReport) { return Boolean(result.summary && Array.isArray(result.keyFindings) && Array.isArray(result.termsExplained) && Array.isArray(result.questionsForDoctor)); }

async function generateSummary(apiKey: string, text: string, prompt: string) {
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-5", store: false, input: [{ role: "system", content: [{ type: "input_text", text: prompt }] }, { role: "user", content: [{ type: "input_text", text: `Medical report text:\n${text}` }] }], text: { format: { type: "json_schema", name: "medical_report_simplification", strict: true, schema: reportSchema } } }) });
  if (!response.ok) return null;
  const payload = await response.json() as { output?: Array<{ content?: Array<{ type?: string; text?: string }> }> };
  const outputText = payload.output?.flatMap((item) => item.content ?? []).find((item) => item.type === "output_text")?.text;
  if (!outputText) return null;
  const result = JSON.parse(outputText) as SimplifiedReport;
  return isValidResult(result) ? { ...result, disclaimer: REPORT_DISCLAIMER } : null;
}

export async function POST(request: Request) {
  try {
    const rateLimit = limitRequest(getClientIdentifier(request), RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
    if (!rateLimit.allowed) {
      const retryAfter = Math.max(1, Math.ceil((rateLimit.resetAt - Date.now()) / 1000));
      return NextResponse.json({ error: "You've reached the summary limit. Please try again shortly." }, { status: 429, headers: { "Retry-After": String(retryAfter), "X-RateLimit-Remaining": "0" } });
    }
    const body = await request.json() as { text?: unknown }; const text = typeof body.text === "string" ? body.text.trim() : "";
    if (!text) return NextResponse.json({ error: "Add report text before requesting a summary." }, { status: 400 });
    if (text.length > MAX_REPORT_LENGTH) return NextResponse.json({ error: "This report is too long to simplify in one request." }, { status: 400 });
    const apiKey = process.env.OPENAI_API_KEY; if (!apiKey) return fallback();

    const firstResult = await generateSummary(apiKey, text, systemPrompt);
    if (!firstResult) return fallback();
    const safeResult = hasUnsafeLanguage(firstResult) ? await generateSummary(apiKey, text, stricterPrompt) : firstResult;
    if (!safeResult || hasUnsafeLanguage(safeResult)) return fallback();
    return NextResponse.json(safeResult, { headers: { "X-RateLimit-Remaining": String(rateLimit.remaining) } });
  } catch { return fallback(); }
}
