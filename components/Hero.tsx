
import React from 'react';

const Hero: React.FC = () => {
  return (
    <div className="text-center py-10 mb-8 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-4xl font-extrabold text-gray-900 mb-2">Get Your Dream Job Faster</h2>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        Paste your resume and a job description below. Our AI will analyze them and provide a match score, detailed feedback, and an improved version of your resume tailored for the role.
      </p>
    </div>
  );
};

export default Hero;
