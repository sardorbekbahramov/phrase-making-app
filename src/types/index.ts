export interface Phrase {
  id: string;
  phrase: string;
  meaning: string; // Uzbek meaning
  uzbekEquivalent: string;
  example: string;
  exampleTranslation: string;
  speakingIdea: string;
  speakingIdeaTranslation: string;
  collocations: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category?: string;
  savedAt?: number;
}

export interface User {
  telegramUsername: string;
  password: string;
  streak: number;
  lastActiveDate: string;
  totalPhrasesSeen: number;
  totalQuizzesCompleted: number;
}

export interface QuizQuestion {
  id: string;
  type: 'phrase-to-meaning' | 'uzbek-to-english' | 'fill-blank' | 'matching';
  question: string;
  answer: string;
  options: string[];
  phraseId: string;
}

export interface QuizResult {
  questionId: string;
  correct: boolean;
  timeSpent: number;
}

export interface AppSettings {
  darkMode: boolean;
  fontSize: 'sm' | 'md' | 'lg';
  geminiApiKey: string;
}

export type DifficultyFilter = 'all' | 'beginner' | 'intermediate' | 'advanced';
