import React, { useState, useEffect } from 'react';
import { useAppContext } from '../AppContext';
import { 
  Settings as SettingsIcon, Shield, Cpu, Database, Bell, Users, 
  Key, HardDrive, FileText, Activity, Save, Image as ImageIcon,
  Wrench, Info, Box, LayoutTemplate, Sliders, ChevronRight
} from 'lucide-react';
import './Settings.css';
import SettingsSecurity from './settings/SettingsSecurity';
import SettingsSyntheticData from './settings/SettingsSyntheticData';
import SettingsDetectionRules from './settings/SettingsDetectionRules';
import SettingsExplainability from './settings/SettingsExplainability';
import SettingsAI from './settings/SettingsAI';
import SettingsAlerts from './settings/SettingsAlerts';
import SettingsUsers from './settings/SettingsUsers';
import SettingsAPI from './settings/SettingsAPI';
import SettingsStorage from './settings/SettingsStorage';
import SettingsLogs from './settings/SettingsLogs';
import SettingsMonitoring from './settings/SettingsMonitoring';
import SettingsAdvanced from './settings/SettingsAdvanced';
import SettingsBackup from './settings/SettingsBackup';
import SettingsAppearance from './settings/SettingsAppearance';
import SettingsNotifications from './settings/SettingsNotifications';
import SettingsAbout from './settings/SettingsAbout';

const SETTINGS_TABS = [
  { id: 'general', icon: <SettingsIcon size={16}/>, label: 'General' },
  { id: 'security', icon: <Shield size={16}/>, label: 'Security' },
  { id: 'ai', icon: <Cpu size={16}/>, label: 'AI & Model Settings' },
  { id: 'data_gen', icon: <Box size={16}/>, label: 'Synthetic Data Generator' },
  { id: 'rules', icon: <Sliders size={16}/>, label: 'Detection Rules' },
  { id: 'explainability', icon: <LayoutTemplate size={16}/>, label: 'Explainability' },
  { id: 'alerts', icon: <Bell size={16}/>, label: 'Alert Management' },
  { id: 'users', icon: <Users size={16}/>, label: 'User Management' },
  { id: 'api', icon: <Key size={16}/>, label: 'API & Integration' },
  { id: 'storage', icon: <Database size={16}/>, label: 'Data & Storage' },
  { id: 'logs', icon: <FileText size={16}/>, label: 'Logs & Audit' },
  { id: 'monitoring', icon: <Activity size={16}/>, label: 'System Monitoring' },
  { id: 'backup', icon: <HardDrive size={16}/>, label: 'Backup & Recovery' },
  { id: 'appearance', icon: <ImageIcon size={16}/>, label: 'Appearance' },
  { id: 'notifications', icon: <Bell size={16}/>, label: 'Notifications' },
  { id: 'advanced', icon: <Wrench size={16}/>, label: 'Advanced' },
  { id: 'about', icon: <Info size={16}/>, label: 'About' }
];

