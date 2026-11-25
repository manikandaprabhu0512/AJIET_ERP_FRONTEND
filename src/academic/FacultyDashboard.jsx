import React, { useState, useEffect } from 'react';
import './FacultyDashboard.css';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { getFacultyAssignedSubjectsApi, getFacultyProfileApi } from '../services/apiService';
import { DEPARTMENTS } from '../data/departments';
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
  Search,
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
  Eye
} from 'lucide-react';

const PROFILE_FIELD_LABELS = {
  facultyId: 'Faculty ID',
  vtuId: 'VTU ID',
  vtuFacultyId: 'VTU Faculty ID',
  doj: 'Date of Joining',
  dob: 'Date of Birth',
  phdStream: 'Ph.D. Stream',
  phdCourse: 'Ph.D. Course',
  phdUniversity: 'Ph.D. University',
  phdSpecialization: 'Ph.D. Specialization',
  phdYearOfAward: 'Ph.D. Year of Award',
  pgStream: 'Post-Graduate Stream',
  pgCourse: 'Post-Graduate Course',
  pgUniversity: 'Post-Graduate University',
  pgYearOfPassing: 'Post-Graduate Year of Passing',
  ugStream: 'Under-Graduate Stream',
  ugCourse: 'Under-Graduate Course',
  ugUniversity: 'Under-Graduate University',
  ugYearOfPassing: 'Under-Graduate Year of Passing',
  teachingExpLecturerAsstProf: 'Lecturer / Assistant Professor',
  teachingExpAssocProf: 'Associate Professor',
  teachingExpProf: 'Professor',
  industryExpYears: 'Industry Experience',
  researchExpYears: 'Research Experience',
  otherExpYears: 'Other Experience',
  mobile: 'Mobile Number',
  email: 'Email Address',
  panNumber: 'PAN Number',
  pfNpsNumber: 'PF / NPS Number',
  aadhaarNumber: 'Aadhaar Number',
  bankAccountNumber: 'Bank Account Number',
  bankBranchName: 'Bank Branch',
  ifscCode: 'IFSC Code',
  licInstitutionName: 'Institution Visited During Last LIC',
  memberOfVtuExecutiveCouncil: 'VTU Executive Council',
  memberOfVtuAcademicSenate: 'VTU Academic Senate',
  memberOfVtuBoardOfStudies: 'VTU Board of Studies',
  memberOfVtuBoardOfExamination: 'VTU Board of Examination',
  firstYearTeacher: 'First-Year Teacher',
  biometricImpressionLht: 'Biometric Impression (Left-Hand Thumb)',
  lhtName: 'Left-Hand Thumb Record Name',
  linkedinProfile: 'LinkedIn Profile',
  academiaProfile: 'Academia Profile',
  researchGateProfile: 'ResearchGate Profile',
  photoName: 'Photograph File Name'
};

const ACADEMIC_YEAR_OPTIONS = ['2026-27', '2025-26', '2024-25', '2023-24'];
const EVENT_TYPE_OPTIONS = [
  'Workshop',
  'Tech Talk',
  'Conference',
  'FDP',
  'Technical Activity',
  'Cultural Activity',
  'Sports',
  'NSS',
  'Club Activity',
  'Others'
];

const SAMPLE_ATTENDANCE_RECORDS = [
  { studentId: 'STU001', studentName: 'Student 1', classesHeld: 30, classesAttended: 28 },
  { studentId: 'STU002', studentName: 'Student 2', classesHeld: 30, classesAttended: 25 },
  { studentId: 'STU003', studentName: 'Student 3', classesHeld: 30, classesAttended: 29 }
];

const SAMPLE_SUBJECTS = [
  {
    id: 'sub-1',
    code: 'SUB201',
    name: 'Subject 1',
    attendanceRecords: SAMPLE_ATTENDANCE_RECORDS,
    iaMarks: [
      { studentId: 'STU001', studentName: 'Student 1', ia1: 18, ia2: 17, ia3: 19 },
      { studentId: 'STU002', studentName: 'Student 2', ia1: 16, ia2: 18, ia3: 17 },
      { studentId: 'STU003', studentName: 'Student 3', ia1: 19, ia2: 19, ia3: 20 }
    ]
  },
  {
    id: 'sub-2',
    code: 'SUB202',
    name: 'Subject 2',
    attendanceRecords: SAMPLE_ATTENDANCE_RECORDS,
    iaMarks: [
      { studentId: 'STU001', studentName: 'Student 1', ia1: 17, ia2: 18, ia3: 16 },
      { studentId: 'STU002', studentName: 'Student 2', ia1: 19, ia2: 16, ia3: 18 },
      { studentId: 'STU003', studentName: 'Student 3', ia1: 18, ia2: 20, ia3: 19 }
    ]
  },
  {
    id: 'sub-3',
    code: 'SUB203',
    name: 'Subject 3',
    attendanceRecords: SAMPLE_ATTENDANCE_RECORDS,
    iaMarks: [
      { studentId: 'STU001', studentName: 'Student 1', ia1: 16, ia2: 19, ia3: 18 },
      { studentId: 'STU002', studentName: 'Student 2', ia1: 18, ia2: 17, ia3: 16 },
      { studentId: 'STU003', studentName: 'Student 3', ia1: 20, ia2: 18, ia3: 19 }
    ]
  }
];

const SUBJECTS_BY_ACADEMIC_YEAR = Object.fromEntries(
  ACADEMIC_YEAR_OPTIONS.map((year) => [year, { '2nd Semester': SAMPLE_SUBJECTS }])
);

const SAMPLE_STUDENT_USNS = [
  '4JK26CS001',
  '4JK26CS002',
  '4JK26CS003',
  '4JK26CS004',
  '4JK26CS005',
  '4JK26CS006',
  '4JK26CS007',
  '4JK26CS008'
];

const PROFILE_FIELD_GROUPS = [
  {
    title: 'Personal & Appointment Details',
    keys: [
      'vtuId', 'vtuFacultyId', 'doj', 'dob', 'gender', 'religion', 'caste',
      'category', 'firstYearTeacher'
    ]
  },
  {
    title: 'Contact & Professional Links',
    keys: ['address', 'linkedinProfile', 'academiaProfile', 'researchGateProfile']
  },
  {
    title: 'Professional Experience',
    keys: [
      'teachingExpLecturerAsstProf', 'teachingExpAssocProf', 'teachingExpProf',
      'industryExpYears', 'researchExpYears', 'otherExpYears'
    ]
  },
  {
    title: 'Institutional Service & Recognition',
    keys: [
      'awards', 'licInstitutionName', 'memberOfVtuExecutiveCouncil',
      'memberOfVtuAcademicSenate', 'memberOfVtuBoardOfStudies', 'memberOfVtuBoardOfExamination'
    ]
  },
  {
    title: 'Identification & Bank Details',
    keys: [
      'panNumber', 'pfNpsNumber', 'aadhaarNumber', 'bankAccountNumber',
      'bankName', 'bankBranchName', 'ifscCode', 'biometricImpressionLht', 'lhtName'
    ]
  }
];

const PROFILE_EDUCATION_LEVELS = [
  { title: 'Doctoral Qualification', prefix: 'phd' },
  { title: 'Post-Graduate Qualification', prefix: 'pg' },
  { title: 'Under-Graduate Qualification', prefix: 'ug' }
];

const getProfileFieldLabel = (key) =>
  PROFILE_FIELD_LABELS[key] ||
  key
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/^./, (character) => character.toUpperCase());

const getProfileFieldValue = (value, key) => {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.map((item) => String(item)).join(', ');
  if (value && typeof value === 'object') {
    if (value.name) return value.name;
    return 'Uploaded';
  }
  if (typeof value === 'string' && value.startsWith('data:')) return 'Uploaded';
  if (/Exp/i.test(key) && value !== '' && !Number.isNaN(Number(value))) return `${value} years`;
  return String(value);
};

const getProfileImageSource = (value) => {
  if (typeof value === 'string' && value.startsWith('data:image/')) return value;
  if (value && typeof value === 'object' && typeof value.data === 'string' && value.data.startsWith('data:image/')) {
    return value.data;
  }
  return '';
};

