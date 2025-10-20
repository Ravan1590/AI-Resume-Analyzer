import React from 'react';
import { AnalysisResult, ImprovementArea } from '../types';

declare const jspdf: any;

const ScoreCard: React.FC<{ score: number }> = ({ score }) => {
  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md text-center">
      <h3 className="text-lg font-semibold text-gray-600 mb-2">Match Score</h3>
      <p className={`text-6xl font-bold ${getScoreColor()}`}>{score}%</p>
      <p className="text-gray-500 mt-2">This score reflects how well your resume aligns with the job description.</p>
    </div>
  );
};

const ImprovementCard: React.FC<{ improvement: ImprovementArea }> = ({ improvement }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <h4 className="font-bold text-gray-800">{improvement.section}</h4>
      <p className="text-gray-600 mt-1 mb-4">{improvement.suggestion}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="font-semibold text-red-600 mb-1">Original Text:</p>
          <p className="text-gray-700 bg-red-50 p-2 rounded border border-red-200 whitespace-pre-wrap">{improvement.originalText}</p>
        </div>
        <div>
          <p className="font-semibold text-emerald-600 mb-1">Suggested Text:</p>
          <p className="text-gray-700 bg-emerald-50 p-2 rounded border border-emerald-200 whitespace-pre-wrap">{improvement.suggestedText}</p>
        </div>
      </div>
    </div>
  );
};

const AnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  const handleDownload = () => {
    if (typeof jspdf === 'undefined') {
      alert('PDF generation library is not loaded. Please try refreshing the page.');
      return;
    }
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(11);
    
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const usableWidth = pageWidth - margin * 2;

    const lines = doc.splitTextToSize(result.improvedResume, usableWidth);
    doc.text(lines, margin, margin);

    doc.save('Improved_Resume.pdf');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <ScoreCard score={result.matchScore} />
        </div>
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Executive Summary</h3>
          <p className="text-gray-600">{result.summary}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Strengths</h3>
        <ul className="list-disc list-inside space-y-2">
          {result.strengths.map((strength, index) => (
            <li key={index} className="text-gray-700">{strength}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Areas for Improvement</h3>
        <div className="space-y-4">
          {result.areasForImprovement.map((item, index) => (
            <ImprovementCard key={index} improvement={item} />
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold text-gray-800">Your Improved Resume</h3>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-opacity-75 transition-colors flex items-center space-x-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            <span>Download .pdf</span>
          </button>
        </div>
        <pre className="bg-gray-50 p-4 rounded-md border border-gray-200 text-gray-800 whitespace-pre-wrap font-sans text-sm">{result.improvedResume}</pre>
      </div>
    </div>
  );
};

export default AnalysisDisplay;