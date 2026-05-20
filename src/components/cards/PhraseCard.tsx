import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, RefreshCw, Share2, ChevronDown, Volume2, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { Phrase } from '../../types';
import { useAppStore } from '../../stores/appStore';
import { regenerateExample } from '../../lib/ai';
import DifficultyBadge from '../ui/DifficultyBadge';

interface PhraseCardProps {
  phrase: Phrase;
  onNext: () => void;
}

export default function PhraseCard({ phrase, onNext }: PhraseCardProps) {
  const { savePhrase, unsavePhrase, isPhrased } = useAppStore();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentPhrase, setCurrentPhrase] = useState(phrase);
  const [refreshKey, setRefreshKey] = useState(0);
  const isSaved = isPhrased(phrase.id);

  const handleSave = () => {
    if (isSaved) {
      unsavePhrase(phrase.id);
      toast('Saqlashdan olib tashlandi', { icon: '💔' });
    } else {
      savePhrase(currentPhrase);
      toast.success('Sevimlilaringizga saqlandi!', { icon: '❤️' });
    }
  };

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    setIsRegenerating(true);
    try {
      const updated = await regenerateExample(currentPhrase);
      setCurrentPhrase(prev => ({ ...prev, ...updated }));
      setRefreshKey(k => k + 1);
      toast('Yangi misol yaratildi!', { icon: '✨' });
    } catch {
      toast.error('Xatolik yuz berdi');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleShare = async () => {
    const text = `📖 "${currentPhrase.phrase}"\n\n${currentPhrase.meaning}\n\nMisol: ${currentPhrase.example}\n\n— PhraseFlow AI orqali`;
    if (navigator.share) {
      await navigator.share({ title: 'PhraseFlow AI', text }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast('Vaqtinchalik xotiraga nusxalandi!', { icon: '📋' });
    }
  };

  const speak = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40, scale: 0.96 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full flex flex-col px-4 py-4 overflow-y-auto hide-scrollbar"
    >
      {/* Card */}
      <div className="card flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--color-card)' }}>

        {/* Card top accent */}
        <div className="h-1.5 w-full rounded-t-3xl" style={{
          background: 'linear-gradient(90deg, #D8B7AE, #C49B8F, #A87A6C)'
        }} />

        <div className="flex-1 p-5 space-y-4 overflow-y-auto hide-scrollbar">

          {/* Header row */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <DifficultyBadge difficulty={currentPhrase.difficulty} />
              {currentPhrase.category && (
                <span className="tag text-xs px-2 py-0.5 rounded-full font-body"
                  style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                  {currentPhrase.category}
                </span>
              )}
            </div>
            <Sparkles size={16} style={{ color: 'var(--color-accent)', flexShrink: 0 }} />
          </div>

          {/* Phrase title */}
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold leading-tight text-balance"
                style={{ color: 'var(--color-text)' }}>
                {currentPhrase.phrase}
              </h2>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => speak(currentPhrase.phrase)}
                className="p-1.5 rounded-xl flex-shrink-0"
                style={{ background: 'var(--color-surface)' }}>
                <Volume2 size={14} style={{ color: 'var(--color-text-secondary)' }} />
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px" style={{ background: 'var(--color-border)' }} />

          {/* Meaning */}
          <div className="space-y-1">
            <p className="text-xs font-body font-semibold uppercase tracking-wider"
              style={{ color: 'var(--color-accent)' }}>
              Ma'nosi
            </p>
            <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
              {currentPhrase.meaning}
            </p>
          </div>

          {/* Uzbek equivalent */}
          <div className="p-3 rounded-2xl" style={{ background: 'var(--color-surface)' }}>
            <p className="text-xs font-body font-semibold uppercase tracking-wider mb-1"
              style={{ color: 'var(--color-accent)' }}>
              O'zbekcha muqobili
            </p>
            <p className="font-body text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              {currentPhrase.uzbekEquivalent}
            </p>
          </div>

          {/* Collocations */}
          {currentPhrase.collocations?.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-body font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-accent)' }}>
                Collocations
              </p>
              <div className="flex flex-wrap gap-1.5">
                {currentPhrase.collocations.map((c, i) => (
                  <span key={i} className="text-xs font-body px-2.5 py-1 rounded-full"
                    style={{
                      background: 'var(--color-surface)',
                      color: 'var(--color-text)',
                      border: '1px solid var(--color-border)'
                    }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Examples - regeneratable section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={refreshKey}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3">

              {/* Example */}
              <div className="space-y-1.5">
                <p className="text-xs font-body font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-accent)' }}>
                  Misol
                </p>
                <div className="p-3 rounded-2xl" style={{ background: 'var(--color-surface)' }}>
                  <div className="flex items-start gap-2">
                    <p className="font-body text-sm leading-relaxed flex-1" style={{ color: 'var(--color-text)' }}>
                      {currentPhrase.example}
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={() => speak(currentPhrase.example)}
                      className="p-1 rounded-lg flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--color-border)' }}>
                      <Volume2 size={12} style={{ color: 'var(--color-text-secondary)' }} />
                    </motion.button>
                  </div>
                  <p className="font-body text-xs mt-1.5 italic" style={{ color: 'var(--color-text-secondary)' }}>
                    {currentPhrase.exampleTranslation}
                  </p>
                </div>
              </div>

              {/* Speaking idea */}
              <div className="space-y-1.5">
                <p className="text-xs font-body font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-accent)' }}>
                  Speaking idea
                </p>
                <div className="p-3 rounded-2xl border" style={{
                  background: 'var(--color-card)',
                  borderColor: 'var(--color-border)',
                  borderStyle: 'dashed'
                }}>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
                    💬 {currentPhrase.speakingIdea}
                  </p>
                  <p className="font-body text-xs mt-1.5 italic" style={{ color: 'var(--color-text-secondary)' }}>
                    {currentPhrase.speakingIdeaTranslation}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action buttons */}
        <div className="p-4 pt-0 space-y-3">
          <div className="flex gap-2">
            {/* Save button */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-body font-semibold text-sm transition-all"
              style={isSaved
                ? { background: '#3A2E2A', color: '#FFF9F5' }
                : { background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }
              }>
              <motion.span animate={{ scale: isSaved ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.3 }}>
                <Heart size={16} fill={isSaved ? '#FFF9F5' : 'none'} strokeWidth={2} />
              </motion.span>
              {isSaved ? "Saqlangan" : "Saqlash"}
            </motion.button>

            {/* Regenerate */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="p-3 rounded-2xl transition-all"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <motion.span animate={{ rotate: isRegenerating ? 360 : 0 }}
                transition={{ duration: 0.8, repeat: isRegenerating ? Infinity : 0 }}>
                <RefreshCw size={16} style={{ color: 'var(--color-text-secondary)' }} />
              </motion.span>
            </motion.button>

            {/* Share */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-3 rounded-2xl transition-all"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
              <Share2 size={16} style={{ color: 'var(--color-text-secondary)' }} />
            </motion.button>
          </div>

          {/* Next button */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onNext}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-body font-semibold text-sm transition-all"
            style={{ background: 'linear-gradient(135deg, #C49B8F, #A87A6C)', color: '#FFF9F5' }}>
            Keyingisi
            <ChevronDown size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
