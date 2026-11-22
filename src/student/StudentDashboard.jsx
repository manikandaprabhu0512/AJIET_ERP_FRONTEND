import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import {
  User,
  GraduationCap,
  Sparkles,
  Award,
  BookOpen,
  Calendar,
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

// Default mock profile when no session data is present
const DEFAULT_STUDENT_PROFILE = {
  programType: 'UG',
  admissionQuota: 'CET',
  usn: '4JK26CS001',
  branch: 'B.E. in Computer Science & Engineering',
  section: 'Section A',
  enrolledYear: '2026',
  fullName: 'PRATHAM R SHETTY',
  dob: '2005-08-15',
  gender: 'Male',
  bloodGroup: 'O+',
  mediumOfInstruction: 'English',
  placeOfStay: 'Hostel',
  pgOwnerName: '',
  pgAddress: '',
  pgContactCountryCode: '+91',
  pgContactNumber: '',
  religion: 'Hindu',
  caste: 'Bunt',
  category: 'General Merit (GM)',
  aadhaarNumber: '987654321098',
  sslcPercentage: '95.6',
  pucPcmPercentage: '94.0',
  pucTotalPercentage: '94.8',
  studiedKannadaInSSLC: 'Yes',
  studentSsid: 'SSID-2026-KA882',
  email: 'pratham.shetty@ajiet.ac.in',
  mobileCountryCode: '+91',
  mobile: '9876543210',
  state: 'Karnataka',
  district: 'Dakshina Kannada',
  city: 'Mangaluru',
  addressLine1: '#402, Kadri Hills, Kottara Chowki, Mangaluru',
  pincode: '575006',
  fatherName: 'Ravindra Shetty',
  fatherOccupation: 'Civil Contractor / Business',
  fatherMobileCountryCode: '+91',
  fatherMobile: '9845012345',
  motherName: 'Sujatha R. Shetty',
  motherOccupation: 'Homemaker',
  motherMobileCountryCode: '+91',
  motherMobile: '9845067890',
  declarationAccepted: true
};

export default function StudentDashboard({ onLogout = () => {}, currentUser = null }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'academics' | 'extracurricular'
  // Default sidebar closed on mobile (< 768px), open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Live institutional clock and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setCurrentDate(`${day}-${month}-${year}`);

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

  // Retrieve student profile from session storage if registered, prioritizing registered student's actual name
  const [studentData] = useState(() => {
    try {
      const savedSession = sessionStorage.getItem('ajiet_student_registration_session');
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const registeredFullName = parsed.fullName?.trim();
        return {
          ...DEFAULT_STUDENT_PROFILE,
          ...parsed,
          fullName: registeredFullName || (currentUser?.name && !currentUser.name.startsWith('Student (') ? currentUser.name : DEFAULT_STUDENT_PROFILE.fullName),
          usn: parsed.usn || currentUser?.username || DEFAULT_STUDENT_PROFILE.usn,
          email: parsed.email || currentUser?.email || DEFAULT_STUDENT_PROFILE.email,
          branch: parsed.branch || currentUser?.branch || DEFAULT_STUDENT_PROFILE.branch
        };
      }
    } catch (e) {
      console.warn('Session read error:', e);
    }

    return {
      ...DEFAULT_STUDENT_PROFILE,
      fullName: (currentUser?.name && !currentUser.name.startsWith('Student (')) ? currentUser.name : DEFAULT_STUDENT_PROFILE.fullName,
      usn: currentUser?.username || DEFAULT_STUDENT_PROFILE.usn,
      email: currentUser?.email || DEFAULT_STUDENT_PROFILE.email,
      branch: currentUser?.branch || DEFAULT_STUDENT_PROFILE.branch
    };
  });

  return (
    <div className="student-portal-container">
      {/* 1. Global Header — includes date|time pill, hamburger toggle */}
      <Header
        onLogout={onLogout}
        currentUser={currentUser}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        currentDate={currentDate}
        currentTime={currentTime}
        displayName={studentData.fullName}
        displaySubtitle={studentData.usn}
      />

      {/* 2. Main Workspace with Sidebar & Content */}
      <div className={`student-portal-workspace ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Mobile backdrop overlay — tapping it closes the sidebar */}
        {isSidebarOpen && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* LEFT YOUTUBE-STYLE SIDEBAR NAVIGATION */}
        <aside className={`student-portal-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-mini'}`}>
          {isSidebarOpen ? (
            <>
              {/* Mini Student ID Card in Sidebar */}
              <div className="sidebar-student-card">
                <div className="student-avatar-wrap">
                  <div className="student-initials-badge">
                    {studentData.fullName
                      .split(' ')
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('') || 'ST'}
                  </div>
                </div>
                <div className="sidebar-student-meta">
                  <h3 className="sidebar-student-name">{studentData.fullName}</h3>
                  <span className="sidebar-student-usn">{studentData.usn}</span>
                  <span className="sidebar-student-branch">{studentData.branch}</span>
                  <span className="sidebar-student-badge">
                    {studentData.section} • {studentData.enrolledYear} Batch
                  </span>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="sidebar-nav-menu">
                <div className="sidebar-menu-heading">Portal Navigation</div>

                {/* TAB 1: Profile */}
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                  title="Profile"
                >
                  <div className="nav-item-icon-box">
                    <User size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Profile</span>
                    <span className="nav-subtitle">Personal, academic &amp; records</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                {/* TAB 2: Academics */}
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'academics' ? 'active' : ''}`}
                  onClick={() => setActiveTab('academics')}
                  title="Academics"
                >
                  <div className="nav-item-icon-box">
                    <GraduationCap size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Academics</span>
                    <span className="nav-subtitle">Curriculum, IA marks &amp; attendance</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                {/* TAB 3: Extracurricular Activity */}
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'extracurricular' ? 'active' : ''}`}
                  onClick={() => setActiveTab('extracurricular')}
                  title="Extracurricular Activity"
                >
                  <div className="nav-item-icon-box">
                    <Sparkles size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Extracurricular Activity</span>
                    <span className="nav-subtitle">Clubs, sports &amp; activity points</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>
              </nav>

              {/* Sidebar Institutional Footer Note */}
              <div className="sidebar-system-note">
                <ShieldCheck size={14} />
                <span>AJIET Official Student Gateway</span>
              </div>
            </>
          ) : (
            /* YOUTUBE-STYLE COLLAPSED MINI SIDEBAR */
            <nav className="sidebar-mini-menu">
              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                title="Profile"
              >
                <div className="mini-icon-wrap">
                  <User size={20} />
                </div>
                <span className="mini-item-label">Profile</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'academics' ? 'active' : ''}`}
                onClick={() => setActiveTab('academics')}
                title="Academics"
              >
                <div className="mini-icon-wrap">
                  <GraduationCap size={20} />
                </div>
                <span className="mini-item-label">Academics</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'extracurricular' ? 'active' : ''}`}
                onClick={() => setActiveTab('extracurricular')}
                title="Extracurricular Activity"
              >
                <div className="mini-icon-wrap">
                  <Sparkles size={20} />
                </div>
                <span className="mini-item-label">Activities</span>
              </button>
            </nav>
          )}
        </aside>

        {/* RIGHT MAIN CONTENT AREA */}
        <main className="student-portal-main-panel">
          {/* =========================================================
              VIEW 1: PROFILE TAB (View-Only, No Print Button)
              ========================================================= */}
          {activeTab === 'profile' && (
            <div className="tab-pane-container profile-pane-view">
              {/* Header Title Banner */}
              <div className="pane-header-banner">
                <div className="pane-header-left">
                  <div className="pane-title-icon-badge">
                    <User size={22} />
                  </div>
                  <div>
                    <h2 className="pane-main-title">Student Profile &amp; Information Sheet</h2>
                    <p className="pane-main-subtitle">
                      Official verified student registration record in central AJIET ERP database
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Summary Card */}
              <div className="student-overview-hero-card">
                <div className="overview-hero-grid">
                  <div className="hero-data-cell">
                    <span className="hero-label">Student Name</span>
                    <strong className="hero-value">{studentData.fullName}</strong>
                  </div>
                  <div className="hero-data-cell">
                    <span className="hero-label">University Seat No. (USN)</span>
                    <strong className="hero-value usn-color-text">{studentData.usn}</strong>
                  </div>
                  <div className="hero-data-cell">
                    <span className="hero-label">Department / Branch</span>
                    <strong className="hero-value">{studentData.branch}</strong>
                  </div>
                  <div className="hero-data-cell">
                    <span className="hero-label">Admission Quota &amp; Batch</span>
                    <strong className="hero-value">
                      {studentData.admissionQuota} • Batch {studentData.enrolledYear} ({studentData.section})
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 01: Academic & Admission Details */}
              <section className="profile-section-card">
                <div className="profile-section-head">
                  <div className="section-badge-num">01</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">Academic &amp; Admission Details</h3>
                    <p className="section-heading-sub">Institutional program affiliation and university registration</p>
                  </div>
                </div>
                <div className="profile-details-grid">
                  <div className="profile-cell">
                    <span className="cell-label">Program Level</span>
                    <strong className="cell-value">
                      {studentData.programType === 'UG' ? 'Undergraduate (UG) - B.E.' : 'Postgraduate (PG)'}
                    </strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Admission Quota</span>
                    <strong className="cell-value">{studentData.admissionQuota}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">University Seat No. (USN)</span>
                    <strong className="cell-value usn-color-text">{studentData.usn}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Department / Branch</span>
                    <strong className="cell-value">{studentData.branch}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Branch Section</span>
                    <strong className="cell-value">{studentData.section}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Enrolled Year</span>
                    <strong className="cell-value">{studentData.enrolledYear}</strong>
                  </div>
                </div>
              </section>

              {/* SECTION 02: Personal & Identity Details */}
              <section className="profile-section-card">
                <div className="profile-section-head">
                  <div className="section-badge-num">02</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">Personal &amp; Identity Details</h3>
                    <p className="section-heading-sub">Student identity, accommodation, and reservation</p>
                  </div>
                </div>
                <div className="profile-details-grid">
                  <div className="profile-cell">
                    <span className="cell-label">Student Name</span>
                    <strong className="cell-value">{studentData.fullName}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Date of Birth</span>
                    <strong className="cell-value">{studentData.dob}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Gender</span>
                    <strong className="cell-value">{studentData.gender}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Blood Group</span>
                    <strong className="cell-value">{studentData.bloodGroup}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Medium of Instruction</span>
                    <strong className="cell-value">{studentData.mediumOfInstruction}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Place of Stay</span>
                    <strong className="cell-value">{studentData.placeOfStay}</strong>
                  </div>
                  {(studentData.placeOfStay === 'PG' || studentData.placeOfStay === 'Other') && (
                    <>
                      <div className="profile-cell">
                        <span className="cell-label">Owner / Caretaker Name</span>
                        <strong className="cell-value">{studentData.pgOwnerName || 'N/A'}</strong>
                      </div>
                      <div className="profile-cell">
                        <span className="cell-label">Owner Contact Number</span>
                        <strong className="cell-value">
                          {studentData.pgContactCountryCode} {studentData.pgContactNumber || 'N/A'}
                        </strong>
                      </div>
                      <div className="profile-cell full-width">
                        <span className="cell-label">Accommodation / PG Address</span>
                        <strong className="cell-value">{studentData.pgAddress || 'N/A'}</strong>
                      </div>
                    </>
                  )}
                  <div className="profile-cell">
                    <span className="cell-label">Religion</span>
                    <strong className="cell-value">{studentData.religion}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Caste / Sub-Caste</span>
                    <strong className="cell-value">{studentData.caste || 'N/A'}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Category</span>
                    <strong className="cell-value">{studentData.category}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Aadhaar Card No.</span>
                    <strong className="cell-value">
                      {studentData.aadhaarNumber
                        ? `${studentData.aadhaarNumber.slice(0, 4)} ${studentData.aadhaarNumber.slice(4, 8)} ${studentData.aadhaarNumber.slice(8, 12)}`
                        : 'N/A'}
                    </strong>
                  </div>
                </div>
              </section>

              {/* SECTION 03: Education Details */}
              <section className="profile-section-card">
                <div className="profile-section-head">
                  <div className="section-badge-num">03</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">Education Details</h3>
                    <p className="section-heading-sub">Previous qualifying examination percentages &amp; state scholarship ID</p>
                  </div>
                </div>
                <div className="profile-details-grid">
                  <div className="profile-cell">
                    <span className="cell-label">SSLC / 10th Percentage</span>
                    <strong className="cell-value">{studentData.sslcPercentage}%</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">PUC / 12th PCM Percentage</span>
                    <strong className="cell-value">{studentData.pucPcmPercentage}%</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">PUC / 12th Total Percentage</span>
                    <strong className="cell-value">{studentData.pucTotalPercentage}%</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Studied Kannada in 10th / SSLC</span>
                    <strong className="cell-value">{studentData.studiedKannadaInSSLC}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Student SSID (Scholarship ID)</span>
                    <strong className="cell-value">{studentData.studentSsid || 'Not Provided'}</strong>
                  </div>
                </div>
              </section>

              {/* SECTION 04: Contact & Residential Details */}
              <section className="profile-section-card">
                <div className="profile-section-head">
                  <div className="section-badge-num">04</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">Contact &amp; Residential Details</h3>
                    <p className="section-heading-sub">Student communication coordinates and permanent residence</p>
                  </div>
                </div>
                <div className="profile-details-grid">
                  <div className="profile-cell">
                    <span className="cell-label">Student Email Address</span>
                    <strong className="cell-value">{studentData.email}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Student Mobile Number</span>
                    <strong className="cell-value">
                      {studentData.mobileCountryCode} {studentData.mobile}
                    </strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">State</span>
                    <strong className="cell-value">{studentData.state}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">District</span>
                    <strong className="cell-value">{studentData.district}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">City / Town</span>
                    <strong className="cell-value">{studentData.city}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Postal PIN Code</span>
                    <strong className="cell-value">{studentData.pincode}</strong>
                  </div>
                  <div className="profile-cell full-width">
                    <span className="cell-label">Permanent Residential Address</span>
                    <strong className="cell-value">{studentData.addressLine1}</strong>
                  </div>
                </div>
              </section>

              {/* SECTION 05: Parent & Guardian Details */}
              <section className="profile-section-card">
                <div className="profile-section-head">
                  <div className="section-badge-num">05</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">Parent &amp; Guardian Information</h3>
                    <p className="section-heading-sub">Family background and emergency contacts</p>
                  </div>
                </div>
                <div className="profile-details-grid">
                  <div className="profile-cell">
                    <span className="cell-label">Father's / Guardian's Name</span>
                    <strong className="cell-value">{studentData.fatherName}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Father's Occupation</span>
                    <strong className="cell-value">{studentData.fatherOccupation || 'N/A'}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Father's Contact Number</span>
                    <strong className="cell-value">
                      {studentData.fatherMobileCountryCode} {studentData.fatherMobile}
                    </strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Mother's Name</span>
                    <strong className="cell-value">{studentData.motherName || 'N/A'}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Mother's Occupation</span>
                    <strong className="cell-value">{studentData.motherOccupation || 'N/A'}</strong>
                  </div>
                  <div className="profile-cell">
                    <span className="cell-label">Mother's Contact Number</span>
                    <strong className="cell-value">
                      {studentData.motherMobile
                        ? `${studentData.motherMobileCountryCode} ${studentData.motherMobile}`
                        : 'N/A'}
                    </strong>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =========================================================
              VIEW 2: ACADEMICS TAB
              ========================================================= */}
          {activeTab === 'academics' && (
            <div className="tab-pane-container academics-pane-view">
              {/* Header Title Banner */}
              <div className="pane-header-banner">
                <div className="pane-header-left">
                  <div className="pane-title-icon-badge academics-icon-badge">
                    <GraduationCap size={22} />
                  </div>
                  <div>
                    <h2 className="pane-main-title">Academics Workspace</h2>
                    <p className="pane-main-subtitle">
                      Curriculum syllabus, subject attendance, internal assessments (IA), and timetable
                    </p>
                  </div>
                </div>
              </div>

              {/* Academic Highlights Stat Cards */}
              <div className="academic-stats-row">
                <div className="stat-card">
                  <span className="stat-title">Current Semester</span>
                  <strong className="stat-number">1st Sem</strong>
                  <span className="stat-sub">Academic Year 2026-27</span>
                </div>
                <div className="stat-card stat-success">
                  <span className="stat-title">Overall Attendance</span>
                  <strong className="stat-number">91.4%</strong>
                  <span className="stat-sub">Minimum Requirement: 85%</span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Continuous Evaluation (IA)</span>
                  <strong className="stat-number">IA-1 Active</strong>
                  <span className="stat-sub">Next scheduled: 12th Dec</span>
                </div>
                <div className="stat-card">
                  <span className="stat-title">Credits Registered</span>
                  <strong className="stat-number">20 Credits</strong>
                  <span className="stat-sub">VTU 2022 / NEP Scheme</span>
                </div>
              </div>

              {/* Academic Modules Grid */}
              <div className="academic-modules-grid">
                <div className="acad-feature-card">
                  <div className="feature-icon-box">
                    <BookOpen size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Course Files &amp; Syllabus</h4>
                    <p>Access subject syllabus, lesson plans, lecture notes, and VTU prescribed textbooks.</p>
                  </div>
                </div>

                <div className="acad-feature-card">
                  <div className="feature-icon-box">
                    <TrendingUp size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Internal Assessment (IA) Scores</h4>
                    <p>View test scores, assignments, lab continuous evaluations, and improvement tests.</p>
                  </div>
                </div>

                <div className="acad-feature-card">
                  <div className="feature-icon-box">
                    <Calendar size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Weekly Class Timetable</h4>
                    <p>Interactive schedule of daily classroom lectures, practical lab batches, and tutorials.</p>
                  </div>
                </div>

                <div className="acad-feature-card">
                  <div className="feature-icon-box">
                    <FileSpreadsheet size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>VTU Examination Portal</h4>
                    <p>University exam applications, hall tickets, timetable, revaluation, and grade cards.</p>
                  </div>
                </div>
              </div>

              {/* Faculty Mentor Details */}
              <div className="mentor-assigned-card">
                <div className="mentor-card-head">
                  <AlertCircle size={18} />
                  <h4>Faculty Proctor / Mentor Assigned</h4>
                </div>
                <p>
                  For academic counseling, leave approvals, or grievance redressing, consult your assigned department
                  mentor:
                </p>
                <div className="mentor-data-strip">
                  <span>Mentor: <strong>Prof. Suresh Nair (Assistant Professor, Dept of CS)</strong></span>
                  <span>Cabin: <strong>Admin Block, Room #304</strong></span>
                  <span>Contact: <strong>suresh.ise@ajiet.ac.in</strong></span>
                </div>
              </div>
            </div>
          )}

          {/* =========================================================
              VIEW 3: EXTRACURRICULAR ACTIVITY TAB
              ========================================================= */}
          {activeTab === 'extracurricular' && (
            <div className="tab-pane-container extracurricular-pane-view">
              {/* Header Title Banner */}
              <div className="pane-header-banner">
                <div className="pane-header-left">
                  <div className="pane-title-icon-badge extra-icon-badge">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2 className="pane-main-title">Extracurricular Activity</h2>
                    <p className="pane-main-subtitle">
                      Student clubs, collegiate technical fests, athletics, NSS, and VTU AICTE activity points
                    </p>
                  </div>
                </div>
              </div>

              {/* AICTE Activity Points Tracker */}
              <div className="activity-points-card">
                <div className="points-header">
                  <div>
                    <span className="points-tag">VTU AICTE Activity Points Tracker</span>
                    <h3 className="points-title">Mandatory Degree Completion Points</h3>
                  </div>
                  <div className="points-counter">
                    <span className="earned-points">45</span>
                    <span className="total-points">/ 100 Points</span>
                  </div>
                </div>
                <div className="points-progress-bar-wrap">
                  <div className="points-progress-fill" style={{ width: '45%' }}></div>
                </div>
                <span className="points-note">
                  45 points earned through NSS orientation &amp; Coding Club workshops. 55 points remaining for degree requirement.
                </span>
              </div>

              {/* Clubs & Activities Categories */}
              <div className="extracurricular-cards-grid">
                <div className="club-card">
                  <div className="club-icon-circle">
                    <Award size={22} />
                  </div>
                  <h4>Technical &amp; Coding Societies</h4>
                  <p>
                    AJIET ByteCraft Coding Club, Google Developer Student Club, Robotics &amp; IoT Chapter, and IEEE
                    Student Branch.
                  </p>
                  <span className="club-status-pill">Active Member</span>
                </div>

                <div className="club-card">
                  <div className="club-icon-circle">
                    <Sparkles size={22} />
                  </div>
                  <h4>Cultural &amp; Arts Association</h4>
                  <p>
                    Music, classical and western dance, theatre &amp; drama troupe, fine arts club, and literary debating
                    society.
                  </p>
                  <span className="club-status-pill enrolled">Annual Fest 'Aakriti'</span>
                </div>

                <div className="club-card">
                  <div className="club-icon-circle">
                    <TrendingUp size={22} />
                  </div>
                  <h4>Sports &amp; Athletics</h4>
                  <p>
                    Inter-collegiate VTU sports, Cricket team, Badminton club, Table Tennis, Volleyball, and Annual Sports
                    Meet.
                  </p>
                  <span className="club-status-pill">Intramural Tournaments</span>
                </div>

                <div className="club-card">
                  <div className="club-icon-circle">
                    <ShieldCheck size={22} />
                  </div>
                  <h4>NSS, Youth Red Cross &amp; Eco Club</h4>
                  <p>
                    Community development drives, blood donation camps, environmental sustainability workshops, and
                    social camps.
                  </p>
                  <span className="club-status-pill enrolled">20 Points Allocated</span>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Footer — full-width, pinned to bottom of the viewport across sidebar + main panel */}
      <Footer />
    </div>
  );
}
