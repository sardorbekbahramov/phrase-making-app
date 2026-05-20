import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import Layout from './components/layout/Layout';
import AuthPage from './pages/AuthPage';
import FeedPage from './pages/FeedPage';
import FavoritesPage from './pages/FavoritesPage';
import QuizPage from './pages/QuizPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  const { isAuthenticated, settings } = useAppStore();

  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<FeedPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default App;
