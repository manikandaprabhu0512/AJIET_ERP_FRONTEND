import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import Header from './Header';
import Footer from './Footer';
import StudentDashboard from '../student/StudentDashboard';
import {
  Users,
  Building2,
  Bed,
  Stethoscope,
  UserCheck,
  HeartPulse,
  Activity,
  UtensilsCrossed,
  Pill,
  Box,
  ShieldCheck,
  Receipt,
  Wallet,
  BarChart3,
  Wrench,
  Sparkles,
  Shirt,
  FlaskConical,
  HelpCircle,
  GraduationCap,
  FileSpreadsheet
} from 'lucide-react';

export default function Dashboard({ onLogout = () => {}, currentUser = null }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  // Live real-time clock and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      // Format: DD-MM-YYYY
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDate(`${day}-${month}-${year}`);

      // Format: HH:MM:SS AM/PM
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, '0');
      setCurrentTime(`${formattedHours}:${minutes}:${seconds} ${ampm}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Role based check: student role routes to dedicated StudentDashboard
  const isStudent = currentUser?.role === 'student' || currentUser?.category === 'student';

  if (isStudent) {
    return <StudentDashboard onLogout={onLogout} currentUser={currentUser} />;
  }

  // 20 Cards in 5x4 Grid layout matching the reference UI
  const cardsData = isStudent
    ? [
        { id: 1, title: 'Student Info Sheet', icon: FileSpreadsheet, highlight: true },
        { id: 2, title: 'Attendance', icon: UserCheck },
        { id: 3, title: 'Internal Marks', icon: BarChart3 },
        { id: 4, title: 'Mentorship', icon: Users },
        { id: 5, title: 'Time Table', icon: Activity },
        { id: 6, title: 'Examinations', icon: GraduationCap },
        { id: 7, title: 'Fee Details', icon: Wallet },
        { id: 8, title: 'Library', icon: Box },
        { id: 9, title: 'Hostel Info', icon: Bed },
        { id: 10, title: 'Placement & Training', icon: Building2 },
        { id: 11, title: 'Feedback', icon: Sparkles },
        { id: 12, title: 'Circulars / Notices', icon: Receipt },
        { id: 13, title: 'Achievements', icon: ShieldCheck },
        { id: 14, title: 'Lab Records', icon: FlaskConical },
        { id: 15, title: 'Sports & Cultural', icon: Shirt },
        { id: 16, title: 'Medical / Health', icon: HeartPulse },
        { id: 17, title: 'Canteen / Mess', icon: UtensilsCrossed },
        { id: 18, title: 'Grievance Cell', icon: Wrench },
        { id: 19, title: 'Scholarships', icon: Pill },
        { id: 20, title: 'Help Desk', icon: HelpCircle }
      ]
    : [
        { id: 1, title: 'Class Advisor Hub', icon: Users },
        { id: 2, title: 'Mentorship Batch', icon: UserCheck },
        { id: 3, title: 'Subject Attendance', icon: Activity },
        { id: 4, title: 'IA Marks Entry', icon: BarChart3 },
        { id: 5, title: 'Student Info Sheet View', icon: FileSpreadsheet, highlight: true },
        { id: 6, title: 'Department Faculty', icon: Building2 },
        { id: 7, title: 'Syllabus & Course File', icon: Box },
        { id: 8, title: 'Timetable Scheduling', icon: Activity },
        { id: 9, title: 'Accreditation (NBA/NAAC)', icon: ShieldCheck },
        { id: 10, title: 'Laboratory Management', icon: FlaskConical },
        { id: 11, title: 'Research & Publications', icon: Sparkles },
        { id: 12, title: 'Staff Leaves & Attendance', icon: Stethoscope },
        { id: 13, title: 'Department Budget', icon: Wallet },
        { id: 14, title: 'Procurement / Inventory', icon: Receipt },
        { id: 15, title: 'Student Feedback Review', icon: HeartPulse },
        { id: 16, title: 'Placement Analytics', icon: Bed },
        { id: 17, title: 'Maintenance & Facility', icon: Wrench },
        { id: 18, title: 'Hostel Oversight', icon: UtensilsCrossed },
        { id: 19, title: 'Examination Cell', icon: Pill },
        { id: 20, title: 'Institution Helpdesk', icon: HelpCircle }
      ];

  return (
    <div className="dashboard-page-container">
      {/* 1. TOP HEADER (Uses Header.jsx) */}
      <Header onLogout={onLogout} currentUser={currentUser} />

      {/* 2. SUB-HEADER BANNER (Date, Title, Clock) */}
      <section className="dash-banner-bar">
        {/* Left Date Pill */}
        <div className="banner-pill date-pill">
          <span>{currentDate || '10-11-2026'}</span>
        </div>

        {/* Center Institution Title & Address */}
        <div className="banner-center-text">
          <h1 className="banner-title">A.J. INSTITUTE OF ENGINEERING & TECHNOLOGY</h1>
          <p className="banner-address">
            NH-66, Kottara Chowki, Mangaluru, Dakshina Kannada, Karnataka, PIN - 575006
          </p>
          {currentUser && (
            <div style={{ marginTop: '4px' }}>
              <span
                style={{
                  display: 'inline-block',
                  background: isStudent ? '#0284c7' : '#042d57',
                  color: '#ffffff',
                  padding: '3px 12px',
                  borderRadius: '12px',
                  fontSize: '0.78rem',
                  fontWeight: '600'
                }}
              >
                Logged in as: {currentUser.name} ({currentUser.username}) • {currentUser.role?.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Right Digital Clock Pill */}
        <div className="banner-pill time-pill">
          <span>{currentTime || '02:27:38 PM'}</span>
        </div>
      </section>

      {/* 3. 20 CARDS GRID (5 columns x 4 rows) */}
      <main className="dash-grid-section">
        <div className="cards-grid">
          {cardsData.map((card) => {
            const IconComponent = card.icon;
            return (
              <div
                key={card.id}
                className={`erp-module-card ${selectedCard === card.id ? 'active' : ''} ${card.highlight ? 'highlight-pulse' : ''}`}
                onClick={() => setSelectedCard(card.id)}
              >
                <div className="card-icon-badge">
                  <IconComponent size={24} />
                </div>
                <span className="card-title-text">{card.title}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* 4. Universal Footer */}
      <Footer />
    </div>
  );
}
