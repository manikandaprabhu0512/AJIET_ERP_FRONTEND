import React, { useState, useEffect } from "react";
import "./HodDashboard.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import {
  getDepartmentOverviewApi,
  getFacultiesApi,
  getCurriculumSchemesApi,
  getCurriculumSubjectsApi,
  createCurriculumSubjectApi,
  getSubjectAllotmentsApi,
  createSubjectAllotmentApi,
} from "../services/apiService";
import {
  BookOpen,
  Users,
  Building2,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Plus,
  ChevronRight,
  Calendar,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

const subjectCategories = [
  "PCC",
  "IPCC",
  "LAB",
  "Ability Enhancement",
  "Non-Credit",
];
const semesterOptions = Array.from({ length: 8 }, (_, index) => index + 1);

const getAcademicYearOptions = () => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 6 }, (_, index) => {
    const startYear = currentYear - 5 + index;
    return `${startYear}-${String((startYear + 1) % 100).padStart(2, "0")}`;
  });
};

const isValidAcademicYear = (value) => {
  const match = /^(\d{4})-(\d{2})$/.exec(value);
  return Boolean(
    match && Number(match[2]) === (Number(match[1]) + 1) % 100,
  );
};

export default function HodDashboard({
  onLogout = () => {},
  currentUser = null,
}) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Sidebar toggle state (Expanded on desktop, collapsed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );

  // Active navigation tab
  const [activeTab, setActiveTab] = useState("faculties");

  // Department state
  const deptCode = (currentUser?.deptCode || "EC").trim().toUpperCase();
  const [deptName, setDeptName] = useState(
    currentUser?.deptName || "Electronics & Communication Engineering",
  );
  const [academicYearOptions] = useState(getAcademicYearOptions);
  const [academicYear, setAcademicYear] = useState(
    () => academicYearOptions[academicYearOptions.length - 1],
  );

  // Data
  const [faculties, setFaculties] = useState([]);
  const [curriculumSchemes, setCurriculumSchemes] = useState([]);
  const [viewSchemeYear, setViewSchemeYear] = useState("");
  const [viewSemester, setViewSemester] = useState("1");
  const [viewSubjects, setViewSubjects] = useState([]);
  const [allotmentSchemeYear, setAllotmentSchemeYear] = useState("");
  const [allotmentSemester, setAllotmentSemester] = useState("1");
  const [allotmentSection, setAllotmentSection] = useState("Section A");
  const [allotmentSubjects, setAllotmentSubjects] = useState([]);
  const [subjectAllotments, setSubjectAllotments] = useState([]);
  const [selectedFacultyId, setSelectedFacultyId] = useState("");
  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");
  const [isAddingSchema, setIsAddingSchema] = useState(false);
  const [newSchemeYear, setNewSchemeYear] = useState("");
  const [newSchemeSemester, setNewSchemeSemester] = useState("1");
  const [subjectNumber, setSubjectNumber] = useState("1");
  const [subjectName, setSubjectName] = useState("");
  const [subjectCategory, setSubjectCategory] = useState("PCC");
  const [subjectTeachingHours, setSubjectTeachingHours] = useState("");
  const [subjectCredits, setSubjectCredits] = useState("");
  const [loading, setLoading] = useState(true);
  const [allotmentsLoading, setAllotmentsLoading] = useState(false);
  const [viewSubjectsLoading, setViewSubjectsLoading] = useState(false);
  const [allotmentSubjectsLoading, setAllotmentSubjectsLoading] =
    useState(false);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // { type: 'success'|'error', text: '' }
  const [curriculumSaving, setCurriculumSaving] = useState(false);
  const [curriculumStatus, setCurriculumStatus] = useState(null);

  // Institutional Live Clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDate(`${day}-${month}-${year}`);

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const formattedHours = String(hours).padStart(2, "0");
      setCurrentTime(`${formattedHours}:${minutes}:${seconds} ${ampm}`);
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch department faculties, overview, and registered curriculum schemes
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [facList, overview, schemes] = await Promise.all([
          getFacultiesApi(deptCode),
          getDepartmentOverviewApi(deptCode),
          getCurriculumSchemesApi(deptCode),
        ]);
        setFaculties(facList);
        setCurriculumSchemes(schemes);
        setViewSchemeYear(schemes[0] || "");
        setAllotmentSchemeYear(schemes[0] || "");
        if (overview?.department?.dept_name) {
          setDeptName(overview.department.dept_name);
        }
      } catch (err) {
        console.error("Failed to load initial HOD data:", err);
        setSaveStatus({
          type: "error",
          text: err.message || "Failed to load department data.",
        });
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, [deptCode]);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadViewSubjects() {
      if (!viewSchemeYear) {
        setViewSubjects([]);
        setViewSubjectsLoading(false);
        return;
      }

      try {
        setViewSubjectsLoading(true);
        const rows = await getCurriculumSubjectsApi(
          deptCode,
          viewSchemeYear,
          viewSemester,
        );
        if (isCurrentRequest) setViewSubjects(rows);
      } catch (err) {
        console.error("Failed to load scheme subjects:", err);
        if (isCurrentRequest) {
          setViewSubjects([]);
          setCurriculumStatus({
            type: "error",
            text: err.message || "Failed to load scheme subjects.",
          });
        }
      } finally {
        if (isCurrentRequest) setViewSubjectsLoading(false);
      }
    }

    loadViewSubjects();
    return () => {
      isCurrentRequest = false;
    };
  }, [deptCode, viewSchemeYear, viewSemester]);

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadAllotmentSubjects() {
      if (!allotmentSchemeYear) {
        setAllotmentSubjects([]);
        setAllotmentSubjectsLoading(false);
        setSelectedSubjectCode("");
        return;
      }

      try {
        setAllotmentSubjectsLoading(true);
        const rows = await getCurriculumSubjectsApi(
          deptCode,
          allotmentSchemeYear,
          allotmentSemester,
        );
        if (isCurrentRequest) setAllotmentSubjects(rows);
      } catch (err) {
        console.error("Failed to load allotment subjects:", err);
        if (isCurrentRequest) {
          setAllotmentSubjects([]);
          setSaveStatus({
            type: "error",
            text: err.message || "Failed to load subjects for allotment.",
          });
        }
      } finally {
        if (isCurrentRequest) setAllotmentSubjectsLoading(false);
      }
    }

    loadAllotmentSubjects();
    return () => {
      isCurrentRequest = false;
    };
  }, [deptCode, allotmentSchemeYear, allotmentSemester]);

  // Load all subject allotments for the selected academic year.
  useEffect(() => {
    let isCurrentRequest = true;

    async function loadYearAllotments() {
      if (!isValidAcademicYear(academicYear)) {
        setSubjectAllotments([]);
        setAllotmentsLoading(false);
        return;
      }

      try {
        setAllotmentsLoading(true);
        const rows = await getSubjectAllotmentsApi(deptCode, academicYear);
        if (isCurrentRequest) setSubjectAllotments(rows);
      } catch (err) {
        console.error("Failed to load subject allotments:", err);
        if (isCurrentRequest) {
          setSubjectAllotments([]);
          setSaveStatus({
            type: "error",
            text: err.message || "Failed to load subject allotments.",
          });
        }
      } finally {
        if (isCurrentRequest) setAllotmentsLoading(false);
      }
    }
    loadYearAllotments();
    return () => {
      isCurrentRequest = false;
    };
  }, [deptCode, academicYear]);

  const handleAddAllotment = async (event) => {
    event.preventDefault();

    if (!isValidAcademicYear(academicYear)) {
      setSaveStatus({
        type: "error",
        text: "Enter an academic year in YYYY-YY format.",
      });
      return;
    }
    if (
      !selectedFacultyId ||
      !selectedSubjectCode ||
      !allotmentSchemeYear ||
      !allotmentSection.trim()
    ) {
      setSaveStatus({
        type: "error",
        text: "Select a faculty member, scheme, semester and subject, and enter a section.",
      });
      return;
    }

    try {
      setSaving(true);
      setSaveStatus(null);
      await createSubjectAllotmentApi({
        deptCode,
        academicYear,
        facultyId: selectedFacultyId,
        schemeYear: allotmentSchemeYear,
        semester: Number(allotmentSemester),
        section: allotmentSection.trim(),
        curriculumSubjectId: Number(selectedSubjectCode),
        allocatedBy: currentUser?.username || `HOD_${deptCode}`,
      });
      setSelectedSubjectCode("");
      try {
        const rows = await getSubjectAllotmentsApi(deptCode, academicYear);
        setSubjectAllotments(rows);
        setSaveStatus({
          type: "success",
          text: "Subject allotment saved successfully.",
        });
      } catch (refreshError) {
        console.error("Subject allotment saved but refresh failed:", refreshError);
        setSaveStatus({
          type: "error",
          text: `Allotment saved, but the list could not refresh: ${refreshError.message}`,
        });
      }
    } catch (err) {
      console.error("Failed to add subject allotment:", err);
      setSaveStatus({
        type: "error",
        text: err.message || "Failed to add subject allotment.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleAddCurriculumSubject = async (event) => {
    event.preventDefault();
    const hours = Number(subjectTeachingHours);
    const credits = Number(subjectCredits);

    if (!/^\d{2}$/.test(newSchemeYear)) {
      setCurriculumStatus({
        type: "error",
        text: "Enter the two-digit scheme year, for example 21, 25, or 27.",
      });
      return;
    }
    if (!subjectName.trim()) {
      setCurriculumStatus({
        type: "error",
        text: "Enter a subject name.",
      });
      return;
    }
    if (!Number.isInteger(hours) || hours < 1) {
      setCurriculumStatus({
        type: "error",
        text: "Teaching hours must be a positive whole number.",
      });
      return;
    }
    if (!Number.isInteger(credits) || credits < 0) {
      setCurriculumStatus({
        type: "error",
        text: "Credits must be a non-negative whole number.",
      });
      return;
    }

    try {
      setCurriculumSaving(true);
      setCurriculumStatus(null);
      const { subject } = await createCurriculumSubjectApi({
        deptCode,
        schemeYear: newSchemeYear,
        semester: Number(newSchemeSemester),
        subjectNumber: Number(subjectNumber),
        subjectName: subjectName.trim(),
        subjectCategory,
        teachingHours: hours,
        credits,
      });
      setCurriculumSchemes((current) =>
        current.includes(newSchemeYear)
          ? current
          : [...current, newSchemeYear].sort((a, b) => b.localeCompare(a)),
      );
      setViewSchemeYear(newSchemeYear);
      setViewSemester(newSchemeSemester);
      setAllotmentSchemeYear(newSchemeYear);
      setAllotmentSemester(newSchemeSemester);
      setViewSubjects((current) =>
        current.some((item) => item.id === subject.id)
          ? current
          : [...current, subject].sort(
              (a, b) => a.subject_number - b.subject_number,
            ),
      );
      setAllotmentSubjects((current) =>
        current.some((item) => item.id === subject.id)
          ? current
          : [...current, subject].sort(
              (a, b) => a.subject_number - b.subject_number,
            ),
      );
      setSubjectName("");
      setSubjectTeachingHours("");
      setSubjectCredits("");
      setSubjectNumber((current) =>
        Number(current) < 9 ? String(Number(current) + 1) : current,
      );
      setCurriculumStatus({
        type: "success",
        text: `${subject.subject_code} added to Scheme ${subject.scheme_year}, Semester ${subject.semester}.`,
      });
    } catch (err) {
      console.error("Failed to add curriculum subject:", err);
      setCurriculumStatus({
        type: "error",
        text: err.message || "Failed to add curriculum subject.",
      });
    } finally {
      setCurriculumSaving(false);
    }
  };

  const selectedFaculty = faculties.find(
    (faculty) => faculty.faculty_id === selectedFacultyId,
  );
  const selectedSubject = allotmentSubjects.find(
    (subject) => String(subject.id) === selectedSubjectCode,
  );
  const assignedSubjectCount = new Set(
    subjectAllotments.map((allotment) => allotment.subject_code),
  ).size;
  const sidebarItems = [
    {
      id: "faculties",
      label: "Faculties List",
      miniLabel: "Faculties",
      subtitle: `${faculties.length} teaching staff`,
      icon: Users,
    },
    {
      id: "curriculum",
      label: "Subjects / Schemes",
      miniLabel: "Subjects",
      subtitle: "Manage curriculum subjects",
      icon: BookOpen,
    },
    {
      id: "allocation",
      label: "Subject Allotment",
      miniLabel: "Allotment",
      subtitle: "Assign faculty to subjects",
      icon: BookOpen,
    },
    {
      id: "attendance",
      label: "Attendance",
      miniLabel: "Attendance",
      subtitle: "Department attendance",
      icon: Calendar,
    },
    {
      id: "activities",
      label: "Other Activities",
      miniLabel: "Activities",
      subtitle: "Department activities",
      icon: Sparkles,
    },
    {
      id: "message",
      label: "Message",
      miniLabel: "Message",
      subtitle: "Department communication",
      icon: MessageSquare,
    },
    {
      id: "approvals",
      label: "Approvals",
      miniLabel: "Approvals",
      subtitle: "Items requiring approval",
      icon: ClipboardCheck,
    },
  ];
  const placeholderTabs = {
    attendance: "Attendance",
    activities: "Other Activities",
    message: "Message",
    approvals: "Approvals",
  };

  const hodName = currentUser?.name || "Dr. Ravindra K";
  const hodDesignation =
    currentUser?.designation || "Professor & Head of Department";
  const hodInitials =
    hodName
      .replace("Dr.", "")
      .replace("Prof.", "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "RK";

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
      <div
        className={`erp-portal-workspace ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Docked YouTube-Style Sidebar */}
        <aside
          className={`erp-portal-sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-mini"}`}
        >
          {isSidebarOpen ? (
            <>
              {/* Mini HOD Badge Card */}
              <div className="sidebar-profile-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-initials-badge">{hodInitials}</div>
                </div>
                <div className="sidebar-profile-meta">
                  <h3 className="sidebar-profile-name">{hodName}</h3>
                  <span className="sidebar-profile-id">
                    {currentUser?.username || "HOD_EC"}
                  </span>
                  <span className="sidebar-profile-dept">
                    Dept. of {deptName}
                  </span>
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
                    className={`sidebar-nav-item ${activeTab === id ? "active" : ""}`}
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
                  className={`sidebar-mini-item ${activeTab === id ? "active" : ""}`}
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
                  Academic Head: <strong>{hodName}</strong> ({hodDesignation}) •
                  Academic Year: <strong>{academicYear}</strong>
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

          {activeTab === "curriculum" && (
            <div className="erp-tab-content">
              <div className="allocation-page-header curriculum-page-header">
                <div>
                  <h2 className="content-heading">Subjects / Schemes</h2>
                  <p className="content-subheading">
                    Maintain the department subject catalogue separately for
                    each curriculum scheme and semester.
                  </p>
                </div>
                {isAddingSchema ? (
                  <button
                    type="button"
                    className="btn-erp-secondary"
                    onClick={() => {
                      setIsAddingSchema(false);
                      setCurriculumStatus(null);
                    }}
                  >
                    View Subjects
                  </button>
                ) : (
                  <button
                    type="button"
                    className="btn-erp-primary"
                    onClick={() => {
                      setNewSchemeYear(viewSchemeYear);
                      setNewSchemeSemester(viewSemester);
                      setIsAddingSchema(true);
                      setCurriculumStatus(null);
                    }}
                  >
                    <Plus size={16} />
                    <span>Add New Schema</span>
                  </button>
                )}
              </div>

              {isAddingSchema && (
                <div className="erp-card-container curriculum-create-card">
                  <div className="erp-card-toolbar">
                    <div>
                      <h3 className="content-heading">
                        Add a Subject to a Scheme
                      </h3>
                      <p className="content-subheading">
                        Enter a scheme year, semester and subject details. The
                        course code is generated from the selected values.
                      </p>
                    </div>
                  </div>

                  {curriculumStatus && (
                    <div
                      className={`erp-toast-banner ${curriculumStatus.type}`}
                    >
                      {curriculumStatus.type === "success" ? (
                        <CheckCircle2 size={18} />
                      ) : (
                        <Clock size={18} />
                      )}
                      <span>{curriculumStatus.text}</span>
                    </div>
                  )}

                  <form
                    className="allotment-form"
                    onSubmit={handleAddCurriculumSubject}
                  >
                    <div className="allotment-form-grid">
                      <label className="allotment-form-field">
                        <span>Scheme Year</span>
                        <input
                          className="erp-select-input"
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          pattern="[0-9]{2}"
                          placeholder="e.g. 21"
                          value={newSchemeYear}
                          onChange={(event) => {
                            setNewSchemeYear(
                              event.target.value.replace(/\D/g, "").slice(0, 2),
                            );
                            setCurriculumStatus(null);
                          }}
                          required
                        />
                      </label>

                      <label className="allotment-form-field">
                        <span>Semester</span>
                        <select
                          className="erp-select-input"
                          value={newSchemeSemester}
                          onChange={(event) => {
                            setNewSchemeSemester(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          required
                        >
                          {semesterOptions.map((semester) => (
                            <option key={semester} value={semester}>
                              Semester {semester}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="allotment-form-field">
                        <span>Subject Number</span>
                        <select
                          className="erp-select-input"
                          value={subjectNumber}
                          onChange={(event) => {
                            setSubjectNumber(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          required
                        >
                          {Array.from({ length: 9 }, (_, index) => index + 1).map(
                            (number) => (
                              <option key={number} value={number}>
                                {number}
                              </option>
                            ),
                          )}
                        </select>
                      </label>

                      <div className="allotment-form-field">
                        <span>Generated Subject Code</span>
                        <div className="allotment-readonly-field">
                          {newSchemeYear.length === 2
                            ? `${newSchemeYear}${deptCode}${newSchemeSemester}${subjectNumber}`
                            : "Enter scheme year"}
                        </div>
                      </div>

                      <label className="allotment-form-field">
                        <span>Subject Name</span>
                        <input
                          className="erp-select-input"
                          type="text"
                          maxLength={200}
                          value={subjectName}
                          onChange={(event) => {
                            setSubjectName(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          placeholder="Enter subject name"
                          required
                        />
                      </label>

                      <label className="allotment-form-field">
                        <span>Subject Category</span>
                        <select
                          className="erp-select-input"
                          value={subjectCategory}
                          onChange={(event) => {
                            setSubjectCategory(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          required
                        >
                          {subjectCategories.map((category) => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="allotment-form-field">
                        <span>No. of Teaching Hours</span>
                        <input
                          className="erp-select-input"
                          type="number"
                          min="1"
                          step="1"
                          value={subjectTeachingHours}
                          onChange={(event) => {
                            setSubjectTeachingHours(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          placeholder="Enter teaching hours"
                          required
                        />
                      </label>

                      <label className="allotment-form-field">
                        <span>Credits</span>
                        <input
                          className="erp-select-input"
                          type="number"
                          min="0"
                          step="1"
                          value={subjectCredits}
                          onChange={(event) => {
                            setSubjectCredits(event.target.value);
                            setCurriculumStatus(null);
                          }}
                          placeholder="Enter credits"
                          required
                        />
                      </label>
                    </div>

                    <div className="allotment-form-actions">
                      <span className="footer-info-strip">
                        <ShieldCheck size={16} />
                        Subject codes follow Scheme + Department + Semester +
                        Subject Number.
                      </span>
                      <button
                        type="submit"
                        className="btn-erp-primary"
                        disabled={curriculumSaving}
                      >
                        {curriculumSaving ? (
                          <>
                            <RefreshCw size={16} className="animate-spin" />
                            <span>Adding Subject...</span>
                          </>
                        ) : (
                          <>
                            <Plus size={16} />
                            <span>Add Subject</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {!isAddingSchema && curriculumStatus && (
                <div className={`erp-toast-banner ${curriculumStatus.type}`}>
                  {curriculumStatus.type === "success" ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <Clock size={18} />
                  )}
                  <span>{curriculumStatus.text}</span>
                </div>
              )}

              <div className="erp-card-container curriculum-subjects-card">
                <div className="erp-card-toolbar">
                  <div className="curriculum-filter-controls">
                    <label className="allotment-form-field">
                      <span>Scheme Year</span>
                      <select
                        className="erp-select-input"
                        value={viewSchemeYear}
                        onChange={(event) =>
                          setViewSchemeYear(event.target.value)
                        }
                        disabled={curriculumSchemes.length === 0}
                      >
                        {curriculumSchemes.length === 0 ? (
                          <option value="">No schemes added</option>
                        ) : (
                          curriculumSchemes.map((scheme) => (
                            <option key={scheme} value={scheme}>
                              Scheme {scheme}
                            </option>
                          ))
                        )}
                      </select>
                    </label>

                    <label className="allotment-form-field">
                      <span>Semester</span>
                      <select
                        className="erp-select-input"
                        value={viewSemester}
                        onChange={(event) =>
                          setViewSemester(event.target.value)
                        }
                      >
                        {semesterOptions.map((semester) => (
                          <option key={semester} value={semester}>
                            Semester {semester}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div>
                    <h3 className="content-heading">
                      {viewSchemeYear
                        ? `Scheme ${viewSchemeYear} · Semester ${viewSemester}`
                        : "Scheme subjects"}
                    </h3>
                    <p className="content-subheading">
                      {viewSubjects.length} subject
                      {viewSubjects.length === 1 ? "" : "s"} in this semester
                    </p>
                  </div>
                </div>

                <div className="erp-table-responsive">
                  <table className="erp-data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Subject Code</th>
                        <th>Subject Name</th>
                        <th>Subject Category</th>
                        <th>Teaching Hours</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewSubjectsLoading ? (
                        <tr>
                          <td colSpan="6" className="table-empty-notice">
                            Loading scheme subjects...
                          </td>
                        </tr>
                      ) : viewSubjects.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="table-empty-notice">
                            {viewSchemeYear
                              ? "No subjects have been added for this scheme and semester."
                              : "Add a schema and its first subject to begin."}
                          </td>
                        </tr>
                      ) : (
                        viewSubjects.map((subject, index) => (
                          <tr key={subject.id}>
                            <td className="cell-idx">{index + 1}</td>
                            <td>
                              <span className="erp-code-pill">
                                {subject.subject_code}
                              </span>
                            </td>
                            <td>{subject.subject_name}</td>
                            <td>{subject.subject_category}</td>
                            <td>{subject.teaching_hours}</td>
                            <td>
                              <span className="erp-credit-badge">
                                {subject.credits} Credits
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 1: SUBJECT ALLOTMENT TAB */}
          {activeTab === "allocation" && (
            <div className="erp-tab-content">
              <div className="allocation-page-header">
                <div>
                  <h2 className="content-heading">Subject Allotment</h2>
                  <p className="content-subheading">
                    Create and review department subject allotments for the
                    selected academic year.
                  </p>
                </div>
                <label className="academic-year-field" htmlFor="academic-year">
                  <span>Academic Year</span>
                  <select
                    id="academic-year"
                    className="erp-select-input"
                    value={academicYear}
                    onChange={(event) => {
                      setAcademicYear(event.target.value);
                      setSaveStatus(null);
                    }}
                  >
                    {academicYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="erp-stats-grid">
                <div className="stat-card total-subjects">
                  <div className="stat-icon-box">
                    <BookOpen size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Semester Subjects</span>
                    <strong className="stat-val">
                      {allotmentSubjects.length}
                    </strong>
                    <span className="stat-sub">
                      Scheme {allotmentSchemeYear || "—"}, Semester{" "}
                      {allotmentSemester}
                    </span>
                  </div>
                </div>

                <div className="stat-card assigned-subjects">
                  <div className="stat-icon-box">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Allotment Records</span>
                    <strong className="stat-val">
                      {subjectAllotments.length}
                    </strong>
                    <span className="stat-sub">
                      For academic year {academicYear}
                    </span>
                  </div>
                </div>

                <div className="stat-card pending-subjects">
                  <div className="stat-icon-box">
                    <Clock size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Subjects Allotted</span>
                    <strong className="stat-val">{assignedSubjectCount}</strong>
                    <span className="stat-sub">
                      Unique subjects with faculty
                    </span>
                  </div>
                </div>

                <div className="stat-card active-faculty">
                  <div className="stat-icon-box">
                    <Users size={20} />
                  </div>
                  <div className="stat-meta">
                    <span className="stat-label">Available Faculty</span>
                    <strong className="stat-val">{faculties.length}</strong>
                    <span className="stat-sub">
                      Registered department staff
                    </span>
                  </div>
                </div>
              </div>

              <div className="erp-card-container allotment-create-card">
                <div className="erp-card-toolbar">
                  <div>
                    <h3 className="content-heading">Create an Allotment</h3>
                    <p className="content-subheading">
                      Select a curriculum subject and faculty for the academic
                      year and section.
                    </p>
                  </div>
                </div>

                {saveStatus && (
                  <div className={`erp-toast-banner ${saveStatus.type}`}>
                    {saveStatus.type === "success" ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Clock size={18} />
                    )}
                    <span>{saveStatus.text}</span>
                  </div>
                )}

                <form
                  className="allotment-form"
                  onSubmit={handleAddAllotment}
                >
                  <div className="allotment-form-grid">
                    <label className="allotment-form-field">
                      <span>Curriculum Scheme</span>
                      <select
                        className="erp-select-input"
                        value={allotmentSchemeYear}
                        onChange={(event) => {
                          setAllotmentSchemeYear(event.target.value);
                          setSelectedSubjectCode("");
                          setSaveStatus(null);
                        }}
                        required
                      >
                        <option value="">Select scheme</option>
                        {curriculumSchemes.map((scheme) => (
                          <option key={scheme} value={scheme}>
                            Scheme {scheme}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="allotment-form-field">
                      <span>Semester</span>
                      <select
                        className="erp-select-input"
                        value={allotmentSemester}
                        onChange={(event) => {
                          setAllotmentSemester(event.target.value);
                          setSelectedSubjectCode("");
                          setSaveStatus(null);
                        }}
                        required
                      >
                        {semesterOptions.map((semester) => (
                          <option key={semester} value={semester}>
                            Semester {semester}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="allotment-form-field">
                      <span>Section</span>
                      <input
                        className="erp-select-input"
                        type="text"
                        maxLength={20}
                        value={allotmentSection}
                        onChange={(event) => {
                          setAllotmentSection(event.target.value);
                          setSaveStatus(null);
                        }}
                        placeholder="e.g. Section A"
                        required
                      />
                    </label>

                    <label className="allotment-form-field">
                      <span>Subject</span>
                      <select
                        className="erp-select-input"
                        value={selectedSubjectCode}
                        onChange={(event) => {
                          setSelectedSubjectCode(event.target.value);
                          setSaveStatus(null);
                        }}
                        required
                        disabled={!allotmentSchemeYear || allotmentSubjectsLoading}
                      >
                        <option value="">
                          {allotmentSubjectsLoading
                            ? "Loading subjects..."
                            : "Select subject"}
                        </option>
                        {allotmentSubjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.subject_code} - {subject.subject_name}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="allotment-form-field">
                      <span>Course ID</span>
                      <div className="allotment-readonly-field">
                        {selectedSubject?.subject_code || "From selected subject"}
                      </div>
                    </div>

                    <div className="allotment-form-field">
                      <span>Subject Name</span>
                      <div className="allotment-readonly-field">
                        {selectedSubject?.subject_name || "From selected subject"}
                      </div>
                    </div>

                    <div className="allotment-form-field">
                      <span>Subject Category</span>
                      <div className="allotment-readonly-field">
                        {selectedSubject?.subject_category || "From selected subject"}
                      </div>
                    </div>

                    <div className="allotment-form-field">
                      <span>No. of Teaching Hours</span>
                      <div className="allotment-readonly-field">
                        {selectedSubject?.teaching_hours ?? "From selected subject"}
                      </div>
                    </div>

                    <div className="allotment-form-field">
                      <span>Credits</span>
                      <div className="allotment-readonly-field">
                        {selectedSubject?.credits ?? "From selected subject"}
                      </div>
                    </div>

                    <label className="allotment-form-field">
                      <span>Faculty ID</span>
                      <select
                        className="erp-select-input"
                        value={selectedFacultyId}
                        onChange={(event) => {
                          setSelectedFacultyId(event.target.value);
                          setSaveStatus(null);
                        }}
                        required
                      >
                        <option value="">Select faculty ID</option>
                        {faculties.map((faculty) => (
                          <option
                            key={faculty.faculty_id}
                            value={faculty.faculty_id}
                          >
                            {faculty.faculty_id}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="allotment-form-field">
                      <span>Faculty Name</span>
                      <div className="allotment-readonly-field">
                        {selectedFaculty?.name || "Fetched from Faculty ID"}
                      </div>
                    </div>
                  </div>

                  <div className="allotment-form-actions">
                    <span className="footer-info-strip">
                      <ShieldCheck size={16} />
                      More than one faculty can be allotted to the same subject
                      when required by the department.
                    </span>
                    <button
                      type="submit"
                      className="btn-erp-primary"
                      disabled={
                        saving ||
                        loading ||
                        faculties.length === 0 ||
                        allotmentSubjects.length === 0 ||
                        allotmentSubjectsLoading ||
                        !allotmentSchemeYear ||
                        !isValidAcademicYear(academicYear)
                      }
                    >
                      {saving ? (
                        <>
                          <RefreshCw size={16} className="animate-spin" />
                          <span>Adding Allotment...</span>
                        </>
                      ) : (
                        <>
                          <Plus size={16} />
                          <span>Add Allotment</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <div className="erp-card-container allotment-records-card">
                <div className="erp-card-toolbar">
                  <div>
                    <h3 className="content-heading">
                      Allotments for {academicYear}
                    </h3>
                    <p className="content-subheading">
                      {subjectAllotments.length} faculty-subject allotment
                      {subjectAllotments.length === 1 ? "" : "s"}
                    </p>
                  </div>
                </div>
                <div className="erp-table-responsive">
                  <table className="erp-data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Faculty ID</th>
                        <th>Faculty Name</th>
                        <th>Scheme</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Course ID</th>
                        <th>Subject Name</th>
                        <th>Category</th>
                        <th>Teaching Hours</th>
                        <th>Credits</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allotmentsLoading ? (
                        <tr>
                          <td colSpan="11" className="table-empty-notice">
                            Loading subject allotments...
                          </td>
                        </tr>
                      ) : subjectAllotments.length === 0 ? (
                        <tr>
                          <td colSpan="11" className="table-empty-notice">
                            No subject allotments for this academic year yet.
                          </td>
                        </tr>
                      ) : (
                        subjectAllotments.map((allotment, index) => (
                          <tr key={allotment.allocation_id}>
                            <td className="cell-idx">{index + 1}</td>
                            <td>
                              <span className="erp-code-pill">
                                {allotment.faculty_id}
                              </span>
                            </td>
                            <td>{allotment.faculty_name}</td>
                            <td>
                              {allotment.scheme_year
                                ? `Scheme ${allotment.scheme_year}`
                                : "Legacy"}
                            </td>
                            <td>{allotment.semester}</td>
                            <td>{allotment.section}</td>
                            <td>
                              <span className="erp-code-pill">
                                {allotment.subject_code}
                              </span>
                            </td>
                            <td>{allotment.subject_name}</td>
                            <td>
                              {allotment.subject_category || allotment.subject_type}
                            </td>
                            <td>{allotment.teaching_hours}</td>
                            <td>
                              <span className="erp-credit-badge">
                                {allotment.credits} Credits
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="erp-card-container department-faculties-card">
                <div className="erp-card-toolbar">
                  <div>
                    <h3 className="content-heading">Department Faculties</h3>
                    <p className="content-subheading">
                      Faculty roster for {deptName}; select a faculty ID above
                      to add an allotment.
                    </p>
                  </div>
                </div>
                <div className="erp-table-responsive">
                  <table className="erp-data-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Faculty ID</th>
                        <th>Faculty Name</th>
                        <th>Designation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="table-empty-notice">
                            Loading department faculties...
                          </td>
                        </tr>
                      ) : faculties.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="table-empty-notice">
                            No department faculties found.
                          </td>
                        </tr>
                      ) : (
                        faculties.map((faculty, index) => (
                          <tr key={faculty.faculty_id}>
                            <td className="cell-idx">{index + 1}</td>
                            <td>
                              <span className="erp-code-pill">
                                {faculty.faculty_id}
                              </span>
                            </td>
                            <td>{faculty.name}</td>
                            <td>{faculty.designation}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: DEPARTMENT FACULTY ROSTER */}
          {activeTab === "faculties" && (
            <div className="erp-tab-content">
              <div className="erp-card-container p-20">
                <div className="roster-top-bar">
                  <div>
                    <h2 className="content-heading">
                      Department Faculty Members
                    </h2>
                    <p className="content-subheading">
                      Teaching roster for Department of {deptName} (
                      {faculties.length} Registered Staff)
                    </p>
                  </div>
                  <div className="badge-academic-year">
                    Total Teaching Staff: {faculties.length}
                  </div>
                </div>

                <div className="faculty-cards-grid">
                  {faculties.map((fac) => (
                    <div key={fac.faculty_id} className="faculty-profile-card">
                      <div className="fcard-header">
                        <div className="fcard-avatar">
                          {fac.name
                            .replace("Dr.", "")
                            .replace("Prof.", "")
                            .trim()
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                        <div className="fcard-main">
                          <h4 className="fcard-name">{fac.name}</h4>
                          <span className="fcard-id-pill">
                            {fac.faculty_id}
                          </span>
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
                          <span className="row-v role-tag">
                            {fac.is_hod
                              ? "Head of Department"
                              : "Subject Teacher"}
                          </span>
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
