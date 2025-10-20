
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    matchScore: {
      type: Type.NUMBER,
      description: "A score from 0 to 100 indicating how well the resume matches the job description."
    },
    summary: {
      type: Type.STRING,
      description: "A concise summary of the resume's strengths and weaknesses against the job description."
    },
    strengths: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "An array of strings listing specific strengths of the resume."
    },
    areasForImprovement: {
      type: Type.ARRAY,
      description: "An array of objects detailing specific suggestions for improvement.",
      items: {
        type: Type.OBJECT,
        properties: {
          section: { type: Type.STRING, description: "The resume section to improve (e.g., 'Summary', 'Experience')." },
          suggestion: { type: Type.STRING, description: "A concrete suggestion for improvement." },
          originalText: { type: Type.STRING, description: "The original text snippet from the resume." },
          suggestedText: { type: Type.STRING, description: "The suggested improved text snippet." },
        },
        required: ["section", "suggestion", "originalText", "suggestedText"],
      },
    },
    improvedResume: {
      type: Type.STRING,
      description: "The full text of the resume with all suggestions incorporated."
    },
  },
  required: ["matchScore", "summary", "strengths", "areasForImprovement", "improvedResume"],
};

const createPrompt = (resumeText: string, jobDescription: string): string => `
You are an expert career coach and professional resume writer with years of experience helping candidates land jobs at top companies. Your task is to analyze the provided resume against the given job description.

**Resume:**
\`\`\`
${resumeText}
\`\`\`

**Job Description:**
\`\`\`
${jobDescription}
\`\`\`

Provide a detailed analysis in the specified JSON format. The analysis must include:
1.  **matchScore**: An integer score from 0 to 100 representing how well the resume matches the job description. Be critical and realistic.
2.  **summary**: A concise, professional summary of the analysis, highlighting key strengths and areas for improvement.
3.  **strengths**: An array of strings detailing specific strengths, such as relevant skills or experiences mentioned.
4.  **areasForImprovement**: An array of objects, where each object identifies a specific section of the resume, provides a concrete suggestion for improvement, and includes the original and suggested text snippets. Focus on tailoring the resume to the job description, quantifying achievements, and using strong action verbs.
5.  **improvedResume**: The full text of the improved resume with all your suggestions incorporated. This should be a complete, polished resume ready to be used.

Analyze thoroughly and provide high-quality, actionable feedback.
`;

export const analyzeResumeAndJD = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
  const prompt = createPrompt(resumeText, jobDescription);

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      temperature: 0.2,
    },
  });

  const jsonText = response.text.trim();
  
  try {
    // Gemini with JSON schema might still wrap the output in markdown backticks
    const cleanedJsonText = jsonText.replace(/^```json\s*|```$/g, '');
    const parsedResult = JSON.parse(cleanedJsonText);
    return parsedResult as AnalysisResult;
  } catch (e) {
    console.error("Failed to parse Gemini response:", jsonText);
    throw new Error("The AI returned an invalid response format. Please try again.");
  }
};
