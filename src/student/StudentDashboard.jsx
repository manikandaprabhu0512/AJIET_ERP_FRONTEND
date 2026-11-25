import React, { useState, useEffect, useRef } from "react";
import "./StudentDashboard.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import {
  getProfileApi,
  getStudentGradesApi,
  getStudentActivitiesApi,
  addStudentActivityApi,
} from "../services/apiService";
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
  ChevronDown,
  UploadCloud,
  FileText,
  Clock,
  Eye,
  PlusCircle,
  Check,
  X,
} from "lucide-react";

// Initial empty profile schema (no fake mock names or numbers)
const EMPTY_STUDENT_PROFILE = {
  programType: "UG",
  admissionQuota: "-",
  usn: "",
  branch: "",
  section: "",
  enrolledYear: "",
  fullName: "",
  dob: "",
  gender: "",
  bloodGroup: "",
  placeOfStay: "",
  pgOwnerName: "",
  pgAddress: "",
  pgContactCountryCode: "+91",
  pgContactNumber: "",
  religion: "",
  caste: "",
  category: "",
  aadhaarNumber: "",
  sslcPercentage: "",
  pucPcmPercentage: "",
  pucTotalPercentage: "",
  studiedKannadaInSSLC: "",
  abcId: "",
  studentSsid: "",
  email: "",
  mobileCountryCode: "+91",
  mobile: "",
  state: "",
  district: "",
  city: "",
  addressLine1: "",
  pincode: "",
  fatherName: "",
  fatherOccupation: "",
  fatherMobileCountryCode: "+91",
  fatherMobile: "",
  motherName: "",
  motherOccupation: "",
  motherMobileCountryCode: "+91",
  motherMobile: "",
  declarationAccepted: true,
};

function StudentProfileSection({ title, children }) {
  return (
    <section className="student-record-section">
      <h3 className="student-record-section-title">{title}</h3>
      <dl className="student-record-fields">{children}</dl>
    </section>
  );
}

function StudentProfileField({ label, value, className = "" }) {
  return (
    <div className={`student-record-field ${className}`}>
      <dt>{label}</dt>
      <dd>{value || "Not Provided"}</dd>
    </div>
  );
}

function StudentProfileDocument({
  studentData,
  preview = false,
  sheetRef = null,
}) {
  return (
    <article
      className={`student-profile-document ${preview ? "student-profile-preview-page" : ""}`}
      ref={sheetRef}
    >
      <header className="student-record-header">
        <div>
          <span className="student-record-kicker">AJIET • STUDENT RECORD</span>
          <h2>{studentData.fullName || "Student Profile"}</h2>
          <p>{studentData.branch || "Department not provided"}</p>
        </div>
        <div className="student-record-usn">
          <span>University Seat Number</span>
          <strong>{studentData.usn || "Not Provided"}</strong>
        </div>
      </header>

      <div className="student-record-summary">
        <span>
          {studentData.programType === "UG"
            ? "Undergraduate (UG) - B.E."
            : "Postgraduate (PG)"}
        </span>
        <span>Batch {studentData.enrolledYear || "Not Provided"}</span>
        <span>{studentData.section || "Not Provided"}</span>
        <span>{studentData.admissionQuota || "Quota not provided"} Quota</span>
      </div>

      <div className="student-record-body">
        <StudentProfileSection title="Academic & Admission Details">
          <StudentProfileField
            label="Program Level"
            value={
              studentData.programType === "UG"
                ? "Undergraduate (UG) - B.E."
                : "Postgraduate (PG)"
            }
          />
          <StudentProfileField
            label="Admission Quota"
            value={studentData.admissionQuota}
          />
          <StudentProfileField label="USN" value={studentData.usn} />
          <StudentProfileField
            label="Department / Branch"
            value={studentData.branch}
          />
          <StudentProfileField label="Section" value={studentData.section} />
          <StudentProfileField
            label="Enrolled Year"
            value={studentData.enrolledYear}
          />
        </StudentProfileSection>

        <StudentProfileSection title="Personal & Identity Details">
          <StudentProfileField label="Date of Birth" value={studentData.dob} />
          <StudentProfileField label="Gender" value={studentData.gender} />
          <StudentProfileField
            label="Blood Group"
            value={studentData.bloodGroup}
          />
          <StudentProfileField
            label="Place of Stay"
            value={studentData.placeOfStay}
          />
          <StudentProfileField label="Religion" value={studentData.religion} />
          <StudentProfileField
            label="Caste / Sub-Caste"
            value={studentData.caste}
          />
          <StudentProfileField label="Category" value={studentData.category} />
          <StudentProfileField
            label="Aadhaar Card Number"
            value={
              studentData.aadhaarNumber
                ? `${studentData.aadhaarNumber.slice(0, 4)} ${studentData.aadhaarNumber.slice(4, 8)} ${studentData.aadhaarNumber.slice(8, 12)}`
                : ""
            }
          />
          {(studentData.placeOfStay === "PG" ||
            studentData.placeOfStay === "Other") && (
            <>
              <StudentProfileField
                label="Owner / Caretaker Name"
                value={studentData.pgOwnerName}
              />
              <StudentProfileField
                label="Owner Contact Number"
                value={`${studentData.pgContactCountryCode} ${studentData.pgContactNumber}`.trim()}
              />
              <StudentProfileField
                label="Accommodation / PG Address"
                value={studentData.pgAddress}
                className="student-record-field-wide"
              />
            </>
          )}
        </StudentProfileSection>

        <StudentProfileSection title="Education Details">
          <StudentProfileField
            label="SSLC / 10th Percentage"
            value={
              studentData.sslcPercentage ? `${studentData.sslcPercentage}%` : ""
            }
          />
          <StudentProfileField
            label="PUC / 12th PCM Percentage"
            value={
              studentData.pucPcmPercentage
                ? `${studentData.pucPcmPercentage}%`
                : ""
            }
          />
          <StudentProfileField
            label="PUC / 12th Total Percentage"
            value={
              studentData.pucTotalPercentage
                ? `${studentData.pucTotalPercentage}%`
                : ""
            }
          />
          <StudentProfileField
            label="Studied Kannada in SSLC"
            value={studentData.studiedKannadaInSSLC}
          />
          <StudentProfileField label="ABC ID" value={studentData.abcId} />
          <StudentProfileField
            label="Student SSID (Scholarship ID)"
            value={studentData.studentSsid}
          />
        </StudentProfileSection>

        <StudentProfileSection title="Contact & Residential Details">
          <StudentProfileField
            label="Email Address"
            value={studentData.email}
          />
          <StudentProfileField
            label="Mobile Number"
            value={`${studentData.mobileCountryCode} ${studentData.mobile}`.trim()}
          />
          <StudentProfileField label="State" value={studentData.state} />
          <StudentProfileField label="District" value={studentData.district} />
          <StudentProfileField label="City / Town" value={studentData.city} />
          <StudentProfileField
            label="Postal PIN Code"
            value={studentData.pincode}
          />
          <StudentProfileField
            label="Permanent Residential Address"
            value={studentData.addressLine1}
            className="student-record-field-wide"
          />
        </StudentProfileSection>

        <StudentProfileSection title="Parent & Guardian Information">
          <StudentProfileField
            label="Father's / Guardian's Name"
            value={studentData.fatherName}
          />
          <StudentProfileField
            label="Father's Occupation"
            value={studentData.fatherOccupation}
          />
          <StudentProfileField
            label="Father's Contact Number"
            value={`${studentData.fatherMobileCountryCode} ${studentData.fatherMobile}`.trim()}
          />
          <StudentProfileField
            label="Mother's Name"
            value={studentData.motherName}
          />
          <StudentProfileField
            label="Mother's Occupation"
            value={studentData.motherOccupation}
          />
          <StudentProfileField
            label="Mother's Contact Number"
            value={
              studentData.motherMobile
                ? `${studentData.motherMobileCountryCode} ${studentData.motherMobile}`
                : ""
            }
          />
        </StudentProfileSection>
      </div>
      <footer className="student-record-document-footer">
        A. J. Institute of Engineering &amp; Technology, Mangaluru • Official
        Student Information Sheet
      </footer>
    </article>
  );
}

