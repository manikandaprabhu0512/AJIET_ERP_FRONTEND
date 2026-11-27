import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import "./FacultyDashboard.css";
import Header from "../common/Header";
import Footer from "../common/Footer";
import {
  getFacultyAssignedSubjectsApi,
  getFacultyProfileApi,
  getFacultySubjectRosterApi,
  getFacultyMessageStudentsApi,
  sendFacultyMessageApi,
  getFacultyMessagesApi,
} from "../services/apiService";
import { DEPARTMENTS } from "../data/departments";
import {
  User,
  Users,
  Award,
  Calendar,
  BookOpen,
  CheckCircle2,
  Sparkles,
  GraduationCap,
  ShieldCheck,
  FileSpreadsheet,
  ChevronRight,
  Plus,
  Download,
  X,
  Check,
  FileText,
  TrendingUp,
  Share2,
  Printer,
  Mail,
  Phone,
  Upload,
  Eye,
} from "lucide-react";

const PROFILE_FIELD_LABELS = {
  facultyId: "Faculty ID",
  vtuId: "VTU ID",
  vtuFacultyId: "VTU Faculty ID",
  doj: "Date of Joining",
  dob: "Date of Birth",
  phdStream: "Ph.D. Stream",
  phdCourse: "Ph.D. Course",
  phdUniversity: "Ph.D. University",
  phdSpecialization: "Ph.D. Specialization",
  phdYearOfAward: "Ph.D. Year of Award",
  pgStream: "Post-Graduate Stream",
  pgCourse: "Post-Graduate Course",
  pgUniversity: "Post-Graduate University",
  pgYearOfPassing: "Post-Graduate Year of Passing",
  ugStream: "Under-Graduate Stream",
  ugCourse: "Under-Graduate Course",
  ugUniversity: "Under-Graduate University",
  ugYearOfPassing: "Under-Graduate Year of Passing",
  teachingExpLecturerAsstProf: "Lecturer / Assistant Professor",
  teachingExpAssocProf: "Associate Professor",
  teachingExpProf: "Professor",
  industryExpYears: "Industry Experience",
  researchExpYears: "Research Experience",
  otherExpYears: "Other Experience",
  mobile: "Mobile Number",
  email: "Email Address",
  panNumber: "PAN Number",
  pfNpsNumber: "PF / NPS Number",
  aadhaarNumber: "Aadhaar Number",
  bankAccountNumber: "Bank Account Number",
  bankBranchName: "Bank Branch",
  ifscCode: "IFSC Code",
  licInstitutionName: "Institution Visited During Last LIC",
  memberOfVtuExecutiveCouncil: "VTU Executive Council",
  memberOfVtuAcademicSenate: "VTU Academic Senate",
  memberOfVtuBoardOfStudies: "VTU Board of Studies",
  memberOfVtuBoardOfExamination: "VTU Board of Examination",
  firstYearTeacher: "First-Year Teacher",
  biometricImpressionLht: "Biometric Impression (Left-Hand Thumb)",
  lhtName: "Left-Hand Thumb Record Name",
  linkedinProfile: "LinkedIn Profile",
  academiaProfile: "Academia Profile",
  researchGateProfile: "ResearchGate Profile",
  photoName: "Photograph File Name",
};

const ACADEMIC_YEAR_OPTIONS = ["2026-27", "2025-26", "2024-25", "2023-24"];
const RESEARCH_COMPLETION_OPTIONS = [
  "Course File Completion",
  "Progress 1 Completion",
  "Progress 2 Completion",
  "Colloquium",
  "Pre-Synopsis",
  "Thesis Submission",
];
const INITIAL_RESEARCH_FORM_STATE = {
  academicYear: ACADEMIC_YEAR_OPTIONS[0],
  candidateName: "",
  candidateUsn: "",
  researchTitle: "",
  completionStatus: [],
  date: "",
};
const INITIAL_AWARD_FORM_STATE = {
  academicYear: ACADEMIC_YEAR_OPTIONS[0],
  awardName: "",
  awardAgency: "",
  date: "",
  documentName: "",
};
const INITIAL_TRAINING_FORM_STATE = {
  academicYear: ACADEMIC_YEAR_OPTIONS[0],
  type: "Workshop",
  title: "",
  fromDate: "",
  toDate: "",
  conductedBy: "",
};

const calculateTrainingDays = (fromDate, toDate) => {
  if (!fromDate || !toDate) return "";
  const start = Date.parse(`${fromDate}T00:00:00Z`);
  const end = Date.parse(`${toDate}T00:00:00Z`);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) {
    return "";
  }
  return Math.floor((end - start) / 86400000) + 1;
};

const CLASS_SCHEDULE = [
  { classNo: 1, time: "9:00 - 9:55" },
  { classNo: 2, time: "9:55 - 10:50" },
  { classNo: 3, time: "11:10 - 12:05" },
  { classNo: 4, time: "1:25 - 2:15" },
  { classNo: 5, time: "2:50 - 3:50" },
  { classNo: 6, time: "3:50 - 4:40" },
];
const EVENT_TYPE_OPTIONS = [
  "Workshop",
  "Tech Talk",
  "Conference",
  "FDP",
  "Technical Activity",
  "Cultural Activity",
  "Sports",
  "NSS",
  "Club Activity",
  "Others",
];

const PROFILE_FIELD_GROUPS = [
  {
    title: "Personal & Appointment Details",
    keys: [
      "vtuId",
      "vtuFacultyId",
      "doj",
      "dob",
      "gender",
      "religion",
      "caste",
      "category",
      "firstYearTeacher",
    ],
  },
  {
    title: "Contact & Professional Links",
    keys: [
      "address",
      "linkedinProfile",
      "academiaProfile",
      "researchGateProfile",
    ],
  },
  {
    title: "Professional Experience",
    keys: [
      "teachingExpLecturerAsstProf",
      "teachingExpAssocProf",
      "teachingExpProf",
      "industryExpYears",
      "researchExpYears",
      "otherExpYears",
    ],
  },
  {
    title: "Institutional Service & Recognition",
    keys: [
      "awards",
      "licInstitutionName",
      "memberOfVtuExecutiveCouncil",
      "memberOfVtuAcademicSenate",
      "memberOfVtuBoardOfStudies",
      "memberOfVtuBoardOfExamination",
    ],
  },
  {
    title: "Identification & Bank Details",
    keys: [
      "panNumber",
      "pfNpsNumber",
      "aadhaarNumber",
      "bankAccountNumber",
      "bankName",
      "bankBranchName",
      "ifscCode",
      "biometricImpressionLht",
      "lhtName",
    ],
  },
];

const PROFILE_EDUCATION_LEVELS = [
  { title: "Doctoral Qualification", prefix: "phd" },
  { title: "Post-Graduate Qualification", prefix: "pg" },
  { title: "Under-Graduate Qualification", prefix: "ug" },
];

const getProfileFieldLabel = (key) =>
  PROFILE_FIELD_LABELS[key] ||
  key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^./, (character) => character.toUpperCase());

const getProfileFieldValue = (value, key) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (value && typeof value === "object") {
    if (value.name) return value.name;
    return "Uploaded";
  }
  if (typeof value === "string" && value.startsWith("data:")) return "Uploaded";
  if (/Exp/i.test(key) && value !== "" && !Number.isNaN(Number(value)))
    return `${value} years`;
  return String(value);
};

const getProfileImageSource = (value) => {
  if (typeof value === "string" && value.startsWith("data:image/"))
    return value;
  if (
    value &&
    typeof value === "object" &&
    typeof value.data === "string" &&
    value.data.startsWith("data:image/")
  ) {
    return value.data;
  }
  return "";
};

