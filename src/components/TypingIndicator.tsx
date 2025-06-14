import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center shadow-lg">
        <Bot size={20} className="text-white" />
      </div>
      
      <div className="bg-gray-900 border-2 border-pink-500 px-4 py-3 rounded-2xl shadow-lg shadow-pink-500/20">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;