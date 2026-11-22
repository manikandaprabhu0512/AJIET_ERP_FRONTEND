import React, { useState, useEffect, useRef } from 'react';
import './OtpModal.css';
import { Mail, Clock, RefreshCw, X, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

export default function OtpModal({
  isOpen,
  onClose,
  _identifier,
  recipientEmail,
  expectedOtp,
  onVerifySuccess,
  onResendOtp,
  title = 'Two-Factor Authentication'
}) {
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  // Auto-focus first input box when modal opens
  useEffect(() => {
    if (!isOpen) return;
    const focusTimer = setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 100);
    return () => clearTimeout(focusTimer);
  }, [isOpen]);

  // Countdown timer for resend
  useEffect(() => {
    let interval = null;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  if (!isOpen) return null;

  const handleChange = (index, value) => {
    // Only accept numeric inputs
    const cleanVal = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);
    setErrorMsg('');

    // Advance to next input box if filled
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace to previous input
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || '';
    }
    setOtpDigits(newDigits);
    const nextIdx = Math.min(pastedData.length, 5);
    inputRefs.current[nextIdx]?.focus();
  };

  const handleQuickFill = () => {
    if (expectedOtp && expectedOtp.length === 6) {
      setOtpDigits(expectedOtp.split(''));
      setErrorMsg('');
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    const entered = otpDigits.join('');
    if (entered.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (entered === expectedOtp) {
        onVerifySuccess();
      } else {
        setErrorMsg('Invalid OTP! Please check the demo code and try again.');
      }
    }, 400);
  };

  const handleResend = () => {
    if (!canResend) return;
    setOtpDigits(['', '', '', '', '', '']);
    setTimer(60);
    setCanResend(false);
    setErrorMsg('');
    onResendOtp();
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  // Mask email for realistic display
  const maskEmail = (email) => {
    if (!email) return 'registered email';
    const parts = email.split('@');
    if (parts.length < 2) return email;
    const name = parts[0];
    const domain = parts[1];
    const visible = name.slice(0, 3);
    return `${visible}***@${domain}`;
  };

  return (
    <div className="otp-modal-backdrop" onClick={onClose}>
      <div
        className="otp-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="otp-modal-close" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        <div className="otp-icon-header">
          <div className="otp-icon-badge">
            <Mail size={28} />
          </div>
          <h3 className="otp-modal-title">{title}</h3>
          <p className="otp-modal-subtitle">
            A verification code has been dispatched to your college email:
            <br />
            <strong className="otp-email-highlight">{maskEmail(recipientEmail)}</strong>
          </p>
        </div>

        {/* Demo Helper Banner for Testing */}
        <div className="demo-otp-banner">
          <div className="demo-otp-left">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Simulated OTP:</span>
            <code className="demo-otp-code">{expectedOtp}</code>
          </div>
          <button
            type="button"
            className="demo-autofill-btn"
            onClick={handleQuickFill}
            title="Auto-fill OTP for fast test"
          >
            Auto-fill
          </button>
        </div>

        {errorMsg && (
          <div className="otp-error-alert">
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-inputs-grid" onPaste={handlePaste}>
            {otpDigits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={`otp-digit-box ${digit ? 'filled' : ''}`}
                autoComplete="one-time-code"
                aria-label={`Digit ${idx + 1}`}
              />
            ))}
          </div>

          <div className="otp-resend-row">
            {canResend ? (
              <button
                type="button"
                className="otp-resend-btn active"
                onClick={handleResend}
              >
                <RefreshCw size={15} />
                <span>Resend OTP</span>
              </button>
            ) : (
              <div className="otp-timer-pill">
                <Clock size={15} />
                <span>Resend OTP in <strong>{timer}s</strong></span>
              </div>
            )}
          </div>

          <div className="otp-actions-row">
            <button
              type="button"
              className="otp-btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="otp-btn-primary"
              disabled={isVerifying || otpDigits.join('').length < 6}
            >
              {isVerifying ? (
                <>Verifying...</>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Verify & Proceed</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
