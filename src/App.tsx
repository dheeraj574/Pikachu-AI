import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import AIChatbot from './components/AIChatbot';

// Pages
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import SubjectsPage from './pages/SubjectsPage';
import ExamModePage from './pages/ExamModePage';
import PYQFinderPage from './pages/PYQFinderPage';
import ResourceLibraryPage from './pages/ResourceLibraryPage';
import AISearchPage from './pages/AISearchPage';
import UploadResourcePage from './pages/UploadResourcePage';
import BookmarkPage from './pages/BookmarkPage';
import ProfilePage from './pages/ProfilePage';
import AISummarizerPage from './pages/AISummarizerPage';
import DoubtSectionPage from './pages/DoubtSectionPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/exam-mode" element={<ExamModePage />} />
            <Route path="/pyq-finder" element={<PYQFinderPage />} />
            <Route path="/resources" element={<ResourceLibraryPage />} />
            <Route path="/upload" element={<UploadResourcePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ai-search" element={<AISearchPage />} />
            <Route path="/summarizer" element={<AISummarizerPage />} />
            <Route path="/doubts" element={<DoubtSectionPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
      <AIChatbot />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
