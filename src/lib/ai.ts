import { Phrase, QuizQuestion } from '../types';
import { mockPhrases } from './mockData';

const WORKER_URL = 'https://phraseflow-api.sardorbahramov04.workers.dev';

let phraseIndex = 0;
const usedPhrases = new Set<string>();

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

function getNextMockPhrase(): Phrase {
  const available = mockPhrases.filter(p => !usedPhrases.has(p.phrase));
  if (available.length === 0) usedPhrases.clear();
  const phrase = available[phraseIndex % available.length] || mockPhrases[phraseIndex % mockPhrases.length];
  phraseIndex++;
  usedPhrases.add(phrase.phrase);
  return { ...phrase, id: generateId() };
}

async function callWorker(body: object): Promise<any> {
  const response = await fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error('Worker error');
  return response.json();
}

export async function generatePhrase(): Promise<Phrase> {
  try {
    const data = await callWorker({ type: 'generate' });
    return { ...data, id: generateId() };
  } catch {
    await new Promise(r => setTimeout(r, 600));
    return getNextMockPhrase();
  }
}

export async function regenerateExample(phrase: Phrase): Promise<Partial<Phrase>> {
  try {
    return await callWorker({ type: 'regenerate', phrase: phrase.phrase });
  } catch {
    return {
      example: `She always uses "${phrase.phrase}" in her daily conversations.`,
      exampleTranslation: `U har doim suhbatlarida "${phrase.phrase}" iborasini ishlatadi.`,
      speakingIdea: `I try to use "${phrase.phrase}" whenever I get the chance.`,
      speakingIdeaTranslation: `Imkon topganda "${phrase.phrase}" iborasini ishlatishga harakat qilaman.`,
    };
  }
}

export async function generateQuiz(savedPhrases: Phrase[]): Promise<QuizQuestion[]> {
  if (savedPhrases.length < 2) return [];
  const questions: QuizQuestion[] = [];

  savedPhrases.slice(0, 4).forEach((p) => {
    const wrongOptions = savedPhrases.filter(op => op.id !== p.id).slice(0, 3).map(op => op.meaning);
    const options = [p.meaning, ...wrongOptions].sort(() => Math.random() - 0.5);
    questions.push({ id: generateId(), type: 'phrase-to-meaning', question: p.phrase, answer: p.meaning, options, phraseId: p.id });
  });

  savedPhrases.slice(0, 3).forEach(p => {
    const wrongOptions = savedPhrases.filter(op => op.id !== p.id).slice(0, 3).map(op => op.phrase);
    const options = [p.phrase, ...wrongOptions].sort(() => Math.random() - 0.5);
    questions.push({ id: generateId(), type: 'uzbek-to-english', question: p.uzbekEquivalent, answer: p.phrase, options, phraseId: p.id });
  });

  savedPhrases.slice(0, 3).forEach(p => {
    const blank = p.example.replace(new RegExp(p.phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), '___________');
    questions.push({ id: generateId(), type: 'fill-blank', question: blank, answer: p.phrase, options: [], phraseId: p.id });
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 8);
}