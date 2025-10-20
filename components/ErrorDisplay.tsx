
import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-8 rounded-md" role="alert">
      <p className="font-bold">Error</p>
      <p>{message}</p>
    </div>
  );
};

export default ErrorDisplay;
