import React, { useState, useCallback } from 'react';
import { AnalysisResult } from './types';
import { analyzeResumeAndJD } from './services/geminiService';
import Header from './components/Header';
import Hero from './components/Hero';
import InputSection from './components/InputSection';
import AnalysisDisplay from './components/AnalysisDisplay';
import Loader from './components/Loader';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [resumeText, setResumeText] = useState<string>('');
  const [resumeFileName, setResumeFileName] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isParsing, setIsParsing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = useCallback(async () => {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setError('Please upload your resume file and provide the job description.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeResumeAndJD(resumeText, jobDescription);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError('An error occurred during analysis. Please check your console or try again.');
    } finally {
      setIsLoading(false);
    }
  }, [resumeText, jobDescription]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Hero />
        <InputSection
          setResumeText={setResumeText}
          resumeFileName={resumeFileName}
          setResumeFileName={setResumeFileName}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyze={handleAnalysis}
          isLoading={isLoading}
          isParsing={isParsing}
          setIsParsing={setIsParsing}
        />
        {isLoading && <Loader />}
        {error && <ErrorDisplay message={error} />}
        {analysisResult && !isLoading && <AnalysisDisplay result={analysisResult} />}
      </main>
    </div>
  );
};

export default App;