import React from 'react';
import { HardDrive, Save, RefreshCw, UploadCloud, Clock, Shield, AlertTriangle, Download, Server, Link } from 'lucide-react';

export default function SettingsBackup({ config, handleChange, handleSave, handleAction }) {
  const defaultBackups = [
    {time: 'May 24, 03:00 AM', type: 'Auto', size: '4.2 GB', status: 'Success', sCol: 'var(--accent-green)'},
    {time: 'May 23, 03:00 AM', type: 'Auto', size: '4.1 GB', status: 'Success', sCol: 'var(--accent-green)'},
    {time: 'May 22, 14:15 PM', type: 'Manual', size: '4.1 GB', status: 'Success', sCol: 'var(--accent-green)'},
    {time: 'May 22, 03:00 AM', type: 'Auto', size: '4.0 GB', status: 'Failed', sCol: 'var(--accent-red)'},
    {time: 'May 21, 03:00 AM', type: 'Auto', size: '3.9 GB', status: 'Success', sCol: 'var(--accent-green)'}
  ];
  const backupList = config?.backup?.backupHistory || defaultBackups;

  const handleCreateSnapshot = () => {
    const now = new Date();
    const newBackup = {
      time: `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
      type: 'Manual',
      size: '4.2 GB',
      status: 'Success',
      sCol: 'var(--accent-green)'
    };
    handleChange("backup", "backupHistory", [newBackup, ...backupList]);
    handleAction("Snapshot Created");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Backup & Recovery</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure automated backups, disaster recovery, and system snapshots.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Automated Backups</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Schedule routine backups of system state and data.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Enable Auto Backup</label>
                 <div className={`switch ${config?.backup?.enableAutoBackup ? "active" : ""}`} onClick={() => handleChange("backup", "enableAutoBackup", !config?.backup?.enableAutoBackup)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Backup Frequency</label>
                 <select value={config?.backup?.backupFrequency || ""} onChange={(e) => handleChange("backup", "backupFrequency", e.target.value)} name="backup.backupFrequency" className="select-input" style={{width: '100px'}}><option>Daily</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Backup Time</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>03:00 AM UTC</span>
               </div>
               <div className="fg-item-horizontal">
                 <label>Retention Period</label>
                 <select value={config?.backup?.retentionPeriod || ""} onChange={(e) => handleChange("backup", "retentionPeriod", e.target.value)} name="backup.retentionPeriod" className="select-input" style={{width: '100px'}}><option>30 Days</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Storage Location</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Server size={12} color="var(--accent-cyan)"/> s3://honeywell-backups</span>
               </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Manual Snapshot</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Trigger an immediate system state backup.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               <button className="btn-solid-purple" style={{padding: '0.6rem 1rem', display: 'flex', justifyContent: 'center', width: '100%'}} onClick={handleCreateSnapshot}>
                  <Save size={14} style={{marginRight: '0.5rem'}}/> Create Snapshot Now
               </button>
               <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center'}}>Expected size: ~4.2 GB</span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Disaster Recovery</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Settings for high availability and failover.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Enable Multi-Region Replication</label>
                 <div className={`switch ${config?.backup?.enableMultiregionReplication ? "active" : ""}`} onClick={() => handleChange("backup", "enableMultiregionReplication", !config?.backup?.enableMultiregionReplication)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Failover Mode</label>
                 <select value={config?.backup?.failoverMode || ""} onChange={(e) => handleChange("backup", "failoverMode", e.target.value)} name="backup.failoverMode" className="select-input"><option>Automatic</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Recovery Point Objective (RPO)</label>
                 <span style={{color: 'var(--accent-green)', fontSize: '0.75rem'}}>15 Minutes</span>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: '#f59e0b', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(245, 158, 11, 0.2)', background: 'rgba(245, 158, 11, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <AlertTriangle size={14} style={{flexShrink: 0}}/> Multi-region replication increases storage costs.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> System Restore</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Restore the platform to a previous state.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                 <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Latest Snapshot</span>
                 <span style={{fontSize: '0.65rem', color: 'var(--accent-cyan)'}}>Jul 26, 2026 (03:00 AM)</span>
               </div>
               <button className="btn-outline" style={{padding: '0.4rem', fontSize: '0.75rem', color: 'var(--accent-red)', borderColor: 'rgba(255,0,60,0.3)', width: '100%', display: 'flex', justifyContent: 'center'}}>
                  <RotateCcw size={14} style={{marginRight: '0.4rem'}}/> Initiate Restore Process
               </button>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Backup History</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Recent automated and manual backups.</p>
            
            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Date / Time</th>
                   <th>Type</th>
                   <th>Size</th>
                   <th style={{textAlign: 'right'}}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {backupList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.time}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.type}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.size}</td>
                     <td style={{textAlign: 'right'}}><span style={{color: row.sCol}}>{row.status}</span></td>
                   </tr>
                 ))}
               </tbody>
            </table>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Download size={12}/> Download Full Audit Log</span>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Backup Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Backup Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Adding RotateCcw to lucide-react imports
import { RotateCcw } from 'lucide-react';
