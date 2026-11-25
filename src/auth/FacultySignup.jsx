import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./FacultySignup.css";
import ajietLogo from "../assets/ajiet-logo.png";
import Footer from "../common/Footer";
import { registerFacultyApi } from "../services/apiService";
import { DEPARTMENTS } from "../data/departments";
import {
  Briefcase,
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  CheckCircle2,
  RotateCcw,
  Building,
  Printer,
  BadgeCheck,
  BookOpen,
  Award,
  Camera,
  Fingerprint,
  FileText,
  Landmark,
} from "lucide-react";

const DESIGNATIONS = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Head of Department (HOD)",
  "Adjunct Professor",
  "Visiting Faculty",
  "Senior Lecturer",
  "Lecturer",
  "Research Scientist / Fellow",
  "Lab Instructor / Technical Superintendent",
];

const PHD_STREAMS = [
  "Engineering & Technology",
  "Computer Science & Engineering",
  "Artificial Intelligence & Data Science",
  "Electronics & Communication Engineering",
  "Electrical & Electronics Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Sciences",
  "Management",
  "Computer Applications",
  "Other",
];

const PHD_COURSES = [
  "Ph.D. in Engineering & Technology",
  "Ph.D. in Computer Science & Engineering",
  "Ph.D. in Artificial Intelligence & Machine Learning",
  "Ph.D. in Artificial Intelligence & Data Science",
  "Ph.D. in Electronics & Communication Engineering",
  "Ph.D. in VLSI Design",
  "Ph.D. in Electrical & Electronics Engineering",
  "Ph.D. in Mechanical Engineering",
  "Ph.D. in Civil Engineering",
  "Ph.D. in Mathematics",
  "Ph.D. in Physics",
  "Ph.D. in Chemistry",
  "Ph.D. in Management",
  "Ph.D. in Computer Applications",
  "Other",
];

const PG_STREAMS = [
  "Engineering & Technology",
  "Computer Applications",
  "Management",
  "Science",
  "Commerce",
  "Arts & Humanities",
  "Other",
];

const PG_COURSES = [
  "M.Tech in Computer Science & Engineering",
  "M.Tech in Artificial Intelligence & Machine Learning",
  "M.Tech in Artificial Intelligence & Data Science",
  "M.Tech in Information Science & Engineering",
  "M.Tech in Electronics & Communication Engineering",
  "M.Tech in VLSI Design",
  "M.Tech in Electrical & Electronics Engineering",
  "M.Tech in Mechanical Engineering",
  "M.Tech in Civil Engineering",
  "M.Tech in Structural Engineering",
  "M.E. in Engineering",
  "MCA",
  "MBA",
  "M.Sc. in Computer Science",
  "M.Sc. in Mathematics",
  "M.Sc. in Physics",
  "M.Sc. in Chemistry",
  "M.Com",
  "M.A.",
  "Other",
];

const UG_STREAMS = [
  "Engineering & Technology",
  "Computer Applications",
  "Science",
  "Commerce",
  "Arts & Humanities",
  "Other",
];

const UG_COURSES = [
  "B.E. in Computer Science & Engineering",
  "B.E. in Artificial Intelligence & Machine Learning",
  "B.E. in Artificial Intelligence & Data Science",
  "B.E. in Information Science & Engineering",
  "B.E. in Electronics & Communication Engineering",
  "B.E. in VLSI Design and Technology",
  "B.E. in Electrical & Electronics Engineering",
  "B.E. in Mechanical Engineering",
  "B.E. in Civil Engineering",
  "B.Tech.",
  "BCA",
  "B.Sc. in Computer Science",
  "B.Sc. in Mathematics",
  "B.Sc. in Physics",
  "B.Sc. in Chemistry",
  "B.Com",
  "B.A.",
  "BBA",
  "Other",
];

const ACADEMIC_YEARS = Array.from(
  { length: new Date().getFullYear() - 1959 },
  (_, index) => String(new Date().getFullYear() - index),
);

const TITLES = ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms."];

const CATEGORIES = [
  "General Merit (GM)",
  "Scheduled Caste (SC)",
  "Scheduled Tribe (ST)",
  "Category-I (Cat-1)",
  "Category-II(A) (2A)",
  "Category-II(B) (2B)",
  "Category-III(A) (3A)",
  "Category-III(B) (3B)",
  "Other Backward Classes (OBC)",
  "Other",
];

const RELIGIONS = [
  "Hindu",
  "Muslim",
  "Christian",
  "Jain",
  "Sikh",
  "Buddhist",
  "Parsi",
  "Other",
];

const COUNTRY_CODES = [
  { code: "+91", label: "+91 (India)" },
  { code: "+1", label: "+1 (USA / Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+61", label: "+61 (Australia)" },
];

const POPULAR_BANKS = [
  "Canara Bank",
  "State Bank of India (SBI)",
  "Karnataka Bank",
  "HDFC Bank",
  "ICICI Bank",
  "Union Bank of India",
  "Bank of Baroda",
  "Punjab National Bank",
  "Axis Bank",
  "Kotak Mahindra Bank",
  "Other Bank",
];

const isValidNumberRange = (val, max = 50) => {
  if (val === "" || val === undefined) return true;
  const num = parseFloat(val);
  return !isNaN(num) && num >= 0 && num <= max;
};

// Zod Schema for institutional faculty onboarding
const facultySignupZodSchema = z
  .object({
    // 1. Faculty Details (Section 01)
    department: z.string().min(1, "Department name is required."),
    title: z.string().min(1, "Title is required."),
    fullName: z
      .string()
      .trim()
      .min(1, "Full Name (as per Aadhaar Card) is required.")
      .min(3, "Name must be at least 3 characters."),
    facultyId: z
      .string()
      .trim()
      .min(1, "Faculty Institution ID is required.")
      .regex(
        /^[A-Z0-9]{10}$/,
        "Faculty Institution ID must be exactly 10 alphanumeric characters (e.g. ABCDE12345).",
      ),
    vtuId: z
      .string()
      .trim()
      .min(1, "VTU ID is required."),
    gender: z.string().min(1, "Gender is required."),
    religion: z.string().min(1, "Religion is required."),
    caste: z
      .string()
      .trim()
      .min(1, "Caste / Sub-Caste is required."),
    category: z.string().min(1, "Category is required."),
    dob: z.string().min(1, "Date of Birth is required."),
    designation: z.string().min(1, "Designation is required."),
    doj: z.string().min(1, "Date of Joining is required."),

    // 2. Educational Details (Section 02)
    // Ph.D Details
    phdStream: z.string().optional(),
    phdCourse: z.string().optional(),
    phdUniversity: z.string().optional(),
    phdSpecialization: z.string().optional(),
    phdYearOfAward: z
      .string()
      .optional()
      .refine(
        (val) => !val || /^(19|20)\d{2}$/.test(val),
        "Enter a valid 4-digit year (e.g. 2021).",
      ),

    // PG Details
    pgStream: z.string().trim().min(1, "PG Stream is required."),
    pgCourse: z.string().trim().min(1, "PG Course is required."),
    pgUniversity: z.string().trim().min(1, "PG University is required."),
    pgYearOfPassing: z
      .string()
      .trim()
      .min(1, "PG Year of Passing is required.")
      .regex(/^(19|20)\d{2}$/, "Enter a valid 4-digit year (e.g. 2016)."),

    // UG Details
    ugStream: z.string().trim().min(1, "UG Stream is required."),
    ugCourse: z
      .string()
      .trim()
      .min(1, "UG Course / Branch / Combination is required."),
    ugUniversity: z.string().trim().min(1, "UG University is required."),
    ugYearOfPassing: z
      .string()
      .trim()
      .min(1, "UG Year of Passing is required.")
      .regex(/^(19|20)\d{2}$/, "Enter a valid 4-digit year (e.g. 2014)."),

    // 3. Experience Details (Section 03)
    teachingExpLecturerAsstProf: z
      .string()
      .trim()
      .min(1, "Teaching experience as Lecturer / Asst. Professor is required.")
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid experience (0 - 50 years).",
      ),
    industryExpYears: z
      .string()
      .trim()
      .min(1, "Industry experience is required.")
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid industry experience (0 - 50 years).",
      ),
    teachingExpAssocProf: z
      .string()
      .optional()
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid experience (0 - 50 years).",
      ),
    teachingExpProf: z
      .string()
      .optional()
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid experience (0 - 50 years).",
      ),
    researchExpYears: z
      .string()
      .optional()
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid research experience (0 - 50 years).",
      ),
    otherExpYears: z
      .string()
      .optional()
      .refine(
        (v) => isValidNumberRange(v),
        "Enter valid experience (0 - 50 years).",
      ),

    // 4. Other Details (Section 04)
    mobile: z
      .string()
      .trim()
      .min(1, "Mobile number is required.")
      .regex(/^\d{10}$/, "Mobile number must be strictly 10 digits."),
    email: z
      .string()
      .trim()
      .min(1, "E-mail is required.")
      .email("Enter a valid email address (e.g. staff@ajiet.ac.in)."),
    address: z.string().trim().min(1, "Address is required."),
    panNumber: z
      .string()
      .trim()
      .min(1, "PAN Number is required.")
      .regex(
        /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        "PAN must follow format: 5 letters + 4 digits + 1 letter (e.g. ABCDE1234F).",
      ),
    pfNpsNumber: z.string().optional(),
    aadhaarNumber: z
      .string()
      .trim()
      .min(1, "Aadhaar number is required.")
      .regex(/^\d{12}$/, "Aadhaar number must be strictly 12 digits."),
    photograph: z.string().optional(),
    awards: z.string().optional(),
    linkedinProfile: z.string().optional(),
    academiaProfile: z.string().optional(),
    researchGateProfile: z.string().optional(),
    vtuFacultyId: z.string().optional(),
    firstYearTeacher: z.string().min(1, "First year teacher status is required."),
    biometricImpressionLht: z.string().optional(),

    // 5. Bank Details (Section 05)
    bankAccountNumber: z
      .string()
      .trim()
      .min(1, "Bank A/C number is required.")
      .regex(/^\d{9,18}$/, "Bank A/C number must be between 9 and 18 digits."),
    bankName: z.string().trim().min(1, "Bank name is required."),
    bankBranchName: z.string().trim().min(1, "Bank branch name is required."),
    ifscCode: z
      .string()
      .trim()
      .min(1, "IFSC code is required.")
      .regex(
        /^[A-Z]{4}0[A-Z0-9]{6}$/,
        "Enter a valid 11-character IFSC code (e.g. CNRB0002824 or SBIN0040523).",
      ),

    // 6. Institutions Visited During Last LIC (Section 06)
    licInstitutionName: z.string().optional(),

    // 7. Current / Former Member of VTU Bodies (Section 07)
    memberOfVtuExecutiveCouncil: z.boolean().optional(),
    memberOfVtuAcademicSenate: z.boolean().optional(),
    memberOfVtuBoardOfStudies: z.boolean().optional(),
    memberOfVtuBoardOfExamination: z.boolean().optional(),

    declarationAccepted: z.boolean().refine((val) => val === true, {
      message:
        "You must accept the institutional declaration to submit your registration.",
    }),
  });

