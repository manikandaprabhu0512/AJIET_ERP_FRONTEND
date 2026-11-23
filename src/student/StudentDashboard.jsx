import React, { useState, useEffect } from 'react';
import './StudentDashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { getProfileApi, getStudentGradesApi } from '../services/apiService';
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
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  ClipboardList,
  ChevronDown
} from 'lucide-react';

// Initial empty profile schema (no fake mock names or numbers)
const EMPTY_STUDENT_PROFILE = {
  programType: 'UG',
  admissionQuota: '-',
  usn: '',
  branch: '',
  section: '',
  enrolledYear: '',
  fullName: '',
  dob: '',
  gender: '',
  bloodGroup: '',
  mediumOfInstruction: 'English',
  placeOfStay: '',
  pgOwnerName: '',
  pgAddress: '',
  pgContactCountryCode: '+91',
  pgContactNumber: '',
  religion: '',
  caste: '',
  category: '',
  aadhaarNumber: '',
  sslcPercentage: '',
  pucPcmPercentage: '',
  pucTotalPercentage: '',
  studiedKannadaInSSLC: '',
  studentSsid: '',
  email: '',
  mobileCountryCode: '+91',
  mobile: '',
  state: '',
  district: '',
  city: '',
  addressLine1: '',
  pincode: '',
  fatherName: '',
  fatherOccupation: '',
  fatherMobileCountryCode: '+91',
  fatherMobile: '',
  motherName: '',
  motherOccupation: '',
  motherMobileCountryCode: '+91',
  motherMobile: '',
  declarationAccepted: true
};

