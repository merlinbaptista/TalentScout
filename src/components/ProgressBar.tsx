import React from 'react';

interface ProgressBarProps {
  progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-gray-800 rounded-full h-2 mb-6 overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-pink-600 via-pink-400 to-pink-600 transition-all duration-500 ease-out shadow-lg"
        style={{ 
          width: `${progress}%`,
          boxShadow: '0 0 20px rgba(248, 28, 229, 0.5)'
        }}
      />
    </div>
  );
};

export default ProgressBar;