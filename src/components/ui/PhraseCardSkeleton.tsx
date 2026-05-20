import { motion } from 'framer-motion';

export default function PhraseCardSkeleton() {
  return (
    <div className="h-full flex flex-col justify-center px-4 py-6">
      <motion.div
        className="card p-6 space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}>
        {/* Shimmer animation */}
        <div className="space-y-3">
          <div className="h-3 w-20 rounded-full bg-cream-200 animate-pulse" />
          <div className="h-8 w-4/5 rounded-xl bg-cream-200 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-16 rounded-full bg-cream-200 animate-pulse" />
          <div className="h-4 w-full rounded-lg bg-cream-200 animate-pulse" />
          <div className="h-4 w-3/4 rounded-lg bg-cream-200 animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="h-2.5 w-24 rounded-full bg-cream-200 animate-pulse" />
          <div className="h-4 w-full rounded-lg bg-cream-200 animate-pulse" />
          <div className="h-4 w-2/3 rounded-lg bg-cream-200 animate-pulse" />
        </div>
        <div className="flex gap-2 mt-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-7 w-24 rounded-full bg-cream-200 animate-pulse" />
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <div className="h-12 flex-1 rounded-2xl bg-cream-200 animate-pulse" />
          <div className="h-12 w-12 rounded-2xl bg-cream-200 animate-pulse" />
          <div className="h-12 w-12 rounded-2xl bg-cream-200 animate-pulse" />
        </div>
      </motion.div>
      <div className="text-center mt-4 text-sm font-body text-cream-400 animate-pulse">
        AI iborani yaratyapti...
      </div>
    </div>
  );
}
