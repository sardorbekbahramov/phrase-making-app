import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { generatePhrase } from '../lib/ai';
import { useAppStore } from '../stores/appStore';
import { Phrase } from '../types';
import PhraseCard from '../components/cards/PhraseCard';
import PhraseCardSkeleton from '../components/ui/PhraseCardSkeleton';

export default function FeedPage() {
  const [phrase, setPhrase] = useState<Phrase | null>(null);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState(0);
  const { updateStreak } = useAppStore();

  const fetchNextPhrase = useCallback(async () => {
    setLoading(true);
    setPhrase(null);
    try {
      const next = await generatePhrase();
      setPhrase(next);
      setKey(k => k + 1);
    } catch {
      // fallback handled in ai.ts
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    updateStreak();
    fetchNextPhrase();
  }, []);

  const handleNext = () => {
    fetchNextPhrase();
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
