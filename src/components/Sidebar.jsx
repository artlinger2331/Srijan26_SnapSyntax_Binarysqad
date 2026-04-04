import React from 'react';

const Sidebar = ({ expanded, setExpanded, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: '⊞' },
    { id: 'inventory', name: 'Inventory', icon: '📦' },
    { id: 'suppliers', name: 'Suppliers', icon: '🤝' },
    { id: 'shipments', name: 'Shipments', icon: '🚚' },
  ];

  return (
    <div className={`sidebar ${expanded ? 'expanded' : 'collapsed'}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo-mark">⚡</div>
        {expanded && <span className="sidebar-logo-text">NexStock</span>}
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
            title={!expanded ? item.name : undefined}
          >
            <span className="nav-icon">{item.icon}</span>
            {expanded && item.name}
          </button>
        ))}
      </nav>
      <div style={{ padding: '16px 10px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button className="nav-item" title={!expanded ? 'Settings' : undefined}>
          <span className="nav-icon">⚙️</span>
          {expanded && 'Settings'}
        </button>
      </div>
      <button className="sidebar-toggle-btn" onClick={() => setExpanded(!expanded)}>
        {expanded ? '‹' : '›'}
      </button>
    </div>
  );
};

export default Sidebar;
