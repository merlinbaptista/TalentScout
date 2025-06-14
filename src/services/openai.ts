import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export interface ChatContext {
  userInfo: {
    fullName?: string;
    email?: string;
    phone?: string;
    experience?: string;
    role?: string;
    location?: string;
    techStack?: string;
    techAnswers?: string[];
  };
  currentStep: string;
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  isCompleted?: boolean;
}

// Keywords that trigger conversation ending
const CONVERSATION_ENDING_KEYWORDS = [
  'bye', 'goodbye', 'exit', 'quit', 'stop', 'end', 'cancel', 
  'no thanks', 'not interested', 'leave', 'done', 'finish'
];

export const checkForConversationEnd = (input: string): boolean => {
  const lowerInput = input.toLowerCase().trim();
  return CONVERSATION_ENDING_KEYWORDS.some(keyword => 
    lowerInput.includes(keyword) || lowerInput === keyword
  );
};

export const generateBotResponse = async (
  userInput: string,
  context: ChatContext
): Promise<string> => {
  try {
    // Check for conversation ending keywords
    if (checkForConversationEnd(userInput)) {
      return "Thank you for your time! If you'd like to continue the screening process later, feel free to restart. Have a great day! 👋";
    }

    const systemPrompt = `You are TalentScout, an intelligent hiring assistant chatbot conducting a professional screening interview.

CORE PURPOSE: Collect candidate information and assess technical skills through structured questions.

STRICT GUIDELINES:
- NEVER deviate from the hiring/screening purpose
- Keep responses concise (1-2 sentences max)
- Ask only ONE question at a time
- Be friendly but maintain professionalism
- If user gives irrelevant input, redirect back to the interview
- Maintain conversation context throughout
- Validate responses appropriately
- Generate technical questions based on declared tech stack

CONVERSATION FLOW:
1. Greeting & purpose explanation
2. Collect: Full Name, Email, Phone, Experience, Desired Position, Location, Tech Stack
3. Generate 3-5 technical questions based on tech stack
4. Graceful conclusion with next steps

Current step: ${context.currentStep}
User info collected: ${JSON.stringify(context.userInfo, null, 2)}

If user input is off-topic or unclear, politely redirect to the current question without being rude.`;

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...context.conversationHistory.slice(-10), // Keep last 10 messages for context
      { role: 'user' as const, content: userInput }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 120,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I didn't catch that. Could you please try again?";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return getFallbackResponse(context.currentStep);
  }
};

