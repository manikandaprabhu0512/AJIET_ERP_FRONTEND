import React, { useState, useEffect } from 'react';
import './nointernet.css';
import { WifiOff } from 'lucide-react';

/**
 * NoInternet - Global network connectivity monitor
 * Displays an animated transparent glassmorphic overlay whenever connection is lost.
 * Automatically resumes once the connection is restored.
 */
export default function NoInternet() {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // If connected, do not render anything
  if (isOnline) {
    return null;
  }

  return (
    <div className="no-internet-overlay" role="alertdialog" aria-modal="true">
      <div className="no-internet-card transparent-card">
        {/* Animated Wi-Fi Disconnected Pulse */}
        <div className="wifi-offline-wrapper">
          <div className="wifi-pulse-wave wifi-pulse-wave-1"></div>
          <div className="wifi-pulse-wave wifi-pulse-wave-2"></div>
          <div className="wifi-icon-circle">
            <WifiOff size={36} className="wifi-offline-icon" />
          </div>
        </div>

        {/* Message */}
        <h2 className="no-internet-title">No Internet Connection</h2>
        <p className="no-internet-desc">
          You are currently offline. Please check your network cables or Wi-Fi connection.
          The system will automatically resume once the connection is restored.
        </p>

        {/* Real-time Connection Listener Status Indicator */}
        <div className="reconnecting-status">
          <div className="reconnecting-spinner"></div>
          <span>Waiting for connection...</span>
        </div>
      </div>
    </div>
  );
}