export default function FacultyDashboard({
  onLogout = () => {},
  currentUser = null,
}) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Sidebar toggle state (Expanded on desktop, collapsed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    () => window.innerWidth >= 768,
  );

  // Active navigation tab for the seven Faculty Operations links.
  const [activeTab, setActiveTab] = useState("profile");
  const [subjectAcademicYear, setSubjectAcademicYear] = useState("");
  const [subjectSemester, setSubjectSemester] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [subjectRoster, setSubjectRoster] = useState([]);
  const [subjectRosterLoading, setSubjectRosterLoading] = useState(false);
  const [subjectRosterError, setSubjectRosterError] = useState("");
  const [subjectAssessmentTab, setSubjectAssessmentTab] =
    useState("attendance");
  const [leaveForm, setLeaveForm] = useState({
    leaveType: "Casual Leave",
    fromDate: "",
    toDate: "",
    reason: "",
    alternateArrangement: "",
  });
  const [leaveHistory, setLeaveHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ajiet_leave_requests") || "[]");
    } catch {
      return [];
    }
  });
  const [attendanceDate, setAttendanceDate] = useState(
    () => new Date().toISOString().slice(0, 10),
  );
  const [attendanceTime, setAttendanceTime] = useState(CLASS_SCHEDULE[0].time);
  const [attendancePeriod, setAttendancePeriod] = useState(1);
  const [dailyAttendanceStatus, setDailyAttendanceStatus] = useState({});
  const [lessonExecution, setLessonExecution] = useState(() =>
    Array.from({ length: CLASS_SCHEDULE.length }, (_, index) => ({
      actualTopic: "",
      status: "",
      remarks: "",
      plannedTopic: [
        "Introduction",
        "Open-loop system",
        "Closed-loop system",
        "Feedback system",
        "Applications",
        "Revision",
      ][index],
    })),
  );
  const [iaMarksDraft, setIaMarksDraft] = useState({});
  const [iaExcelFileName, setIaExcelFileName] = useState("");
  const [subjectFormStatus, setSubjectFormStatus] = useState("");
  const [messageRecipientMode, setMessageRecipientMode] = useState("all");
  const [selectedMessageUsns, setSelectedMessageUsns] = useState([]);
  const [messageAcademicYear, setMessageAcademicYear] = useState("");
  const [messageSemester, setMessageSemester] = useState("");
  const [messageSection, setMessageSection] = useState("");
  const [messageStudentResult, setMessageStudentResult] = useState({
    key: "",
    students: [],
    error: "",
  });
  const [messageUsnQuery, setMessageUsnQuery] = useState("");
  const [isMessageUsnDropdownOpen, setIsMessageUsnDropdownOpen] =
    useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [sentMessages, setSentMessages] = useState([]);
  const [timetableAcademicYear, setTimetableAcademicYear] = useState("2026-27");
  const [timetableSemester, setTimetableSemester] = useState("Odd");
  const [timetableUploads, setTimetableUploads] = useState({});
  const [timetableSubmissions, setTimetableSubmissions] = useState({});
  const timetableKey = `${timetableAcademicYear}-${timetableSemester}`;
  const selectedTimetableFile = timetableUploads[timetableKey];
  const isTimetableSubmitted = Boolean(timetableSubmissions[timetableKey]);

  // Achievements sub-tab selection:
  // 'publication' | 'patent' | 'funding' | 'research' | 'awards' | 'training' | 'reports'
  const [achievementsSubTab, setAchievementsSubTab] = useState("publication");
  const [showResearchForm, setShowResearchForm] = useState(false);
  const [researchFormData, setResearchFormData] = useState(
    INITIAL_RESEARCH_FORM_STATE,
  );
  const [researchRecords, setResearchRecords] = useState([]);
  const [showAwardForm, setShowAwardForm] = useState(false);
  const [awardFormData, setAwardFormData] = useState(INITIAL_AWARD_FORM_STATE);
  const [awardsList, setAwardsList] = useState([]);
  const [crpReportYear, setCrpReportYear] = useState("All");
  const [showTrainingForm, setShowTrainingForm] = useState(false);
  const [trainingFormData, setTrainingFormData] = useState(
    INITIAL_TRAINING_FORM_STATE,
  );
  const [trainingRecords, setTrainingRecords] = useState([]);

  // Publications state with comprehensive dataset matching all required fields
  const [publicationsList, setPublicationsList] = useState([
    {
      id: "PUB-1",
      academicYear: "2025-26",
      author: "Dr. Ramesh Kumar",
      coAuthor: "Prof. Anitha Rao, Dr. Sudhir Prabhu",
      titleOfPaper:
        "Deep Learning-Based Semantic Image Segmentation for Low-Power Autonomous UAV Edge Devices",
      journalConferenceName:
        "IEEE Transactions on Industrial Informatics, Vol. 21, Issue 4, pp. 3201-3212",
      nationalOrInternational: "International",
      publicationType: "Journal",
      issnIsbn: "ISSN 1551-3203",
      doiLink: "https://doi.org/10.1109/TII.2025.3214567",
      indexing: "Scopus",
      qFactor: "Q1",
      citations: 42,
    },
    {
      id: "PUB-2",
      academicYear: "2024-25",
      author: "Dr. Ramesh Kumar",
      coAuthor: "Dr. K. V. Rajesh, Sneha Pai",
      titleOfPaper:
        "Low-Power Reconfigurable VLSI Architecture for Real-Time Edge Signal Processing",
      journalConferenceName:
        "Elsevier Microprocessors and Microsystems, Vol. 104, Article 104891",
      nationalOrInternational: "International",
      publicationType: "Journal",
      issnIsbn: "ISSN 0141-9331",
      doiLink: "https://doi.org/10.1016/j.micpro.2024.104891",
      indexing: "SCI",
      qFactor: "Q2",
      citations: 28,
    },
    {
      id: "PUB-3",
      academicYear: "2023-24",
      author: "Dr. Ramesh Kumar",
      coAuthor: "Prof. Mahesh Shetty",
      titleOfPaper:
        "FPGA Implementation of Pipelined FFT Architecture for High-Throughput 5G Baseband Systems",
      journalConferenceName:
        "Springer Wireless Personal Communications, Vol. 129, pp. 1145-1160",
      nationalOrInternational: "International",
      publicationType: "Journal",
      issnIsbn: "ISSN 0929-6212",
      doiLink: "https://doi.org/10.1007/s11277-023-10482-1",
      indexing: "Scopus",
      qFactor: "Q2",
      citations: 36,
    },
    {
      id: "PUB-4",
      academicYear: "2024-25",
      author: "Dr. Ramesh Kumar",
      coAuthor: "Vikram Nayak, Dr. S. Rao",
      titleOfPaper:
        "Energy Efficient MAC Protocols for Wireless Body Area Networks in Healthcare Telemetry",
      journalConferenceName:
        "International Conference on Emerging Trends in VLSI & Embedded Systems (ICETVES 2024)",
      nationalOrInternational: "International",
      publicationType: "Conference",
      issnIsbn: "ISBN 978-1-6654-9872-3",
      doiLink: "https://doi.org/10.1109/ICETVES.2024.981245",
      indexing: "IEEE Xplore",
      qFactor: "Q3",
      citations: 14,
    },
    {
      id: "PUB-5",
      academicYear: "2023-24",
      author: "Dr. Ramesh Kumar",
      coAuthor: "Dr. M. S. Bhat",
      titleOfPaper:
        "Security Paradigms and Cryptographic Acceleration on RISC-V SoC Architectures",
      journalConferenceName:
        "CRC Press / Taylor & Francis - Advances in Hardware Security, Chapter 7, pp. 145-178",
      nationalOrInternational: "National",
      publicationType: "Book Chapter",
      issnIsbn: "ISBN 978-0-367-45892-1",
      doiLink: "https://doi.org/10.1201/9781003029145-7",
      indexing: "Scopus",
      qFactor: "Q4",
      citations: 9,
    },
  ]);

  // Publication filter states
  const [pubFilterYear, setPubFilterYear] = useState("All");
  const [showAddPubForm, setShowAddPubForm] = useState(false);

  // New Publication form state with the exact requested fields:
  // Academic Year, Author, Co-Author, Title of Paper, Name of Journal/Conference,
  // National or International, Publication Type, ISSN/ISBN, DOI link, Indexing, Q Factor
  const initialPubFormState = {
    academicYear: "2026-27",
    author: "Dr. Ramesh Kumar",
    coAuthor: "",
    titleOfPaper: "",
    journalConferenceName: "",
    nationalOrInternational: "International",
    publicationType: "Journal",
    issnIsbn: "",
    doiLink: "",
    indexing: "Scopus",
    qFactor: "Q1",
  };

  const [pubFormData, setPubFormData] = useState(initialPubFormState);

  const handlePubFormChange = (e) => {
    const { name, value } = e.target;
    setPubFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePubFormSubmit = (e) => {
    e.preventDefault();
    if (!pubFormData.titleOfPaper.trim()) {
      showToast("Please enter the Title of Paper");
      return;
    }
    if (!pubFormData.journalConferenceName.trim()) {
      showToast("Please enter the Name of Journal / Conference");
      return;
    }
    if (!pubFormData.author.trim()) {
      showToast("Please enter the Author name");
      return;
    }

    const newRecord = {
      id: `PUB-${Date.now()}`,
      ...pubFormData,
      citations: 0,
    };

    setPublicationsList((prev) => [newRecord, ...prev]);
    showToast(
      `Publication "${newRecord.titleOfPaper.slice(0, 32)}..." added successfully!`,
    );
    setPubFormData({
      ...initialPubFormState,
      academicYear: pubFormData.academicYear,
    });
    setShowAddPubForm(false);
  };

  // Patents state with realistic records matching all requested fields:
  // academicYear, applicantName, coApplicantName, title, applicationNumber,
  // filedDate, publishedDate, status (Published | Granted),
  // patentType (Design | Utility | Copyright | Trademark), certificateName
  const [patentsList, setPatentsList] = useState([
    {
      id: "PAT-001",
      academicYear: "2025-26",
      applicantName: "Dr. Ramesh Kumar",
      coApplicantName: "AJIET IoT Research Group, Prof. Anitha Rao",
      title:
        "IoT-Enabled Smart Agricultural Soil Health Monitoring Sensor Unit",
      applicationNumber: "202441012345 A",
      filedDate: "2024-02-15",
      publishedDate: "2024-04-12",
      status: "Published",
      patentType: "Utility",
      certificateName: "Patent_Publication_202441012345.pdf",
    },
    {
      id: "PAT-002",
      academicYear: "2024-25",
      applicantName: "Dr. Ramesh Kumar",
      coApplicantName: "A J Institute of Engineering & Technology",
      title:
        "Low-Power Reconfigurable Edge AI Processor for Aerial Surveillance Drones",
      applicationNumber: "202341054321",
      filedDate: "2023-08-20",
      publishedDate: "2024-01-10",
      status: "Granted",
      patentType: "Design",
      certificateName: "Patent_Grant_Certificate_489124.pdf",
    },
    {
      id: "PAT-003",
      academicYear: "2023-24",
      applicantName: "Dr. Ramesh Kumar",
      coApplicantName: "Dr. Sudhir Prabhu",
      title:
        "AJIET Embedded IoT Firmware Architecture for Real-Time Edge Telemetry",
      applicationNumber: "SW-18492/2023",
      filedDate: "2023-05-10",
      publishedDate: "2023-09-18",
      status: "Granted",
      patentType: "Copyright",
      certificateName: "Copyright_Registration_SW18492.pdf",
    },
    {
      id: "PAT-004",
      academicYear: "2024-25",
      applicantName: "A J Institute of Engineering & Technology",
      coApplicantName: "Dr. Ramesh Kumar (Brand Coordinator)",
      title: "AJIET EduTech Smart Campus Management Logo & Device Mark",
      applicationNumber: "TM-5928104",
      filedDate: "2024-01-05",
      publishedDate: "2024-06-22",
      status: "Published",
      patentType: "Trademark",
      certificateName: "Trademark_Journal_Ad_5928104.pdf",
    },
  ]);

  // Patent filter states
  const [patentFilterYear, setPatentFilterYear] = useState("All");
  const [showAddPatentForm, setShowAddPatentForm] = useState(false);

  // New Patent Form State with requested fields:
  // academic year, applicant name, co applicant name, title, application number,
  // patent file date, patent published date, status (Published | Granted),
  // type of patent (Design | Utility | Copyright | Trademark), upload the certificate
  const initialPatentFormState = {
    academicYear: "2026-27",
    applicantName: "Dr. Ramesh Kumar",
    coApplicantName: "",
    title: "",
    applicationNumber: "",
    filedDate: "",
    publishedDate: "",
    status: "Published",
    patentType: "Utility",
    certificateName: "",
  };

  const [patentFormData, setPatentFormData] = useState(initialPatentFormState);

  const handlePatentFormChange = (e) => {
    const { name, value } = e.target;
    setPatentFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePatentCertificateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPatentFormData((prev) => ({
        ...prev,
        certificateName: file.name,
      }));
      showToast(`Selected certificate: ${file.name}`);
    }
  };

  const handlePatentFormSubmit = (e) => {
    e.preventDefault();
    if (!patentFormData.title.trim()) {
      showToast("Please enter the Title of Patent / Invention");
      return;
    }
    if (!patentFormData.applicantName.trim()) {
      showToast("Please enter the Applicant Name");
      return;
    }
    if (!patentFormData.applicationNumber.trim()) {
      showToast("Please enter the Application Number");
      return;
    }

    const newRecord = {
      id: `PAT-${Date.now()}`,
      ...patentFormData,
      certificateName:
        patentFormData.certificateName || "Patent_Certificate_Uploaded.pdf",
    };

    setPatentsList((prev) => [newRecord, ...prev]);
    showToast(
      `Patent "${newRecord.title.slice(0, 32)}..." registered successfully!`,
    );
    setPatentFormData({
      ...initialPatentFormState,
      academicYear: patentFormData.academicYear,
    });
    setShowAddPatentForm(false);
  };

  // Funding / Sponsored Research state
  const [fundingList, setFundingList] = useState([
    {
      id: "FUND-1",
      academicYear: "2023-24",
      submissionDate: "2023-02-18",
      projectTitle:
        "IoT Based Coastal Environmental Quality Monitoring Network",
      pi: "Dr. Ramesh Kumar",
      coPi: "Prof. Anitha Rao",
      agency: "Visvesvaraya Technological University",
      fundAmount: "250000",
      status: "Granted",
      documentName: "VTU_Sanction_Order.pdf",
    },
    {
      id: "FUND-2",
      academicYear: "2024-25",
      submissionDate: "2024-04-10",
      projectTitle:
        "Modernization of Advanced Embedded DSP and VLSI Laboratory",
      pi: "Dr. Sudhir Prabhu",
      coPi: "Dr. Ramesh Kumar",
      agency: "All India Council for Technical Education",
      fundAmount: "150000",
      status: "Submitted",
      documentName: "AICTE_MODROBS_Proposal.pdf",
    },
  ]);
  const [showAddFundingForm, setShowAddFundingForm] = useState(false);
  const [fundingFilterYear, setFundingFilterYear] = useState("All");
  const initialFundingFormState = {
    academicYear: "2026-27",
    submissionDate: "",
    projectTitle: "",
    pi: "Dr. Ramesh Kumar",
    coPi: "",
    agency: "",
    fundAmount: "",
    status: "Submitted",
    documentName: "",
  };
  const [fundingFormData, setFundingFormData] = useState(
    initialFundingFormState,
  );
  const [achievementViewRecord, setAchievementViewRecord] = useState(null);

  const handleFundingFormChange = (e) => {
    const { name, value } = e.target;
    setFundingFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFundingDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFundingFormData((prev) => ({
        ...prev,
        documentName: file.name,
      }));
      showToast(`Selected document: ${file.name}`);
    }
  };

  const handleFundingFormSubmit = (e) => {
    e.preventDefault();
    if (!fundingFormData.submissionDate) {
      showToast("Please select the Date of Submission");
      return;
    }
    if (!fundingFormData.projectTitle.trim()) {
      showToast("Please enter the Project Title");
      return;
    }
    if (!fundingFormData.pi.trim()) {
      showToast("Please enter the Principal Investigator");
      return;
    }
    if (!fundingFormData.agency.trim()) {
      showToast("Please enter the Funding Agency");
      return;
    }
    if (
      !fundingFormData.fundAmount ||
      Number(fundingFormData.fundAmount) <= 0
    ) {
      showToast("Please enter a valid Fund Amount");
      return;
    }

    const newRecord = {
      id: `FUND-${Date.now()}`,
      ...fundingFormData,
      documentName: fundingFormData.documentName || "Funding_Document.pdf",
    };

    setFundingList((prev) => [newRecord, ...prev]);
    showToast(
      `Funding record "${newRecord.projectTitle.slice(0, 32)}..." submitted successfully!`,
    );
    setFundingFormData(initialFundingFormState);
    setShowAddFundingForm(false);
  };

  // Subjects assigned via HOD/API
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assignedSubjectsError, setAssignedSubjectsError] = useState("");
  const [registeredData, setRegisteredData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const authToken =
    currentUser?.token || localStorage.getItem("ajiet_auth_token");
  const profileData = {
    title: registeredData?.title || "",
    fullName:
      registeredData?.fullName ||
      currentUser?.name ||
      currentUser?.username ||
      "",
    facultyId: registeredData?.facultyId || currentUser?.username || "",
    department: registeredData?.department || currentUser?.deptName || "",
    designation: registeredData?.designation || currentUser?.designation || "",
  };
  const facultyDisplayName =
    `${profileData.title} ${profileData.fullName}`.trim();
  const messageCohortKey =
    messageAcademicYear && messageSemester && messageSection
      ? JSON.stringify([
          profileData.facultyId,
          messageAcademicYear,
          messageSemester,
          messageSection,
        ])
      : "";
  const currentMessageStudentResult =
    messageStudentResult.key === messageCohortKey
      ? messageStudentResult
      : null;
  const messageStudents = currentMessageStudentResult?.students || [];
  const messageStudentsError = currentMessageStudentResult?.error || "";
  const messageStudentsLoading =
    activeTab === "message" &&
    Boolean(messageCohortKey) &&
    !currentMessageStudentResult;

  // Event Organization State
  const [eventAcademicYearFilter, setEventAcademicYearFilter] = useState("All");
  const [eventFilter, setEventFilter] = useState("All");
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventViewRecord, setEventViewRecord] = useState(null);
  const [newEvent, setNewEvent] = useState({
    academicYear: "2026-27",
    title: "",
    category: "Others",
    programDate: "",
    resourcePersonDetails: "",
    organizingDepartment: "",
    associatedDepartment: "",
    studentCount: "",
    facultyCount: "",
    externalParticipantCount: "",
    poMapping: "",
    coordinators: "",
    expenditure: "",
    socialMediaLink: "",
    reportFile: null,
    status: "Completed",
  });

  const [eventsList, setEventsList] = useState([
    {
      id: 1,
      academicYear: "2026-27",
      title:
        "National Conference on Emerging Trends in VLSI & Embedded Systems (NCETVES-26)",
      category: "Conference",
      role: "Convenor",
      sponsor: "VTU & AICTE",
      grant: "₹ 1,50,000",
      dates: "15-16 Oct 2026",
      participants: 140,
      status: "Completed",
    },
    {
      id: 2,
      academicYear: "2026-27",
      title:
        '5-Day National Faculty Development Program on "AI & Machine Learning in Signal Processing"',
      category: "FDP",
      role: "Program Coordinator",
      sponsor: "IEEE Bangalore Section & AJIET",
      grant: "₹ 75,000",
      dates: "22-26 Jul 2026",
      participants: 65,
      status: "Completed",
    },
    {
      id: 3,
      academicYear: "2025-26",
      title: "Hands-on Workshop on ARM Cortex Microcontrollers & RTOS for IoT",
      category: "Workshop",
      role: "Event Lead",
      sponsor: "AJIET Robotics & IoT Club",
      grant: "Institutional",
      dates: "14 Mar 2026",
      participants: 90,
      status: "Completed",
    },
    {
      id: 4,
      academicYear: "2026-27",
      title:
        'State-Level Technical Symposium & Project Exhibition "Technovate 2026"',
      category: "Technical Activity",
      role: "Faculty Co-Convenor",
      sponsor: "Department of ECE",
      grant: "₹ 50,000",
      dates: "28 Nov 2026",
      participants: 220,
      status: "Upcoming",
    },
  ]);

  const [notification, setNotification] = useState("");

  // Live institutional clock
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

  useEffect(() => {
    let isCurrent = true;
    if (!authToken) {
      setProfileLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    getFacultyProfileApi(authToken)
      .then((profile) => {
        if (!profile || typeof profile !== "object") {
          throw new Error(
            "Faculty profile data was not returned by the server.",
          );
        }
        if (isCurrent) {
          setRegisteredData(profile);
          setProfileError("");
        }
      })
      .catch((error) => {
        console.error("Faculty profile load failed:", error);
        if (isCurrent)
          setProfileError(error.message || "Unable to load faculty profile.");
      })
      .finally(() => {
        if (isCurrent) setProfileLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [authToken]);

  useEffect(() => {
    if (!profileData.facultyId) return;
    getFacultyMessagesApi(profileData.facultyId)
      .then((messages) =>
        setSentMessages(
          messages.map((message) => ({
            ...message,
            sentAt: message.sentAt
              ? new Date(message.sentAt).toLocaleString()
              : "",
          })),
        ),
      )
      .catch(() => setSentMessages([]));
  }, [profileData.facultyId]);

  useEffect(() => {
    if (activeTab !== "message" || !messageCohortKey) return undefined;

    let isCurrent = true;
    getFacultyMessageStudentsApi({
      facultyId: profileData.facultyId,
      academicYear: messageAcademicYear,
      semester: messageSemester,
      section: messageSection,
    })
      .then((students) => {
        if (isCurrent) {
          setMessageStudentResult({
            key: messageCohortKey,
            students,
            error: "",
          });
        }
      })
      .catch((error) => {
        if (isCurrent) {
          setMessageStudentResult({
            key: messageCohortKey,
            students: [],
            error: error.message || "Failed to fetch matching students.",
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [
    activeTab,
    profileData.facultyId,
    messageCohortKey,
    messageAcademicYear,
    messageSemester,
    messageSection,
  ]);

  // Fetch assignments only after the signed-in faculty profile is resolved.
  useEffect(() => {
    let isCurrent = true;

    if (profileLoading) {
      return () => {
        isCurrent = false;
      };
    }

    if (!profileData.facultyId) {
      setAssignedSubjects([]);
      setAssignedSubjectsError("Faculty profile ID is unavailable.");
      setLoading(false);
      return () => {
        isCurrent = false;
      };
    }

    async function loadAssigned() {
      try {
        setLoading(true);
        setAssignedSubjects([]);
        setAssignedSubjectsError("");
        const list = await getFacultyAssignedSubjectsApi(profileData.facultyId);
        if (isCurrent) setAssignedSubjects(list);
      } catch (err) {
        if (isCurrent) {
          setAssignedSubjects([]);
          setAssignedSubjectsError(
            err.message || "Failed to fetch HOD-assigned subjects.",
          );
        }
      } finally {
        if (isCurrent) setLoading(false);
      }
    }
    loadAssigned();
    return () => {
      isCurrent = false;
    };
  }, [profileLoading, profileData.facultyId]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3500);
  };

  const handleResearchFormChange = (event) => {
    const { name, value } = event.target;
    setResearchFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleResearchCompletionChange = (event) => {
    const { checked, value } = event.target;
    setResearchFormData((previous) => ({
      ...previous,
      completionStatus: checked
        ? [...previous.completionStatus, value]
        : previous.completionStatus.filter((status) => status !== value),
    }));
  };

  const handleResearchFormSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      id: `RESEARCH-${Date.now()}`,
      ...researchFormData,
    };
    setResearchRecords((previous) => [newRecord, ...previous]);
    showToast("Research candidate record added successfully.");
    setResearchFormData({
      ...INITIAL_RESEARCH_FORM_STATE,
      academicYear: researchFormData.academicYear,
    });
    setShowResearchForm(false);
  };

  const handleAwardFormChange = (event) => {
    const { name, value } = event.target;
    setAwardFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleAwardUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setAwardFormData((previous) => ({
        ...previous,
        documentName: file.name,
      }));
    }
  };

  const handleAwardFormSubmit = (event) => {
    event.preventDefault();
    const newRecord = {
      id: `AWARD-${Date.now()}`,
      ...awardFormData,
    };
    setAwardsList((previous) => [newRecord, ...previous]);
    showToast("Award record added successfully.");
    setAwardFormData({
      ...INITIAL_AWARD_FORM_STATE,
      academicYear: awardFormData.academicYear,
    });
    setShowAwardForm(false);
  };

  const handleTrainingFormChange = (event) => {
    const { name, value } = event.target;
    setTrainingFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleTrainingFormSubmit = (event) => {
    event.preventDefault();
    if (trainingFormData.toDate < trainingFormData.fromDate) {
      showToast("To date must be on or after the from date.");
      return;
    }

    const newRecord = {
      id: `TRAINING-${Date.now()}`,
      ...trainingFormData,
      totalDays: calculateTrainingDays(
        trainingFormData.fromDate,
        trainingFormData.toDate,
      ),
    };
    setTrainingRecords((previous) => [newRecord, ...previous]);
    showToast(`${newRecord.type} record added successfully.`);
    setTrainingFormData({
      ...INITIAL_TRAINING_FORM_STATE,
      academicYear: trainingFormData.academicYear,
    });
    setShowTrainingForm(false);
  };

  const handleSendMessage = async (event) => {
    event.preventDefault();
    const body = messageBody.trim();
    if (!body) {
      showToast("Enter a message before sending.");
      return;
    }
    if (!messageAcademicYear || !messageSemester || !messageSection) {
      showToast("Select an academic year, semester, and section.");
      return;
    }
    if (messageStudentsLoading) {
      showToast("Wait for the matching student list to finish loading.");
      return;
    }
    if (messageStudents.length === 0) {
      showToast("No students match the selected academic filters.");
      return;
    }
    if (
      messageRecipientMode === "selected" &&
      selectedMessageUsns.length === 0
    ) {
      showToast("Select at least one student USN.");
      return;
    }

    try {
      await sendFacultyMessageApi({
        facultyId: profileData.facultyId,
        facultyName: facultyDisplayName,
        department: profileData.department,
        subject: messageSubject.trim(),
        body,
        academicYear: messageAcademicYear,
        semester: messageSemester,
        section: messageSection,
        recipientMode: messageRecipientMode,
        recipients: [...selectedMessageUsns],
      });
      const messages = await getFacultyMessagesApi(profileData.facultyId);
      setSentMessages(
        messages.map((message) => ({
          ...message,
          sentAt: message.sentAt
            ? new Date(message.sentAt).toLocaleString()
            : new Date().toLocaleString(),
        })),
      );
      setMessageSubject("");
      setMessageBody("");
      setSelectedMessageUsns([]);
      showToast("Message sent successfully.");
    } catch (err) {
      showToast(err.message || "Failed to send message.");
    }
  };

  const handleLeaveFieldChange = (event) => {
    const { name, value } = event.target;
    setLeaveForm((previous) => ({ ...previous, [name]: value }));
  };

  const handleLeaveSubmit = (event) => {
    event.preventDefault();
    if (!leaveForm.fromDate || !leaveForm.toDate || !leaveForm.reason.trim()) {
      showToast("Enter leave dates and reason.");
      return;
    }
    if (leaveForm.toDate < leaveForm.fromDate) {
      showToast("Leave end date cannot be earlier than the start date.");
      return;
    }

    const leaveRequest = {
      id: `LR-${Date.now()}`,
      facultyId: profileData.facultyId || "FACULTY",
      facultyName: facultyDisplayName || "Faculty",
      department: profileData.department || "Department",
      leaveType: leaveForm.leaveType,
      fromDate: leaveForm.fromDate,
      toDate: leaveForm.toDate,
      reason: leaveForm.reason.trim(),
      alternateArrangement: leaveForm.alternateArrangement.trim(),
      status: "Pending",
      appliedAt: new Date().toISOString(),
    };

    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem("ajiet_leave_requests") || "[]");
      } catch {
        return [];
      }
    })();
    const updated = [leaveRequest, ...existing];
    localStorage.setItem("ajiet_leave_requests", JSON.stringify(updated));
    setLeaveHistory(updated);
    setLeaveForm({
      leaveType: "Casual Leave",
      fromDate: "",
      toDate: "",
      reason: "",
      alternateArrangement: "",
    });
    showToast("Leave request submitted to the HOD.");
  };

  const handleTimetableUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTimetableUploads((prev) => ({
      ...prev,
      [timetableKey]: file,
    }));
    setTimetableSubmissions((prev) => ({
      ...prev,
      [timetableKey]: false,
    }));
    event.target.value = "";
    showToast(
      `Time table uploaded for ${timetableAcademicYear} (${timetableSemester} Semester).`,
    );
  };

  const handleSubmitTimetable = () => {
    if (!selectedTimetableFile) {
      showToast("Upload a timetable before submitting.");
      return;
    }

    setTimetableSubmissions((prev) => ({
      ...prev,
      [timetableKey]: true,
    }));
    showToast(
      `Time table submitted for ${timetableAcademicYear} (${timetableSemester} Semester).`,
    );
  };

  const handleViewTimetable = () => {
    if (!selectedTimetableFile) return;

    const fileUrl = URL.createObjectURL(selectedTimetableFile);
    const previewLink = document.createElement("a");
    previewLink.href = fileUrl;
    previewLink.target = "_blank";
    previewLink.rel = "noopener noreferrer";
    previewLink.click();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
  };

  const handleIaExcelUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, {
        defval: "",
        raw: false,
      });

      if (rows.length === 0) {
        showToast("The Excel file does not contain any student rows.");
        event.target.value = "";
        return;
      }

      let importedCount = 0;
      const nextDraft = { ...iaMarksDraft };
      const limits = { ia1: 25, ia2: 25, task1: 10, task2: 10, finalIa: 25 };

      rows.forEach((row) => {
        const normalized = Object.fromEntries(
          Object.entries(row).map(([key, value]) => [
            key.trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
            String(value).trim(),
          ]),
        );
        const usn =
          normalized.usn ||
          normalized.studentid ||
          normalized.registrationnumber ||
          normalized.rollnumber;
        const student = subjectRoster.find(
          (record) =>
            record.studentId.toLowerCase() === usn.toLowerCase(),
        );
        if (!student) return;

        const readMark = (keys) =>
          keys.map((key) => normalized[key]).find((value) => value !== undefined);
        const draftKey = `${selectedSubject.id}-${student.studentId}`;
        const current = iaMarksDraft[draftKey] || {
          ia1: "",
          ia2: "",
          task1: "",
          task2: "",
          finalIa: "",
        };

        const imported = { ...current };
        [
          ["ia1", ["ia1"]],
          ["ia2", ["ia2"]],
          ["task1", ["task1", "taski"]],
          ["task2", ["task2", "taskii"]],
          ["finalIa", ["finalia", "finaliamarks"]],
        ].forEach(([field, keys]) => {
          const rawValue = readMark(keys);
          if (rawValue !== undefined && rawValue !== "") {
            const value = Number(rawValue);
            if (Number.isFinite(value)) {
              imported[field] = Math.max(0, Math.min(value, limits[field]));
            }
          }
        });

        nextDraft[draftKey] = imported;
        importedCount += 1;
      });

      setIaMarksDraft(nextDraft);
      setIaExcelFileName(file.name);
      setSubjectFormStatus(
        importedCount > 0
          ? `Imported IA marks for ${importedCount} student${importedCount === 1 ? "" : "s"} from ${file.name}.`
          : "No matching USN records were found in the uploaded file.",
      );
    } catch {
      setSubjectFormStatus("Unable to read the uploaded Excel file. Please check the format.");
    }

    event.target.value = "";
  };

  const handleDownloadIaTemplate = () => {
    if (!selectedSubject || subjectRoster.length === 0) return;

    const templateRows = subjectRoster.map((record) => ({
      USN: record.studentId,
      "Student Name": record.studentName,
      IA1: "",
      IA2: "",
      "Task 1": "",
      "Task 2": "",
      "Final IA": "",
    }));
    const worksheet = XLSX.utils.json_to_sheet(templateRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "IA Marks");
    XLSX.writeFile(workbook, `${selectedSubject.code}_IA_Marks_Template.xlsx`);
  };

  const handleIaMarksSubmit = () => {
    if (!selectedSubject || subjectRoster.length === 0) return;

    const marks = subjectRoster.map((record) => {
      const draftKey = `${selectedSubject.id}-${record.studentId}`;
      const draft = iaMarksDraft[draftKey] || {};
      return {
        studentId: record.studentId,
        studentName: record.studentName,
        ia1: draft.ia1,
        ia2: draft.ia2,
        task1: draft.task1,
        task2: draft.task2,
        finalIa: draft.finalIa,
      };
    });

    const submission = {
      id: `IA-${Date.now()}`,
      academicYear: subjectAcademicYear,
      semester: selectedSubject.semester,
      section: selectedSubject.section,
      subjectCode: selectedSubject.code,
      subjectName: selectedSubject.name,
      facultyId: profileData.facultyId || "FACULTY",
      facultyName: facultyDisplayName || "Faculty",
      department: profileData.department || "Department",
      status: "Pending",
      submittedAt: new Date().toISOString(),
      source: iaExcelFileName ? "Excel Upload" : "Manual Entry",
      marks,
    };

    const existing = (() => {
      try {
        return JSON.parse(localStorage.getItem("ajiet_ia_submissions") || "[]");
      } catch {
        return [];
      }
    })();
    localStorage.setItem(
      "ajiet_ia_submissions",
      JSON.stringify([submission, ...existing]),
    );
    setSubjectFormStatus(
      "IA marks submitted successfully for HOD review.",
    );
  };

  const handleViewEventReport = () => {
    if (!eventViewRecord?.reportFile) return;

    const fileUrl = URL.createObjectURL(eventViewRecord.reportFile);
    const previewLink = document.createElement("a");
    previewLink.href = fileUrl;
    previewLink.target = "_blank";
    previewLink.rel = "noopener noreferrer";
    previewLink.click();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title.trim()) return;
    const participants =
      Number(newEvent.studentCount || 0) +
      Number(newEvent.facultyCount || 0) +
      Number(newEvent.externalParticipantCount || 0);
    const item = {
      id: Date.now(),
      academicYear: newEvent.academicYear,
      title: newEvent.title,
      category: newEvent.category,
      role: newEvent.coordinators,
      sponsor: newEvent.organizingDepartment,
      grant: newEvent.expenditure || "N/A",
      dates: newEvent.programDate,
      participants,
      resourcePersonDetails: newEvent.resourcePersonDetails,
      organizingDepartment: newEvent.organizingDepartment,
      associatedDepartment: newEvent.associatedDepartment,
      studentCount: Number(newEvent.studentCount || 0),
      facultyCount: Number(newEvent.facultyCount || 0),
      externalParticipantCount: Number(newEvent.externalParticipantCount || 0),
      poMapping: newEvent.poMapping,
      coordinators: newEvent.coordinators,
      expenditure: newEvent.expenditure,
      socialMediaLink: newEvent.socialMediaLink,
      reportFile: newEvent.reportFile,
      reportFileName: newEvent.reportFile?.name || "",
      status: newEvent.status,
    };
    setEventsList((prev) => [item, ...prev]);
    setShowAddEventForm(false);
    setNewEvent({
      academicYear: "2026-27",
      title: "",
      category: "Others",
      programDate: "",
      resourcePersonDetails: "",
      organizingDepartment: "",
      associatedDepartment: "",
      studentCount: "",
      facultyCount: "",
      externalParticipantCount: "",
      poMapping: "",
      coordinators: "",
      expenditure: "",
      socialMediaLink: "",
      reportFile: null,
      status: "Completed",
    });
    showToast("Event registered successfully in institutional records!");
  };

  const teacherInitials =
    (facultyDisplayName || "Faculty")
      .replace("Dr.", "")
      .replace("Prof.", "")
      .trim()
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "FA";
  const profileFields = Object.entries(registeredData || {})
    .filter(
      ([key, value]) =>
        !/password/i.test(key) &&
        value !== null &&
        value !== undefined &&
        value !== "",
    )
    .map(([key, value]) => ({
      key,
      label: getProfileFieldLabel(key),
      value: getProfileFieldValue(value, key),
      image: /photo|image/i.test(key) ? getProfileImageSource(value) : "",
    }));
  const profileEducationGroups = PROFILE_EDUCATION_LEVELS.map((level) => ({
    ...level,
    fields: profileFields.filter((field) =>
      field.key.toLowerCase().startsWith(level.prefix),
    ),
  })).filter((group) => group.fields.length > 0);
  const profileFieldGroups = PROFILE_FIELD_GROUPS.map((group) => ({
    ...group,
    fields: profileFields.filter((field) => group.keys.includes(field.key)),
  })).filter((group) => group.fields.length > 0);
  const groupedProfileKeys = new Set([
    "title",
    "fullName",
    "facultyId",
    "department",
    "designation",
    "photograph",
    ...PROFILE_EDUCATION_LEVELS.flatMap((level) =>
      profileFields
        .filter((field) => field.key.toLowerCase().startsWith(level.prefix))
        .map((field) => field.key),
    ),
    ...PROFILE_FIELD_GROUPS.flatMap((group) => group.keys),
  ]);
  const additionalProfileFields = profileFields.filter(
    (field) => !groupedProfileKeys.has(field.key),
  );
  const profileImage = getProfileImageSource(registeredData?.photograph);
  const facultySubtitle = [
    profileData.designation,
    profileData.department && `Department of ${profileData.department}`,
    profileData.facultyId && `Faculty ID: ${profileData.facultyId}`,
  ]
    .filter(Boolean)
    .join(" • ");

  // Filtered Events
  const filteredEvents = eventsList.filter((ev) => {
    const matchesYear =
      eventAcademicYearFilter === "All" ||
      ev.academicYear === eventAcademicYearFilter;
    const matchesCategory =
      eventFilter === "All" || ev.category === eventFilter;
    return matchesYear && matchesCategory;
  });
  const availableSubjectYears = [
    ...new Set(
      assignedSubjects
        .map((subject) => subject.academic_year)
        .filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a));
  const availableMessageYears = [
    ...new Set(
      assignedSubjects
        .map((subject) => subject.academic_year)
        .filter(Boolean),
    ),
  ].sort((a, b) => b.localeCompare(a));
  const availableMessageSemesters = [
    ...new Set(
      assignedSubjects
        .filter((subject) => subject.academic_year === messageAcademicYear)
        .map((subject) => String(subject.semester)),
    ),
  ].sort((a, b) => Number(a) - Number(b));
  const availableMessageSections = [
    ...new Set(
      assignedSubjects
        .filter(
          (subject) =>
            subject.academic_year === messageAcademicYear &&
            String(subject.semester) === messageSemester,
        )
        .map((subject) => subject.section)
        .filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b));
  const availableSubjectSemesters = [
    ...new Set(
      assignedSubjects
        .filter((subject) => subject.academic_year === subjectAcademicYear)
        .map((subject) => String(subject.semester)),
    ),
  ].sort((a, b) => Number(a) - Number(b));
  const availableSubjects = assignedSubjects
    .filter(
      (subject) =>
        subject.academic_year === subjectAcademicYear &&
        String(subject.semester) === subjectSemester,
    )
    .map((subject) => ({
      ...subject,
      id: `${subject.subject_code}|${subject.semester}|${subject.section}|${subject.academic_year}`,
      code: subject.subject_code,
      name: subject.subject_name,
    }));
  const selectedSubject = availableSubjects.find(
    (subject) => subject.id === selectedSubjectId,
  );
  const selectedSubjectCode = selectedSubject?.code;
  const selectedSubjectSemester = selectedSubject?.semester;
  const selectedSubjectSection = selectedSubject?.section;
  const selectedSubjectAcademicYear = selectedSubject?.academic_year;
  const selectedSubjectCategory =
    selectedSubject?.category ??
    selectedSubject?.subject_category ??
    selectedSubject?.subject_type ??
    selectedSubject?.subjectType;
  const selectedSubjectCredits =
    selectedSubject?.credits ?? selectedSubject?.credit_count;
  const selectedSubjectTeachingHours =
    selectedSubject?.teaching_hours ??
    selectedSubject?.teachingHours ??
    selectedSubject?.hours_per_week ??
    selectedSubject?.hoursPerWeek ??
    selectedSubject?.total_hours ??
    selectedSubject?.totalHours;

  useEffect(() => {
    if (!selectedSubjectCode || !profileData.facultyId) {
      setSubjectRoster([]);
      setSubjectRosterError("");
      setSubjectRosterLoading(false);
      return undefined;
    }

    let isCurrent = true;
    setSubjectRoster([]);
    setSubjectRosterError("");
    setSubjectRosterLoading(true);
    getFacultySubjectRosterApi({
      facultyId: profileData.facultyId,
      subjectCode: selectedSubjectCode,
      semester: selectedSubjectSemester,
      section: selectedSubjectSection,
      academicYear: selectedSubjectAcademicYear,
    })
      .then((students) => {
        if (isCurrent) setSubjectRoster(students);
      })
      .catch((error) => {
        if (isCurrent) {
          setSubjectRosterError(
            error.message || "Failed to fetch students for this subject.",
          );
        }
      })
      .finally(() => {
        if (isCurrent) setSubjectRosterLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [
    selectedSubjectId,
    selectedSubjectCode,
    selectedSubjectSemester,
    selectedSubjectSection,
    selectedSubjectAcademicYear,
    profileData.facultyId,
  ]);

  // Filtered Publications by Academic Year
  const filteredPublications = publicationsList.filter((pub) => {
    const matchesYear =
      pubFilterYear === "All" || pub.academicYear === pubFilterYear;
    return matchesYear;
  });

  // Filtered Patents by Academic Year
  const filteredPatents = patentsList.filter((pat) => {
    const matchesYear =
      patentFilterYear === "All" || pat.academicYear === patentFilterYear;
    return matchesYear;
  });

  const achievementReportRecords = [
    ...publicationsList.map((publication) => ({
      id: `publication-${publication.id}`,
      academicYear: publication.academicYear,
      category: "Publication",
      title: publication.titleOfPaper,
      details: [
        publication.author,
        publication.publicationType,
        publication.journalConferenceName,
      ]
        .filter(Boolean)
        .join(" • "),
      date: publication.publishedDate || "",
    })),
    ...patentsList.map((patent) => ({
      id: `patent-${patent.id}`,
      academicYear: patent.academicYear,
      category: "Patent",
      title: patent.title,
      details: [
        patent.applicantName,
        patent.patentType,
        patent.status,
        patent.applicationNumber,
      ]
        .filter(Boolean)
        .join(" • "),
      date: patent.filedDate || "",
    })),
    ...fundingList.map((funding) => ({
      id: `funding-${funding.id}`,
      academicYear: funding.academicYear,
      category: "Funding",
      title: funding.projectTitle,
      details: [
        funding.pi,
        funding.agency,
        funding.status,
        funding.fundAmount
          ? `₹ ${Number(funding.fundAmount).toLocaleString("en-IN")}`
          : "",
      ]
        .filter(Boolean)
        .join(" • "),
      date: funding.submissionDate || "",
    })),
    ...researchRecords.map((research) => ({
      id: `research-${research.id}`,
      academicYear: research.academicYear,
      category: "Research",
      title: research.researchTitle,
      details: [
        research.candidateName,
        research.candidateUsn,
        ...(research.completionStatus || []),
      ]
        .filter(Boolean)
        .join(" • "),
      date: research.date || "",
    })),
    ...awardsList.map((award) => ({
      id: `award-${award.id}`,
      academicYear: award.academicYear,
      category: "Award",
      title: award.awardName,
      details: [award.awardAgency, award.documentName]
        .filter(Boolean)
        .join(" • "),
      date: award.date || "",
    })),
    ...trainingRecords.map((training) => ({
      id: `training-${training.id}`,
      academicYear: training.academicYear,
      category: training.type,
      title: training.title,
      details: [
        training.conductedBy,
        training.fromDate && training.toDate
          ? `${training.fromDate} to ${training.toDate}`
          : "",
        training.totalDays ? `${training.totalDays} days` : "",
      ]
        .filter(Boolean)
        .join(" • "),
      date: training.fromDate || "",
    })),
  ];
  const reportAcademicYears = [
    ...new Set([
      ...ACADEMIC_YEAR_OPTIONS,
      ...achievementReportRecords.map((record) => record.academicYear),
    ]),
  ]
    .filter(Boolean)
    .sort((a, b) => b.localeCompare(a));
  const filteredAchievementReportRecords = achievementReportRecords
    .filter(
      (record) =>
        crpReportYear === "All" || record.academicYear === crpReportYear,
    )
    .sort(
      (a, b) =>
        (b.academicYear || "").localeCompare(a.academicYear || "") ||
        a.category.localeCompare(b.category) ||
        (a.title || "").localeCompare(b.title || ""),
    );
  const reportCategorySummary = [
    "Publication",
    "Patent",
    "Funding",
    "Research",
    "Award",
    "Workshop",
    "FDP",
  ].map((category) => ({
    category,
    count: filteredAchievementReportRecords.filter(
      (record) => record.category === category,
    ).length,
  }));
  const handleCrpReportCsvExport = () => {
    const escapeCsvValue = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;
    const rows = [
      ["Academic Year", "Category", "Title", "Details", "Date"],
      ...filteredAchievementReportRecords.map((record) => [
        record.academicYear,
        record.category,
        record.title,
        record.details,
        record.date,
      ]),
    ];
    const csv = rows
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\r\n");
    const file = new Blob([`\uFEFF${csv}`], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(file);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `faculty-crp-report-${crpReportYear.toLowerCase()}.csv`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const filteredMessageUsns = messageStudents.filter((student) => {
    const query = messageUsnQuery.trim().toLowerCase();
    const usn = student.studentId.toLowerCase();
    const name = (student.studentName || "").toLowerCase();
    return (
      (usn.includes(query) || name.includes(query)) &&
      !selectedMessageUsns.includes(student.studentId)
    );
  });

  return (
    <div className="erp-portal-container">
      {/* 1. Global Institutional Header */}
      <Header
        onLogout={onLogout}
        currentUser={currentUser}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        displayName={facultyDisplayName || "Faculty"}
        displaySubtitle={facultySubtitle}
        currentDate={currentDate}
        currentTime={currentTime}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: "fixed",
            top: "70px",
            right: "24px",
            background: "var(--faculty-navy)",
            color: "#ffffff",
            padding: "10px 18px",
            borderRadius: "6px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "0.86rem",
            fontWeight: "600",
          }}
        >
          <Check size={16} style={{ color: "#4ade80" }} />
          <span>{notification}</span>
        </div>
      )}

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
              {/* Mini Faculty Badge Card */}
              <div className="sidebar-profile-card">
                <div className="profile-avatar-wrap">
                  <div className="profile-initials-badge">
                    {teacherInitials}
                  </div>
                </div>
                <div className="sidebar-profile-meta">
                  <h3 className="sidebar-profile-name">
                    {facultyDisplayName || "Faculty"}
                  </h3>
                  <span className="sidebar-profile-id">
                    {profileData.facultyId || "ID unavailable"}
                  </span>
                  <span className="sidebar-profile-dept">
                    {profileData.designation ||
                      profileData.department ||
                      "Faculty member"}
                  </span>
                  <span className="sidebar-role-pill">Faculty Member</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav-menu">
                <div className="sidebar-menu-heading">Faculty Operations</div>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "profile" ? "active" : ""}`}
                  onClick={() => setActiveTab("profile")}
                >
                  <div className="nav-item-icon-box">
                    <User size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Profile</span>
                    <span className="nav-subtitle">
                      Personal &amp; academic profile
                    </span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "achievements" ? "active" : ""}`}
                  onClick={() => setActiveTab("achievements")}
                >
                  <div className="nav-item-icon-box">
                    <Award size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Achievements</span>
                    <span className="nav-subtitle">
                      Publications, patents &amp; grants
                    </span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "timetable" ? "active" : ""}`}
                  onClick={() => setActiveTab("timetable")}
                >
                  <div className="nav-item-icon-box">
                    <Calendar size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Time Table</span>
                    <span className="nav-subtitle">Teaching schedule</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "courses" ? "active" : ""}`}
                  onClick={() => setActiveTab("courses")}
                >
                  <div className="nav-item-icon-box">
                    <BookOpen size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Subject Details</span>
                    <span className="nav-subtitle">
                      Assigned subjects and courses
                    </span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "events" ? "active" : ""}`}
                  onClick={() => setActiveTab("events")}
                >
                  <div className="nav-item-icon-box">
                    <Users size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Other Responsibilities</span>
                    <span className="nav-subtitle">Events and activities</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "message" ? "active" : ""}`}
                  onClick={() => setActiveTab("message")}
                >
                  <div className="nav-item-icon-box">
                    <Mail size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Message</span>
                    <span className="nav-subtitle">Faculty communications</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === "leave" ? "active" : ""}`}
                  onClick={() => setActiveTab("leave")}
                >
                  <div className="nav-item-icon-box">
                    <FileText size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Leave Apply</span>
                    <span className="nav-subtitle">Leave requests</span>
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
                className={`sidebar-mini-item ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
                title="Profile"
              >
                <div className="mini-icon-wrap">
                  <User size={19} />
                </div>
                <span className="mini-item-label">Profile</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "achievements" ? "active" : ""}`}
                onClick={() => setActiveTab("achievements")}
                title="Achievements"
              >
                <div className="mini-icon-wrap">
                  <Award size={19} />
                </div>
                <span className="mini-item-label">Achievements</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "timetable" ? "active" : ""}`}
                onClick={() => setActiveTab("timetable")}
                title="Time Table"
              >
                <div className="mini-icon-wrap">
                  <Calendar size={19} />
                </div>
                <span className="mini-item-label">Time Table</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "courses" ? "active" : ""}`}
                onClick={() => setActiveTab("courses")}
                title="Subject Details"
              >
                <div className="mini-icon-wrap">
                  <BookOpen size={19} />
                </div>
                <span className="mini-item-label">Subject Details</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "events" ? "active" : ""}`}
                onClick={() => setActiveTab("events")}
                title="Other Responsibilities"
              >
                <div className="mini-icon-wrap">
                  <Users size={19} />
                </div>
                <span className="mini-item-label">Other Responsibilities</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "message" ? "active" : ""}`}
                onClick={() => setActiveTab("message")}
                title="Message"
              >
                <div className="mini-icon-wrap">
                  <Mail size={19} />
                </div>
                <span className="mini-item-label">Message</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === "leave" ? "active" : ""}`}
                onClick={() => setActiveTab("leave")}
                title="Leave Apply"
              >
                <div className="mini-icon-wrap">
                  <FileText size={19} />
                </div>
                <span className="mini-item-label">Leave Apply</span>
              </button>
            </nav>
          )}
        </aside>

        {/* 3. Main Fullscreen Content Panel */}
        <main
          className="erp-portal-main-panel"
          style={{
            padding: activeTab === "profile" ? "1.25rem 1.5rem" : "1.5rem",
          }}
        >
          {/* Top Banner — only rendered on non-profile tabs to keep Faculty Profile clean and single-card focused */}
          {activeTab !== "profile" && (
            <section className="erp-institutional-banner">
              <div className="banner-primary-block">
                <div className="banner-badge-icon">
                  <GraduationCap size={26} />
                </div>
                <div className="banner-details">
                  <div className="banner-tagline">
                    <span>Faculty Academic Portal • 2026-27</span>
                    <span className="banner-tag-sep">•</span>
                    <span>
                      {profileData.department
                        ? `Dept. of ${profileData.department}`
                        : "Faculty Academic Portal"}
                    </span>
                  </div>
                  <h1 className="banner-title">
                    {facultyDisplayName || "Faculty"}
                  </h1>
                  <p className="banner-subtitle">
                    {facultySubtitle || "Faculty academic dashboard"}
                  </p>
                </div>
              </div>

              <div className="banner-meta-pills">
                <div className="meta-pill-item highlight">
                  <ShieldCheck size={14} />
                  <span>Verified Faculty Member</span>
                </div>
              </div>
            </section>
          )}

          {activeTab === "profile" && (
            <section className="faculty-profile-view">
              {!authToken ? (
                <p className="faculty-profile-error" role="alert">
                  A valid login session is required to load your faculty
                  profile.
                </p>
              ) : profileLoading ? (
                <p className="faculty-profile-message" role="status">
                  Loading faculty profile...
                </p>
              ) : profileError ? (
                <p className="faculty-profile-error" role="alert">
                  {profileError}
                </p>
              ) : profileFields.length ? (
                <div className="faculty-resume">
                  <div className="faculty-resume-toolbar">
                    <div>
                      <p className="faculty-resume-eyebrow">
                        Faculty Operations
                      </p>
                    </div>
                  </div>

                  <article className="faculty-resume-paper">
                    <header className="faculty-resume-hero">
                      <div className="faculty-resume-avatar">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt={facultyDisplayName || "Faculty"}
                          />
                        ) : (
                          <span>{teacherInitials}</span>
                        )}
                      </div>
                      <div className="faculty-resume-identity">
                        <p className="faculty-resume-eyebrow">
                          Academic Professional
                        </p>
                        <h2>{facultyDisplayName || "Faculty Member"}</h2>
                        <p className="faculty-resume-role">
                          {[profileData.designation, profileData.department]
                            .filter(Boolean)
                            .join(" · ") || "Faculty"}
                        </p>
                        {profileData.facultyId && (
                          <span className="faculty-resume-id">
                            Faculty ID: {profileData.facultyId}
                          </span>
                        )}
                        <div className="faculty-resume-contact">
                          {registeredData.email && (
                            <a href={`mailto:${registeredData.email}`}>
                              <Mail size={15} />
                              <span>{registeredData.email}</span>
                            </a>
                          )}
                          {registeredData.mobile && (
                            <a
                              href={`tel:${registeredData.mobile.replace(/[^\d+]/g, "")}`}
                            >
                              <Phone size={15} />
                              <span>{registeredData.mobile}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </header>

                    <div className="faculty-resume-content">
                      {profileEducationGroups.length > 0 && (
                        <section className="faculty-resume-section">
                          <h3>Education &amp; Qualifications</h3>
                          <div className="faculty-resume-education-list">
                            {profileEducationGroups.map((group) => (
                              <article
                                className="faculty-resume-education"
                                key={group.prefix}
                              >
                                <span className="faculty-resume-timeline-dot" />
                                <h4>{group.title}</h4>
                                <dl className="faculty-resume-details">
                                  {group.fields.map((field) => (
                                    <div
                                      className="faculty-resume-detail"
                                      key={field.key}
                                    >
                                      <dt>{field.label}</dt>
                                      <dd>{field.value}</dd>
                                    </div>
                                  ))}
                                </dl>
                              </article>
                            ))}
                          </div>
                        </section>
                      )}

                      {profileFieldGroups.map((group) => (
                        <section
                          className="faculty-resume-section"
                          key={group.title}
                        >
                          <h3>{group.title}</h3>
                          <dl className="faculty-resume-details">
                            {group.fields.map((field) => (
                              <div
                                className="faculty-resume-detail"
                                key={field.key}
                              >
                                <dt>{field.label}</dt>
                                <dd>
                                  {field.image ? (
                                    <img
                                      className="faculty-resume-field-image"
                                      src={field.image}
                                      alt={field.label}
                                    />
                                  ) : /^https?:\/\//i.test(field.value) ? (
                                    <a
                                      href={field.value}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {field.value}
                                    </a>
                                  ) : (
                                    field.value
                                  )}
                                </dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      ))}

                      {additionalProfileFields.length > 0 && (
                        <section className="faculty-resume-section">
                          <h3>Additional Information</h3>
                          <dl className="faculty-resume-details">
                            {additionalProfileFields.map((field) => (
                              <div
                                className="faculty-resume-detail"
                                key={field.key}
                              >
                                <dt>{field.label}</dt>
                                <dd>{field.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </section>
                      )}
                    </div>
                  </article>
                </div>
              ) : (
                <p className="faculty-profile-message">
                  No registration details are available for this account.
                </p>
              )}
            </section>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: ACHIEVEMENTS (WITH 8 DROPDOWN SUB-MODULES) */}
          {/* ============================================================ */}
          {activeTab === "achievements" && (
            <div className="erp-tab-content">
              {/* Horizontal Pill Bar for Achievements categories */}
              <div className="achievements-nav-pill-bar">
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "publication" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("publication")}
                >
                  <FileText size={14} />
                  <span>Publication</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "patent" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("patent")}
                >
                  <ShieldCheck size={14} />
                  <span>Patent</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "funding" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("funding")}
                >
                  <TrendingUp size={14} />
                  <span>Funding</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "research" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("research")}
                >
                  <Sparkles size={14} />
                  <span>Research</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "awards" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("awards")}
                >
                  <Award size={14} />
                  <span>Awards</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "training" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("training")}
                >
                  <Users size={14} />
                  <span>Workshops / FDPs</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === "reports" ? "active" : ""}`}
                  onClick={() => setAchievementsSubTab("reports")}
                >
                  <FileSpreadsheet size={14} />
                  <span>Report Generation</span>
                </button>
              </div>

              {/* ---------------- 1. PUBLICATION ---------------- */}
              {achievementsSubTab === "publication" && (
                <div>
                  {/* Publications Container */}
                  <div className="erp-card-container">
                    {/* Toolbar with Title & Action */}
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Research Publications (Journals, Conferences &amp;
                          Books)
                        </h2>
                        <p className="toolbar-subheading">
                          Articles and proceedings indexed in Scopus, SCI, Web
                          of Science, and UGC-CARE / ABC
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddPubForm(!showAddPubForm)}
                      >
                        {showAddPubForm ? <X size={15} /> : <Plus size={15} />}
                        <span>
                          {showAddPubForm ? "Close Form" : "Add Publication"}
                        </span>
                      </button>
                    </div>

                    {/* Academic year filter */}
                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label
                          className="pub-filter-label"
                          htmlFor="filterAcademicYear"
                        >
                          Academic Year:
                        </label>
                        <select
                          id="filterAcademicYear"
                          className="pub-filter-select"
                          value={pubFilterYear}
                          onChange={(e) => setPubFilterYear(e.target.value)}
                        >
                          <option value="All">All Academic Years</option>
                          <option value="2026-27">2026-27 (Current)</option>
                          <option value="2025-26">2025-26</option>
                          <option value="2024-25">2024-25</option>
                          <option value="2023-24">2023-24</option>
                          <option value="2022-23">2022-23</option>
                        </select>
                      </div>
                    </div>

                    {/* Add Publication Form Card */}
                    {showAddPubForm && (
                      <div className="pub-form-card">
                        <div className="pub-form-header">
                          <div className="pub-form-title-group">
                            <Plus size={16} className="text-primary" />
                            <div>
                              <h3 className="pub-form-title">
                                Enter Publication Details
                              </h3>
                              <p className="pub-form-desc">
                                Provide article, authorship, journal/conference,
                                DOI, indexing, and Q-factor details
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="pub-form-close-btn"
                            onClick={() => setShowAddPubForm(false)}
                            aria-label="Close form"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <form
                          onSubmit={handlePubFormSubmit}
                          className="pub-form-body"
                        >
                          <div className="pub-form-grid">
                            {/* 1. Academic Year Dropdown */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Academic Year{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                name="academicYear"
                                value={pubFormData.academicYear}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">
                                  2026-27 (Current)
                                </option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            {/* 2. Author */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Author (Primary){" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="author"
                                value={pubFormData.author}
                                onChange={handlePubFormChange}
                                placeholder="Primary author name (e.g., Dr. Ramesh Kumar)"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 3. Co-Author */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Co-Author(s)
                              </label>
                              <input
                                type="text"
                                name="coAuthor"
                                value={pubFormData.coAuthor}
                                onChange={handlePubFormChange}
                                placeholder="Co-authors separated by commas (e.g., Prof. Anitha Rao, Dr. Sudhir Prabhu)"
                                className="pub-form-input"
                              />
                            </div>

                            {/* 4. Title of Paper (Full Width) */}
                            <div className="pub-form-field col-span-3">
                              <label className="pub-field-label">
                                Title of Paper{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="titleOfPaper"
                                value={pubFormData.titleOfPaper}
                                onChange={handlePubFormChange}
                                placeholder="Full research paper title"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 5. Name of Journal / Conference (Col span 2) */}
                            <div className="pub-form-field col-span-2">
                              <label className="pub-field-label">
                                Name of Journal / Conference{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="journalConferenceName"
                                value={pubFormData.journalConferenceName}
                                onChange={handlePubFormChange}
                                placeholder="e.g., IEEE Transactions on Industrial Informatics, Vol. 21, Issue 4"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 6. National or International Dropdown */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                National or International{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                name="nationalOrInternational"
                                value={pubFormData.nationalOrInternational}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="International">
                                  International
                                </option>
                                <option value="National">National</option>
                              </select>
                            </div>

                            {/* 7. Publication Type Dropdown (conference, journal, book chapter) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Publication Type{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                name="publicationType"
                                value={pubFormData.publicationType}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Journal">Journal</option>
                                <option value="Conference">Conference</option>
                                <option value="Book Chapter">
                                  Book Chapter
                                </option>
                              </select>
                            </div>

                            {/* 8. ISSN / ISBN Number */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                ISSN / ISBN Number
                              </label>
                              <input
                                type="text"
                                name="issnIsbn"
                                value={pubFormData.issnIsbn}
                                onChange={handlePubFormChange}
                                placeholder="e.g., ISSN 1551-3203 or ISBN 978-0-12-824054-0"
                                className="pub-form-input"
                              />
                            </div>

                            {/* 9. DOI Link */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                DOI Link
                              </label>
                              <input
                                type="text"
                                name="doiLink"
                                value={pubFormData.doiLink}
                                onChange={handlePubFormChange}
                                placeholder="e.g., https://doi.org/10.1109/TII.2025.3214567"
                                className="pub-form-input"
                              />
                            </div>

                            {/* 10. Indexing Dropdown (scopus, sci, abc, etc.) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Indexing <span className="req-star">*</span>
                              </label>
                              <select
                                name="indexing"
                                value={pubFormData.indexing}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Scopus">Scopus</option>
                                <option value="SCI">
                                  SCI (Science Citation Index)
                                </option>
                                <option value="UGC-CARE">
                                  UGC-CARE / ABC List
                                </option>
                                <option value="Web of Science">
                                  Web of Science (WoS)
                                </option>
                                <option value="IEEE Xplore">IEEE Xplore</option>
                                <option value="Google Scholar">
                                  Google Scholar
                                </option>
                                <option value="Other">
                                  Other Peer-Reviewed
                                </option>
                              </select>
                            </div>

                            {/* 11. Q Factor Dropdown (q1, q2, q3, q4) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Q Factor <span className="req-star">*</span>
                              </label>
                              <select
                                name="qFactor"
                                value={pubFormData.qFactor}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Q1">
                                  Q1 (Top 25% Quartile)
                                </option>
                                <option value="Q2">
                                  Q2 (25% to 50% Quartile)
                                </option>
                                <option value="Q3">
                                  Q3 (50% to 75% Quartile)
                                </option>
                                <option value="Q4">
                                  Q4 (75% to 100% Quartile)
                                </option>
                                <option value="Not Applicable">
                                  Not Applicable / NA
                                </option>
                              </select>
                            </div>
                          </div>

                          {/* Form Footer Action Buttons */}
                          <div className="pub-form-actions">
                            <button
                              type="submit"
                              className="btn-primary-action"
                            >
                              <Check size={14} />
                              <span>Save Publication</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() =>
                                setPubFormData(initialPubFormState)
                              }
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() => setShowAddPubForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Publications Display List */}
                    <div className="p-20">
                      {filteredPublications.length === 0 ? (
                        <div className="empty-state-box">
                          <FileText size={32} className="text-muted" />
                          <p className="empty-state-text">
                            No publications found matching the selected filters.
                          </p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => {
                              setPubFilterYear("All");
                              setPubFilterType("All");
                              setPubSearchQuery("");
                            }}
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        <div className="erp-table-responsive achievements-table-wrap">
                          <table className="erp-data-table achievements-data-table">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Academic Year</th>
                                <th>Title of Paper</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th style={{ width: "150px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPublications.map((pub, idx) => (
                                <tr key={pub.id}>
                                  <td className="cell-idx">{idx + 1}</td>
                                  <td>
                                    <strong>{pub.academicYear}</strong>
                                  </td>
                                  <td>
                                    <strong>{pub.titleOfPaper}</strong>
                                  </td>
                                  <td>{pub.publicationType}</td>
                                  <td>
                                    <span className="pub-year-badge">
                                      Published
                                    </span>
                                  </td>
                                  <td>
                                    <div className="achievement-row-actions">
                                      <button
                                        type="button"
                                        className="achievement-action-btn achievement-view-btn"
                                        title="View publication details"
                                        aria-label="View publication details"
                                        onClick={() =>
                                          setAchievementViewRecord({
                                            type: "Publication",
                                            data: pub,
                                          })
                                        }
                                      >
                                        View
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 2. PATENT ---------------- */}
              {achievementsSubTab === "patent" && (
                <div>
                  <div className="erp-card-container">
                    {/* Toolbar with Title & Action */}
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Patents &amp; Intellectual Property Rights (IPR)
                        </h2>
                        <p className="toolbar-subheading">
                          Patents, Design Registrations, Copyrights, and
                          Trademarks filed &amp; published
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddPatentForm(!showAddPatentForm)}
                      >
                        {showAddPatentForm ? (
                          <X size={15} />
                        ) : (
                          <Plus size={15} />
                        )}
                        <span>
                          {showAddPatentForm ? "Close Form" : "File New Patent"}
                        </span>
                      </button>
                    </div>

                    {/* Academic year filter */}
                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label
                          className="pub-filter-label"
                          htmlFor="filterPatentYear"
                        >
                          Academic Year:
                        </label>
                        <select
                          id="filterPatentYear"
                          className="pub-filter-select"
                          value={patentFilterYear}
                          onChange={(e) => setPatentFilterYear(e.target.value)}
                        >
                          <option value="All">All Academic Years</option>
                          <option value="2026-27">2026-27 (Current)</option>
                          <option value="2025-26">2025-26</option>
                          <option value="2024-25">2024-25</option>
                          <option value="2023-24">2023-24</option>
                          <option value="2022-23">2022-23</option>
                        </select>
                      </div>
                    </div>

                    {/* Add Patent Form Card */}
                    {showAddPatentForm && (
                      <div className="pub-form-card">
                        <div className="pub-form-header">
                          <div className="pub-form-title-group">
                            <Plus size={16} className="text-primary" />
                            <div>
                              <h3 className="pub-form-title">
                                Enter Patent / IPR Details
                              </h3>
                              <p className="pub-form-desc">
                                Provide applicant, title, application number,
                                filing/published dates, status, type, and
                                certificate
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="pub-form-close-btn"
                            onClick={() => setShowAddPatentForm(false)}
                            aria-label="Close form"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <form
                          onSubmit={handlePatentFormSubmit}
                          className="pub-form-body"
                        >
                          <div className="pub-form-grid">
                            {/* 1. Academic Year Dropdown */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Academic Year{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                name="academicYear"
                                value={patentFormData.academicYear}
                                onChange={handlePatentFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">
                                  2026-27 (Current)
                                </option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            {/* 2. Applicant Name */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Applicant Name{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="applicantName"
                                value={patentFormData.applicantName}
                                onChange={handlePatentFormChange}
                                placeholder="Primary applicant name (e.g., Dr. Ramesh Kumar)"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 3. Co-Applicant Name */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Co-Applicant Name
                              </label>
                              <input
                                type="text"
                                name="coApplicantName"
                                value={patentFormData.coApplicantName}
                                onChange={handlePatentFormChange}
                                placeholder="Co-applicant(s) (e.g., Prof. Anitha Rao, AJIET)"
                                className="pub-form-input"
                              />
                            </div>

                            {/* 4. Title (Full Width) */}
                            <div className="pub-form-field col-span-3">
                              <label className="pub-field-label">
                                Title of Patent / Invention{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={patentFormData.title}
                                onChange={handlePatentFormChange}
                                placeholder="Full title of the patent invention or intellectual property"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 5. Application Number */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Application Number{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="text"
                                name="applicationNumber"
                                value={patentFormData.applicationNumber}
                                onChange={handlePatentFormChange}
                                placeholder="e.g., 202441012345 A"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 6. Patent Filed Date */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Patent Filed Date{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                type="date"
                                name="filedDate"
                                value={patentFormData.filedDate}
                                onChange={handlePatentFormChange}
                                className="pub-form-input"
                                required
                              />
                            </div>

                            {/* 7. Patent Published Date */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Patent Published Date
                              </label>
                              <input
                                type="date"
                                name="publishedDate"
                                value={patentFormData.publishedDate}
                                onChange={handlePatentFormChange}
                                className="pub-form-input"
                              />
                            </div>

                            {/* 8. Status Dropdown (Published, Granted) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Status <span className="req-star">*</span>
                              </label>
                              <select
                                name="status"
                                value={patentFormData.status}
                                onChange={handlePatentFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Published">Published</option>
                                <option value="Granted">Granted</option>
                              </select>
                            </div>

                            {/* 9. Type of Patent Dropdown (Design, Utility, Copyright, Trademark) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Type of Patent{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                name="patentType"
                                value={patentFormData.patentType}
                                onChange={handlePatentFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Design">Design</option>
                                <option value="Utility">Utility</option>
                                <option value="Copyright">Copyright</option>
                                <option value="Trademark">Trademark</option>
                              </select>
                            </div>

                            {/* 10. Upload the Certificate */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Upload Certificate
                              </label>
                              <label
                                htmlFor="patentCertFile"
                                className="pat-upload-box"
                              >
                                <Upload size={14} className="text-primary" />
                                <span className="pat-upload-text">
                                  {patentFormData.certificateName
                                    ? patentFormData.certificateName
                                    : "Choose Certificate (PDF/Image)"}
                                </span>
                                <input
                                  id="patentCertFile"
                                  type="file"
                                  onChange={handlePatentCertificateUpload}
                                  accept=".pdf,.png,.jpg,.jpeg"
                                  style={{ display: "none" }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Form Footer Action Buttons */}
                          <div className="pub-form-actions">
                            <button
                              type="submit"
                              className="btn-primary-action"
                            >
                              <Check size={14} />
                              <span>Save Patent</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() =>
                                setPatentFormData(initialPatentFormState)
                              }
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() => setShowAddPatentForm(false)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Patents Display Table */}
                    <div className="p-20">
                      {filteredPatents.length === 0 ? (
                        <div className="empty-state-box">
                          <ShieldCheck size={32} className="text-muted" />
                          <p className="empty-state-text">
                            No patents found matching the selected filters.
                          </p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => {
                              setPatentFilterYear("All");
                              setPatentFilterType("All");
                              setPatentFilterStatus("All");
                              setPatentSearchQuery("");
                            }}
                          >
                            Clear Filters
                          </button>
                        </div>
                      ) : (
                        <div className="erp-table-responsive achievements-table-wrap">
                          <table className="erp-data-table achievements-data-table">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Academic Year</th>
                                <th>Patent / Invention Title</th>
                                <th>Application Number</th>
                                <th>Status</th>
                                <th style={{ width: "150px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPatents.map((pat, idx) => (
                                <tr key={pat.id}>
                                  <td className="cell-idx">{idx + 1}</td>
                                  <td>
                                    <strong>{pat.academicYear}</strong>
                                  </td>
                                  <td>
                                    <strong>{pat.title}</strong>
                                  </td>
                                  <td>{pat.applicationNumber}</td>
                                  <td>
                                    <span
                                      className={`pat-status-badge ${pat.status.toLowerCase()}`}
                                    >
                                      {pat.status}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="achievement-row-actions">
                                      <button
                                        type="button"
                                        className="achievement-action-btn achievement-view-btn"
                                        title="View patent details"
                                        aria-label="View patent details"
                                        onClick={() =>
                                          setAchievementViewRecord({
                                            type: "Patent",
                                            data: pat,
                                          })
                                        }
                                      >
                                        View
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 3. FUNDING ---------------- */}
              {achievementsSubTab === "funding" && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Sponsored Research Projects &amp; Institutional Grants
                        </h2>
                        <p className="toolbar-subheading">
                          Grants sanctioned by Visvesvaraya Technological
                          University, AICTE, and DST
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddFundingForm((prev) => !prev)}
                      >
                        {showAddFundingForm ? (
                          <X size={15} />
                        ) : (
                          <Plus size={15} />
                        )}
                        <span>
                          {showAddFundingForm
                            ? "Close Form"
                            : "Add Funding Details"}
                        </span>
                      </button>
                    </div>

                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label
                          className="pub-filter-label"
                          htmlFor="fundAcademicYearFilter"
                        >
                          Academic Year:
                        </label>
                        <select
                          id="fundAcademicYearFilter"
                          className="pub-filter-select"
                          value={fundingFilterYear}
                          onChange={(e) => setFundingFilterYear(e.target.value)}
                        >
                          <option value="All">All Academic Years</option>
                          <option value="2026-27">2026-27</option>
                          <option value="2025-26">2025-26</option>
                          <option value="2024-25">2024-25</option>
                          <option value="2023-24">2023-24</option>
                          <option value="2022-23">2022-23</option>
                        </select>
                      </div>
                      {fundingFilterYear !== "All" && (
                        <button
                          type="button"
                          className="pub-reset-filter-btn"
                          onClick={() => setFundingFilterYear("All")}
                        >
                          Reset Filter
                        </button>
                      )}
                    </div>

                    {showAddFundingForm && (
                      <div className="pub-form-card">
                        <div className="pub-form-header">
                          <div className="pub-form-title-group">
                            <Plus size={16} className="text-primary" />
                            <div>
                              <h3 className="pub-form-title">
                                Enter Funding Details
                              </h3>
                              <p className="pub-form-desc">
                                Provide submission, project, investigator,
                                agency, amount, status, and document information
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            className="pub-form-close-btn"
                            onClick={() => setShowAddFundingForm(false)}
                            aria-label="Close form"
                          >
                            <X size={16} />
                          </button>
                        </div>

                        <form
                          onSubmit={handleFundingFormSubmit}
                          className="pub-form-body"
                        >
                          <div className="pub-form-grid">
                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundSubmissionDate"
                              >
                                Date of Submission{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                id="fundSubmissionDate"
                                type="date"
                                name="submissionDate"
                                value={fundingFormData.submissionDate}
                                onChange={handleFundingFormChange}
                                className="pub-form-input"
                                required
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundAcademicYear"
                              >
                                Academic Year{" "}
                                <span className="req-star">*</span>
                              </label>
                              <select
                                id="fundAcademicYear"
                                name="academicYear"
                                value={fundingFormData.academicYear}
                                onChange={handleFundingFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">
                                  2026-27 (Current)
                                </option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundProjectTitle"
                              >
                                Project Title{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                id="fundProjectTitle"
                                type="text"
                                name="projectTitle"
                                value={fundingFormData.projectTitle}
                                onChange={handleFundingFormChange}
                                placeholder="Enter the sponsored project title"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundPi"
                              >
                                Principal Investigator (PI){" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                id="fundPi"
                                type="text"
                                name="pi"
                                value={fundingFormData.pi}
                                onChange={handleFundingFormChange}
                                placeholder="PI name"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundCoPi"
                              >
                                Co-Principal Investigator (Co-PI)
                              </label>
                              <input
                                id="fundCoPi"
                                type="text"
                                name="coPi"
                                value={fundingFormData.coPi}
                                onChange={handleFundingFormChange}
                                placeholder="Co-PI name"
                                className="pub-form-input"
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundAgency"
                              >
                                Funding Agency{" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                id="fundAgency"
                                type="text"
                                name="agency"
                                value={fundingFormData.agency}
                                onChange={handleFundingFormChange}
                                placeholder="Agency name"
                                className="pub-form-input"
                                required
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundAmount"
                              >
                                Fund Amount (₹){" "}
                                <span className="req-star">*</span>
                              </label>
                              <input
                                id="fundAmount"
                                type="number"
                                name="fundAmount"
                                value={fundingFormData.fundAmount}
                                onChange={handleFundingFormChange}
                                placeholder="Enter amount"
                                className="pub-form-input"
                                min="1"
                                required
                              />
                            </div>

                            <div className="pub-form-field">
                              <label
                                className="pub-field-label"
                                htmlFor="fundStatus"
                              >
                                Status <span className="req-star">*</span>
                              </label>
                              <select
                                id="fundStatus"
                                name="status"
                                value={fundingFormData.status}
                                onChange={handleFundingFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="Submitted">Submitted</option>
                                <option value="Granted">Granted</option>
                              </select>
                            </div>

                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Upload Document
                              </label>
                              <label
                                htmlFor="fundDocumentFile"
                                className="pat-upload-box"
                              >
                                <Upload size={14} className="text-primary" />
                                <span className="pat-upload-text">
                                  {fundingFormData.documentName ||
                                    "Choose Proposal / Sanction Document"}
                                </span>
                                <input
                                  id="fundDocumentFile"
                                  type="file"
                                  onChange={handleFundingDocumentUpload}
                                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                  style={{ display: "none" }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="pub-form-actions">
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() => setShowAddFundingForm(false)}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="btn-primary-action"
                            >
                              <CheckCircle2 size={15} />
                              <span>Submit Funding Details</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="p-20">
                      {fundingList.filter(
                        (fund) =>
                          fundingFilterYear === "All" ||
                          fund.academicYear === fundingFilterYear,
                      ).length === 0 ? (
                        <div className="empty-state-box">
                          <TrendingUp size={32} className="text-muted" />
                          <p className="empty-state-text">
                            No funding records found for the selected academic
                            year.
                          </p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => setFundingFilterYear("All")}
                          >
                            Clear Filter
                          </button>
                        </div>
                      ) : (
                        <div className="erp-table-responsive achievements-table-wrap">
                          <table className="erp-data-table achievements-data-table">
                            <thead>
                              <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th>Academic Year</th>
                                <th>Project Title</th>
                                <th>Agency</th>
                                <th>Fund Amount</th>
                                <th>Status</th>
                                <th style={{ width: "150px" }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fundingList
                                .filter(
                                  (fund) =>
                                    fundingFilterYear === "All" ||
                                    fund.academicYear === fundingFilterYear,
                                )
                                .map((fund, idx) => (
                                  <tr key={fund.id}>
                                    <td className="cell-idx">{idx + 1}</td>
                                    <td>
                                      <strong>{fund.academicYear}</strong>
                                    </td>
                                    <td>
                                      <strong>{fund.projectTitle}</strong>
                                    </td>
                                    <td>{fund.agency}</td>
                                    <td>
                                      <strong>
                                        ₹{" "}
                                        {Number(fund.fundAmount).toLocaleString(
                                          "en-IN",
                                        )}
                                      </strong>
                                    </td>
                                    <td>
                                      <span
                                        className={`pat-status-badge ${fund.status === "Granted" ? "granted" : "published"}`}
                                      >
                                        {fund.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div className="achievement-row-actions">
                                        <button
                                          type="button"
                                          className="achievement-action-btn achievement-view-btn"
                                          title="View funding details"
                                          aria-label="View funding details"
                                          onClick={() =>
                                            setAchievementViewRecord({
                                              type: "Funding",
                                              data: fund,
                                            })
                                          }
                                        >
                                          View
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 4. RESEARCH ---------------- */}
              {achievementsSubTab === "research" && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Research Domains &amp; Doctoral Supervision
                        </h2>
                        <p className="toolbar-subheading">
                          Supervision of registered Ph.D. scholars and
                          institutional laboratory infrastructure
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowResearchForm((previous) => !previous)}
                      >
                        {showResearchForm ? <X size={15} /> : <Plus size={15} />}
                        <span>
                          {showResearchForm ? "Close Form" : "Log Research Record"}
                        </span>
                      </button>
                    </div>

                    <div className="p-20">
                      {showResearchForm && (
                        <div className="pub-form-card research-form-card">
                          <div className="pub-form-header">
                            <div className="pub-form-title-group">
                              <Plus size={16} className="text-primary" />
                              <div>
                                <h3 className="pub-form-title">
                                  Enter Research Candidate Details
                                </h3>
                                <p className="pub-form-desc">
                                  Record the candidate, research topic, completion
                                  milestones, and date
                                </p>
                              </div>
                            </div>
                          </div>

                          <form
                            className="pub-form-body"
                            onSubmit={handleResearchFormSubmit}
                          >
                            <div className="pub-form-grid research-form-grid">
                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="research-academic-year"
                                >
                                  Academic Year <span className="req-star">*</span>
                                </label>
                                <select
                                  id="research-academic-year"
                                  name="academicYear"
                                  value={researchFormData.academicYear}
                                  onChange={handleResearchFormChange}
                                  className="pub-form-input pub-form-select"
                                  required
                                >
                                  {ACADEMIC_YEAR_OPTIONS.map((year, index) => (
                                    <option key={year} value={year}>
                                      {year}{index === 0 ? " (Current)" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="research-candidate-name"
                                >
                                  Candidate Name
                                </label>
                                <input
                                  id="research-candidate-name"
                                  name="candidateName"
                                  type="text"
                                  value={researchFormData.candidateName}
                                  onChange={handleResearchFormChange}
                                  className="pub-form-input"
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="research-candidate-usn"
                                >
                                  Candidate USN
                                </label>
                                <input
                                  id="research-candidate-usn"
                                  name="candidateUsn"
                                  type="text"
                                  value={researchFormData.candidateUsn}
                                  onChange={handleResearchFormChange}
                                  className="pub-form-input"
                                />
                              </div>

                              <div className="pub-form-field col-span-3 research-title-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="research-title"
                                >
                                  Research Title
                                </label>
                                <textarea
                                  id="research-title"
                                  name="researchTitle"
                                  value={researchFormData.researchTitle}
                                  onChange={handleResearchFormChange}
                                  className="pub-form-input"
                                  rows={2}
                                />
                              </div>

                              <fieldset className="research-completion-options">
                                <legend className="pub-field-label">
                                  Completion Status
                                </legend>
                                {RESEARCH_COMPLETION_OPTIONS.map((status) => (
                                  <label
                                    key={status}
                                    className="research-completion-option"
                                  >
                                    <input
                                      type="checkbox"
                                      value={status}
                                      checked={researchFormData.completionStatus.includes(
                                        status,
                                      )}
                                      onChange={handleResearchCompletionChange}
                                    />
                                    <span>{status}</span>
                                  </label>
                                ))}
                              </fieldset>

                              <div className="pub-form-field research-date-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="research-date"
                                >
                                  Date
                                </label>
                                <input
                                  id="research-date"
                                  name="date"
                                  type="date"
                                  value={researchFormData.date}
                                  onChange={handleResearchFormChange}
                                  className="pub-form-input"
                                />
                              </div>
                            </div>

                            <div className="pub-form-actions">
                              <button type="submit" className="btn-primary-action">
                                <Check size={15} />
                                <span>Add Research Record</span>
                              </button>
                              <button
                                type="button"
                                className="btn-secondary-action"
                                onClick={() => setShowResearchForm(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      <h4 className="research-records-heading">
                        Research Candidate Progress Records
                      </h4>
                      <div className="erp-table-responsive achievements-table-wrap">
                        <table className="erp-data-table achievements-data-table">
                          <thead>
                            <tr>
                              <th>Academic Year</th>
                              <th>Candidate Name</th>
                              <th>Candidate USN</th>
                              <th>Research Title</th>
                              <th>Completion Status</th>
                              <th>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {researchRecords.length === 0 ? (
                              <tr>
                                <td colSpan={6}>
                                  No research candidate records added yet.
                                </td>
                              </tr>
                            ) : (
                              researchRecords.map((record) => (
                                <tr key={record.id}>
                                  <td><strong>{record.academicYear}</strong></td>
                                  <td>{record.candidateName || "—"}</td>
                                  <td>{record.candidateUsn || "—"}</td>
                                  <td>{record.researchTitle || "—"}</td>
                                  <td>
                                    {record.completionStatus.length > 0
                                      ? record.completionStatus.join(", ")
                                      : "No milestones selected"}
                                  </td>
                                  <td>{record.date || "—"}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 5. AWARDS ---------------- */}
              {achievementsSubTab === "awards" && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Academic Honors, Medals &amp; Recognitions
                        </h2>
                        <p className="toolbar-subheading">
                          Distinctions awarded by professional societies,
                          universities, and institutions
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAwardForm((previous) => !previous)}
                      >
                        {showAwardForm ? <X size={15} /> : <Plus size={15} />}
                        <span>{showAwardForm ? "Close Form" : "Add Award"}</span>
                      </button>
                    </div>

                    <div className="p-20">
                      {showAwardForm && (
                        <div className="pub-form-card">
                          <div className="pub-form-header">
                            <div className="pub-form-title-group">
                              <Award size={16} className="text-primary" />
                              <div>
                                <h3 className="pub-form-title">
                                  Enter Award Details
                                </h3>
                                <p className="pub-form-desc">
                                  Add the award, awarding agency, date, and
                                  supporting document
                                </p>
                              </div>
                            </div>
                          </div>

                          <form
                            className="pub-form-body"
                            onSubmit={handleAwardFormSubmit}
                          >
                            <div className="pub-form-grid">
                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="award-academic-year"
                                >
                                  Academic Year <span className="req-star">*</span>
                                </label>
                                <select
                                  id="award-academic-year"
                                  name="academicYear"
                                  value={awardFormData.academicYear}
                                  onChange={handleAwardFormChange}
                                  className="pub-form-input pub-form-select"
                                  required
                                >
                                  {ACADEMIC_YEAR_OPTIONS.map((year, index) => (
                                    <option key={year} value={year}>
                                      {year}{index === 0 ? " (Current)" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="award-name"
                                >
                                  Name of the Award{" "}
                                  <span className="req-star">*</span>
                                </label>
                                <input
                                  id="award-name"
                                  name="awardName"
                                  type="text"
                                  value={awardFormData.awardName}
                                  onChange={handleAwardFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="award-agency"
                                >
                                  Award Agency{" "}
                                  <span className="req-star">*</span>
                                </label>
                                <input
                                  id="award-agency"
                                  name="awardAgency"
                                  type="text"
                                  value={awardFormData.awardAgency}
                                  onChange={handleAwardFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="award-date"
                                >
                                  Date <span className="req-star">*</span>
                                </label>
                                <input
                                  id="award-date"
                                  name="date"
                                  type="date"
                                  value={awardFormData.date}
                                  onChange={handleAwardFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label className="pub-field-label">
                                  Upload Award Document
                                </label>
                                <label
                                  htmlFor="award-document-upload"
                                  className="pat-upload-box"
                                >
                                  <Upload size={14} className="text-primary" />
                                  <span className="pat-upload-text">
                                    {awardFormData.documentName ||
                                      "Choose Certificate (PDF/Image)"}
                                  </span>
                                  <input
                                    id="award-document-upload"
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg"
                                    onChange={handleAwardUpload}
                                    style={{ display: "none" }}
                                  />
                                </label>
                              </div>
                            </div>

                            <div className="pub-form-actions">
                              <button type="submit" className="btn-primary-action">
                                <Check size={14} />
                                <span>Save Award</span>
                              </button>
                              <button
                                type="button"
                                className="btn-secondary-action"
                                onClick={() => setShowAwardForm(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      <h4 className="research-records-heading">Award Records</h4>
                      <div className="erp-table-responsive achievements-table-wrap">
                        <table className="erp-data-table achievements-data-table">
                          <thead>
                            <tr>
                              <th>Academic Year</th>
                              <th>Name of the Award</th>
                              <th>Award Agency</th>
                              <th>Date</th>
                              <th>Uploaded Document</th>
                            </tr>
                          </thead>
                          <tbody>
                            {awardsList.length === 0 ? (
                              <tr>
                                <td colSpan={5}>No award records added yet.</td>
                              </tr>
                            ) : (
                              awardsList.map((award) => (
                                <tr key={award.id}>
                                  <td><strong>{award.academicYear}</strong></td>
                                  <td>{award.awardName}</td>
                                  <td>{award.awardAgency}</td>
                                  <td>{award.date}</td>
                                  <td>{award.documentName || "—"}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 6. WORKSHOPS / FDP ---------------- */}
              {achievementsSubTab === "training" && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Workshops &amp; Faculty Development Programs
                        </h2>
                        <p className="toolbar-subheading">
                          Record workshops and FDPs with their academic year,
                          schedule, duration, and conducting organization
                        </p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() =>
                          setShowTrainingForm((previous) => !previous)
                        }
                      >
                        {showTrainingForm ? <X size={15} /> : <Plus size={15} />}
                        <span>
                          {showTrainingForm
                            ? "Close Form"
                            : "Add Workshop / FDP"}
                        </span>
                      </button>
                    </div>

                    <div className="p-20">
                      {showTrainingForm && (
                        <div className="pub-form-card">
                          <div className="pub-form-header">
                            <div className="pub-form-title-group">
                              <Calendar size={16} className="text-primary" />
                              <div>
                                <h3 className="pub-form-title">
                                  Add Workshop / FDP Details
                                </h3>
                                <p className="pub-form-desc">
                                  Total days are calculated inclusively from
                                  the selected dates
                                </p>
                              </div>
                            </div>
                          </div>

                          <form
                            className="pub-form-body"
                            onSubmit={handleTrainingFormSubmit}
                          >
                            <div className="pub-form-grid training-form-grid">
                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-academic-year"
                                >
                                  Academic Year <span className="req-star">*</span>
                                </label>
                                <select
                                  id="training-academic-year"
                                  name="academicYear"
                                  value={trainingFormData.academicYear}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input pub-form-select"
                                  required
                                >
                                  {ACADEMIC_YEAR_OPTIONS.map((year, index) => (
                                    <option key={year} value={year}>
                                      {year}{index === 0 ? " (Current)" : ""}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-type"
                                >
                                  Workshop / FDP <span className="req-star">*</span>
                                </label>
                                <select
                                  id="training-type"
                                  name="type"
                                  value={trainingFormData.type}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input pub-form-select"
                                  required
                                >
                                  <option value="Workshop">Workshop</option>
                                  <option value="FDP">FDP</option>
                                </select>
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-title"
                                >
                                  Title of Workshop / FDP{" "}
                                  <span className="req-star">*</span>
                                </label>
                                <input
                                  id="training-title"
                                  name="title"
                                  type="text"
                                  value={trainingFormData.title}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-from-date"
                                >
                                  From Date <span className="req-star">*</span>
                                </label>
                                <input
                                  id="training-from-date"
                                  name="fromDate"
                                  type="date"
                                  value={trainingFormData.fromDate}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-to-date"
                                >
                                  To Date <span className="req-star">*</span>
                                </label>
                                <input
                                  id="training-to-date"
                                  name="toDate"
                                  type="date"
                                  value={trainingFormData.toDate}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input"
                                  min={trainingFormData.fromDate || undefined}
                                  required
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-total-days"
                                >
                                  Total Days
                                </label>
                                <input
                                  id="training-total-days"
                                  type="text"
                                  value={
                                    calculateTrainingDays(
                                      trainingFormData.fromDate,
                                      trainingFormData.toDate,
                                    )
                                      ? `${calculateTrainingDays(
                                          trainingFormData.fromDate,
                                          trainingFormData.toDate,
                                        )} day(s)`
                                      : ""
                                  }
                                  className="pub-form-input"
                                  placeholder="Calculated from dates"
                                  readOnly
                                />
                              </div>

                              <div className="pub-form-field">
                                <label
                                  className="pub-field-label"
                                  htmlFor="training-conducted-by"
                                >
                                  Workshop / FDP Conducted By{" "}
                                  <span className="req-star">*</span>
                                </label>
                                <input
                                  id="training-conducted-by"
                                  name="conductedBy"
                                  type="text"
                                  value={trainingFormData.conductedBy}
                                  onChange={handleTrainingFormChange}
                                  className="pub-form-input"
                                  required
                                />
                              </div>
                            </div>

                            <div className="pub-form-actions">
                              <button type="submit" className="btn-primary-action">
                                <Check size={14} />
                                <span>Save Record</span>
                              </button>
                              <button
                                type="button"
                                className="btn-secondary-action"
                                onClick={() => setShowTrainingForm(false)}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      )}

                      <h4 className="research-records-heading">
                        Workshop / FDP Records
                      </h4>
                      <div className="erp-table-responsive achievements-table-wrap">
                        <table className="erp-data-table achievements-data-table">
                          <thead>
                            <tr>
                              <th>Academic Year</th>
                              <th>Type</th>
                              <th>Title</th>
                              <th>From Date</th>
                              <th>To Date</th>
                              <th>Total Days</th>
                              <th>Conducted By</th>
                            </tr>
                          </thead>
                          <tbody>
                            {trainingRecords.length === 0 ? (
                              <tr>
                                <td colSpan={7}>
                                  No workshop or FDP records added yet.
                                </td>
                              </tr>
                            ) : (
                              trainingRecords.map((record) => (
                                <tr key={record.id}>
                                  <td><strong>{record.academicYear}</strong></td>
                                  <td>{record.type}</td>
                                  <td>{record.title}</td>
                                  <td>{record.fromDate}</td>
                                  <td>{record.toDate}</td>
                                  <td>{record.totalDays}</td>
                                  <td>{record.conductedBy}</td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 7. REPORT GENERATION ---------------- */}
              {achievementsSubTab === "reports" && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">
                          Consolidated Research Profile (CRP) Report
                        </h2>
                        <p className="toolbar-subheading">
                          Review achievements across publications, patents,
                          funding, research, awards, workshops, and FDPs
                        </p>
                      </div>
                    </div>

                    <div className="p-20">
                      <div className="crp-report-controls">
                        <div className="pub-form-field crp-report-year-field">
                          <label
                            className="pub-field-label"
                            htmlFor="crp-report-year"
                          >
                            Academic Year
                          </label>
                          <select
                            id="crp-report-year"
                            className="pub-form-input pub-form-select"
                            value={crpReportYear}
                            onChange={(event) =>
                              setCrpReportYear(event.target.value)
                            }
                          >
                            <option value="All">All Academic Years</option>
                            {reportAcademicYears.map((year) => (
                              <option key={year} value={year}>
                                {year}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="crp-report-actions">
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={handleCrpReportCsvExport}
                          >
                            <Download size={14} />
                            <span>Export CSV</span>
                          </button>
                          <button
                            type="button"
                            className="btn-primary-action"
                            onClick={() => window.print()}
                          >
                            <Printer size={14} />
                            <span>Print / Save PDF</span>
                          </button>
                        </div>
                      </div>

                      <section className="crp-report-sheet">
                        <header className="crp-report-heading">
                          <div>
                            <span className="crp-report-kicker">
                              AJIET • Faculty Achievements
                            </span>
                            <h3>Consolidated Research Profile</h3>
                            <p>
                              Academic Year:{" "}
                              <strong>
                                {crpReportYear === "All"
                                  ? "All Years"
                                  : crpReportYear}
                              </strong>
                              {" • "}Generated: {currentDate || "Today"}
                            </p>
                          </div>
                          <div className="crp-report-faculty">
                            <strong>{facultyDisplayName || "Faculty"}</strong>
                            <span>
                              {profileData.department || "Department not provided"}
                            </span>
                            {profileData.facultyId && (
                              <span>Faculty ID: {profileData.facultyId}</span>
                            )}
                          </div>
                        </header>

                        <div className="crp-report-total">
                          <span>Total achievement records</span>
                          <strong>{filteredAchievementReportRecords.length}</strong>
                        </div>

                        <div className="crp-report-summary-grid">
                          {reportCategorySummary.map((summary) => (
                            <div
                              className="crp-report-summary-card"
                              key={summary.category}
                            >
                              <span>{summary.category}</span>
                              <strong>{summary.count}</strong>
                              <small>
                                {summary.count === 1 ? "record" : "records"}
                              </small>
                            </div>
                          ))}
                        </div>

                        <div className="crp-report-table-section">
                          <h4>Achievement Details</h4>
                          <div className="erp-table-responsive crp-report-table-wrap">
                            <table className="erp-data-table achievements-data-table crp-report-table">
                              <thead>
                                <tr>
                                  <th>Academic Year</th>
                                  <th>Category</th>
                                  <th>Title / Record</th>
                                  <th>Details</th>
                                  <th>Date</th>
                                </tr>
                              </thead>
                              <tbody>
                                {filteredAchievementReportRecords.length ===
                                0 ? (
                                  <tr>
                                    <td colSpan={5}>
                                      No achievement records are available for
                                      the selected academic year.
                                    </td>
                                  </tr>
                                ) : (
                                  filteredAchievementReportRecords.map(
                                    (record) => (
                                      <tr key={record.id}>
                                        <td>{record.academicYear || "—"}</td>
                                        <td>{record.category}</td>
                                        <td>{record.title || "—"}</td>
                                        <td>{record.details || "—"}</td>
                                        <td>{record.date || "—"}</td>
                                      </tr>
                                    ),
                                  )
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: EVENT ORGANIZATIONS */}
          {/* ============================================================ */}
          {activeTab === "events" && (
            <div className="erp-tab-content">
              {/* Events Table Container */}
              <div className="erp-card-container">
                <div className="erp-card-toolbar">
                  <div>
                    <h2 className="toolbar-heading">Other Responsibilities</h2>
                    <p className="toolbar-subheading">
                      Academic, technical, cultural and extracurricular
                      activities
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setShowAddEventForm((previous) => !previous)}
                  >
                    {showAddEventForm ? <X size={15} /> : <Plus size={15} />}
                    <span>
                      {showAddEventForm ? "Close Form" : "Register New Event"}
                    </span>
                  </button>
                </div>

                {showAddEventForm && (
                  <div className="pub-form-card">
                    <div className="pub-form-header">
                      <div className="pub-form-title-group">
                        <Plus size={16} className="text-primary" />
                        <div>
                          <h3 className="pub-form-title">Register New Event</h3>
                          <p className="pub-form-desc">
                            Add program, department, attendance and reporting
                            details.
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="pub-form-close-btn"
                        onClick={() => setShowAddEventForm(false)}
                        aria-label="Close form"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <form
                      onSubmit={handleCreateEvent}
                      className="pub-form-body"
                    >
                      <section className="event-form-section">
                        <h4 className="event-form-section-title">
                          Program Details
                        </h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Name of Program{" "}
                              <span className="req-star">*</span>
                            </label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="Enter program name"
                              value={newEvent.title}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  title: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Date <span className="req-star">*</span>
                            </label>
                            <input
                              type="date"
                              className="pub-form-input"
                              value={newEvent.programDate}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  programDate: e.target.value,
                                })
                              }
                              required
                            />
                          </div>

                          <div className="event-form-field event-form-span-2">
                            <label className="pub-field-label">
                              Details of the Resource Person
                            </label>
                            <textarea
                              className="pub-form-input"
                              rows={3}
                              placeholder="Name, designation, organization and contact details"
                              value={newEvent.resourcePersonDetails}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  resourcePersonDetails: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">
                          Departments
                        </h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Organizing Department{" "}
                              <span className="req-star">*</span>
                            </label>
                            <select
                              className="pub-form-input pub-form-select"
                              value={newEvent.organizingDepartment}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  organizingDepartment: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                  {department}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Associated Department{" "}
                              <span className="req-star">*</span>
                            </label>
                            <select
                              className="pub-form-input pub-form-select"
                              value={newEvent.associatedDepartment}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  associatedDepartment: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>
                                  {department}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">
                          Number of Participants
                        </h4>
                        <div className="event-participants-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Student Count
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.studentCount}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  studentCount: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Faculty Count
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.facultyCount}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  facultyCount: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              External Participant Count
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.externalParticipantCount}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  externalParticipantCount: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">
                          Program Outcomes &amp; Follow-up
                        </h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">
                              PO Mapping
                            </label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="e.g. PO1, PO3, PO5"
                              value={newEvent.poMapping}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  poMapping: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Coordinators
                            </label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="Coordinator names"
                              value={newEvent.coordinators}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  coordinators: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Expenditure
                            </label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="pub-form-input"
                              value={newEvent.expenditure}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  expenditure: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">
                              Social Media Link
                            </label>
                            <input
                              type="url"
                              className="pub-form-input"
                              placeholder="https://..."
                              value={newEvent.socialMediaLink}
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  socialMediaLink: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="event-form-field event-form-span-2">
                            <label className="pub-field-label">
                              Upload Report
                            </label>
                            <input
                              type="file"
                              className="pub-form-input"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) =>
                                setNewEvent({
                                  ...newEvent,
                                  reportFile: e.target.files?.[0] || null,
                                })
                              }
                            />
                            {newEvent.reportFile && (
                              <span>{newEvent.reportFile.name}</span>
                            )}
                          </div>
                        </div>
                      </section>

                      <div className="pub-form-actions">
                        <button
                          type="button"
                          className="btn-secondary-action"
                          onClick={() => setShowAddEventForm(false)}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn-primary-action">
                          Save Event Record
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Filters */}
                <div className="filter-search-toolbar">
                  <div className="toolbar-filter-group">
                    <label className="event-filter-field">
                      Academic Year
                      <select
                        className="event-filter-select"
                        aria-label="Filter by academic year"
                        value={eventAcademicYearFilter}
                        onChange={(e) =>
                          setEventAcademicYearFilter(e.target.value)
                        }
                      >
                        <option value="All">All Academic Years</option>
                        {ACADEMIC_YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="event-filter-field">
                      Type of Event
                      <select
                        className="event-filter-select"
                        aria-label="Filter by event type"
                        value={eventFilter}
                        onChange={(e) => setEventFilter(e.target.value)}
                      >
                        <option value="All">All Event Types</option>
                        {EVENT_TYPE_OPTIONS.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>

                {/* Responsive Events Table */}
                <div className="erp-table-responsive">
                  <table className="erp-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>#</th>
                        <th>Program Name</th>
                        <th style={{ width: "150px" }}>Type of Event</th>
                        <th style={{ width: "110px" }}>Academic Year</th>
                        <th style={{ width: "120px" }}>Program Date</th>
                        <th style={{ width: "120px" }}>Participants</th>
                        <th style={{ width: "90px" }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length ? (
                        filteredEvents.map((ev, idx) => (
                          <tr key={ev.id}>
                            <td className="cell-idx">{idx + 1}</td>
                            <td>
                              <strong
                                style={{
                                  color: "var(--faculty-text-main)",
                                  fontSize: "0.88rem",
                                }}
                              >
                                {ev.title}
                              </strong>
                            </td>
                            <td>
                              <span className="erp-code-pill">
                                {ev.category}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{ fontWeight: 600, color: "#334155" }}
                              >
                                {ev.academicYear}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{
                                  fontSize: "0.8rem",
                                  color: "#475569",
                                  fontWeight: 600,
                                }}
                              >
                                {ev.dates}
                              </span>
                            </td>
                            <td>
                              <span className="erp-credit-badge">
                                {ev.participants}
                              </span>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn-secondary-action"
                                aria-label={`View ${ev.title} details`}
                                onClick={() => setEventViewRecord(ev)}
                              >
                                <Eye size={14} />
                                <span>View</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="7"
                            style={{
                              textAlign: "center",
                              color: "#64748b",
                              padding: "1.25rem",
                            }}
                          >
                            No events match the selected filters.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="erp-card-footer">
                  <div className="footer-info-strip">
                    <ShieldCheck size={16} />
                    <span>
                      Program records support institutional reporting and
                      accreditation documentation.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 4: SUBJECT DETAILS */}
          {/* ============================================================ */}
          {activeTab === "courses" && (
            <section className="erp-card-container subject-handling-card">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Subject Details</h2>
                  <p className="toolbar-subheading">
                    Select an academic year, semester and subject to view
                    attendance or IA marks.
                  </p>
                </div>
              </div>

              <div className="subject-handling-content">
                {loading && (
                  <div className="subject-empty-state" role="status">
                    Loading subjects assigned by the HOD...
                  </div>
                )}
                {!loading && assignedSubjectsError && (
                  <div className="subject-empty-state" role="alert">
                    {assignedSubjectsError}
                  </div>
                )}
                {!loading &&
                  !assignedSubjectsError &&
                  assignedSubjects.length === 0 && (
                    <div className="subject-empty-state" role="status">
                      No subjects have been assigned to your faculty account by the HOD.
                    </div>
                  )}
                <div className="subject-selection-grid">
                  <div className="pub-form-field">
                    <label
                      className="pub-field-label"
                      htmlFor="subject-academic-year"
                    >
                      Academic Year
                    </label>
                    <select
                      id="subject-academic-year"
                      className="pub-form-input pub-form-select"
                      value={subjectAcademicYear}
                      disabled={loading || Boolean(assignedSubjectsError) || availableSubjectYears.length === 0}
                      onChange={(event) => {
                        const academicYear = event.target.value;
                        setSubjectAcademicYear(academicYear);
                        setSubjectSemester("");
                        setSelectedSubjectId("");
                        setSubjectAssessmentTab("attendance");
                        setSubjectFormStatus("");
                        setIaExcelFileName("");
                      }}
                    >
                      <option value="">Select academic year</option>
                      {availableSubjectYears.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label
                      className="pub-field-label"
                      htmlFor="subject-semester"
                    >
                      Semester
                    </label>
                    <select
                      id="subject-semester"
                      className="pub-form-input pub-form-select"
                      value={subjectSemester}
                      disabled={
                        loading ||
                        Boolean(assignedSubjectsError) ||
                        !subjectAcademicYear
                      }
                      onChange={(event) => {
                        setSubjectSemester(event.target.value);
                        setSelectedSubjectId("");
                        setSubjectAssessmentTab("attendance");
                        setSubjectFormStatus("");
                        setIaExcelFileName("");
                      }}
                    >
                      <option value="">Select semester</option>
                      {availableSubjectSemesters.map((semester) => (
                        <option key={semester} value={semester}>
                          Semester {semester}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label
                      className="pub-field-label"
                      htmlFor="subject-selection"
                    >
                      Subject
                    </label>
                    <select
                      id="subject-selection"
                      className="pub-form-input pub-form-select"
                      value={selectedSubjectId}
                      disabled={
                        loading ||
                        Boolean(assignedSubjectsError) ||
                        !subjectSemester
                      }
                      onChange={(event) => {
                        setSelectedSubjectId(event.target.value);
                        setSubjectAssessmentTab("attendance");
                        setSubjectFormStatus("");
                        setIaExcelFileName("");
                      }}
                    >
                      <option value="">Select subject</option>
                      {availableSubjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name} ({subject.section})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {selectedSubject ? (
                  <div className="subject-assessment-panel">
                    <div className="subject-selected-summary">
                      <div>
                        <span>Subject Code</span>
                        <strong>{selectedSubject.code}</strong>
                      </div>
                      <div>
                        <span>Subject Name</span>
                        <strong>{selectedSubject.name}</strong>
                      </div>
                      <div>
                        <span>Semester</span>
                        <strong>Semester {selectedSubject.semester}</strong>
                      </div>
                      <div>
                        <span>Section</span>
                        <strong>{selectedSubject.section || "—"}</strong>
                      </div>
                      <div>
                        <span>Academic Year</span>
                        <strong>{selectedSubject.academic_year || "—"}</strong>
                      </div>
                      <div>
                        <span>Category</span>
                        <strong>{selectedSubjectCategory || "—"}</strong>
                      </div>
                      <div>
                        <span>Credits</span>
                        <strong>{selectedSubjectCredits ?? "—"}</strong>
                      </div>
                      <div>
                        <span>Teaching Hours</span>
                        <strong>{selectedSubjectTeachingHours ?? "—"}</strong>
                      </div>
                      <div>
                        <span>Curriculum Scheme</span>
                        <strong>{selectedSubject.scheme_year ?? "—"}</strong>
                      </div>
                    </div>

                    <div
                      className="subject-assessment-tabs"
                      role="tablist"
                      aria-label="Subject assessment view"
                    >
                      <button
                        type="button"
                        role="tab"
                        aria-selected={subjectAssessmentTab === "attendance"}
                        className={
                          subjectAssessmentTab === "attendance" ? "active" : ""
                        }
                        onClick={() => setSubjectAssessmentTab("attendance")}
                      >
                        Attendance & Delivery Report
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={subjectAssessmentTab === "ia"}
                        className={
                          subjectAssessmentTab === "ia" ? "active" : ""
                        }
                        onClick={() => setSubjectAssessmentTab("ia")}
                      >
                        IA Marks
                      </button>
                    </div>
                    {subjectAssessmentTab === "attendance" ? (
                      <form
                        className="daily-entry-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          setSubjectFormStatus(
                            "Attendance and daily delivery report submitted for review.",
                          );
                        }}
                      >
                        <section className="subject-entry-section">
                          <div className="subject-entry-heading">
                            <div>
                              <span className="subject-entry-kicker">Daily Attendance</span>
                              <h3>Student Attendance</h3>
                            </div>
                          </div>
                          <div className="attendance-selection-grid">
                            <label>
                              Date
                              <input
                                type="date"
                                value={attendanceDate}
                                onChange={(event) =>
                                  setAttendanceDate(event.target.value)
                                }
                              />
                            </label>
                            <label>
                              Time
                              <select
                                value={attendanceTime}
                                onChange={(event) => {
                                  const period = CLASS_SCHEDULE.find(
                                    (item) => item.time === event.target.value,
                                  );
                                  setAttendanceTime(event.target.value);
                                  if (period) setAttendancePeriod(period.classNo);
                                }}
                              >
                                {CLASS_SCHEDULE.map((period) => (
                                  <option
                                    key={period.classNo}
                                    value={period.time}
                                  >
                                    {period.time}
                                  </option>
                                ))}
                              </select>
                            </label>
                            <label>
                              Period
                              <select
                                value={attendancePeriod}
                                onChange={(event) => {
                                  const period = Number(event.target.value);
                                  setAttendancePeriod(period);
                                  setAttendanceTime(
                                    CLASS_SCHEDULE[period - 1].time,
                                  );
                                }}
                              >
                                {CLASS_SCHEDULE.map((period) => (
                                  <option
                                    key={period.classNo}
                                    value={period.classNo}
                                  >
                                    Period {period.classNo}
                                  </option>
                                ))}
                              </select>
                            </label>
                          </div>
                          <div className="erp-table-responsive">
                            <table className="erp-data-table daily-attendance-table">
                              <thead>
                                <tr>
                                  <th>Sl. No.</th>
                                  <th>USN</th>
                                  <th>Student Name</th>
                                  <th>
                                    Period {attendancePeriod}
                                    <small>{attendanceTime}</small>
                                    <small>
                                      {new Date(
                                        `${attendanceDate}T00:00:00`,
                                      ).toLocaleDateString("en-IN")}
                                    </small>
                                    <small>P / A</small>
                                  </th>
                                  <th>Attendance %</th>
                                </tr>
                              </thead>
                              <tbody>
                                {subjectRosterLoading ? (
                                  <tr>
                                    <td colSpan="5">Loading enrolled students...</td>
                                  </tr>
                                ) : subjectRosterError ? (
                                  <tr>
                                    <td colSpan="5">{subjectRosterError}</td>
                                  </tr>
                                ) : subjectRoster.length === 0 ? (
                                  <tr>
                                    <td colSpan="5">
                                      No students are enrolled in this subject for the selected semester and section.
                                    </td>
                                  </tr>
                                ) : subjectRoster.map((record, index) => {
                                  const attendanceKey = `${selectedSubject.id}-${attendanceDate}-${record.studentId}`;
                                  const statuses =
                                    dailyAttendanceStatus[attendanceKey] ||
                                    ["P", "P", "P", "P", "P", "P"];
                                  const presentCount = statuses.filter(
                                    (status) => status === "P",
                                  ).length;
                                  const selectedStatus =
                                    statuses[attendancePeriod - 1] || "P";
                                  return (
                                    <tr key={record.studentId}>
                                      <td>{index + 1}</td>
                                      <td className="cell-code">{record.studentId}</td>
                                      <td>{record.studentName}</td>
                                      <td>
                                        <button
                                          type="button"
                                          className={`attendance-mark-button ${
                                            selectedStatus === "P"
                                              ? "present"
                                              : "absent"
                                          }`}
                                          title="Click to toggle Present / Absent"
                                          onClick={() =>
                                            setDailyAttendanceStatus((current) => ({
                                              ...current,
                                                [attendanceKey]: (
                                                  current[attendanceKey] || [
                                                  "P",
                                                  "P",
                                                  "P",
                                                  "P",
                                                  "P",
                                                  "P",
                                                ]
                                              ).map((value, periodIndex) =>
                                                periodIndex === attendancePeriod - 1
                                                  ? value === "P"
                                                    ? "A"
                                                    : "P"
                                                  : value,
                                              ),
                                            }))
                                          }
                                        >
                                          {selectedStatus}
                                        </button>
                                      </td>
                                      <td>
                                        <strong className="attendance-percent">
                                          {((presentCount / CLASS_SCHEDULE.length) * 100).toFixed(1)}%
                                        </strong>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </section>

                        <section className="subject-entry-section lesson-entry-section">
                          <div className="subject-entry-heading">
                            <div>
                              <span className="subject-entry-kicker">Lesson Plan Execution</span>
                              <h3>Daily Delivery Report</h3>
                            </div>
                            <span className="delivery-period-pill">
                              Period {attendancePeriod} · {attendanceTime}
                            </span>
                          </div>
                          <div className="lesson-plan-grid">
                            {[lessonExecution[attendancePeriod - 1]].map((lesson) => {
                              const index = attendancePeriod - 1;
                              return (
                              <article className="lesson-plan-card" key={index}>
                                <div className="lesson-card-header">
                                  <strong>Class {index + 1}</strong>
                                  <span>{CLASS_SCHEDULE[index].time}</span>
                                </div>
                                <div className="lesson-approved-plan">
                                  <span>Planned topic</span>
                                  <strong>{lesson.plannedTopic}</strong>
                                  <small>Approved lesson plan: Unit {index + 1}</small>
                                </div>
                                <div className="lesson-entry-fields">
                                <label>
                                  Actual topic covered
                                  <input
                                    type="text"
                                    value={lesson.actualTopic}
                                    placeholder="Enter topic covered"
                                    onChange={(event) =>
                                      setLessonExecution((current) =>
                                        current.map((item, itemIndex) =>
                                          itemIndex === index
                                            ? { ...item, actualTopic: event.target.value }
                                            : item,
                                        ),
                                      )
                                    }
                                  />
                                </label>
                                <label>
                                  Execution status
                                  <select
                                    value={lesson.status}
                                    onChange={(event) =>
                                      setLessonExecution((current) =>
                                        current.map((item, itemIndex) =>
                                          itemIndex === index
                                            ? { ...item, status: event.target.value }
                                            : item,
                                        ),
                                      )
                                    }
                                  >
                                    <option value="">Select status</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Partial">Partial</option>
                                    <option value="Not Covered">Not Covered</option>
                                  </select>
                                </label>
                                <label>
                                  Execution remarks
                                  <textarea
                                    rows="2"
                                    value={lesson.remarks}
                                    placeholder="Add remarks"
                                    onChange={(event) =>
                                      setLessonExecution((current) =>
                                        current.map((item, itemIndex) =>
                                          itemIndex === index
                                            ? { ...item, remarks: event.target.value }
                                            : item,
                                        ),
                                      )
                                    }
                                  />
                                </label>
                                </div>
                              </article>
                              );
                            })}
                          </div>
                        </section>

                        {subjectFormStatus && (
                          <div className="subject-submit-status" role="status">
                            <CheckCircle2 size={16} />
                            {subjectFormStatus}
                          </div>
                        )}
                        <div className="subject-form-actions">
                          <button type="submit" className="subject-submit-button">
                            <Check size={17} />
                            Submit Attendance & Delivery Report
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form
                        className="ia-entry-form"
                        onSubmit={(event) => {
                          event.preventDefault();
                          handleIaMarksSubmit();
                        }}
                      >
                        <section className="subject-entry-section ia-entry-section">
                          <div className="subject-entry-heading">
                            <div>
                              <span className="subject-entry-kicker">Internal Assessment</span>
                              <h3>IA Marks Entry</h3>
                            </div>
                            <span className="delivery-period-pill">Maximum marks enforced</span>
                          </div>
                          <div className="ia-upload-toolbar">
                            <div className="ia-upload-copy">
                              <strong>Upload Excel Marks</strong>
                              <span>
                                Upload .xlsx, .xls or .csv using USN as the matching
                                field.
                              </span>
                            </div>
                            <div className="ia-upload-actions">
                              <button
                                type="button"
                                className="btn-secondary-action"
                                onClick={handleDownloadIaTemplate}
                                disabled={subjectRosterLoading || subjectRoster.length === 0}
                              >
                                <Download size={14} />
                                <span>Download Template</span>
                              </button>
                              <label
                                className="ia-upload-button"
                                htmlFor="ia-marks-excel"
                              >
                                <Upload size={14} />
                                <span>Upload Excel</span>
                              </label>
                              <input
                                id="ia-marks-excel"
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                disabled={subjectRosterLoading || subjectRoster.length === 0}
                                onChange={handleIaExcelUpload}
                              />
                            </div>
                            {iaExcelFileName && (
                              <p className="ia-upload-file">
                                Imported file: <strong>{iaExcelFileName}</strong>
                              </p>
                            )}
                          </div>
                          <div className="erp-table-responsive">
                            <table className="erp-data-table ia-marks-table">
                              <thead>
                                <tr>
                                  <th>Sl. No.</th>
                                  <th>USN</th>
                                  <th>Student Name</th>
                                  <th>IA1 <small>/25</small></th>
                                  <th>IA2 <small>/25</small></th>
                                  <th>Task 1 <small>/10</small></th>
                                  <th>Task 2 <small>/10</small></th>
                                  <th>Final IA <small>/25</small></th>
                                </tr>
                              </thead>
                              <tbody>
                                {subjectRosterLoading ? (
                                  <tr>
                                    <td colSpan="8">Loading enrolled students...</td>
                                  </tr>
                                ) : subjectRosterError ? (
                                  <tr>
                                    <td colSpan="8">{subjectRosterError}</td>
                                  </tr>
                                ) : subjectRoster.length === 0 ? (
                                  <tr>
                                    <td colSpan="8">
                                      No students are enrolled in this subject for the selected semester and section.
                                    </td>
                                  </tr>
                                ) : subjectRoster.map((record, index) => {
                                  const draftKey = `${selectedSubject.id}-${record.studentId}`;
                                  const draft = iaMarksDraft[draftKey] || {
                                    ia1: "",
                                    ia2: "",
                                    task1: "",
                                    task2: "",
                                    finalIa: "",
                                  };
                                  const updateIa = (field, value, maximum) => {
                                    const numericValue = value === "" ? "" : Math.max(0, Math.min(Number(value), maximum));
                                    setIaMarksDraft((current) => ({
                                      ...current,
                                      [draftKey]: {
                                        ...draft,
                                        [field]: numericValue,
                                      },
                                    }));
                                  };
                                  return (
                                    <tr key={record.studentId}>
                                      <td>{index + 1}</td>
                                      <td className="cell-code">{record.studentId}</td>
                                      <td>{record.studentName}</td>
                                      {[
                                        ["ia1", "IA1", 25],
                                        ["ia2", "IA2", 25],
                                        ["task1", "Task 1", 10],
                                        ["task2", "Task 2", 10],
                                        ["finalIa", "Final IA", 25],
                                      ].map(([field, label, maximum]) => (
                                        <td key={field}>
                                          <input
                                            className="ia-mark-input"
                                            type="number"
                                            min="0"
                                            max={maximum}
                                            aria-label={`${label} marks for ${record.studentName}`}
                                            value={draft[field]}
                                            onChange={(event) =>
                                              updateIa(field, event.target.value, maximum)
                                            }
                                          />
                                        </td>
                                      ))}
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </section>
                        {subjectFormStatus && (
                          <div className="subject-submit-status" role="status">
                            <CheckCircle2 size={16} />
                            {subjectFormStatus}
                          </div>
                        )}
                        <div className="subject-form-actions">
                          <button
                            type="submit"
                            className="subject-submit-button"
                            disabled={subjectRosterLoading || subjectRoster.length === 0 || Boolean(subjectRosterError)}
                          >
                            <Check size={17} />
                            Submit IA Marks
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="subject-empty-state" role="status">
                    Select a subject to view its attendance and IA marks.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === "timetable" && (
            <section className="erp-card-container timetable-card">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Time Table</h2>
                  <p className="toolbar-subheading">
                    Select an academic year and semester to upload or view its
                    timetable.
                  </p>
                </div>
              </div>

              <div className="timetable-form">
                <div className="timetable-controls">
                  <div className="pub-form-field">
                    <label
                      className="pub-field-label"
                      htmlFor="timetable-academic-year"
                    >
                      Academic Year
                    </label>
                    <select
                      id="timetable-academic-year"
                      className="pub-form-input pub-form-select"
                      value={timetableAcademicYear}
                      onChange={(event) =>
                        setTimetableAcademicYear(event.target.value)
                      }
                    >
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label
                      className="pub-field-label"
                      htmlFor="timetable-semester"
                    >
                      Semester
                    </label>
                    <select
                      id="timetable-semester"
                      className="pub-form-input pub-form-select"
                      value={timetableSemester}
                      onChange={(event) =>
                        setTimetableSemester(event.target.value)
                      }
                    >
                      <option value="Odd">Odd</option>
                      <option value="Even">Even</option>
                    </select>
                  </div>

                  <div className="pub-form-field timetable-upload-field">
                    <label className="pub-field-label" htmlFor="timetable-file">
                      Upload Time Table
                    </label>
                    <input
                      id="timetable-file"
                      className="pub-form-input"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={handleTimetableUpload}
                    />
                  </div>
                </div>

                <div className="timetable-actions">
                  <p className="timetable-file-status" aria-live="polite">
                    {selectedTimetableFile
                      ? `Uploaded: ${selectedTimetableFile.name}`
                      : "No timetable uploaded for this academic year and semester."}
                    {isTimetableSubmitted && (
                      <span className="timetable-submitted-status">
                        Submitted
                      </span>
                    )}
                  </p>
                  <div className="timetable-action-buttons">
                    <button
                      type="button"
                      className="btn-secondary-action"
                      onClick={handleViewTimetable}
                      disabled={!selectedTimetableFile}
                    >
                      <Eye size={14} />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      className="btn-primary-action"
                      onClick={handleSubmitTimetable}
                      disabled={!selectedTimetableFile || isTimetableSubmitted}
                    >
                      <Check size={14} />
                      <span>
                        {isTimetableSubmitted ? "Submitted" : "Submit"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "message" && (
            <section className="erp-card-container faculty-message-page">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Message Students</h2>
                  <p className="toolbar-subheading">
                    Message students matching their registered academic year,
                    semester, and section.
                  </p>
                </div>
              </div>

              <div className="message-page-content">
                <form className="message-composer" onSubmit={handleSendMessage}>
                  <div className="message-section-heading">
                    <h3>Recipients</h3>
                    <span>
                      Select a class first. Students are limited to your
                      assigned department and section.
                    </span>
                  </div>

                  <div className="message-cohort-filters">
                    <div className="pub-form-field">
                      <label
                        className="pub-field-label"
                        htmlFor="message-academic-year"
                      >
                        Academic Year
                      </label>
                      <select
                        id="message-academic-year"
                        className="pub-form-input pub-form-select"
                        value={messageAcademicYear}
                        disabled={loading || availableMessageYears.length === 0}
                        onChange={(event) => {
                          setMessageAcademicYear(event.target.value);
                          setMessageSemester("");
                          setMessageSection("");
                          setSelectedMessageUsns([]);
                        }}
                      >
                        <option value="">Select academic year</option>
                        {availableMessageYears.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pub-form-field">
                      <label
                        className="pub-field-label"
                        htmlFor="message-semester"
                      >
                        Semester
                      </label>
                      <select
                        id="message-semester"
                        className="pub-form-input pub-form-select"
                        value={messageSemester}
                        disabled={!messageAcademicYear}
                        onChange={(event) => {
                          setMessageSemester(event.target.value);
                          setMessageSection("");
                          setSelectedMessageUsns([]);
                        }}
                      >
                        <option value="">Select semester</option>
                        {availableMessageSemesters.map((semester) => (
                          <option key={semester} value={semester}>
                            Semester {semester}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="pub-form-field">
                      <label
                        className="pub-field-label"
                        htmlFor="message-section"
                      >
                        Section
                      </label>
                      <select
                        id="message-section"
                        className="pub-form-input pub-form-select"
                        value={messageSection}
                        disabled={!messageSemester}
                        onChange={(event) => {
                          setMessageSection(event.target.value);
                          setSelectedMessageUsns([]);
                        }}
                      >
                        <option value="">Select section</option>
                        {availableMessageSections.map((section) => (
                          <option key={section} value={section}>
                            {section}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {messageStudentsLoading && (
                    <p className="message-student-status" role="status">
                      Loading students for the selected class...
                    </p>
                  )}
                  {assignedSubjectsError && (
                    <p className="message-student-status error" role="alert">
                      {assignedSubjectsError}
                    </p>
                  )}
                  {!loading &&
                    !assignedSubjectsError &&
                    availableMessageYears.length === 0 && (
                      <p className="message-student-status" role="status">
                        No subject assignments are available for this faculty
                        account.
                      </p>
                    )}
                  {messageStudentsError && (
                    <p className="message-student-status error" role="alert">
                      {messageStudentsError}
                    </p>
                  )}
                  {!messageStudentsLoading &&
                    !messageStudentsError &&
                    messageAcademicYear &&
                    messageSemester &&
                    messageSection && (
                      <p className="message-student-status" role="status">
                        {messageStudents.length
                          ? `${messageStudents.length} matching student${messageStudents.length === 1 ? "" : "s"} found.`
                          : "No registered students match this academic year, semester, section, and department."}
                      </p>
                    )}

                  <div className="message-recipient-modes">
                    <label
                      className={`message-recipient-mode ${messageRecipientMode === "all" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="message-recipient-mode"
                        value="all"
                        checked={messageRecipientMode === "all"}
                        onChange={() => setMessageRecipientMode("all")}
                      />
                      <span>
                        <strong>All Students in Selected Section</strong>
                        <small>
                          Send to every registered student matching the filters
                        </small>
                      </span>
                    </label>

                    <label
                      className={`message-recipient-mode ${messageRecipientMode === "selected" ? "active" : ""}`}
                    >
                      <input
                        type="radio"
                        name="message-recipient-mode"
                        value="selected"
                        checked={messageRecipientMode === "selected"}
                        onChange={() => setMessageRecipientMode("selected")}
                      />
                      <span>
                        <strong>Select Specific USNs</strong>
                        <small>Choose individual matching students</small>
                      </span>
                    </label>
                  </div>

                  {messageRecipientMode === "selected" && (
                    <div className="message-usn-picker">
                      <div className="message-section-heading">
                        <h3>Student USNs</h3>
                        <span>
                          {selectedMessageUsns.length} of {messageStudents.length}{" "}
                          selected
                        </span>
                      </div>
                      <div className="message-recipient-selection-actions">
                        <button
                          type="button"
                          className="btn-secondary-action"
                          disabled={messageStudents.length === 0}
                          onClick={() =>
                            setSelectedMessageUsns(
                              messageStudents.map((student) => student.studentId),
                            )
                          }
                        >
                          Select All Matching
                        </button>
                        <button
                          type="button"
                          className="btn-secondary-action"
                          disabled={selectedMessageUsns.length === 0}
                          onClick={() => setSelectedMessageUsns([])}
                        >
                          Clear Selection
                        </button>
                      </div>
                      {selectedMessageUsns.length > 0 && (
                        <div className="message-selected-usns">
                          {selectedMessageUsns.map((usn) => (
                            <span className="message-selected-usn" key={usn}>
                              {usn}
                              <button
                                type="button"
                                aria-label={`Remove ${usn}`}
                                onClick={() =>
                                  setSelectedMessageUsns((previous) =>
                                    previous.filter(
                                      (selectedUsn) => selectedUsn !== usn,
                                    ),
                                  )
                                }
                              >
                                <span aria-hidden="true">×</span>
                              </button>
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="message-usn-dropdown">
                        <input
                          type="search"
                          className="pub-form-input"
                          disabled={
                            messageStudentsLoading || messageStudents.length === 0
                          }
                          role="combobox"
                          aria-label="Search student USN"
                          aria-autocomplete="list"
                          aria-expanded={isMessageUsnDropdownOpen}
                          aria-controls="faculty-message-usn-options"
                          placeholder="Search USN or student name"
                          value={messageUsnQuery}
                          onFocus={() => setIsMessageUsnDropdownOpen(true)}
                          onBlur={() => setIsMessageUsnDropdownOpen(false)}
                          onChange={(event) =>
                            setMessageUsnQuery(event.target.value)
                          }
                          onKeyDown={(event) => {
                            if (event.key === "Escape")
                              setIsMessageUsnDropdownOpen(false);
                          }}
                        />
                        {isMessageUsnDropdownOpen && (
                          <div
                            className="message-usn-options"
                            id="faculty-message-usn-options"
                            role="listbox"
                            aria-label="Available student USNs"
                          >
                            {filteredMessageUsns.length > 0 ? (
                              filteredMessageUsns.map((student) => (
                                <button
                                  type="button"
                                  className="message-usn-option"
                                  role="option"
                                  aria-selected="false"
                                  key={student.studentId}
                                  onMouseDown={(event) =>
                                    event.preventDefault()
                                  }
                                  onClick={() => {
                                    setSelectedMessageUsns((previous) => [
                                      ...previous,
                                      student.studentId,
                                    ]);
                                    setMessageUsnQuery("");
                                  }}
                                >
                                  {student.studentId} — {student.studentName}
                                </button>
                              ))
                            ) : (
                              <p className="message-usn-no-results">
                                No matching USNs found.
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="message-composer-fields">
                    <div className="pub-form-field">
                      <label
                        className="pub-field-label"
                        htmlFor="faculty-message-subject"
                      >
                        Subject (optional)
                      </label>
                      <input
                        id="faculty-message-subject"
                        type="text"
                        className="pub-form-input"
                        value={messageSubject}
                        onChange={(event) =>
                          setMessageSubject(event.target.value)
                        }
                        placeholder="Enter a subject"
                      />
                    </div>

                    <div className="pub-form-field">
                      <label
                        className="pub-field-label"
                        htmlFor="faculty-message-body"
                      >
                        Message
                      </label>
                      <textarea
                        id="faculty-message-body"
                        className="pub-form-input"
                        rows={6}
                        required
                        value={messageBody}
                        onChange={(event) => setMessageBody(event.target.value)}
                        placeholder="Type your message to students..."
                      />
                    </div>
                  </div>

                  <div className="message-composer-actions">
                    <span>
                      Messages are sent through the AJIET ERP database.
                    </span>
                    <button type="submit" className="btn-primary-action">
                      <Mail size={15} />
                      <span>Send Message</span>
                    </button>
                  </div>
                </form>

                <section className="message-history">
                  <div className="message-section-heading">
                    <h3>Sent Messages</h3>
                    <span>{sentMessages.length}</span>
                  </div>
                  {sentMessages.length ? (
                    <div className="message-history-list">
                      {sentMessages.map((message) => (
                        <article
                          className="message-history-item"
                          key={message.id}
                        >
                          <div className="message-history-meta">
                            <strong>
                              {message.recipientMode === "all"
                                ? "All Students"
                                : `${message.recipients.length} recipient${message.recipients.length === 1 ? "" : "s"}`}
                            </strong>
                            <time>{message.sentAt}</time>
                          </div>
                          {message.subject && <h4>{message.subject}</h4>}
                          <p>{message.body}</p>
                          {message.recipientMode === "selected" && (
                            <div className="message-history-usns">
                              {message.recipients.join(", ")}
                            </div>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="message-history-empty">
                      No messages have been composed yet.
                    </p>
                  )}
                </section>
              </div>
            </section>
          )}

          {activeTab === "leave" && (
            <section className="erp-card-container" aria-live="polite">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Leave Apply</h2>
                  <p className="toolbar-subheading">
                    Submit a leave request for HOD approval.
                  </p>
                </div>
              </div>
              <div className="leave-apply-layout">
                <form className="leave-apply-form" onSubmit={handleLeaveSubmit}>
                  <div className="leave-form-grid">
                    <label>
                      Leave Type
                      <select
                        name="leaveType"
                        value={leaveForm.leaveType}
                        onChange={handleLeaveFieldChange}
                      >
                        <option>Casual Leave</option>
                        <option>Sick Leave</option>
                        <option>Earned Leave</option>
                        <option>Duty Leave</option>
                        <option>On Duty</option>
                      </select>
                    </label>
                    <label>
                      From Date
                      <input
                        type="date"
                        name="fromDate"
                        value={leaveForm.fromDate}
                        onChange={handleLeaveFieldChange}
                        required
                      />
                    </label>
                    <label>
                      To Date
                      <input
                        type="date"
                        name="toDate"
                        value={leaveForm.toDate}
                        min={leaveForm.fromDate || undefined}
                        onChange={handleLeaveFieldChange}
                        required
                      />
                    </label>
                  </div>
                  <label>
                    Reason
                    <textarea
                      name="reason"
                      rows="4"
                      value={leaveForm.reason}
                      onChange={handleLeaveFieldChange}
                      placeholder="Enter reason for leave"
                      required
                    />
                  </label>
                  <label>
                    Alternate Arrangement
                    <input
                      name="alternateArrangement"
                      value={leaveForm.alternateArrangement}
                      onChange={handleLeaveFieldChange}
                      placeholder="Name of alternate faculty or arrangement"
                    />
                  </label>
                  <div className="leave-form-actions">
                    <button type="submit" className="subject-submit-button">
                      <Check size={16} />
                      Submit Leave Request
                    </button>
                  </div>
                </form>

                <aside className="leave-history-card">
                  <h3>Recent Requests</h3>
                  {leaveHistory.length === 0 ? (
                    <p className="leave-history-empty">No leave requests submitted.</p>
                  ) : (
                    leaveHistory
                      .filter(
                        (item) =>
                          item.facultyId === profileData.facultyId ||
                          item.facultyName === facultyDisplayName,
                      )
                      .slice(0, 5)
                      .map((item) => (
                        <div className="leave-history-item" key={item.id}>
                          <div>
                            <strong>{item.leaveType}</strong>
                            <span>
                              {item.fromDate} to {item.toDate}
                            </span>
                          </div>
                          <span className={`leave-status status-${item.status.toLowerCase()}`}>
                            {item.status}
                          </span>
                        </div>
                      ))
                  )}
                </aside>
              </div>
            </section>
          )}
        </main>
      </div>

      {eventViewRecord && (
        <div className="faculty-modal-overlay" role="dialog" aria-modal="true">
          <div className="faculty-modal-card achievement-details-modal">
            <div className="modal-header-bar">
              <h3>Program Details</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEventViewRecord(null)}
                aria-label="Close program details"
              >
                <X size={18} />
              </button>
            </div>
            <div className="achievement-details-grid">
              {[
                ["Name of Program", eventViewRecord.title],
                ["Academic Year", eventViewRecord.academicYear],
                ["Type of Event", eventViewRecord.category],
                ["Program Date", eventViewRecord.dates],
                [
                  "Details of the Resource Person",
                  eventViewRecord.resourcePersonDetails,
                ],
                [
                  "Organizing Department",
                  eventViewRecord.organizingDepartment ||
                    eventViewRecord.sponsor,
                ],
                ["Associated Department", eventViewRecord.associatedDepartment],
                ["Student Count", eventViewRecord.studentCount],
                ["Faculty Count", eventViewRecord.facultyCount],
                [
                  "External Participant Count",
                  eventViewRecord.externalParticipantCount,
                ],
                ["Total Participants", eventViewRecord.participants],
                ["PO Mapping", eventViewRecord.poMapping],
                [
                  "Coordinators",
                  eventViewRecord.coordinators || eventViewRecord.role,
                ],
                [
                  "Expenditure",
                  eventViewRecord.expenditure || eventViewRecord.grant,
                ],
                ["Social Media Link", eventViewRecord.socialMediaLink],
                ["Uploaded Report", eventViewRecord.reportFileName],
                ["Status", eventViewRecord.status],
              ].map(([label, value]) => (
                <div className="achievement-detail-item" key={label}>
                  <span>{label}</span>
                  {label === "Uploaded Report" && eventViewRecord.reportFile ? (
                    <button
                      type="button"
                      className="btn-secondary-action"
                      onClick={handleViewEventReport}
                    >
                      <Eye size={14} />
                      <span>View Report</span>
                    </button>
                  ) : label === "Social Media Link" && value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">
                      {value}
                    </a>
                  ) : (
                    <strong>
                      {value === undefined || value === null || value === ""
                        ? "-"
                        : value}
                    </strong>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {achievementViewRecord && (
        <div className="faculty-modal-overlay" role="dialog" aria-modal="true">
          <div className="faculty-modal-card achievement-details-modal">
            <div className="modal-header-bar">
              <h3>{achievementViewRecord.type} Details</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setAchievementViewRecord(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="achievement-details-grid">
              {achievementViewRecord.type === "Publication" && (
                <>
                  {[
                    ["Academic Year", achievementViewRecord.data.academicYear],
                    ["Title of Paper", achievementViewRecord.data.titleOfPaper],
                    ["Author", achievementViewRecord.data.author],
                    ["Co-Author", achievementViewRecord.data.coAuthor],
                    [
                      "Journal / Conference",
                      achievementViewRecord.data.journalConferenceName,
                    ],
                    [
                      "National / International",
                      achievementViewRecord.data.nationalOrInternational,
                    ],
                    [
                      "Publication Type",
                      achievementViewRecord.data.publicationType,
                    ],
                    ["ISSN / ISBN", achievementViewRecord.data.issnIsbn],
                    ["DOI Link", achievementViewRecord.data.doiLink],
                    ["Indexing", achievementViewRecord.data.indexing],
                    ["Q Factor", achievementViewRecord.data.qFactor],
                    ["Citations", achievementViewRecord.data.citations || 0],
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || "-"}</strong>
                    </div>
                  ))}
                </>
              )}
              {achievementViewRecord.type === "Patent" && (
                <>
                  {[
                    ["Academic Year", achievementViewRecord.data.academicYear],
                    [
                      "Applicant Name",
                      achievementViewRecord.data.applicantName,
                    ],
                    [
                      "Co-Applicant Name",
                      achievementViewRecord.data.coApplicantName,
                    ],
                    [
                      "Patent / Invention Title",
                      achievementViewRecord.data.title,
                    ],
                    [
                      "Application Number",
                      achievementViewRecord.data.applicationNumber,
                    ],
                    ["Patent Filed Date", achievementViewRecord.data.filedDate],
                    [
                      "Patent Published Date",
                      achievementViewRecord.data.publishedDate,
                    ],
                    ["Status", achievementViewRecord.data.status],
                    ["Patent Type", achievementViewRecord.data.patentType],
                    ["Certificate", achievementViewRecord.data.certificateName],
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || "-"}</strong>
                    </div>
                  ))}
                </>
              )}
              {achievementViewRecord.type === "Funding" && (
                <>
                  {[
                    ["Academic Year", achievementViewRecord.data.academicYear],
                    [
                      "Date of Submission",
                      achievementViewRecord.data.submissionDate,
                    ],
                    ["Project Title", achievementViewRecord.data.projectTitle],
                    ["Principal Investigator", achievementViewRecord.data.pi],
                    [
                      "Co-Principal Investigator",
                      achievementViewRecord.data.coPi,
                    ],
                    ["Funding Agency", achievementViewRecord.data.agency],
                    [
                      "Fund Amount",
                      `₹ ${Number(achievementViewRecord.data.fundAmount).toLocaleString("en-IN")}`,
                    ],
                    ["Status", achievementViewRecord.data.status],
                    [
                      "Uploaded Document",
                      achievementViewRecord.data.documentName,
                    ],
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || "-"}</strong>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="modal-footer-bar">
              <button
                type="button"
                className="btn-secondary-action"
                onClick={() => setAchievementViewRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Global Institutional Footer */}
      <Footer />
    </div>
  );
}
