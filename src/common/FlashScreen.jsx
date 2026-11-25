import React, { useEffect, useState } from 'react';
import './FlashScreen.css';
import ajietLogo from '../assets/ajiet-logo.png';

/**
 * FlashScreen - Animated loading screen before entering Dashboard
 * @param {function} onComplete - Callback invoked when animation finishes
 */
export default function FlashScreen({ onComplete = () => {} }) {
  const [progress, setProgress] = useState(15);
  const [statusText, setStatusText] = useState('Verifying administrator credentials...');

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setProgress(45);
      setStatusText('Loading institute modules and security policies...');
    }, 500);

    const timer2 = setTimeout(() => {
      setProgress(85);
      setStatusText('Initializing AJIET ERP Workspace...');
    }, 1100);

    const timer3 = setTimeout(() => {
      setProgress(100);
      setStatusText('Welcome, Administrator!');
    }, 1700);

    const timer4 = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, [onComplete]);

  return (
    <div className="flash-screen-container">
      <div className="flash-screen-content">
        {/* Pulsing Logo with Glow */}
        <div className="flash-logo-wrapper">
          <div className="glow-ring glow-ring-1"></div>
          <div className="glow-ring glow-ring-2"></div>
          <img src={ajietLogo} alt="AJIET Logo" className="flash-logo-img" />
        </div>

        <h1 className="flash-title">AJIET</h1>
        <p className="flash-subtitle">ERP Software</p>

        {/* Progress Bar */}
        <div className="flash-progress-bar-track">
          <div
            className="flash-progress-bar-fill"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Animated Loading Text */}
        <div className="flash-status-row">
          <div className="spinner-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
          <span className="flash-status-text">{statusText}</span>
        </div>
      </div>
    </div>
  );
}
