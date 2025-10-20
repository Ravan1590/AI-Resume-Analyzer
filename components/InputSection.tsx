import React from 'react';

declare const mammoth: any;

interface InputSectionProps {
  setResumeText: (text: string) => void;
  resumeFileName: string;
  setResumeFileName: (name: string) => void;
  jobDescription: string;
  setJobDescription: (text: string) => void;
  onAnalyze: () => void;
  isLoading: boolean;
  isParsing: boolean;
  setIsParsing: (isParsing: boolean) => void;
}

const InputSection: React.FC<InputSectionProps> = ({
  setResumeText,
  resumeFileName,
  setResumeFileName,
  jobDescription,
  setJobDescription,
  onAnalyze,
  isLoading,
  isParsing,
  setIsParsing,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsParsing(true);
    setResumeFileName(file.name);
    setResumeText('');

    try {
      const extension = file.name.split('.').pop()?.toLowerCase();
      let text = '';

      const reader = new FileReader();

      if (extension === 'pdf') {
        const pdfjsLib = await import('https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.min.mjs');
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://unpkg.com/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';
        
        reader.readAsArrayBuffer(file);
        await new Promise<void>((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
              const pageTexts = [];
              for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const textContent = await page.getTextContent();
                pageTexts.push(textContent.items.map((item: any) => item.str).join(' '));
              }
              text = pageTexts.join('\\n');
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
        });
      } else if (extension === 'docx' || extension === 'doc') {
        if (typeof mammoth === 'undefined') {
          throw new Error('File parsing library (Mammoth.js) is not loaded.');
        }
        reader.readAsArrayBuffer(file);
        await new Promise<void>((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              const arrayBuffer = e.target?.result as ArrayBuffer;
              const result = await mammoth.extractRawText({ arrayBuffer: arrayBuffer });
              text = result.value;
              resolve();
            } catch (error) {
              reject(error);
            }
          };
          reader.onerror = (error) => reject(error);
        });
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, DOC, or DOCX file.');
      }

      setResumeText(text);
    } catch (error: any) {
      console.error("Error processing file:", error);
      alert(error.message || "An error occurred while reading the file.");
      setResumeFileName('');
      setResumeText('');
    } finally {
      setIsParsing(false);
    }
  };

  const handleLabelClick = () => {
    if (!isParsing) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label htmlFor="resume-upload" className="block text-lg font-semibold text-gray-700 mb-2">Upload Your Resume</label>
          <div
            className={`w-full p-4 border-2 border-dashed border-gray-700 bg-slate-800 rounded-md flex flex-col items-center justify-center text-center transition duration-150 ease-in-out h-[350px] ${isParsing ? 'cursor-wait' : 'cursor-pointer hover:border-indigo-500 hover:bg-slate-700'}`}
            onClick={handleLabelClick}
          >
            <input
              type="file"
              id="resume-upload"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx"
              disabled={isParsing}
            />
            {isParsing ? (
              <>
                <div className="w-12 h-12 border-4 border-t-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin mb-3"></div>
                <p className="font-semibold text-gray-200">Parsing file...</p>
                <p className="text-sm text-gray-400 mt-1 break-all px-2">{resumeFileName}</p>
              </>
            ) : resumeFileName ? (
              <>
                <svg className="w-12 h-12 text-emerald-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-semibold text-indigo-600 break-all px-2">{resumeFileName}</p>
                <p className="text-sm text-gray-400 mt-1">Click to choose a different file</p>
              </>
            ) : (
              <>
                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                <p className="font-semibold text-gray-200">Click to upload a file</p>
                <p className="text-sm text-gray-400 mt-1">PDF, DOC, or DOCX files only</p>
              </>
            )}
          </div>
        </div>
        <div>
          <label htmlFor="job-description" className="block text-lg font-semibold text-gray-700 mb-2">Job Description</label>
          <textarea
            id="job-description"
            rows={15}
            className="w-full p-4 border border-gray-700 bg-slate-800 text-white placeholder:text-gray-400 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out h-[350px]"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
          />
        </div>
      </div>
      <div className="mt-8 text-center">
        <button
          onClick={onAnalyze}
          disabled={isLoading || isParsing}
          className="px-8 py-4 bg-indigo-600 text-white font-bold text-lg rounded-lg shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-transform transform hover:scale-105 disabled:bg-indigo-400 disabled:cursor-not-allowed disabled:scale-100"
        >
          {isLoading ? 'Analyzing...' : isParsing ? 'Processing File...' : 'Analyze My Resume'}
        </button>
      </div>
    </div>
  );
};

export default InputSection;