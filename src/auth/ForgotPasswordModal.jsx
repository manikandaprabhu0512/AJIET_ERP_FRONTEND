import React, { useState } from 'react';
import './ForgotPasswordModal.css';
import { KeyRound, X, AlertCircle, ArrowRight } from 'lucide-react';
import {
  getStoredUsers,
  generateRandomOtp,
  validateUsnFormat,
  validateStaffIdFormat
} from '../services/authService';

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  portalType,
  onRequestOtp
}) {
  const [identifier, setIdentifier] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanId = identifier.trim().toUpperCase();

    if (!cleanId) {
      setErrorMessage(
        portalType === 'student' ? 'Please enter your USN.' : 'Please enter your Staff ID.'
      );
      return;
    }

    if (portalType === 'student' && !validateUsnFormat(cleanId)) {
      setErrorMessage('USN must be 10 characters in VTU format (e.g. 4JK26AB123).');
      return;
    }

    if (portalType === 'management' && !validateStaffIdFormat(cleanId)) {
      setErrorMessage('Staff ID must be 10 characters (e.g. ABCDE12345).');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const users = getStoredUsers();
      const existingUser = users[cleanId];
      const email = existingUser ? existingUser.email : `${cleanId.toLowerCase()}@ajiet.ac.in`;
      const otp = generateRandomOtp();

      onRequestOtp({
        identifier: cleanId,
        email,
        otp,
        isForgotFlow: true
      });
    }, 400);
  };

  return (
    <div className="forgot-modal-backdrop" onClick={onClose}>
      <div
        className="forgot-modal-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button className="forgot-modal-close" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        <div className="forgot-icon-header">
          <div className="forgot-icon-badge">
            <KeyRound size={28} />
          </div>
          <h3 className="forgot-modal-title">Password Recovery</h3>
          <p className="forgot-modal-subtitle">
            {portalType === 'student'
              ? 'Enter your 10-character USN to receive a password reset OTP on your registered email.'
              : 'Enter your 10-character Staff ID to receive a password reset OTP on your registered email.'}
          </p>
        </div>

        {errorMessage && (
          <div className="forgot-error-alert">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="forgot-form">
          <div className="form-group">
            <label className="input-label">
              {portalType === 'student' ? 'Student USN' : 'Staff ID'}
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                className="forgot-input"
                placeholder={portalType === 'student' ? 'e.g. 4JK26AB123' : 'e.g. ABCDE12345'}
                maxLength={10}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value.toUpperCase())}
                autoFocus
                required
              />
            </div>
            <span className="input-hint">Strictly 10 alphanumeric characters</span>
          </div>

          <div className="forgot-actions">
            <button
              type="button"
              className="forgot-btn-secondary"
              onClick={onClose}
            >
              Back to Login
            </button>
            <button
              type="submit"
              className="forgot-btn-primary"
              disabled={isSubmitting || identifier.trim().length !== 10}
            >
              {isSubmitting ? (
                <>Sending OTP...</>
              ) : (
                <>
                  <span>Send Recovery OTP</span>
                  <ArrowRight size={17} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
