import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { getFacultyAssignedSubjectsApi } from '../services/apiService';
import {
  BookOpen,
  Calendar,
  Users,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  BarChart3,
  Building2,
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
  UserCheck,
  ChevronRight
} from 'lucide-react';

export default function FacultyDashboard({ onLogout = () => {}, currentUser = null }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Sidebar toggle state (Expanded on desktop, collapsed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);

  // Active navigation tab: 'subjects' | 'attendance' | 'marks' | 'students' | 'coursefile'
  const [activeTab, setActiveTab] = useState('subjects');

  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(null);

  const facultyId = currentUser?.id || currentUser?.username || 'EC001';
  const facultyName = currentUser?.name || 'Faculty Member';
  const designation = currentUser?.designation || 'Assistant Professor';
  const deptCode = currentUser?.deptCode || 'EC';
  const deptName = currentUser?.deptName || 'Electronics & Communication Engineering';

  // Live institutional clock
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

  // Fetch assigned subjects allocated by HOD
  useEffect(() => {
    async function loadAssigned() {
      try {
        setLoading(true);
        const res = await getFacultyAssignedSubjectsApi(facultyId);
        const list = Array.isArray(res) ? res : (res?.assignedSubjects || []);
        setAssignedSubjects(list);
        if (list.length > 0) {
          setSelectedSubject(list[0]);
        }
      } catch (err) {
        console.error('Failed to load faculty assigned subjects:', err);
        setAssignedSubjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadAssigned();
  }, [facultyId]);

  const teacherInitials = facultyName
    .replace('Dr.', '')
    .replace('Prof.', '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FC';

  return (
    <div className="erp-portal-container">
      {/* 1. Global Institutional Header with Hamburger Toggle */}
      <Header
        onLogout={onLogout}
        currentUser={currentUser}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        displayName={facultyName}
        displaySubtitle={`${designation} • Dept. of ${deptCode} (${facultyId})`}
        currentDate={currentDate}
        currentTime={currentTime}
      />

      {/* 2. Fullscreen Docked Workspace */}
      <div className={`erp-portal-workspace ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Docked YouTube-Style Sidebar */}
        <aside className={`erp-portal-sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-mini'}`}>
          {isSidebarOpen ? (
            <>
              {/* Mini Faculty Badge Card */}
              <div className="sidebar-profile-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-initials-badge">{teacherInitials}</div>
                </div>
                <div className="sidebar-profile-meta">
                  <h3 className="sidebar-profile-name">{facultyName}</h3>
                  <span className="sidebar-profile-id">{facultyId}</span>
                  <span className="sidebar-profile-dept">{designation}</span>
                  <span className="sidebar-role-pill">Subject Teacher</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav-menu">
                <div className="sidebar-menu-heading">Faculty Operations</div>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'subjects' ? 'active' : ''}`}
                  onClick={() => setActiveTab('subjects')}
                >
                  <div className="nav-item-icon-box">
                    <BookOpen size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Allocated Subjects</span>
                    <span className="nav-subtitle">{assignedSubjects.length} courses mapped</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('attendance')}
                >
                  <div className="nav-item-icon-box">
                    <UserCheck size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Subject Attendance</span>
                    <span className="nav-subtitle">Daily session register</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'marks' ? 'active' : ''}`}
                  onClick={() => setActiveTab('marks')}
                >
                  <div className="nav-item-icon-box">
                    <BarChart3 size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">IA Marks Entry</span>
                    <span className="nav-subtitle">CIE tests &amp; lab marks</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'students' ? 'active' : ''}`}
                  onClick={() => setActiveTab('students')}
                >
                  <div className="nav-item-icon-box">
                    <FileSpreadsheet size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Student Info Sheet</span>
                    <span className="nav-subtitle">Enrolled students view</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'coursefile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('coursefile')}
                >
                  <div className="nav-item-icon-box">
                    <Layers size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Course File &amp; Syllabus</span>
                    <span className="nav-subtitle">CO-PO mapping &amp; notes</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>
              </nav>

              {/* Sidebar Footer Note */}
              <div className="sidebar-institutional-note">
                <ShieldCheck size={14} />
                <span>AJIET Faculty Gateway</span>
              </div>
            </>
          ) : (
            /* Collapsed Mini Sidebar */
            <nav className="sidebar-mini-menu">
              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'subjects' ? 'active' : ''}`}
                onClick={() => setActiveTab('subjects')}
                title="Allocated Subjects"
              >
                <div className="mini-icon-wrap">
                  <BookOpen size={19} />
                </div>
                <span className="mini-item-label">Subjects</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'attendance' ? 'active' : ''}`}
                onClick={() => setActiveTab('attendance')}
                title="Attendance"
              >
                <div className="mini-icon-wrap">
                  <UserCheck size={19} />
                </div>
                <span className="mini-item-label">Attendance</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'marks' ? 'active' : ''}`}
                onClick={() => setActiveTab('marks')}
                title="IA Marks"
              >
                <div className="mini-icon-wrap">
                  <BarChart3 size={19} />
                </div>
                <span className="mini-item-label">IA Marks</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'students' ? 'active' : ''}`}
                onClick={() => setActiveTab('students')}
                title="Students"
              >
                <div className="mini-icon-wrap">
                  <FileSpreadsheet size={19} />
                </div>
                <span className="mini-item-label">Students</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'coursefile' ? 'active' : ''}`}
                onClick={() => setActiveTab('coursefile')}
                title="Course File"
              >
                <div className="mini-icon-wrap">
                  <Layers size={19} />
                </div>
                <span className="mini-item-label">Course File</span>
              </button>
            </nav>
          )}
        </aside>

        {/* 3. Main Fullscreen Content Panel */}
        <main className="erp-portal-main-panel">
          {/* Institutional Top Banner */}
          <section className="erp-institutional-banner">
            <div className="banner-primary-block">
              <div className="banner-badge-icon">
                <GraduationCap size={26} />
              </div>
              <div className="banner-details">
                <div className="banner-tagline">
                  <span>Faculty Academic Portal • 2026-27</span>
                  <span className="banner-tag-sep">•</span>
                  <span>Dept. of {deptCode}</span>
                </div>
                <h1 className="banner-title">{facultyName}</h1>
                <p className="banner-subtitle">
                  <strong>{designation}</strong> • Department of {deptName} • Faculty ID: <strong>{facultyId}</strong>
                </p>
              </div>
            </div>

            <div className="banner-meta-pills">
              <div className="meta-pill-item highlight">
                <ShieldCheck size={14} />
                <span>HOD Managed Curriculum</span>
              </div>
            </div>
          </section>

          {/* VIEW 1: MY ALLOCATED SUBJECTS */}
          {activeTab === 'subjects' && (
            <div className="erp-tab-content">
              {/* 4 Stats Cards */}
              <div className="erp-stats-grid">
                <div className="stat-card allocated-subjects">
                  <div className="stat-icon-box">
                    <BookOpen size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Allocated Subjects</span>
                    <strong className="stat-val">{assignedSubjects.length}</strong>
                    <span className="stat-sub">Teaching load assigned</span>
                  </div>
                </div>

                <div className="stat-card academic-year">
                  <div className="stat-icon-box">
                    <Calendar size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Academic Year</span>
                    <strong className="stat-val">2026-27</strong>
                    <span className="stat-sub">Current semester cycle</span>
                  </div>
                </div>

                <div className="stat-card active-dept">
                  <div className="stat-icon-box">
                    <Building2 size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Department</span>
                    <strong className="stat-val">{deptCode}</strong>
                    <span className="stat-sub">{deptName}</span>
                  </div>
                </div>

                <div className="stat-card portal-role">
                  <div className="stat-icon-box">
                    <Users size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Academic Role</span>
                    <strong className="stat-val">Subject Teacher</strong>
                    <span className="stat-sub">{designation}</span>
                  </div>
                </div>
              </div>

              {/* Main Subjects Table Card */}
              <div className="erp-card-container">
                <div className="erp-card-toolbar">
                  <div>
                    <h2 className="toolbar-heading">My Allocated Teaching Subjects</h2>
                    <p className="toolbar-subheading">Course subjects mapped to you by Head of Department for Semester 3 &amp; 4</p>
                  </div>
                  <span className="badge-academic-year">Semester 3 &amp; 4 (ODD / EVEN)</span>
                </div>

                {loading ? (
                  <div className="table-loading-notice">
                    <p>Loading allocated subjects from department database...</p>
                  </div>
                ) : assignedSubjects.length === 0 ? (
                  <div className="table-empty-notice p-40">
                    <BookOpen size={48} className="empty-icon-art" />
                    <h3>No Subjects Allocated Yet</h3>
                    <p>
                      The Head of Department has not assigned any subjects to <strong>{facultyId}</strong> yet for this semester.
                      Once allocated in the HOD Portal, your subjects will appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="erp-table-responsive">
                    <table className="erp-data-table">
                      <thead>
                        <tr>
                          <th style={{ width: '55px' }}>#</th>
                          <th style={{ width: '130px' }}>Subject Code</th>
                          <th>Course Title &amp; Category</th>
                          <th style={{ width: '110px' }}>Semester</th>
                          <th style={{ width: '110px' }}>Section</th>
                          <th style={{ width: '100px' }}>Credits</th>
                          <th style={{ width: '230px' }}>Academic Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.isArray(assignedSubjects) &&
                          assignedSubjects.map((sub, idx) => (
                            <tr key={`${sub.subject_code}-${sub.section}`}>
                              <td className="cell-idx">{idx + 1}</td>
                              <td className="cell-code">
                                <span className="erp-code-pill">{sub.subject_code}</span>
                              </td>
                              <td className="cell-name">
                                <span className="subject-title-strong">{sub.subject_name}</span>
                                <span className="subject-kind-tag">
                                  {sub.is_lab ? 'Laboratory / Practical Course' : 'Theory Core Course'}
                                </span>
                              </td>
                              <td className="cell-sem">
                                <span className="erp-sem-pill">Sem {sub.semester}</span>
                              </td>
                              <td className="cell-sec">
                                <span className="erp-sec-pill">{sub.section || 'Section A'}</span>
                              </td>
                              <td className="cell-credits">
                                <span className="erp-credit-badge">{sub.credits} Credits</span>
                              </td>
                              <td className="cell-actions">
                                <div className="faculty-action-btns">
                                  <button
                                    type="button"
                                    className="btn-action attendance"
                                    onClick={() => {
                                      setSelectedSubject(sub);
                                      setActiveTab('attendance');
                                    }}
                                  >
                                    Attendance
                                  </button>
                                  <button
                                    type="button"
                                    className="btn-action marks"
                                    onClick={() => {
                                      setSelectedSubject(sub);
                                      setActiveTab('marks');
                                    }}
                                  >
                                    IA Marks
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Footer sync note */}
                <div className="erp-card-footer">
                  <div className="footer-info-strip">
                    <ShieldCheck size={16} />
                    <span>
                      Subject allocations are synchronized with Department of {deptName}. If an allocation is missing, please contact HOD.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: SUBJECT ATTENDANCE */}
          {activeTab === 'attendance' && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <div className="roster-top-bar">
                  <div>
                    <h2 className="content-heading">Subject Attendance Register</h2>
                    <p className="content-subheading">
                      Record student session attendance for {selectedSubject ? `${selectedSubject.subject_code} - ${selectedSubject.subject_name}` : 'allocated subjects'}
                    </p>
                  </div>
                  {assignedSubjects.length > 0 && (
                    <select
                      className="erp-select-input"
                      value={selectedSubject?.subject_code || ''}
                      onChange={(e) => {
                        const found = assignedSubjects.find((s) => s.subject_code === e.target.value);
                        if (found) setSelectedSubject(found);
                      }}
                    >
                      {assignedSubjects.map((s) => (
                        <option key={s.subject_code} value={s.subject_code}>
                          {s.subject_code} - {s.subject_name} ({s.section})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="placeholder-module-box mt-16">
                  <CheckCircle2 size={36} className="module-icon" />
                  <h3>Attendance Marking Workspace</h3>
                  <p>
                    Daily attendance ledger for <strong>{selectedSubject?.subject_code || 'Selected Subject'}</strong> ({selectedSubject?.section || 'Section A'}) will open here.
                    Subject teachers can mark Present / Absent and track student percentage shortages according to VTU regulations.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: IA MARKS ENTRY */}
          {activeTab === 'marks' && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <div className="roster-top-bar">
                  <div>
                    <h2 className="content-heading">Internal Assessment (IA) Marks Entry</h2>
                    <p className="content-subheading">
                      CIE Test 1, Test 2, Test 3 &amp; Assignment grading for {selectedSubject ? `${selectedSubject.subject_code}` : 'allocated subjects'}
                    </p>
                  </div>
                  {assignedSubjects.length > 0 && (
                    <select
                      className="erp-select-input"
                      value={selectedSubject?.subject_code || ''}
                      onChange={(e) => {
                        const found = assignedSubjects.find((s) => s.subject_code === e.target.value);
                        if (found) setSelectedSubject(found);
                      }}
                    >
                      {assignedSubjects.map((s) => (
                        <option key={s.subject_code} value={s.subject_code}>
                          {s.subject_code} - {s.subject_name} ({s.section})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="placeholder-module-box mt-16">
                  <BarChart3 size={36} className="module-icon" />
                  <h3>Continuous Internal Evaluation (CIE) Marks Register</h3>
                  <p>
                    Enter IA-1, IA-2, IA-3 test marks, quizzes, and assignments out of 50. The system automatically computes
                    VTU scaled averages.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: STUDENT INFO SHEET */}
          {activeTab === 'students' && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <h2 className="content-heading">Enrolled Students in Allocated Subject</h2>
                <p className="content-subheading">
                  Student directory for {selectedSubject ? `${selectedSubject.subject_code} (${selectedSubject.section})` : 'your courses'}
                </p>

                <div className="placeholder-module-box mt-16">
                  <FileSpreadsheet size={36} className="module-icon" />
                  <h3>Student Roster &amp; Profiles</h3>
                  <p>
                    View student USNs, official names, attendance thresholds, and parent contact details for emergency communication.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: COURSE FILE & SYLLABUS */}
          {activeTab === 'coursefile' && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <h2 className="content-heading">Course File &amp; Syllabus</h2>
                <p className="content-subheading">Course Outcomes (COs), Bloom's Taxonomy levels, and lesson planning</p>

                <div className="placeholder-module-box mt-16">
                  <Layers size={36} className="module-icon" />
                  <h3>Course File Documentation</h3>
                  <p>
                    Upload lesson plans, syllabus coverage status, question banks, and Bloom's taxonomy mapped course outcomes.
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* 4. Global Institutional Footer */}
      <Footer />
    </div>
  );
}
