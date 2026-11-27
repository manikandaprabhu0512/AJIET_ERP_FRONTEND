import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import "./StudentSignup.css";
import ajietLogo from "../assets/ajiet-logo.png";
import Footer from "../common/Footer";
import {
  INDIAN_STATES_AND_DISTRICTS,
  ALL_INDIAN_STATES,
} from "../data/indianStatesDistricts";
import { registerStudentApi } from "../services/apiService";
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Clock,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  CheckCircle2,
  RotateCcw,
  BookOpen,
  Award,
  Building,
} from "lucide-react";

const UG_BRANCHES = [
  "B.E. in Civil Engineering",
  "B.E. in Electronics & Communication Engineering",
  "B.E in Electronics Engineering (VLSI Design and Technology)",
  "B.E. in Computer Science & Engineering",
  "B.E. in Computer Science & Engineering (Artificial Intelligence & Machine Learning)",
  "B.E. in Computer Science & Engineering (IOT & Cyber Security including Blockchain Technology)",
  "B.E. in Artificial Intelligence & Data Science",
  "B.E. in Information Science & Engineering",
  "B.E. in Mechanical Engineering",
];

const PG_BRANCHES = [
  "Master of Business Administration (MBA)",
  "Master of Computer Applications (MCA)",
];

const PERCENTAGE_FORMAT = /^(?:\d{2}|100)\.\d{2}$/;
const PERCENTAGE_FORMAT_MESSAGE =
  "Enter percentage with two digits and two decimal places (e.g. 88.50 or 100.00).";

const SECTIONS = ["Section A", "Section B", "Section C"];

const ENROLLED_YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

const CURRENT_SEMESTERS = [
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const ACADEMIC_YEARS = [
  "2020-21",
  "2021-22",
  "2022-23",
  "2023-24",
  "2024-25",
  "2025-26",
  "2026-27",
  "2027-28",
  "2028-29",
  "2029-30",
  "2030-31",
];

const COUNTRY_CODES = [
  { code: "+91", label: "+91 (India)" },
  { code: "+971", label: "+971 (UAE)" },
  { code: "+966", label: "+966 (Saudi Arabia)" },
  { code: "+968", label: "+968 (Oman)" },
  { code: "+974", label: "+974 (Qatar)" },
  { code: "+965", label: "+965 (Kuwait)" },
  { code: "+1", label: "+1 (USA / Canada)" },
  { code: "+44", label: "+44 (UK)" },
  { code: "+65", label: "+65 (Singapore)" },
  { code: "+60", label: "+60 (Malaysia)" },
  { code: "+61", label: "+61 (Australia)" },
  { code: "+977", label: "+977 (Nepal)" },
];

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

// Zod Schema for strict institutional student signup validation
const studentSignupZodSchema = z.object({
  usn: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. USN is required.")
    .regex(
      /^4JK\d{2}[A-Z]{2}\d{3}$/,
      "USN must strictly follow format: 4JK + Year (2 digits) + Branch (2 letters) + Roll No. (3 digits) e.g. 4JK26CS001.",
    ),
  currentSemester: z
    .string()
    .min(1, "Notice: Mandatory field. Current semester is required."),
  academicYear: z
    .string()
    .min(1, "Notice: Mandatory field. Academic year is required."),
  fullName: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Student Name is required.")
    .min(3, "Student Name must be at least 3 characters."),
  dob: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Date of birth is required."),
  gender: z.string().min(1, "Notice: Mandatory field. Gender is required."),
  bloodGroup: z
    .string()
    .min(1, "Notice: Mandatory field. Blood group is required."),
  placeOfStay: z
    .string()
    .min(1, "Notice: Mandatory field. Place of stay is required."),
  religion: z.string().min(1, "Notice: Mandatory field. Religion is required."),
  caste: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Caste / Sub-caste is required."),
  category: z.string().min(1, "Notice: Mandatory field. Category is required."),
  aadhaarNumber: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Aadhaar Card number is required.")
    .regex(/^\d{12}$/, "Aadhaar Card number must be strictly 12 digits."),

  // Education Details Validation
  sslcPercentage: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. SSLC percentage is required.")
    .refine(
      (val) => PERCENTAGE_FORMAT.test(val),
      PERCENTAGE_FORMAT_MESSAGE,
    )
    .refine((val) => {
      const num = parseFloat(val);
      return !isNaN(num) && num >= 0 && num <= 100;
    }, "SSLC percentage must be a valid number between 0 and 100."),
  pucPcmPercentage: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || PERCENTAGE_FORMAT.test(val),
      PERCENTAGE_FORMAT_MESSAGE,
    )
    .refine(
      (val) =>
        !val ||
        (!isNaN(parseFloat(val)) &&
          parseFloat(val) >= 0 &&
          parseFloat(val) <= 100),
      "PCM percentage must be a valid number between 0 and 100.",
    ),
  diplomaPercentage: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || PERCENTAGE_FORMAT.test(val),
      PERCENTAGE_FORMAT_MESSAGE,
    )
    .refine(
      (val) =>
        !val ||
        (!isNaN(parseFloat(val)) &&
          parseFloat(val) >= 0 &&
          parseFloat(val) <= 100),
      "Diploma percentage must be a valid number between 0 and 100.",
    ),
  ugCgpa: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || /^\d\.\d{2}$/.test(val),
      "Enter UG CGPA in the format 8.47 (one digit and two decimal places).",
    )
    .refine(
      (val) =>
        !val ||
        (!isNaN(parseFloat(val)) &&
          parseFloat(val) >= 0 &&
          parseFloat(val) <= 10),
      "UG CGPA must be a valid number between 0 and 10.",
    ),
  pucTotalPercentage: z
    .string()
    .trim()
    .optional()
    .refine(
      (val) => !val || PERCENTAGE_FORMAT.test(val),
      PERCENTAGE_FORMAT_MESSAGE,
    )
    .refine(
      (val) =>
        !val ||
        (!isNaN(parseFloat(val)) &&
          parseFloat(val) >= 0 &&
          parseFloat(val) <= 100),
      "Total percentage must be a valid number between 0 and 100.",
    ),
  studiedKannadaInSSLC: z
    .string()
    .min(
      1,
      "Notice: Mandatory field. Please specify if Kannada was studied in SSLC.",
    ),
  abcId: z
    .string()
    .trim()
    .optional()
    .refine(
      (value) => !value || /^\d{12}$/.test(value),
      "ABC ID must be exactly 12 digits when provided.",
    ),
  studentSsid: z.string().optional(),

  // Contact Details Validation
  email: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Email address is required.")
    .email("Please enter a valid email address (e.g. student@ajiet.edu.in)."),
  mobile: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Student mobile number is required.")
    .regex(/^\d{10}$/, "Student mobile number must be strictly 10 digits."),
  state: z.string().min(1, "Notice: Mandatory field. State is required."),
  district: z.string().min(1, "Notice: Mandatory field. District is required."),
  city: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. City / Town is required."),
  addressLine1: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Residential address is required."),
  pincode: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Postal PIN code is required.")
    .regex(/^\d{6}$/, "Postal PIN code must be strictly 6 digits."),

  // Parent & Guardian Details Validation
  fatherName: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Father's / Guardian's name is required."),
  fatherMobile: z
    .string()
    .trim()
    .min(1, "Notice: Mandatory field. Father's contact number is required.")
    .regex(/^\d{10}$/, "Father's contact number must be strictly 10 digits."),
  motherMobile: z
    .string()
    .trim()
    .refine(
      (val) => !val || /^\d{10}$/.test(val),
      "Mother's contact number must be strictly 10 digits.",
    )
    .optional(),

  declarationAccepted: z.boolean().refine((val) => val === true, {
    message:
      "Notice: Mandatory field. You must read and accept the Institutional Declaration & Undertaking to submit your registration.",
  }),
});

