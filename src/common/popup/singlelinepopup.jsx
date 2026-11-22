import React, { useEffect } from 'react';
import './singlelinepopup.css';

/**
 * SingleLinePopup - Clean floating dark toast matching Image 2 reference UI
 * @param {boolean} isOpen - Controls visibility
 * @param {string} message - Message text to display
 * @param {function} onClose - Callback when dismissed
 * @param {number} duration - Auto dismiss timeout in ms (default: 3200ms)
 */
export default function SingleLinePopup({
  isOpen = false,
  message = '',
  onClose = () => {},
  duration = 3200
}) {
  useEffect(() => {
    if (!isOpen || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, duration, onClose]);

  if (!isOpen || !message) return null;

  return (
    <div className="single-line-toast-overlay" onClick={onClose} role="alert">
      <div className="single-line-toast-box">
        <p className="single-line-toast-text">{message}</p>
      </div>
    </div>
  );
}
