import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import './App.css';
import RoleSelectionGateway from './auth/RoleSelectionGateway';
import LoginPortal from './auth/LoginPortal';
import StudentSignup from './auth/StudentSignup';
import FlashScreen from './common/FlashScreen';
import Dashboard from './common/Dashboard';
import NoInternet from './common/nointernet';

/* ── Gateway page (/): select a portal, then push to /login ── */
function GatewayPage() {
  const navigate = useNavigate();
  const handleSelectRole = (roleConfig) => {
    navigate('/login', { state: { role: roleConfig } });
  };
  return <RoleSelectionGateway onSelectRole={handleSelectRole} />;
}

/* ── Login page (/login): reads role from router location state ── */
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentView, setCurrentView] = useState('login');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ajiet_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });

  // Role passed from Gateway via navigate state; fallback to Student
  const selectedRole = location.state?.role || {
    category: 'student',
    subRole: 'Student',
    title: 'Student Portal',
    identifierType: 'USN',
    exampleId: '4JK26AB123',
  };

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    try { localStorage.setItem('ajiet_current_user', JSON.stringify(user)); }
    catch (e) { console.warn('Storage error', e); }
    setCurrentView('flash');
  };

  const handleFlashComplete = () => {
    try { localStorage.setItem('ajiet_is_logged_in', 'true'); }
    catch (e) { console.warn(e); }
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('ajiet_is_logged_in');
      localStorage.removeItem('ajiet_current_user');
    } catch (e) { console.warn(e); }
    setCurrentUser(null);
    navigate('/');
  };

  if (currentView === 'flash') return <FlashScreen onComplete={handleFlashComplete} />;
  if (currentView === 'dashboard') return <Dashboard onLogout={handleLogout} currentUser={currentUser} />;

  return (
    <LoginPortal
      key={`${selectedRole.category}-${selectedRole.subRole}`}
      selectedRole={selectedRole}
      onBackToGateway={() => navigate('/')}
      onLoginSuccess={handleLoginSuccess}
      onStudentSignup={() => navigate('/signup')}
    />
  );
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
      </Routes>
    </>
  );
}
