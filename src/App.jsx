import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import './App.css';
import RoleSelectionGateway from './auth/RoleSelectionGateway';
import LoginPortal from './auth/LoginPortal';
import StudentSignup from './auth/StudentSignup';
import FacultySignup from './auth/FacultySignup';
import FlashScreen from './common/FlashScreen';
import Dashboard from './common/Dashboard';
import NoInternet from './common/nointernet';
import { getStoredSession, saveSession, clearSession } from './utils/sessionManager';

/* ── Gateway page (/): select a portal, then push to /login. If logged in, go to /dashboard ── */
function GatewayPage() {
  const navigate = useNavigate();
  const session = getStoredSession();

  // Auto-redirect authenticated user directly to /dashboard on tab reopen / root visit
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelectRole = (roleConfig) => {
    navigate('/login', { state: { role: roleConfig } });
  };
  return <RoleSelectionGateway onSelectRole={handleSelectRole} />;
}

/* ── Login page (/login): reads role from router location state ── */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showFlash, setShowFlash] = useState(false);

  // If already authenticated with JWT / cookie session, redirect to /dashboard
  const session = getStoredSession();
  if (session && !showFlash) {
    return <Navigate to="/dashboard" replace />;
  }

  // Role passed from Gateway via navigate state; fallback to Student
  const selectedRole = location.state?.role || {
    category: 'student',
    subRole: 'Student',
    title: 'Student Portal',
    identifierType: 'USN',
    exampleId: '4JK26AB123',
  };

  const handleLoginSuccess = (user) => {
    saveSession(user, user.token);
    setShowFlash(true);
  };

  const handleFlashComplete = () => {
    navigate('/dashboard', { replace: true });
  };

  if (showFlash) {
    return <FlashScreen onComplete={handleFlashComplete} />;
  }

  return (
    <LoginPortal
      key={`${selectedRole.category}-${selectedRole.subRole}`}
      selectedRole={selectedRole}
      onBackToGateway={() => navigate('/')}
      onLoginSuccess={handleLoginSuccess}
      onStudentSignup={() => navigate('/signup')}
      onFacultySignup={() => navigate('/faculty-signup')}
    />
  );
}

/* ── Dashboard page (/dashboard): reads authenticated user and renders role dashboard ── */
function DashboardPage() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    navigate('/', { replace: true });
  };

  if (!currentUser) {
    // If not authenticated, redirect to portal gateway
    return <Navigate to="/" replace />;
  }

  return <Dashboard onLogout={handleLogout} currentUser={currentUser} />;
}

/* ── Root App: routes only ── */
export default function App() {
  return (
    <>
      <NoInternet />
      <Routes>
        <Route path="/" element={<GatewayPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<StudentSignup />} />
        <Route path="/faculty-signup" element={<FacultySignup />} />
        <Route path="/faculty-register" element={<FacultySignup />} />
        <Route path="/faculty/register" element={<FacultySignup />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
