import React, { useState, useEffect, useRef } from 'react';
import { Activity, Bell, Search, Menu, X, ShieldAlert, AlertTriangle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TopHUD.css';

export default function TopHUD({ connectionStatus, toggleSidebar, alerts = [] }) {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  const navigate = useNavigate();
  const location = useLocation();
  const notifRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/entities', { state: { entityId: searchQuery.trim() } });
      setIsSearching(false);
      setSearchQuery('');
    }
  };

  const getPageTitle = (path) => {
    switch (path) {
      case '/': return 'Dashboard Overview';
      case '/alerts': return 'Active Alerts';
      case '/entities': return 'Entity Explorer';
      case '/analytics': return 'Behavior Analytics';
      case '/injection': return 'Attack Simulator';
      case '/explainability': return 'AI Explainability';
      case '/evaluation': return 'Model Evaluation';
      case '/health': return 'System Health';
      case '/generator': return 'Data Generator';
      case '/settings': return 'Settings';
      default: return 'SOC Analytics';
    }
  };

  const criticalAlerts = alerts.filter(a => a.risk_score > 0.8).slice(0, 5);
  const badgeCount = criticalAlerts.length;

  return (
    <header className="top-hud">
      <div className="hud-left" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <button className="mobile-menu-btn" onClick={toggleSidebar}>
           <Menu size={20} />
        </button>
        <h1>{getPageTitle(location.pathname)}</h1>
      </div>
      <div className="hud-right">
        <div className={`status-pill ${connectionStatus.includes('LOST') ? 'disconnected' : 'connected'}`}>
          <div className="status-dot"></div>
          <span className="status-text">{connectionStatus.includes('LOST') ? 'RECONNECTING...' : 'LIVE'}</span>
        </div>
        
        <div className="hud-time">
          <Activity size={14} color="var(--accent-cyan)" />
          <span className="time-text">{time}</span>
        </div>

        <div className="hud-actions">
          {isSearching ? (
            <div className="search-bar-container">
              <Search size={16} color="var(--text-secondary)" />
              <input 
                autoFocus
                type="text" 
                placeholder="Search entity ID..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                onBlur={() => { if(!searchQuery) setIsSearching(false); }}
                className="search-input"
              />
              <button className="icon-btn" onClick={() => setIsSearching(false)} style={{padding: 0}}><X size={16} /></button>
            </div>
          ) : (
            <button className="icon-btn" onClick={() => setIsSearching(true)}><Search size={18} /></button>
          )}

          <div className="notification-container" ref={notifRef}>
            <button className="icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
              <Bell size={18} />
              {badgeCount > 0 && <span className="badge">{badgeCount}</span>}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notif-header">
                  <h4>Critical Alerts</h4>
                  <span onClick={() => { setShowNotifications(false); navigate('/alerts'); }}>View All</span>
                </div>
                <div className="notif-body">
                  {criticalAlerts.length === 0 ? (
                    <div className="notif-empty">No critical alerts at this time.</div>
                  ) : (
                    criticalAlerts.map(alert => (
                      <div className="notif-item" key={alert.id} onClick={() => { setShowNotifications(false); navigate('/alerts', { state: { alertId: alert.id }}); }}>
                        <div className="notif-icon"><ShieldAlert size={16} color="var(--accent-red)"/></div>
                        <div className="notif-content">
                          <div className="notif-title">{alert.anomaly_type.replace('_', ' ').toUpperCase()}</div>
                          <div className="notif-desc">{alert.entity_id} - {(alert.risk_score * 100).toFixed(0)}/100 Risk</div>
                          <div className="notif-time">{new Date(alert.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
