import { Phrase } from '../../types';

interface DifficultyBadgeProps {
  difficulty: Phrase['difficulty'];
  size?: 'sm' | 'md';
}

const labels: Record<Phrase['difficulty'], string> = {
  beginner: "Boshlang'ich",
  intermediate: "O'rta",
  advanced: "Yuqori",
};

const colors: Record<Phrase['difficulty'], { bg: string; text: string; dot: string }> = {
  beginner: { bg: '#D1FAE5', text: '#065F46', dot: '#10B981' },
  intermediate: { bg: '#FEF3C7', text: '#92400E', dot: '#F59E0B' },
  advanced: { bg: '#FEE2E2', text: '#991B1B', dot: '#EF4444' },
};

export default function DifficultyBadge({ difficulty, size = 'md' }: DifficultyBadgeProps) {
  const c = colors[difficulty];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-body font-medium rounded-full ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
      style={{ background: c.bg, color: c.text }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.dot }} />
      {labels[difficulty]}
    </span>
  );
}
