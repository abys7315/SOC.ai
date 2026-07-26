import React from 'react';
import { Activity, Bell, Search, Calendar, ChevronDown, Menu } from 'lucide-react';
import './TopHUD.css';

export default function TopHUD({ title, connectionStatus, toggleSidebar }) {
  return (
    <header className="top-hud">
      <div className="hud-left" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
        <button className="mobile-menu-btn" style={{display: 'none'}} onClick={toggleSidebar}>
           <Menu size={20} />
        </button>
        <h1>{title}</h1>
      </div>
      <div className="hud-right">
        <div className={`status-pill ${connectionStatus.includes('LOST') ? 'disconnected' : 'connected'}`}>
          <div className="status-dot"></div>
          {connectionStatus.includes('LOST') ? 'RECONNECTING...' : 'LIVE'}
        </div>
        
        <div className="hud-time">
          <Activity size={14} color="var(--accent-cyan)" />
          <span className="time-text">{new Date().toLocaleTimeString()}</span>
        </div>

        <div className="hud-actions">
          <button className="icon-btn"><Search size={18} /></button>
          <button className="icon-btn"><Bell size={18} /><span className="badge">3</span></button>
        </div>
      </div>
    </header>
  );
}
