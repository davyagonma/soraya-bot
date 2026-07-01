import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import LearnPage from './pages/LearnPage';
import TopicPage from './pages/TopicPage';
import SecurityPage from './pages/SecurityPage';
import AssistantPage from './pages/AssistantPage';
import AlertsPage from './pages/AlertsPage';
import NewsPage from './pages/NewsPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter basename="/demo">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/topic/:slug" element={<TopicPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/assistant" element={<ProtectedRoute><AssistantPage /></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><AlertsPage /></ProtectedRoute>} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
