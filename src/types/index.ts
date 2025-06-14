export interface UserData {
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  role: string;
  location: string;
  techStack: string;
  techAnswers: string[];
}

export interface ChatMessage {
  id: string;
  type: 'bot' | 'user';
  content: string;
  timestamp: Date;
}

export interface ChatStep {
  id: string;
  question: string;
  field: keyof UserData;
  completed: boolean;
}