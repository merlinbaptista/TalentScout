import React from 'react';
import { Bot, Sparkles, Zap, Users, Clock, CheckCircle } from 'lucide-react';

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center">
        {/* Logo */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-pink-600 to-pink-400 shadow-lg shadow-pink-500/30 mb-6">
            <Bot size={40} className="text-white" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Talent<span className="text-transparent bg-gradient-to-r from-pink-600 to-pink-400 bg-clip-text">Scout</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Your intelligent hiring assistant powered by AI
          </p>
        </div>

        {/* Process Overview */}
        <div className="bg-gray-900 border-2 border-pink-500/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Screening Process Overview</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="text-left">
              <h3 className="text-lg font-semibold text-pink-400 mb-3">📋 Information Collection</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• Full Name & Contact Details</li>
                <li>• Years of Experience</li>
                <li>• Desired Position</li>
                <li>• Current Location</li>
                <li>• Technical Stack</li>
              </ul>
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-pink-400 mb-3">🧠 Technical Assessment</h3>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>• AI-Generated Questions</li>
                <li>• Technology-Specific Queries</li>
                <li>• Problem-Solving Scenarios</li>
                <li>• Best Practices Discussion</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border-2 border-pink-500/30 rounded-xl p-4 hover:border-pink-500 transition-all duration-300">
            <Sparkles className="w-6 h-6 text-pink-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Smart Screening</h3>
            <p className="text-gray-400 text-xs">AI-powered questions tailored to your tech stack</p>
          </div>
          
          <div className="bg-gray-900 border-2 border-pink-500/30 rounded-xl p-4 hover:border-pink-500 transition-all duration-300">
            <Clock className="w-6 h-6 text-pink-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Quick Process</h3>
            <p className="text-gray-400 text-xs">Complete screening in 5-7 minutes</p>
          </div>
          
          <div className="bg-gray-900 border-2 border-pink-500/30 rounded-xl p-4 hover:border-pink-500 transition-all duration-300">
            <Users className="w-6 h-6 text-pink-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Expert Analysis</h3>
            <p className="text-gray-400 text-xs">Professional evaluation of responses</p>
          </div>

          <div className="bg-gray-900 border-2 border-pink-500/30 rounded-xl p-4 hover:border-pink-500 transition-all duration-300">
            <CheckCircle className="w-6 h-6 text-pink-400 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white mb-2">Context Aware</h3>
            <p className="text-gray-400 text-xs">Maintains conversation flow throughout</p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-gray-800 border border-pink-500/20 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-pink-400 mb-2">📌 Important Notes</h3>
          <div className="text-gray-300 text-sm space-y-1">
            <p>• You can type "exit", "quit", or "bye" at any time to end the conversation</p>
            <p>• All responses are validated for accuracy and completeness</p>
            <p>• Technical questions are generated based on your specific tech stack</p>
            <p>• The process maintains context throughout the entire conversation</p>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={onStart}
          className="bg-gradient-to-r from-pink-600 via-pink-500 to-pink-400 text-white py-4 px-8 rounded-xl font-bold text-lg shadow-lg hover:shadow-pink-500/30 hover:scale-105 transition-all duration-300 flex items-center gap-3 mx-auto"
        >
          <Zap size={24} />
          Start Your Screening
        </button>

        <p className="text-gray-500 text-sm mt-4">
          Estimated completion time: 5-7 minutes
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;