import React, { useState, useEffect } from 'react';
import { FileText, Save, Info, Download, Shield, Settings, Server, Bell, ChevronRight, Activity, HardDrive } from 'lucide-react';

export default function SettingsLogs({ config, handleChange, handleSave, handleAction }) {
  const [auditLogs, setAuditLogs] = useState([]);
  
  useEffect(() => {
    fetch('/api/audit-logs')
      .then(res => res.json())
      .then(data => setAuditLogs(data.logs || []))
      .catch(err => console.error(err));
  }, []);

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'csv', source: 'audit_logs' })
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "audit_log_export.csv";
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Logs & Audit</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure system logging, audit trails, and log retention policies.</p>
         </div>
         <button className="btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}} onClick={() => handleAction("View Audit Log")}><FileText size={14} style={{marginRight: '0.3rem'}}/> View Audit Log</button>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Audit Logging</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Enable and configure audit logging for system activities.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Enable Audit Logging</label>
                 <div className={`switch ${config?.logs?.enableAuditLogging ? "active" : ""}`} onClick={() => handleChange("logs", "enableAuditLogging", !config?.logs?.enableAuditLogging)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Log Level</label>
                 <select value={config?.logs?.logLevel || ""} onChange={(e) => handleChange("logs", "logLevel", e.target.value)} name="logs.logLevel" className="select-input"><option>Detailed</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Include User Activity Logs</label>
                 <div className={`switch ${config?.logs?.includeUserActivityLogs ? "active" : ""}`} onClick={() => handleChange("logs", "includeUserActivityLogs", !config?.logs?.includeUserActivityLogs)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Include Configuration Changes</label>
                 <div className={`switch ${config?.logs?.includeConfigurationChanges ? "active" : ""}`} onClick={() => handleChange("logs", "includeConfigurationChanges", !config?.logs?.includeConfigurationChanges)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Include Authentication Logs</label>
                 <div className={`switch ${config?.logs?.includeAuthenticationLogs ? "active" : ""}`} onClick={() => handleChange("logs", "includeAuthenticationLogs", !config?.logs?.includeAuthenticationLogs)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Include Data Access Logs</label>
                 <div className={`switch ${config?.logs?.includeDataAccessLogs ? "active" : ""}`} onClick={() => handleChange("logs", "includeDataAccessLogs", !config?.logs?.includeDataAccessLogs)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                 <label>Include API Access Logs</label>
                 <div className={`switch ${config?.logs?.includeApiAccessLogs ? "active" : ""}`} onClick={() => handleChange("logs", "includeApiAccessLogs", !config?.logs?.includeApiAccessLogs)}><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Shield size={14} style={{flexShrink: 0}}/> All audit logs are immutable and tamper-proof.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Log Export</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Export logs for external analysis or compliance.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Export Format</label>
                 <select value={config?.logs?.exportFormat || ""} onChange={(e) => handleChange("logs", "exportFormat", e.target.value)} name="logs.exportFormat" className="select-input"><option>JSON</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Time Range</label>
                 <select value={config?.logs?.timeRange || ""} onChange={(e) => handleChange("logs", "timeRange", e.target.value)} name="logs.timeRange" className="select-input"><option>Last 7 Days</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Log Type</label>
                 <select value={config?.logs?.logType || ""} onChange={(e) => handleChange("logs", "logType", e.target.value)} name="logs.logType" className="select-input"><option>All Logs</option></select>
               </div>
            </div>
            
            <button className="btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '1rem'}} onClick={() => handleAction("Export Logs")}><Download size={14} style={{marginRight: '0.3rem'}}/> Export Logs</button>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Log Retention</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure how long logs are retained in the system.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Audit Logs Retention</label>
                 <select value={config?.logs?.auditLogsRetention || ""} onChange={(e) => handleChange("logs", "auditLogsRetention", e.target.value)} name="logs.auditLogsRetention" className="select-input"><option>1 Year</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>System Logs Retention</label>
                 <select value={config?.logs?.systemLogsRetention || ""} onChange={(e) => handleChange("logs", "systemLogsRetention", e.target.value)} name="logs.systemLogsRetention" className="select-input"><option>180 Days</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Security Logs Retention</label>
                 <select value={config?.logs?.securityLogsRetention || ""} onChange={(e) => handleChange("logs", "securityLogsRetention", e.target.value)} name="logs.securityLogsRetention" className="select-input"><option>2 Years</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Alert Logs Retention</label>
                 <select value={config?.logs?.alertLogsRetention || ""} onChange={(e) => handleChange("logs", "alertLogsRetention", e.target.value)} name="logs.alertLogsRetention" className="select-input"><option>1 Year</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Analytics Logs Retention</label>
                 <select value={config?.logs?.analyticsLogsRetention || ""} onChange={(e) => handleChange("logs", "analyticsLogsRetention", e.target.value)} name="logs.analyticsLogsRetention" className="select-input"><option>90 Days</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Logs older than the retention period will be archived or deleted as per policy.
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Real-time Log Monitoring</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Monitor logs in real-time and set up alerts.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Enable Real-time Monitoring</label>
                 <div className={`switch ${config?.logs?.enableRealtimeMonitoring ? "active" : ""}`} onClick={() => handleChange("logs", "enableRealtimeMonitoring", !config?.logs?.enableRealtimeMonitoring)}><div className="switch-knob"></div></div>
               </div>
               <div style={{display: 'flex', flexDirection: 'column', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                 <label style={{fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.4rem'}}>High Severity Keywords</label>
                 <input type="text" defaultValue="error, failure, exception, denied, unauthorized" className="num-input" style={{width: '100%', textAlign: 'left'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                 <label>Alert on Critical Logs</label>
                 <div className={`switch ${config?.logs?.alertOnCriticalLogs ? "active" : ""}`} onClick={() => handleChange("logs", "alertOnCriticalLogs", !config?.logs?.alertOnCriticalLogs)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                 <label>Notification Channel</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>Email, Slack</span>
               </div>
            </div>

            <button className="btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginTop: '1rem'}} onClick={() => handleAction("Manage Alert Rules")}><Bell size={14} style={{marginRight: '0.3rem'}}/> Manage Alert Rules</button>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Log Storage</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Manage where logs are stored and archived.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Primary Storage</label>
                 <select value={config?.logs?.primaryStorage || ""} onChange={(e) => handleChange("logs", "primaryStorage", e.target.value)} name="logs.primaryStorage" className="select-input" style={{width: '160px'}}><option>Amazon S3 (us-east-1)</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Backup Storage</label>
                 <select value={config?.logs?.backupStorage || ""} onChange={(e) => handleChange("logs", "backupStorage", e.target.value)} name="logs.backupStorage" className="select-input" style={{width: '160px'}}><option>Glacier Deep Archive</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Encryption</label>
                 <select value={config?.logs?.encryption || ""} onChange={(e) => handleChange("logs", "encryption", e.target.value)} name="logs.encryption" className="select-input" style={{width: '160px'}}><option>AES-256</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Compression</label>
                 <div className={`switch ${config?.logs?.compression ? "active" : ""}`} onClick={() => handleChange("logs", "compression", !config?.logs?.compression)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Partition Logs by Date</label>
                 <div className={`switch ${config?.logs?.partitionLogsByDate ? "active" : ""}`} onClick={() => handleChange("logs", "partitionLogsByDate", !config?.logs?.partitionLogsByDate)}><div className="switch-knob"></div></div>
               </div>
            </div>
            
            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem'}} onClick={() => handleAction("Test Storage Connection")}><Server size={14} style={{marginRight: '0.3rem'}}/> Test Storage Connection</button>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>6.</span> Compliance & Reports</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Generate compliance reports and download audit trails.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                     <FileText size={16} color="var(--accent-cyan)"/>
                     <div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Generate Compliance Report</div>
                        <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Generate system compliance report for selected period.</div>
                     </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-secondary)"/>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                     <Download size={16} color="var(--accent-cyan)"/>
                     <div>
                        <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Download Audit Trail</div>
                        <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Download complete audit trail for selected period.</div>
                     </div>
                  </div>
                  <ChevronRight size={14} color="var(--text-secondary)"/>
               </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div>
                 <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Last Report Generated</div>
                 <div style={{fontSize: '0.7rem', color: 'var(--text-primary)'}}>May 14, 2024 11:30 PM</div>
                 <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>by SOC Analyst</div>
               </div>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleDownload}><Download size={12} style={{marginRight: '0.3rem'}}/> Download</button>
            </div>
          </div>
        </div>
      </div>
      
       {/* Audit Logs Data Table */}
       <div className="glass-panel" style={{marginTop: '1.5rem', overflowX: 'auto'}}>
         <h3 className="panel-title" style={{color: 'var(--text-primary)'}}>Recent Audit Events (Live)</h3>
         {auditLogs.length === 0 ? (
           <div style={{padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)'}}>No audit logs found. Change a setting to generate one!</div>
         ) : (
           <table className="alerts-table" style={{marginTop: '0.5rem'}}>
             <thead>
               <tr>
                 <th>Timestamp</th>
                 <th>Action</th>
                 <th>User</th>
                 <th>Details</th>
               </tr>
             </thead>
             <tbody>
               {auditLogs.map(log => (
                 <tr key={log.id}>
                   <td style={{whiteSpace: 'nowrap'}}>{new Date(log.timestamp).toLocaleString()}</td>
                   <td style={{color: 'var(--accent-green)'}}>{log.action}</td>
                   <td>{log.user}</td>
                   <td><pre style={{margin: 0, fontSize: '0.7rem', color: 'var(--text-secondary)'}}>{JSON.stringify(log.details)}</pre></td>
                 </tr>
               ))}
             </tbody>
           </table>
         )}
       </div>
    </div> 
  );
}
// Import RefreshCw here too to match screenshot
import { RefreshCw } from 'lucide-react';