export default function StudentDashboard({
  onLogout = () => {},
  currentUser = null,
}) {
  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'academics' | 'extracurricular'
  const [isProfilePreviewOpen, setIsProfilePreviewOpen] = useState(false);
  const profilePreviewStageRef = useRef(null);
  const profilePreviewFrameRef = useRef(null);
  const profilePreviewSheetRef = useRef(null);

  // ── Academics / Grade Ledger State ──────────────────────────────────────────
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [gradesLoading, setGradesLoading] = useState(false);
  const [gradesError, setGradesError] = useState(null);

  // ── Extracurricular Activities State (Tab 3) ────────────────────────────────
  const [activitiesData, setActivitiesData] = useState({
    eligibleSemesters: [],
    activities: [],
  });
  const [activitiesLoading, setActivitiesLoading] = useState(false);
  const [activitiesError, setActivitiesError] = useState(null);
  const [activityForm, setActivityForm] = useState({
    semester: "",
    category: "Certifications",
    otherCategoryTitle: "",
    title: "",
    organizer: "",
    eventDate: "",
    certificateUrl: "",
    certificateFileName: "",
  });
  const [submittingActivity, setSubmittingActivity] = useState(false);
  const [activitySubmitMsg, setActivitySubmitMsg] = useState(null);
  const [previewModalImg, setPreviewModalImg] = useState(null);
  const [activitySemFilter, setActivitySemFilter] = useState("ALL");
  // Default sidebar closed on mobile (< 768px), open on desktop
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  useEffect(() => {
    if (!isProfilePreviewOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event) => {
      if (event.key === "Escape") setIsProfilePreviewOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isProfilePreviewOpen]);

  useEffect(() => {
    if (!isProfilePreviewOpen) return undefined;

    const stage = profilePreviewStageRef.current;
    const frame = profilePreviewFrameRef.current;
    const sheet = profilePreviewSheetRef.current;
    if (!stage || !frame || !sheet) return undefined;

    const fitSheet = () => {
      const sheetWidth = sheet.offsetWidth;
      const sheetHeight = sheet.offsetHeight;
      const stageStyle = window.getComputedStyle(stage);
      const availableWidth =
        stage.clientWidth -
        parseFloat(stageStyle.paddingLeft) -
        parseFloat(stageStyle.paddingRight);
      const availableHeight =
        stage.clientHeight -
        parseFloat(stageStyle.paddingTop) -
        parseFloat(stageStyle.paddingBottom);
      const scale =
        Math.min(
          availableWidth / sheetWidth,
          availableHeight / sheetHeight,
          1,
        ) * 0.99;
      frame.style.width = `${sheetWidth * scale}px`;
      frame.style.height = `${sheetHeight * scale}px`;
      sheet.style.transform = `scale(${scale})`;
    };

    const observer = new ResizeObserver(fitSheet);
    observer.observe(stage);
    observer.observe(sheet);
    window.addEventListener("resize", fitSheet);
    fitSheet();

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", fitSheet);
    };
  }, [isProfilePreviewOpen]);

  // Live institutional clock and date
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

  // Initialize student profile strictly from currentUser auth session, no fake mock identities
  const [studentData, setStudentData] = useState(() => {
    return {
      ...EMPTY_STUDENT_PROFILE,
      fullName:
        currentUser?.name && !currentUser.name.startsWith("Student (")
          ? currentUser.name
          : "",
      usn: currentUser?.username || "",
      email: currentUser?.email || "",
      branch: currentUser?.branch || "",
      section: currentUser?.section || "",
    };
  });

  // Fetch live database record from MySQL if logged in with JWT token
  useEffect(() => {
    const token =
      currentUser?.token || localStorage.getItem("ajiet_auth_token");
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
          dob: dbProfile.dob ? String(dbProfile.dob).split("T")[0] : prev.dob,
          gender: dbProfile.gender || prev.gender,
          bloodGroup: dbProfile.blood_group || prev.bloodGroup,
          placeOfStay: dbProfile.place_of_stay || prev.placeOfStay,
          pgOwnerName: dbProfile.pg_owner_name || prev.pgOwnerName,
          pgAddress: dbProfile.pg_address || prev.pgAddress,
          pgContactCountryCode:
            dbProfile.pg_contact_country_code || prev.pgContactCountryCode,
          pgContactNumber: dbProfile.pg_contact_number || prev.pgContactNumber,
          religion: dbProfile.religion || prev.religion,
          caste: dbProfile.caste || prev.caste,
          category: dbProfile.category || prev.category,
          aadhaarNumber: dbProfile.aadhaar_number || prev.aadhaarNumber,
          sslcPercentage: dbProfile.sslc_percentage
            ? String(dbProfile.sslc_percentage)
            : prev.sslcPercentage,
          pucPcmPercentage: dbProfile.puc_pcm_percentage
            ? String(dbProfile.puc_pcm_percentage)
            : prev.pucPcmPercentage,
          pucTotalPercentage: dbProfile.puc_total_percentage
            ? String(dbProfile.puc_total_percentage)
            : prev.pucTotalPercentage,
          studiedKannadaInSSLC:
            dbProfile.studied_kannada_in_sslc || prev.studiedKannadaInSSLC,
          abcId: dbProfile.abc_id || prev.abcId,
          studentSsid: dbProfile.student_ssid || prev.studentSsid,
          email: dbProfile.email || prev.email,
          mobileCountryCode:
            dbProfile.mobile_country_code || prev.mobileCountryCode,
          mobile: dbProfile.mobile || prev.mobile,
          state: dbProfile.state || prev.state,
          district: dbProfile.district || prev.district,
          city: dbProfile.city || prev.city,
          addressLine1: dbProfile.address_line1 || prev.addressLine1,
          pincode: dbProfile.pincode || prev.pincode,
          fatherName: dbProfile.father_name || prev.fatherName,
          fatherOccupation:
            dbProfile.father_occupation || prev.fatherOccupation,
          fatherMobileCountryCode:
            dbProfile.father_mobile_country_code ||
            prev.fatherMobileCountryCode,
          fatherMobile: dbProfile.father_mobile || prev.fatherMobile,
          motherName: dbProfile.mother_name || prev.motherName,
          motherOccupation:
            dbProfile.mother_occupation || prev.motherOccupation,
          motherMobileCountryCode:
            dbProfile.mother_mobile_country_code ||
            prev.motherMobileCountryCode,
          motherMobile: dbProfile.mother_mobile || prev.motherMobile,
        }));
      })
      .catch((err) => {
        console.warn("Failed to load live profile from DB:", err.message);
      })
      .finally(() => {
        setIsLoadingProfile(false);
      });
  }, [currentUser]);

  // Fetch grade ledger whenever academics tab is active or semester selection changes
  useEffect(() => {
    if (activeTab !== "academics") return;
    const usn = studentData.usn || currentUser?.username;
    if (!usn) return;

    setGradesLoading(true);
    setGradesError(null);
    getStudentGradesApi(usn, selectedSemester)
      .then((data) => {
        setAcademicData(data);
        // Auto-select first available semester if none chosen
        if (
          !selectedSemester &&
          data.availableSemesters &&
          data.availableSemesters.length > 0
        ) {
          setSelectedSemester(data.availableSemesters[0]);
        }
      })
      .catch((err) => {
        setGradesError(err.message || "Failed to load academic records.");
      })
      .finally(() => {
        setGradesLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedSemester, studentData.usn]);

  // Fetch extracurricular activities whenever Tab 3 is active
  useEffect(() => {
    if (activeTab !== "extracurricular") return;
    const usn = studentData.usn || currentUser?.username;
    if (!usn) return;

    setActivitiesLoading(true);
    setActivitiesError(null);
    getStudentActivitiesApi(usn)
      .then((data) => {
        setActivitiesData(data);
        // Default semester in form to current max semester
        if (
          data.eligibleSemesters &&
          data.eligibleSemesters.length > 0 &&
          !activityForm.semester
        ) {
          setActivityForm((prev) => ({
            ...prev,
            semester: data.eligibleSemesters[data.eligibleSemesters.length - 1],
          }));
        }
      })
      .catch((err) => {
        setActivitiesError(
          err.message || "Failed to load extracurricular activities",
        );
      })
      .finally(() => {
        setActivitiesLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, studentData.usn]);

  // Handle Certificate Image Pick and Base64 conversion
  const handleCertificateFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Certificate file size must be less than 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setActivityForm((prev) => ({
        ...prev,
        certificateUrl: reader.result,
        certificateFileName: file.name,
      }));
    };
    reader.readAsDataURL(file);
  };

  // Submit new extracurricular activity
  const handleActivitySubmit = async (e) => {
    e.preventDefault();
    const usn = studentData.usn || currentUser?.username;
    if (!usn) return;

    if (!activityForm.semester) {
      alert("Please select an eligible semester.");
      return;
    }
    if (!activityForm.title.trim()) {
      alert("Please enter the activity / achievement title.");
      return;
    }
    if (
      activityForm.category === "Others" &&
      !activityForm.otherCategoryTitle.trim()
    ) {
      alert('Please specify the custom category name for "Others".');
      return;
    }
    if (!activityForm.certificateUrl) {
      alert("Please upload your certificate / proof image.");
      return;
    }

    setSubmittingActivity(true);
    setActivitySubmitMsg(null);

    try {
      const payload = {
        semester: Number(activityForm.semester),
        category: activityForm.category,
        otherCategoryTitle:
          activityForm.category === "Others"
            ? activityForm.otherCategoryTitle
            : null,
        title: activityForm.title,
        organizer: activityForm.organizer,
        eventDate: activityForm.eventDate || null,
        certificateUrl: activityForm.certificateUrl,
      };

      const result = await addStudentActivityApi(usn, payload);
      setActivitySubmitMsg({
        type: "success",
        text: result.message || "Achievement submitted successfully!",
      });

      // Refresh list
      const refreshed = await getStudentActivitiesApi(usn);
      setActivitiesData(refreshed);

      // Reset form fields except semester
      setActivityForm((prev) => ({
        ...prev,
        title: "",
        organizer: "",
        eventDate: "",
        otherCategoryTitle: "",
        certificateUrl: "",
        certificateFileName: "",
      }));
    } catch (err) {
      setActivitySubmitMsg({
        type: "error",
        text: err.message || "Submission failed",
      });
    } finally {
      setSubmittingActivity(false);
    }
  };

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
      <div
        className={`student-portal-workspace ${isSidebarOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
        {/* Mobile backdrop overlay — tapping it closes the sidebar */}
        {isSidebarOpen && (
          <div
            className="sidebar-mobile-overlay"
            onClick={() => setIsSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        {/* LEFT YOUTUBE-STYLE SIDEBAR NAVIGATION */}
        <aside
          className={`student-portal-sidebar ${isSidebarOpen ? "sidebar-open" : "sidebar-mini"}`}
        >
          {isSidebarOpen ? (
            <>
              {/* Mini Student ID Card in Sidebar */}
              <div className="sidebar-student-card">
                <div className="student-avatar-wrap">
                  <div className="student-initials-badge">
                    {studentData.fullName
                      .split(" ")
                      .filter(Boolean)
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("") || "ST"}
                  </div>
                </div>
                <div className="sidebar-student-meta">
                  <h3 className="sidebar-student-name">
                    {studentData.fullName}
                  </h3>
                  <span className="sidebar-student-usn">{studentData.usn}</span>
                  <span className="sidebar-student-branch">
                    {studentData.branch}
                  </span>
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
                  className={`sidebar-nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                  title="Profile"
                >
                  <div className="nav-item-icon-box">
                    <User size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Profile</span>
                    <span className="nav-subtitle">
                      Personal, academic &amp; records
                    </span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                {/* TAB 2: Academics */}
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "academics" ? "active" : ""}`}
                  onClick={() => setActiveTab("academics")}
                  title="Academics"
                >
                  <div className="nav-item-icon-box">
                    <GraduationCap size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Academics</span>
                    <span className="nav-subtitle">
                      Curriculum, IA marks &amp; attendance
                    </span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                {/* TAB 3: Extracurricular Activity */}
                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "extracurricular" ? "active" : ""}`}
                  onClick={() => setActiveTab("extracurricular")}
                  title="Extracurricular Activity"
                >
                  <div className="nav-item-icon-box">
                    <Sparkles size={19} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Extracurricular Activity</span>
                    <span className="nav-subtitle">
                      Clubs, sports &amp; activity points
                    </span>
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
                className={`sidebar-mini-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
                title="Profile"
              >
                <div className="mini-icon-wrap">
                  <User size={20} />
                </div>
                <span className="mini-item-label">Profile</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "academics" ? "active" : ""}`}
                onClick={() => setActiveTab("academics")}
                title="Academics"
              >
                <div className="mini-icon-wrap">
                  <GraduationCap size={20} />
                </div>
                <span className="mini-item-label">Academics</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "extracurricular" ? "active" : ""}`}
                onClick={() => setActiveTab("extracurricular")}
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
              VIEW 1: STUDENT PROFILE
              ========================================================= */}
          {activeTab === "profile" && (
            <div className="tab-pane-container profile-pane-view">
              <div className="student-profile-toolbar">
                <div>
                  <h2>Student Information Sheet</h2>
                  <p>Official student profile and academic record</p>
                </div>
                <button
                  type="button"
                  className="student-profile-view-button"
                  onClick={() => setIsProfilePreviewOpen(true)}
                  title="View student profile"
                >
                  <Eye size={17} />
                  <span>View</span>
                </button>
              </div>

              <StudentProfileDocument studentData={studentData} />

              {isProfilePreviewOpen && (
                <div
                  className="student-profile-preview-overlay"
                  onClick={() => setIsProfilePreviewOpen(false)}
                >
                  <section
                    className="student-profile-preview-modal"
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="student-profile-preview-title"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <div className="student-profile-preview-modal-header">
                      <div>
                        <h2 id="student-profile-preview-title">
                          Student Information Sheet
                        </h2>
                        <p>Student profile</p>
                      </div>
                      <button
                        type="button"
                        className="student-profile-preview-close"
                        aria-label="Close student profile"
                        onClick={() => setIsProfilePreviewOpen(false)}
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div
                      className="student-profile-preview-stage"
                      ref={profilePreviewStageRef}
                    >
                      <div
                        className="student-profile-preview-frame"
                        ref={profilePreviewFrameRef}
                      >
                        <StudentProfileDocument
                          studentData={studentData}
                          preview
                          sheetRef={profilePreviewSheetRef}
                        />
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          )}

          {/* =========================================================
              VIEW 2: ACADEMICS TAB — Premium Grade Ledger
              ========================================================= */}
          {activeTab === "academics" && (
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
                  <p>
                    No academic records found. Contact the academic section if
                    this is incorrect.
                  </p>
                </div>
              )}

              {/* ── MAIN CONTENT ── */}
              {!gradesLoading &&
                !gradesError &&
                academicData &&
                (() => {
                  const records = academicData.records || [];
                  const summary = academicData.summary || {};
                  const availableSems = academicData.availableSemesters || [];
                  const hasBacklog = records.some(
                    (r) => r.grade_letter === "F",
                  );

                  const gradeColor = (letter) => {
                    if (!letter) return "";
                    if (letter === "O" || letter === "A+")
                      return "grade-badge-green";
                    if (letter === "A" || letter === "B+")
                      return "grade-badge-blue";
                    if (letter === "B" || letter === "C" || letter === "P")
                      return "grade-badge-amber";
                    if (letter === "F") return "grade-badge-red";
                    return "";
                  };

                  return (
                    <>
                      {/* ── Identity Strip / Page Header ── */}
                      <div className="gl-identity-strip">
                        <div className="gl-identity-left">
                          <p className="gl-identity-title">
                            Academic Grade Ledger
                          </p>
                          <p className="gl-identity-sub">
                            A.J. Institute of Engineering &amp; Technology,
                            Mangaluru &nbsp;•&nbsp; Dept of Electronics &amp;
                            Communication Engg. (EC) &nbsp;•&nbsp; VTU 2022
                            Scheme (NEP)
                          </p>
                        </div>
                        <div className="gl-identity-badges">
                          <span className="gl-badge">
                            <GraduationCap size={13} />{" "}
                            {studentData.usn || currentUser?.username}
                          </span>
                          <span className="gl-badge gl-badge-accent">
                            <Award size={13} /> Academic Year 2026–27
                          </span>
                          <span className="gl-badge">
                            {studentData.section || "A"} &nbsp;|&nbsp; Batch{" "}
                            {studentData.enrolledYear || "2025"}
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
                            {summary.sgpa != null
                              ? Number(summary.sgpa).toFixed(2)
                              : "—"}
                          </span>
                          <span className="kpi-sub">
                            Out of 10.00 Grade Points
                          </span>
                        </div>

                        {/* Avg Attendance */}
                        <div
                          className={`grades-kpi-card ${(summary.avgAttendance || 0) >= 85 ? "kpi-card-success" : "kpi-card-danger"}`}
                        >
                          <div className="kpi-icon-row">
                            <span className="kpi-label">Avg Attendance</span>
                            <div
                              className={`kpi-icon-box ${(summary.avgAttendance || 0) >= 85 ? "kpi-icon-green" : "kpi-icon-red"}`}
                            >
                              <Calendar size={16} />
                            </div>
                          </div>
                          <span
                            className={`kpi-value ${(summary.avgAttendance || 0) >= 85 ? "kpi-success" : "kpi-danger"}`}
                          >
                            {summary.avgAttendance != null
                              ? `${Number(summary.avgAttendance).toFixed(1)}%`
                              : "—"}
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
                            {summary.totalCredits ?? "—"}
                          </span>
                          <span className="kpi-sub">
                            Registered this semester
                          </span>
                        </div>

                        {/* Result Status */}
                        <div
                          className={`grades-kpi-card ${hasBacklog ? "kpi-card-danger" : "kpi-card-pass"}`}
                        >
                          <div className="kpi-icon-row">
                            <span className="kpi-label">Result Status</span>
                            <div
                              className={`kpi-icon-box ${hasBacklog ? "kpi-icon-red" : "kpi-icon-green"}`}
                            >
                              {hasBacklog ? (
                                <XCircle size={16} />
                              ) : (
                                <CheckCircle2 size={16} />
                              )}
                            </div>
                          </div>
                          <span
                            className={`kpi-value-sm ${hasBacklog ? "kpi-danger" : "kpi-success"}`}
                          >
                            {hasBacklog ? "BACKLOG" : "ALL PASS"}
                          </span>
                          <span className="kpi-sub">
                            {hasBacklog
                              ? "One or more subjects failed"
                              : "No arrears detected this semester"}
                          </span>
                        </div>
                      </div>

                      {/* ── Semester Dropdown ── */}
                      <div className="semester-selector-wrap">
                        <label
                          className="sem-selector-label"
                          htmlFor="sem-dropdown"
                        >
                          Semester:
                        </label>
                        <div className="sem-dropdown-container">
                          <select
                            id="sem-dropdown"
                            className="sem-dropdown-select"
                            value={selectedSemester ?? ""}
                            onChange={(e) =>
                              setSelectedSemester(Number(e.target.value))
                            }
                          >
                            {availableSems.map((sem) => (
                              <option key={sem} value={sem}>
                                Semester {sem} (
                                {sem === 2
                                  ? "2nd"
                                  : sem === 3
                                    ? "3rd"
                                    : `${sem}th`}{" "}
                                Sem)
                              </option>
                            ))}
                          </select>
                          <ChevronDown
                            size={14}
                            className="sem-dropdown-arrow"
                          />
                        </div>
                      </div>

                      {/* ── Official VTU Grade Table ── */}
                      <div className="grade-ledger-wrap">
                        {/* Dark Header Bar */}
                        <div className="grade-ledger-title-bar">
                          <div className="ledger-title-left">
                            <span className="ledger-dept-label">
                              Dept. of Electronics &amp; Communication
                              Engineering
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
                                <th rowSpan="2" className="th-num">
                                  #
                                </th>
                                <th rowSpan="2" className="th-code">
                                  Subject Code
                                </th>
                                <th rowSpan="2" className="th-subject">
                                  Subjects
                                </th>
                                <th
                                  colSpan="2"
                                  className="th-narrow th-group-internal"
                                >
                                  Internal Marks
                                </th>
                                <th
                                  colSpan="3"
                                  className="th-narrow th-group-attendance"
                                >
                                  Attendance in %
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  CIE (50)
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  External (50)
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  Total (100)
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  Grade Point
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  Credit Point
                                </th>
                                <th rowSpan="2" className="th-narrow">
                                  Grade
                                </th>
                              </tr>
                              <tr>
                                <th className="th-narrow th-group-internal">
                                  I
                                </th>
                                <th className="th-narrow th-group-internal">
                                  II
                                </th>
                                <th className="th-narrow th-group-attendance">
                                  I
                                </th>
                                <th className="th-narrow th-group-attendance">
                                  II
                                </th>
                                <th className="th-narrow th-group-attendance">
                                  Final
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {records.length === 0 ? (
                                <tr>
                                  <td colSpan="14" className="td-empty-state">
                                    No records found for Semester{" "}
                                    {selectedSemester}.
                                  </td>
                                </tr>
                              ) : (
                                records.map((r, idx) => (
                                  <tr
                                    key={r.subject_code || idx}
                                    className={
                                      r.grade_letter === "F" ? "tr-fail" : ""
                                    }
                                  >
                                    <td className="td-center td-muted">
                                      {idx + 1}
                                    </td>
                                    <td className="td-center">
                                      <span className="subject-code-badge">
                                        {r.subject_code}
                                      </span>
                                    </td>
                                    <td className="td-subject-name">
                                      <span className="subject-name-text">
                                        {r.subject_name}
                                      </span>
                                      <span className="subject-credits-pill">
                                        {r.credits} Credits
                                      </span>
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.internal_marks_1 ?? "—"}
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.internal_marks_2 ?? "—"}
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.attendance_1 != null
                                        ? `${r.attendance_1}%`
                                        : "—"}
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.attendance_2 != null
                                        ? `${r.attendance_2}%`
                                        : "—"}
                                    </td>
                                    <td className="td-center">
                                      <span
                                        className={
                                          r.final_attendance < 85
                                            ? "attendance-low"
                                            : "attendance-ok"
                                        }
                                      >
                                        {r.final_attendance != null
                                          ? `${r.final_attendance}%`
                                          : "—"}
                                      </span>
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.cie_marks ?? "—"}
                                    </td>
                                    <td className="td-center marks-val">
                                      {r.external_marks ?? "—"}
                                    </td>
                                    <td className="td-center">
                                      <span className="total-marks-val">
                                        {r.total_marks ?? "—"}
                                      </span>
                                    </td>
                                    <td className="td-center grade-point-val">
                                      {r.grade_point ?? "—"}
                                    </td>
                                    <td className="td-center credit-point-val">
                                      {r.credit_point ?? "—"}
                                    </td>
                                    <td className="td-center">
                                      <span
                                        className={`grade-letter-badge ${gradeColor(r.grade_letter)}`}
                                      >
                                        {r.grade_letter || "—"}
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
                                  <td className="tfoot-label">
                                    Semester Totals
                                  </td>
                                  <td colSpan="8" />
                                  <td className="td-center">
                                    <span className="tfoot-pill">
                                      Credits: {summary.totalCredits ?? "—"}
                                    </span>
                                  </td>
                                  <td className="td-center">
                                    <span className="tfoot-pill">
                                      Cr·Pts: {summary.totalCreditPoints ?? "—"}
                                    </span>
                                  </td>
                                  <td className="td-center">
                                    <span className="tfoot-sgpa-badge">
                                      SGPA:{" "}
                                      {summary.sgpa != null
                                        ? Number(summary.sgpa).toFixed(2)
                                        : "—"}
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
              VIEW 3: EXTRACURRICULAR ACTIVITY TAB — Upload & Ledger
              ========================================================= */}
          {activeTab === "extracurricular" && (
            <div className="tab-pane-container extracurricular-pane-view">
              {/* Header Title Banner */}
              <div className="pane-header-banner">
                <div className="pane-header-left">
                  <div className="pane-title-icon-badge extra-icon-badge">
                    <Sparkles size={22} />
                  </div>
                  <div>
                    <h2 className="pane-main-title">
                      Student Extracurricular &amp; Achievement Portal
                    </h2>
                    <p className="pane-main-subtitle">
                      Upload certifications, publications, sports &amp; workshop
                      credentials to keep your extracurricular records together
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION A: Upload Achievement Form Card */}
              <section className="profile-section-card extra-form-section">
                <div className="profile-section-head">
                  <div className="section-badge-num">01</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">
                      Upload New Achievement / Credential
                    </h3>
                    <p className="section-heading-sub">
                      Select semester (up to your current enrolled semester),
                      category, and attach certificate proof
                    </p>
                  </div>
                </div>

                {activitySubmitMsg && (
                  <div
                    className={`portal-alert-inline ${activitySubmitMsg.type === "success" ? "alert-success" : "alert-error"}`}
                  >
                    {activitySubmitMsg.type === "success" ? (
                      <CheckCircle2 size={16} />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    <span>{activitySubmitMsg.text}</span>
                  </div>
                )}

                <form
                  onSubmit={handleActivitySubmit}
                  className="extra-upload-form"
                >
                  <div className="extra-form-grid">
                    {/* 1. Semester Dropdown (Option B: Up to current enrolled semester) */}
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="act-sem">
                        Semester <span className="req-star">*</span>
                      </label>
                      <div className="custom-select-wrap">
                        <select
                          id="act-sem"
                          className="extra-select-input"
                          value={activityForm.semester}
                          onChange={(e) =>
                            setActivityForm((prev) => ({
                              ...prev,
                              semester: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="" disabled>
                            -- Select Eligible Semester --
                          </option>
                          {activitiesData.eligibleSemesters?.map((sem) => (
                            <option key={sem} value={sem}>
                              Semester {sem} (
                              {sem === 2
                                ? "2nd"
                                : sem === 3
                                  ? "3rd"
                                  : `${sem}th`}{" "}
                              Sem)
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={14} className="select-arrow-icon" />
                      </div>
                      <span className="field-hint">
                        Allowed up to current academic standing (Max Sem{" "}
                        {activitiesData.maxSemester || 1})
                      </span>
                    </div>

                    {/* 2. Category Dropdown (6 specified categories) */}
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="act-cat">
                        Category <span className="req-star">*</span>
                      </label>
                      <div className="custom-select-wrap">
                        <select
                          id="act-cat"
                          className="extra-select-input"
                          value={activityForm.category}
                          onChange={(e) =>
                            setActivityForm((prev) => ({
                              ...prev,
                              category: e.target.value,
                            }))
                          }
                          required
                        >
                          <option value="Publications">
                            1. Publications (Journals / Conferences)
                          </option>
                          <option value="Certifications">
                            2. Certifications (NPTEL, Coursera, Global)
                          </option>
                          <option value="Sports">
                            3. Sports (VTU, Collegiate, Athletics)
                          </option>
                          <option value="Culturals">
                            4. Culturals (Fest, Arts, Music, Drama)
                          </option>
                          <option value="Workshop/Training">
                            5. Workshop / Training (Bootcamps, FDP)
                          </option>
                          <option value="Others">
                            6. Others (Specify Custom Category)
                          </option>
                        </select>
                        <ChevronDown size={14} className="select-arrow-icon" />
                      </div>
                    </div>

                    {/* 3. Conditional Input for "Others" category */}
                    {activityForm.category === "Others" && (
                      <div className="form-field-group full-row-span">
                        <label className="field-label" htmlFor="act-other-cat">
                          Specify Category Name{" "}
                          <span className="req-star">*</span>
                        </label>
                        <input
                          id="act-other-cat"
                          type="text"
                          className="extra-text-input"
                          placeholder="e.g. Community Service, NSS Camp, Patent, Entrepreneurship"
                          value={activityForm.otherCategoryTitle}
                          onChange={(e) =>
                            setActivityForm((prev) => ({
                              ...prev,
                              otherCategoryTitle: e.target.value,
                            }))
                          }
                          required
                        />
                      </div>
                    )}

                    {/* 4. Activity Title */}
                    <div className="form-field-group full-row-span">
                      <label className="field-label" htmlFor="act-title">
                        Activity / Achievement Title{" "}
                        <span className="req-star">*</span>
                      </label>
                      <input
                        id="act-title"
                        type="text"
                        className="extra-text-input"
                        placeholder="e.g. 1st Prize in State Level Robotics Hackathon / NPTEL Elite+Gold in Embedded Systems"
                        value={activityForm.title}
                        onChange={(e) =>
                          setActivityForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        required
                      />
                    </div>

                    {/* 5. Organizer / Issuing Authority */}
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="act-org">
                        Organizer / Issuing Organization
                      </label>
                      <input
                        id="act-org"
                        type="text"
                        className="extra-text-input"
                        placeholder="e.g. VTU Belagavi / IIT Madras / IEEE"
                        value={activityForm.organizer}
                        onChange={(e) =>
                          setActivityForm((prev) => ({
                            ...prev,
                            organizer: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* 6. Event / Achievement Date */}
                    <div className="form-field-group">
                      <label className="field-label" htmlFor="act-date">
                        Achievement / Issue Date
                      </label>
                      <input
                        id="act-date"
                        type="date"
                        className="extra-text-input"
                        value={activityForm.eventDate}
                        onChange={(e) =>
                          setActivityForm((prev) => ({
                            ...prev,
                            eventDate: e.target.value,
                          }))
                        }
                      />
                    </div>

                    {/* 7. Certificate Upload (Image) */}
                    <div className="form-field-group full-row-span">
                      <label className="field-label">
                        Certificate / Proof Document (Image / Scan){" "}
                        <span className="req-star">*</span>
                      </label>
                      <div className="cert-dropzone">
                        <input
                          type="file"
                          id="cert-file-input"
                          accept="image/*,.pdf"
                          onChange={handleCertificateFileChange}
                          className="file-hidden-input"
                        />
                        <label
                          htmlFor="cert-file-input"
                          className="cert-dropzone-label"
                        >
                          <UploadCloud size={30} className="dropzone-icon" />
                          <div className="dropzone-text-group">
                            <strong className="dropzone-title">
                              Click to browse or drag &amp; drop certificate
                              proof
                            </strong>
                            <span className="dropzone-sub">
                              Supports JPG, PNG, WebP up to 5MB
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Uploaded File Preview Badge */}
                      {activityForm.certificateUrl && (
                        <div className="cert-preview-card">
                          <img
                            src={activityForm.certificateUrl}
                            alt="Certificate Preview"
                            className="cert-mini-thumb"
                            onClick={() =>
                              setPreviewModalImg(activityForm.certificateUrl)
                            }
                          />
                          <div className="cert-file-meta">
                            <span className="cert-file-name">
                              {activityForm.certificateFileName ||
                                "certificate_proof.jpg"}
                            </span>
                            <span className="cert-file-status">
                              Ready to submit
                            </span>
                          </div>
                          <button
                            type="button"
                            className="cert-remove-btn"
                            onClick={() =>
                              setActivityForm((prev) => ({
                                ...prev,
                                certificateUrl: "",
                                certificateFileName: "",
                              }))
                            }
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="form-actions-row">
                    <button
                      type="submit"
                      className="btn-submit-activity"
                      disabled={submittingActivity}
                    >
                      {submittingActivity ? (
                        <>
                          <Loader2 size={16} className="spin-btn-icon" />
                          <span>Uploading Achievement…</span>
                        </>
                      ) : (
                        <>
                          <PlusCircle size={16} />
                          <span>Submit Achievement</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </section>

              {/* SECTION B: Submitted Achievements Ledger */}
              <section className="profile-section-card extra-ledger-section">
                <div className="profile-section-head">
                  <div className="section-badge-num">02</div>
                  <div className="section-head-meta">
                    <h3 className="section-heading-text">
                      My Extracurricular Records
                    </h3>
                    <p className="section-heading-sub">
                      All submitted achievements and their uploaded certificates
                    </p>
                  </div>
                </div>

                {/* Filter Bar */}
                <div className="extra-ledger-filter-bar">
                  <span className="filter-label">Filter by Semester:</span>
                  <div className="filter-pill-group">
                    <button
                      type="button"
                      className={`filter-pill-btn ${activitySemFilter === "ALL" ? "active" : ""}`}
                      onClick={() => setActivitySemFilter("ALL")}
                    >
                      All Semesters
                    </button>
                    {activitiesData.eligibleSemesters?.map((sem) => (
                      <button
                        key={sem}
                        type="button"
                        className={`filter-pill-btn ${activitySemFilter === String(sem) ? "active" : ""}`}
                        onClick={() => setActivitySemFilter(String(sem))}
                      >
                        Sem {sem}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loading state */}
                {activitiesLoading && (
                  <div className="grades-loading-wrap">
                    <Loader2 size={30} className="grades-spinner" />
                    <p>Loading extracurricular achievements…</p>
                  </div>
                )}

                {/* Empty State */}
                {!activitiesLoading &&
                  activitiesData.activities?.length === 0 && (
                    <div className="grades-empty-wrap">
                      <Award size={40} />
                      <p>
                        No achievements submitted yet. Use the form above to add
                        your first certificate!
                      </p>
                    </div>
                  )}

                {/* Records Table */}
                {!activitiesLoading &&
                  activitiesData.activities?.length > 0 &&
                  (() => {
                    const filtered =
                      activitySemFilter === "ALL"
                        ? activitiesData.activities
                        : activitiesData.activities.filter(
                            (a) => String(a.semester) === activitySemFilter,
                          );

                    if (filtered.length === 0) {
                      return (
                        <div className="grades-empty-wrap">
                          <Award size={36} />
                          <p>
                            No records found for Semester {activitySemFilter}.
                          </p>
                        </div>
                      );
                    }

                    return (
                      <div className="grade-ledger-wrap extra-table-wrap">
                        <div className="grade-table-scroll-wrap">
                          <table className="vtu-grade-table extra-records-table">
                            <thead>
                              <tr>
                                <th className="th-narrow">#</th>
                                <th className="th-narrow">Semester</th>
                                <th style={{ minWidth: "150px" }}>Category</th>
                                <th
                                  style={{
                                    minWidth: "220px",
                                    textAlign: "left",
                                  }}
                                >
                                  Achievement Title
                                </th>
                                <th style={{ minWidth: "160px" }}>
                                  Organized / Issued By
                                </th>
                                <th className="th-narrow">Date</th>
                                <th className="th-narrow">Certificate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filtered.map((item, idx) => (
                                <tr key={item.id || idx}>
                                  <td className="td-center td-muted">
                                    {idx + 1}
                                  </td>
                                  <td className="td-center">
                                    <span className="sem-tag-pill">
                                      Sem {item.semester}
                                    </span>
                                  </td>
                                  <td className="td-center">
                                    <span className="extra-cat-badge">
                                      {item.category === "Others"
                                        ? item.other_category_title || "Others"
                                        : item.category}
                                    </span>
                                  </td>
                                  <td>
                                    <strong className="extra-record-title">
                                      {item.title}
                                    </strong>
                                  </td>
                                  <td className="td-center">
                                    {item.organizer || "—"}
                                  </td>
                                  <td className="td-center">
                                    {item.event_date
                                      ? String(item.event_date).split("T")[0]
                                      : "—"}
                                  </td>
                                  <td className="td-center">
                                    {item.certificate_url ? (
                                      <button
                                        type="button"
                                        className="btn-view-cert"
                                        onClick={() =>
                                          setPreviewModalImg(
                                            item.certificate_url,
                                          )
                                        }
                                        title="View Certificate"
                                      >
                                        <Eye size={14} />
                                        <span>View</span>
                                      </button>
                                    ) : (
                                      "—"
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })()}
              </section>

              {/* Certificate Image Lightbox Modal */}
              {previewModalImg && (
                <div
                  className="cert-modal-backdrop"
                  onClick={() => setPreviewModalImg(null)}
                >
                  <div
                    className="cert-modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="cert-modal-header">
                      <h4>Certificate Preview</h4>
                      <button
                        type="button"
                        className="modal-close-icon-btn"
                        onClick={() => setPreviewModalImg(null)}
                      >
                        ✕
                      </button>
                    </div>
                    <div className="cert-modal-body">
                      <img
                        src={previewModalImg}
                        alt="Certificate Enlarged"
                        className="cert-full-img"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Footer — full-width, pinned to bottom of the viewport across sidebar + main panel */}
      <Footer />
    </div>
  );
}
