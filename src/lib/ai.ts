import { Phrase, QuizQuestion } from '../types';
import { mockPhrases } from './mockData';

function getApiKey(): string {
  try {
    const store = JSON.parse(localStorage.getItem('phraseflow-storage') || '{}');
    const localKey = store?.state?.settings?.geminiApiKey;
    if (localKey && localKey.length > 10) return localKey;
  } catch {}
  return import.meta.env.VITE_GEMINI_API_KEY || '';
}

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

async function callGemini(prompt: string): Promise<string> {
  const key = getApiKey();
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 1024 }
      })
    }
  );
  if (!response.ok) throw new Error('Gemini API error');
  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

export async function generatePhrase(): Promise<Phrase> {
  const key = getApiKey();
  if (!key) {
    await new Promise(r => setTimeout(r, 600));
    return getNextMockPhrase();
  }

  const prompt = `Generate a natural English idiom or phrase for Uzbek learners. Return ONLY valid JSON (no markdown) in this exact format:
{
  "phrase": "the idiom",
  "meaning": "Ma'nosi uzbekcha (simple explanation in Uzbek)",
  "uzbekEquivalent": "O'zbekcha muqobili",
  "example": "An example sentence using the phrase",
  "exampleTranslation": "Uzbek translation of the example",
  "speakingIdea": "A speaking practice sentence starting with I/Sometimes/When",
  "speakingIdeaTranslation": "Uzbek translation of the speaking idea",
  "collocations": ["collocation 1", "collocation 2", "collocation 3"],
  "difficulty": "beginner|intermediate|advanced",
  "category": "category name"
}
Choose a DIFFERENT phrase each time. Make explanations simple for Uzbek English learners.`;

  try {
    const text = await callGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);
    return { ...parsed, id: generateId() };
  } catch {
    return getNextMockPhrase();
  }
}

export async function regenerateExample(phrase: Phrase): Promise<Partial<Phrase>> {
  const key = getApiKey();
  if (!key) {
    await new Promise(r => setTimeout(r, 800));
    const variants = [
      {
        example: `She always uses "${phrase.phrase}" when talking to her colleagues at work.`,
        exampleTranslation: `U har doim hamkasblari bilan gaplashganda "${phrase.phrase}" iborasini ishlatadi.`,
        speakingIdea: `I think about "${phrase.phrase}" when I face similar situations in life.`,
        speakingIdeaTranslation: `Hayotda shunga o'xshash vaziyatlarga duch kelganda "${phrase.phrase}" haqida o'ylayman.`,
      },
      {
        example: `My professor mentioned "${phrase.phrase}" during today's lecture on idioms.`,
        exampleTranslation: `Professorim bugungi idiomalar bo'yicha ma'ruzada "${phrase.phrase}" iborasini tilga oldi.`,
        speakingIdea: `Understanding "${phrase.phrase}" helped me communicate more naturally in English.`,
        speakingIdeaTranslation: `"${phrase.phrase}" iborasini tushunish menga inglizchada tabiiyroq muloqot qilishga yordam berdi.`,
      }
    ];
    return variants[Math.floor(Math.random() * variants.length)];
  }

  const prompt = `For the English phrase "${phrase.phrase}", generate a NEW example sentence and speaking idea. Return ONLY valid JSON:
{
  "example": "new example sentence",
  "exampleTranslation": "Uzbek translation",
  "speakingIdea": "new speaking idea (start with I/Sometimes/When)",
  "speakingIdeaTranslation": "Uzbek translation"
}`;

  try {
    const text = await callGemini(prompt);
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch {
    return {
      example: `This is a great time to practice "${phrase.phrase}" in conversation.`,
      exampleTranslation: `"${phrase.phrase}" iborasini suhbatda mashq qilish uchun ajoyib vaqt.`,
      speakingIdea: `I try to use "${phrase.phrase}" whenever I get the chance to speak English.`,
      speakingIdeaTranslation: `Inglizcha gapirish imkoniyati bo'lganda, "${phrase.phrase}" iborasini ishlatishga harakat qilaman.`,
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