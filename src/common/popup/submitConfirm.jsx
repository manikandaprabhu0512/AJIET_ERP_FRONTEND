import React from 'react';
import './deleteConfirm.css'; // shares identical responsive structure and styles
import { X } from 'lucide-react';

/**
 * SubmitConfirm - Modal dialog matching the reference UI using our brand color code (#0a66c2 / #042d57)
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} title - Header banner title (default: "Confirm Submission")
 * @param {string} heading - Prominent question (default: "Are you sure?")
 * @param {string} message - Warning/info message
 * @param {string} itemName - Optional item name or ID to highlight
 * @param {function} onConfirm - Callback when user clicks Submit
 * @param {function} onCancel - Callback when user cancels
 * @param {string} confirmText - Button text (default: "Submit")
 * @param {string} cancelText - Button text (default: "Cancel")
 */
export default function SubmitConfirm({
  isOpen = false,
  title = 'Confirm Submission',
  heading = 'Are you sure?',
  message = '',
  itemName = '',
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = 'Submit',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <div className="custom-popup-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="custom-popup-card submit-card" onClick={(e) => e.stopPropagation()}>
        {/* Primary Blue Header Banner (Our Color Code) */}
        <div className="popup-top-banner banner-primary">
          <h3 className="banner-heading-text">{title}</h3>
          <button
            type="button"
            className="banner-close-circle"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="popup-main-body">
          <h4 className="popup-question-title">{heading}</h4>
          <p className="popup-detail-text">
            {message ? (
              message
            ) : itemName ? (
              <>
                Do you really want to submit <strong>{itemName}</strong>? Please review before proceeding.
              </>
            ) : (
              'Do you really want to submit this record? Please review before proceeding.'
            )}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="popup-footer-actions">
          <button type="button" className="action-btn btn-primary-solid" onClick={onConfirm}>
            {confirmText}
          </button>
          <button type="button" className="action-btn btn-cancel-outline" onClick={onCancel}>
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
