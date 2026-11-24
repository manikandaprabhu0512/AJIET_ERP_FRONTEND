import React, { useState, useEffect } from "react";
import "./RoleSelectionGateway.css";
import ajietLogo from "../assets/ajiet-logo.png";
import Footer from "../common/Footer";
import {
  GraduationCap,
  Award,
  Building2,
  Landmark,
  ArrowRight,
  Clock,
} from "lucide-react";

export default function RoleSelectionGateway({ onSelectRole }) {
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  // Live real-time institutional clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      setCurrentDate(`${day}/${month}/${year}`);

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12;
      setCurrentTime(
        `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${ampm}`,
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Direct Handlers to Navigate to Respective Login Portals
  const handleStudentSelect = () => {
    onSelectRole({
      category: "student",
      subRole: "Student",
      title: "Student Portal Login",
      identifierType: "USN",
      exampleId: "4JK26AB123",
    });
  };

  const handleFacultySelect = () => {
    onSelectRole({
      category: "faculty",
      subRole: "Faculty",
      title: "Faculty Portal Login",
      identifierType: "Staff ID",
      exampleId: "ABCDE12345",
    });
  };

  const handleDeptSelect = () => {
    onSelectRole({
      category: "department",
      subRole: "Department Staff",
      title: "Departmental Portal Login",
      identifierType: "Staff ID",
      exampleId: "HODCS12345",
    });
  };

  const handleInstSelect = () => {
    onSelectRole({
      category: "institution",
      subRole: "Institutional Staff",
      title: "Institutional Portal Login",
      identifierType: "Staff ID",
      exampleId: "PRIN012345",
    });
  };

  return (
    <div className="erp-gateway-page">
      {/* Subtle ambient lighting for depth */}
      <div className="gateway-ambient-orb orb-top" />
      <div className="gateway-ambient-orb orb-bottom" />

      {/* 1. Official Institutional Masthead Banner */}
      <header className="erp-masthead">
        <div className="masthead-main-row">
          <div className="masthead-logo-col">
            <img
              src={ajietLogo}
              alt="AJIET Emblem"
              className="masthead-logo-img"
            />
            <span className="masthead-mobile-name">AJIET</span>
          </div>

          <div className="masthead-text-col">
            {/* <span className="masthead-trust-name">Laxmi Memorial Education Trust (R.)</span> */}
            <h1 className="masthead-college-name">
              A. J. INSTITUTE OF ENGINEERING & TECHNOLOGY
            </h1>
            <p className="masthead-affiliations">
              Affiliated to Visvesvaraya Technological University, Belagavi •
              Approved by AICTE, New Delhi • Recognized by Govt. of Karnataka
            </p>
            <p className="masthead-campus-address">
              NH-66, Kottara Chowki, Mangaluru - 575006, Dakshina Kannada,
              Karnataka, India
            </p>
          </div>

          <div className="masthead-status-col">
            {/* <div className="erp-system-badge">
              <span className="system-status-indicator"></span>
              <span className="system-status-text">ERP Portal Active</span>
            </div> */}
            <div className="system-live-clock">
              <Clock size={13} />
              <span>
                {currentDate} • {currentTime}
              </span>
            </div>
          </div>
        </div>

        {/* 2. Institutional Sub-Band */}
        <div className="erp-portal-subbar">
          <div className="subbar-content">
            <span className="subbar-title">CENTRAL AUTHENTICATION</span>
          </div>
        </div>
      </header>

      {/* 3. Central Working Area: 4 Themed 2-Liner Portal Cards */}
      <main className="erp-gateway-main">
        <div className="erp-portals-grid">
          {/* Card 1: Student Portal */}
          <button
            type="button"
            className="portal-nav-btn btn-portal-student"
            onClick={handleStudentSelect}
          >
            <div className="btn-icon-wrapper">
              <GraduationCap size={26} />
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-title">Student</span>
              <span className="btn-action-line">
                Portal <ArrowRight size={18} className="btn-arrow" />
              </span>
            </div>
          </button>

          {/* Card 2: Faculty Portal */}
          <button
            type="button"
            className="portal-nav-btn btn-portal-faculty"
            onClick={handleFacultySelect}
          >
            <div className="btn-icon-wrapper">
              <Award size={26} />
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-title">Faculty</span>
              <span className="btn-action-line">
                Portal <ArrowRight size={18} className="btn-arrow" />
              </span>
            </div>
          </button>

          {/* Card 3: Departmental Portal */}
          <button
            type="button"
            className="portal-nav-btn btn-portal-dept"
            onClick={handleDeptSelect}
          >
            <div className="btn-icon-wrapper">
              <Building2 size={26} />
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-title">Departmental</span>
              <span className="btn-action-line">
                Portal <ArrowRight size={18} className="btn-arrow" />
              </span>
            </div>
          </button>

          {/* Card 4: Institutional Portal */}
          <button
            type="button"
            className="portal-nav-btn btn-portal-inst"
            onClick={handleInstSelect}
          >
            <div className="btn-icon-wrapper">
              <Landmark size={26} />
            </div>
            <div className="btn-text-content">
              <span className="btn-primary-title">Institutional</span>
              <span className="btn-action-line">
                Portal <ArrowRight size={18} className="btn-arrow" />
              </span>
            </div>
          </button>
        </div>
      </main>

      {/* 4. Official Institutional Universal System Footer */}
      <Footer />
    </div>
  );
}
