export const REPORT_DISCLAIMER =
  "This is a simplified summary for educational purposes only and is not a medical diagnosis. Please discuss these results with your doctor.";

export type ExplainedTerm = {
  term: string;
  explanation: string;
};

export type SimplifiedReport = {
  summary: string;
  keyFindings: string[];
  termsExplained: ExplainedTerm[];
  questionsForDoctor: string[];
  disclaimer: string;
};
