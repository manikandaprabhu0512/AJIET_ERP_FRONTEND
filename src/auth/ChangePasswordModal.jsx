import React, { useState } from 'react';
import './ChangePasswordModal.css';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ChangePasswordModal({
  isOpen,
  identifier,
  _role,
  onPasswordChangeSuccess,
  isMandatoryFirstTime = true
}) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Validation rules
  const hasMinLength = newPassword.length >= 6;
  const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword;
  const isDifferentFromDefault = newPassword !== identifier;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!hasMinLength) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword === identifier) {
      setErrorMessage('New password cannot be the same as your default username/ID.');
      return;
    }

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match. Please re-check.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onPasswordChangeSuccess(newPassword);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(error.message || 'Failed to update password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="change-pass-backdrop">
      <div className="change-pass-card" role="dialog" aria-modal="true">
        {/* Header Icon */}
        <div className="change-pass-header">
          <div className={`pass-badge ${isSuccess ? 'success' : ''}`}>
            {isSuccess ? <CheckCircle2 size={32} /> : <ShieldCheck size={32} />}
          </div>
          <h3 className="change-pass-title">
            {isSuccess
              ? 'Password Updated Successfully!'
              : isMandatoryFirstTime
              ? 'Set Your New Password'
              : 'Reset Your Password'}
          </h3>
          <p className="change-pass-subtitle">
            {isSuccess ? (
              'Redirecting you to your dashboard...'
            ) : isMandatoryFirstTime ? (
              <>
                First login detected for <strong>{identifier}</strong>. For your
                account security, please create a new personalized password.
              </>
            ) : (
              <>Enter and confirm your new secure password below.</>
            )}
          </p>
        </div>

        {isSuccess ? (
          <div className="pass-success-state">
            <div className="success-pulse-ring">
              <CheckCircle2 size={48} className="pulse-check" />
            </div>
            <p className="success-note">
              Your new password is now active. You will use this for all future logins.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="change-pass-form">
            {errorMessage && (
              <div className="pass-error-alert">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* New Password Input */}
            <div className="form-group">
              <label className="input-label">New Password</label>
              <div className="password-wrapper">
                <input
                  type={showNew ? 'text' : 'password'}
                  className="pass-input"
                  placeholder="Enter new password (min. 6 chars)"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowNew((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <label className="input-label">Confirm New Password</label>
              <div className="password-wrapper">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className="pass-input"
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="pass-toggle"
                  onClick={() => setShowConfirm((p) => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Live Password Checklist */}
            <div className="pass-checklist">
              <div className={`check-item ${hasMinLength ? 'valid' : ''}`}>
                <CheckCircle2 size={14} />
                <span>At least 6 characters</span>
              </div>
              <div className={`check-item ${isDifferentFromDefault ? 'valid' : ''}`}>
                <CheckCircle2 size={14} />
                <span>Different from initial ID</span>
              </div>
              <div className={`check-item ${passwordsMatch ? 'valid' : ''}`}>
                <CheckCircle2 size={14} />
                <span>Passwords match</span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="pass-submit-btn"
              disabled={isSubmitting || !hasMinLength || !passwordsMatch || !isDifferentFromDefault}
            >
              {isSubmitting ? (
                <>Saving New Password...</>
              ) : (
                <>
                  <Lock size={18} />
                  <span>Update Password & Enter Dashboard</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
