// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/common/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import SetupPage from './pages/interview/SetupPage';
import InterviewPage from './pages/interview/InterviewPage';
import ResultPage from './pages/interview/ResultPage';
import HistoryPage from './pages/history/HistoryPage';
import SessionDetailPage from './pages/history/SessionDetailPage';
import PeerPage from './pages/peer/PeerPage';
import ProfilePage from './pages/profile/ProfilePage';

import { useAuth } from './hooks/useAuth';

function RootRedirect() {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected — wrapped in AppLayout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/interview/setup" element={<SetupPage />} />
            <Route path="/interview/:sessionId" element={<InterviewPage />} />
            <Route path="/interview/:sessionId/result" element={<ResultPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/history/:sessionId" element={<SessionDetailPage />} />
            <Route path="/peer" element={<PeerPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Root redirect */}
          <Route path="/" element={<RootRedirect />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar
          closeOnClick
          theme="dark"
          toastStyle={{
            background: '#111111',
            border: '1px solid #262626',
            color: '#fafafa',
            fontSize: '0.875rem',
          }}
        />
      </BrowserRouter>
    </ErrorBoundary>
  );
}
