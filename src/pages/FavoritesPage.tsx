import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Trash2, X, BookOpen } from 'lucide-react';
import { useAppStore } from '../stores/appStore';
import { Phrase, DifficultyFilter } from '../types';
import DifficultyBadge from '../components/ui/DifficultyBadge';

const filters: { value: DifficultyFilter; label: string }[] = [
  { value: 'all', label: 'Barchasi' },
  { value: 'beginner', label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced', label: "Yuqori" },
];

function FavoriteItem({ phrase, onRemove }: { phrase: Phrase; onRemove: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-4 space-y-3"
      style={{ background: 'var(--color-card)' }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <DifficultyBadge difficulty={phrase.difficulty} size="sm" />
            {phrase.category && (
              <span className="text-xs font-body px-2 py-0.5 rounded-full"
                style={{ background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }}>
                {phrase.category}
              </span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold leading-tight" style={{ color: 'var(--color-text)' }}>
            {phrase.phrase}
          </h3>
          <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {phrase.uzbekEquivalent}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={onRemove}
          className="p-2 rounded-xl flex-shrink-0"
          style={{ background: 'var(--color-surface)' }}>
          <Trash2 size={14} className="text-red-400" />
        </motion.button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden space-y-2">
            <div className="h-px" style={{ background: 'var(--color-border)' }} />
            <div className="space-y-1">
              <p className="text-xs font-body font-semibold uppercase tracking-wider"
                style={{ color: 'var(--color-accent)' }}>
                Ma'nosi
              </p>
              <p className="font-body text-sm" style={{ color: 'var(--color-text)' }}>{phrase.meaning}</p>
            </div>
            <div className="p-2.5 rounded-xl" style={{ background: 'var(--color-surface)' }}>
              <p className="font-body text-xs text-primary">{phrase.example}</p>
              <p className="font-body text-xs italic mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {phrase.exampleTranslation}
              </p>
            </div>
            {phrase.collocations?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {phrase.collocations.map((c, i) => (
                  <span key={i} className="text-xs font-body px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--color-surface)', color: 'var(--color-text)', border: '1px solid var(--color-border)' }}>
                    {c}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full text-center text-xs font-body font-medium py-1 rounded-xl transition-colors"
        style={{ color: 'var(--color-accent)', background: 'var(--color-surface)' }}>
        {expanded ? 'Yopish ▲' : "Ko'proq ko'rish ▼"}
      </button>
    </motion.div>
  );
}

export default function FavoritesPage() {
  const { savedPhrases, unsavePhrase } = useAppStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<DifficultyFilter>('all');

  const filtered = savedPhrases.filter(p => {
    const matchesSearch =
      p.phrase.toLowerCase().includes(search.toLowerCase()) ||
      p.meaning.toLowerCase().includes(search.toLowerCase()) ||
      p.uzbekEquivalent.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || p.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="h-full flex flex-col" style={{ height: 'calc(100vh - 120px)' }}>
      {/* Search & filters */}
      <div className="px-4 pt-4 pb-2 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--color-text-secondary)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ibora qidirish..."
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl font-body text-sm outline-none"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
              <X size={14} style={{ color: 'var(--color-text-secondary)' }} />
            </button>
          )}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {filters.map(f => (
            <motion.button
              key={f.value}
              whileTap={{ scale: 0.92 }}
              onClick={() => setFilter(f.value)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-medium transition-all"
              style={filter === f.value
                ? { background: '#3A2E2A', color: '#FFF9F5' }
                : { background: 'var(--color-surface)', color: 'var(--color-text-secondary)', border: '1px solid var(--color-border)' }
              }>
              {f.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="px-4 py-1">
        <p className="font-body text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          {filtered.length} ta ibora
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar px-4 pb-4 space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpen size={40} className="mb-3 opacity-30" style={{ color: 'var(--color-text)' }} />
            <p className="font-display text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              {search ? "Ibora topilmadi" : "Hali saqlangan ibora yo'q"}
            </p>
            <p className="font-body text-sm mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {search ? "Boshqa so'z bilan qidiring" : "Feed'dan iboralarni saqlang ❤️"}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {filtered.map(p => (
              <FavoriteItem key={p.id} phrase={p} onRemove={() => unsavePhrase(p.id)} />
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
