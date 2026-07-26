import React from 'react';
import { Settings, Info, RefreshCw, Save, Activity, Shield, Cpu, Bell, Monitor, Wrench, ChevronRight, HardDrive, Trash2, Database, Download, MessageSquare } from 'lucide-react';

export default function SettingsAdvanced({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Advanced</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure advanced platform settings and experimental features.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Experimental Features</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Enable upcoming features and experimental capabilities.</p>
            
            <div className="form-group-list">
               {[
                 {label: 'Adaptive Thresholding', active: true, info: false},
                 {label: 'Unsupervised Anomaly Clustering', active: false, info: true},
                 {label: 'Auto Incident Correlation', active: true, info: false},
                 {label: 'Graph-based Entity Modeling', active: false, info: true},
                 {label: 'Federated Learning Support', active: false, info: true},
                 {label: 'Real-time Model Drift Detection', active: true, info: true},
               ].map((item, i) => (
                 <div key={i} className="fg-item-horizontal" style={{padding: '0.6rem 0', borderBottom: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                   <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>{item.label} {item.info && <Info size={10} color="var(--text-secondary)"/>}</label>
                   <div className={`switch ${item.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                 </div>
               ))}
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Experimental features may change or be removed in future updates.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Data Privacy & Compliance</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure data handling and compliance settings.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Data Anonymization</label>
                 <div className={`switch ${config?.advanced?.dataAnonymization ? "active" : ""}`} onClick={() => handleChange("advanced", "dataAnonymization", !config?.advanced?.dataAnonymization)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Mask Sensitive Fields</label>
                 <div className={`switch ${config?.advanced?.maskSensitiveFields ? "active" : ""}`} onClick={() => handleChange("advanced", "maskSensitiveFields", !config?.advanced?.maskSensitiveFields)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Data Retention Compliance</label>
                 <select value={config?.advanced?.dataRetentionCompliance || ""} onChange={(e) => handleChange("advanced", "dataRetentionCompliance", e.target.value)} name="advanced.dataRetentionCompliance" className="select-input" style={{width: '100px'}}><option>GDPR</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>Right to Erasure (Data Deletion) <Info size={10}/></label>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>Data Export Audit <Info size={10}/></label>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Ensure compliance with organizational and regulatory policies.
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Model Management</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Manage models, versions and deployment preferences.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Active Model</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>BADP Anomaly Model v2.4.1</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Model Version</label>
                 <span style={{color: 'var(--text-secondary)', fontSize: '0.75rem'}}>v2.4.1</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Last Trained On</label>
                 <span style={{color: 'var(--text-secondary)', fontSize: '0.75rem'}}>May 14, 2024 02:15 AM</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Trained By</label>
                 <span style={{color: 'var(--text-secondary)', fontSize: '0.75rem'}}>system_admin</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Model Performance</label>
                 <span style={{color: 'var(--accent-green)', fontSize: '0.75rem', background: 'rgba(0,255,136,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px'}}>89.75 F1 Score</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                 <label>Retrain Frequency</label>
                 <select value={config?.advanced?.retrainFrequency || ""} onChange={(e) => handleChange("advanced", "retrainFrequency", e.target.value)} name="advanced.retrainFrequency" className="select-input" style={{width: '100px'}}><option>Weekly</option></select>
               </div>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
               <button className="btn-outline" style={{flex: 1, padding: '0.5rem', fontSize: '0.75rem'}} onClick={() => handleAction("View Model Details")}><Link size={14} style={{marginRight: '0.3rem'}}/> View Model Details</button>
               <button className="btn-solid-purple" style={{flex: 1, padding: '0.5rem', fontSize: '0.75rem'}} onClick={() => handleAction("Retrain Now")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Retrain Now</button>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Notifications & Alerts Settings</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure global notification preferences.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Email Notifications</label>
                 <div className={`switch ${config?.advanced?.emailNotifications ? "active" : ""}`} onClick={() => handleChange("advanced", "emailNotifications", !config?.advanced?.emailNotifications)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Slack Notifications</label>
                 <div className={`switch ${config?.advanced?.slackNotifications ? "active" : ""}`} onClick={() => handleChange("advanced", "slackNotifications", !config?.advanced?.slackNotifications)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Critical Alerts Only</label>
                 <div className={`switch ${config?.advanced?.criticalAlertsOnly ? "active" : ""}`} onClick={() => handleChange("advanced", "criticalAlertsOnly", !config?.advanced?.criticalAlertsOnly)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Alert Digest Frequency</label>
                 <select value={config?.advanced?.alertDigestFrequency || ""} onChange={(e) => handleChange("advanced", "alertDigestFrequency", e.target.value)} name="advanced.alertDigestFrequency" className="select-input" style={{width: '120px'}}><option>Every 6 Hours</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                 <label>Quiet Hours</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>10:00 PM - 06:00 AM</span>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> These settings apply to all users unless overridden.
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> System Preferences</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Customize system-wide preferences.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Timezone</label>
                 <select value={config?.advanced?.timezone || ""} onChange={(e) => handleChange("advanced", "timezone", e.target.value)} name="advanced.timezone" className="select-input"><option>(UTC+05:30) Asia/Kolkata</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Date Format</label>
                 <select value={config?.advanced?.dateFormat || ""} onChange={(e) => handleChange("advanced", "dateFormat", e.target.value)} name="advanced.dateFormat" className="select-input"><option>May 15, 2024 (MMM DD, YYYY)</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Time Format</label>
                 <select value={config?.advanced?.timeFormat || ""} onChange={(e) => handleChange("advanced", "timeFormat", e.target.value)} name="advanced.timeFormat" className="select-input"><option>12-Hour (hh:mm:ss AM/PM)</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Items per Page</label>
                 <select value={config?.advanced?.itemsPerPage || ""} onChange={(e) => handleChange("advanced", "itemsPerPage", e.target.value)} name="advanced.itemsPerPage" className="select-input" style={{width: '60px'}}><option>25</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Default Landing Page</label>
                 <select value={config?.advanced?.defaultLandingPage || ""} onChange={(e) => handleChange("advanced", "defaultLandingPage", e.target.value)} name="advanced.defaultLandingPage" className="select-input"><option>Dashboard</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Enable Tips & Guidance</label>
                 <div className={`switch ${config?.advanced?.enableTipsGuidance ? "active" : ""}`} onClick={() => handleChange("advanced", "enableTipsGuidance", !config?.advanced?.enableTipsGuidance)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none'}}>
                 <label>Show System Announcements</label>
                 <div className={`switch ${config?.advanced?.showSystemAnnouncements ? "active" : ""}`} onClick={() => handleChange("advanced", "showSystemAnnouncements", !config?.advanced?.showSystemAnnouncements)}><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Changes will reflect the next time you log in.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>6.</span> Maintenance & Support</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>System maintenance and support tools.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               {[
                 {icon: <Activity size={16} color="var(--accent-cyan)"/>, title: 'System Diagnostics', desc: 'Run system health diagnostics'},
                 {icon: <Trash2 size={16} color="var(--accent-cyan)"/>, title: 'Cache Management', desc: 'Clear system cache and temporary files'},
                 {icon: <Database size={16} color="var(--accent-cyan)"/>, title: 'Database Maintenance', desc: 'Optimize and clean database'},
                 {icon: <Download size={16} color="var(--accent-cyan)"/>, title: 'Support Bundle', desc: 'Download logs and system information'},
                 {icon: <MessageSquare size={16} color="var(--accent-cyan)"/>, title: 'Feature Request', desc: 'Suggest new features or improvements'},
               ].map((item, i) => (
                 <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                       {item.icon}
                       <div>
                          <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>{item.title}</div>
                          <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>{item.desc}</div>
                       </div>
                    </div>
                    <ChevronRight size={14} color="var(--text-secondary)"/>
                 </div>
               ))}
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Reset to Defaults")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Reset to Defaults</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Advanced Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Advanced Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Import Link as well for the icon
import { Link } from 'lucide-react';
