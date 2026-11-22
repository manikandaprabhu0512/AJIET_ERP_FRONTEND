import React from 'react';
import './SubHeader.css';

export default function SubHeader({ activeTab = 'academic', onTabChange = () => {} }) {
  const tabs = [
    { id: 'academic', label: 'Academic' },
    { id: 'administration', label: 'Administration' },
    { id: 'accreditation', label: 'Accreditation' }
  ];

  return (
    <nav className="erp-subheader">
      <div className="module-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="breadcrumb">
        <span>AJIET ERP</span> &gt; <span className="current-path">{activeTab.toUpperCase()}</span>
      </div>
    </nav>
  );
}

