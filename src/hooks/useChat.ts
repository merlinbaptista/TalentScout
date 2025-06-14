import { useState, useCallback } from 'react';
import { ChatMessage, UserData, ChatStep } from '../types';
import { initialSteps } from '../utils/chatFlow';
import { 
  generateBotResponse, 
  generateTechQuestions, 
  validateUserInput, 
  generateFallbackResponse,
  checkForConversationEnd,
  ChatContext 
} from '../services/openai';

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentStep, setCurrentStep] = useState(-1); // Start at -1 for greeting
  const [steps, setSteps] = useState<ChatStep[]>(initialSteps);
  const [userData, setUserData] = useState<UserData>({
    fullName: '',
    email: '',
    phone: '',
    experience: '',
    role: '',
    location: '',
    techStack: '',
    techAnswers: [],
  });
  const [techQuestions, setTechQuestions] = useState<string[]>([]);
  const [techQuestionIndex, setTechQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    role: 'user' | 'assistant';
    content: string;
  }>>([]);

  const addMessage = useCallback((content: string, type: 'bot' | 'user') => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      type,
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
    
    // Update conversation history for OpenAI context
    setConversationHistory(prev => [...prev, {
      role: type === 'bot' ? 'assistant' : 'user',
      content
    }]);
  }, []);

  const simulateTyping = useCallback((callback: () => void, delay = 1500) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      callback();
    }, delay);
  }, []);

  const endConversation = useCallback(() => {
    setIsCompleted(true);
    simulateTyping(() => {
      addMessage(
        "Thank you for your interest! If you'd like to complete the screening process in the future, please feel free to return. Have a wonderful day! 👋",
        'bot'
      );
    });
  }, [addMessage, simulateTyping]);

  const handleUserInput = useCallback(async (input: string) => {
    if (isCompleted) return;

    // Check for conversation ending keywords
    if (checkForConversationEnd(input)) {
      addMessage(input, 'user');
      endConversation();
      return;
    }

    addMessage(input, 'user');

    // Handle basic information gathering
    if (currentStep >= 0 && currentStep < steps.length) {
      const currentStepData = steps[currentStep];
      
      // Validate input
      const validation = await validateUserInput(input, currentStepData.field);
      if (!validation.isValid) {
        simulateTyping(() => {
          addMessage(validation.message || "I'm sorry, that doesn't look quite right. Could you please try again?", 'bot');
        });
        return;
      }

      // Update user data
      const updatedUserData = {
        ...userData,
        [currentStepData.field]: input,
      };
      setUserData(updatedUserData);

      // Mark step as completed
      setSteps(prev => prev.map((step, index) => 
        index === currentStep ? { ...step, completed: true } : step
      ));

      const nextStep = currentStep + 1;

      if (nextStep < steps.length) {
        // Move to next basic question
        setCurrentStep(nextStep);
        
        const context: ChatContext = {
          userInfo: updatedUserData,
          currentStep: steps[nextStep].field,
          conversationHistory
        };

        simulateTyping(async () => {
          try {
            const botResponse = await generateBotResponse(
              `Please ask for ${steps[nextStep].field}`, 
              context
            );
            addMessage(botResponse, 'bot');
          } catch (error) {
            addMessage(steps[nextStep].question, 'bot');
          }
        });
      } else if (currentStepData.field === 'techStack') {
        // Generate technical questions based on tech stack
        simulateTyping(async () => {
          try {
            const questions = await generateTechQuestions(input);
            setTechQuestions(questions);
            setTechQuestionIndex(0);
            
            addMessage(`Perfect! Based on your tech stack (${input}), I have some technical questions to assess your expertise:`, 'bot');
            setTimeout(() => {
              addMessage(`Question 1: ${questions[0]}`, 'bot');
            }, 1500);
          } catch (error) {
            const fallbackQuestions = [
              "Describe a challenging technical problem you solved recently.",
              "How do you approach learning new technologies?",
              "What development practices do you follow for code quality?",
              "How do you handle debugging complex issues?"
            ];
            setTechQuestions(fallbackQuestions);
            setTechQuestionIndex(0);
            
            addMessage("Great! Now let me ask you some technical questions:", 'bot');
            setTimeout(() => {
              addMessage(`Question 1: ${fallbackQuestions[0]}`, 'bot');
            }, 1500);
          }
        });
      }
    } 
    // Handle technical questions
    else if (techQuestionIndex < techQuestions.length) {
      // Store technical answer
      setUserData(prev => ({
        ...prev,
        techAnswers: [...prev.techAnswers, input],
      }));

      const nextTechIndex = techQuestionIndex + 1;
      
      if (nextTechIndex < techQuestions.length) {
        setTechQuestionIndex(nextTechIndex);
        simulateTyping(() => {
          addMessage(`Question ${nextTechIndex + 1}: ${techQuestions[nextTechIndex]}`, 'bot');
        });
      } else {
        // Complete the screening process
        setIsCompleted(true);
        
        const context: ChatContext = {
          userInfo: userData,
          currentStep: 'completion',
          conversationHistory,
          isCompleted: true
        };

        simulateTyping(async () => {
          try {
            const closingMessage = await generateBotResponse(
              'Generate a professional closing message for completed screening',
              context
            );
            addMessage(closingMessage, 'bot');
          } catch (error) {
            addMessage(
              `Excellent work, ${userData.fullName}! 🎉\n\nYou've successfully completed the screening process. Here's what happens next:\n\n✅ Our technical team will review your responses\n✅ We'll evaluate your fit for the ${userData.role} position\n✅ You can expect to hear back from us within 2-3 business days\n\nThank you for your time and interest in joining our team!`,
              'bot'
            );
          }
        }, 2000);
      }
    }
    // Handle unexpected input or off-topic responses
    else {
      const context: ChatContext = {
        userInfo: userData,
        currentStep: 'fallback',
        conversationHistory
      };

      simulateTyping(async () => {
        try {
          const fallbackResponse = await generateFallbackResponse(input, context);
          addMessage(fallbackResponse, 'bot');
        } catch (error) {
          addMessage("I'm here to help with your job screening. Is there anything specific you'd like to know about the process?", 'bot');
        }
      });
    }
  }, [currentStep, steps, userData, techQuestions, techQuestionIndex, isCompleted, conversationHistory, addMessage, simulateTyping, endConversation]);

  const startChat = useCallback(async () => {
    // Initial greeting with purpose overview
    const greetingMessage = `Hello! 👋 I'm TalentScout, your intelligent hiring assistant.\n\nI'm here to guide you through a quick screening process that will help us understand your background and technical expertise. This will take about 5-7 minutes and includes:\n\n📝 Basic information collection\n💻 Technical questions based on your skills\n🎯 Assessment of your experience\n\nReady to get started? Let's begin!`;
    
    addMessage(greetingMessage, 'bot');
    
    // Start with first question after a brief pause
    setTimeout(() => {
      setCurrentStep(0);
      simulateTyping(async () => {
        try {
          const context: ChatContext = {
            userInfo: {},
            currentStep: 'fullName',
            conversationHistory: []
          };
          
          const botResponse = await generateBotResponse('Ask for full name', context);
          addMessage(botResponse, 'bot');
        } catch (error) {
          addMessage(steps[0].question, 'bot');
        }
      });
    }, 2000);
  }, [steps, addMessage, simulateTyping]);

  // Calculate progress including tech questions
  const totalSteps = steps.length + (techQuestions.length || 4); // Assume 4 tech questions for progress calculation
  const completedSteps = Math.max(0, currentStep) + techQuestionIndex;
  const progress = (completedSteps / totalSteps) * 100;

  return {
    messages,
    currentStep,
    steps,
    userData,
    techQuestions,
    isCompleted,
    isTyping,
    progress: Math.min(progress, 100),
    handleUserInput,
    startChat,
  };
};