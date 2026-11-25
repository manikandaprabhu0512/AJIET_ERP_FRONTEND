import React, { useState, useEffect, useRef, useCallback } from "react";
import "./LoginPortal.css";
import ajietLogo from "../assets/ajiet-logo.png";
import {
  GraduationCap,
  Briefcase,
  Building2,
  Landmark,
  Eye,
  EyeOff,
  RotateCw,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Info,
} from "lucide-react";
import OtpModal from "./OtpModal";
import ChangePasswordModal from "./ChangePasswordModal";
import ForgotPasswordModal from "./ForgotPasswordModal";
import {
  initMockStore,
  attemptLogin,
  generateRandomOtp,
  updatePassword,
} from "../services/authService";
import { loginUserApi, updatePasswordApi } from "../services/apiService";
import { saveSession } from "../utils/sessionManager";

const createRandomCaptchaCode = () => {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz";
  let code = "";
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function LoginPortal({
  selectedRole = {
    category: "student",
    subRole: "Student",
    title: "Student Portal",
    identifierType: "USN",
    exampleId: "4JK26AB123",
  },
  onBackToGateway,
  onLoginSuccess,
  onStudentSignup,
}) {
  const isStudent = selectedRole.category === "student";
  const staffIdRoleLabel = selectedRole.subRole.replace(/\s+staff$/i, "");

  // Input states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(createRandomCaptchaCode);
  const [userCaptcha, setUserCaptcha] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [infoMessage, setInfoMessage] = useState("");

  // Flow Modals State
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const [changePassModalOpen, setChangePassModalOpen] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  // Active transaction context
  const [pendingUser, setPendingUser] = useState(null);
  const [currentOtp, setCurrentOtp] = useState("");
  const [isForgotRecovery, setIsForgotRecovery] = useState(false);
  const [selectedDeptRole, setSelectedDeptRole] = useState("HOD");
  const [selectedInstRole, setSelectedInstRole] = useState("Principal");

  const canvasRef = useRef(null);

  // Render captcha onto canvas whenever captchaCode changes
  const renderCaptchaCanvas = useCallback((code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(0, 0, width, height);

    ctx.font = 'bold 24px "SF Pro Text", monospace, sans-serif';
    ctx.fillStyle = "#042d57";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const spacedText = code.split("").join("   ");
    ctx.fillText(spacedText, width / 2, height / 2);
  }, []);

  const refreshCaptcha = useCallback(() => {
    const newCode = createRandomCaptchaCode();
    setCaptchaCode(newCode);
    setUserCaptcha("");
    renderCaptchaCanvas(newCode);
  }, [renderCaptchaCanvas]);

  // Initial draw & mock store init
  useEffect(() => {
    initMockStore();
    renderCaptchaCanvas(captchaCode);
  }, [captchaCode, renderCaptchaCanvas]);

  // Quick autofill helper for the current role
  const handleFillDemo = () => {
    const example =
      selectedRole.exampleId || (isStudent ? "4JK26AB123" : "ABCDE12345");
    setUsername(example);
    setPassword(example);
    setErrorMessage("");
    setInfoMessage(
      `Loaded default credentials for ${selectedRole.subRole} (${example}).`,
    );
  };

  // Login form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setInfoMessage("");

    const cleanUsername = username.trim().toUpperCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMessage(
        isStudent
          ? "Please enter your USN."
          : `Please enter your Staff ID for ${selectedRole.subRole}.`,
      );
      return;
    }

    if (!cleanPassword) {
      setErrorMessage("Please enter your password.");
      return;
    }

    // Verify Captcha
    if (userCaptcha.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMessage("Invalid captcha code. Please try again.");
      refreshCaptcha();
      return;
    }

    // Try backend MySQL API authentication first
    loginUserApi(cleanUsername, cleanPassword)
      .then((data) => {
        // Save token and logged in user to both localStorage and Cookie
        if (data.token) {
          saveSession(data.user, data.token);
        }

        const authUser = { ...data.user, token: data.token };
        setPendingUser(authUser);

        // Check if user requires first-time password change
        if (data.requiresFirstTimeFlow) {
          const generatedOtp = generateRandomOtp();
          setCurrentOtp(generatedOtp);
          setIsForgotRecovery(false);
          setOtpModalOpen(true);
        } else {
          if (onLoginSuccess) {
            onLoginSuccess(authUser);
          }
        }
      })
      .catch((backendErr) => {
        if (backendErr.status) {
          setErrorMessage(backendErr.message);
          refreshCaptcha();
          return;
        }

        console.warn(
          "Backend login error, attempting fallback mock auth:",
          backendErr.message,
        );

        // Fallback to local service (for mock faculty, admin, or offline accounts)
        const subRole =
          selectedRole.category === "department"
            ? selectedDeptRole
            : selectedRole.category === "institution"
              ? selectedInstRole
              : selectedRole.subRole;
        const result = attemptLogin(
          cleanUsername,
          cleanPassword,
          selectedRole.category,
          subRole,
        );

        if (!result.success) {
          setErrorMessage(backendErr.message || result.error);
          refreshCaptcha();
          return;
        }

        const authUser = result.user;
        setPendingUser(authUser);

        // If first-time login: password matches identifier or isFirstLogin flag
        if (result.requiresFirstTimeFlow) {
          const generatedOtp = generateRandomOtp();
          setCurrentOtp(generatedOtp);
          setIsForgotRecovery(false);
          setOtpModalOpen(true);
        } else {
          // Regular login successful
          if (onLoginSuccess) {
            onLoginSuccess(authUser);
          }
        }
      });
  };

  // OTP Verified handler
  const handleOtpVerified = () => {
    setOtpModalOpen(false);
    // Open Change Password modal
    setChangePassModalOpen(true);
  };

  // Resend OTP handler
  const handleResendOtp = () => {
    const newOtp = generateRandomOtp();
    setCurrentOtp(newOtp);
  };

  // Password successfully updated
  const handlePasswordUpdated = async (newPassword) => {
    if (pendingUser) {
      if (pendingUser.token) {
        await updatePasswordApi(pendingUser.username, newPassword);
      } else {
        try {
          await updatePasswordApi(pendingUser.username, newPassword);
        } catch (err) {
          console.warn(
            "Backend password update unavailable; updating mock account:",
            err.message,
          );
        }
      }

      const updated = updatePassword(pendingUser.username, newPassword);
      setChangePassModalOpen(false);

      if (isForgotRecovery) {
        // Back to login with populated credentials
        setPassword(newPassword);
        setInfoMessage(
          "Password reset successfully! You can now log in with your new password.",
        );
        refreshCaptcha();
        setIsForgotRecovery(false);
      } else {
        // First login finished: enter dashboard
        const finalUser = {
          ...(updated.user || pendingUser),
          token: pendingUser?.token || localStorage.getItem("ajiet_auth_token"),
          isFirstLogin: false,
        };
        if (onLoginSuccess) {
          onLoginSuccess(finalUser);
        }
      }
    }
  };

  // Forgot password initiated
  const handleForgotOtpRequested = ({ identifier, email, otp }) => {
    setForgotModalOpen(false);
    const subRoleForgot =
      selectedRole.category === "department"
        ? selectedDeptRole
        : selectedRole.category === "institution"
          ? selectedInstRole
          : selectedRole.subRole;
    setPendingUser({
      username: identifier,
      email: email,
      role:
        subRoleForgot?.toLowerCase().replace(/\s+/g, "_") ||
        selectedRole.category,
    });
    setCurrentOtp(otp);
    setIsForgotRecovery(true);
    setOtpModalOpen(true);
  };

  // Pick portal icon
  const getPortalIcon = () => {
    switch (selectedRole.category) {
      case "student":
        return <GraduationCap size={18} />;
      case "faculty":
        return <Briefcase size={18} />;
      case "department":
        return <Building2 size={18} />;
      case "institution":
      default:
        return <Landmark size={18} />;
    }
  };

  return (
    <div className="portal-container">
      {/* Background Decorative Blobs */}
      <div className="bg-glow-orb orb-1" />
      <div className="bg-glow-orb orb-2" />

      {/* Main Dual-Portal Shell */}
      <div className="portal-card-shell">
        {/* Left Branding Panel */}
        <div className="portal-brand-panel">
          <div className="brand-logo-container">
            <img src={ajietLogo} alt="AJIET Emblem" className="brand-logo" />
          </div>

          <div className="brand-text-block">
            <h1 className="brand-college-name">A.J. INSTITUTE</h1>
            <p className="brand-college-name">OF ENGINEERING & TECHNOLOGY</p>
            <span className="brand-location">MANGALURU • ESTD 2016</span>
          </div>

          <button
            type="button"
            className="brand-change-role-btn"
            onClick={onBackToGateway}
            title="Return to Role Selection Gateway"
          >
            <ArrowLeft size={16} />
            <span>Change Role</span>
          </button>
        </div>

        {/* Right Form Panel */}
        <div className="portal-form-panel">
          {/* Form Header */}
          <div className="form-header-area">
            <h2 className="form-title">
              {selectedRole.title || `${selectedRole.subRole} Sign In`}
            </h2>
            {/* <p className="form-subtitle">
              {isStudent
                ? "Enter your 10-character USN and password to access your account"
                : `Sign in with your 10-character Staff ID as ${selectedRole.subRole}`}
            </p> */}
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div className="portal-alert error">
              <span>{errorMessage}</span>
            </div>
          )}

          {infoMessage && (
            <div className="portal-alert info">
              <Info size={16} />
              <span>{infoMessage}</span>
            </div>
          )}

          {/* The Login Form */}
          <form onSubmit={handleSubmit} className="portal-login-form">
            {/* Username / Identifier */}
            <div className="field-group">
              <label className="field-label">
                {isStudent ? "Student USN" : `${staffIdRoleLabel} Staff ID`}
              </label>
              <div className="input-box">
                <span className="input-icon">
                  {isStudent ? <GraduationCap size={18} /> : <User size={18} />}
                </span>
                <input
                  type="text"
                  className="portal-input"
                  placeholder={
                    isStudent
                      ? "e.g. 4JK26AB123"
                      : `e.g. ${selectedRole.exampleId || "ABCDE12345"}`
                  }
                  maxLength={10}
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  autoComplete="username"
                  required
                />
              </div>
              <span className="field-hint">
                {isStudent
                  ? "Strictly 10-characters (4JK + Year + Branch + Roll)"
                  : "10-character institutional Staff Identifier"}
              </span>
            </div>

            {/* Password */}
            <div className="field-group">
              <div className="label-with-action">
                <label className="field-label">Password</label>
                <button
                  type="button"
                  className="forgot-link-btn"
                  onClick={() => setForgotModalOpen(true)}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="input-box">
                <span className="input-icon">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className="portal-input password"
                  placeholder={
                    isStudent
                      ? "Enter Password (USN for 1st login)"
                      : "Enter Password (ID for 1st login)"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="visibility-toggle"
                  onClick={() => setShowPassword((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Role selection for Department and Institution */}
            {(selectedRole.category === "department" ||
              selectedRole.category === "institution") && (
              <div className="field-group">
                <label className="field-label">
                  {selectedRole.category === "department"
                    ? "Select Department Role"
                    : "Select Administrative Role"}
                </label>
                <select
                  className="portal-select"
                  value={
                    selectedRole.category === "department"
                      ? selectedDeptRole
                      : selectedInstRole
                  }
                  onChange={(e) => {
                    if (selectedRole.category === "department")
                      setSelectedDeptRole(e.target.value);
                    else setSelectedInstRole(e.target.value);
                  }}
                >
                  {selectedRole.category === "department" ? (
                    <>
                      <option value="HOD">Head of Department (HOD)</option>
                      <option value="Class Advisor">Class Advisor</option>
                      <option value="Mentor">Mentor</option>
                    </>
                  ) : (
                    <>
                      <option value="Principal">Principal</option>
                      <option value="Dean R&D">Dean R&D</option>
                      <option value="Dean Academics">Dean Academics</option>
                      <option value="Dean (SW)">Dean (SW)</option>
                      <option value="Dean (IQAC)">Dean (IQAC)</option>
                      <option value="Dean Admission">Dean Admission</option>
                      <option value="Dean Placements">Dean Placements</option>
                      <option value="OS">OS (Office Superintendent)</option>
                      <option value="Administration Officer">
                        Administration Officer
                      </option>
                      <option value="Accountant">Accountant</option>
                    </>
                  )}
                </select>
              </div>
            )}

            {/* Captcha Box */}
            <div className="field-group">
              <label className="field-label">Security Verification</label>
              <div className="captcha-container-row">
                <div className="captcha-canvas-wrap">
                  <canvas
                    ref={canvasRef}
                    width={220}
                    height={42}
                    className="captcha-render"
                  />
                </div>
                <button
                  type="button"
                  className="captcha-refresh"
                  onClick={refreshCaptcha}
                  title="Generate new Captcha"
                  aria-label="Refresh Captcha"
                >
                  <RotateCw size={18} />
                </button>
              </div>
              <div className="input-box" style={{ marginTop: "8px" }}>
                <input
                  type="text"
                  className="portal-input"
                  placeholder="Enter 4-character code shown above"
                  maxLength={6}
                  value={userCaptcha}
                  onChange={(e) => setUserCaptcha(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Submit Action */}
            <button type="submit" className="portal-submit-btn">
              <span>Sign In as {selectedRole.subRole}</span>
              <ArrowRight size={18} />
            </button>

            {/* Student Sign-up link — shown only on the Student portal */}
            {isStudent && onStudentSignup && (
              <p className="portal-signup-hint">
                New student?{" "}
                <button
                  type="button"
                  className="portal-signup-link"
                  onClick={onStudentSignup}
                >
                  Register your account →
                </button>
              </p>
            )}
          </form>

          {/* Footer note */}
          <div className="portal-form-footer">
            <ShieldCheck size={15} />
            <span>A J Institute of Engineering & Technology</span>
          </div>
        </div>
      </div>

      {/* 1. OTP Verification Modal */}
      <OtpModal
        isOpen={otpModalOpen}
        onClose={() => setOtpModalOpen(false)}
        _identifier={pendingUser?.username}
        recipientEmail={pendingUser?.email}
        expectedOtp={currentOtp}
        onVerifySuccess={handleOtpVerified}
        onResendOtp={handleResendOtp}
        title={
          isForgotRecovery
            ? "Verify Recovery Code"
            : "First-Time Login Verification"
        }
      />

      {/* 2. Mandatory / Reset Change Password Modal */}
      <ChangePasswordModal
        isOpen={changePassModalOpen}
        identifier={pendingUser?.username}
        _role={pendingUser?.role}
        onPasswordChangeSuccess={handlePasswordUpdated}
        isMandatoryFirstTime={!isForgotRecovery}
      />

      {/* 3. Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        portalType={selectedRole.category}
        onRequestOtp={handleForgotOtpRequested}
      />
    </div>
  );
}
