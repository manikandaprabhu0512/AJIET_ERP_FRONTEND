import React from "react";
import "./Footer.css";
import { ShieldCheck } from "lucide-react";

/**
 * Universal Unified Institutional ERP Footer for all AJIET pages
 */
export default function Footer({
  helpdeskEmail = "erp.support@ajiet.ac.in",
  intercom = "Ext. 402",
  showNotice = true,
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="erp-system-footer">
      <div className="footer-top-row">
        <div className="footer-col-left">
          <span className="footer-org">
            © {currentYear} A. J. Institute of Engineering &amp; Technology,
            Mangaluru. All Rights Reserved.
          </span>
          <span className="footer-sub">Developed by AJIET</span>
          <span className="footer-line-mobile footer-copyright-mobile">
            © {currentYear} A. J. Institute of Engineering &amp; Technology,
            Mangaluru
          </span>
          <span className="footer-line-mobile footer-developed-mobile">
            Developed by AJIET
          </span>
          <span className="footer-line-mobile footer-helpdesk-mobile">
            Helpdesk: <strong>{helpdeskEmail}</strong>
          </span>
        </div>
        <div className="footer-col-right">
          <span className="footer-helpdesk footer-helpdesk-desktop">
            ERP Helpdesk: <strong>{helpdeskEmail}</strong>
          </span>
          {/* <span className="footer-secure">
            <ShieldCheck size={13} /> Official Secured Institutional Server
          </span> */}
        </div>
      </div>
      {showNotice && (
        <div className="footer-bottom-notice">
          Notice: This software is intended exclusively for authorized students,
          faculty, and administrative staff of AJIET. Unauthorized access or
          attempt to circumvent security is strictly prohibited.
        </div>
      )}
    </footer>
  );
}
