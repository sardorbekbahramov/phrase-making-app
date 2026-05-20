import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Phrase, User, AppSettings, DifficultyFilter } from '../types';

interface AppState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  register: (username: string, password: string) => boolean;

  // Phrases
  savedPhrases: Phrase[];
  savePhrase: (phrase: Phrase) => void;
  unsavePhrase: (id: string) => void;
  isPhrased: (id: string) => boolean;

  // Feed
  currentPhrase: Phrase | null;
  setCurrentPhrase: (phrase: Phrase) => void;

  // Settings
  settings: AppSettings;
  updateSettings: (s: Partial<AppSettings>) => void;

  // Streak
  updateStreak: () => void;

  // Filter
  difficultyFilter: DifficultyFilter;
  setDifficultyFilter: (f: DifficultyFilter) => void;

  // Clear data
  clearAllData: () => void;
}

const defaultSettings: AppSettings = {
  darkMode: false,
  fontSize: 'md',
  geminiApiKey: '',
};

// Simple user DB in localStorage
function getUserDB(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem('phraseflow_users') || '{}');
  } catch {
    return {};
  }
}

function saveUserDB(db: Record<string, string>) {
  localStorage.setItem('phraseflow_users', JSON.stringify(db));
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: (username, password) => {
        const db = getUserDB();
        if (db[username.toLowerCase()] === password) {
          const storedUser = JSON.parse(
            localStorage.getItem(`phraseflow_user_${username.toLowerCase()}`) || 'null'
          );
          const user: User = storedUser || {
            telegramUsername: username,
            password,
            streak: 0,
            lastActiveDate: '',
            totalPhrasesSeen: 0,
            totalQuizzesCompleted: 0,
          };
          set({ user, isAuthenticated: true });
          return true;
        }
        return false;
      },

      register: (username, password) => {
        const db = getUserDB();
        const key = username.toLowerCase();
        if (db[key]) return false; // already exists
        db[key] = password;
        saveUserDB(db);
        const user: User = {
          telegramUsername: username,
          password,
          streak: 0,
          lastActiveDate: '',
          totalPhrasesSeen: 0,
          totalQuizzesCompleted: 0,
        };
        localStorage.setItem(`phraseflow_user_${key}`, JSON.stringify(user));
        set({ user, isAuthenticated: true });
        return true;
      },

      logout: () => {
        set({ user: null, isAuthenticated: false, savedPhrases: [], currentPhrase: null });
      },

      savedPhrases: [],

      savePhrase: (phrase) => {
        const { savedPhrases } = get();
        if (!savedPhrases.find(p => p.id === phrase.id)) {
          set({ savedPhrases: [{ ...phrase, savedAt: Date.now() }, ...savedPhrases] });
        }
      },

      unsavePhrase: (id) => {
        set({ savedPhrases: get().savedPhrases.filter(p => p.id !== id) });
      },

      isPhrased: (id) => {
        return get().savedPhrases.some(p => p.id === id);
      },

      currentPhrase: null,
      setCurrentPhrase: (phrase) => set({ currentPhrase: phrase }),

      settings: defaultSettings,
      updateSettings: (s) => set({ settings: { ...get().settings, ...s } }),

      updateStreak: () => {
        const { user } = get();
        if (!user) return;
        const today = new Date().toDateString();
        if (user.lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = user.lastActiveDate === yesterday ? user.streak + 1 : 1;
        const updatedUser = { ...user, streak: newStreak, lastActiveDate: today };
        set({ user: updatedUser });
        localStorage.setItem(
          `phraseflow_user_${user.telegramUsername.toLowerCase()}`,
          JSON.stringify(updatedUser)
        );
      },

      difficultyFilter: 'all',
      setDifficultyFilter: (f) => set({ difficultyFilter: f }),

      clearAllData: () => {
        set({ savedPhrases: [], settings: defaultSettings });
      },
    }),
    {
      name: 'phraseflow-storage',
      partialize: (state) => ({
        savedPhrases: state.savedPhrases,
        settings: state.settings,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
