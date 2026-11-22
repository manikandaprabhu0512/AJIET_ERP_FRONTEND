import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Login.css';
import ajietLogo from '../assets/ajiet-logo.png';
import { Eye, EyeOff, RotateCw } from 'lucide-react';

const createInitialCaptcha = () => {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghkmnpqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export default function Login({ onLogin = () => {} }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaCode, setCaptchaCode] = useState(createInitialCaptcha);
  const [userCaptcha, setUserCaptcha] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const canvasRef = useRef(null);

  // Draw clean, neat captcha
  const drawCaptcha = useCallback((code) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Neat crisp background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    // Neat, elegant captcha text (4 letters spaced)
    ctx.font = 'bold 24px "SF Pro Text", monospace, sans-serif';
    ctx.fillStyle = '#042d57';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const spacedText = code.split('').join('   ');
    ctx.fillText(spacedText, width / 2, height / 2);
  }, []);

  const generateCaptcha = useCallback(() => {
    const code = createInitialCaptcha();
    setCaptchaCode(code);
    setUserCaptcha('');
    setErrorMessage('');
    drawCaptcha(code);
  }, [drawCaptcha]);

  useEffect(() => {
    drawCaptcha(captchaCode);
  }, [captchaCode, drawCaptcha]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter username');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter password');
      return;
    }

    if (userCaptcha.trim().toLowerCase() !== captchaCode.toLowerCase()) {
      setErrorMessage('Invalid captcha. Please try again.');
      generateCaptcha();
      return;
    }

    // Dummy login validation: username: admin, password: admin123
    if (username.trim() !== 'admin' || password !== 'admin123') {
      setErrorMessage('Invalid credentials! Please use username: admin & password: admin123');
      return;
    }

    onLogin({ username, role: 'admin' });
  };

  return (
    <div className="login-page-container">
      <div className="mini-login-card">
        {/* Left Section */}
        <div className="login-left-section">
          <div className="logo-wrapper">
            <img src={ajietLogo} alt="AJIET Emblem" className="ajiet-logo-img" />
          </div>
          <div className="left-brand-text">
            <h1 className="left-title">AJIET</h1>
            <p className="left-subtitle">ERP Software System</p>
          </div>
        </div>

        {/* Right Section */}
        <div className="login-right-section">
          <h2 className="login-card-title">Admin Login</h2>

          {errorMessage && <div className="login-error-alert">{errorMessage}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            {/* Username Field */}
            <div className="input-group">
              <input
                type="text"
                className="login-input"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />
            </div>

            {/* Password Field with Toggle Eye */}
            <div className="input-group password-group">
              <input
                type={showPassword ? 'text' : 'password'}
                className="login-input password-input"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Full-Width Captcha & Refresh Section */}
            <div className="captcha-display-row">
              <div className="canvas-box">
                <canvas ref={canvasRef} width={260} height={46} className="captcha-canvas" />
              </div>
              <button
                type="button"
                className="captcha-refresh-btn"
                onClick={generateCaptcha}
                title="Refresh Captcha"
                aria-label="Refresh Captcha"
              >
                <RotateCw size={19} />
              </button>
            </div>

            {/* Enter Captcha Field */}
            <div className="input-group">
              <input
                type="text"
                className="login-input"
                placeholder="Enter Captcha"
                value={userCaptcha}
                onChange={(e) => setUserCaptcha(e.target.value)}
                autoComplete="off"
              />
            </div>

            {/* Log In Button */}
            <button type="submit" className="login-btn">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
