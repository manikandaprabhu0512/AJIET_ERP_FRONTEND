import React, { useState } from "react";
import "./Header.css";
import ajietLogo from "../assets/ajiet-logo.png";
import { Home, Bell, Settings, Search, User, LogOut, Menu } from "lucide-react";

export default function Header({
  onLogout = () => { },
  currentUser = null,
  onToggleSidebar = null,
  isSidebarOpen = true,
  currentDate = null,
  currentTime = null,
  displayName = null,
  displaySubtitle = null
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Use passed displayName if provided; otherwise fall back to currentUser
  const headerName = displayName || currentUser?.name || currentUser?.username || "Administrator";
  // Use passed subtitle if provided (USN); otherwise fall back to role
  const headerSubtitle = displaySubtitle || (currentUser?.role ? currentUser.role.toUpperCase() : "Administrator");

  return (
    <header className="ajiet-main-header">
      {/* 1. Left Section: Logo + Title (600) + Subtitle (500) */}
      <div className="header-brand-section">
        {onToggleSidebar && (
          <button
            type="button"
            className="sidebar-hamburger-btn"
            onClick={onToggleSidebar}
            title={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-label="Toggle Navigation Sidebar"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="header-logo-container">
          <img
            src={ajietLogo}
            alt="AJIET Emblem"
            className="header-logo-image"
          />
        </div>
        <div className="header-text-group">
          <h1 className="header-institute-title">AJIET </h1>
          <p className="header-erp-subtitle">ERP Software</p>
        </div>
      </div>

      {/* 2. Center Section: Search Bar matching uploaded UI */}
      <div className="header-search-wrapper">
        <div className="header-search-pill">
          <input
            type="text"
            className="search-text-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="button"
            className="search-submit-btn"
            aria-label="Search"
          >
            <Search size={18} />
          </button>
        </div>
      </div>

      {/* 3. Right Section: Quick Icons | Vertical Break | Profile */}
      <div className="header-right-cluster">
        {/* DateTime Pill (shown only when date/time props are passed) */}
        {currentDate && currentTime && (
          <div className="header-datetime-pill">
            <span className="header-date-part">{currentDate}</span>
            <span className="header-datetime-sep">|</span>
            <span className="header-time-part">{currentTime}</span>
          </div>
        )}

        {/* Quick Action Icons: Home, Notification, Settings */}
        <div className="header-quick-icons">
          <button
            type="button"
            className="quick-icon-btn"
            title="Home"
            aria-label="Home"
          >
            <Home size={19} />
          </button>
          <button
            type="button"
            className="quick-icon-btn notif-btn"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="notif-count-badge">99</span>
          </button>
          <button
            type="button"
            className="quick-icon-btn"
            title="Settings"
            aria-label="Settings"
          >
            <Settings size={19} />
          </button>
        </div>

        {/* Vertical Divider Line Break */}
        <div className="header-vertical-divider"></div>

        {/* Rightmost Profile with In-Place Logout Hover Morph */}
        <div
          className="header-user-profile"
          onClick={onLogout}
          title="Click to Logout"
          role="button"
          tabIndex={0}
        >
          {/* Avatar Icon: switches from User to red gradient Logout icon on hover */}
          <div className="user-avatar-circle">
            <User size={19} className="avatar-icon icon-user" />
            <LogOut size={19} className="avatar-icon icon-logout" />
          </div>

          {/* Text details: fixed width, switches from user name to Logout on hover */}
          <div className="user-details-column">
            <span className="user-display-name text-default" title={headerName}>
              {headerName}
            </span>
            <span className="user-display-name text-hover">Logout</span>
            <span className="user-display-role role-default">
              {headerSubtitle}
            </span>
            <span className="user-display-role role-hover">Click to Exit</span>
          </div>
        </div>
      </div>
    </header>
  );
}
