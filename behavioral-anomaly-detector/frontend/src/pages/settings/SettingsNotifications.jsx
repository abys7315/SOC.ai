import React from 'react';
import { Bell, Mail, MessageSquare, Smartphone, Clock, Shield, Save, RefreshCw, AlertTriangle, Link, Info } from 'lucide-react';

export default function SettingsNotifications({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Notifications</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Manage how and when you receive system alerts and updates.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Delivery Channels</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Where should we send your notifications?</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Mail size={14} color="var(--accent-cyan)"/> Email</label>
                 <div className={`switch ${config?.notifications?.emailNotifications !== false ? "active" : ""}`} onClick={() => handleChange("notifications", "emailNotifications", config?.notifications?.emailNotifications === false ? true : false)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><MessageSquare size={14} color="var(--accent-cyan)"/> Slack Integration</label>
                 <div className={`switch ${config?.notifications?.slackIntegration ? "active" : ""}`} onClick={() => handleChange("notifications", "slackIntegration", !config?.notifications?.slackIntegration)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><MessageSquare size={14} color="var(--accent-cyan)"/> Microsoft Teams</label>
                 <div className={`switch ${config?.notifications?.teamsIntegration ? "active" : ""}`} onClick={() => handleChange("notifications", "teamsIntegration", !config?.notifications?.teamsIntegration)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Smartphone size={14} color="var(--accent-cyan)"/> SMS (Critical Only)</label>
                 <div className={`switch ${config?.notifications?.smsCritical ? "active" : ""}`} onClick={() => handleChange("notifications", "smsCritical", !config?.notifications?.smsCritical)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><Link size={14} color="var(--accent-cyan)"/> Custom Webhook</label>
                 <div className={`switch ${config?.notifications?.customWebhook ? "active" : ""}`} onClick={() => handleChange("notifications", "customWebhook", !config?.notifications?.customWebhook)}><div className="switch-knob"></div></div>
               </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Push Notifications</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Browser push notifications.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Desktop Push</span>
                 <span style={{fontSize: '0.65rem', color: 'var(--accent-green)'}}>Enabled</span>
               </div>
               <button className="btn-outline" style={{padding: '0.4rem', fontSize: '0.75rem', width: '100%', display: 'flex', justifyContent: 'center'}}>
                  Test Push Notification
               </button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Event Subscriptions</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Select which events trigger a notification.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0'}}>
                 <label>Security Anomalies (High Severity)</label>
                 <div className={`switch ${config?.notifications?.securityAnomaliesHighSeverity ? "active" : ""}`} onClick={() => handleChange("notifications", "securityAnomaliesHighSeverity", !config?.notifications?.securityAnomaliesHighSeverity)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0'}}>
                 <label>Security Anomalies (Low Severity)</label>
                 <div className={`switch ${config?.notifications?.securityAnomaliesLowSeverity ? "active" : ""}`} onClick={() => handleChange("notifications", "securityAnomaliesLowSeverity", !config?.notifications?.securityAnomaliesLowSeverity)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0'}}>
                 <label>System Health Warnings</label>
                 <div className={`switch ${config?.notifications?.systemHealthWarnings ? "active" : ""}`} onClick={() => handleChange("notifications", "systemHealthWarnings", !config?.notifications?.systemHealthWarnings)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0'}}>
                 <label>Model Retraining Complete</label>
                 <div className={`switch ${config?.notifications?.modelRetrainingComplete ? "active" : ""}`} onClick={() => handleChange("notifications", "modelRetrainingComplete", !config?.notifications?.modelRetrainingComplete)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0'}}>
                 <label>User Access Changes</label>
                 <div className={`switch ${config?.notifications?.userAccessChanges ? "active" : ""}`} onClick={() => handleChange("notifications", "userAccessChanges", !config?.notifications?.userAccessChanges)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.6rem 0', borderBottom: 'none'}}>
                 <label>Platform Updates & Maintenance</label>
                 <div className={`switch ${config?.notifications?.platformUpdatesMaintenance ? "active" : ""}`} onClick={() => handleChange("notifications", "platformUpdatesMaintenance", !config?.notifications?.platformUpdatesMaintenance)}><div className="switch-knob"></div></div>
               </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Timing & Frequency</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>When should notifications be delivered?</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Delivery Mode</label>
                 <select value={config?.notifications?.deliveryMode || ""} onChange={(e) => handleChange("notifications", "deliveryMode", e.target.value)} name="notifications.deliveryMode" className="select-input" style={{width: '120px'}}><option>Instant</option><option>Daily Digest</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Clock size={12}/> Quiet Hours</label>
                 <div className={`switch ${config?.notifications?.quietHoursEnabled !== false ? "active" : ""}`} onClick={() => handleChange("notifications", "quietHoursEnabled", config?.notifications?.quietHoursEnabled === false ? true : false)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Quiet Hours Start</label>
                 <select value={config?.notifications?.quietHoursStart || ""} onChange={(e) => handleChange("notifications", "quietHoursStart", e.target.value)} name="notifications.quietHoursStart" className="select-input"><option>10:00 PM</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Quiet Hours End</label>
                 <select value={config?.notifications?.quietHoursEnd || ""} onChange={(e) => handleChange("notifications", "quietHoursEnd", e.target.value)} name="notifications.quietHoursEnd" className="select-input"><option>06:00 AM</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <AlertTriangle size={14} style={{flexShrink: 0}}/> Critical security alerts will bypass Quiet Hours.
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Revert Changes")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Revert Changes</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Preferences")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Preferences</button>
          </div>
        </div>
      </div>
    </div>
  );
}