export default function StudentSignup({ onBackToLogin }) {
  const navigate = useNavigate();
  const goBack = onBackToLogin ?? (() => navigate("/login"));

  // Live real-time clock
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

  // Form State
  const initialFormState = {
    // 1. Academic & Admission Details
    programType: "UG",
    admissionQuota: "CET",
    usn: "",
    branch: UG_BRANCHES[3], // 'B.E. in Computer Science & Engineering'
    section: "Section A",
    currentSemester: "Semester 1",
    academicYear: "2026-27",
    enrolledYear: "2026",

    // 2. Personal Details
    fullName: "",
    dob: "",
    gender: "Male",
    bloodGroup: "O+",
    placeOfStay: "Day Scholar", // Hostel | Day Scholar | PG | Other
    pgOwnerName: "",
    pgAddress: "",
    pgContactCountryCode: "+91",
    pgContactNumber: "",
    religion: "Hindu",
    caste: "",
    category: "General Merit (GM)",
    aadhaarNumber: "",

    // 3. Education Details
    sslcPercentage: "",
    pucPcmPercentage: "",
    diplomaPercentage: "",
    ugCgpa: "",
    pucTotalPercentage: "",
    studiedKannadaInSSLC: "Yes", // Yes | No
    abcId: "",
    studentSsid: "",

    // 4. Contact Details
    email: "",
    mobileCountryCode: "+91",
    mobile: "",
    state: "Karnataka",
    district: "Dakshina Kannada",
    city: "",
    addressLine1: "",
    pincode: "",

    // 5. Parent & Guardian Details
    fatherName: "",
    fatherOccupation: "",
    fatherMobileCountryCode: "+91",
    fatherMobile: "",
    motherName: "",
    motherOccupation: "",
    motherMobileCountryCode: "+91",
    motherMobile: "",

    // 6. Declaration
    declarationAccepted: false,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [touched, setTouched] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [currentStep, setCurrentStep] = useState("form"); // 'form' | 'preview' | 'success'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Validate entire dataset using Zod + custom rules
  const computeValidationErrors = (dataToValidate = formData) => {
    const parseResult = studentSignupZodSchema.safeParse(dataToValidate);
    const errors = {};

    if (!parseResult.success) {
      parseResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0];
        if (!errors[fieldName]) {
          errors[fieldName] = issue.message;
        }
      });
    }

    const isDiplomaLateralEntry =
      dataToValidate.programType === "UG" &&
      dataToValidate.admissionQuota === "Diploma - Lateral Entry";

    if (dataToValidate.programType === "PG") {
      if (!dataToValidate.ugCgpa?.trim()) {
        errors.ugCgpa = "Notice: Mandatory field. UG CGPA is required.";
      }
    } else if (isDiplomaLateralEntry) {
      if (!dataToValidate.diplomaPercentage?.trim()) {
        errors.diplomaPercentage =
          "Notice: Mandatory field. Diploma percentage is required.";
      }
    } else if (!dataToValidate.pucPcmPercentage?.trim()) {
      errors.pucPcmPercentage =
        "Notice: Mandatory field. PUC/12th PCM percentage is required.";
    }

    if (!isDiplomaLateralEntry && !dataToValidate.pucTotalPercentage?.trim()) {
      errors.pucTotalPercentage =
        "Notice: Mandatory field. PUC/12th total percentage is required.";
    }

    // Conditional rule for PG / Other place of stay (All 3 mandatory)
    if (
      dataToValidate.placeOfStay === "PG" ||
      dataToValidate.placeOfStay === "Other"
    ) {
      if (!dataToValidate.pgOwnerName?.trim()) {
        errors.pgOwnerName =
          "Notice: Mandatory field. Owner / Caretaker name is required.";
      }
      if (!dataToValidate.pgAddress?.trim()) {
        errors.pgAddress =
          "Notice: Mandatory field. Accommodation address is required.";
      }
      if (
        !dataToValidate.pgContactNumber?.trim() ||
        dataToValidate.pgContactNumber.length < 10
      ) {
        errors.pgContactNumber =
          "Notice: Mandatory field. 10-digit owner contact number is required.";
      }
    }

    return errors;
  };

  // Mark field as touched on blur and refresh error state
  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const errs = computeValidationErrors(formData);
    setFormErrors(errs);
  };

  // Handle generic inputs with immediate uppercase and digits-only transformations
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let val = type === "checkbox" ? checked : value;

    if (name === "usn") {
      // USN: Caps only, remove special chars, max 10 chars
      val = val
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "")
        .slice(0, 10);
    } else if (name === "fullName") {
      // Full Name: Caps only
      val = val.toUpperCase();
    } else if (name === "aadhaarNumber") {
      // Aadhaar: Digits only, max 12 digits
      val = val.replace(/\D/g, "").slice(0, 12);
    } else if (name === "abcId") {
      // ABC ID: Digits only, max 12 digits
      val = val.replace(/\D/g, "").slice(0, 12);
    } else if (
      name === "mobile" ||
      name === "fatherMobile" ||
      name === "motherMobile" ||
      name === "pgContactNumber"
    ) {
      // Mobile contacts: Digits only, max 10 digits
      val = val.replace(/\D/g, "").slice(0, 10);
    } else if (name === "pincode") {
      // PIN Code: Digits only, max 6 digits
      val = val.replace(/\D/g, "").slice(0, 6);
    } else if (
      name === "sslcPercentage" ||
      name === "pucPcmPercentage" ||
      name === "diplomaPercentage" ||
      name === "ugCgpa" ||
      name === "pucTotalPercentage"
    ) {
      // Academic scores: numeric + decimal point only
      val = val
        .replace(/[^0-9.]/g, "")
        .slice(0, name === "ugCgpa" ? 4 : 6);
    }

    const updatedData = { ...formData, [name]: val };
    setFormData(updatedData);

    // If user already blurred this field, validate immediately as they type
    if (touched[name] || name === "admissionQuota") {
      const errs = computeValidationErrors(updatedData);
      setFormErrors(errs);
    }
  };

  // Handle Program Type (UG / PG) Change -> switch branch options
  const handleProgramTypeChange = (e) => {
    const newProg = e.target.value;
    const defaultBranch = newProg === "UG" ? UG_BRANCHES[0] : PG_BRANCHES[0];
    const updated = {
      ...formData,
      programType: newProg,
      admissionQuota:
        newProg === "PG"
          ? formData.admissionQuota === "CET" ||
            formData.admissionQuota === "Diploma - Lateral Entry"
            ? "PG-CET"
            : formData.admissionQuota
          : formData.admissionQuota === "PG-CET"
            ? "CET"
            : formData.admissionQuota,
      branch: defaultBranch,
    };
    setFormData(updated);
    setFormErrors(computeValidationErrors(updated));
  };

  // Handle State Change -> update State and reset District to first in list
  const handleStateChange = (e) => {
    const newState = e.target.value;
    const availableDistricts = INDIAN_STATES_AND_DISTRICTS[newState] || [];
    const updated = {
      ...formData,
      state: newState,
      district: availableDistricts.length > 0 ? availableDistricts[0] : "",
    };
    setFormData(updated);
    if (touched.district) {
      setFormErrors(computeValidationErrors(updated));
    }
  };

  const currentDistricts = INDIAN_STATES_AND_DISTRICTS[formData.state] || [];
  const isPostgraduate = formData.programType === "PG";
  const isDiplomaLateralEntry =
    formData.programType === "UG" &&
    formData.admissionQuota === "Diploma - Lateral Entry";
  const educationScoreField = isPostgraduate
    ? "ugCgpa"
    : isDiplomaLateralEntry
      ? "diplomaPercentage"
      : "pucPcmPercentage";
  const educationScoreLabel = isPostgraduate
    ? "UG CGPA"
    : isDiplomaLateralEntry
      ? "Diploma Percentage"
      : "PUC / 12th PCM Percentage";
  const educationScoreHint = isPostgraduate
    ? "Format: 8.47 (one digit and two decimal places)"
    : isDiplomaLateralEntry
      ? "Aggregate percentage in Diploma (e.g. 82.00)"
      : "Physics + Chemistry + Math percentage (e.g. 82.00)";
  const currentBranchList = isPostgraduate ? PG_BRANCHES : UG_BRANCHES;

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mark all inputs as touched so empty mandatory fields immediately light up red
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {},
    );
    setTouched(allTouched);

    const errors = computeValidationErrors(formData);
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setCurrentStep("preview");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Scroll to first invalid field
      window.scrollTo({ top: 180, behavior: "smooth" });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all form fields?")) {
      setFormData(initialFormState);
      setTouched({});
      setFormErrors({});
      setCurrentStep("form");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="signup-page-container">
      {/* 1. Official Institutional Masthead Banner */}
      <header className="erp-masthead">
        <div className="masthead-main-row">
          <div className="masthead-logo-col">
            <img
              src={ajietLogo}
              alt="AJIET Emblem"
              className="masthead-logo-img"
            />
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
      </header>

      {/* 2. Institutional Sub-Band with Navigation Action */}
      <div className="erp-portal-subbar">
        <div className="subbar-content signup-subbar-row">
          <div className="signup-subbar-title-wrap">
            <GraduationCap size={18} />
            <span className="subbar-title">
              ONLINE STUDENT ADMISSIONS & ENROLLMENT PORTAL
            </span>
          </div>
        </div>
      </div>

      {/* 2. Main Body Container */}
      <main className="signup-main-content">
        {currentStep === "form" && (
          <div className="signup-form-wrapper">
            {/* Page Title & Instructions Banner */}
            <div className="signup-intro-banner">
              <h2 className="intro-title">
                New Student Enrollment & Account Registration
              </h2>
              <p className="intro-description">
                Please provide accurate academic, personal, and communication
                credentials. The details entered here will be verified against
                your official VTU / KEA / Institute admission documents before
                activating your permanent ERP profile.
              </p>
              <div className="intro-instructions-box">
                <div className="instruction-item">
                  <span className="step-num">1</span>
                  <span>
                    Fill all mandatory fields marked with an asterisk (
                    <strong className="text-danger">*</strong>).
                  </span>
                </div>
                <div className="instruction-item">
                  <span className="step-num">2</span>
                  <span>
                    Ensure your student name strictly matches your 10th / SSLC
                    Marks Card (capital letters only).
                  </span>
                </div>
                <div className="instruction-item">
                  <span className="step-num">3</span>
                  <span>
                    Already enrolled with active credentials?{" "}
                    <button
                      type="button"
                      className="text-link-inline"
                      onClick={goBack}
                    >
                      Click here to sign in
                    </button>
                    .
                  </span>
                </div>
              </div>
            </div>

            {/* Registration Form */}
            <form
              onSubmit={handleSubmit}
              className="signup-actual-form"
              noValidate
            >
              {/* SECTION 1: Academic & Admission Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">01</div>
                  <div className="section-header-text">
                    <h3 className="section-title">
                      Academic & Admission Details
                    </h3>
                    <p className="section-subtitle">
                      Program level, admission quota, university registration,
                      and branch section
                    </p>
                  </div>
                </div>

                <div className="form-grid-3col">
                  {/* Program Level: UG / PG */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Program Level <span className="text-danger">*</span>
                    </label>
                    <select
                      name="programType"
                      className="form-select"
                      value={formData.programType}
                      onChange={handleProgramTypeChange}
                    >
                      <option value="UG">Undergraduate (UG) - B.E.</option>
                      <option value="PG">Postgraduate (PG) - MBA / MCA</option>
                    </select>
                  </div>

                  {/* Admission Quota options depend on program level */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Admission Quota <span className="text-danger">*</span>
                    </label>
                    <select
                      name="admissionQuota"
                      className="form-select"
                      value={formData.admissionQuota}
                      onChange={handleInputChange}
                    >
                      {isPostgraduate ? (
                        <option value="PG-CET">PG-CET</option>
                      ) : (
                        <option value="CET">CET</option>
                      )}
                      <option value="MANAGEMENT">MANAGEMENT</option>
                      {!isPostgraduate && (
                        <option value="Diploma - Lateral Entry">
                          Diploma - Lateral Entry
                        </option>
                      )}
                    </select>
                  </div>

                  {/* University Seat Number (USN) - REQUIRED & STRICT 4JK FORMAT */}
                  <div className="form-control-group">
                    <label className="form-label">
                      University Seat No. (USN){" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="usn"
                      className={`form-input ${touched.usn && formErrors.usn ? "has-error" : ""}`}
                      placeholder="e.g. 4JK26CS001"
                      maxLength={10}
                      value={formData.usn}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("usn")}
                      required
                    />
                    {touched.usn && formErrors.usn ? (
                      <span className="error-text">⚠️ {formErrors.usn}</span>
                    ) : (
                      <span className="form-hint">
                        Strict format: 4JK + Year(2d) + Branch(2l) + Roll(3d) —
                        CAPS ONLY
                      </span>
                    )}
                  </div>

                  {/* Branch / Department Selection */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Department / Branch ({formData.programType}){" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="branch"
                      className="form-select"
                      value={formData.branch}
                      onChange={handleInputChange}
                    >
                      {currentBranchList.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Branch Section: Max A, B, C */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Branch Section <span className="text-danger">*</span>
                    </label>
                    <select
                      name="section"
                      className="form-select"
                      value={formData.section}
                      onChange={handleInputChange}
                    >
                      {SECTIONS.map((sec) => (
                        <option key={sec} value={sec}>
                          {sec}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Current Semester */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Current Semester <span className="text-danger">*</span>
                    </label>
                    <select
                      name="currentSemester"
                      className="form-select"
                      value={formData.currentSemester}
                      onChange={handleInputChange}
                    >
                      {CURRENT_SEMESTERS.map((semester) => (
                        <option key={semester} value={semester}>
                          {semester}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Academic Year */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Academic Year <span className="text-danger">*</span>
                    </label>
                    <select
                      name="academicYear"
                      className="form-select"
                      value={formData.academicYear}
                      onChange={handleInputChange}
                    >
                      {ACADEMIC_YEARS.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Enrolled Year: Starting from 2020 */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Enrolled Year <span className="text-danger">*</span>
                    </label>
                    <select
                      name="enrolledYear"
                      className="form-select"
                      value={formData.enrolledYear}
                      onChange={handleInputChange}
                    >
                      {ENROLLED_YEARS.map((yr) => (
                        <option key={yr} value={String(yr)}>
                          {yr}
                        </option>
                      ))}
                    </select>
                    <span className="form-hint">Year of joining AJIET</span>
                  </div>
                </div>
              </section>

              {/* SECTION 2: Personal & Identity Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">02</div>
                  <div className="section-header-text">
                    <h3 className="section-title">
                      Personal & Identity Details
                    </h3>
                    <p className="section-subtitle">
                      Candidate legal identity, medium of instruction,
                      accommodation, and reservation
                    </p>
                  </div>
                </div>

                <div className="form-grid-3col">
                  {/* Full Name - CAPS ONLY */}
                  <div className="form-control-group grid-span-2">
                    <label className="form-label">
                      Student Name <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <User size={16} />
                      </span>
                      <input
                        type="text"
                        name="fullName"
                        className={`form-input has-icon ${touched.fullName && formErrors.fullName ? "has-error" : ""}`}
                        placeholder="AS PER SSLC / 10TH STANDARD MARKS CARD"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("fullName")}
                        required
                      />
                    </div>
                    {touched.fullName && formErrors.fullName && (
                      <span className="error-text">
                        ⚠️ {formErrors.fullName}
                      </span>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Date of Birth <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <Calendar size={16} />
                      </span>
                      <input
                        type="date"
                        name="dob"
                        className={`form-input has-icon ${touched.dob && formErrors.dob ? "has-error" : ""}`}
                        value={formData.dob}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("dob")}
                        required
                      />
                    </div>
                    {touched.dob && formErrors.dob && (
                      <span className="error-text">⚠️ {formErrors.dob}</span>
                    )}
                  </div>

                  {/* Gender */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <select
                      name="gender"
                      className="form-select"
                      value={formData.gender}
                      onChange={handleInputChange}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Group */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Blood Group <span className="text-danger">*</span>
                    </label>
                    <select
                      name="bloodGroup"
                      className="form-select"
                      value={formData.bloodGroup}
                      onChange={handleInputChange}
                    >
                      {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(
                        (bg) => (
                          <option key={bg} value={bg}>
                            {bg}
                          </option>
                        ),
                      )}
                    </select>
                  </div>

                  {/* Place of Stay */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Place of Stay <span className="text-danger">*</span>
                    </label>
                    <select
                      name="placeOfStay"
                      className="form-select"
                      value={formData.placeOfStay}
                      onChange={handleInputChange}
                    >
                      <option value="Day Scholar">Day Scholar</option>
                      <option value="Hostel">AJIET-Hostel</option>
                      <option value="PG">PG</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Religion */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Religion <span className="text-danger">*</span>
                    </label>
                    <select
                      name="religion"
                      className="form-select"
                      value={formData.religion}
                      onChange={handleInputChange}
                    >
                      {RELIGIONS.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Caste */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Caste / Sub-caste <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="caste"
                      className={`form-input ${touched.caste && formErrors.caste ? "has-error" : ""}`}
                      placeholder="e.g. Bunt, Billava, Brahmin, etc."
                      value={formData.caste}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("caste")}
                      required
                    />
                    {touched.caste && formErrors.caste && (
                      <span className="error-text">⚠️ {formErrors.caste}</span>
                    )}
                  </div>

                  {/* Category Field */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Reservation Category{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="category"
                      className="form-select"
                      value={formData.category}
                      onChange={handleInputChange}
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Aadhaar Number - REQUIRED & DIGITS ONLY */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Aadhaar Card No. (12 Digits){" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      className={`form-input ${touched.aadhaarNumber && formErrors.aadhaarNumber ? "has-error" : ""}`}
                      placeholder="12 digits without spaces"
                      maxLength={12}
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("aadhaarNumber")}
                      required
                    />
                    {touched.aadhaarNumber && formErrors.aadhaarNumber ? (
                      <span className="error-text">
                        ⚠️ {formErrors.aadhaarNumber}
                      </span>
                    ) : (
                      <span className="form-hint">
                        Mandatory: 12 numeric digits only
                      </span>
                    )}
                  </div>

                  {/* CONDITIONAL: If PG or Other is selected -> 3 Mandatory fields */}
                  {(formData.placeOfStay === "PG" ||
                    formData.placeOfStay === "Other") && (
                    <div className="pg-accommodation-card grid-span-3">
                      <div className="pg-card-header">
                        <Building size={16} />
                        <span>
                          {formData.placeOfStay === "PG"
                            ? "PG Accommodation Details"
                            : "Other Stay Details"}
                        </span>
                      </div>
                      <div className="form-grid-3col">
                        {/* 1. Owner Name */}
                        <div className="form-control-group">
                          <label className="form-label">
                            Owner / Caretaker Name{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="pgOwnerName"
                            className={`form-input ${touched.pgOwnerName && formErrors.pgOwnerName ? "has-error" : ""}`}
                            placeholder="Full name of Owner / Warden"
                            value={formData.pgOwnerName}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("pgOwnerName")}
                            required
                          />
                          {touched.pgOwnerName && formErrors.pgOwnerName && (
                            <span className="error-text">
                              ⚠️ {formErrors.pgOwnerName}
                            </span>
                          )}
                        </div>

                        {/* 2. PG Address */}
                        <div className="form-control-group">
                          <label className="form-label">
                            Accommodation Address{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            name="pgAddress"
                            className={`form-input ${touched.pgAddress && formErrors.pgAddress ? "has-error" : ""}`}
                            placeholder="Complete PG / hostel address"
                            value={formData.pgAddress}
                            onChange={handleInputChange}
                            onBlur={() => handleBlur("pgAddress")}
                            required
                          />
                          {touched.pgAddress && formErrors.pgAddress && (
                            <span className="error-text">
                              ⚠️ {formErrors.pgAddress}
                            </span>
                          )}
                        </div>

                        {/* 3. Owner Contact Number */}
                        <div className="form-control-group">
                          <label className="form-label">
                            Owner Contact Number{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <div className="phone-input-combo">
                            <select
                              name="pgContactCountryCode"
                              className="country-code-select"
                              value={formData.pgContactCountryCode}
                              onChange={handleInputChange}
                            >
                              {COUNTRY_CODES.map((c) => (
                                <option key={c.code} value={c.code}>
                                  {c.label}
                                </option>
                              ))}
                            </select>
                            <input
                              type="tel"
                              name="pgContactNumber"
                              className={`form-input ${touched.pgContactNumber && formErrors.pgContactNumber ? "has-error" : ""}`}
                              placeholder="10-digit number"
                              maxLength={10}
                              value={formData.pgContactNumber}
                              onChange={handleInputChange}
                              onBlur={() => handleBlur("pgContactNumber")}
                              required
                            />
                          </div>
                          {touched.pgContactNumber &&
                            formErrors.pgContactNumber && (
                              <span className="error-text">
                                ⚠️ {formErrors.pgContactNumber}
                              </span>
                            )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* SECTION 3: Education Details (NEW SECTION) */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">03</div>
                  <div className="section-header-text">
                    <h3 className="section-title">Education Details</h3>
                    <p className="section-subtitle">
                      Prior secondary & higher secondary academic performance
                      and scholarship registry
                    </p>
                  </div>
                </div>

                <div className="form-grid-3col">
                  {/* SSLC Percentage */}
                  <div className="form-control-group">
                    <label className="form-label">
                      SSLC / 10th Percentage{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <Award size={16} />
                      </span>
                      <input
                        type="text"
                        name="sslcPercentage"
                        className={`form-input has-icon ${touched.sslcPercentage && formErrors.sslcPercentage ? "has-error" : ""}`}
                        placeholder="e.g. 88.50"
                        maxLength={6}
                        value={formData.sslcPercentage}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("sslcPercentage")}
                        required
                      />
                    </div>
                    {touched.sslcPercentage && formErrors.sslcPercentage ? (
                      <span className="error-text">
                        ⚠️ {formErrors.sslcPercentage}
                      </span>
                    ) : (
                      <span className="form-hint">
                        Aggregate percentage in 10th Standard (e.g. 88.50)
                      </span>
                    )}
                  </div>

                  {/* Program/quota-specific education score */}
                  <div className="form-control-group">
                    <label className="form-label">
                      {educationScoreLabel}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <Award size={16} />
                      </span>
                      <input
                        type="text"
                        name={educationScoreField}
                        className={`form-input has-icon ${touched[educationScoreField] && formErrors[educationScoreField] ? "has-error" : ""}`}
                        placeholder={
                          isPostgraduate ? "e.g. 8.47" : "e.g. 82.00"
                        }
                        maxLength={isPostgraduate ? 4 : 6}
                        value={formData[educationScoreField]}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur(educationScoreField)}
                        required
                      />
                    </div>
                    {touched[educationScoreField] &&
                    formErrors[educationScoreField] ? (
                      <span className="error-text">
                        ⚠️ {formErrors[educationScoreField]}
                      </span>
                    ) : (
                      <span className="form-hint">{educationScoreHint}</span>
                    )}
                  </div>

                  {/* PUC / 12th Total Percentage */}
                  <div className="form-control-group">
                    <label className="form-label">
                      PUC / 12th Total Percentage{" "}
                      {!isDiplomaLateralEntry && (
                        <span className="text-danger">*</span>
                      )}
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <Award size={16} />
                      </span>
                      <input
                        type="text"
                        name="pucTotalPercentage"
                        className={`form-input has-icon ${touched.pucTotalPercentage && formErrors.pucTotalPercentage ? "has-error" : ""}`}
                        placeholder="e.g. 85.20"
                        maxLength={6}
                        value={formData.pucTotalPercentage}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("pucTotalPercentage")}
                        required={!isDiplomaLateralEntry}
                      />
                    </div>
                    {touched.pucTotalPercentage &&
                    formErrors.pucTotalPercentage ? (
                      <span className="error-text">
                        ⚠️ {formErrors.pucTotalPercentage}
                      </span>
                    ) : (
                      <span className="form-hint">
                        {isDiplomaLateralEntry
                          ? "Optional PUC total (e.g. 85.20)"
                          : "Overall PUC total percentage (e.g. 85.20)"}
                      </span>
                    )}
                  </div>

                  {/* Question: Have you studied Kannada in 10th / SSLC */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Studied Kannada in 10th / SSLC?{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      name="studiedKannadaInSSLC"
                      className="form-select"
                      value={formData.studiedKannadaInSSLC}
                      onChange={handleInputChange}
                    >
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Academic Bank of Credits ID */}
                  <div className="form-control-group">
                    <label className="form-label">ABC ID</label>
                    <input
                      type="text"
                      name="abcId"
                      className={`form-input ${touched.abcId && formErrors.abcId ? "has-error" : ""}`}
                      placeholder="Enter 12-digit ABC ID"
                      inputMode="numeric"
                      maxLength={12}
                      value={formData.abcId}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("abcId")}
                    />
                    {touched.abcId && formErrors.abcId ? (
                      <span className="error-text">⚠️ {formErrors.abcId}</span>
                    ) : (
                      <span className="form-hint">
                        12-digit Academic Bank of Credits identifier
                      </span>
                    )}
                  </div>

                  {/* Student SSID number for scholarship */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Student SSID No. (State Scholarship ID / SATS)
                    </label>
                    <input
                      type="text"
                      name="studentSsid"
                      className="form-input"
                      placeholder="e.g. SSP Student ID or SATS enrollment number"
                      value={formData.studentSsid}
                      onChange={handleInputChange}
                    />
                    <span className="form-hint">
                      Used for processing Government / Post-Matric scholarships
                    </span>
                  </div>
                </div>
              </section>

              {/* SECTION 4: Contact & Residential Details */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">04</div>
                  <div className="section-header-text">
                    <h3 className="section-title">
                      Contact & Residential Details
                    </h3>
                    <p className="section-subtitle">
                      Direct candidate contacts, geographic location, and
                      domicile
                    </p>
                  </div>
                </div>

                <div className="form-grid-3col">
                  {/* Student Email */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Student Email Address{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        className={`form-input has-icon ${touched.email && formErrors.email ? "has-error" : ""}`}
                        placeholder="e.g. yourname@gmail.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("email")}
                        required
                      />
                    </div>
                    {touched.email && formErrors.email && (
                      <span className="error-text">⚠️ {formErrors.email}</span>
                    )}
                  </div>

                  {/* Student Mobile - COUNTRY CODE + 10 DIGITS ONLY */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Student Mobile Number{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="phone-input-combo">
                      <select
                        name="mobileCountryCode"
                        className="country-code-select"
                        value={formData.mobileCountryCode}
                        onChange={handleInputChange}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <div className="input-with-icon">
                        <span className="field-icon">
                          <Phone size={16} />
                        </span>
                        <input
                          type="tel"
                          name="mobile"
                          className={`form-input has-icon ${touched.mobile && formErrors.mobile ? "has-error" : ""}`}
                          placeholder="10-digit number"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={handleInputChange}
                          onBlur={() => handleBlur("mobile")}
                          required
                        />
                      </div>
                    </div>
                    {touched.mobile && formErrors.mobile ? (
                      <span className="error-text">⚠️ {formErrors.mobile}</span>
                    ) : (
                      <span className="form-hint">
                        Numbers only (strictly 10 digits)
                      </span>
                    )}
                  </div>

                  {/* 1. STATE (Dropdown with all states) */}
                  <div className="form-control-group">
                    <label className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <select
                      name="state"
                      className="form-select"
                      value={formData.state}
                      onChange={handleStateChange}
                    >
                      {ALL_INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 2. DISTRICT (Dropdown dependent on State) */}
                  <div className="form-control-group">
                    <label className="form-label">
                      District <span className="text-danger">*</span>
                    </label>
                    <select
                      name="district"
                      className={`form-select ${touched.district && formErrors.district ? "has-error" : ""}`}
                      value={formData.district}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("district")}
                    >
                      {currentDistricts.length > 0 ? (
                        currentDistricts.map((dst) => (
                          <option key={dst} value={dst}>
                            {dst}
                          </option>
                        ))
                      ) : (
                        <option value="">Select State First</option>
                      )}
                    </select>
                    {touched.district && formErrors.district && (
                      <span className="error-text">
                        ⚠️ {formErrors.district}
                      </span>
                    )}
                  </div>

                  {/* 3. CITY / TOWN */}
                  <div className="form-control-group">
                    <label className="form-label">
                      City / Town <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="city"
                      className={`form-input ${touched.city && formErrors.city ? "has-error" : ""}`}
                      placeholder="e.g. Mangaluru, Udupi, Surathkal"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("city")}
                      required
                    />
                    {touched.city && formErrors.city && (
                      <span className="error-text">⚠️ {formErrors.city}</span>
                    )}
                  </div>

                  {/* PIN Code - STRICT 6 DIGITS */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Postal PIN Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      className={`form-input ${touched.pincode && formErrors.pincode ? "has-error" : ""}`}
                      placeholder="6-digit PIN code"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("pincode")}
                      required
                    />
                    {touched.pincode && formErrors.pincode ? (
                      <span className="error-text">
                        ⚠️ {formErrors.pincode}
                      </span>
                    ) : (
                      <span className="form-hint">
                        Numbers only (strictly 6 digits)
                      </span>
                    )}
                  </div>

                  {/* Permanent Address Line */}
                  <div className="form-control-group grid-span-3">
                    <label className="form-label">
                      Permanent Residential Address{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-with-icon">
                      <span className="field-icon">
                        <MapPin size={16} />
                      </span>
                      <input
                        type="text"
                        name="addressLine1"
                        className={`form-input has-icon ${touched.addressLine1 && formErrors.addressLine1 ? "has-error" : ""}`}
                        placeholder="House No., Street, Area / Village"
                        value={formData.addressLine1}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("addressLine1")}
                        required
                      />
                    </div>
                    {touched.addressLine1 && formErrors.addressLine1 && (
                      <span className="error-text">
                        ⚠️ {formErrors.addressLine1}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 5: Parent & Guardian Information */}
              <section className="form-card-section">
                <div className="section-header-row">
                  <div className="section-badge-num">05</div>
                  <div className="section-header-text">
                    <h3 className="section-title">
                      Parent & Guardian Information
                    </h3>
                    <p className="section-subtitle">
                      Father/Guardian details and Mother details for
                      institutional communication
                    </p>
                  </div>
                </div>

                <div className="form-grid-3col">
                  {/* Father's Name [Required] */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Father's / Guardian Name{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="fatherName"
                      className={`form-input ${touched.fatherName && formErrors.fatherName ? "has-error" : ""}`}
                      placeholder="Father / Guardian full name"
                      value={formData.fatherName}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("fatherName")}
                      required
                    />
                    {touched.fatherName && formErrors.fatherName && (
                      <span className="error-text">
                        ⚠️ {formErrors.fatherName}
                      </span>
                    )}
                  </div>

                  {/* Father's Occupation */}
                  <div className="form-control-group">
                    <label className="form-label">Father's Occupation</label>
                    <input
                      type="text"
                      name="fatherOccupation"
                      className="form-input"
                      placeholder="e.g. Engineer, Business, Agriculture"
                      value={formData.fatherOccupation}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Father's Contact Number [Required] */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Father's Contact Number{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="phone-input-combo">
                      <select
                        name="fatherMobileCountryCode"
                        className="country-code-select"
                        value={formData.fatherMobileCountryCode}
                        onChange={handleInputChange}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="fatherMobile"
                        className={`form-input ${touched.fatherMobile && formErrors.fatherMobile ? "has-error" : ""}`}
                        placeholder="10-digit number"
                        maxLength={10}
                        value={formData.fatherMobile}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("fatherMobile")}
                        required
                      />
                    </div>
                    {touched.fatherMobile && formErrors.fatherMobile ? (
                      <span className="error-text">
                        ⚠️ {formErrors.fatherMobile}
                      </span>
                    ) : (
                      <span className="form-hint">
                        Mandatory 10-digit phone number
                      </span>
                    )}
                  </div>

                  {/* Mother's Name */}
                  <div className="form-control-group">
                    <label className="form-label">Mother's Name</label>
                    <input
                      type="text"
                      name="motherName"
                      className="form-input"
                      placeholder="Mother's full name"
                      value={formData.motherName}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Mother's Occupation */}
                  <div className="form-control-group">
                    <label className="form-label">Mother's Occupation</label>
                    <input
                      type="text"
                      name="motherOccupation"
                      className="form-input"
                      placeholder="e.g. Homemaker, Teacher, Doctor"
                      value={formData.motherOccupation}
                      onChange={handleInputChange}
                    />
                  </div>

                  {/* Mother's Contact Number */}
                  <div className="form-control-group">
                    <label className="form-label">
                      Mother's Contact Number
                    </label>
                    <div className="phone-input-combo">
                      <select
                        name="motherMobileCountryCode"
                        className="country-code-select"
                        value={formData.motherMobileCountryCode}
                        onChange={handleInputChange}
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        name="motherMobile"
                        className={`form-input ${touched.motherMobile && formErrors.motherMobile ? "has-error" : ""}`}
                        placeholder="10-digit number"
                        maxLength={10}
                        value={formData.motherMobile}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur("motherMobile")}
                      />
                    </div>
                    {touched.motherMobile && formErrors.motherMobile && (
                      <span className="error-text">
                        ⚠️ {formErrors.motherMobile}
                      </span>
                    )}
                  </div>
                </div>
              </section>

              {/* SECTION 6: Institutional Declaration */}
              <section className="form-card-section declaration-section">
                <div className="section-header-row">
                  <div className="section-badge-num">06</div>
                  <div className="section-header-text">
                    <h3 className="section-title">
                      Institutional Declaration & Undertaking
                    </h3>
                    <p className="section-subtitle">
                      Code of conduct and authenticity verification statement
                    </p>
                  </div>
                </div>

                <div
                  className={`declaration-box ${touched.declarationAccepted && formErrors.declarationAccepted ? "declaration-box-invalid" : ""}`}
                >
                  <div className="declaration-scroll-content">
                    <p>
                      <strong>I hereby solemnly declare that:</strong>
                    </p>
                    <ol>
                      <li>
                        All details and qualifications submitted in this online
                        registration form are authentic, correct, and verified
                        against my original records.
                      </li>
                      <li>
                        I understand that admission is strictly provisional and
                        subject to approval and validation by Visvesvaraya
                        Technological University (VTU) and the Government of
                        Karnataka.
                      </li>
                      <li>
                        I agree to abide by the disciplinary rules, anti-ragging
                        mandates, attendance requirements (minimum 85%), and
                        regulations of A. J. Institute of Engineering &
                        Technology, Mangaluru.
                      </li>
                      <li>
                        Any falsification or misrepresentation of information
                        shall result in immediate cancellation of my
                        registration without notice.
                      </li>
                    </ol>
                  </div>

                  <label
                    className={`declaration-checkbox-row ${touched.declarationAccepted && formErrors.declarationAccepted ? "checkbox-row-invalid" : ""}`}
                  >
                    <input
                      type="checkbox"
                      name="declarationAccepted"
                      checked={formData.declarationAccepted}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur("declarationAccepted")}
                      className={`form-checkbox ${touched.declarationAccepted && formErrors.declarationAccepted ? "input-invalid" : ""}`}
                    />
                    <span className="checkbox-label-text">
                      I have read, understood, and accept all the terms, code of
                      conduct, and regulations of AJIET ERP.{" "}
                      <span className="req-star">*</span>
                    </span>
                  </label>
                  {touched.declarationAccepted &&
                    formErrors.declarationAccepted && (
                      <span
                        className="error-text block-error"
                        style={{ marginTop: "10px" }}
                      >
                        ⚠️ {formErrors.declarationAccepted}
                      </span>
                    )}
                </div>
              </section>

              {/* Action Buttons Toolbar */}
              <div className="form-action-toolbar">
                <div className="toolbar-left">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={goBack}
                  >
                    <ArrowLeft size={16} />
                    <span>Back to Login</span>
                  </button>
                  <button
                    type="button"
                    className="btn-tertiary"
                    onClick={handleReset}
                  >
                    <RotateCcw size={15} />
                    <span>Reset Form</span>
                  </button>
                </div>

                <div className="toolbar-right">
                  <button type="submit" className="btn-primary-submit">
                    <BookOpen size={16} />
                    <span>Review Registration Details</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* STEP 2: Full Institutional Preview & Review Mode */}
        {currentStep === "preview" && (
          <div className="signup-preview-wrapper">
            {/* Preview Banner */}
            <div className="preview-intro-banner">
              <div className="preview-badge-pill">
                Step 2 of 2 • Review & Confirm Details
              </div>
              <h2 className="preview-main-title">
                Registration Details Preview
              </h2>
              <p className="preview-description">
                Please verify all the academic, personal, and contact
                information entered below before final submission. If any
                modifications are needed, click <strong>"Edit Details"</strong>{" "}
                to return to the form. Once confirmed, click{" "}
                <strong>"Confirm &amp; Submit Registration"</strong>.
              </p>
            </div>

            {/* SECTION 1: Academic & Admission Details */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">01</div>
                <div className="section-header-text">
                  <h3 className="section-title">
                    Academic &amp; Admission Details
                  </h3>
                  <p className="section-subtitle">
                    Program level, admission quota, USN, and department
                  </p>
                </div>
              </div>
              <div className="preview-grid-2col">
                <div className="preview-field-cell">
                  <span className="preview-field-label">Program Level</span>
                  <strong className="preview-field-val">
                    {formData.programType === "UG"
                      ? "Undergraduate (UG) - B.E."
                      : "Postgraduate (PG)"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Admission Quota</span>
                  <strong className="preview-field-val">
                    {formData.admissionQuota}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    University Seat No. (USN)
                  </span>
                  <strong className="preview-field-val usn-badge-text">
                    {formData.usn}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Department / Branch
                  </span>
                  <strong className="preview-field-val">
                    {formData.branch}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Branch Section</span>
                  <strong className="preview-field-val">
                    {formData.section}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Current Semester</span>
                  <strong className="preview-field-val">
                    {formData.currentSemester}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Academic Year</span>
                  <strong className="preview-field-val">
                    {formData.academicYear}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Enrolled Year</span>
                  <strong className="preview-field-val">
                    {formData.enrolledYear}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECTION 2: Personal & Identity Details */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">02</div>
                <div className="section-header-text">
                  <h3 className="section-title">
                    Personal &amp; Identity Details
                  </h3>
                  <p className="section-subtitle">
                    Legal candidate identification and accommodation records
                  </p>
                </div>
              </div>
              <div className="preview-grid-2col">
                <div className="preview-field-cell">
                  <span className="preview-field-label">Student Name</span>
                  <strong className="preview-field-val">
                    {formData.fullName}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Date of Birth</span>
                  <strong className="preview-field-val">{formData.dob}</strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Gender</span>
                  <strong className="preview-field-val">
                    {formData.gender}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Blood Group</span>
                  <strong className="preview-field-val">
                    {formData.bloodGroup}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Place of Stay</span>
                  <strong className="preview-field-val">
                    {formData.placeOfStay}
                  </strong>
                </div>
                {(formData.placeOfStay === "PG" ||
                  formData.placeOfStay === "Other") && (
                  <>
                    <div className="preview-field-cell">
                      <span className="preview-field-label">
                        PG / Other Owner Name
                      </span>
                      <strong className="preview-field-val">
                        {formData.pgOwnerName || "N/A"}
                      </strong>
                    </div>
                    <div className="preview-field-cell">
                      <span className="preview-field-label">
                        Owner Contact Number
                      </span>
                      <strong className="preview-field-val">
                        {formData.pgContactCountryCode}{" "}
                        {formData.pgContactNumber}
                      </strong>
                    </div>
                    <div className="preview-field-cell preview-field-full">
                      <span className="preview-field-label">
                        PG / Accommodation Address
                      </span>
                      <strong className="preview-field-val">
                        {formData.pgAddress || "N/A"}
                      </strong>
                    </div>
                  </>
                )}
                <div className="preview-field-cell">
                  <span className="preview-field-label">Religion</span>
                  <strong className="preview-field-val">
                    {formData.religion}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Caste / Sub-Caste</span>
                  <strong className="preview-field-val">
                    {formData.caste}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Category</span>
                  <strong className="preview-field-val">
                    {formData.category}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Aadhaar Card No.</span>
                  <strong className="preview-field-val">
                    {formData.aadhaarNumber}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECTION 3: Education Details */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">03</div>
                <div className="section-header-text">
                  <h3 className="section-title">Education Details</h3>
                  <p className="section-subtitle">
                    Academic percentages and language qualifications
                  </p>
                </div>
              </div>
              <div className="preview-grid-2col">
                <div className="preview-field-cell">
                  <span className="preview-field-label">SSLC Percentage</span>
                  <strong className="preview-field-val">
                    {formData.sslcPercentage}%
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    {educationScoreLabel}
                  </span>
                  <strong className="preview-field-val">
                    {formData[educationScoreField]}
                    {!isPostgraduate && "%"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    PUC/12th Total Percentage
                  </span>
                  <strong className="preview-field-val">
                    {formData.pucTotalPercentage
                      ? `${formData.pucTotalPercentage}%`
                      : "Not Provided"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Studied Kannada in 10th / SSLC
                  </span>
                  <strong className="preview-field-val">
                    {formData.studiedKannadaInSSLC}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">ABC ID</span>
                  <strong className="preview-field-val">
                    {formData.abcId || "Not Provided"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Student SSID (Scholarship)
                  </span>
                  <strong className="preview-field-val">
                    {formData.studentSsid || "Not Provided"}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECTION 4: Contact & Residential Details */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">04</div>
                <div className="section-header-text">
                  <h3 className="section-title">
                    Contact &amp; Residential Details
                  </h3>
                  <p className="section-subtitle">
                    Permanent communication address and student contacts
                  </p>
                </div>
              </div>
              <div className="preview-grid-2col">
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Student Email Address
                  </span>
                  <strong className="preview-field-val">
                    {formData.email}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Student Mobile Number
                  </span>
                  <strong className="preview-field-val">
                    {formData.mobileCountryCode} {formData.mobile}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">State</span>
                  <strong className="preview-field-val">
                    {formData.state}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">District</span>
                  <strong className="preview-field-val">
                    {formData.district}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">City / Town</span>
                  <strong className="preview-field-val">{formData.city}</strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Postal PIN Code</span>
                  <strong className="preview-field-val">
                    {formData.pincode}
                  </strong>
                </div>
                <div className="preview-field-cell preview-field-full">
                  <span className="preview-field-label">
                    Permanent Residential Address
                  </span>
                  <strong className="preview-field-val">
                    {formData.addressLine1}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECTION 5: Parent & Guardian Information */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">05</div>
                <div className="section-header-text">
                  <h3 className="section-title">
                    Parent &amp; Guardian Information
                  </h3>
                  <p className="section-subtitle">
                    Primary emergency contacts and family records
                  </p>
                </div>
              </div>
              <div className="preview-grid-2col">
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Father's / Guardian's Name
                  </span>
                  <strong className="preview-field-val">
                    {formData.fatherName}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Father's Occupation
                  </span>
                  <strong className="preview-field-val">
                    {formData.fatherOccupation || "N/A"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Father's Contact Number
                  </span>
                  <strong className="preview-field-val">
                    {formData.fatherMobileCountryCode} {formData.fatherMobile}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">Mother's Name</span>
                  <strong className="preview-field-val">
                    {formData.motherName || "N/A"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Mother's Occupation
                  </span>
                  <strong className="preview-field-val">
                    {formData.motherOccupation || "N/A"}
                  </strong>
                </div>
                <div className="preview-field-cell">
                  <span className="preview-field-label">
                    Mother's Contact Number
                  </span>
                  <strong className="preview-field-val">
                    {formData.motherMobile
                      ? `${formData.motherMobileCountryCode} ${formData.motherMobile}`
                      : "N/A"}
                  </strong>
                </div>
              </div>
            </section>

            {/* SECTION 6: Institutional Undertaking Confirmed */}
            <section className="form-card-section preview-card-section">
              <div className="section-header-row">
                <div className="section-badge-num">06</div>
                <div className="section-header-text">
                  <h3 className="section-title">
                    Institutional Declaration &amp; Undertaking
                  </h3>
                  <p className="section-subtitle">
                    Student verification and code of conduct status
                  </p>
                </div>
              </div>
              <div className="preview-declaration-status">
                <CheckCircle2 size={18} className="declaration-status-icon" />
                <span>
                  Candidate has agreed and accepted all institutional terms,
                  conditions, and regulations of AJIET ERP.
                </span>
              </div>
            </section>

            {/* Preview Action Toolbar */}
            <div className="form-action-toolbar preview-toolbar">
              <div className="toolbar-left">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setCurrentStep("form");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <ArrowLeft size={16} />
                  <span>Edit Details</span>
                </button>
              </div>

              {submitError && (
                <div
                  style={{
                    padding: "12px 18px",
                    background: "#fef2f2",
                    border: "1px solid #f87171",
                    borderRadius: "8px",
                    color: "#b91c1c",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "16px",
                  }}
                >
                  ⚠️ {submitError}
                </div>
              )}

              <div className="toolbar-right">
                <button
                  type="button"
                  className="btn-primary-submit"
                  disabled={isSubmitting}
                  onClick={async () => {
                    setIsSubmitting(true);
                    setSubmitError("");
                    try {
                      // 1. Submit to MySQL Backend
                      await registerStudentApi(formData);

                      // 2. Keep local session for immediate seamless preview
                      sessionStorage.setItem(
                        "ajiet_student_registration_session",
                        JSON.stringify(formData),
                      );

                      setCurrentStep("success");
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    } catch (err) {
                      console.error("Registration failed:", err);
                      setSubmitError(
                        err.message ||
                          "Failed to submit registration. Please ensure backend server is running.",
                      );
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <span>
                    {isSubmitting
                      ? "Registering in Database..."
                      : "Confirm & Submit Registration"}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Registration Success – Clean Confirmation (No Reference Number) */}
        {currentStep === "success" && (
          <div className="signup-success-container">
            <div className="success-slip-card">
              {/* Success Icon + Heading */}
              <div className="slip-top-banner">
                <div className="slip-success-badge">
                  <CheckCircle2 size={52} />
                </div>
                <h2 className="slip-main-title">
                  Registration Submitted Successfully!
                </h2>
                <p className="slip-main-sub">
                  Your provisional student registration has been logged into the
                  central AJIET ERP database.
                </p>
              </div>

              {/* Registered Name & USN summary row */}
              <div className="slip-review-row">
                <div className="slip-review-item">
                  <span className="slip-review-label">STUDENT NAME</span>
                  <span className="slip-review-value">{formData.fullName}</span>
                </div>
                <div className="slip-review-item">
                  <span className="slip-review-label">USN</span>
                  <span className="slip-review-value">{formData.usn}</span>
                </div>
                <div className="slip-review-item">
                  <span className="slip-review-label">BRANCH</span>
                  <span className="slip-review-value">{formData.branch}</span>
                </div>
                <div className="slip-review-item">
                  <span className="slip-review-label">EMAIL</span>
                  <span className="slip-review-value">{formData.email}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="slip-actions-row">
                <button
                  type="button"
                  className="btn-primary-submit slip-login-btn"
                  onClick={goBack}
                >
                  <span>Proceed to Student Login</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 3. Universal Shared ERP Footer */}
      <Footer />
    </div>
  );
}
