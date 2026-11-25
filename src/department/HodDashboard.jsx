import React, { useState, useEffect } from 'react';
import './HodDashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import {
  getDepartmentOverviewApi,
  getFacultiesApi,
  getSubjectsApi,
  getAllocationsApi,
  saveAllocationsApi
} from '../services/apiService';
import {
  BookOpen,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Save,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  ChevronRight,
  Calendar,
  MessageSquare,
  ClipboardCheck
} from 'lucide-react';

export default function HodDashboard({ onLogout = () => {}, currentUser = null }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Sidebar toggle state (Expanded on desktop, collapsed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState('faculties');

  // Department state
  const deptCode = currentUser?.deptCode || 'EC';
  const [deptName, setDeptName] = useState(currentUser?.deptName || 'Electronics & Communication Engineering');
  const [selectedSemester, setSelectedSemester] = useState(3);
  const [selectedSection, setSelectedSection] = useState('Section A');

  // Data
  const [faculties, setFaculties] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allocations, setAllocations] = useState({}); // { subject_code: faculty_id }
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error', text: '' }

  // Institutional Live Clock
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

  // Fetch initial faculties and overview
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [facList, overview] = await Promise.all([
          getFacultiesApi(deptCode),
          getDepartmentOverviewApi(deptCode)
        ]);
        setFaculties(facList);
        if (overview?.department?.dept_name) {
          setDeptName(overview.department.dept_name);
        }
      } catch (err) {
        console.error('Failed to load initial HOD data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [deptCode]);

  // Fetch subjects & allocations when semester changes
  useEffect(() => {
    async function loadSemesterData() {
      try {
        const [subList, allocList] = await Promise.all([
          getSubjectsApi(deptCode, selectedSemester),
          getAllocationsApi(deptCode, selectedSemester, selectedSection)
        ]);

        setSubjects(subList);

        // Map existing allocations into dictionary: { [subject_code]: faculty_id }
        const map = {};
        if (Array.isArray(allocList)) {
          allocList.forEach((item) => {
            map[item.subject_code] = item.faculty_id;
          });
        }
        setAllocations(map);
      } catch (err) {
        console.error('Failed to load semester subjects/allocations:', err);
      }
    }
    loadSemesterData();
  }, [deptCode, selectedSemester, selectedSection]);

  // Handle dropdown change for a subject's assigned teacher
  const handleFacultyChange = (subjectCode, facultyId) => {
    setAllocations((prev) => ({
      ...prev,
      [subjectCode]: facultyId || ''
    }));
    setSaveStatus(null);
  };

  // Save allocations to backend MySQL
  const handleSaveAllocations = async () => {
    try {
      setSaving(true);
      setSaveStatus(null);

      const allocationItems = subjects
        .filter((sub) => allocations[sub.subject_code])
        .map((sub) => ({
          subject_code: sub.subject_code,
          faculty_id: allocations[sub.subject_code],
          section: selectedSection,
          academic_year: '2026-27'
        }));

      await saveAllocationsApi({
        deptCode: deptCode,
        dept_code: deptCode,
        semester: selectedSemester,
        section: selectedSection,
        allocations: allocationItems,
        assignments: allocationItems
      });

      setSaveStatus({
        type: 'success',
        text: `Allocations for Semester ${selectedSemester} (${selectedSection}) committed to database successfully!`
      });

      // Clear success notification after 4 seconds
      setTimeout(() => setSaveStatus(null), 4000);
    } catch (err) {
      console.error('Failed to save allocations:', err);
      setSaveStatus({
        type: 'error',
        text: err.message || 'Failed to save subject allocations.'
      });
    } finally {
      setSaving(false);
    }
  };

  // Stats calculation
  const totalSubjects = subjects.length;
  const allocatedCount = subjects.filter((s) => allocations[s.subject_code]).length;
  const pendingCount = totalSubjects - allocatedCount;
  const sidebarItems = [
    {
      id: 'faculties',
      label: 'Faculties List',
      miniLabel: 'Faculties',
      subtitle: `${faculties.length} teaching staff`,
      icon: Users
    },
    {
      id: 'allocation',
      label: 'Subject Allotment',
      miniLabel: 'Allotment',
      subtitle: 'Assign faculty to subjects',
      icon: BookOpen
    },
    {
      id: 'attendance',
      label: 'Attendance',
      miniLabel: 'Attendance',
      subtitle: 'Department attendance',
      icon: Calendar
    },
    {
      id: 'activities',
      label: 'Other Activities',
      miniLabel: 'Activities',
      subtitle: 'Department activities',
      icon: Sparkles
    },
    {
      id: 'message',
      label: 'Message',
      miniLabel: 'Message',
      subtitle: 'Department communication',
      icon: MessageSquare
    },
    {
      id: 'approvals',
      label: 'Approvals',
      miniLabel: 'Approvals',
      subtitle: 'Items requiring approval',
      icon: ClipboardCheck
    }
  ];
  const placeholderTabs = {
    attendance: 'Attendance',
    activities: 'Other Activities',
    message: 'Message',
    approvals: 'Approvals'
  };

  const hodName = currentUser?.name || 'Dr. Ravindra K';
  const hodDesignation = currentUser?.designation || 'Professor & Head of Department';
  const hodInitials = hodName
    .replace('Dr.', '')
    .replace('Prof.', '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'RK';

  return (
    <div className="erp-portal-container">
      {/* 1. Global Institutional Header with Hamburger Toggle */}
      <Header
        onLogout={onLogout}
        currentUser={currentUser}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        displayName={hodName}
        displaySubtitle={`${hodDesignation} • Dept. of ${deptCode}`}
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
              {/* Mini HOD Badge Card */}
              <div className="sidebar-profile-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-initials-badge">{hodInitials}</div>
                </div>
                <div className="sidebar-profile-meta">
                  <h3 className="sidebar-profile-name">{hodName}</h3>
                  <span className="sidebar-profile-id">{currentUser?.username || 'HOD_EC'}</span>
                  <span className="sidebar-profile-dept">Dept. of {deptName}</span>
                  <span className="sidebar-role-pill">Head of Department</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav-menu">
                <div className="sidebar-menu-heading">Department Portal</div>
                {sidebarItems.map(({ id, label, subtitle, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    className={`sidebar-nav-item ${activeTab === id ? 'active' : ''}`}
                    onClick={() => setActiveTab(id)}
                  >
                    <div className="nav-item-icon-box">
                      <Icon size={18} />
                    </div>
                    <div className="nav-item-text">
                      <span className="nav-title">{label}</span>
                      <span className="nav-subtitle">{subtitle}</span>
                    </div>
                    <ChevronRight size={16} className="nav-item-arrow" />
                  </button>
                ))}
              </nav>

              {/* Sidebar Footer Note */}
              <div className="sidebar-institutional-note">
                <ShieldCheck size={14} />
                <span>AJIET HOD Academic Command</span>
              </div>
            </>
          ) : (
            /* Collapsed Mini Sidebar */
            <nav className="sidebar-mini-menu">
              {sidebarItems.map(({ id, label, miniLabel, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  className={`sidebar-mini-item ${activeTab === id ? 'active' : ''}`}
                  onClick={() => setActiveTab(id)}
                  title={label}
                >
                  <div className="mini-icon-wrap">
                    <Icon size={19} />
                  </div>
                  <span className="mini-item-label">{miniLabel}</span>
                </button>
              ))}
            </nav>
          )}
        </aside>

        {/* 3. Main Fullscreen Content Panel */}
        <main className="erp-portal-main-panel">
          {/* Institutional Top Banner */}
          <section className="erp-institutional-banner">
            <div className="banner-primary-block">
              <div className="banner-badge-icon">
                <Building2 size={26} />
              </div>
              <div className="banner-details">
                <div className="banner-tagline">
                  <span>Department Academic Governance</span>
                  <span className="banner-tag-sep">•</span>
                  <span>VTU Belagavi Affiliated</span>
                </div>
                <h1 className="banner-title">
                  Department of {deptName} ({deptCode})
                </h1>
                <p className="banner-subtitle">
                  Academic Head: <strong>{hodName}</strong> ({hodDesignation}) • Academic Year: <strong>2026-27</strong>
                </p>
              </div>
            </div>

            <div className="banner-meta-pills">
              <div className="meta-pill-item">
                <ShieldCheck size={14} />
                <span>Official HOD Console</span>
              </div>
              <div className="meta-pill-item highlight">
                <CheckCircle2 size={14} />
                <span>Active Semester Session</span>
              </div>
            </div>
          </section>

          {/* VIEW 1: SUBJECT ALLOCATION TAB */}
          {activeTab === 'allocation' && (
            <div className="erp-tab-content">
              {/* 4 Metric Stats */}
              <div className="erp-stats-grid">
                <div className="stat-card total-subjects">
                  <div className="stat-icon-box">
                    <BookOpen size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Semester Subjects</span>
                    <strong className="stat-val">{totalSubjects}</strong>
                    <span className="stat-sub">Semester {selectedSemester} curriculum</span>
                  </div>
                </div>

                <div className="stat-card assigned-subjects">
                  <div className="stat-icon-box">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Assigned Subjects</span>
                    <strong className="stat-val">{allocatedCount}</strong>
                    <span className="stat-sub">Allocated to teachers</span>
                  </div>
                </div>

                <div className="stat-card pending-subjects">
                  <div className="stat-icon-box">
                    <Clock size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Pending Allocation</span>
                    <strong className="stat-val">{pendingCount}</strong>
                    <span className="stat-sub">Unmapped courses</span>
                  </div>
                </div>

                <div className="stat-card active-faculty">
                  <div className="stat-icon-box">
                    <Users size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Available Faculty</span>
                    <strong className="stat-val">{faculties.length}</strong>
                    <span className="stat-sub">Registered department staff</span>
                  </div>
                </div>
              </div>

              {/* Main Subject Allocation Card */}
              <div className="erp-card-container">
                {/* Header Controls Bar */}
                <div className="erp-card-toolbar">
                  <div className="toolbar-left">
                    <div className="sem-tabs-segmented">
                      <span className="segmented-label">Select Semester:</span>
                      <button
                        type="button"
                        className={`segmented-tab ${selectedSemester === 3 ? 'active' : ''}`}
                        onClick={() => setSelectedSemester(3)}
                      >
                        Semester 3 (3rd Sem)
                      </button>
                      <button
                        type="button"
                        className={`segmented-tab ${selectedSemester === 4 ? 'active' : ''}`}
                        onClick={() => setSelectedSemester(4)}
                      >
                        Semester 4 (4th Sem)
                      </button>
                    </div>

                    <div className="section-dropdown-group">
                      <label htmlFor="section-picker" className="dropdown-label">Section:</label>
                      <select
                        id="section-picker"
                        className="erp-select-input"
                        value={selectedSection}
                        onChange={(e) => setSelectedSection(e.target.value)}
                      >
                        <option value="Section A">Section A</option>
                        <option value="Section B">Section B</option>
                      </select>
                    </div>
                  </div>

                  <div className="toolbar-right">
                    <span className="badge-academic-year">Academic Year: 2026-27</span>
                  </div>
                </div>

                {/* Status Feedback Banner */}
                {saveStatus && (
                  <div className={`erp-toast-banner ${saveStatus.type}`}>
                    {saveStatus.type === 'success' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                    <span>{saveStatus.text}</span>
                  </div>
                )}

                {/* Subject Allocation Table */}
                <div className="erp-table-responsive">
                  <table className="erp-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '55px' }}>#</th>
                        <th style={{ width: '130px' }}>Subject Code</th>
                        <th>Course Title &amp; Category</th>
                        <th style={{ width: '110px' }}>Credits</th>
                        <th style={{ width: '380px' }}>Allocated Subject Teacher</th>
                        <th style={{ width: '140px' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subjects.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="table-empty-notice">
                            No subjects registered for Semester {selectedSemester}.
                          </td>
                        </tr>
                      ) : (
                        subjects.map((sub, idx) => {
                          const currentAssigned = allocations[sub.subject_code] || '';
                          const isAssigned = Boolean(currentAssigned);

                          return (
                            <tr key={sub.subject_code} className={isAssigned ? 'row-completed' : 'row-pending'}>
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
                              <td className="cell-credits">
                                <span className="erp-credit-badge">{sub.credits} Credits</span>
                              </td>
                              <td className="cell-select">
                                <select
                                  className={`faculty-picker-select ${isAssigned ? 'state-assigned' : 'state-unassigned'}`}
                                  value={currentAssigned}
                                  onChange={(e) => handleFacultyChange(sub.subject_code, e.target.value)}
                                >
                                  <option value="">-- Choose Faculty Member --</option>
                                  {faculties.map((f) => (
                                    <option key={f.faculty_id} value={f.faculty_id}>
                                      {f.faculty_id} - {f.name} ({f.designation})
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="cell-status">
                                {isAssigned ? (
                                  <span className="status-pill assigned">
                                    <CheckCircle2 size={13} /> Assigned
                                  </span>
                                ) : (
                                  <span className="status-pill pending">
                                    <Clock size={13} /> Pending
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Card Action Footer */}
                <div className="erp-card-footer">
                  <div className="footer-info-strip">
                    <ShieldCheck size={16} />
                    <span>
                      Allocations are committed directly to MySQL and immediately synchronize with the faculty's teaching dashboard.
                    </span>
                  </div>

                  <button
                    type="button"
                    className="btn-erp-primary"
                    onClick={handleSaveAllocations}
                    disabled={saving || subjects.length === 0}
                  >
                    {saving ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Committing Allocation...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Semester {selectedSemester} Allocation</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DEPARTMENT FACULTY ROSTER */}
          {activeTab === 'faculties' && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <div className="roster-top-bar">
                  <div>
                    <h2 className="content-heading">Department Faculty Members</h2>
                    <p className="content-subheading">
                      Teaching roster for Department of {deptName} ({faculties.length} Registered Staff)
                    </p>
                  </div>
                  <div className="badge-academic-year">Total Teaching Staff: {faculties.length}</div>
                </div>

                <div className="faculty-cards-grid">
                  {faculties.map((fac) => (
                    <div key={fac.faculty_id} className="faculty-profile-card">
                      <div className="fcard-header">
                        <div className="fcard-avatar">
                          {fac.name
                            .replace('Dr.', '')
                            .replace('Prof.', '')
                            .trim()
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="fcard-main">
                          <h4 className="fcard-name">{fac.name}</h4>
                          <span className="fcard-id-pill">{fac.faculty_id}</span>
                        </div>
                      </div>

                      <div className="fcard-body">
                        <div className="fcard-row">
                          <span className="row-k">Designation</span>
                          <strong className="row-v">{fac.designation}</strong>
                        </div>
                        <div className="fcard-row">
                          <span className="row-k">Department</span>
                          <strong className="row-v">{fac.dept_code}</strong>
                        </div>
                        <div className="fcard-row">
                          <span className="row-k">Official Email</span>
                          <span className="row-v email">{fac.email}</span>
                        </div>
                        <div className="fcard-row">
                          <span className="row-k">Institutional Role</span>
                          <span className="row-v role-tag">{fac.is_hod ? 'Head of Department' : 'Subject Teacher'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {placeholderTabs[activeTab] && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <h2 className="content-heading">
                  {placeholderTabs[activeTab]}
                </h2>
                <p className="content-subheading">
                  This section is not set up yet.
                </p>
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
