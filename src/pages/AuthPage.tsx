import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AtSign, Lock, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../stores/appStore';

type Mode = 'login' | 'register';

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login, register } = useAppStore();

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim()) {
      toast.error("Barcha maydonlarni to'ldiring");
      return;
    }
    if (password.length < 4) {
      toast.error("Parol kamida 4 ta belgidan iborat bo'lsin");
      return;
    }

    setLoading(true);
    await new Promise(r => setTimeout(r, 600)); // smooth UX delay

    if (mode === 'login') {
      const ok = login(username.trim(), password);
      if (!ok) {
        toast.error("Username yoki parol noto'g'ri");
      } else {
        toast.success("Xush kelibsiz! 🎉");
      }
    } else {
      const ok = register(username.trim(), password);
      if (!ok) {
        toast.error("Bu username allaqachon mavjud");
      } else {
        toast.success("Hisob muvaffaqiyatli yaratildi! 🎉");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top decoration */}
      <div className="relative overflow-hidden">
        <div className="h-56 flex flex-col items-center justify-end pb-6 px-6"
          style={{
            background: 'linear-gradient(160deg, #D8B7AE 0%, #C49B8F 40%, #A87A6C 100%)',
          }}>
          {/* Decorative circles */}
          <div className="absolute top-4 right-8 w-20 h-20 rounded-full opacity-20"
            style={{ background: '#FFF9F5' }} />
          <div className="absolute top-12 right-16 w-10 h-10 rounded-full opacity-15"
            style={{ background: '#FFF9F5' }} />
          <div className="absolute -top-4 left-6 w-32 h-32 rounded-full opacity-10"
            style={{ background: '#3A2E2A' }} />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-3xl">📖</span>
              <h1 className="font-display text-3xl font-bold text-white">
                PhraseFlow
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full font-body font-bold"
                style={{ background: 'rgba(255,255,255,0.25)', color: 'white' }}>
                AI
              </span>
            </div>
            <p className="font-body text-sm text-white opacity-80">
              Ingliz iboralarini tabiiy o'rganing
            </p>
          </motion.div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-5 pt-6 pb-8 space-y-5">

        {/* Tab switcher */}
        <div className="flex rounded-2xl p-1" style={{ background: 'var(--color-surface)' }}>
          {(['login', 'register'] as Mode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl font-body text-sm font-semibold transition-all"
              style={mode === m
                ? { background: '#3A2E2A', color: '#FFF9F5', boxShadow: '0 2px 8px rgba(58,46,42,0.2)' }
                : { color: 'var(--color-text-secondary)' }
              }>
              {m === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: mode === 'login' ? -10 : 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3">

            {/* Username */}
            <div className="relative">
              <AtSign size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }} />
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Telegram username"
                autoComplete="username"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl font-body text-sm outline-none"
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--color-text-secondary)' }} />
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Parol (kamida 4 ta belgi)"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="w-full pl-10 pr-10 py-3.5 rounded-2xl font-body text-sm outline-none"
                style={{
                  background: 'var(--color-surface)',
                  border: '1.5px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
              />
              <button
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2">
                {showPass
                  ? <EyeOff size={16} style={{ color: 'var(--color-text-secondary)' }} />
                  : <Eye size={16} style={{ color: 'var(--color-text-secondary)' }} />
                }
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-2xl font-body font-bold text-base flex items-center justify-center gap-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #C49B8F, #A87A6C)',
            color: '#FFF9F5',
            opacity: loading ? 0.8 : 1,
          }}>
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}>
              <Sparkles size={18} />
            </motion.div>
          ) : (
            <>
              {mode === 'login' ? 'Kirish' : "Ro'yxatdan o'tish"}
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        {/* Features preview */}
        <div className="space-y-2 pt-2">
          {[
            { icon: '🤖', text: 'AI bilan yangi iboralar' },
            { icon: '🎯', text: "Quiz bilan bilimni sinab ko'ring" },
            { icon: '❤️', text: 'Sevimli iboralarni saqlang' },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3">
              <span className="text-lg">{item.icon}</span>
              <span className="font-body text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                {item.text}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