export const generateTechQuestions = async (techStack: string): Promise<string[]> => {
  try {
    const prompt = `Generate exactly 4 technical screening questions for this tech stack: "${techStack}"

Requirements:
- Questions should assess practical knowledge and experience
- Mix of conceptual and practical questions
- Appropriate difficulty for job screening
- Each question on a separate line
- No numbering or bullets
- Focus on the specific technologies mentioned

Tech stack: ${techStack}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.8,
    });

    const response = completion.choices[0]?.message?.content || '';
    const questions = response
      .split('\n')
      .filter(q => q.trim().length > 10)
      .map(q => q.replace(/^\d+\.?\s*/, '').trim())
      .slice(0, 4);
    
    if (questions.length < 3) {
      return getFallbackTechQuestions(techStack);
    }
    
    return questions;
  } catch (error) {
    console.error('Error generating tech questions:', error);
    return getFallbackTechQuestions(techStack);
  }
};

export const validateUserInput = async (
  input: string,
  expectedField: string
): Promise<{ isValid: boolean; message?: string }> => {
  const trimmedInput = input.trim();
  
  // Check for conversation ending
  if (checkForConversationEnd(input)) {
    return { isValid: true }; // Let the main handler deal with ending
  }

  // Field-specific validation
  switch (expectedField) {
    case 'fullName':
      if (trimmedInput.length < 2) {
        return { isValid: false, message: "Please enter your full name (at least 2 characters)." };
      }
      if (!/^[a-zA-Z\s'-]+$/.test(trimmedInput)) {
        return { isValid: false, message: "Please enter a valid name using only letters, spaces, hyphens, and apostrophes." };
      }
      break;

    case 'email':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedInput)) {
        return { isValid: false, message: "Please enter a valid email address (e.g., john@example.com)." };
      }
      break;

    case 'phone':
      const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
      if (!phoneRegex.test(trimmedInput)) {
        return { isValid: false, message: "Please enter a valid phone number (at least 10 digits)." };
      }
      break;

    case 'experience':
      const expMatch = trimmedInput.match(/(\d+)/);
      if (!expMatch) {
        return { isValid: false, message: "Please enter the number of years of experience (e.g., '3 years' or just '3')." };
      }
      const years = parseInt(expMatch[1]);
      if (years < 0 || years > 50) {
        return { isValid: false, message: "Please enter a realistic number of years (0-50)." };
      }
      break;

    case 'role':
      if (trimmedInput.length < 2) {
        return { isValid: false, message: "Please specify the position you're interested in." };
      }
      break;

    case 'location':
      if (trimmedInput.length < 2) {
        return { isValid: false, message: "Please enter your current location (city, state/country)." };
      }
      break;

    case 'techStack':
      if (trimmedInput.length < 3) {
        return { isValid: false, message: "Please list your technical skills and technologies (e.g., Python, React, MySQL)." };
      }
      break;

    default:
      if (trimmedInput.length === 0) {
        return { isValid: false, message: "This field is required. Please provide an answer." };
      }
  }
  
  return { isValid: true };
};

export const generateFallbackResponse = async (
  userInput: string,
  context: ChatContext
): Promise<string> => {
  // Handle unclear or off-topic responses
  const responses = [
    "I didn't quite understand that. Let's keep focused on the screening process.",
    "I'm here to help with your job application. Could you please answer the current question?",
    "Let's stay on track with the interview. Please provide the requested information.",
    "I need to collect some specific information for your application. Could you help me with that?"
  ];
  
  const randomResponse = responses[Math.floor(Math.random() * responses.length)];
  return `${randomResponse} ${getCurrentQuestionPrompt(context.currentStep)}`;
};

const getFallbackResponse = (currentStep: string): string => {
  const fallbacks: Record<string, string> = {
    'greeting': "What's your full name?",
    'fullName': "What's your full name?",
    'email': "Can I get your email address?",
    'phone': "What's your phone number?",
    'experience': "How many years of experience do you have?",
    'role': "What position are you interested in?",
    'location': "Where are you currently based?",
    'techStack': "What's your tech stack? (e.g., Python, Django, MySQL, React)",
    'completion': "Thank you for completing the screening! Our team will review your responses and get back to you soon."
  };
  
  return fallbacks[currentStep] || "Could you please provide that information again?";
};

const getFallbackTechQuestions = (techStack: string): string[] => {
  const technologies = techStack.toLowerCase();
  const questions: string[] = [];
  
  // Technology-specific questions
  if (technologies.includes('react') || technologies.includes('javascript') || technologies.includes('js')) {
    questions.push('How do you handle state management in React applications?');
    questions.push('Explain the difference between props and state in React.');
  }
  
  if (technologies.includes('python')) {
    questions.push('Describe your experience with Python frameworks like Django or Flask.');
    questions.push('How do you handle error handling and debugging in Python?');
  }
  
  if (technologies.includes('java')) {
    questions.push('Explain the concept of object-oriented programming in Java.');
    questions.push('How do you handle memory management in Java applications?');
  }
  
  if (technologies.includes('sql') || technologies.includes('database')) {
    questions.push('How do you optimize database queries for better performance?');
    questions.push('Explain the difference between SQL joins and when to use each type.');
  }
  
  if (technologies.includes('node') || technologies.includes('express')) {
    questions.push('How do you handle asynchronous operations in Node.js?');
  }
  
  // Generic fallback questions
  const genericQuestions = [
    'Describe a challenging technical problem you solved recently and your approach.',
    'How do you stay updated with new technologies and best practices in your field?',
    'What development tools and practices do you use to ensure code quality?',
    'Explain your experience with version control systems like Git.',
    'How do you approach debugging when you encounter a difficult technical issue?'
  ];
  
  // Fill remaining slots with generic questions
  while (questions.length < 4) {
    const remaining = genericQuestions.filter(q => !questions.includes(q));
    if (remaining.length === 0) break;
    questions.push(remaining[Math.floor(Math.random() * remaining.length)]);
  }
  
  return questions.slice(0, 4);
};

const getCurrentQuestionPrompt = (currentStep: string): string => {
  const prompts: Record<string, string> = {
    'fullName': "What's your full name?",
    'email': "What's your email address?",
    'phone': "What's your phone number?",
    'experience': "How many years of experience do you have?",
    'role': "What position are you interested in?",
    'location': "Where are you currently located?",
    'techStack': "What technologies do you work with?"
  };
  
  return prompts[currentStep] || "Please answer the current question.";
};