export default function FacultySignup({ onBackToLogin }) {
  const navigate = useNavigate();

  const handleReturnToLogin = () => {
    if (onBackToLogin) {
      onBackToLogin();
    } else {
      navigate("/login", {
        state: {
          role: {
            category: "faculty",
            subRole: "Faculty",
            title: "Faculty Portal Login",
            identifierType: "Staff ID",
            exampleId: "ABCDE12345",
          },
        },
      });
    }
  };

  // Live Clock
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDate(`${day}/${month}/${year}`);

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(
        `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`,
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Form Initial State
  const [formData, setFormData] = useState(() => ({
    // 1. Faculty Details (Section 01)
    department: DEPARTMENTS[0],
    title: "Prof.",
    fullName: "",
    facultyId: "",
    vtuId: "",
    gender: "Male",
    religion: "Hindu",
    caste: "",
    category: "General Merit (GM)",
    dob: "",
    designation: DESIGNATIONS[2], // Assistant Professor
    doj: new Date().toISOString().split("T")[0],

    // 2. Educational Details (Section 02)
    // Ph.D
    phdStream: "",
    phdCourse: "",
    phdUniversity: "",
    phdSpecialization: "",
    phdYearOfAward: "",
    // PG
    pgStream: "",
    pgCourse: "",
    pgUniversity: "",
    pgYearOfPassing: "",
    // UG
    ugStream: "",
    ugCourse: "",
    ugUniversity: "",
    ugYearOfPassing: "",

    // 3. Experience Details (Section 03)
    teachingExpLecturerAsstProf: "0",
    industryExpYears: "0",
    teachingExpAssocProf: "0",
    teachingExpProf: "0",
    researchExpYears: "0",
    otherExpYears: "0",

    // 4. Other Details (Section 04)
    mobileCountryCode: "+91",
    mobile: "",
    email: "",
    address: "",
    panNumber: "",
    pfNpsNumber: "",
    aadhaarNumber: "",
    photograph: "",
    photoName: "",
    awards: "",
    linkedinProfile: "",
    academiaProfile: "",
    researchGateProfile: "",
    vtuFacultyId: "",
    firstYearTeacher: "No",
    biometricImpressionLht: "",
    lhtName: "",

    // 5. Bank Details (Section 05)
    bankAccountNumber: "",
    bankName: "Canara Bank",
    bankBranchName: "",
    ifscCode: "",

    // 6. Institutions Visited During Last LIC (Section 06)
    licInstitutionName: "",

    // 7. Current / Former Member of VTU Bodies (Section 07)
    memberOfVtuExecutiveCouncil: false,
    memberOfVtuAcademicSenate: false,
    memberOfVtuBoardOfStudies: false,
    memberOfVtuBoardOfExamination: false,

    declarationAccepted: false,
  }));

  const [currentStep, setCurrentStep] = useState("form"); // "form" | "preview" | "success"
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const result = facultySignupZodSchema.safeParse(formData);
    if (!result.success) {
      const errMap = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName) {
          errMap[fieldName] = issue.message;
        }
      });
      if (errMap[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: errMap[field] }));
      }
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Please upload an image in JPEG or PNG format.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        handleFieldChange("photograph", reader.result);
        handleFieldChange("photoName", file.name);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const handleLhtUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("Please upload an image in JPEG or PNG format.");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        handleFieldChange("biometricImpressionLht", reader.result);
        handleFieldChange("lhtName", file.name);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const validateAll = () => {
    const result = facultySignupZodSchema.safeParse(formData);
    if (!result.success) {
      const errMap = {};
      result.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (fieldName) {
          errMap[fieldName] = issue.message;
        }
      });
      return errMap;
    }
    return {};
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    const errors = validateAll();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep("preview");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleFinalConfirmSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError("");

    const facultyPayload = {
      facultyId: formData.facultyId.toUpperCase(),
      vtuId: formData.vtuId.toUpperCase(),
      title: formData.title,
      fullName: formData.fullName,
      department: formData.department,
      designation: formData.designation,
      doj: formData.doj,
      dob: formData.dob,
      gender: formData.gender,
      religion: formData.religion,
      caste: formData.caste,
      category: formData.category,
      // Educational Details
      phdStream: formData.phdStream,
      phdCourse: formData.phdCourse,
      phdUniversity: formData.phdUniversity,
      phdSpecialization: formData.phdSpecialization,
      phdYearOfAward: formData.phdYearOfAward,
      pgStream: formData.pgStream,
      pgCourse: formData.pgCourse,
      pgUniversity: formData.pgUniversity,
      pgYearOfPassing: formData.pgYearOfPassing,
      ugStream: formData.ugStream,
      ugCourse: formData.ugCourse,
      ugUniversity: formData.ugUniversity,
      ugYearOfPassing: formData.ugYearOfPassing,
      // Experience Details
      teachingExpLecturerAsstProf: formData.teachingExpLecturerAsstProf,
      industryExpYears: formData.industryExpYears,
      teachingExpAssocProf: formData.teachingExpAssocProf,
      teachingExpProf: formData.teachingExpProf,
      researchExpYears: formData.researchExpYears,
      otherExpYears: formData.otherExpYears,
      // Other Details
      mobile: `${formData.mobileCountryCode} ${formData.mobile}`,
      email: formData.email,
      address: formData.address,
      panNumber: formData.panNumber.toUpperCase(),
      pfNpsNumber: formData.pfNpsNumber,
      aadhaarNumber: formData.aadhaarNumber,
      photograph: formData.photograph,
      photoName: formData.photoName,
      awards: formData.awards,
      linkedinProfile: formData.linkedinProfile,
      academiaProfile: formData.academiaProfile,
      researchGateProfile: formData.researchGateProfile,
      vtuFacultyId: formData.vtuFacultyId || formData.vtuId,
      firstYearTeacher: formData.firstYearTeacher,
      biometricImpressionLht: formData.biometricImpressionLht,
      lhtName: formData.lhtName,
      // Bank Details
      bankAccountNumber: formData.bankAccountNumber,
      bankName: formData.bankName,
      bankBranchName: formData.bankBranchName,
      ifscCode: formData.ifscCode ? formData.ifscCode.toUpperCase() : "",
      // Institutions Visited During Last LIC
      licInstitutionName: formData.licInstitutionName,
      // Current / Former Member of VTU Bodies
      memberOfVtuExecutiveCouncil: formData.memberOfVtuExecutiveCouncil,
      memberOfVtuAcademicSenate: formData.memberOfVtuAcademicSenate,
      memberOfVtuBoardOfStudies: formData.memberOfVtuBoardOfStudies,
      memberOfVtuBoardOfExamination: formData.memberOfVtuBoardOfExamination,
      password: formData.facultyId,
    };

    try {
      await registerFacultyApi(facultyPayload);

      const sessionFacultyProfile = {
        ...facultyPayload,
        photograph: "",
        biometricImpressionLht: "",
      };
      delete sessionFacultyProfile.password;

      try {
        sessionStorage.removeItem("ajiet_faculty_registration_session");
        sessionStorage.setItem(
          "ajiet_faculty_registration_session",
          JSON.stringify(sessionFacultyProfile),
        );
      } catch (storageError) {
        console.warn(
          "Faculty registration succeeded, but the browser session profile could not be cached.",
          storageError,
        );
      }

      setCurrentStep("success");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Faculty registration error:", err);
      setSubmitError(
        err.message || "Failed to submit faculty registration. Please check fields.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetForm = () => {
    if (window.confirm("Are you sure you want to reset all entered details?")) {
      setFormData({
        department: DEPARTMENTS[0],
        title: "Prof.",
        fullName: "",
        facultyId: "",
        vtuId: "",
        gender: "Male",
        religion: "Hindu",
        caste: "",
        category: "General Merit (GM)",
        dob: "",
        designation: DESIGNATIONS[2],
        doj: new Date().toISOString().split("T")[0],
        phdStream: "",
        phdCourse: "",
        phdUniversity: "",
        phdSpecialization: "",
        phdYearOfAward: "",
        pgStream: "",
        pgCourse: "",
        pgUniversity: "",
        pgYearOfPassing: "",
        ugStream: "",
        ugCourse: "",
        ugUniversity: "",
        ugYearOfPassing: "",
        teachingExpLecturerAsstProf: "0",
        industryExpYears: "0",
        teachingExpAssocProf: "0",
        teachingExpProf: "0",
        researchExpYears: "0",
        otherExpYears: "0",
        mobileCountryCode: "+91",
        mobile: "",
        email: "",
        address: "",
        panNumber: "",
        pfNpsNumber: "",
        aadhaarNumber: "",
        photograph: "",
        photoName: "",
        awards: "",
        linkedinProfile: "",
        academiaProfile: "",
        researchGateProfile: "",
        vtuFacultyId: "",
        firstYearTeacher: "No",
        biometricImpressionLht: "",
        lhtName: "",
        bankAccountNumber: "",
        bankName: "Canara Bank",
        bankBranchName: "",
        ifscCode: "",
        licInstitutionName: "",
        memberOfVtuExecutiveCouncil: false,
        memberOfVtuAcademicSenate: false,
        memberOfVtuBoardOfStudies: false,
        memberOfVtuBoardOfExamination: false,
        declarationAccepted: false,
      });
      setFormErrors({});
      setTouched({});
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="faculty-signup-container">
      {/* Institutional Top Masthead Banner */}
      <header className="faculty-masthead">
        <div className="masthead-main-row">
          <div className="masthead-logo-col">
            <img src={ajietLogo} alt="AJIET Emblem" className="masthead-logo-img" />
            <span className="masthead-mobile-name">AJIET</span>
          </div>

          <div className="masthead-text-col">
            <h1 className="masthead-college-name">
              A. J. INSTITUTE OF ENGINEERING & TECHNOLOGY
            </h1>
            <p className="masthead-affiliations">
              Affiliated to Visvesvaraya Technological University, Belagavi •
              Approved by AICTE, New Delhi • Recognized by Govt. of Karnataka
            </p>
            <p className="masthead-campus-address">
              NH-66, Kottara Chowki, Mangaluru - 575006, Dakshina Kannada,
              Karnataka, India
            </p>
          </div>

          <div className="masthead-status-col">
            <div className="system-live-clock">
              <Clock size={13} />
              <span>
                {currentDate} • {currentTime}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-bar with Return Button */}
        <div className="faculty-subbar">
          <div className="subbar-content-row">
            <div className="subbar-title-wrap">
              <Briefcase size={16} />
              <span className="subbar-title">
                FACULTY ONBOARDING & ACADEMIC REGISTRATION PORTAL
              </span>
            </div>
            <button
              type="button"
              className="subbar-return-btn"
              onClick={handleReturnToLogin}
            >
              <ArrowLeft size={14} />
              <span>Return to Faculty Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="faculty-main-content">
        {/* STEP 1: FORM ENTRY */}
        {currentStep === "form" && (
          <div className="signup-form-wrapper">
            {/* Intro Hero Banner */}
            <div className="signup-intro-banner">
              <div className="intro-badge">
                <Briefcase size={14} />
                <span>OFFICIAL FACULTY ONBOARDING</span>
              </div>
              <h2 className="intro-title">New Faculty Member Registration</h2>
              <p className="intro-description">
                Welcome to A. J. Institute of Engineering & Technology. Please fill out
                your faculty details, educational background, professional experience, and profile particulars
                below to establish your official institutional profile and ERP credentials.
              </p>
              <div className="intro-instructions-box">
                <div className="instruction-item">
                  <span className="step-num">1</span>
                  <span>
                    Provide official Faculty Details including Faculty Institution ID and VTU ID.
                  </span>
                </div>
                <div className="instruction-item">
                  <span className="step-num">2</span>
                  <span>
                    Under Educational Details, enter your Ph.D, Post-Graduate (PG), and Under-Graduate (UG) credentials.
                  </span>
                </div>
                <div className="instruction-item">
                  <span className="step-num">3</span>
                  <span>
                    Under Experience & Other Details, provide professional service records, contact coordinates, Aadhaar, PAN, and attachments.
                  </span>
                </div>
                <div className="instruction-item">
                  <span className="step-num">4</span>
                  <span>
                    Under Pay & Bank Details and LIC Visits, record compensation, bank credentials, and institutions visited during last LIC.
                  </span>
                </div>
              </div>
            </div>

            <form onSubmit={handleFormSubmit} className="faculty-actual-form" noValidate>
              {/* SECTION 01: Faculty Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">01</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Faculty Details</h3>
                    <p className="section-subtitle">
                      Department, title, official name, institutional identifiers, demographic details, designation, and appointment date
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  {/* 1. Department Name */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Department Name <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.department}
                      onChange={(e) => handleFieldChange("department", e.target.value)}
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. Titles Dropdown */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Title <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.title}
                      onChange={(e) => handleFieldChange("title", e.target.value)}
                    >
                      {TITLES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 3. Full Name as per Aadhaar Card */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Full Name (as per Aadhaar Card) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.fullName && formErrors.fullName ? "error" : ""
                      }`}
                      placeholder="e.g. Ramesh Kumar"
                      value={formData.fullName}
                      onChange={(e) => handleFieldChange("fullName", e.target.value)}
                      onBlur={() => handleBlur("fullName")}
                    />
                    {touched.fullName && formErrors.fullName && (
                      <span className="field-err-msg">{formErrors.fullName}</span>
                    )}
                  </div>

                  {/* 4. Faculty Institution ID */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Faculty Institution ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.facultyId && formErrors.facultyId ? "error" : ""
                      }`}
                      placeholder="e.g. ABCDE12345"
                      maxLength={10}
                      value={formData.facultyId}
                      onChange={(e) =>
                        handleFieldChange("facultyId", e.target.value.toUpperCase())
                      }
                      onBlur={() => handleBlur("facultyId")}
                    />
                    <span className="field-subtext">
                      10-character Institutional ID (Used for Login)
                    </span>
                    {touched.facultyId && formErrors.facultyId && (
                      <span className="field-err-msg">{formErrors.facultyId}</span>
                    )}
                  </div>

                  {/* 5. VTU ID */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Faculty VTU ID <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.vtuId && formErrors.vtuId ? "error" : ""
                      }`}
                      placeholder="e.g. 4JKFA001"
                      value={formData.vtuId}
                      onChange={(e) =>
                        handleFieldChange("vtuId", e.target.value.toUpperCase())
                      }
                      onBlur={() => handleBlur("vtuId")}
                    />
                    {touched.vtuId && formErrors.vtuId && (
                      <span className="field-err-msg">{formErrors.vtuId}</span>
                    )}
                  </div>

                  {/* 6. Gender */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.gender}
                      onChange={(e) => handleFieldChange("gender", e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* 7. Religion */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Religion <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.religion}
                      onChange={(e) => handleFieldChange("religion", e.target.value)}
                    >
                      {RELIGIONS.map((rel) => (
                        <option key={rel} value={rel}>
                          {rel}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 8. Caste */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Caste / Sub-Caste <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.caste && formErrors.caste ? "error" : ""
                      }`}
                      placeholder="e.g. Bunt, Brahmin, Billava"
                      value={formData.caste}
                      onChange={(e) => handleFieldChange("caste", e.target.value)}
                      onBlur={() => handleBlur("caste")}
                    />
                    {touched.caste && formErrors.caste && (
                      <span className="field-err-msg">{formErrors.caste}</span>
                    )}
                  </div>

                  {/* 9. Category */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => handleFieldChange("category", e.target.value)}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 10. Date of Birth */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Date of Birth <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input ${
                        touched.dob && formErrors.dob ? "error" : ""
                      }`}
                      value={formData.dob}
                      onChange={(e) => handleFieldChange("dob", e.target.value)}
                      onBlur={() => handleBlur("dob")}
                    />
                    {touched.dob && formErrors.dob && (
                      <span className="field-err-msg">{formErrors.dob}</span>
                    )}
                  </div>

                  {/* 11. Designation */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Designation <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.designation}
                      onChange={(e) => handleFieldChange("designation", e.target.value)}
                    >
                      {DESIGNATIONS.map((desig) => (
                        <option key={desig} value={desig}>
                          {desig}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 12. Date of Joining */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Date of Joining <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-input ${
                        touched.doj && formErrors.doj ? "error" : ""
                      }`}
                      value={formData.doj}
                      onChange={(e) => handleFieldChange("doj", e.target.value)}
                      onBlur={() => handleBlur("doj")}
                    />
                    {touched.doj && formErrors.doj && (
                      <span className="field-err-msg">{formErrors.doj}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 02: Educational Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">02</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Educational Details</h3>
                    <p className="section-subtitle">
                      Doctoral (Ph.D), Post-Graduate (PG), and Under-Graduate (UG) academic credentials
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  {/* Subgroup A: Ph.D Details */}
                  <div className="edu-subheading-divider">
                    <GraduationCap size={16} />
                    <span>Doctoral / Ph.D Degree Details</span>
                    <span className="sub-tag">Optional if not applicable</span>
                  </div>

                  {/* Ph.D Stream */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Ph.D Stream
                    </label>
                    <select
                      className="form-input"
                      value={formData.phdStream}
                      onChange={(e) => handleFieldChange("phdStream", e.target.value)}
                    >
                      <option value="">Select Ph.D stream (optional)</option>
                      {PHD_STREAMS.map((stream) => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ph.D Course */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Ph.D Course
                    </label>
                    <select
                      className="form-input"
                      value={formData.phdCourse}
                      onChange={(e) => handleFieldChange("phdCourse", e.target.value)}
                    >
                      <option value="">Select Ph.D course (optional)</option>
                      {PHD_COURSES.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                  </div>

                  {/* Ph.D University */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Ph.D University
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Visvesvaraya Technological University (VTU)"
                      value={formData.phdUniversity}
                      onChange={(e) => handleFieldChange("phdUniversity", e.target.value)}
                    />
                  </div>

                  {/* Ph.D Specialization */}
                  <div className="form-field-group span-2">
                    <label className="form-label">
                      Ph.D Specialization
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Artificial Intelligence & Deep Learning"
                      value={formData.phdSpecialization}
                      onChange={(e) => handleFieldChange("phdSpecialization", e.target.value)}
                    />
                  </div>

                  {/* Ph.D Year of Award */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Ph.D Year of Award
                    </label>
                    <select
                      className={`form-input ${
                        touched.phdYearOfAward && formErrors.phdYearOfAward ? "error" : ""
                      }`}
                      value={formData.phdYearOfAward}
                      onChange={(e) => handleFieldChange("phdYearOfAward", e.target.value)}
                      onBlur={() => handleBlur("phdYearOfAward")}
                    >
                      <option value="">Select award year (optional)</option>
                      {ACADEMIC_YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {touched.phdYearOfAward && formErrors.phdYearOfAward && (
                      <span className="field-err-msg">{formErrors.phdYearOfAward}</span>
                    )}
                  </div>

                  {/* Subgroup B: Post Graduate (PG) Details */}
                  <div className="edu-subheading-divider">
                    <BookOpen size={16} />
                    <span>Post-Graduate (PG) Degree Details</span>
                    <span className="sub-tag req-tag">Mandatory</span>
                  </div>

                  {/* PG Stream */}
                  <div className="form-field-group">
                    <label className="form-label">
                      PG Stream <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.pgStream && formErrors.pgStream ? "error" : ""
                      }`}
                      value={formData.pgStream}
                      onChange={(e) => handleFieldChange("pgStream", e.target.value)}
                      onBlur={() => handleBlur("pgStream")}
                    >
                      <option value="">Select PG stream *</option>
                      {PG_STREAMS.map((stream) => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                    {touched.pgStream && formErrors.pgStream && (
                      <span className="field-err-msg">{formErrors.pgStream}</span>
                    )}
                  </div>

                  {/* PG Course */}
                  <div className="form-field-group">
                    <label className="form-label">
                      PG Course <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.pgCourse && formErrors.pgCourse ? "error" : ""
                      }`}
                      value={formData.pgCourse}
                      onChange={(e) => handleFieldChange("pgCourse", e.target.value)}
                      onBlur={() => handleBlur("pgCourse")}
                    >
                      <option value="">Select PG course *</option>
                      {PG_COURSES.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    {touched.pgCourse && formErrors.pgCourse && (
                      <span className="field-err-msg">{formErrors.pgCourse}</span>
                    )}
                  </div>

                  {/* PG University */}
                  <div className="form-field-group">
                    <label className="form-label">
                      PG University <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.pgUniversity && formErrors.pgUniversity ? "error" : ""
                      }`}
                      placeholder="e.g. Visvesvaraya Technological University (VTU), Belagavi"
                      value={formData.pgUniversity}
                      onChange={(e) => handleFieldChange("pgUniversity", e.target.value)}
                      onBlur={() => handleBlur("pgUniversity")}
                    />
                    {touched.pgUniversity && formErrors.pgUniversity && (
                      <span className="field-err-msg">{formErrors.pgUniversity}</span>
                    )}
                  </div>

                  {/* PG Year of Passing */}
                  <div className="form-field-group">
                    <label className="form-label">
                      PG Year of Passing <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.pgYearOfPassing && formErrors.pgYearOfPassing ? "error" : ""
                      }`}
                      value={formData.pgYearOfPassing}
                      onChange={(e) => handleFieldChange("pgYearOfPassing", e.target.value)}
                      onBlur={() => handleBlur("pgYearOfPassing")}
                    >
                      <option value="">Select PG passing year *</option>
                      {ACADEMIC_YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {touched.pgYearOfPassing && formErrors.pgYearOfPassing && (
                      <span className="field-err-msg">{formErrors.pgYearOfPassing}</span>
                    )}
                  </div>

                  {/* Subgroup C: Under Graduate (UG) Details */}
                  <div className="edu-subheading-divider">
                    <Award size={16} />
                    <span>Under-Graduate (UG) Degree Details</span>
                    <span className="sub-tag req-tag">Mandatory</span>
                  </div>

                  {/* UG Stream */}
                  <div className="form-field-group">
                    <label className="form-label">
                      UG Stream <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.ugStream && formErrors.ugStream ? "error" : ""
                      }`}
                      value={formData.ugStream}
                      onChange={(e) => handleFieldChange("ugStream", e.target.value)}
                      onBlur={() => handleBlur("ugStream")}
                    >
                      <option value="">Select UG stream *</option>
                      {UG_STREAMS.map((stream) => (
                        <option key={stream} value={stream}>{stream}</option>
                      ))}
                    </select>
                    {touched.ugStream && formErrors.ugStream && (
                      <span className="field-err-msg">{formErrors.ugStream}</span>
                    )}
                  </div>

                  {/* UG Course / Branch / Combination */}
                  <div className="form-field-group">
                    <label className="form-label">
                      UG Course / Branch / Combination <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.ugCourse && formErrors.ugCourse ? "error" : ""
                      }`}
                      value={formData.ugCourse}
                      onChange={(e) => handleFieldChange("ugCourse", e.target.value)}
                      onBlur={() => handleBlur("ugCourse")}
                    >
                      <option value="">Select UG course / branch *</option>
                      {UG_COURSES.map((course) => (
                        <option key={course} value={course}>{course}</option>
                      ))}
                    </select>
                    {touched.ugCourse && formErrors.ugCourse && (
                      <span className="field-err-msg">{formErrors.ugCourse}</span>
                    )}
                  </div>

                  {/* UG University */}
                  <div className="form-field-group">
                    <label className="form-label">
                      UG University <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.ugUniversity && formErrors.ugUniversity ? "error" : ""
                      }`}
                      placeholder="e.g. Visvesvaraya Technological University (VTU), Belagavi"
                      value={formData.ugUniversity}
                      onChange={(e) => handleFieldChange("ugUniversity", e.target.value)}
                      onBlur={() => handleBlur("ugUniversity")}
                    />
                    {touched.ugUniversity && formErrors.ugUniversity && (
                      <span className="field-err-msg">{formErrors.ugUniversity}</span>
                    )}
                  </div>

                  {/* UG Year of Passing */}
                  <div className="form-field-group">
                    <label className="form-label">
                      UG Year of Passing <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-input ${
                        touched.ugYearOfPassing && formErrors.ugYearOfPassing ? "error" : ""
                      }`}
                      value={formData.ugYearOfPassing}
                      onChange={(e) => handleFieldChange("ugYearOfPassing", e.target.value)}
                      onBlur={() => handleBlur("ugYearOfPassing")}
                    >
                      <option value="">Select UG passing year *</option>
                      {ACADEMIC_YEARS.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                    {touched.ugYearOfPassing && formErrors.ugYearOfPassing && (
                      <span className="field-err-msg">{formErrors.ugYearOfPassing}</span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 03: Experience Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">03</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Experience Details</h3>
                    <p className="section-subtitle">
                      Teaching, industrial, research, and other professional experience tenures
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  {/* 1. Teaching experience as lecturer Asst.Professor(in years)* */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Teaching Experience as Lecturer /{" "}
                        <span style={{ whiteSpace: "nowrap" }}>
                          Asst. Professor (in years) <span className="text-danger">*</span>
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.teachingExpLecturerAsstProf &&
                        formErrors.teachingExpLecturerAsstProf
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 4"
                      value={formData.teachingExpLecturerAsstProf}
                      onChange={(e) =>
                        handleFieldChange(
                          "teachingExpLecturerAsstProf",
                          e.target.value,
                        )
                      }
                      onBlur={() => handleBlur("teachingExpLecturerAsstProf")}
                    />
                    {touched.teachingExpLecturerAsstProf &&
                      formErrors.teachingExpLecturerAsstProf && (
                        <span className="field-err-msg">
                          {formErrors.teachingExpLecturerAsstProf}
                        </span>
                      )}
                  </div>

                  {/* 2. Industry experience in year * */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Industry Experience{" "}
                        <span style={{ whiteSpace: "nowrap" }}>
                          (in years) <span className="text-danger">*</span>
                        </span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.industryExpYears && formErrors.industryExpYears
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 2"
                      value={formData.industryExpYears}
                      onChange={(e) =>
                        handleFieldChange("industryExpYears", e.target.value)
                      }
                      onBlur={() => handleBlur("industryExpYears")}
                    />
                    {touched.industryExpYears && formErrors.industryExpYears && (
                      <span className="field-err-msg">
                        {formErrors.industryExpYears}
                      </span>
                    )}
                  </div>

                  {/* 3. Teaching experience as associate Professor(in years) */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Teaching Experience as Associate Professor{" "}
                        <span style={{ whiteSpace: "nowrap" }}>(in years)</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.teachingExpAssocProf &&
                        formErrors.teachingExpAssocProf
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 0"
                      value={formData.teachingExpAssocProf}
                      onChange={(e) =>
                        handleFieldChange("teachingExpAssocProf", e.target.value)
                      }
                      onBlur={() => handleBlur("teachingExpAssocProf")}
                    />
                    {touched.teachingExpAssocProf &&
                      formErrors.teachingExpAssocProf && (
                        <span className="field-err-msg">
                          {formErrors.teachingExpAssocProf}
                        </span>
                      )}
                  </div>

                  {/* 4. Teaching experience as professor(in years) */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Teaching Experience as Professor{" "}
                        <span style={{ whiteSpace: "nowrap" }}>(in years)</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.teachingExpProf && formErrors.teachingExpProf
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 0"
                      value={formData.teachingExpProf}
                      onChange={(e) =>
                        handleFieldChange("teachingExpProf", e.target.value)
                      }
                      onBlur={() => handleBlur("teachingExpProf")}
                    />
                    {touched.teachingExpProf && formErrors.teachingExpProf && (
                      <span className="field-err-msg">
                        {formErrors.teachingExpProf}
                      </span>
                    )}
                  </div>

                  {/* 5. Research experience in years */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Research Experience{" "}
                        <span style={{ whiteSpace: "nowrap" }}>(in years)</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.researchExpYears && formErrors.researchExpYears
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 3"
                      value={formData.researchExpYears}
                      onChange={(e) =>
                        handleFieldChange("researchExpYears", e.target.value)
                      }
                      onBlur={() => handleBlur("researchExpYears")}
                    />
                    {touched.researchExpYears && formErrors.researchExpYears && (
                      <span className="field-err-msg">
                        {formErrors.researchExpYears}
                      </span>
                    )}
                  </div>

                  {/* 6. Any other experience (in years) */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span>
                        Any Other Experience{" "}
                        <span style={{ whiteSpace: "nowrap" }}>(in years)</span>
                      </span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      min="0"
                      max="50"
                      className={`form-input ${
                        touched.otherExpYears && formErrors.otherExpYears
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 0"
                      value={formData.otherExpYears}
                      onChange={(e) =>
                        handleFieldChange("otherExpYears", e.target.value)
                      }
                      onBlur={() => handleBlur("otherExpYears")}
                    />
                    {touched.otherExpYears && formErrors.otherExpYears && (
                      <span className="field-err-msg">
                        {formErrors.otherExpYears}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 04: Other Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">04</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Other Details</h3>
                    <p className="section-subtitle">
                      Contact numbers, official identification, professional attachments, and biometric impressions
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  {/* 1. Mobile Number */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <div className="phone-input-split">
                      <select
                        className="country-code-select"
                        value={formData.mobileCountryCode}
                        onChange={(e) =>
                          handleFieldChange("mobileCountryCode", e.target.value)
                        }
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="text"
                        className={`form-input ${
                          touched.mobile && formErrors.mobile ? "error" : ""
                        }`}
                        placeholder="9876543210"
                        maxLength={10}
                        value={formData.mobile}
                        onChange={(e) =>
                          handleFieldChange(
                            "mobile",
                            e.target.value.replace(/\D/g, ""),
                          )
                        }
                        onBlur={() => handleBlur("mobile")}
                      />
                    </div>
                    {touched.mobile && formErrors.mobile && (
                      <span className="field-err-msg">{formErrors.mobile}</span>
                    )}
                  </div>

                  {/* 2. E-mail */}
                  <div className="form-field-group">
                    <label className="form-label">
                      E-mail Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-input ${
                        touched.email && formErrors.email ? "error" : ""
                      }`}
                      placeholder="e.g. staff@ajiet.ac.in"
                      value={formData.email}
                      onChange={(e) => handleFieldChange("email", e.target.value)}
                      onBlur={() => handleBlur("email")}
                    />
                    {touched.email && formErrors.email && (
                      <span className="field-err-msg">{formErrors.email}</span>
                    )}
                  </div>

                  {/* 3. Address */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Residential / Permanent Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.address && formErrors.address ? "error" : ""
                      }`}
                      placeholder="Door No., Street / Locality, City, State & PIN Code"
                      value={formData.address}
                      onChange={(e) => handleFieldChange("address", e.target.value)}
                      onBlur={() => handleBlur("address")}
                    />
                    {touched.address && formErrors.address && (
                      <span className="field-err-msg">{formErrors.address}</span>
                    )}
                  </div>

                  {/* 4. PAN Number */}
                  <div className="form-field-group">
                    <label className="form-label">
                      PAN Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.panNumber && formErrors.panNumber ? "error" : ""
                      }`}
                      placeholder="e.g. ABCDE1234F"
                      maxLength={10}
                      value={formData.panNumber}
                      onChange={(e) =>
                        handleFieldChange("panNumber", e.target.value.toUpperCase())
                      }
                      onBlur={() => handleBlur("panNumber")}
                    />
                    {touched.panNumber && formErrors.panNumber && (
                      <span className="field-err-msg">{formErrors.panNumber}</span>
                    )}
                  </div>

                  {/* 5. Latest PF / NPS Number */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Latest PF / NPS Number
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. KN/12345/67890"
                      value={formData.pfNpsNumber}
                      onChange={(e) =>
                        handleFieldChange("pfNpsNumber", e.target.value)
                      }
                    />
                  </div>

                  {/* 6. Aadhaar Number */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Aadhaar Number (12 Digits) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.aadhaarNumber && formErrors.aadhaarNumber
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 123456789012"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={(e) =>
                        handleFieldChange(
                          "aadhaarNumber",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      onBlur={() => handleBlur("aadhaarNumber")}
                    />
                    {touched.aadhaarNumber && formErrors.aadhaarNumber && (
                      <span className="field-err-msg">
                        {formErrors.aadhaarNumber}
                      </span>
                    )}
                  </div>

                  {/* 7. Photograph (JPEG, PNG) attachment */}
                  <div className="form-field-group">
                    <label className="form-label" htmlFor="faculty-photo-upload">
                      Photograph (JPEG, PNG)
                    </label>
                    <label htmlFor="faculty-photo-upload" className="file-upload-bar">
                      <input
                        id="faculty-photo-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        style={{ display: "none" }}
                        onChange={handlePhotoUpload}
                      />
                      <div className="upload-bar-left">
                        <Camera size={15} style={{ color: "var(--erp-navy)", flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {formData.photoName || "Attach Photograph"}
                        </span>
                      </div>
                      <span className={`upload-bar-badge ${formData.photograph ? "attached" : ""}`}>
                        {formData.photograph ? "Attached ✓" : "Browse"}
                      </span>
                    </label>
                  </div>

                  {/* 8. Biometric impression of LHT (jpeg, png) attach */}
                  <div className="form-field-group">
                    <label className="form-label" htmlFor="faculty-lht-upload">
                      Biometric Impression of LHT (JPEG, PNG)
                    </label>
                    <label htmlFor="faculty-lht-upload" className="file-upload-bar">
                      <input
                        id="faculty-lht-upload"
                        type="file"
                        accept="image/jpeg,image/png"
                        style={{ display: "none" }}
                        onChange={handleLhtUpload}
                      />
                      <div className="upload-bar-left">
                        <Fingerprint size={15} style={{ color: "var(--erp-navy)", flexShrink: 0 }} />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                          {formData.lhtName || "Attach LHT"}
                        </span>
                      </div>
                      <span className={`upload-bar-badge ${formData.biometricImpressionLht ? "attached" : ""}`}>
                        {formData.biometricImpressionLht ? "Attached ✓" : "Browse"}
                      </span>
                    </label>
                  </div>

                  {/* 9. First Year Teacher */}
                  <div className="form-field-group">
                    <label className="form-label">
                      First Year Teacher <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      value={formData.firstYearTeacher}
                      onChange={(e) =>
                        handleFieldChange("firstYearTeacher", e.target.value)
                      }
                    >
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                    </select>
                  </div>

                  {/* 11. VTU Faculty ID */}
                  <div className="form-field-group">
                    <label className="form-label">
                      VTU Faculty ID
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. 4JKFA001"
                      value={formData.vtuFacultyId || formData.vtuId}
                      onChange={(e) =>
                        handleFieldChange(
                          "vtuFacultyId",
                          e.target.value.toUpperCase(),
                        )
                      }
                    />
                  </div>

                  {/* 12. Awards */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Awards & Recognitions
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Best Faculty Award (2024), VTU Grant, IEEE Senior Member"
                      value={formData.awards}
                      onChange={(e) =>
                        handleFieldChange("awards", e.target.value)
                      }
                    />
                  </div>

                  {/* 13. LinkedIn Profile Link */}
                  <div className="form-field-group">
                    <label className="form-label">
                      LinkedIn Profile Link
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.linkedin.com/in/username"
                      value={formData.linkedinProfile}
                      onChange={(e) =>
                        handleFieldChange("linkedinProfile", e.target.value)
                      }
                    />
                  </div>

                  {/* 14. Academia.edu Profile Link */}
                  <div className="form-field-group">
                    <label className="form-label">
                      Academia.edu Profile Link
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://institution.academia.edu/username"
                      value={formData.academiaProfile}
                      onChange={(e) =>
                        handleFieldChange("academiaProfile", e.target.value)
                      }
                    />
                  </div>

                  {/* 15. ResearchGate Profile Link */}
                  <div className="form-field-group">
                    <label className="form-label">
                      ResearchGate Profile Link
                    </label>
                    <input
                      type="url"
                      className="form-input"
                      placeholder="https://www.researchgate.net/profile/username"
                      value={formData.researchGateProfile}
                      onChange={(e) =>
                        handleFieldChange("researchGateProfile", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 05: BANK DETAILS */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">05</div>
                  <div className="section-header-text">
                    <h3 className="section-title">BANK DETAILS</h3>
                    <p className="section-subtitle">
                      Official banking details for faculty registration
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  {/* 1. Bank A/C Number */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span style={{ whiteSpace: "nowrap" }}>
                        Bank A/C Number <span className="text-danger">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={18}
                      className={`form-input ${
                        touched.bankAccountNumber && formErrors.bankAccountNumber
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. 123456789012"
                      value={formData.bankAccountNumber}
                      onChange={(e) =>
                        handleFieldChange(
                          "bankAccountNumber",
                          e.target.value.replace(/\D/g, ""),
                        )
                      }
                      onBlur={() => handleBlur("bankAccountNumber")}
                    />
                    {touched.bankAccountNumber &&
                      formErrors.bankAccountNumber && (
                        <span className="field-err-msg">
                          {formErrors.bankAccountNumber}
                        </span>
                      )}
                  </div>

                  {/* 2. Bank Name */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span style={{ whiteSpace: "nowrap" }}>
                        Bank Name <span className="text-danger">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      list="popular-banks-list"
                      className={`form-input ${
                        touched.bankName && formErrors.bankName ? "error" : ""
                      }`}
                      placeholder="e.g. Canara Bank, State Bank of India"
                      value={formData.bankName}
                      onChange={(e) =>
                        handleFieldChange("bankName", e.target.value)
                      }
                      onBlur={() => handleBlur("bankName")}
                    />
                    <datalist id="popular-banks-list">
                      {POPULAR_BANKS.map((b) => (
                        <option key={b} value={b} />
                      ))}
                    </datalist>
                    {touched.bankName && formErrors.bankName && (
                      <span className="field-err-msg">{formErrors.bankName}</span>
                    )}
                  </div>

                  {/* 3. Bank Branch Name */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span style={{ whiteSpace: "nowrap" }}>
                        Bank Branch Name <span className="text-danger">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      className={`form-input ${
                        touched.bankBranchName && formErrors.bankBranchName
                          ? "error"
                          : ""
                      }`}
                      placeholder="e.g. Kottara Chowki / AJIET Campus Branch"
                      value={formData.bankBranchName}
                      onChange={(e) =>
                        handleFieldChange("bankBranchName", e.target.value)
                      }
                      onBlur={() => handleBlur("bankBranchName")}
                    />
                    {touched.bankBranchName && formErrors.bankBranchName && (
                      <span className="field-err-msg">
                        {formErrors.bankBranchName}
                      </span>
                    )}
                  </div>

                  {/* 4. IFSC Code */}
                  <div className="form-field-group">
                    <label className="form-label">
                      <span style={{ whiteSpace: "nowrap" }}>
                        IFSC Code <span className="text-danger">*</span>
                      </span>
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      className={`form-input ${
                        touched.ifscCode && formErrors.ifscCode ? "error" : ""
                      }`}
                      placeholder="e.g. CNRB0002824"
                      style={{ textTransform: "uppercase" }}
                      value={formData.ifscCode}
                      onChange={(e) =>
                        handleFieldChange(
                          "ifscCode",
                          e.target.value.toUpperCase(),
                        )
                      }
                      onBlur={() => handleBlur("ifscCode")}
                    />
                    {touched.ifscCode && formErrors.ifscCode && (
                      <span className="field-err-msg">
                        {formErrors.ifscCode}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 06: Institutions Visited During Last LIC */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">06</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Institutions Visited During Last LIC</h3>
                    <p className="section-subtitle">
                      Record of institution(s) inspected or visited as part of the VTU Local Inquiry Committee (LIC)
                    </p>
                  </div>
                </div>

                <div className="fields-grid-3">
                  <div className="form-field-group span-3">
                    <label className="form-label">
                      Institution Name
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Sahyadri College of Engineering & Management, Mangaluru"
                      value={formData.licInstitutionName}
                      onChange={(e) =>
                        handleFieldChange("licInstitutionName", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              {/* SECTION 07: CURRENT / FORMER MEMBER */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">07</div>
                  <div className="section-header-text">
                    <h3 className="section-title">CURRENT / FORMER MEMBER</h3>
                    <p className="section-subtitle">
                      Indicate whether you are a current or former member of Visvesvaraya Technological University (VTU) statutory councils, boards, or committees
                    </p>
                  </div>
                </div>

                <div className="membership-checkboxes-grid">
                  {/* 1. Member of VTU Executive Council */}
                  <label
                    className={`membership-check-card ${
                      formData.memberOfVtuExecutiveCouncil ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="membership-checkbox"
                      checked={formData.memberOfVtuExecutiveCouncil}
                      onChange={(e) =>
                        handleFieldChange(
                          "memberOfVtuExecutiveCouncil",
                          e.target.checked,
                        )
                      }
                    />
                    <div className="membership-text-wrap">
                      <span className="membership-card-title">
                        Member of VTU Executive Council
                      </span>
                      <span className="membership-card-sub">
                        Statutory executive authority of Visvesvaraya Technological University
                      </span>
                    </div>
                  </label>

                  {/* 2. Member of VTU Academic Senate */}
                  <label
                    className={`membership-check-card ${
                      formData.memberOfVtuAcademicSenate ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="membership-checkbox"
                      checked={formData.memberOfVtuAcademicSenate}
                      onChange={(e) =>
                        handleFieldChange(
                          "memberOfVtuAcademicSenate",
                          e.target.checked,
                        )
                      }
                    />
                    <div className="membership-text-wrap">
                      <span className="membership-card-title">
                        Member of VTU Academic Senate
                      </span>
                      <span className="membership-card-sub">
                        Principal statutory academic policy and curriculum governing body
                      </span>
                    </div>
                  </label>

                  {/* 3. Member of VTU Board of Studies */}
                  <label
                    className={`membership-check-card ${
                      formData.memberOfVtuBoardOfStudies ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="membership-checkbox"
                      checked={formData.memberOfVtuBoardOfStudies}
                      onChange={(e) =>
                        handleFieldChange(
                          "memberOfVtuBoardOfStudies",
                          e.target.checked,
                        )
                      }
                    />
                    <div className="membership-text-wrap">
                      <span className="membership-card-title">
                        Member of VTU Board of Studies (BOS)
                      </span>
                      <span className="membership-card-sub">
                        Statutory board for engineering syllabus, textbooks, & curriculum design
                      </span>
                    </div>
                  </label>

                  {/* 4. Member of VTU Board of Examination */}
                  <label
                    className={`membership-check-card ${
                      formData.memberOfVtuBoardOfExamination ? "checked" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="membership-checkbox"
                      checked={formData.memberOfVtuBoardOfExamination}
                      onChange={(e) =>
                        handleFieldChange(
                          "memberOfVtuBoardOfExamination",
                          e.target.checked,
                        )
                      }
                    />
                    <div className="membership-text-wrap">
                      <span className="membership-card-title">
                        Member of VTU Board of Examination (BOE)
                      </span>
                      <span className="membership-card-sub">
                        Board responsible for university examination papers, evaluation schemes & scrutiny
                      </span>
                    </div>
                  </label>
                </div>
              </section>

              {/* Institutional Undertaking & Declaration */}
              <div className="declaration-box" style={{ marginTop: "24px", marginBottom: "8px" }}>
                <label className="declaration-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.declarationAccepted}
                    onChange={(e) =>
                      handleFieldChange("declarationAccepted", e.target.checked)
                    }
                  />
                  <span>
                    <strong>Institutional Undertaking & Declaration:</strong> I hereby
                    solemnly affirm that all details submitted above are true, complete,
                    and correct to the best of my knowledge and comply with AICTE, VTU,
                    and AJIET faculty employment guidelines. I agree to uphold the
                    professional ethics, academic integrity, and responsibilities
                    expected of faculty at A. J. Institute of Engineering & Technology. Default initial portal password will be assigned as your Faculty Institution ID for first-time login.
                  </span>
                </label>
                {touched.declarationAccepted && formErrors.declarationAccepted && (
                  <span className="field-err-msg" style={{ marginTop: "8px" }}>
                    {formErrors.declarationAccepted}
                  </span>
                )}
              </div>

              {/* Form Bottom Actions */}
              <div className="form-actions-bottom">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleResetForm}
                >
                  <RotateCcw size={15} />
                  <span>Reset Form</span>
                </button>
                <div className="actions-right">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={handleReturnToLogin}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    <span>Review & Verify Registration</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: REVIEW & VERIFICATION PREVIEW */}
        {currentStep === "preview" && (
          <div className="signup-form-wrapper">
            <div className="signup-intro-banner">
              <div className="intro-badge">
                <BadgeCheck size={14} />
                <span>PREVIEW VERIFICATION</span>
              </div>
              <h2 className="intro-title">Institutional Faculty Profile Verification</h2>
              <p className="intro-description">
                Please carefully examine the information summary below before submitting
                your registration. Click "Edit Details" if any correction is necessary.
              </p>
            </div>

            {submitError && (
              <div className="portal-alert-box error">
                <span>{submitError}</span>
              </div>
            )}

            <div className="preview-sheet-card">
              {/* Sheet Header */}
              <div className="preview-sheet-top">
                <div className="sheet-logo-group">
                  <img src={ajietLogo} alt="AJIET" className="sheet-logo-img" />
                  <div>
                    <h3 className="sheet-title">A. J. INSTITUTE OF ENGINEERING & TECHNOLOGY</h3>
                    <p className="sheet-subtitle">Faculty Registration Summary Dossier</p>
                  </div>
                </div>
                <div className="sheet-meta-badge">
                  <span>DATE: {currentDate}</span>
                </div>
              </div>

              {/* Grid of Review Panels */}
              <div className="preview-sections-grid">
                {/* 1. Faculty Details */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <Building size={16} />
                    <h4>1. Faculty Details</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Faculty Institution ID:</span>
                      <strong className="p-val highlight">
                        {formData.facultyId.toUpperCase()}
                      </strong>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">VTU ID:</span>
                      <span className="p-val highlight">{formData.vtuId.toUpperCase()}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Full Name:</span>
                      <span className="p-val">
                        {formData.title} {formData.fullName}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Department:</span>
                      <span className="p-val">{formData.department}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Designation:</span>
                      <span className="p-val">{formData.designation}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Date of Joining:</span>
                      <span className="p-val">{formData.doj}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Date of Birth:</span>
                      <span className="p-val">{formData.dob}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Gender:</span>
                      <span className="p-val">{formData.gender}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Religion & Caste:</span>
                      <span className="p-val">
                        {formData.religion} ({formData.caste})
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Category:</span>
                      <span className="p-val">{formData.category}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Educational Details */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <GraduationCap size={16} />
                    <h4>2. Educational Details</h4>
                  </div>
                  <div className="preview-panel-content">
                    {/* Ph.D */}
                    <div className="preview-row">
                      <span className="p-label">Ph.D Qualification:</span>
                      <span className="p-val">
                        {formData.phdCourse
                          ? `${formData.phdCourse} (${formData.phdStream || "Doctorate"})`
                          : "Not Applicable"}
                      </span>
                    </div>
                    {formData.phdCourse && (
                      <>
                        <div className="preview-row">
                          <span className="p-label">Ph.D University:</span>
                          <span className="p-val">{formData.phdUniversity || "-"}</span>
                        </div>
                        <div className="preview-row">
                          <span className="p-label">Ph.D Specialization:</span>
                          <span className="p-val">{formData.phdSpecialization || "-"}</span>
                        </div>
                        <div className="preview-row">
                          <span className="p-label">Ph.D Year of Award:</span>
                          <span className="p-val">{formData.phdYearOfAward || "-"}</span>
                        </div>
                      </>
                    )}
                    {/* PG */}
                    <div className="preview-row">
                      <span className="p-label">PG Degree / Course:</span>
                      <span className="p-val highlight">
                        {formData.pgCourse} ({formData.pgStream})
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">PG University:</span>
                      <span className="p-val">{formData.pgUniversity}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">PG Year of Passing:</span>
                      <span className="p-val">{formData.pgYearOfPassing}</span>
                    </div>
                    {/* UG */}
                    <div className="preview-row">
                      <span className="p-label">UG Degree / Branch:</span>
                      <span className="p-val highlight">
                        {formData.ugCourse} ({formData.ugStream})
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">UG University:</span>
                      <span className="p-val">{formData.ugUniversity}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">UG Year of Passing:</span>
                      <span className="p-val">{formData.ugYearOfPassing}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Experience Details */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <Briefcase size={16} />
                    <h4>3. Experience Details</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Teaching (Lecturer/Asst. Prof):</span>
                      <span className="p-val highlight">
                        {formData.teachingExpLecturerAsstProf} Years
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Industry Experience:</span>
                      <span className="p-val highlight">
                        {formData.industryExpYears} Years
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Teaching (Assoc. Prof):</span>
                      <span className="p-val">
                        {formData.teachingExpAssocProf || 0} Years
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Teaching (Professor):</span>
                      <span className="p-val">
                        {formData.teachingExpProf || 0} Years
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Research Experience:</span>
                      <span className="p-val">
                        {formData.researchExpYears || 0} Years
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Any Other Experience:</span>
                      <span className="p-val">
                        {formData.otherExpYears || 0} Years
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Other Details */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <FileText size={16} />
                    <h4>4. Other Details</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Mobile Number:</span>
                      <span className="p-val highlight">
                        {formData.mobileCountryCode} {formData.mobile}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">E-mail:</span>
                      <span className="p-val highlight">{formData.email}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Address:</span>
                      <span className="p-val">{formData.address}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">PAN Number:</span>
                      <span className="p-val">{formData.panNumber.toUpperCase()}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">PF / NPS Number:</span>
                      <span className="p-val">{formData.pfNpsNumber || "N/A"}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Aadhaar Number:</span>
                      <span className="p-val">
                        •••• •••• {formData.aadhaarNumber.slice(-4)}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">VTU Faculty ID:</span>
                      <span className="p-val">{formData.vtuFacultyId || formData.vtuId}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">First Year Teacher:</span>
                      <span className="p-val">{formData.firstYearTeacher}</span>
                    </div>
                    {formData.awards && (
                      <div className="preview-row">
                        <span className="p-label">Awards:</span>
                        <span className="p-val">{formData.awards}</span>
                      </div>
                    )}
                    {/* Media attachments */}
                    <div className="preview-attachments-row">
                      {formData.photograph && (
                        <div className="preview-media-item">
                          <span className="media-label">Photograph:</span>
                          <img
                            src={formData.photograph}
                            alt="Faculty Photo"
                            className="media-thumb-preview"
                          />
                        </div>
                      )}
                      {formData.biometricImpressionLht && (
                        <div className="preview-media-item">
                          <span className="media-label">LHT Biometric:</span>
                          <img
                            src={formData.biometricImpressionLht}
                            alt="LHT Thumb Impression"
                            className="media-thumb-preview"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 5. Pay & Bank Details */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <Landmark size={16} />
                    <h4>5. Bank Details</h4>
                  </div>
                  <div className="preview-panel-content">
                    
                    <div className="preview-row">
                      <span className="p-label">Bank Name:</span>
                      <span className="p-val">{formData.bankName || "—"}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Bank Branch Name:</span>
                      <span className="p-val">{formData.bankBranchName || "—"}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Bank A/C Number:</span>
                      <span className="p-val">{formData.bankAccountNumber || "—"}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">IFSC Code:</span>
                      <span className="p-val">
                        {formData.ifscCode ? formData.ifscCode.toUpperCase() : "—"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 6. Institutions Visited During Last LIC */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <Building size={16} />
                    <h4>6. Institutions Visited During Last LIC</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Institution Name:</span>
                      <span className="p-val">
                        {formData.licInstitutionName || "None / Not Applicable"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 7. Current / Former VTU Membership */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <Award size={16} />
                    <h4>7. Current / Former VTU Membership</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Executive Council:</span>
                      <span className="p-val">
                        {formData.memberOfVtuExecutiveCouncil
                          ? "Yes (Member)"
                          : "No"}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Academic Senate:</span>
                      <span className="p-val">
                        {formData.memberOfVtuAcademicSenate
                          ? "Yes (Member)"
                          : "No"}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Board of Studies (BOS):</span>
                      <span className="p-val">
                        {formData.memberOfVtuBoardOfStudies
                          ? "Yes (Member)"
                          : "No"}
                      </span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Board of Examination (BOE):</span>
                      <span className="p-val">
                        {formData.memberOfVtuBoardOfExamination
                          ? "Yes (Member)"
                          : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 8. Credentials Summary */}
                <div className="preview-panel">
                  <div className="preview-panel-header">
                    <User size={16} />
                    <h4>8. Portal Account Summary</h4>
                  </div>
                  <div className="preview-panel-content">
                    <div className="preview-row">
                      <span className="p-label">Login Identifier:</span>
                      <strong className="p-val highlight">
                        {formData.facultyId.toUpperCase()}
                      </strong>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">VTU Faculty ID:</span>
                      <span className="p-val">{formData.vtuId.toUpperCase()}</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Initial Password:</span>
                      <span className="p-val">Same as Staff ID (1st login default)</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Account Status:</span>
                      <span className="p-val" style={{ color: "green" }}>Ready for Provisioning</span>
                    </div>
                    <div className="preview-row">
                      <span className="p-label">Access Level:</span>
                      <span className="p-val">Faculty Academic Gateway</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Preview Actions */}
              <div className="preview-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setCurrentStep("form");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  disabled={isSubmitting}
                >
                  <ArrowLeft size={16} />
                  <span>Edit Information</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleFinalConfirmSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting Registration...</span>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Confirm & Submit Registration</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: REGISTRATION SUCCESS */}
        {currentStep === "success" && (
          <div className="signup-form-wrapper">
            <div className="success-dossier-card">
              <div className="success-icon-wrap">
                <CheckCircle2 size={64} className="success-check-icon" />
              </div>

              <h2 className="success-title">Registration Successfully Submitted!</h2>
              <p className="success-desc">
                Your faculty member profile has been registered in the AJIET ERP Central
                Database. You can now use your Faculty Institution ID as both your username and initial password to sign in to the
                Faculty Portal.
              </p>

              {/* Faculty Identifier Credential Card */}
              <div className="success-badge-card">
                <div className="badge-header">
                  <span className="badge-inst-title">AJIET FACULTY CREDENTIAL</span>
                  <span className="badge-status-pill">Active</span>
                </div>
                <div className="badge-body">
                  {formData.photograph && (
                    <div style={{ textAlign: "center", marginBottom: "14px" }}>
                      <img
                        src={formData.photograph}
                        alt="Faculty"
                        style={{
                          width: "80px",
                          height: "96px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "2px solid #042d57",
                        }}
                      />
                    </div>
                  )}
                  <div className="badge-field">
                    <span className="b-label">Faculty Institution ID (Login Username):</span>
                    <strong className="b-id">
                      {formData.facultyId.toUpperCase()}
                    </strong>
                  </div>
                  <div className="badge-field">
                    <span className="b-label">VTU Faculty ID:</span>
                    <span className="b-val">{formData.vtuId.toUpperCase()}</span>
                  </div>
                  <div className="badge-field">
                    <span className="b-label">Faculty Member:</span>
                    <span className="b-val">
                      {formData.title} {formData.fullName}
                    </span>
                  </div>
                  <div className="badge-field">
                    <span className="b-label">Designation & Department:</span>
                    <span className="b-val">
                      {formData.designation} • Dept. of {formData.department}
                    </span>
                  </div>
                  <div className="badge-field">
                    <span className="b-label">Official Registered Email:</span>
                    <span className="b-val">{formData.email}</span>
                  </div>
                  <div className="badge-field">
                    <span className="b-label">Contact Mobile:</span>
                    <span className="b-val">{formData.mobile}</span>
                  </div>
                </div>
              </div>

              <div className="success-actions-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => window.print()}
                >
                  <Printer size={16} />
                  <span>Print Registration Summary</span>
                </button>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleReturnToLogin}
                >
                  <span>Proceed to Faculty Login</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Official Footer */}
      <Footer />
    </div>
  );
}
