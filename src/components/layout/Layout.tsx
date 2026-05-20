import { ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Heart, Brain, Settings } from 'lucide-react';
import { useAppStore } from '../../stores/appStore';
import { motion } from 'framer-motion';

const navItems = [
  { to: '/', icon: Home, label: "Feed" },
  { to: '/favorites', icon: Heart, label: "Sevimlilar" },
  { to: '/quiz', icon: Brain, label: "Quiz" },
  { to: '/settings', icon: Settings, label: "Sozlamalar" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const { user } = useAppStore();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg)' }}>
      {/* Top header */}
      <header className="sticky top-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
            style={{ background: 'var(--color-surface)' }}>
            📖
          </div>
          <span className="font-display font-semibold text-lg" style={{ color: 'var(--color-text)' }}>
            PhraseFlow
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full font-body font-medium"
            style={{ background: 'var(--color-accent)', color: '#FFF9F5' }}>
            AI
          </span>
        </div>
        {user && (
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            <span>🔥</span>
            <span className="font-body font-medium">{user.streak} kun</span>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--color-surface)', color: 'var(--color-text)' }}>
              {user.telegramUsername.charAt(0).toUpperCase()}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        {children}
      </main>

      {/* Bottom navigation */}
      <nav className="sticky bottom-0 z-50 safe-area-pb"
        style={{ background: 'var(--color-bg)', borderTop: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'}>
              {({ isActive }) => (
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all"
                  style={{
                    background: isActive ? 'var(--color-surface)' : 'transparent',
                  }}>
                  <Icon
                    size={20}
                    strokeWidth={isActive ? 2.5 : 1.75}
                    style={{ color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)' }}
                  />
                  <span className="text-xs font-body"
                    style={{ color: isActive ? 'var(--color-text)' : 'var(--color-text-secondary)', fontWeight: isActive ? 600 : 400 }}>
                    {label}
                  </span>
                </motion.div>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
