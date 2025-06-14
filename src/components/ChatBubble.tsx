import React from 'react';
import { Bot, User } from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatBubbleProps {
  message: ChatMessage;
  isLatest?: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isLatest }) => {
  const isBot = message.type === 'bot';

  return (
    <div className={`flex items-start gap-3 mb-4 ${isBot ? 'justify-start' : 'justify-end'}`}>
      {isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center shadow-lg">
          <Bot size={20} className="text-white" />
        </div>
      )}
      
      <div className={`max-w-md px-4 py-3 rounded-2xl shadow-lg transition-all duration-300 ${
        isBot
          ? 'bg-gray-900 border-2 border-pink-500 text-white shadow-pink-500/20'
          : 'bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white shadow-pink-500/30'
      } ${isLatest ? 'animate-pulse-glow' : ''}`}>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {message.content}
        </p>
        <div className="text-xs opacity-70 mt-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {!isBot && (
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center shadow-lg">
          <User size={20} className="text-white" />
        </div>
      )}
    </div>
  );
};

export default ChatBubble;