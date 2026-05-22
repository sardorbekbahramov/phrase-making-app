import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useAppStore } from '../stores/appStore';
import { Phrase } from '../types';
import { mockPhrases } from '../lib/mockData';
import PhraseCard from '../components/cards/PhraseCard';
import PhraseCardSkeleton from '../components/ui/PhraseCardSkeleton';

function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

let currentIndex = 0;

function getNextPhrase(): Phrase {
  const phrase = mockPhrases[currentIndex % mockPhrases.length];
  currentIndex++;
  return { ...phrase, id: generateId() };
}

export default function FeedPage() {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const { updateStreak } = useAppStore();

  useEffect(() => {
    updateStreak();
    const first = getNextPhrase();
    setPhrase(first);
    setLoading(false);
  }, []);

  const handleNext = () => {
    setLoading(true);
    setTimeout(() => {
      const next = getNextPhrase();
      setPhrase(next);
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