export default function StudentDashboard({ onLogout = () => { }, currentUser = null }) {
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'academics' | 'extracurricular'

  // ── Academics / Grade Ledger State ──────────────────────────────────────────
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);
  // Default sidebar closed on mobile (< 768px), open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

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

  // Initialize student profile strictly from currentUser auth session, no fake mock identities
  const [studentData, setStudentData] = useState(() => {
    return {
      ...EMPTY_STUDENT_PROFILE,
      fullName: (currentUser?.name && !currentUser.name.startsWith('Student (')) ? currentUser.name : '',
      usn: currentUser?.username || '',
      email: currentUser?.email || '',
      branch: currentUser?.branch || '',
      section: currentUser?.section || ''
    };
  });

  // Fetch live database record from MySQL if logged in with JWT token
  useEffect(() => {
    const token = currentUser?.token || localStorage.getItem('ajiet_auth_token');
    if (!token) {
      setIsLoadingProfile(false);
      return;
    }

    setIsLoadingProfile(true);
    getProfileApi(token)
      .then((dbProfile) => {
        if (!dbProfile) return;
        setStudentData((prev) => ({
          ...prev,
          programType: dbProfile.program_type || prev.programType,
          admissionQuota: dbProfile.admission_quota || prev.admissionQuota,
          usn: dbProfile.usn || prev.usn,
          branch: dbProfile.branch || prev.branch,
          section: dbProfile.section || prev.section,
          enrolledYear: dbProfile.enrolled_year || prev.enrolledYear,
          fullName: dbProfile.full_name || prev.fullName,
          dob: dbProfile.dob ? String(dbProfile.dob).split('T')[0] : prev.dob,
          gender: dbProfile.gender || prev.gender,
          bloodGroup: dbProfile.blood_group || prev.bloodGroup,
          mediumOfInstruction: dbProfile.medium_of_instruction || prev.mediumOfInstruction,
          placeOfStay: dbProfile.place_of_stay || prev.placeOfStay,
          pgOwnerName: dbProfile.pg_owner_name || prev.pgOwnerName,
          pgAddress: dbProfile.pg_address || prev.pgAddress,
          pgContactCountryCode: dbProfile.pg_contact_country_code || prev.pgContactCountryCode,
          pgContactNumber: dbProfile.pg_contact_number || prev.pgContactNumber,
          religion: dbProfile.religion || prev.religion,
          caste: dbProfile.caste || prev.caste,
          category: dbProfile.category || prev.category,
          aadhaarNumber: dbProfile.aadhaar_number || prev.aadhaarNumber,
          sslcPercentage: dbProfile.sslc_percentage ? String(dbProfile.sslc_percentage) : prev.sslcPercentage,
          pucPcmPercentage: dbProfile.puc_pcm_percentage ? String(dbProfile.puc_pcm_percentage) : prev.pucPcmPercentage,
          pucTotalPercentage: dbProfile.puc_total_percentage ? String(dbProfile.puc_total_percentage) : prev.pucTotalPercentage,
          studiedKannadaInSSLC: dbProfile.studied_kannada_in_sslc || prev.studiedKannadaInSSLC,
          studentSsid: dbProfile.student_ssid || prev.studentSsid,
          email: dbProfile.email || prev.email,
          mobileCountryCode: dbProfile.mobile_country_code || prev.mobileCountryCode,
          mobile: dbProfile.mobile || prev.mobile,
          state: dbProfile.state || prev.state,
          district: dbProfile.district || prev.district,
          city: dbProfile.city || prev.city,
          addressLine1: dbProfile.address_line1 || prev.addressLine1,
          pincode: dbProfile.pincode || prev.pincode,
          fatherName: dbProfile.father_name || prev.fatherName,
          fatherOccupation: dbProfile.father_occupation || prev.fatherOccupation,
          fatherMobileCountryCode: dbProfile.father_mobile_country_code || prev.fatherMobileCountryCode,
          fatherMobile: dbProfile.father_mobile || prev.fatherMobile,
          motherName: dbProfile.mother_name || prev.motherName,
          motherOccupation: dbProfile.mother_occupation || prev.motherOccupation,
          motherMobileCountryCode: dbProfile.mother_mobile_country_code || prev.motherMobileCountryCode,
          motherMobile: dbProfile.mother_mobile || prev.motherMobile
        }));
      })
      .catch((err) => {
        console.warn('Failed to load live profile from DB:', err.message);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [currentUser]);

  // Fetch grade ledger whenever academics tab is active or semester selection changes
  useEffect(() => {
    if (activeTab !== 'academics') return;
    const usn = studentData.usn || currentUser?.username;
    if (!usn) return;

    setGradesLoading(true);
    setGradesError(null);
    getStudentGradesApi(usn, selectedSemester)
      .then((data) => {
        setAcademicData(data);
        // Auto-select first available semester if none chosen
        if (!selectedSemester && data.availableSemesters && data.availableSemesters.length > 0) {
          setSelectedSemester(data.availableSemesters[0]);
        }
      })
      .catch((err) => {
        setGradesError(err.message || 'Failed to load academic records.');
      })
      .finally(() => {
        setGradesLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedSemester, studentData.usn]);

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
              VIEW 2: ACADEMICS TAB — Premium Grade Ledger
              ========================================================= */}
          {activeTab === 'academics' && (
            <div className="tab-pane-container academics-pane-view">

              {/* ── Loading State ── */}
              {gradesLoading && (
                <div className="grades-loading-wrap">
                  <Loader2 size={36} className="grades-spinner" />
                  <p>Fetching academic records from the AJIET ERP server…</p>
                </div>
              )}

              {/* ── Error State ── */}
              {!gradesLoading && gradesError && (
                <div className="grades-error-wrap">
                  <XCircle size={28} />
                  <p>{gradesError}</p>
                </div>
              )}

              {/* ── No Data ── */}
              {!gradesLoading && !gradesError && !academicData && (
                <div className="grades-empty-wrap">
                  <BookOpen size={44} />
                  <p>No academic records found. Contact the academic section if this is incorrect.</p>
                </div>
              )}

              {/* ── MAIN CONTENT ── */}
              {!gradesLoading && !gradesError && academicData && (() => {
                const records = academicData.records || [];
                const summary = academicData.summary || {};
                const availableSems = academicData.availableSemesters || [];
                const hasBacklog = records.some(r => r.grade_letter === 'F');

                const gradeColor = (letter) => {
                  if (!letter) return '';
                  if (letter === 'O' || letter === 'A+') return 'grade-badge-green';
                  if (letter === 'A' || letter === 'B+') return 'grade-badge-blue';
                  if (letter === 'B' || letter === 'C' || letter === 'P') return 'grade-badge-amber';
                  if (letter === 'F') return 'grade-badge-red';
                  return '';
                };

                return (
                  <>
                    {/* ── Identity Strip / Page Header ── */}
                    <div className="gl-identity-strip">
                      <div className="gl-identity-left">
                        <p className="gl-identity-title">Academic Grade Ledger</p>
                        <p className="gl-identity-sub">
                          A.J. Institute of Engineering &amp; Technology, Mangaluru &nbsp;•&nbsp;
                          Dept of Electronics &amp; Communication Engg. (EC) &nbsp;•&nbsp;
                          VTU 2022 Scheme (NEP)
                        </p>
                      </div>
                      <div className="gl-identity-badges">
                        <span className="gl-badge">
                          <GraduationCap size={13} /> {studentData.usn || currentUser?.username}
                        </span>
                        <span className="gl-badge gl-badge-accent">
                          <Award size={13} /> Academic Year 2026–27
                        </span>
                        <span className="gl-badge">
                          {studentData.section || 'A'} &nbsp;|&nbsp; Batch {studentData.enrolledYear || '2025'}
                        </span>
                      </div>
                    </div>

                    {/* ── KPI Cards ── */}
                    <div className="grades-kpi-row">
                      {/* SGPA */}
                      <div className="grades-kpi-card kpi-card-primary">
                        <div className="kpi-icon-row">
                          <span className="kpi-label">SGPA</span>
                          <div className="kpi-icon-box kpi-icon-navy">
                            <TrendingUp size={16} />
                          </div>
                        </div>
                        <span className="kpi-value kpi-primary">
                          {summary.sgpa != null ? Number(summary.sgpa).toFixed(2) : '—'}
                        </span>
                        <span className="kpi-sub">Out of 10.00 Grade Points</span>
                      </div>

                      {/* Avg Attendance */}
                      <div className={`grades-kpi-card ${(summary.avgAttendance || 0) >= 85 ? 'kpi-card-success' : 'kpi-card-danger'}`}>
                        <div className="kpi-icon-row">
                          <span className="kpi-label">Avg Attendance</span>
                          <div className={`kpi-icon-box ${(summary.avgAttendance || 0) >= 85 ? 'kpi-icon-green' : 'kpi-icon-red'}`}>
                            <Calendar size={16} />
                          </div>
                        </div>
                        <span className={`kpi-value ${(summary.avgAttendance || 0) >= 85 ? 'kpi-success' : 'kpi-danger'}`}>
                          {summary.avgAttendance != null ? `${Number(summary.avgAttendance).toFixed(1)}%` : '—'}
                        </span>
                        <span className="kpi-sub">Min. Requirement: 85%</span>
                      </div>

                      {/* Total Credits */}
                      <div className="grades-kpi-card kpi-card-info">
                        <div className="kpi-icon-row">
                          <span className="kpi-label">Total Credits</span>
                          <div className="kpi-icon-box kpi-icon-blue">
                            <BookOpen size={16} />
                          </div>
                        </div>
                        <span className="kpi-value kpi-neutral">
                          {summary.totalCredits ?? '—'}
                        </span>
                        <span className="kpi-sub">Registered this semester</span>
                      </div>

                      {/* Result Status */}
                      <div className={`grades-kpi-card ${hasBacklog ? 'kpi-card-danger' : 'kpi-card-pass'}`}>
                        <div className="kpi-icon-row">
                          <span className="kpi-label">Result Status</span>
                          <div className={`kpi-icon-box ${hasBacklog ? 'kpi-icon-red' : 'kpi-icon-green'}`}>
                            {hasBacklog ? <XCircle size={16} /> : <CheckCircle2 size={16} />}
                          </div>
                        </div>
                        <span className={`kpi-value-sm ${hasBacklog ? 'kpi-danger' : 'kpi-success'}`}>
                          {hasBacklog ? 'BACKLOG' : 'ALL PASS'}
                        </span>
                        <span className="kpi-sub">
                          {hasBacklog ? 'One or more subjects failed' : 'No arrears detected this semester'}
                        </span>
                      </div>
                    </div>

                    {/* ── Semester Dropdown ── */}
                    <div className="semester-selector-wrap">
                      <label className="sem-selector-label" htmlFor="sem-dropdown">
                        Semester:
                      </label>
                      <div className="sem-dropdown-container">
                        <select
                          id="sem-dropdown"
                          className="sem-dropdown-select"
                          value={selectedSemester ?? ''}
                          onChange={(e) => setSelectedSemester(Number(e.target.value))}
                        >
                          {availableSems.map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem} ({sem === 2 ? '2nd' : sem === 3 ? '3rd' : `${sem}th`} Sem)
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="sem-dropdown-arrow" />
                      </div>
                    </div>

                    {/* ── Official VTU Grade Table ── */}
                    <div className="grade-ledger-wrap">
                      {/* Dark Header Bar */}
                      <div className="grade-ledger-title-bar">
                        <div className="ledger-title-left">
                          <span className="ledger-dept-label">
                            Dept. of Electronics &amp; Communication Engineering
                          </span>
                        </div>
                        {/* <div className="ledger-right-pills">
                          <span className="ledger-pill">USN: {studentData.usn || currentUser?.username}</span>
                          <span className="ledger-pill ledger-pill-accent">
                            Semester {selectedSemester} &nbsp;|&nbsp; VTU 2022 Scheme
                          </span>
                        </div> */}
                      </div>

                      {/* Scrollable Table */}
                      <div className="grade-table-scroll-wrap">
                        <table className="vtu-grade-table">
                          <thead>
                            <tr>
                              <th rowSpan="2" className="th-num">#</th>
                              <th rowSpan="2" className="th-code">Subject Code</th>
                              <th rowSpan="2" className="th-subject">Subjects</th>
                              <th colSpan="2" className="th-narrow th-group-internal">Internal Marks</th>
                              <th colSpan="3" className="th-narrow th-group-attendance">Attendance in %</th>
                              <th rowSpan="2" className="th-narrow">CIE (50)</th>
                              <th rowSpan="2" className="th-narrow">External (50)</th>
                              <th rowSpan="2" className="th-narrow">Total (100)</th>
                              <th rowSpan="2" className="th-narrow">Grade Point</th>
                              <th rowSpan="2" className="th-narrow">Credit Point</th>
                              <th rowSpan="2" className="th-narrow">Grade</th>
                            </tr>
                            <tr>
                              <th className="th-narrow th-group-internal">I</th>
                              <th className="th-narrow th-group-internal">II</th>
                              <th className="th-narrow th-group-attendance">I</th>
                              <th className="th-narrow th-group-attendance">II</th>
                              <th className="th-narrow th-group-attendance">Final</th>
                            </tr>
                          </thead>
                          <tbody>
                            {records.length === 0 ? (
                              <tr>
                                <td colSpan="14" className="td-empty-state">
                                  No records found for Semester {selectedSemester}.
                                </td>
                              </tr>
                            ) : (
                              records.map((r, idx) => (
                                <tr key={r.subject_code || idx} className={r.grade_letter === 'F' ? 'tr-fail' : ''}>
                                  <td className="td-center td-muted">{idx + 1}</td>
                                  <td className="td-center">
                                    <span className="subject-code-badge">{r.subject_code}</span>
                                  </td>
                                  <td className="td-subject-name">
                                    <span className="subject-name-text">{r.subject_name}</span>
                                    <span className="subject-credits-pill">{r.credits} Credits</span>
                                  </td>
                                  <td className="td-center marks-val">{r.internal_marks_1 ?? '—'}</td>
                                  <td className="td-center marks-val">{r.internal_marks_2 ?? '—'}</td>
                                  <td className="td-center marks-val">{r.attendance_1 != null ? `${r.attendance_1}%` : '—'}</td>
                                  <td className="td-center marks-val">{r.attendance_2 != null ? `${r.attendance_2}%` : '—'}</td>
                                  <td className="td-center">
                                    <span className={r.final_attendance < 85 ? 'attendance-low' : 'attendance-ok'}>
                                      {r.final_attendance != null ? `${r.final_attendance}%` : '—'}
                                    </span>
                                  </td>
                                  <td className="td-center marks-val">{r.cie_marks ?? '—'}</td>
                                  <td className="td-center marks-val">{r.external_marks ?? '—'}</td>
                                  <td className="td-center">
                                    <span className="total-marks-val">{r.total_marks ?? '—'}</span>
                                  </td>
                                  <td className="td-center grade-point-val">{r.grade_point ?? '—'}</td>
                                  <td className="td-center credit-point-val">{r.credit_point ?? '—'}</td>
                                  <td className="td-center">
                                    <span className={`grade-letter-badge ${gradeColor(r.grade_letter)}`}>
                                      {r.grade_letter || '—'}
                                    </span>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                          {records.length > 0 && (
                            <tfoot>
                              <tr className="tfoot-summary-row">
                                <td colSpan="2" />
                                <td className="tfoot-label">Semester Totals</td>
                                <td colSpan="8" />
                                <td className="td-center">
                                  <span className="tfoot-pill">Credits: {summary.totalCredits ?? '—'}</span>
                                </td>
                                <td className="td-center">
                                  <span className="tfoot-pill">Cr·Pts: {summary.totalCreditPoints ?? '—'}</span>
                                </td>
                                <td className="td-center">
                                  <span className="tfoot-sgpa-badge">
                                    SGPA: {summary.sgpa != null ? Number(summary.sgpa).toFixed(2) : '—'}
                                  </span>
                                </td>
                              </tr>
                            </tfoot>
                          )}
                        </table>
                      </div>

                      {/* Footer note */}
                      {/* <div className="grade-ledger-footer-note">
                        <ShieldCheck size={14} />
                        <span>
                          This is an official academic record synchronized from the AJIET ERP central database.
                          For any discrepancies, contact the Academic Section, Admin Block — Block A, AJIET Mangaluru.
                        </span>
                      </div> */}
                    </div>
                  </>
                );
              })()}
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
