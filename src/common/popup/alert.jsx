import React from 'react';
import './alert.css';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

/**
 * Alert - Standard alert modal with acknowledgment button
 * @param {boolean} isOpen - Controls visibility
 * @param {string} title - Alert title
 * @param {string} message - Alert message body
 * @param {'success'|'error'|'warning'|'info'} type - Alert severity type
 * @param {function} onClose - Callback when dismissed
 * @param {string} buttonText - Action button label (default: "OK")
 */
export default function Alert({
  isOpen = false,
  title = 'Notice',
  message = '',
  type = 'info',
  onClose = () => {},
  buttonText = 'OK'
}) {
  if (!isOpen) return null;

  const renderIcon = () => {
    switch (type) {
      case 'success':
        return (
          <div className="icon-badge icon-badge-success">
            <CheckCircle2 size={24} />
          </div>
        );
      case 'error':
        return (
          <div className="icon-badge icon-badge-danger">
            <XCircle size={24} />
          </div>
        );
      case 'warning':
        return (
          <div className="icon-badge icon-badge-warning">
            <AlertTriangle size={24} />
          </div>
        );
      case 'info':
      default:
        return (
          <div className="icon-badge icon-badge-info">
            <Info size={24} />
          </div>
        );
    }
  };

  return (
    <div className="popup-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="popup-modal alert-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div className="modal-header">
          {renderIcon()}
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-body">
          <p className="modal-message">{message}</p>
        </div>

        <div className="modal-actions">
          <button type="button" className={`btn-alert-ok btn-${type}`} onClick={onClose}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

