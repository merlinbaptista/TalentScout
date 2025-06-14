import React, { useState, useEffect, useRef } from 'react';
import { useChat } from './hooks/useChat';
import WelcomeScreen from './components/WelcomeScreen';
import ChatBubble from './components/ChatBubble';
import ChatInput from './components/ChatInput';
import TypingIndicator from './components/TypingIndicator';
import ProgressBar from './components/ProgressBar';
import { Bot, CheckCircle } from 'lucide-react';

function App() {
  const [showWelcome, setShowWelcome] = useState(true);
  const {
    messages,
    isCompleted,
    isTyping,
    progress,
    handleUserInput,
    startChat,
  } = useChat();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleStart = () => {
    setShowWelcome(false);
    startChat();
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 border-b-2 border-pink-500/30 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-600 to-pink-400 flex items-center justify-center shadow-lg">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">TalentScout</h1>
              <p className="text-sm text-gray-400">AI Hiring Assistant</p>
            </div>
          </div>
          
          {isCompleted && (
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Completed</span>
            </div>
          )}
        </div>
        
        {!isCompleted && (
          <div className="max-w-4xl mx-auto mt-4">
            <ProgressBar progress={progress} />
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatBubble
              key={message.id}
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {isTyping && <TypingIndicator />}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!isCompleted && (
          <ChatInput
            onSendMessage={handleUserInput}
            disabled={isCompleted}
            isTyping={isTyping}
          />
        )}

        {isCompleted && (
          <div className="p-4 bg-gray-900 border-t-2 border-green-500/30 text-center">
            <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
              <CheckCircle size={20} />
              <span className="font-medium">Screening Complete!</span>
            </div>
            <p className="text-sm text-gray-400">
              Thank you for completing the screening process. Our team will review your responses and get back to you soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;