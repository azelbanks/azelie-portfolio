export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface QAPair {
  question: string;
  alternates?: string[];
  answer: {
    strategist: string;
    tech: string;
  };
  category: 'background' | 'skills' | 'projects' | 'education' | 'personal' | 'hiring' | 'meta';
}

export interface ChatAPIRequest {
  message: string;
  mode: 'strategist' | 'tech';
  history: ChatMessage[];
}

export interface GroqStreamChoice {
  delta: {
    content?: string;
    role?: string;
  };
  index: number;
  finish_reason: string | null;
}

export interface GroqStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: GroqStreamChoice[];
}
