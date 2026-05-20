import { motion } from 'framer-motion';
import { Moon, Sun, Type, Trash2, LogOut, Key, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppStore } from '../stores/appStore';
import { useNavigate } from 'react-router-dom';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-body font-semibold uppercase tracking-wider px-1"
        style={{ color: 'var(--color-accent)' }}>
        {title}
      </p>
      <div className="card overflow-hidden" style={{ background: 'var(--color-card)' }}>
        {children}
      </div>
    </div>
  );
}

function SettingsRow({
  icon: Icon,
  label,
  sublabel,
  right,
  onClick,
  destructive,
}: {
  icon: React.ElementType;
  label: string;
  sublabel?: string;
  right?: React.ReactNode;
  onClick?: () => void;
  destructive?: boolean;
}) {
  return (
    <motion.button
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors"
      style={{ borderBottom: '1px solid var(--color-border)', cursor: onClick ? 'pointer' : 'default' }}>
      <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: destructive ? '#FEE2E2' : 'var(--color-surface)' }}>
        <Icon size={15} style={{ color: destructive ? '#EF4444' : 'var(--color-text-secondary)' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-body text-sm font-medium" style={{ color: destructive ? '#EF4444' : 'var(--color-text)' }}>
          {label}
        </p>
        {sublabel && (
          <p className="font-body text-xs mt-0.5" style={{ color: 'var(--color-text-secondary)' }}>
            {sublabel}
          </p>
        )}
      </div>
      {right && <div className="flex-shrink-0">{right}</div>}
    </motion.button>
  );
}

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <motion.button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-colors flex-shrink-0"
      style={{ background: value ? '#3A2E2A' : 'var(--color-border)' }}>
      <motion.div
        layout
        animate={{ x: value ? 20 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </motion.button>
  );
}

export default function SettingsPage() {
  const { settings, updateSettings, user, logout, clearAllData, savedPhrases } = useAppStore();
  const navigate = useNavigate();

  const handleClearData = () => {
    if (window.confirm("Barcha saqlangan ma'lumotlarni o'chirib tashlamoqchimisiz?")) {
      clearAllData();
      toast.success("Ma'lumotlar tozalandi");
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="px-4 py-4 space-y-5 overflow-y-auto hide-scrollbar" style={{ height: 'calc(100vh - 120px)' }}>

      {/* User card */}
      <div className="card p-4 flex items-center gap-3" style={{ background: 'var(--color-card)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold font-display"
          style={{ background: 'linear-gradient(135deg, #D8B7AE, #A87A6C)', color: '#FFF9F5' }}>
          {user?.telegramUsername.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="font-body font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
            @{user?.telegramUsername}
          </p>
          <p className="font-body text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            🔥 {user?.streak} kunlik ketma-ketlik · ❤️ {savedPhrases.length} ta ibora
          </p>
        </div>
      </div>

      {/* Appearance */}
      <SettingsSection title="Ko'rinish">
        <SettingsRow
          icon={settings.darkMode ? Moon : Sun}
          label="Qorong'u rejim"
          sublabel={settings.darkMode ? "Yoqilgan" : "O'chirilgan"}
          right={
            <Toggle
              value={settings.darkMode}
              onChange={v => updateSettings({ darkMode: v })}
            />
          }
        />
        <SettingsRow
          icon={Type}
          label="Matn o'lchami"
          right={
            <div className="flex gap-1">
              {(['sm', 'md', 'lg'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateSettings({ fontSize: size })}
                  className="w-8 h-8 rounded-xl font-body font-medium text-xs transition-all"
                  style={settings.fontSize === size
                    ? { background: '#3A2E2A', color: '#FFF9F5' }
                    : { background: 'var(--color-surface)', color: 'var(--color-text-secondary)' }
                  }>
                  {size === 'sm' ? 'A' : size === 'md' ? 'A' : 'A'}
                </button>
              ))}
            </div>
          }
        />
      </SettingsSection>

      {/* API */}
      <SettingsSection title="AI Sozlamalari">
        <div className="px-4 py-3 space-y-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="flex items-center gap-2 mb-1">
            <Key size={15} style={{ color: 'var(--color-text-secondary)' }} />
            <p className="font-body text-sm font-medium" style={{ color: 'var(--color-text)' }}>
              Gemini API kalit
            </p>
          </div>
          <input
            type="password"
            value={settings.geminiApiKey}
            onChange={e => updateSettings({ geminiApiKey: e.target.value })}
            placeholder="AIza..."
            className="w-full px-3 py-2.5 rounded-xl font-body text-sm outline-none"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          />
          <p className="font-body text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            Kalitsiz mahalliy ma'lumotlar ishlatiladi
          </p>
        </div>
      </SettingsSection>

      {/* Data */}
      <SettingsSection title="Ma'lumotlar">
        <SettingsRow
          icon={Trash2}
          label="Saqlangan ma'lumotlarni tozalash"
          sublabel={`${savedPhrases.length} ta ibora o'chiriladi`}
          onClick={handleClearData}
          destructive
        />
      </SettingsSection>

      {/* Account */}
      <SettingsSection title="Hisob">
        <SettingsRow
          icon={LogOut}
          label="Chiqish"
          sublabel={`@${user?.telegramUsername}`}
          onClick={handleLogout}
          destructive
        />
      </SettingsSection>

      {/* App info */}
      <div className="flex items-center gap-2 px-1 pb-2">
        <Info size={13} style={{ color: 'var(--color-text-secondary)' }} />
        <p className="font-body text-xs" style={{ color: 'var(--color-text-secondary)' }}>
          PhraseFlow AI v1.0 · Google Gemini bilan ishlaydi
        </p>
      </div>
    </div>
  );
}
