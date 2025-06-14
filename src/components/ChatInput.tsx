import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  isTyping?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled, isTyping }) => {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-3 p-4 bg-gray-900 border-t-2 border-pink-500/30">
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={isTyping ? "TalentScout is typing..." : "Type your response..."}
          disabled={disabled || isTyping}
          className="w-full px-4 py-3 rounded-xl border-2 border-pink-400/50 bg-black/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        />
        {isTyping && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Loader size={16} className="text-pink-400 animate-spin" />
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={!input.trim() || disabled || isTyping}
        className="px-6 py-3 bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white rounded-xl font-medium shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
      >
        <Send size={18} />
        <span className="hidden sm:inline">Send</span>
      </button>
    </form>
  );
};

export default ChatInput;