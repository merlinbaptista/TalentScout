import { ChatStep } from '../types';

export const initialSteps: ChatStep[] = [
  {
    id: 'name',
    question: "What's your full name?",
    field: 'fullName',
    completed: false,
  },
  {
    id: 'email',
    question: 'Can I get your email address?',
    field: 'email',
    completed: false,
  },
  {
    id: 'phone',
    question: "What's your phone number?",
    field: 'phone',
    completed: false,
  },
  {
    id: 'experience',
    question: 'How many years of experience do you have?',
    field: 'experience',
    completed: false,
  },
  {
    id: 'role',
    question: 'What role are you interested in?',
    field: 'role',
    completed: false,
  },
  {
    id: 'location',
    question: 'Where are you currently based?',
    field: 'location',
    completed: false,
  },
  {
    id: 'techStack',
    question: "What's your tech stack? (e.g., Python, Django, MySQL, React)",
    field: 'techStack',
    completed: false,
  },
];

// Legacy functions kept for fallback compatibility
export const generateTechQuestions = (techStack: string): string[] => {
  const technologies = techStack.toLowerCase().split(',').map(t => t.trim());
  const questions: string[] = [];
  
  if (technologies.some(tech => tech.includes('react') || tech.includes('js') || tech.includes('javascript'))) {
    questions.push('How do you handle state management in React applications?');
  }
  
  if (technologies.some(tech => tech.includes('python') || tech.includes('django'))) {
    questions.push('Describe your experience with Python frameworks and RESTful API development.');
  }
  
  if (technologies.some(tech => tech.includes('sql') || tech.includes('database'))) {
    questions.push('How do you optimize database queries for better performance?');
  }
  
  if (questions.length === 0) {
    questions.push(
      'Describe a challenging technical problem you solved recently.',
      'How do you stay updated with new technologies in your field?',
      'What development tools and practices do you use for code quality?'
    );
  }
  
  return questions.slice(0, 3);
};

export const validateInput = (field: string, value: string): boolean => {
  switch (field) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
      return /^\+?[\d\s\-\(\)]{10,}$/.test(value);
    default:
      return value.trim().length > 0;
  }
};

export const getValidationMessage = (field: string): string => {
  switch (field) {
    case 'email':
      return 'Please enter a valid email address.';
    case 'phone':
      return 'Please enter a valid phone number.';
    default:
      return 'This field is required.';
  }
};