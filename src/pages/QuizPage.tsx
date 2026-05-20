import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, CheckCircle, XCircle, Trophy, RotateCcw, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '../stores/appStore';
import { generateQuiz } from '../lib/ai';
import type { QuizQuestion, QuizResult } from '../types';

function triggerConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D8B7AE', '#C49B8F', '#3A2E2A', '#F5EDE6', '#A87A6C'],
  });
}

function QuizQuestionCard({
  question,
  onAnswer,
  questionIndex,
  total,
}: {
  question: QuizQuestion;
  onAnswer: (correct: boolean) => void;
  questionIndex: number;
  total: number;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [fillInput, setFillInput] = useState('');
  const [revealed, setRevealed] = useState(false);

  const typeLabels: Record<QuizQuestion['type'], string> = {
    'phrase-to-meaning': "Iboraning ma'nosini tanlang",
    'uzbek-to-english': "O'zbekchadan inglizcha iborani toping",
    'fill-blank': "Bo'sh joyni to'ldiring",
    'matching': "Moslashtiring",
  };

  const handleOption = (opt: string) => {
    if (revealed) return;
    setSelected(opt);
    setRevealed(true);
    const correct = opt === question.answer;
    if (correct) triggerConfetti();
    setTimeout(() => onAnswer(correct), 1000);
  };

  const handleFillSubmit = () => {
    if (revealed || !fillInput.trim()) return;
    setRevealed(true);
    const correct = fillInput.trim().toLowerCase() === question.answer.toLowerCase();
    if (correct) triggerConfetti();
    setTimeout(() => onAnswer(correct), 1200);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex flex-col h-full space-y-4">

      {/* Progress */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-body" style={{ color: 'var(--color-text-secondary)' }}>
          <span>{questionIndex + 1} / {total}</span>
          <span>{typeLabels[question.type]}</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C49B8F, #A87A6C)' }}
            initial={{ width: `${(questionIndex / total) * 100}%` }}
            animate={{ width: `${((questionIndex + 1) / total) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card p-5" style={{ background: 'var(--color-card)' }}>
        <div className="text-xs font-body font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--color-accent)' }}>
          Savol
        </div>
        <p className="font-display text-xl font-bold leading-snug" style={{ color: 'var(--color-text)' }}>
          {question.question}
        </p>
      </div>

      {/* Answer area */}
      {question.type === 'fill-blank' ? (
        <div className="space-y-3">
          <input
            value={fillInput}
            onChange={e => setFillInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
            placeholder="Iborani yozing..."
            disabled={revealed}
            className="w-full px-4 py-3 rounded-2xl font-body text-sm outline-none"
            style={{
              background: 'var(--color-surface)',
              border: `2px solid ${revealed
                ? fillInput.toLowerCase() === question.answer.toLowerCase() ? '#10B981' : '#EF4444'
                : 'var(--color-border)'}`,
              color: 'var(--color-text)',
            }}
          />
          {!revealed && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={handleFillSubmit}
              className="w-full py-3 rounded-2xl font-body font-semibold text-sm"
              style={{ background: '#3A2E2A', color: '#FFF9F5' }}>
              Tekshirish
            </motion.button>
          )}
          {revealed && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-2xl"
              style={{
                background: fillInput.toLowerCase() === question.answer.toLowerCase() ? '#D1FAE5' : '#FEE2E2',
                color: fillInput.toLowerCase() === question.answer.toLowerCase() ? '#065F46' : '#991B1B',
              }}>
              <p className="font-body text-sm font-medium">
                {fillInput.toLowerCase() === question.answer.toLowerCase()
                  ? '✓ To\'g\'ri!'
                  : `✗ To'g'ri javob: "${question.answer}"`}
              </p>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {question.options.map(opt => {
            const isSelected = selected === opt;
            const isCorrect = opt === question.answer;
            const showCorrect = revealed && isCorrect;
            const showWrong = revealed && isSelected && !isCorrect;

            return (
              <motion.button
                key={opt}
                whileTap={!revealed ? { scale: 0.97 } : {}}
                onClick={() => handleOption(opt)}
                className="w-full p-3.5 rounded-2xl text-left font-body text-sm font-medium transition-all"
                style={{
                  background: showCorrect ? '#D1FAE5'
                    : showWrong ? '#FEE2E2'
                      : isSelected ? 'var(--color-surface)'
                        : 'var(--color-card)',
                  color: showCorrect ? '#065F46'
                    : showWrong ? '#991B1B'
                      : 'var(--color-text)',
                  border: `2px solid ${showCorrect ? '#10B981'
                    : showWrong ? '#EF4444'
                      : 'var(--color-border)'}`,
                  cursor: revealed ? 'default' : 'pointer',
                }}>
                <div className="flex items-center justify-between gap-2">
                  <span className="flex-1">{opt}</span>
                  {showCorrect && <CheckCircle size={16} className="text-green-600 flex-shrink-0" />}
                  {showWrong && <XCircle size={16} className="text-red-600 flex-shrink-0" />}
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

function QuizResult({ results, total, onRestart }: {
  results: QuizResult[];
  total: number;
  onRestart: () => void;
}) {
  const correct = results.filter(r => r.correct).length;
  const pct = Math.round((correct / total) * 100);
  const emoji = pct >= 80 ? '🏆' : pct >= 60 ? '👏' : pct >= 40 ? '📚' : '💪';
  const msg = pct >= 80 ? "Ajoyib natija!" : pct >= 60 ? "Yaxshi ish!" : pct >= 40 ? "Davom eting!" : "Ko'proq mashq qiling!";

  useEffect(() => {
    if (pct >= 80) {
      triggerConfetti();
      setTimeout(triggerConfetti, 500);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center space-y-6 py-8">
      <div className="text-6xl">{emoji}</div>
      <div>
        <h2 className="font-display text-3xl font-bold" style={{ color: 'var(--color-text)' }}>
          {correct}/{total}
        </h2>
        <p className="font-body text-lg font-medium mt-1" style={{ color: 'var(--color-text-secondary)' }}>
          {msg}
        </p>
      </div>

      {/* Score ring */}
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke="var(--color-surface)" strokeWidth="2.5" />
          <circle cx="18" cy="18" r="15.9" fill="none"
            stroke="#C49B8F" strokeWidth="2.5"
            strokeDasharray={`${pct} ${100 - pct}`}
            strokeDashoffset="0"
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }} />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            {pct}%
          </span>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="w-full flex gap-1">
        {results.map((r, i) => (
          <div key={i} className="flex-1 h-2 rounded-full"
            style={{ background: r.correct ? '#10B981' : '#EF4444' }} />
        ))}
      </div>

      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onRestart}
        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-body font-semibold"
        style={{ background: '#3A2E2A', color: '#FFF9F5' }}>
        <RotateCcw size={16} />
        Qayta boshlash
      </motion.button>
    </motion.div>
  );
}

export default function QuizPage() {
  const { savedPhrases } = useAppStore();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);

  const startQuiz = useCallback(async () => {
    setLoading(true);
    setResults([]);
    setCurrentIndex(0);
    setFinished(false);
    try {
      const qs = await generateQuiz(savedPhrases);
      setQuestions(qs);
    } finally {
      setLoading(false);
    }
  }, [savedPhrases]);

  const handleAnswer = (correct: boolean) => {
    const result: QuizResult = {
      questionId: questions[currentIndex].id,
      correct,
      timeSpent: 0,
    };
    const newResults = [...results, result];
    setResults(newResults);

    if (currentIndex + 1 >= questions.length) {
      setFinished(true);
    } else {
      setCurrentIndex(i => i + 1);
    }
  };

  // Not enough phrases
  if (savedPhrases.length < 2) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 space-y-4"
        style={{ height: 'calc(100vh - 120px)' }}>
        <Lock size={40} className="opacity-30" style={{ color: 'var(--color-text)' }} />
        <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
          Quiz uchun ibora kerak
        </h2>
        <p className="font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Quizni boshlash uchun kamida 2 ta iborani saqlang.
          Feedga o'ting va ❤️ bosing!
        </p>
      </div>
    );
  }

  // Start screen
  if (!loading && questions.length === 0 && !finished) {
    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-8 space-y-5"
        style={{ height: 'calc(100vh - 120px)' }}>
        <div className="text-5xl">🧠</div>
        <div>
          <h2 className="font-display text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
            Quiz vaqti!
          </h2>
          <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
            {savedPhrases.length} ta saqlangan iborangiz bor
          </p>
        </div>

        <div className="card p-4 w-full text-left space-y-2.5" style={{ background: 'var(--color-card)' }}>
          <p className="font-body text-xs font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-accent)' }}>Quiz turlari</p>
          {[
            { icon: '💡', text: "Ibora → Ma'nosi" },
            { icon: '🔄', text: "O'zbekcha → Inglizcha" },
            { icon: '✏️', text: "Bo'sh joyni to'ldirish" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span>{item.icon}</span>
              <span className="font-body text-sm" style={{ color: 'var(--color-text)' }}>{item.text}</span>
            </div>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={startQuiz}
          className="w-full py-4 rounded-2xl font-body font-bold text-base flex items-center justify-center gap-2"
          style={{ background: 'linear-gradient(135deg, #C49B8F, #A87A6C)', color: '#FFF9F5' }}>
          <Brain size={20} />
          Quizni boshlash
        </motion.button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4"
        style={{ height: 'calc(100vh - 120px)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <Brain size={32} style={{ color: 'var(--color-accent)' }} />
        </motion.div>
        <p className="font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Savollar tayyorlanmoqda...
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-4 overflow-y-auto hide-scrollbar" style={{ height: 'calc(100vh - 120px)' }}>
      <AnimatePresence mode="wait">
        {finished ? (
          <QuizResult
            key="result"
            results={results}
            total={questions.length}
            onRestart={startQuiz}
          />
        ) : questions[currentIndex] ? (
          <QuizQuestionCard
            key={currentIndex}
            question={questions[currentIndex]}
            onAnswer={handleAnswer}
            questionIndex={currentIndex}
            total={questions.length}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
