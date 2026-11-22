import React from 'react';
import './deleteConfirm.css';
import { X } from 'lucide-react';

/**
 * DeleteConfirm - Modal dialog matching the reference UI
 * @param {boolean} isOpen - Controls modal visibility
 * @param {string} title - Header banner title (default: "Delete Record")
 * @param {string} heading - Prominent question (default: "Are you sure?")
 * @param {string} message - Warning message
 * @param {string} itemName - Optional item name or ID to highlight
 * @param {function} onConfirm - Callback when user clicks Delete
 * @param {function} onCancel - Callback when user cancels
 * @param {string} confirmText - Button text (default: "Delete")
 * @param {string} cancelText - Button text (default: "Cancel")
 */
export default function DeleteConfirm({
  isOpen = false,
  title = 'Delete Record',
  heading = 'Are you sure?',
  message = '',
  itemName = '',
  onConfirm = () => {},
  onCancel = () => {},
  confirmText = 'Delete',
  cancelText = 'Cancel'
}) {
  if (!isOpen) return null;

  return (
    <div className="custom-popup-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
      <div className="custom-popup-card delete-card" onClick={(e) => e.stopPropagation()}>
        {/* Red Header Banner */}
        <div className="popup-top-banner banner-danger">
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
                Do you really want to delete <strong>{itemName}</strong>? This action cannot be undone.
              </>
            ) : (
              'Do you really want to delete this record? This action cannot be undone.'
            )}
          </p>
        </div>

        {/* Actions Footer */}
        <div className="popup-footer-actions">
          <button type="button" className="action-btn btn-danger-solid" onClick={onConfirm}>
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
