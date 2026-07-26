import React from 'react';
import { Database, Plus, Edit2, Trash2, Info, HardDrive, RefreshCw, Save, Server, Clock, CheckCircle } from 'lucide-react';

export default function SettingsStorage({ config, handleChange, handleSave, handleAction }) {
  const defaultRetention = [
    {type: 'Raw Events', period: '90 Days'},
    {type: 'Alerts', period: '180 Days'},
    {type: 'Logs', period: '365 Days'},
    {type: 'Analytics Data', period: '2 Years'},
    {type: 'System Audit Logs', period: '5 Years'},
  ];
  const retentionList = config?.storage?.retentionRules || defaultRetention;

  const defaultSources = [
    {name: 'Security Cameras', type: 'Video', status: 'Active', data: '120 GB / Day'},
    {name: 'Access Control', type: 'Logs', status: 'Active', data: '25 GB / Day'},
    {name: 'Network Sensors', type: 'Logs', status: 'Active', data: '18 GB / Day'},
    {name: 'Endpoints', type: 'Logs', status: 'Warning', data: '8 GB / Day', sCol: '#f59e0b'},
    {name: 'Third-party Feeds', type: 'API', status: 'Active', data: '2 GB / Day'},
  ];
  const sourceList = config?.storage?.dataSources || defaultSources;

  const handleAddRetention = () => {
    const newRule = { type: `New Data Type ${retentionList.length + 1}`, period: '30 Days' };
    handleChange("storage", "retentionRules", [...retentionList, newRule]);
    handleAction("Retention Rule Added");
  };

  const handleDeleteRetention = (index) => {
    const newList = [...retentionList];
    newList.splice(index, 1);
    handleChange("storage", "retentionRules", newList);
    handleAction("Retention Rule Removed");
  };

  const handleAddSource = () => {
    const newSource = { name: `New Source ${sourceList.length + 1}`, type: 'API', status: 'Active', data: '0 GB / Day' };
    handleChange("storage", "dataSources", [...sourceList, newSource]);
    handleAction("Data Source Added");
  };

  const handleDeleteSource = (index) => {
    const newList = [...sourceList];
    newList.splice(index, 1);
    handleChange("storage", "dataSources", newList);
    handleAction("Data Source Removed");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
           <div>
             <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Data & Storage</h2>
             <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Manage data retention, storage allocation, database health, and data lifecycle policies.</p>
           </div>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Data Retention Policy</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure how long different types of data are retained.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.75rem'}}>
               <thead>
                 <tr>
                   <th>Data Type</th>
                   <th>Retention Period</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {retentionList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.type}</td>
                     <td>
                        <select className="select-input" style={{width: '100%', padding: '0.2rem 0.5rem', fontSize: '0.7rem'}}>
                          <option>{row.period}</option>
                        </select>
                     </td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteRetention(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>

            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleAddRetention}><Plus size={12} style={{marginRight: '0.3rem'}}/> Add Retention Rule</button>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1.5rem'}}>
               <Info size={14} style={{flexShrink: 0}}/> Data will be automatically archived or deleted based on the policy.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Database Health</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Monitor database performance and health.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Database Status</label>
                 <span style={{color: 'var(--accent-green)', fontSize: '0.75rem'}}>Healthy</span>
               </div>
               
               {[
                 {label: 'CPU Usage', val: 32},
                 {label: 'Memory Usage', val: 45},
                 {label: 'Disk Usage', val: 65},
               ].map((item, i) => (
                 <div key={i} className="fg-item-horizontal" style={{padding: '0.4rem 0', display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', gap: '0.5rem'}}>
                   <label>{item.label}</label>
                   <div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', display: 'flex', alignItems: 'center', width: '100%', marginTop: '0.3rem'}}>
                      <div style={{height: '100%', width: `${item.val}%`, background: 'var(--accent-purple)'}}></div>
                   </div>
                   <span style={{textAlign: 'right', fontSize: '0.75rem'}}>{item.val}%</span>
                 </div>
               ))}

               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Index Performance</label>
                 <span style={{color: 'var(--accent-green)', fontSize: '0.75rem', background: 'rgba(0,255,136,0.1)', padding: '0.1rem 0.4rem', borderRadius: '4px'}}>Good</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none'}}>
                 <label>Connection Usage</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>120 / 500</span>
               </div>
            </div>

            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem'}} onClick={() => handleAction("View Database Details")}><Server size={14} style={{marginRight: '0.3rem'}}/> View Database Details</button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Storage Usage</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Monitor your storage utilization and breakdown.</p>
            
            <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem'}}>
               <div style={{position: 'relative', width: '120px', height: '120px', flexShrink: 0}}>
                 {/* Donut Chart approximation */}
                 <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'conic-gradient(#8b5cf6 0% 51%, #ef4444 51% 76%, #f59e0b 76% 91%, #06b6d4 91% 99%, #64748b 99% 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                 }}>
                    <div style={{width: '90px', height: '90px', borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                       <span style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'white'}}>2.45 TB</span>
                       <span style={{fontSize: '0.6rem', color: 'var(--text-secondary)'}}>Total Used</span>
                    </div>
                 </div>
               </div>

               <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, fontSize: '0.7rem'}}>
                 <div style={{display: 'grid', gridTemplateColumns: '10px 2fr 1fr 1fr', gap: '0.5rem', alignItems: 'center'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#8b5cf6'}}></div>
                    <span style={{color: 'var(--text-primary)'}}>Raw Events</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>1.25 TB</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>(51%)</span>
                 </div>
                 <div style={{display: 'grid', gridTemplateColumns: '10px 2fr 1fr 1fr', gap: '0.5rem', alignItems: 'center'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ef4444'}}></div>
                    <span style={{color: 'var(--text-primary)'}}>Logs</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>620 GB</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>(25%)</span>
                 </div>
                 <div style={{display: 'grid', gridTemplateColumns: '10px 2fr 1fr 1fr', gap: '0.5rem', alignItems: 'center'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#f59e0b'}}></div>
                    <span style={{color: 'var(--text-primary)'}}>Analytics Data</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>350 GB</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>(15%)</span>
                 </div>
                 <div style={{display: 'grid', gridTemplateColumns: '10px 2fr 1fr 1fr', gap: '0.5rem', alignItems: 'center'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#06b6d4'}}></div>
                    <span style={{color: 'var(--text-primary)'}}>Backups</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>210 GB</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>(8%)</span>
                 </div>
                 <div style={{display: 'grid', gridTemplateColumns: '10px 2fr 1fr 1fr', gap: '0.5rem', alignItems: 'center'}}>
                    <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#64748b'}}></div>
                    <span style={{color: 'var(--text-primary)'}}>Others</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>50 GB</span>
                    <span style={{color: 'var(--text-secondary)', textAlign: 'right'}}>(1%)</span>
                 </div>
               </div>
            </div>

            <div style={{background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                 <div>
                   <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Total Storage Allocated</div>
                   <div style={{fontSize: '1.2rem', color: 'white', fontWeight: 'bold'}}>5 TB</div>
                 </div>
                 <div style={{textAlign: 'right'}}>
                   <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Usage</div>
                   <div style={{fontSize: '1.2rem', color: 'white', fontWeight: 'bold'}}>49%</div>
                 </div>
               </div>
               <div style={{height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden', width: '100%'}}>
                  <div style={{height: '100%', width: '49%', background: 'var(--accent-purple)'}}></div>
               </div>
            </div>

            <div style={{marginTop: 'auto', paddingTop: '1rem', textAlign: 'center'}}>
               <span style={{fontSize: '0.75rem', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem'}}><HardDrive size={14}/> Manage Storage Allocation</span>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Backup & Recovery</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure backup schedule and manage restore points.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Backup Status</label>
                 <span style={{color: 'var(--accent-green)', fontSize: '0.75rem'}}>Enabled</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Last Backup</label>
                 <span style={{color: 'var(--text-primary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><CheckCircle size={10} color="var(--accent-green)"/> Jul 18, 2026 02:00 AM</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Next Backup</label>
                 <span style={{color: 'var(--text-secondary)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Clock size={10}/> Jul 24, 2026 02:00 AM</span>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Backup Frequency</label>
                 <select value={config?.storage?.backupFrequency || ""} onChange={(e) => handleChange("storage", "backupFrequency", e.target.value)} name="storage.backupFrequency" className="select-input" style={{width: '120px'}}><option>Daily at 02:00 AM</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Retention Period</label>
                 <select value={config?.storage?.retentionPeriod || ""} onChange={(e) => handleChange("storage", "retentionPeriod", e.target.value)} name="storage.retentionPeriod" className="select-input" style={{width: '120px'}}><option>30 Days</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none'}}>
                 <label>Backup Location</label>
                 <select value={config?.storage?.backupLocation || ""} onChange={(e) => handleChange("storage", "backupLocation", e.target.value)} name="storage.backupLocation" className="select-input" style={{width: '120px'}}><option>AWS S3 (us-east-1)</option></select>
               </div>
            </div>

            <div style={{display: 'flex', gap: '0.5rem', marginTop: '1rem'}}>
               <button className="btn-outline" style={{flex: 1, padding: '0.4rem', fontSize: '0.75rem'}} onClick={() => handleAction("Backup Now")}><UploadCloud size={14} style={{marginRight: '0.3rem'}}/> Backup Now</button>
               <button className="btn-outline" style={{flex: 1, padding: '0.4rem', fontSize: '0.75rem'}} onClick={() => handleAction("Restore Data")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Restore Data</button>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>3.</span> Data Sources</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Manage connected data sources and their storage.</p>
               </div>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={() => handleAction("Storage Overview")}><HardDrive size={12} style={{marginRight: '0.3rem'}}/> Storage Overview</button>
            </div>

            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>Source Name</th>
                   <th>Type</th>
                   <th style={{textAlign: 'center'}}>Status</th>
                   <th style={{textAlign: 'right'}}>Data Ingestion</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {sourceList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.type}</td>
                     <td style={{textAlign: 'center'}}><span style={{color: row.sCol || 'var(--accent-green)'}}>{row.status}</span></td>
                     <td style={{color: 'var(--text-secondary)', textAlign: 'right'}}>{row.data}</td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteSource(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>
            
            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleAddSource}><Plus size={12} style={{marginRight: '0.3rem'}}/> Add Data Source</button>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>6.</span> Data Lifecycle Management</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Automate data archiving, tiering, and cleanup.</p>
            
            <div className="form-group-list">
               {[
                 {label: 'Auto Archive Old Data', active: true},
                 {label: 'Data Tiering (Hot/Warm/Cold)', active: true},
                 {label: 'Auto Cleanup Expired Data', active: true},
                 {label: 'Compress Archive Data', active: true},
                 {label: 'Verify Data Integrity', active: true},
               ].map((item, i) => (
                 <div key={i} className="fg-item-horizontal" style={{padding: '0.6rem 0', borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                   <label>{item.label}</label>
                   <div className={`switch ${item.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                 </div>
               ))}
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Lifecycle rules help optimize storage and improve system performance.
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Reset to Defaults")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Reset to Defaults</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Data & Storage Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Data & Storage Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
// Using UploadCloud for backup icon since Upload isn't imported
import { UploadCloud } from 'lucide-react';
