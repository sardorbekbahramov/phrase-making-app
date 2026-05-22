import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import { Phrase } from '../types';
import { mockPhrases } from '../lib/mockData';
import PhraseCard from '../components/cards/PhraseCard';
import PhraseCardSkeleton from '../components/ui/PhraseCardSkeleton';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

// Har safar app ochilganda aralashtirilgan ro'yxat
function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function FeedPage() {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const indexRef = useRef(0);
  const shuffledRef = useRef<typeof mockPhrases>([]);
  const { updateStreak } = useAppStore();

  const getNextPhrase = (): Phrase => {
    // Ro'yxat tugasa qayta aralashtir
    if (indexRef.current >= shuffledRef.current.length) {
      shuffledRef.current = shuffleArray(mockPhrases);
      indexRef.current = 0;
    }
    const p = shuffledRef.current[indexRef.current];
    indexRef.current++;
    return { ...p, id: generateId() };
  };

  useEffect(() => {
    updateStreak();
    // App ochilganda bir marta aralashtir
    shuffledRef.current = shuffleArray(mockPhrases);
    setPhrase(getNextPhrase());
    setLoading(false);
  }, []);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      setPhrase(getNextPhrase());
      setKey(k => k + 1);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="h-full overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
      <AnimatePresence mode="wait">
        {loading ? (
          <PhraseCardSkeleton key="skeleton" />
        ) : phrase ? (
          <PhraseCard key={key} phrase={phrase} onNext={handleNext} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}