export default function Settings() {
  const { globalConfig, updateConfig, handleAction } = useAppContext();
  const [activeTab, setActiveTab] = useState('general');
  const [toastMessage, setToastMessage] = useState(null);
  
  // Note: Local config state is needed for unsaved changes before clicking Save.
  // We'll initialize it from globalConfig and update it locally.
  const [localConfig, setLocalConfig] = useState(globalConfig || {});

  useEffect(() => {
    if (globalConfig) {
      setLocalConfig(globalConfig);
    }
  }, [globalConfig]);
  
  const handleChange = (namespace, field, value) => {
    setLocalConfig(prev => ({
      ...prev,
      [namespace]: {
        ...(prev[namespace] || {}),
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    const success = await updateConfig(localConfig);
    if (success) {
      setToastMessage("Settings saved successfully.");
      setTimeout(() => setToastMessage(null), 3000);
    } else {
      setToastMessage("Failed to save settings.");
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  const handleActionWithToast = async (actionName) => {
    const data = await handleAction(actionName);
    setToastMessage(data.message || `Action Executed: ${actionName}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Render the General Tab content matching the screenshot
  const renderGeneralTab = () => (
    <div className="settings-content-grid">
      <div className="settings-main-col">
        {/* Platform Configuration */}
        <div className="glass-panel">
          <h3 className="panel-title">Platform Configuration</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>Platform Name</label>
              <input type="text" value={globalConfig?.general?.platformName || ""} onChange={(e) => handleChange("general", "platformName", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Language</label>
              <select value={globalConfig?.general?.language || ""} onChange={(e) => handleChange("general", "language", e.target.value)}>
                <option>English (US)</option>
                <option>Spanish (ES)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Organization Name</label>
              <input type="text" value={globalConfig?.general?.organizationName || ""} onChange={(e) => handleChange("general", "organizationName", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Session Timeout</label>
              <select value={globalConfig?.general?.sessionTimeout || ""} onChange={(e) => handleChange("general", "sessionTimeout", e.target.value)}>
                <option>15 Minutes</option>
                <option>30 Minutes</option>
              </select>
            </div>
            <div className="form-group">
              <label>Time Zone</label>
              <select value={globalConfig?.general?.timezone || ""} onChange={(e) => handleChange("general", "timezone", e.target.value)}>
                <option value="UTC">UTC</option>
                <option value="EST">(UTC-05:00) Eastern Time</option>
                <option value="IST">(UTC+05:30) Asia/Kolkata</option>
              </select>
            </div>
            <div className="form-group">
              <label>Idle Timeout Warning</label>
              <select value={globalConfig?.general?.idleTimeout || ""} onChange={(e) => handleChange("general", "idleTimeout", e.target.value)}>
                <option>5 Minutes Before</option>
                <option>10 Minutes Before</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date Format</label>
              <select name="general.dateFormat" defaultValue={globalConfig?.general?.dateFormat || "YYYY-MM-DD"}>
                <option>YYYY-MM-DD</option>
              </select>
            </div>
            <div className="form-group">
              <label>Refresh Interval</label>
              <select name="general.refreshInterval" defaultValue={globalConfig?.general?.refreshInterval || "15 Seconds"}>
                <option>15 Seconds</option>
              </select>
            </div>
          </div>
          
          <h4 style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', marginBottom: '0.5rem'}}>Theme</h4>
          <div className="theme-options">
            <div className={`theme-card ${localConfig?.general?.theme === 'Dark' || !localConfig?.general?.theme ? 'active' : ''}`} onClick={() => handleChange("general", "theme", "Dark")}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div className="t-icon">🌙</div> Dark</div>
               <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Default dark mode</span>
            </div>
            <div className={`theme-card ${localConfig?.general?.theme === 'Light' ? 'active' : ''}`} onClick={() => handleChange("general", "theme", "Light")}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div className="t-icon">☀️</div> Light</div>
               <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Light mode</span>
            </div>
            <div className={`theme-card ${localConfig?.general?.theme === 'Auto' ? 'active' : ''}`} onClick={() => handleChange("general", "theme", "Auto")}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><div className="t-icon">💻</div> Auto</div>
               <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>System preference</span>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
             <button className="btn-solid-red" style={{padding: '0.4rem 1rem'}} onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* Default Dashboard Preferences */}
        <div className="glass-panel">
          <h3 className="panel-title">Default Dashboard Preferences</h3>
          <div className="form-grid">
             <div className="form-group">
              <label>Default Dashboard</label>
              <select value={globalConfig?.general?.defaultDashboard || ""} onChange={(e) => handleChange("general", "defaultDashboard", e.target.value)}>
                <option>Overview Dashboard</option>
                <option>Security Operations</option>
              </select>
            </div>
            <div className="form-group">
              <label>Default Time Range</label>
              <select value={globalConfig?.general?.defaultTimeRange || ""} onChange={(e) => handleChange("general", "defaultTimeRange", e.target.value)}>
                <option>Last 24 Hours</option>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div className="form-group">
              <label>Alerts Per Page</label>
              <input type="number" value={globalConfig?.general?.alertsPerPage || 25} onChange={(e) => handleChange("general", "alertsPerPage", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Events Per Page</label>
              <input type="number" value={globalConfig?.general?.eventsPerPage || 50} onChange={(e) => handleChange("general", "eventsPerPage", e.target.value)} />
            </div>
            <div className="form-group">
              <label>Default Chart Type</label>
              <select value={globalConfig?.general?.defaultChartType || ""} onChange={(e) => handleChange("general", "defaultChartType", e.target.value)}>
                <option>Line Chart</option>
                <option>Bar Chart</option>
              </select>
            </div>
            <div className="form-group">
              <label>Auto Refresh</label>
              <select value={globalConfig?.general?.autoRefresh || ""} onChange={(e) => handleChange("general", "autoRefresh", e.target.value)}>
                <option>15 Seconds</option>
                <option>30 Seconds</option>
                <option>1 Minute</option>
              </select>
            </div>
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
             <button className="btn-solid-red" style={{padding: '0.4rem 1rem'}} onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* Configuration Audit */}
        <div className="glass-panel">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 className="panel-title" style={{margin: 0}}>Configuration Audit</h3>
            <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}>View All Logs →</span>
          </div>
          <div className="audit-list">
             <div className="audit-item">
               <div className="fg-label-col">
                <span>Enable Dark Mode</span>
                <span className="fg-sub">Force dark mode for all users</span>
              </div>
              <div className="fg-input-col">
                <div className={`switch ${globalConfig?.general?.darkMode ? "active" : ""}`} onClick={() => handleChange("general", "darkMode", !globalConfig?.general?.darkMode)}>
                  <div className="switch-knob"></div>
                </div>
              </div>
            </div>

            <div className="fg-item">
              <div className="fg-label-col">
                <span>Show Data Tooltips</span>
                <span className="fg-sub">Display contextual help on charts</span>
              </div>
              <div className="fg-input-col">
                <div className={`switch ${globalConfig?.general?.showTooltips ? "active" : ""}`} onClick={() => handleChange("general", "showTooltips", !globalConfig?.general?.showTooltips)}>
                  <div className="switch-knob"></div>
                </div>
              </div>
             </div>
          </div>
        </div>

      </div>

      <div className="settings-side-col">
        {/* System Preferences Toggles */}
        <div className="glass-panel">
          <h3 className="panel-title">System Preferences</h3>
          <div className="toggle-list">
             {[
               {key: 'realtimeAnomaly', label: 'Enable Real-time Anomaly Detection'},
               {key: 'attackInjection', label: 'Enable Attack Injection Module'},
               {key: 'autoResponse', label: 'Enable Auto Response'},
               {key: 'riskScoring', label: 'Enable Risk Scoring'},
               {key: 'dataRetention', label: 'Enable Data Retention'},
               {key: 'modelRetraining', label: 'Enable Model Retraining'},
               {key: 'advancedAnalytics', label: 'Enable Advanced Analytics'},
               {key: 'dataAnonymization', label: 'Enable Data Anonymization'},
               {key: 'betaFeatures', label: 'Show Beta Features'},
             ].map((t) => (
               <div key={t.key} className="toggle-item">
                 <span>{t.label} <Info size={12} style={{marginLeft:'0.2rem', color:'var(--text-secondary)'}}/></span>
                 <div className={`switch ${localConfig?.general?.[t.key] ? 'active' : ''}`} onClick={() => handleChange("general", t.key, !localConfig?.general?.[t.key])}><div className="switch-knob"></div></div>
               </div>
             ))}
          </div>
          <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
             <button className="btn-solid-red" style={{padding: '0.4rem 1rem'}} onClick={handleSave}>Save Changes</button>
          </div>
        </div>

        {/* System Information */}
        <div className="glass-panel">
           <h3 className="panel-title">System Information</h3>
           <div className="sys-info-list">
              <div className="si-item"><span>Platform Version</span><span>v2.3.1</span></div>
              <div className="si-item"><span>Build Number</span><span>3.3.1.20260726</span></div>
              <div className="si-item"><span>Environment</span><span>Production</span></div>
              <div className="si-item"><span>Server Time</span><span>Jul 21, 2026 10:24:35 AM</span></div>
              <div className="si-item"><span>Uptime</span><span>18d 5h 24m</span></div>
              <div className="si-item"><span>Connected Nodes</span><span style={{color: 'var(--accent-green)'}}>24 / 24</span></div>
              <div className="si-item"><span>Log Ingestion Rate</span><span>45.2K events/sec</span></div>
              <div className="si-item"><span>Data Retention</span><span>30 Days</span></div>
           </div>
        </div>

      </div>
    </div>
  );

  return (
      <div className="settings-page">
        <div className="settings-header">
         <div>
            <h2 style={{margin: 0, fontFamily: 'Orbitron', fontSize: '1.25rem'}}>Settings</h2>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem', fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
              <span>Home</span>
              <ChevronRight size={12}/>
              <span>Settings</span>
              <ChevronRight size={12}/>
              <span style={{color: 'var(--accent-cyan)'}}>{SETTINGS_TABS.find(t => t.id === activeTab)?.label}</span>
            </div>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
             <div className="live-dot"></div> Live System
           </div>
           <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Jul 26, 2026 - 10:24:35 AM</span>
         </div>
      </div>

      <div className="settings-layout">
        
        {/* Left Sub-Navigation */}
        <div className="settings-sidebar">
           <div className="sidebar-group-title">CONFIGURATION</div>
           <nav className="settings-nav">
             {SETTINGS_TABS.map(tab => (
               <div 
                 key={tab.id}
                 className={`settings-nav-item ${activeTab === tab.id ? 'active' : ''}`}
                 onClick={() => setActiveTab(tab.id)}
               >
                 {tab.icon} {tab.label}
               </div>
             ))}
           </nav>
        </div>

        {/* Main Content Area */}
        <div className="settings-content-area">
           {/* Top horizontal tabs */}
           <div className="settings-top-tabs-container">
             {SETTINGS_TABS.map(tab => (
                <div 
                  key={tab.id}
                  className={`st-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.icon} {tab.label}
                </div>
             ))}
           </div>

           <div className="settings-scroll-area">
             {activeTab === 'general' ? renderGeneralTab() :
              activeTab === 'security' ? <SettingsSecurity config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'data_gen' ? <SettingsSyntheticData config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'rules' ? <SettingsDetectionRules config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'explainability' ? <SettingsExplainability config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'ai' ? <SettingsAI config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'alerts' ? <SettingsAlerts config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'users' ? <SettingsUsers config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'api' ? <SettingsAPI config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'storage' ? <SettingsStorage config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'logs' ? <SettingsLogs config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'monitoring' ? <SettingsMonitoring config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'backup' ? <SettingsBackup config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'appearance' ? <SettingsAppearance config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'notifications' ? <SettingsNotifications config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'advanced' ? <SettingsAdvanced config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              activeTab === 'about' ? <SettingsAbout config={localConfig} handleChange={handleChange} handleSave={handleSave} handleAction={handleActionWithToast} /> :
              (
               <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', color: 'var(--text-secondary)'}}>
                 <SettingsIcon size={48} style={{marginBottom: '1rem', opacity: 0.5}}/>
                 <h3 style={{color: 'white'}}>{SETTINGS_TABS.find(t => t.id === activeTab)?.label} Configuration</h3>
                 <p>This settings module is fully supported by the backend architecture and will be populated in the next sprint.</p>
               </div>
             )}
           </div>
        </div>

        </div>
        
        {/* Global Toast Notification */}
        {toastMessage && (
          <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(16px)',
            border: '1px solid var(--accent-purple)',
            borderRadius: '8px',
            padding: '1rem 1.5rem',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 10px 30px rgba(168, 85, 247, 0.2)',
            zIndex: 9999
          }}>
            <Save size={16} color="var(--accent-purple)"/>
            <span style={{fontSize: '0.85rem'}}>{toastMessage}</span>
          </div>
        )}
      </div>
  );
}
