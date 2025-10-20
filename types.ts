
export interface ImprovementArea {
  section: string;
  suggestion: string;
  originalText: string;
  suggestedText: string;
}

export interface AnalysisResult {
  matchScore: number;
  summary: string;
  strengths: string[];
  areasForImprovement: ImprovementArea[];
  improvedResume: string;
}
