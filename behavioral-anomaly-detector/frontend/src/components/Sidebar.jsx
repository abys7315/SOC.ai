import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Users, 
  Activity, 
  Crosshair, 
  Search, 
  BarChart2, 
  Database, 
  Server, 
  Settings,
  X
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { path: '/alerts', icon: <AlertTriangle size={20} />, label: 'Alerts', badgeId: 'alerts' },
  { path: '/entities', icon: <Users size={20} />, label: 'Entities' },
  { path: '/analytics', icon: <Activity size={20} />, label: 'Behavior Analytics' },
  { path: '/injection', icon: <Crosshair size={20} />, label: 'Attack Injection' },
  { path: '/explainability', icon: <Search size={20} />, label: 'Explainability' },
  { path: '/evaluation', icon: <BarChart2 size={20} />, label: 'Evaluation' },
  { path: '/generator', icon: <Database size={20} />, label: 'Data Generator' },
  { path: '/health', icon: <Server size={20} />, label: 'System Health' },
  { path: '/settings', icon: <Settings size={20} />, label: 'Settings' }
];

export default function Sidebar({ mobileOpen, closeSidebar, alerts = [] }) {
  return (
    <div className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div>
          <h2 className="brand-title" style={{color: 'var(--accent-red)'}}>SOC<span style={{color: 'white'}}>.AI</span></h2>
          <p className="brand-subtitle">Behavioral Anomaly<br/>Detection Platform</p>
        </div>
        <button className="mobile-close-btn" onClick={closeSidebar} style={{display: 'none', background: 'transparent', border: 'none', color: 'white'}}>
           <X size={20} />
        </button>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => (
          <NavLink 
            to={item.path} 
            key={item.path}
            className={({isActive}) => `nav-item ${isActive ? 'active' : ''}`}
            onClick={closeSidebar}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {item.badgeId === 'alerts' && alerts.length > 0 && <span className="nav-badge">{alerts.length}</span>}
            {item.badge && <span className="nav-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <Users size={16} />
          </div>
          <div className="user-info">
            <span className="role">SOC Analyst</span>
            <span className="name">soc_analyst</span>
          </div>
        </div>
      </div>
    </div>
  );
}