export default function FacultyDashboard({ onLogout = () => {}, currentUser = null }) {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  // Sidebar toggle state (Expanded on desktop, collapsed on mobile)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => window.innerWidth >= 768);

  // Active navigation tab for the seven Faculty Operations links.
  const [activeTab, setActiveTab] = useState('profile');
  const [subjectAcademicYear, setSubjectAcademicYear] = useState('');
  const [subjectSemester, setSubjectSemester] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [subjectAssessmentTab, setSubjectAssessmentTab] = useState('attendance');
  const [messageRecipientMode, setMessageRecipientMode] = useState('all');
  const [selectedMessageUsns, setSelectedMessageUsns] = useState([]);
  const [messageUsnQuery, setMessageUsnQuery] = useState('');
  const [isMessageUsnDropdownOpen, setIsMessageUsnDropdownOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [sentMessages, setSentMessages] = useState([]);
  const [timetableAcademicYear, setTimetableAcademicYear] = useState('2026-27');
  const [timetableSemester, setTimetableSemester] = useState('Odd');
  const [timetableUploads, setTimetableUploads] = useState({});
  const timetableKey = `${timetableAcademicYear}-${timetableSemester}`;
  const selectedTimetableFile = timetableUploads[timetableKey];

  // Achievements sub-tab selection:
  // 'publication' | 'patent' | 'funding' | 'research' | 'awards' | 'workshops' | 'fdp' | 'reports'
  const [achievementsSubTab, setAchievementsSubTab] = useState('publication');

  // Publications state with comprehensive dataset matching all required fields
  const [publicationsList, setPublicationsList] = useState([
    {
      id: 'PUB-1',
      academicYear: '2025-26',
      author: 'Dr. Ramesh Kumar',
      coAuthor: 'Prof. Anitha Rao, Dr. Sudhir Prabhu',
      titleOfPaper: 'Deep Learning-Based Semantic Image Segmentation for Low-Power Autonomous UAV Edge Devices',
      journalConferenceName: 'IEEE Transactions on Industrial Informatics, Vol. 21, Issue 4, pp. 3201-3212',
      nationalOrInternational: 'International',
      publicationType: 'Journal',
      issnIsbn: 'ISSN 1551-3203',
      doiLink: 'https://doi.org/10.1109/TII.2025.3214567',
      indexing: 'Scopus',
      qFactor: 'Q1',
      citations: 42
    },
    {
      id: 'PUB-2',
      academicYear: '2024-25',
      author: 'Dr. Ramesh Kumar',
      coAuthor: 'Dr. K. V. Rajesh, Sneha Pai',
      titleOfPaper: 'Low-Power Reconfigurable VLSI Architecture for Real-Time Edge Signal Processing',
      journalConferenceName: 'Elsevier Microprocessors and Microsystems, Vol. 104, Article 104891',
      nationalOrInternational: 'International',
      publicationType: 'Journal',
      issnIsbn: 'ISSN 0141-9331',
      doiLink: 'https://doi.org/10.1016/j.micpro.2024.104891',
      indexing: 'SCI',
      qFactor: 'Q2',
      citations: 28
    },
    {
      id: 'PUB-3',
      academicYear: '2023-24',
      author: 'Dr. Ramesh Kumar',
      coAuthor: 'Prof. Mahesh Shetty',
      titleOfPaper: 'FPGA Implementation of Pipelined FFT Architecture for High-Throughput 5G Baseband Systems',
      journalConferenceName: 'Springer Wireless Personal Communications, Vol. 129, pp. 1145-1160',
      nationalOrInternational: 'International',
      publicationType: 'Journal',
      issnIsbn: 'ISSN 0929-6212',
      doiLink: 'https://doi.org/10.1007/s11277-023-10482-1',
      indexing: 'Scopus',
      qFactor: 'Q2',
      citations: 36
    },
    {
      id: 'PUB-4',
      academicYear: '2024-25',
      author: 'Dr. Ramesh Kumar',
      coAuthor: 'Vikram Nayak, Dr. S. Rao',
      titleOfPaper: 'Energy Efficient MAC Protocols for Wireless Body Area Networks in Healthcare Telemetry',
      journalConferenceName: 'International Conference on Emerging Trends in VLSI & Embedded Systems (ICETVES 2024)',
      nationalOrInternational: 'International',
      publicationType: 'Conference',
      issnIsbn: 'ISBN 978-1-6654-9872-3',
      doiLink: 'https://doi.org/10.1109/ICETVES.2024.981245',
      indexing: 'IEEE Xplore',
      qFactor: 'Q3',
      citations: 14
    },
    {
      id: 'PUB-5',
      academicYear: '2023-24',
      author: 'Dr. Ramesh Kumar',
      coAuthor: 'Dr. M. S. Bhat',
      titleOfPaper: 'Security Paradigms and Cryptographic Acceleration on RISC-V SoC Architectures',
      journalConferenceName: 'CRC Press / Taylor & Francis - Advances in Hardware Security, Chapter 7, pp. 145-178',
      nationalOrInternational: 'National',
      publicationType: 'Book Chapter',
      issnIsbn: 'ISBN 978-0-367-45892-1',
      doiLink: 'https://doi.org/10.1201/9781003029145-7',
      indexing: 'Scopus',
      qFactor: 'Q4',
      citations: 9
    }
  ]);

  // Publication filter states
  const [pubFilterYear, setPubFilterYear] = useState('All');
  const [pubFilterType, setPubFilterType] = useState('All');
  const [pubSearchQuery, setPubSearchQuery] = useState('');
  const [showAddPubForm, setShowAddPubForm] = useState(false);

  // New Publication form state with the exact requested fields:
  // Academic Year, Author, Co-Author, Title of Paper, Name of Journal/Conference,
  // National or International, Publication Type, ISSN/ISBN, DOI link, Indexing, Q Factor
  const initialPubFormState = {
    academicYear: '2026-27',
    author: 'Dr. Ramesh Kumar',
    coAuthor: '',
    titleOfPaper: '',
    journalConferenceName: '',
    nationalOrInternational: 'International',
    publicationType: 'Journal',
    issnIsbn: '',
    doiLink: '',
    indexing: 'Scopus',
    qFactor: 'Q1'
  };

  const [pubFormData, setPubFormData] = useState(initialPubFormState);

  const handlePubFormChange = (e) => {
    const { name, value } = e.target;
    setPubFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePubFormSubmit = (e) => {
    e.preventDefault();
    if (!pubFormData.titleOfPaper.trim()) {
      showToast('Please enter the Title of Paper');
      return;
    }
    if (!pubFormData.journalConferenceName.trim()) {
      showToast('Please enter the Name of Journal / Conference');
      return;
    }
    if (!pubFormData.author.trim()) {
      showToast('Please enter the Author name');
      return;
    }

    const newRecord = {
      id: `PUB-${Date.now()}`,
      ...pubFormData,
      citations: 0
    };

    setPublicationsList(prev => [newRecord, ...prev]);
    showToast(`Publication "${newRecord.titleOfPaper.slice(0, 32)}..." added successfully!`);
    setPubFormData({
      ...initialPubFormState,
      academicYear: pubFormData.academicYear
    });
    setShowAddPubForm(false);
  };

  // Patents state with realistic records matching all requested fields:
  // academicYear, applicantName, coApplicantName, title, applicationNumber,
  // filedDate, publishedDate, status (Published | Granted),
  // patentType (Design | Utility | Copyright | Trademark), certificateName
  const [patentsList, setPatentsList] = useState([
    {
      id: 'PAT-001',
      academicYear: '2025-26',
      applicantName: 'Dr. Ramesh Kumar',
      coApplicantName: 'AJIET IoT Research Group, Prof. Anitha Rao',
      title: 'IoT-Enabled Smart Agricultural Soil Health Monitoring Sensor Unit',
      applicationNumber: '202441012345 A',
      filedDate: '2024-02-15',
      publishedDate: '2024-04-12',
      status: 'Published',
      patentType: 'Utility',
      certificateName: 'Patent_Publication_202441012345.pdf'
    },
    {
      id: 'PAT-002',
      academicYear: '2024-25',
      applicantName: 'Dr. Ramesh Kumar',
      coApplicantName: 'A J Institute of Engineering & Technology',
      title: 'Low-Power Reconfigurable Edge AI Processor for Aerial Surveillance Drones',
      applicationNumber: '202341054321',
      filedDate: '2023-08-20',
      publishedDate: '2024-01-10',
      status: 'Granted',
      patentType: 'Design',
      certificateName: 'Patent_Grant_Certificate_489124.pdf'
    },
    {
      id: 'PAT-003',
      academicYear: '2023-24',
      applicantName: 'Dr. Ramesh Kumar',
      coApplicantName: 'Dr. Sudhir Prabhu',
      title: 'AJIET Embedded IoT Firmware Architecture for Real-Time Edge Telemetry',
      applicationNumber: 'SW-18492/2023',
      filedDate: '2023-05-10',
      publishedDate: '2023-09-18',
      status: 'Granted',
      patentType: 'Copyright',
      certificateName: 'Copyright_Registration_SW18492.pdf'
    },
    {
      id: 'PAT-004',
      academicYear: '2024-25',
      applicantName: 'A J Institute of Engineering & Technology',
      coApplicantName: 'Dr. Ramesh Kumar (Brand Coordinator)',
      title: 'AJIET EduTech Smart Campus Management Logo & Device Mark',
      applicationNumber: 'TM-5928104',
      filedDate: '2024-01-05',
      publishedDate: '2024-06-22',
      status: 'Published',
      patentType: 'Trademark',
      certificateName: 'Trademark_Journal_Ad_5928104.pdf'
    }
  ]);

  // Patent filter states
  const [patentFilterYear, setPatentFilterYear] = useState('All');
  const [patentFilterType, setPatentFilterType] = useState('All');
  const [patentFilterStatus, setPatentFilterStatus] = useState('All');
  const [patentSearchQuery, setPatentSearchQuery] = useState('');
  const [showAddPatentForm, setShowAddPatentForm] = useState(false);

  // New Patent Form State with requested fields:
  // academic year, applicant name, co applicant name, title, application number,
  // patent file date, patent published date, status (Published | Granted),
  // type of patent (Design | Utility | Copyright | Trademark), upload the certificate
  const initialPatentFormState = {
    academicYear: '2026-27',
    applicantName: 'Dr. Ramesh Kumar',
    coApplicantName: '',
    title: '',
    applicationNumber: '',
    filedDate: '',
    publishedDate: '',
    status: 'Published',
    patentType: 'Utility',
    certificateName: ''
  };

  const [patentFormData, setPatentFormData] = useState(initialPatentFormState);

  const handlePatentFormChange = (e) => {
    const { name, value } = e.target;
    setPatentFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePatentCertificateUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPatentFormData(prev => ({
        ...prev,
        certificateName: file.name
      }));
      showToast(`Selected certificate: ${file.name}`);
    }
  };

  const handlePatentFormSubmit = (e) => {
    e.preventDefault();
    if (!patentFormData.title.trim()) {
      showToast('Please enter the Title of Patent / Invention');
      return;
    }
    if (!patentFormData.applicantName.trim()) {
      showToast('Please enter the Applicant Name');
      return;
    }
    if (!patentFormData.applicationNumber.trim()) {
      showToast('Please enter the Application Number');
      return;
    }

    const newRecord = {
      id: `PAT-${Date.now()}`,
      ...patentFormData,
      certificateName: patentFormData.certificateName || 'Patent_Certificate_Uploaded.pdf'
    };

    setPatentsList(prev => [newRecord, ...prev]);
    showToast(`Patent "${newRecord.title.slice(0, 32)}..." registered successfully!`);
    setPatentFormData({
      ...initialPatentFormState,
      academicYear: patentFormData.academicYear
    });
    setShowAddPatentForm(false);
  };

  // Funding / Sponsored Research state
  const [fundingList, setFundingList] = useState([
    {
      id: 'FUND-1',
      academicYear: '2023-24',
      submissionDate: '2023-02-18',
      projectTitle: 'IoT Based Coastal Environmental Quality Monitoring Network',
      pi: 'Dr. Ramesh Kumar',
      coPi: 'Prof. Anitha Rao',
      agency: 'Visvesvaraya Technological University',
      fundAmount: '250000',
      status: 'Granted',
      documentName: 'VTU_Sanction_Order.pdf'
    },
    {
      id: 'FUND-2',
      academicYear: '2024-25',
      submissionDate: '2024-04-10',
      projectTitle: 'Modernization of Advanced Embedded DSP and VLSI Laboratory',
      pi: 'Dr. Sudhir Prabhu',
      coPi: 'Dr. Ramesh Kumar',
      agency: 'All India Council for Technical Education',
      fundAmount: '150000',
      status: 'Submitted',
      documentName: 'AICTE_MODROBS_Proposal.pdf'
    }
  ]);
  const [showAddFundingForm, setShowAddFundingForm] = useState(false);
  const [fundingFilterYear, setFundingFilterYear] = useState('All');
  const initialFundingFormState = {
    academicYear: '2026-27',
    submissionDate: '',
    projectTitle: '',
    pi: 'Dr. Ramesh Kumar',
    coPi: '',
    agency: '',
    fundAmount: '',
    status: 'Submitted',
    documentName: ''
  };
  const [fundingFormData, setFundingFormData] = useState(initialFundingFormState);
  const [achievementViewRecord, setAchievementViewRecord] = useState(null);

  const handleFundingFormChange = (e) => {
    const { name, value } = e.target;
    setFundingFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFundingDocumentUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFundingFormData(prev => ({
        ...prev,
        documentName: file.name
      }));
      showToast(`Selected document: ${file.name}`);
    }
  };

  const handleFundingFormSubmit = (e) => {
    e.preventDefault();
    if (!fundingFormData.submissionDate) {
      showToast('Please select the Date of Submission');
      return;
    }
    if (!fundingFormData.projectTitle.trim()) {
      showToast('Please enter the Project Title');
      return;
    }
    if (!fundingFormData.pi.trim()) {
      showToast('Please enter the Principal Investigator');
      return;
    }
    if (!fundingFormData.agency.trim()) {
      showToast('Please enter the Funding Agency');
      return;
    }
    if (!fundingFormData.fundAmount || Number(fundingFormData.fundAmount) <= 0) {
      showToast('Please enter a valid Fund Amount');
      return;
    }

    const newRecord = {
      id: `FUND-${Date.now()}`,
      ...fundingFormData,
      documentName: fundingFormData.documentName || 'Funding_Document.pdf'
    };

    setFundingList(prev => [newRecord, ...prev]);
    showToast(`Funding record "${newRecord.projectTitle.slice(0, 32)}..." submitted successfully!`);
    setFundingFormData(initialFundingFormState);
    setShowAddFundingForm(false);
  };

  // Subjects assigned via HOD/API
  const [assignedSubjects, setAssignedSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [registeredData, setRegisteredData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const authToken = currentUser?.token || localStorage.getItem('ajiet_auth_token');
  const profileData = {
    title: registeredData?.title || '',
    fullName: registeredData?.fullName || currentUser?.name || currentUser?.username || '',
    facultyId: registeredData?.facultyId || currentUser?.username || '',
    department: registeredData?.department || currentUser?.deptName || '',
    designation: registeredData?.designation || currentUser?.designation || ''
  };
  const facultyDisplayName = `${profileData.title} ${profileData.fullName}`.trim();

  // Event Organization State
  const [eventAcademicYearFilter, setEventAcademicYearFilter] = useState('All');
  const [eventFilter, setEventFilter] = useState('All');
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [eventViewRecord, setEventViewRecord] = useState(null);
  const [newEvent, setNewEvent] = useState({
    academicYear: '2026-27',
    title: '',
    category: 'Others',
    programDate: '',
    resourcePersonDetails: '',
    organizingDepartment: '',
    associatedDepartment: '',
    studentCount: '',
    facultyCount: '',
    externalParticipantCount: '',
    poMapping: '',
    coordinators: '',
    expenditure: '',
    socialMediaLink: '',
    reportFile: null,
    status: 'Completed'
  });

  const [eventsList, setEventsList] = useState([
    {
      id: 1,
      academicYear: '2026-27',
      title: 'National Conference on Emerging Trends in VLSI & Embedded Systems (NCETVES-26)',
      category: 'Conference',
      role: 'Convenor',
      sponsor: 'VTU & AICTE',
      grant: '₹ 1,50,000',
      dates: '15-16 Oct 2026',
      participants: 140,
      status: 'Completed'
    },
    {
      id: 2,
      academicYear: '2026-27',
      title: '5-Day National Faculty Development Program on "AI & Machine Learning in Signal Processing"',
      category: 'FDP',
      role: 'Program Coordinator',
      sponsor: 'IEEE Bangalore Section & AJIET',
      grant: '₹ 75,000',
      dates: '22-26 Jul 2026',
      participants: 65,
      status: 'Completed'
    },
    {
      id: 3,
      academicYear: '2025-26',
      title: 'Hands-on Workshop on ARM Cortex Microcontrollers & RTOS for IoT',
      category: 'Workshop',
      role: 'Event Lead',
      sponsor: 'AJIET Robotics & IoT Club',
      grant: 'Institutional',
      dates: '14 Mar 2026',
      participants: 90,
      status: 'Completed'
    },
    {
      id: 4,
      academicYear: '2026-27',
      title: 'State-Level Technical Symposium & Project Exhibition "Technovate 2026"',
      category: 'Technical Activity',
      role: 'Faculty Co-Convenor',
      sponsor: 'Department of ECE',
      grant: '₹ 50,000',
      dates: '28 Nov 2026',
      participants: 220,
      status: 'Upcoming'
    }
  ]);

  const [notification, setNotification] = useState('');

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

  useEffect(() => {
    let isCurrent = true;
    if (!authToken) return () => {
      isCurrent = false;
    };

    getFacultyProfileApi(authToken)
      .then((profile) => {
        if (!profile || typeof profile !== 'object') {
          throw new Error('Faculty profile data was not returned by the server.');
        }
        if (isCurrent) {
          setRegisteredData(profile);
          setProfileError('');
        }
      })
      .catch((error) => {
        console.error('Faculty profile load failed:', error);
        if (isCurrent) setProfileError(error.message || 'Unable to load faculty profile.');
      })
      .finally(() => {
        if (isCurrent) setProfileLoading(false);
      });

    return () => {
      isCurrent = false;
    };
  }, [authToken]);

  // Fetch assigned subjects allocated by HOD
  useEffect(() => {
    async function loadAssigned() {
      try {
        setLoading(true);
        const res = await getFacultyAssignedSubjectsApi(profileData.facultyId);
        const list = Array.isArray(res) ? res : (res?.assignedSubjects || []);
        if (list.length > 0) {
          setAssignedSubjects(list);
        } else {
          setAssignedSubjects([
            {
              subject_code: '21EC32',
              subject_name: 'Network Analysis & Synthesis',
              semester: 3,
              section: 'Section A',
              credits: 4,
              is_lab: false
            },
            {
              subject_code: '21ECL37',
              subject_name: 'Analog Circuits Laboratory',
              semester: 3,
              section: 'Section A (B1)',
              credits: 1.5,
              is_lab: true
            }
          ]);
        }
      } catch (err) {
        // Backend offline or local development: graceful fallback
        setAssignedSubjects([
          {
            subject_code: '21EC32',
            subject_name: 'Network Analysis & Synthesis',
            semester: 3,
            section: 'Section A',
            credits: 4,
            is_lab: false
          },
          {
            subject_code: '21ECL37',
            subject_name: 'Analog Circuits Laboratory',
            semester: 3,
            section: 'Section A (B1)',
            credits: 1.5,
            is_lab: true
          }
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadAssigned();
  }, [profileData.facultyId]);

  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    const body = messageBody.trim();
    if (!body) {
      showToast('Enter a message before sending.');
      return;
    }
    if (messageRecipientMode === 'selected' && selectedMessageUsns.length === 0) {
      showToast('Select at least one student USN.');
      return;
    }

    const record = {
      id: Date.now(),
      subject: messageSubject.trim(),
      body,
      recipientMode: messageRecipientMode,
      recipients: messageRecipientMode === 'all' ? [] : [...selectedMessageUsns],
      sentAt: new Date().toLocaleString()
    };
    setSentMessages((previous) => [record, ...previous]);
    setMessageSubject('');
    setMessageBody('');
    showToast('Message added to sent history.');
  };

  const handleTimetableUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTimetableUploads((prev) => ({
      ...prev,
      [timetableKey]: file
    }));
    event.target.value = '';
    showToast(`Time table uploaded for ${timetableAcademicYear} (${timetableSemester} Semester).`);
  };

  const handleViewTimetable = () => {
    if (!selectedTimetableFile) return;

    const fileUrl = URL.createObjectURL(selectedTimetableFile);
    const previewLink = document.createElement('a');
    previewLink.href = fileUrl;
    previewLink.target = '_blank';
    previewLink.rel = 'noopener noreferrer';
    previewLink.click();
    window.setTimeout(() => URL.revokeObjectURL(fileUrl), 60000);
  };

  const handleViewEventReport = () => {
    if (!eventViewRecord?.reportFile) return;

    const fileUrl = URL.createObjectURL(eventViewRecord.reportFile);
    const previewLink = document.createElement('a');
    previewLink.href = fileUrl;
    previewLink.target = '_blank';
    previewLink.rel = 'noopener noreferrer';
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
      grant: newEvent.expenditure || 'N/A',
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
      reportFileName: newEvent.reportFile?.name || '',
      status: newEvent.status
    };
    setEventsList((prev) => [item, ...prev]);
    setShowAddEventForm(false);
    setNewEvent({
      academicYear: '2026-27',
      title: '',
      category: 'Others',
      programDate: '',
      resourcePersonDetails: '',
      organizingDepartment: '',
      associatedDepartment: '',
      studentCount: '',
      facultyCount: '',
      externalParticipantCount: '',
      poMapping: '',
      coordinators: '',
      expenditure: '',
      socialMediaLink: '',
      reportFile: null,
      status: 'Completed'
    });
    showToast('Event registered successfully in institutional records!');
  };

  const teacherInitials = (facultyDisplayName || 'Faculty')
    .replace('Dr.', '')
    .replace('Prof.', '')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'FA';
  const profileFields = Object.entries(registeredData || {})
    .filter(([key, value]) => !/password/i.test(key) && value !== null && value !== undefined && value !== '')
    .map(([key, value]) => ({
      key,
      label: getProfileFieldLabel(key),
      value: getProfileFieldValue(value, key),
      image: /photo|image/i.test(key) ? getProfileImageSource(value) : ''
    }));
  const profileEducationGroups = PROFILE_EDUCATION_LEVELS.map((level) => ({
    ...level,
    fields: profileFields.filter((field) => field.key.toLowerCase().startsWith(level.prefix))
  })).filter((group) => group.fields.length > 0);
  const profileFieldGroups = PROFILE_FIELD_GROUPS.map((group) => ({
    ...group,
    fields: profileFields.filter((field) => group.keys.includes(field.key))
  })).filter((group) => group.fields.length > 0);
  const groupedProfileKeys = new Set([
    'title', 'fullName', 'facultyId', 'department', 'designation', 'photograph',
    ...PROFILE_EDUCATION_LEVELS.flatMap((level) =>
      profileFields
        .filter((field) => field.key.toLowerCase().startsWith(level.prefix))
        .map((field) => field.key)
    ),
    ...PROFILE_FIELD_GROUPS.flatMap((group) => group.keys)
  ]);
  const additionalProfileFields = profileFields.filter((field) => !groupedProfileKeys.has(field.key));
  const profileImage = getProfileImageSource(registeredData?.photograph);
  const facultySubtitle = [
    profileData.designation,
    profileData.department && `Department of ${profileData.department}`,
    profileData.facultyId && `Faculty ID: ${profileData.facultyId}`
  ].filter(Boolean).join(' • ');

  // Filtered Events
  const filteredEvents = eventsList.filter((ev) => {
    const matchesYear = eventAcademicYearFilter === 'All' || ev.academicYear === eventAcademicYearFilter;
    const matchesCategory = eventFilter === 'All' || ev.category === eventFilter;
    return matchesYear && matchesCategory;
  });
  const availableSubjectSemesters = subjectAcademicYear
    ? Object.keys(SUBJECTS_BY_ACADEMIC_YEAR[subjectAcademicYear] || {})
    : [];
  const availableSubjects = subjectSemester
    ? SUBJECTS_BY_ACADEMIC_YEAR[subjectAcademicYear]?.[subjectSemester] || []
    : [];
  const selectedSubject = availableSubjects.find((subject) => subject.id === selectedSubjectId);

  // Filtered Publications by Academic Year, Type, and Search query
  const filteredPublications = publicationsList.filter((pub) => {
    const matchesYear = pubFilterYear === 'All' || pub.academicYear === pubFilterYear;
    const matchesType = pubFilterType === 'All' || pub.publicationType === pubFilterType;
    const query = pubSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      pub.titleOfPaper.toLowerCase().includes(query) ||
      pub.author.toLowerCase().includes(query) ||
      (pub.coAuthor && pub.coAuthor.toLowerCase().includes(query)) ||
      pub.journalConferenceName.toLowerCase().includes(query) ||
      pub.indexing.toLowerCase().includes(query) ||
      pub.qFactor.toLowerCase().includes(query) ||
      (pub.issnIsbn && pub.issnIsbn.toLowerCase().includes(query));
    return matchesYear && matchesType && matchesSearch;
  });

  // Filtered Patents by Academic Year, Type, Status, and Search query
  const filteredPatents = patentsList.filter((pat) => {
    const matchesYear = patentFilterYear === 'All' || pat.academicYear === patentFilterYear;
    const matchesType = patentFilterType === 'All' || pat.patentType === patentFilterType;
    const matchesStatus = patentFilterStatus === 'All' || pat.status === patentFilterStatus;
    const query = patentSearchQuery.trim().toLowerCase();
    const matchesSearch =
      !query ||
      pat.title.toLowerCase().includes(query) ||
      pat.applicantName.toLowerCase().includes(query) ||
      (pat.coApplicantName && pat.coApplicantName.toLowerCase().includes(query)) ||
      pat.applicationNumber.toLowerCase().includes(query) ||
      pat.patentType.toLowerCase().includes(query) ||
      pat.status.toLowerCase().includes(query);
    return matchesYear && matchesType && matchesStatus && matchesSearch;
  });

  const filteredMessageUsns = SAMPLE_STUDENT_USNS.filter((usn) =>
    usn.toLowerCase().includes(messageUsnQuery.trim().toLowerCase()) &&
    !selectedMessageUsns.includes(usn)
  );

  return (
    <div className="erp-portal-container">
      {/* 1. Global Institutional Header */}
      <Header
        onLogout={onLogout}
        currentUser={currentUser}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSidebarOpen={isSidebarOpen}
        displayName={facultyDisplayName || 'Faculty'}
        displaySubtitle={facultySubtitle}
        currentDate={currentDate}
        currentTime={currentTime}
      />

      {/* Toast Notification */}
      {notification && (
        <div
          style={{
            position: 'fixed',
            top: '70px',
            right: '24px',
            background: 'var(--faculty-navy)',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.86rem',
            fontWeight: '600'
          }}
        >
          <Check size={16} style={{ color: '#4ade80' }} />
          <span>{notification}</span>
        </div>
      )}

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
                  <h3 className="sidebar-profile-name">{facultyDisplayName || 'Faculty'}</h3>
                  <span className="sidebar-profile-id">{profileData.facultyId || 'ID unavailable'}</span>
                  <span className="sidebar-profile-dept">
                    {profileData.designation || profileData.department || 'Faculty member'}
                  </span>
                  <span className="sidebar-role-pill">Faculty Member</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="sidebar-nav-menu">
                <div className="sidebar-menu-heading">Faculty Operations</div>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <div className="nav-item-icon-box">
                    <User size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Profile</span>
                    <span className="nav-subtitle">Personal &amp; academic profile</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
                  onClick={() => setActiveTab('achievements')}
                >
                  <div className="nav-item-icon-box">
                    <Award size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Achievements</span>
                    <span className="nav-subtitle">Publications, patents &amp; grants</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'timetable' ? 'active' : ''}`}
                  onClick={() => setActiveTab('timetable')}
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
                  className={`sidebar-nav-item ${activeTab === 'courses' ? 'active' : ''}`}
                  onClick={() => setActiveTab('courses')}
                >
                  <div className="nav-item-icon-box">
                    <BookOpen size={18} />
                  </div>
                  <div className="nav-item-text">
                    <span className="nav-title">Subject Details</span>
                    <span className="nav-subtitle">Assigned subjects and courses</span>
                  </div>
                  <ChevronRight size={16} className="nav-item-arrow" />
                </button>

                <button
                  type="button"
                  className={`sidebar-nav-item ${activeTab === 'events' ? 'active' : ''}`}
                  onClick={() => setActiveTab('events')}
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
                  className={`sidebar-nav-item ${activeTab === 'message' ? 'active' : ''}`}
                  onClick={() => setActiveTab('message')}
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
                  className={`sidebar-nav-item ${activeTab === 'leave' ? 'active' : ''}`}
                  onClick={() => setActiveTab('leave')}
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
                className={`sidebar-mini-item ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
                title="Profile"
              >
                <div className="mini-icon-wrap">
                  <User size={19} />
                </div>
                <span className="mini-item-label">Profile</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'achievements' ? 'active' : ''}`}
                onClick={() => setActiveTab('achievements')}
                title="Achievements"
              >
                <div className="mini-icon-wrap">
                  <Award size={19} />
                </div>
                <span className="mini-item-label">Achievements</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'timetable' ? 'active' : ''}`}
                onClick={() => setActiveTab('timetable')}
                title="Time Table"
              >
                <div className="mini-icon-wrap">
                  <Calendar size={19} />
                </div>
                <span className="mini-item-label">Time Table</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'courses' ? 'active' : ''}`}
                onClick={() => setActiveTab('courses')}
                title="Subject Details"
              >
                <div className="mini-icon-wrap">
                  <BookOpen size={19} />
                </div>
                <span className="mini-item-label">Subject Details</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'events' ? 'active' : ''}`}
                onClick={() => setActiveTab('events')}
                title="Other Responsibilities"
              >
                <div className="mini-icon-wrap">
                  <Users size={19} />
                </div>
                <span className="mini-item-label">Other Responsibilities</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'message' ? 'active' : ''}`}
                onClick={() => setActiveTab('message')}
                title="Message"
              >
                <div className="mini-icon-wrap">
                  <Mail size={19} />
                </div>
                <span className="mini-item-label">Message</span>
              </button>

              <button
                type="button"
                className={`sidebar-mini-item ${activeTab === 'leave' ? 'active' : ''}`}
                onClick={() => setActiveTab('leave')}
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
        <main className="erp-portal-main-panel" style={{ padding: activeTab === 'profile' ? '1.25rem 1.5rem' : '1.5rem' }}>
          {/* Top Banner — only rendered on non-profile tabs to keep Faculty Profile clean and single-card focused */}
          {activeTab !== 'profile' && (
            <section className="erp-institutional-banner">
              <div className="banner-primary-block">
                <div className="banner-badge-icon">
                  <GraduationCap size={26} />
                </div>
                <div className="banner-details">
                  <div className="banner-tagline">
                    <span>Faculty Academic Portal • 2026-27</span>
                    <span className="banner-tag-sep">•</span>
                    <span>{profileData.department ? `Dept. of ${profileData.department}` : 'Faculty Academic Portal'}</span>
                  </div>
                  <h1 className="banner-title">{facultyDisplayName || 'Faculty'}</h1>
                  <p className="banner-subtitle">
                    {facultySubtitle || 'Faculty academic dashboard'}
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

          {activeTab === 'profile' && (
            <section className="faculty-profile-view">
              {!authToken ? (
                <p className="faculty-profile-error" role="alert">
                  A valid login session is required to load your faculty profile.
                </p>
              ) : profileLoading ? (
                <p className="faculty-profile-message" role="status">Loading faculty profile...</p>
              ) : profileError ? (
                <p className="faculty-profile-error" role="alert">{profileError}</p>
              ) : profileFields.length ? (
                <div className="faculty-resume">
                  <div className="faculty-resume-toolbar">
                    <div>
                      <p className="faculty-resume-eyebrow">Faculty Operations</p>
                      
                    </div>
                  </div>

                  <article className="faculty-resume-paper">
                    <header className="faculty-resume-hero">
                      <div className="faculty-resume-avatar">
                        {profileImage ? (
                          <img src={profileImage} alt={facultyDisplayName || 'Faculty'} />
                        ) : (
                          <span>{teacherInitials}</span>
                        )}
                      </div>
                      <div className="faculty-resume-identity">
                        <p className="faculty-resume-eyebrow">Academic Professional</p>
                        <h2>{facultyDisplayName || 'Faculty Member'}</h2>
                        <p className="faculty-resume-role">
                          {[profileData.designation, profileData.department].filter(Boolean).join(' · ') || 'Faculty'}
                        </p>
                        {profileData.facultyId && (
                          <span className="faculty-resume-id">Faculty ID: {profileData.facultyId}</span>
                        )}
                        <div className="faculty-resume-contact">
                          {registeredData.email && (
                            <a href={`mailto:${registeredData.email}`}>
                              <Mail size={15} />
                              <span>{registeredData.email}</span>
                            </a>
                          )}
                          {registeredData.mobile && (
                            <a href={`tel:${registeredData.mobile.replace(/[^\d+]/g, '')}`}>
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
                              <article className="faculty-resume-education" key={group.prefix}>
                                <span className="faculty-resume-timeline-dot" />
                                <h4>{group.title}</h4>
                                <dl className="faculty-resume-details">
                                  {group.fields.map((field) => (
                                    <div className="faculty-resume-detail" key={field.key}>
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
                        <section className="faculty-resume-section" key={group.title}>
                          <h3>{group.title}</h3>
                          <dl className="faculty-resume-details">
                            {group.fields.map((field) => (
                              <div className="faculty-resume-detail" key={field.key}>
                                <dt>{field.label}</dt>
                                <dd>
                                  {field.image ? (
                                    <img className="faculty-resume-field-image" src={field.image} alt={field.label} />
                                  ) : /^https?:\/\//i.test(field.value) ? (
                                    <a href={field.value} target="_blank" rel="noreferrer">{field.value}</a>
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
                              <div className="faculty-resume-detail" key={field.key}>
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
                <p className="faculty-profile-message">No registration details are available for this account.</p>
              )}
            </section>
          )}

          {/* ============================================================ */}
          {/* VIEW 2: ACHIEVEMENTS (WITH 8 DROPDOWN SUB-MODULES) */}
          {/* ============================================================ */}
          {activeTab === 'achievements' && (
            <div className="erp-tab-content">
              {/* Horizontal Pill Bar for the 8 Achievements categories */}
              <div className="achievements-nav-pill-bar">
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'publication' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('publication')}
                >
                  <FileText size={14} />
                  <span>Publication</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'patent' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('patent')}
                >
                  <ShieldCheck size={14} />
                  <span>Patent</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'funding' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('funding')}
                >
                  <TrendingUp size={14} />
                  <span>Funding</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'research' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('research')}
                >
                  <Sparkles size={14} />
                  <span>Research</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'awards' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('awards')}
                >
                  <Award size={14} />
                  <span>Awards</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'workshops' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('workshops')}
                >
                  <Users size={14} />
                  <span>Workshops</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'fdp' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('fdp')}
                >
                  <GraduationCap size={14} />
                  <span>FDP</span>
                </button>
                <button
                  type="button"
                  className={`achievements-pill-btn ${achievementsSubTab === 'reports' ? 'active' : ''}`}
                  onClick={() => setAchievementsSubTab('reports')}
                >
                  <FileSpreadsheet size={14} />
                  <span>Report Generation</span>
                </button>
              </div>

              {/* ---------------- 1. PUBLICATION ---------------- */}
              {achievementsSubTab === 'publication' && (
                <div>
                  {/* Publications Container */}
                  <div className="erp-card-container">
                    {/* Toolbar with Title & Action */}
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Research Publications (Journals, Conferences &amp; Books)</h2>
                        <p className="toolbar-subheading">Articles and proceedings indexed in Scopus, SCI, Web of Science, and UGC-CARE / ABC</p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddPubForm(!showAddPubForm)}
                      >
                        {showAddPubForm ? <X size={15} /> : <Plus size={15} />}
                        <span>{showAddPubForm ? 'Close Form' : 'Add Publication'}</span>
                      </button>
                    </div>

                    {/* Top Filter Bar: First filter Academic Year, then Type & Search */}
                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="filterAcademicYear">Academic Year:</label>
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

                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="filterPubType">Type:</label>
                        <select
                          id="filterPubType"
                          className="pub-filter-select"
                          value={pubFilterType}
                          onChange={(e) => setPubFilterType(e.target.value)}
                        >
                          <option value="All">All Publication Types</option>
                          <option value="Journal">Journal</option>
                          <option value="Conference">Conference</option>
                          <option value="Book Chapter">Book Chapter</option>
                        </select>
                      </div>

                      <div className="pub-filter-group pub-search-box">
                        <Search size={14} className="pub-search-icon" />
                        <input
                          type="text"
                          className="pub-search-input"
                          placeholder="Search paper title, author, journal, DOI..."
                          value={pubSearchQuery}
                          onChange={(e) => setPubSearchQuery(e.target.value)}
                        />
                        {pubSearchQuery && (
                          <button
                            type="button"
                            className="pub-search-clear"
                            onClick={() => setPubSearchQuery('')}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {(pubFilterYear !== 'All' || pubFilterType !== 'All' || pubSearchQuery) && (
                        <button
                          type="button"
                          className="pub-reset-filter-btn"
                          onClick={() => {
                            setPubFilterYear('All');
                            setPubFilterType('All');
                            setPubSearchQuery('');
                          }}
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>

                    {/* Add Publication Form Card */}
                    {showAddPubForm && (
                      <div className="pub-form-card">
                        <div className="pub-form-header">
                          <div className="pub-form-title-group">
                            <Plus size={16} className="text-primary" />
                            <div>
                              <h3 className="pub-form-title">Enter Publication Details</h3>
                              <p className="pub-form-desc">Provide article, authorship, journal/conference, DOI, indexing, and Q-factor details</p>
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

                        <form onSubmit={handlePubFormSubmit} className="pub-form-body">
                          <div className="pub-form-grid">
                            {/* 1. Academic Year Dropdown */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Academic Year <span className="req-star">*</span>
                              </label>
                              <select
                                name="academicYear"
                                value={pubFormData.academicYear}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">2026-27 (Current)</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            {/* 2. Author */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Author (Primary) <span className="req-star">*</span>
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
                                Title of Paper <span className="req-star">*</span>
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
                                Name of Journal / Conference <span className="req-star">*</span>
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
                                National or International <span className="req-star">*</span>
                              </label>
                              <select
                                name="nationalOrInternational"
                                value={pubFormData.nationalOrInternational}
                                onChange={handlePubFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="International">International</option>
                                <option value="National">National</option>
                              </select>
                            </div>

                            {/* 7. Publication Type Dropdown (conference, journal, book chapter) */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Publication Type <span className="req-star">*</span>
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
                                <option value="Book Chapter">Book Chapter</option>
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
                                <option value="SCI">SCI (Science Citation Index)</option>
                                <option value="UGC-CARE">UGC-CARE / ABC List</option>
                                <option value="Web of Science">Web of Science (WoS)</option>
                                <option value="IEEE Xplore">IEEE Xplore</option>
                                <option value="Google Scholar">Google Scholar</option>
                                <option value="Other">Other Peer-Reviewed</option>
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
                                <option value="Q1">Q1 (Top 25% Quartile)</option>
                                <option value="Q2">Q2 (25% to 50% Quartile)</option>
                                <option value="Q3">Q3 (50% to 75% Quartile)</option>
                                <option value="Q4">Q4 (75% to 100% Quartile)</option>
                                <option value="Not Applicable">Not Applicable / NA</option>
                              </select>
                            </div>
                          </div>

                          {/* Form Footer Action Buttons */}
                          <div className="pub-form-actions">
                            <button type="submit" className="btn-primary-action">
                              <Check size={14} />
                              <span>Save Publication</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() => setPubFormData(initialPubFormState)}
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
                          <p className="empty-state-text">No publications found matching the selected filters.</p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => {
                              setPubFilterYear('All');
                              setPubFilterType('All');
                              setPubSearchQuery('');
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
                                <th style={{ width: '50px' }}>#</th>
                                <th>Academic Year</th>
                                <th>Title of Paper</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th style={{ width: '150px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPublications.map((pub, idx) => (
                                <tr key={pub.id}>
                                  <td className="cell-idx">{idx + 1}</td>
                                  <td><strong>{pub.academicYear}</strong></td>
                                  <td><strong>{pub.titleOfPaper}</strong></td>
                                  <td>{pub.publicationType}</td>
                                  <td><span className="pub-year-badge">Published</span></td>
                                  <td>
                                    <div className="achievement-row-actions">
                                      <button
                                        type="button"
                                        className="achievement-action-btn achievement-view-btn"
                                        title="View publication details"
                                        aria-label="View publication details"
                                        onClick={() => setAchievementViewRecord({ type: 'Publication', data: pub })}
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
              {achievementsSubTab === 'patent' && (
                <div>
                  <div className="erp-card-container">
                    {/* Toolbar with Title & Action */}
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Patents &amp; Intellectual Property Rights (IPR)</h2>
                        <p className="toolbar-subheading">Patents, Design Registrations, Copyrights, and Trademarks filed &amp; published</p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddPatentForm(!showAddPatentForm)}
                      >
                        {showAddPatentForm ? <X size={15} /> : <Plus size={15} />}
                        <span>{showAddPatentForm ? 'Close Form' : 'File New Patent'}</span>
                      </button>
                    </div>

                    {/* Top Filter Bar: First filter Academic Year, then Type, Status & Search */}
                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="filterPatentYear">Academic Year:</label>
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

                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="filterPatentType">Type:</label>
                        <select
                          id="filterPatentType"
                          className="pub-filter-select"
                          value={patentFilterType}
                          onChange={(e) => setPatentFilterType(e.target.value)}
                        >
                          <option value="All">All Patent Types</option>
                          <option value="Design">Design</option>
                          <option value="Utility">Utility</option>
                          <option value="Copyright">Copyright</option>
                          <option value="Trademark">Trademark</option>
                        </select>
                      </div>

                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="filterPatentStatus">Status:</label>
                        <select
                          id="filterPatentStatus"
                          className="pub-filter-select"
                          value={patentFilterStatus}
                          onChange={(e) => setPatentFilterStatus(e.target.value)}
                        >
                          <option value="All">All Status</option>
                          <option value="Published">Published</option>
                          <option value="Granted">Granted</option>
                        </select>
                      </div>

                      <div className="pub-filter-group pub-search-box">
                        <Search size={14} className="pub-search-icon" />
                        <input
                          type="text"
                          className="pub-search-input"
                          placeholder="Search title, applicant, application no..."
                          value={patentSearchQuery}
                          onChange={(e) => setPatentSearchQuery(e.target.value)}
                        />
                        {patentSearchQuery && (
                          <button
                            type="button"
                            className="pub-search-clear"
                            onClick={() => setPatentSearchQuery('')}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>

                      {(patentFilterYear !== 'All' || patentFilterType !== 'All' || patentFilterStatus !== 'All' || patentSearchQuery) && (
                        <button
                          type="button"
                          className="pub-reset-filter-btn"
                          onClick={() => {
                            setPatentFilterYear('All');
                            setPatentFilterType('All');
                            setPatentFilterStatus('All');
                            setPatentSearchQuery('');
                          }}
                        >
                          Reset Filters
                        </button>
                      )}
                    </div>

                    {/* Add Patent Form Card */}
                    {showAddPatentForm && (
                      <div className="pub-form-card">
                        <div className="pub-form-header">
                          <div className="pub-form-title-group">
                            <Plus size={16} className="text-primary" />
                            <div>
                              <h3 className="pub-form-title">Enter Patent / IPR Details</h3>
                              <p className="pub-form-desc">Provide applicant, title, application number, filing/published dates, status, type, and certificate</p>
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

                        <form onSubmit={handlePatentFormSubmit} className="pub-form-body">
                          <div className="pub-form-grid">
                            {/* 1. Academic Year Dropdown */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Academic Year <span className="req-star">*</span>
                              </label>
                              <select
                                name="academicYear"
                                value={patentFormData.academicYear}
                                onChange={handlePatentFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">2026-27 (Current)</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            {/* 2. Applicant Name */}
                            <div className="pub-form-field">
                              <label className="pub-field-label">
                                Applicant Name <span className="req-star">*</span>
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
                                Title of Patent / Invention <span className="req-star">*</span>
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
                                Application Number <span className="req-star">*</span>
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
                                Patent Filed Date <span className="req-star">*</span>
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
                                Type of Patent <span className="req-star">*</span>
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
                              <label htmlFor="patentCertFile" className="pat-upload-box">
                                <Upload size={14} className="text-primary" />
                                <span className="pat-upload-text">
                                  {patentFormData.certificateName ? patentFormData.certificateName : 'Choose Certificate (PDF/Image)'}
                                </span>
                                <input
                                  id="patentCertFile"
                                  type="file"
                                  onChange={handlePatentCertificateUpload}
                                  accept=".pdf,.png,.jpg,.jpeg"
                                  style={{ display: 'none' }}
                                />
                              </label>
                            </div>
                          </div>

                          {/* Form Footer Action Buttons */}
                          <div className="pub-form-actions">
                            <button type="submit" className="btn-primary-action">
                              <Check size={14} />
                              <span>Save Patent</span>
                            </button>
                            <button
                              type="button"
                              className="btn-secondary-action"
                              onClick={() => setPatentFormData(initialPatentFormState)}
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
                          <p className="empty-state-text">No patents found matching the selected filters.</p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => {
                              setPatentFilterYear('All');
                              setPatentFilterType('All');
                              setPatentFilterStatus('All');
                              setPatentSearchQuery('');
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
                                <th style={{ width: '50px' }}>#</th>
                                <th>Academic Year</th>
                                <th>Patent / Invention Title</th>
                                <th>Application Number</th>
                                <th>Status</th>
                                <th style={{ width: '150px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPatents.map((pat, idx) => (
                                <tr key={pat.id}>
                                  <td className="cell-idx">{idx + 1}</td>
                                  <td><strong>{pat.academicYear}</strong></td>
                                  <td><strong>{pat.title}</strong></td>
                                  <td>{pat.applicationNumber}</td>
                                  <td>
                                    <span className={`pat-status-badge ${pat.status.toLowerCase()}`}>{pat.status}</span>
                                  </td>
                                  <td>
                                    <div className="achievement-row-actions">
                                      <button
                                        type="button"
                                        className="achievement-action-btn achievement-view-btn"
                                        title="View patent details"
                                        aria-label="View patent details"
                                        onClick={() => setAchievementViewRecord({ type: 'Patent', data: pat })}
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
              {achievementsSubTab === 'funding' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Sponsored Research Projects &amp; Institutional Grants</h2>
                        <p className="toolbar-subheading">Grants sanctioned by Visvesvaraya Technological University, AICTE, and DST</p>
                      </div>
                      <button
                        type="button"
                        className="btn-primary-action"
                        onClick={() => setShowAddFundingForm(prev => !prev)}
                      >
                        {showAddFundingForm ? <X size={15} /> : <Plus size={15} />}
                        <span>{showAddFundingForm ? 'Close Form' : 'Add Funding Details'}</span>
                      </button>
                    </div>

                    <div className="pub-filters-bar">
                      <div className="pub-filter-group">
                        <label className="pub-filter-label" htmlFor="fundAcademicYearFilter">Academic Year:</label>
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
                      {fundingFilterYear !== 'All' && (
                        <button
                          type="button"
                          className="pub-reset-filter-btn"
                          onClick={() => setFundingFilterYear('All')}
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
                              <h3 className="pub-form-title">Enter Funding Details</h3>
                              <p className="pub-form-desc">Provide submission, project, investigator, agency, amount, status, and document information</p>
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

                        <form onSubmit={handleFundingFormSubmit} className="pub-form-body">
                          <div className="pub-form-grid">
                            <div className="pub-form-field">
                              <label className="pub-field-label" htmlFor="fundSubmissionDate">
                                Date of Submission <span className="req-star">*</span>
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
                              <label className="pub-field-label" htmlFor="fundAcademicYear">
                                Academic Year <span className="req-star">*</span>
                              </label>
                              <select
                                id="fundAcademicYear"
                                name="academicYear"
                                value={fundingFormData.academicYear}
                                onChange={handleFundingFormChange}
                                className="pub-form-input pub-form-select"
                                required
                              >
                                <option value="2026-27">2026-27 (Current)</option>
                                <option value="2025-26">2025-26</option>
                                <option value="2024-25">2024-25</option>
                                <option value="2023-24">2023-24</option>
                                <option value="2022-23">2022-23</option>
                              </select>
                            </div>

                            <div className="pub-form-field">
                              <label className="pub-field-label" htmlFor="fundProjectTitle">
                                Project Title <span className="req-star">*</span>
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
                              <label className="pub-field-label" htmlFor="fundPi">
                                Principal Investigator (PI) <span className="req-star">*</span>
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
                              <label className="pub-field-label" htmlFor="fundCoPi">
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
                              <label className="pub-field-label" htmlFor="fundAgency">
                                Funding Agency <span className="req-star">*</span>
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
                              <label className="pub-field-label" htmlFor="fundAmount">
                                Fund Amount (₹) <span className="req-star">*</span>
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
                              <label className="pub-field-label" htmlFor="fundStatus">
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
                              <label htmlFor="fundDocumentFile" className="pat-upload-box">
                                <Upload size={14} className="text-primary" />
                                <span className="pat-upload-text">
                                  {fundingFormData.documentName || 'Choose Proposal / Sanction Document'}
                                </span>
                                <input
                                  id="fundDocumentFile"
                                  type="file"
                                  onChange={handleFundingDocumentUpload}
                                  accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                                  style={{ display: 'none' }}
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
                            <button type="submit" className="btn-primary-action">
                              <CheckCircle2 size={15} />
                              <span>Submit Funding Details</span>
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    <div className="p-20">
                      {fundingList.filter((fund) => fundingFilterYear === 'All' || fund.academicYear === fundingFilterYear).length === 0 ? (
                        <div className="empty-state-box">
                          <TrendingUp size={32} className="text-muted" />
                          <p className="empty-state-text">No funding records found for the selected academic year.</p>
                          <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => setFundingFilterYear('All')}
                          >
                            Clear Filter
                          </button>
                        </div>
                      ) : (
                        <div className="erp-table-responsive achievements-table-wrap">
                          <table className="erp-data-table achievements-data-table">
                            <thead>
                              <tr>
                                <th style={{ width: '50px' }}>#</th>
                                <th>Academic Year</th>
                                <th>Project Title</th>
                                <th>Agency</th>
                                <th>Fund Amount</th>
                                <th>Status</th>
                                <th style={{ width: '150px' }}>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {fundingList
                                .filter((fund) => fundingFilterYear === 'All' || fund.academicYear === fundingFilterYear)
                                .map((fund, idx) => (
                                  <tr key={fund.id}>
                                    <td className="cell-idx">{idx + 1}</td>
                                    <td><strong>{fund.academicYear}</strong></td>
                                    <td><strong>{fund.projectTitle}</strong></td>
                                    <td>{fund.agency}</td>
                                    <td><strong>₹ {Number(fund.fundAmount).toLocaleString('en-IN')}</strong></td>
                                    <td>
                                      <span className={`pat-status-badge ${fund.status === 'Granted' ? 'granted' : 'published'}`}>
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
                                          onClick={() => setAchievementViewRecord({ type: 'Funding', data: fund })}
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
              {achievementsSubTab === 'research' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Research Domains &amp; Doctoral Supervision</h2>
                        <p className="toolbar-subheading">Supervision of registered Ph.D. scholars and institutional laboratory infrastructure</p>
                      </div>
                      <button type="button" className="btn-primary-action" onClick={() => showToast('Add research scholar record dialog opened')}>
                        <Plus size={15} />
                        <span>Log Research Record</span>
                      </button>
                    </div>

                    <div className="p-20">
                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--faculty-navy)', fontWeight: 800 }}>
                        Active Research Domains
                      </h4>
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
                        <span className="hero-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', padding: '6px 12px', fontSize: '0.8rem' }}>
                          Edge Computing &amp; TinyML for Embedded Vision
                        </span>
                        <span className="hero-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', padding: '6px 12px', fontSize: '0.8rem' }}>
                          Reconfigurable VLSI Architectures &amp; FPGA DSP
                        </span>
                        <span className="hero-pill" style={{ background: '#e0f2fe', color: '#0369a1', borderColor: '#bae6fd', padding: '6px 12px', fontSize: '0.8rem' }}>
                          IoT Wireless Sensor Networks for Environmental Telemetry
                        </span>
                      </div>

                      <h4 style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: 'var(--faculty-navy)', fontWeight: 800 }}>
                        VTU Registered Ph.D. Scholars Under Guidance
                      </h4>
                      <div className="erp-table-responsive">
                        <table className="erp-data-table">
                          <thead>
                            <tr>
                              <th>Scholar Name</th>
                              <th>USN</th>
                              <th>Research Area</th>
                              <th>Year</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><strong>Mrs. Priya Shenoy</strong></td>
                              <td><span className="erp-code-pill">4JK22PE001</span></td>
                              <td>Deep Learning Architectures for Edge UAV Detection</td>
                              <td>2022</td>
                              <td><span className="status-badge completed">Comprehensive Viva Completed</span></td>
                            </tr>
                            <tr>
                              <td><strong>Mr. Karthik Hegde</strong></td>
                              <td><span className="erp-code-pill">4JK23PE004</span></td>
                              <td>Ultra-Low Power Biosensors for Wearable Healthcare</td>
                              <td>2023</td>
                              <td><span className="status-badge upcoming">Coursework Completed</span></td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 5. AWARDS ---------------- */}
              {achievementsSubTab === 'awards' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Academic Honors, Medals &amp; Recognitions</h2>
                        <p className="toolbar-subheading">Distinctions awarded by professional societies, universities, and institutions</p>
                      </div>
                      <button type="button" className="btn-primary-action" onClick={() => showToast('Add award form opened')}>
                        <Plus size={15} />
                        <span>Add Award</span>
                      </button>
                    </div>

                    <div className="p-20">
                      <div className="award-item-row">
                        <div className="award-icon-badge"><Award size={22} /></div>
                        <div className="award-details">
                          <h4>Best Faculty Researcher of the Year (2024)</h4>
                          <p>Awarded by AJ Institute of Engineering &amp; Technology for highest number of Q1/Q2 Scopus indexed articles.</p>
                          <div className="award-meta">Conferred on Teachers' Day 2024 • Citation &amp; Cash Prize of ₹ 25,000</div>
                        </div>
                      </div>

                      <div className="award-item-row">
                        <div className="award-icon-badge"><Sparkles size={22} /></div>
                        <div className="award-details">
                          <h4>Elevation to IEEE Senior Member (SMIEEE)</h4>
                          <p>Elevated by the IEEE Board of Directors in recognition of significant professional contributions in signal processing.</p>
                          <div className="award-meta">IEEE Bangalore Section • Member ID: 94104921 • Elected: Nov 2024</div>
                        </div>
                      </div>

                      <div className="award-item-row">
                        <div className="award-icon-badge"><Award size={22} /></div>
                        <div className="award-details">
                          <h4>Best Conference Paper Presentation Award (ICSS-23)</h4>
                          <p>International Conference on Smart Systems for paper titled "FPGA Implementation of FFT for 5G Wireless Communications".</p>
                          <div className="award-meta">December 2023 • Plaque &amp; Certificate of Merit</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 6. WORKSHOPS ---------------- */}
              {achievementsSubTab === 'workshops' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Technical Workshops Record</h2>
                        <p className="toolbar-subheading">Record of hands-on workshops conducted as resource person and skill enhancement workshops attended</p>
                      </div>
                      <button type="button" className="btn-primary-action" onClick={() => showToast('Log workshop dialog opened')}>
                        <Plus size={15} />
                        <span>Log Workshop</span>
                      </button>
                    </div>

                    <div className="erp-table-responsive">
                      <table className="erp-data-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Workshop Theme &amp; Title</th>
                            <th>Role</th>
                            <th>Organizing Institute</th>
                            <th>Duration / Dates</th>
                            <th>Audience</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td><strong>Hands-on Workshop on ARM Cortex Microcontrollers &amp; RTOS for IoT</strong></td>
                            <td><span className="erp-credit-badge">Resource Person</span></td>
                            <td>AJIET Robotics &amp; IoT Club</td>
                            <td>14-Mar-2026 (1 Day)</td>
                            <td>90 UG Students</td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td><strong>National Hands-on Workshop on LabVIEW and Real-Time FPGA Systems</strong></td>
                            <td><span className="erp-code-pill">Participant</span></td>
                            <td>NITK Surathkal</td>
                            <td>18-20 Jan 2026 (3 Days)</td>
                            <td>Faculty &amp; Scholars</td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td><strong>IPR &amp; Patent Drafting for Engineering Innovations</strong></td>
                            <td><span className="erp-credit-badge">Keynote Speaker</span></td>
                            <td>AJIET IPR Cell</td>
                            <td>08-Nov-2025 (1 Day)</td>
                            <td>120 Faculty Members</td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td><strong>High-Frequency 5G Antenna Simulation using Ansys HFSS</strong></td>
                            <td><span className="erp-code-pill">Participant</span></td>
                            <td>VTU Center for PG Studies, Muddenahalli</td>
                            <td>12-14 Aug 2025 (3 Days)</td>
                            <td>Faculty Delegates</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 7. FDP ---------------- */}
              {achievementsSubTab === 'fdp' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Faculty Development Programs (FDPs)</h2>
                        <p className="toolbar-subheading">AICTE ATAL, NPTEL, and University sponsored multi-day faculty enhancement programs</p>
                      </div>
                      <button type="button" className="btn-primary-action" onClick={() => showToast('Log FDP dialog opened')}>
                        <Plus size={15} />
                        <span>Log FDP Record</span>
                      </button>
                    </div>

                    <div className="erp-table-responsive">
                      <table className="erp-data-table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>FDP Program Title</th>
                            <th>Category / Agency</th>
                            <th>Host Institution</th>
                            <th>Duration &amp; Dates</th>
                            <th>Certificate</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td><strong>5-Day National FDP on "AI &amp; Machine Learning in Signal Processing"</strong></td>
                            <td><span className="grant-pill">IEEE Bangalore Section</span></td>
                            <td>AJIET Mangaluru (As Coordinator)</td>
                            <td>22-26 Jul 2026 (5 Days)</td>
                            <td><span className="status-badge completed">Coordinator Certificate ✓</span></td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td><strong>AICTE ATAL 1-Week FDP on "Edge Computing &amp; TinyML for Smart Healthcare"</strong></td>
                            <td><span className="grant-pill">AICTE ATAL Academy</span></td>
                            <td>IIT Mandi (Online Mode)</td>
                            <td>15-20 Jan 2026 (1 Week)</td>
                            <td><span className="status-badge completed">Grade A Certificate ✓</span></td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td><strong>NPTEL-AICTE FDP on "Digital VLSI System Design" (12 Weeks)</strong></td>
                            <td><span className="grant-pill">MHRD / NPTEL</span></td>
                            <td>IIT Madras</td>
                            <td>Jul - Oct 2025 (12 Weeks)</td>
                            <td><span className="status-badge completed">Elite + Silver Medal ✓</span></td>
                          </tr>
                          <tr>
                            <td>4</td>
                            <td><strong>FDP on "Pedagogical Innovations in Outcome-Based Education (OBE)"</strong></td>
                            <td><span className="grant-pill">Internal Quality (IQAC)</span></td>
                            <td>AJIET Campus</td>
                            <td>10-14 Feb 2025 (5 Days)</td>
                            <td><span className="status-badge completed">Certified ✓</span></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* ---------------- 8. REPORT GENERATION ---------------- */}
              {achievementsSubTab === 'reports' && (
                <div>
                  <div className="erp-card-container">
                    <div className="erp-card-toolbar">
                      <div>
                        <h2 className="toolbar-heading">Accreditation &amp; Performance Appraisal Report Generation</h2>
                        <p className="toolbar-subheading">Generate and download official compliance reports for NBA, NAAC, VTU, and Annual Faculty Appraisal</p>
                      </div>
                    </div>

                    <div className="p-20">
                      <div className="report-cards-grid">
                        {/* Report 1: NBA Criteria 5 */}
                        <div className="report-export-card">
                          <div className="report-card-top">
                            <h4>NBA Criterion 5 Faculty Contributions Report</h4>
                            <p>
                              Compiles publications, FDPs attended/conducted, patents, faculty interaction with outside world, and R&amp;D grants formatted for NBA Peer Team.
                            </p>
                          </div>
                          <div className="report-card-actions">
                            <button type="button" className="btn-primary-action" onClick={() => showToast('NBA Criterion 5 Report (PDF) generated and download started!')}>
                              <Download size={14} />
                              <span>Export PDF</span>
                            </button>
                            <button type="button" className="btn-secondary-action" onClick={() => showToast('NBA Excel Sheet downloaded')}>
                              <span>Excel (.xlsx)</span>
                            </button>
                          </div>
                        </div>

                        {/* Report 2: NAAC Criteria 3 */}
                        <div className="report-export-card">
                          <div className="report-card-top">
                            <h4>NAAC Criterion 3 Research, Innovations &amp; Extension</h4>
                            <p>
                              Includes indexed journal metrics, citations, h-index, books/chapters published, funded research projects, and consultancy records.
                            </p>
                          </div>
                          <div className="report-card-actions">
                            <button type="button" className="btn-primary-action" onClick={() => showToast('NAAC Criterion 3 Report (PDF) downloaded!')}>
                              <Download size={14} />
                              <span>Export PDF</span>
                            </button>
                            <button type="button" className="btn-secondary-action" onClick={() => showToast('NAAC Excel Sheet downloaded')}>
                              <span>Excel (.xlsx)</span>
                            </button>
                          </div>
                        </div>

                        {/* Report 3: VTU PBAS Self-Appraisal */}
                        <div className="report-export-card">
                          <div className="report-card-top">
                            <h4>VTU Performance Based Appraisal System (PBAS)</h4>
                            <p>
                              Annual faculty self-appraisal score sheet computing Category I (Teaching), Category II (Co-curricular), and Category III (Research) API scores.
                            </p>
                          </div>
                          <div className="report-card-actions">
                            <button type="button" className="btn-primary-action" onClick={() => showToast('VTU PBAS Report (PDF) downloaded!')}>
                              <Download size={14} />
                              <span>Export PDF</span>
                            </button>
                            <button type="button" className="btn-secondary-action" onClick={() => showToast('PBAS Score Excel downloaded')}>
                              <span>Excel (.xlsx)</span>
                            </button>
                          </div>
                        </div>

                        {/* Report 4: Consolidated CV Dossier */}
                        <div className="report-export-card">
                          <div className="report-card-top">
                            <h4>Complete Consolidated Faculty Dossier &amp; Bio-Data</h4>
                            <p>
                              Executive biographical curriculum vitae combining qualifications, teaching load, publications, grants, and university bodies membership.
                            </p>
                          </div>
                          <div className="report-card-actions">
                            <button type="button" className="btn-primary-action" onClick={() => window.print()}>
                              <Printer size={14} />
                              <span>Print / PDF CV</span>
                            </button>
                            <button type="button" className="btn-secondary-action" onClick={() => showToast('Dossier link copied to clipboard')}>
                              <Share2 size={13} />
                              <span>Share Link</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 3: EVENT ORGANIZATIONS */}
          {/* ============================================================ */}
          {activeTab === 'events' && (
            <div className="erp-tab-content">
              {/* Events Table Container */}
              <div className="erp-card-container">
                <div className="erp-card-toolbar">
                  <div>
                    <h2 className="toolbar-heading">Other Responsibilities</h2>
                    <p className="toolbar-subheading">Academic, technical, cultural and extracurricular activities</p>
                  </div>
                  <button
                    type="button"
                    className="btn-primary-action"
                    onClick={() => setShowAddEventForm((previous) => !previous)}
                  >
                    {showAddEventForm ? <X size={15} /> : <Plus size={15} />}
                    <span>{showAddEventForm ? 'Close Form' : 'Register New Event'}</span>
                  </button>
                </div>

                {showAddEventForm && (
                  <div className="pub-form-card">
                    <div className="pub-form-header">
                      <div className="pub-form-title-group">
                        <Plus size={16} className="text-primary" />
                        <div>
                          <h3 className="pub-form-title">Register New Event</h3>
                          <p className="pub-form-desc">Add program, department, attendance and reporting details.</p>
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

                    <form onSubmit={handleCreateEvent} className="pub-form-body">
                      <section className="event-form-section">
                        <h4 className="event-form-section-title">Program Details</h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">Name of Program <span className="req-star">*</span></label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="Enter program name"
                              value={newEvent.title}
                              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                              required
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Date <span className="req-star">*</span></label>
                            <input
                              type="date"
                              className="pub-form-input"
                              value={newEvent.programDate}
                              onChange={(e) => setNewEvent({ ...newEvent, programDate: e.target.value })}
                              required
                            />
                          </div>

                          <div className="event-form-field event-form-span-2">
                            <label className="pub-field-label">Details of the Resource Person</label>
                            <textarea
                              className="pub-form-input"
                              rows={3}
                              placeholder="Name, designation, organization and contact details"
                              value={newEvent.resourcePersonDetails}
                              onChange={(e) => setNewEvent({ ...newEvent, resourcePersonDetails: e.target.value })}
                            />
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">Departments</h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">Organizing Department <span className="req-star">*</span></label>
                            <select
                              className="pub-form-input pub-form-select"
                              value={newEvent.organizingDepartment}
                              onChange={(e) => setNewEvent({ ...newEvent, organizingDepartment: e.target.value })}
                              required
                            >
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>{department}</option>
                              ))}
                            </select>
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Associated Department <span className="req-star">*</span></label>
                            <select
                              className="pub-form-input pub-form-select"
                              value={newEvent.associatedDepartment}
                              onChange={(e) => setNewEvent({ ...newEvent, associatedDepartment: e.target.value })}
                              required
                            >
                              <option value="">Select department</option>
                              {DEPARTMENTS.map((department) => (
                                <option key={department} value={department}>{department}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">Number of Participants</h4>
                        <div className="event-participants-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">Student Count</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.studentCount}
                              onChange={(e) => setNewEvent({ ...newEvent, studentCount: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Faculty Count</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.facultyCount}
                              onChange={(e) => setNewEvent({ ...newEvent, facultyCount: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">External Participant Count</label>
                            <input
                              type="number"
                              min="0"
                              step="1"
                              className="pub-form-input"
                              value={newEvent.externalParticipantCount}
                              onChange={(e) => setNewEvent({ ...newEvent, externalParticipantCount: e.target.value })}
                            />
                          </div>
                        </div>
                      </section>

                      <section className="event-form-section">
                        <h4 className="event-form-section-title">Program Outcomes &amp; Follow-up</h4>
                        <div className="event-form-grid">
                          <div className="event-form-field">
                            <label className="pub-field-label">PO Mapping</label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="e.g. PO1, PO3, PO5"
                              value={newEvent.poMapping}
                              onChange={(e) => setNewEvent({ ...newEvent, poMapping: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Coordinators</label>
                            <input
                              type="text"
                              className="pub-form-input"
                              placeholder="Coordinator names"
                              value={newEvent.coordinators}
                              onChange={(e) => setNewEvent({ ...newEvent, coordinators: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Expenditure</label>
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="pub-form-input"
                              value={newEvent.expenditure}
                              onChange={(e) => setNewEvent({ ...newEvent, expenditure: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field">
                            <label className="pub-field-label">Social Media Link</label>
                            <input
                              type="url"
                              className="pub-form-input"
                              placeholder="https://..."
                              value={newEvent.socialMediaLink}
                              onChange={(e) => setNewEvent({ ...newEvent, socialMediaLink: e.target.value })}
                            />
                          </div>

                          <div className="event-form-field event-form-span-2">
                            <label className="pub-field-label">Upload Report</label>
                            <input
                              type="file"
                              className="pub-form-input"
                              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              onChange={(e) => setNewEvent({ ...newEvent, reportFile: e.target.files?.[0] || null })}
                            />
                            {newEvent.reportFile && <span>{newEvent.reportFile.name}</span>}
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
                        onChange={(e) => setEventAcademicYearFilter(e.target.value)}
                      >
                        <option value="All">All Academic Years</option>
                        {ACADEMIC_YEAR_OPTIONS.map((year) => (
                          <option key={year} value={year}>{year}</option>
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
                          <option key={type} value={type}>{type}</option>
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
                        <th style={{ width: '50px' }}>#</th>
                        <th>Program Name</th>
                        <th style={{ width: '150px' }}>Type of Event</th>
                        <th style={{ width: '110px' }}>Academic Year</th>
                        <th style={{ width: '120px' }}>Program Date</th>
                        <th style={{ width: '120px' }}>Participants</th>
                        <th style={{ width: '90px' }}>Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEvents.length ? filteredEvents.map((ev, idx) => (
                        <tr key={ev.id}>
                          <td className="cell-idx">{idx + 1}</td>
                          <td>
                            <strong style={{ color: 'var(--faculty-text-main)', fontSize: '0.88rem' }}>
                              {ev.title}
                            </strong>
                          </td>
                          <td>
                            <span className="erp-code-pill">{ev.category}</span>
                          </td>
                          <td>
                            <span style={{ fontWeight: 600, color: '#334155' }}>{ev.academicYear}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{ev.dates}</span>
                          </td>
                          <td>
                            <span className="erp-credit-badge">{ev.participants}</span>
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
                      )) : (
                        <tr>
                          <td colSpan="7" style={{ textAlign: 'center', color: '#64748b', padding: '1.25rem' }}>
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
                    <span>Program records support institutional reporting and accreditation documentation.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* VIEW 4: SUBJECT DETAILS */}
          {/* ============================================================ */}
          {activeTab === 'courses' && (
            <section className="erp-card-container subject-handling-card">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Subject Details</h2>
                  <p className="toolbar-subheading">Select an academic year, semester and subject to view attendance or IA marks.</p>
                </div>
              </div>

              <div className="subject-handling-content">
                <div className="subject-selection-grid">
                  <div className="pub-form-field">
                    <label className="pub-field-label" htmlFor="subject-academic-year">Academic Year</label>
                    <select
                      id="subject-academic-year"
                      className="pub-form-input pub-form-select"
                      value={subjectAcademicYear}
                      onChange={(event) => {
                        const academicYear = event.target.value;
                        const semesters = SUBJECTS_BY_ACADEMIC_YEAR[academicYear]
                          ? Object.keys(SUBJECTS_BY_ACADEMIC_YEAR[academicYear])
                          : [];
                        setSubjectAcademicYear(academicYear);
                        setSubjectSemester(semesters[0] || '');
                        setSelectedSubjectId('');
                        setSubjectAssessmentTab('attendance');
                      }}
                    >
                      <option value="">Select academic year</option>
                      {ACADEMIC_YEAR_OPTIONS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label className="pub-field-label" htmlFor="subject-semester">Semester</label>
                    <select
                      id="subject-semester"
                      className="pub-form-input pub-form-select"
                      value={subjectSemester}
                      disabled={!subjectAcademicYear}
                      onChange={(event) => {
                        setSubjectSemester(event.target.value);
                        setSelectedSubjectId('');
                        setSubjectAssessmentTab('attendance');
                      }}
                    >
                      <option value="">Select semester</option>
                      {availableSubjectSemesters.map((semester) => (
                        <option key={semester} value={semester}>{semester}</option>
                      ))}
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label className="pub-field-label" htmlFor="subject-selection">Subject</label>
                    <select
                      id="subject-selection"
                      className="pub-form-input pub-form-select"
                      value={selectedSubjectId}
                      disabled={!subjectSemester}
                      onChange={(event) => {
                        setSelectedSubjectId(event.target.value);
                        setSubjectAssessmentTab('attendance');
                      }}
                    >
                      <option value="">Select subject</option>
                      {availableSubjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.code} - {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p className="subject-sample-note">
                  Subject assignments are sample data for now and will be fetched from the HOD later.
                </p>

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
                        <strong>{subjectSemester}</strong>
                      </div>
                    </div>

                    <div className="subject-assessment-tabs" role="tablist" aria-label="Subject assessment view">
                      <button
                        type="button"
                        role="tab"
                        aria-selected={subjectAssessmentTab === 'attendance'}
                        className={subjectAssessmentTab === 'attendance' ? 'active' : ''}
                        onClick={() => setSubjectAssessmentTab('attendance')}
                      >
                        Attendance
                      </button>
                      <button
                        type="button"
                        role="tab"
                        aria-selected={subjectAssessmentTab === 'ia'}
                        className={subjectAssessmentTab === 'ia' ? 'active' : ''}
                        onClick={() => setSubjectAssessmentTab('ia')}
                      >
                        IA Marks
                      </button>
                    </div>

                    <div className="erp-table-responsive" role="tabpanel">
                      {subjectAssessmentTab === 'attendance' ? (
                        <table className="erp-data-table">
                          <thead>
                            <tr>
                              <th>Student ID</th>
                              <th>Student Name</th>
                              <th>Classes Held</th>
                              <th>Classes Attended</th>
                              <th>Attendance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSubject.attendanceRecords.map((record) => (
                              <tr key={record.studentId}>
                                <td className="cell-code">{record.studentId}</td>
                                <td>{record.studentName}</td>
                                <td>{record.classesHeld}</td>
                                <td>{record.classesAttended}</td>
                                <td>
                                  {((record.classesAttended / record.classesHeld) * 100).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <table className="erp-data-table">
                          <thead>
                            <tr>
                              <th>Student ID</th>
                              <th>Student Name</th>
                              <th>IA 1</th>
                              <th>IA 2</th>
                              <th>IA 3</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedSubject.iaMarks.map((record) => (
                              <tr key={record.studentId}>
                                <td className="cell-code">{record.studentId}</td>
                                <td>{record.studentName}</td>
                                <td>{record.ia1}</td>
                                <td>{record.ia2}</td>
                                <td>{record.ia3}</td>
                                <td>{record.ia1 + record.ia2 + record.ia3}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="subject-empty-state" role="status">
                    Select a subject to view its attendance and IA marks.
                  </div>
                )}
              </div>
            </section>
          )}

          {activeTab === 'timetable' && (
            <section className="erp-card-container timetable-card">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Time Table</h2>
                  <p className="toolbar-subheading">Select an academic year and semester to upload or view its timetable.</p>
                </div>
              </div>

              <div className="timetable-form">
                <div className="timetable-controls">
                  <div className="pub-form-field">
                    <label className="pub-field-label" htmlFor="timetable-academic-year">Academic Year</label>
                    <select
                      id="timetable-academic-year"
                      className="pub-form-input pub-form-select"
                      value={timetableAcademicYear}
                      onChange={(event) => setTimetableAcademicYear(event.target.value)}
                    >
                      <option value="2026-27">2026-27</option>
                      <option value="2025-26">2025-26</option>
                      <option value="2024-25">2024-25</option>
                      <option value="2023-24">2023-24</option>
                    </select>
                  </div>

                  <div className="pub-form-field">
                    <label className="pub-field-label" htmlFor="timetable-semester">Semester</label>
                    <select
                      id="timetable-semester"
                      className="pub-form-input pub-form-select"
                      value={timetableSemester}
                      onChange={(event) => setTimetableSemester(event.target.value)}
                    >
                      <option value="Odd">Odd</option>
                      <option value="Even">Even</option>
                    </select>
                  </div>

                  <div className="pub-form-field timetable-upload-field">
                    <label className="pub-field-label" htmlFor="timetable-file">Upload Time Table</label>
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
                      : 'No timetable uploaded for this academic year and semester.'}
                  </p>
                  <button
                    type="button"
                    className="btn-secondary-action"
                    onClick={handleViewTimetable}
                    disabled={!selectedTimetableFile}
                  >
                    <Eye size={14} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {activeTab === 'message' && (
            <section className="erp-card-container faculty-message-page">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Message Students</h2>
                  <p className="toolbar-subheading">Compose a message for all students or selected USNs.</p>
                </div>
              </div>

              <div className="message-page-content">
                <form className="message-composer" onSubmit={handleSendMessage}>
                  <div className="message-section-heading">
                    <h3>Recipients</h3>
                    <span>Choose who should receive this message.</span>
                  </div>

                  <div className="message-recipient-modes">
                    <label className={`message-recipient-mode ${messageRecipientMode === 'all' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="message-recipient-mode"
                        value="all"
                        checked={messageRecipientMode === 'all'}
                        onChange={() => setMessageRecipientMode('all')}
                      />
                      <span>
                        <strong>All Students</strong>
                        <small>Send to the entire student body</small>
                      </span>
                    </label>

                    <label className={`message-recipient-mode ${messageRecipientMode === 'selected' ? 'active' : ''}`}>
                      <input
                        type="radio"
                        name="message-recipient-mode"
                        value="selected"
                        checked={messageRecipientMode === 'selected'}
                        onChange={() => setMessageRecipientMode('selected')}
                      />
                      <span>
                        <strong>Select by USN</strong>
                        <small>Choose specific student recipients</small>
                      </span>
                    </label>
                  </div>

                  {messageRecipientMode === 'selected' && (
                    <div className="message-usn-picker">
                      <div className="message-section-heading">
                        <h3>Student USNs</h3>
                        <span>{selectedMessageUsns.length} selected</span>
                      </div>
                      {selectedMessageUsns.length > 0 && (
                        <div className="message-selected-usns">
                          {selectedMessageUsns.map((usn) => (
                            <span className="message-selected-usn" key={usn}>
                              {usn}
                              <button
                                type="button"
                                aria-label={`Remove ${usn}`}
                                onClick={() => setSelectedMessageUsns((previous) => previous.filter((selectedUsn) => selectedUsn !== usn))}
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
                          role="combobox"
                          aria-label="Search student USN"
                          aria-autocomplete="list"
                          aria-expanded={isMessageUsnDropdownOpen}
                          aria-controls="faculty-message-usn-options"
                          placeholder="Search or select a student USN"
                          value={messageUsnQuery}
                          onFocus={() => setIsMessageUsnDropdownOpen(true)}
                          onBlur={() => setIsMessageUsnDropdownOpen(false)}
                          onChange={(event) => setMessageUsnQuery(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Escape') setIsMessageUsnDropdownOpen(false);
                          }}
                        />
                        {isMessageUsnDropdownOpen && (
                          <div className="message-usn-options" id="faculty-message-usn-options" role="listbox" aria-label="Available student USNs">
                            {filteredMessageUsns.length > 0 ? (
                              filteredMessageUsns.map((usn) => (
                                <button
                                  type="button"
                                  className="message-usn-option"
                                  role="option"
                                  aria-selected="false"
                                  key={usn}
                                  onMouseDown={(event) => event.preventDefault()}
                                  onClick={() => {
                                    setSelectedMessageUsns((previous) => [...previous, usn]);
                                    setMessageUsnQuery('');
                                  }}
                                >
                                  {usn}
                                </button>
                              ))
                            ) : (
                              <p className="message-usn-no-results">No matching USNs found.</p>
                            )}
                          </div>
                        )}
                      </div>
                      <p className="message-sample-note">Sample USNs are shown for now; student recipients will be loaded from the roster later.</p>
                    </div>
                  )}

                  <div className="message-composer-fields">
                    <div className="pub-form-field">
                      <label className="pub-field-label" htmlFor="faculty-message-subject">Subject (optional)</label>
                      <input
                        id="faculty-message-subject"
                        type="text"
                        className="pub-form-input"
                        value={messageSubject}
                        onChange={(event) => setMessageSubject(event.target.value)}
                        placeholder="Enter a subject"
                      />
                    </div>

                    <div className="pub-form-field">
                      <label className="pub-field-label" htmlFor="faculty-message-body">Message</label>
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
                    <span>Messages are stored in this session until a messaging service is connected.</span>
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
                        <article className="message-history-item" key={message.id}>
                          <div className="message-history-meta">
                            <strong>
                              {message.recipientMode === 'all'
                                ? 'All Students'
                                : `${message.recipients.length} selected USN${message.recipients.length === 1 ? '' : 's'}`}
                            </strong>
                            <time>{message.sentAt}</time>
                          </div>
                          {message.subject && <h4>{message.subject}</h4>}
                          <p>{message.body}</p>
                          {message.recipientMode === 'selected' && (
                            <div className="message-history-usns">{message.recipients.join(', ')}</div>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <p className="message-history-empty">No messages have been composed yet.</p>
                  )}
                </section>
              </div>
            </section>
          )}

          {activeTab === 'leave' && (
            <section className="erp-card-container" aria-live="polite">
              <div className="erp-card-toolbar">
                <div>
                  <h2 className="toolbar-heading">Leave Apply</h2>
                  <p className="toolbar-subheading">No information is available in this section yet.</p>
                </div>
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
                ['Name of Program', eventViewRecord.title],
                ['Academic Year', eventViewRecord.academicYear],
                ['Type of Event', eventViewRecord.category],
                ['Program Date', eventViewRecord.dates],
                ['Details of the Resource Person', eventViewRecord.resourcePersonDetails],
                ['Organizing Department', eventViewRecord.organizingDepartment || eventViewRecord.sponsor],
                ['Associated Department', eventViewRecord.associatedDepartment],
                ['Student Count', eventViewRecord.studentCount],
                ['Faculty Count', eventViewRecord.facultyCount],
                ['External Participant Count', eventViewRecord.externalParticipantCount],
                ['Total Participants', eventViewRecord.participants],
                ['PO Mapping', eventViewRecord.poMapping],
                ['Coordinators', eventViewRecord.coordinators || eventViewRecord.role],
                ['Expenditure', eventViewRecord.expenditure || eventViewRecord.grant],
                ['Social Media Link', eventViewRecord.socialMediaLink],
                ['Uploaded Report', eventViewRecord.reportFileName],
                ['Status', eventViewRecord.status]
              ].map(([label, value]) => (
                <div className="achievement-detail-item" key={label}>
                  <span>{label}</span>
                  {label === 'Uploaded Report' && eventViewRecord.reportFile ? (
                    <button type="button" className="btn-secondary-action" onClick={handleViewEventReport}>
                      <Eye size={14} />
                      <span>View Report</span>
                    </button>
                  ) : label === 'Social Media Link' && value ? (
                    <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                  ) : (
                    <strong>{value === undefined || value === null || value === '' ? '-' : value}</strong>
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
              {achievementViewRecord.type === 'Publication' && (
                <>
                  {[
                    ['Academic Year', achievementViewRecord.data.academicYear],
                    ['Title of Paper', achievementViewRecord.data.titleOfPaper],
                    ['Author', achievementViewRecord.data.author],
                    ['Co-Author', achievementViewRecord.data.coAuthor],
                    ['Journal / Conference', achievementViewRecord.data.journalConferenceName],
                    ['National / International', achievementViewRecord.data.nationalOrInternational],
                    ['Publication Type', achievementViewRecord.data.publicationType],
                    ['ISSN / ISBN', achievementViewRecord.data.issnIsbn],
                    ['DOI Link', achievementViewRecord.data.doiLink],
                    ['Indexing', achievementViewRecord.data.indexing],
                    ['Q Factor', achievementViewRecord.data.qFactor],
                    ['Citations', achievementViewRecord.data.citations || 0]
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || '-'}</strong>
                    </div>
                  ))}
                </>
              )}
              {achievementViewRecord.type === 'Patent' && (
                <>
                  {[
                    ['Academic Year', achievementViewRecord.data.academicYear],
                    ['Applicant Name', achievementViewRecord.data.applicantName],
                    ['Co-Applicant Name', achievementViewRecord.data.coApplicantName],
                    ['Patent / Invention Title', achievementViewRecord.data.title],
                    ['Application Number', achievementViewRecord.data.applicationNumber],
                    ['Patent Filed Date', achievementViewRecord.data.filedDate],
                    ['Patent Published Date', achievementViewRecord.data.publishedDate],
                    ['Status', achievementViewRecord.data.status],
                    ['Patent Type', achievementViewRecord.data.patentType],
                    ['Certificate', achievementViewRecord.data.certificateName]
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || '-'}</strong>
                    </div>
                  ))}
                </>
              )}
              {achievementViewRecord.type === 'Funding' && (
                <>
                  {[
                    ['Academic Year', achievementViewRecord.data.academicYear],
                    ['Date of Submission', achievementViewRecord.data.submissionDate],
                    ['Project Title', achievementViewRecord.data.projectTitle],
                    ['Principal Investigator', achievementViewRecord.data.pi],
                    ['Co-Principal Investigator', achievementViewRecord.data.coPi],
                    ['Funding Agency', achievementViewRecord.data.agency],
                    ['Fund Amount', `₹ ${Number(achievementViewRecord.data.fundAmount).toLocaleString('en-IN')}`],
                    ['Status', achievementViewRecord.data.status],
                    ['Uploaded Document', achievementViewRecord.data.documentName]
                  ].map(([label, value]) => (
                    <div className="achievement-detail-item" key={label}>
                      <span>{label}</span>
                      <strong>{value || '-'}</strong>
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
