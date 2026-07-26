import React from 'react';
import { Database, ShieldAlert, Activity, Settings, HardDrive, FileText, Info, RotateCcw, Play, CheckCircle, AlertTriangle, Save } from 'lucide-react';

export default function SettingsSyntheticData({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Synthetic Data Generator</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Generate realistic synthetic data for training, testing and simulation.</p>
         </div>
         <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
           <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}><Activity size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> View Generation History</span>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>1.</span> Dataset Configuration</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Define the size and scope of synthetic dataset.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Number of Users</label>
                 <input value={config?.synthetic_data?.numberOfUsers || ""} onChange={(e) => handleChange("synthetic_data", "numberOfUsers", e.target.value)} name="synthetic_data.numberOfUsers"  type="number" defaultValue="1000" className="num-input" />
               </div>
               <div className="fg-item-horizontal">
                 <label>Number of Devices</label>
                 <input value={config?.synthetic_data?.numberOfDevices || ""} onChange={(e) => handleChange("synthetic_data", "numberOfDevices", e.target.value)} name="synthetic_data.numberOfDevices"  type="number" defaultValue="500" className="num-input" />
               </div>
               <div className="fg-item-horizontal">
                 <label>Number of Service Accounts</label>
                 <input value={config?.synthetic_data?.numberOfServiceAccounts || ""} onChange={(e) => handleChange("synthetic_data", "numberOfServiceAccounts", e.target.value)} name="synthetic_data.numberOfServiceAccounts"  type="number" defaultValue="200" className="num-input" />
               </div>
               <div className="fg-item-horizontal">
                 <label>Number of Days</label>
                 <input value={config?.synthetic_data?.numberOfDays || ""} onChange={(e) => handleChange("synthetic_data", "numberOfDays", e.target.value)} name="synthetic_data.numberOfDays"  type="number" defaultValue="30" className="num-input" />
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Average Sessions per User per Day</label>
                 <input value={config?.synthetic_data?.averageSessionsPerUserPerDay || ""} onChange={(e) => handleChange("synthetic_data", "averageSessionsPerUserPerDay", e.target.value)} name="synthetic_data.averageSessionsPerUserPerDay"  type="number" defaultValue="8" className="num-input" />
               </div>
               
               <div className="form-group" style={{marginTop: '0.5rem'}}>
                 <label>Log Source Types</label>
                 <div className="chip-list">
                   <div className="chip">Windows Logs <span>x</span></div>
                   <div className="chip">Linux Logs <span>x</span></div>
                   <div className="chip">Network Logs <span>x</span></div>
                 </div>
               </div>
            </div>
            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Larger datasets may take more time to generate and consume more storage.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>4.</span> Advanced Options</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Fine-tune the data generation process.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Random Seed</label>
                 <input value={config?.synthetic_data?.randomSeed || ""} onChange={(e) => handleChange("synthetic_data", "randomSeed", e.target.value)} name="synthetic_data.randomSeed"  type="text" defaultValue="20260726" className="num-input" />
               </div>
               <div className="fg-item-horizontal">
                 <label>Noise Level</label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end'}}>
                   <input type="range" min="0" max="100" defaultValue="30" className="slider" style={{width: '80px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>30%</span>
                 </div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Include Normal Behavior</label>
                 <div className={`switch ${config?.synthetic_data?.includeNormalBehavior ? "active" : ""}`} onClick={() => handleChange("synthetic_data", "includeNormalBehavior", !config?.synthetic_data?.includeNormalBehavior)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Include Rare Events</label>
                 <div className={`switch ${config?.synthetic_data?.includeRareEvents ? "active" : ""}`} onClick={() => handleChange("synthetic_data", "includeRareEvents", !config?.synthetic_data?.includeRareEvents)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Data Anonymization</label>
                 <div className={`switch ${config?.synthetic_data?.dataAnonymization ? "active" : ""}`} onClick={() => handleChange("synthetic_data", "dataAnonymization", !config?.synthetic_data?.dataAnonymization)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Time Zone</label>
                 <select value={config?.synthetic_data?.timeZone || ""} onChange={(e) => handleChange("synthetic_data", "timeZone", e.target.value)} name="synthetic_data.timeZone" className="select-input"><option>(UTC+05:30) Asia/Kolkata</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Log Format</label>
                 <select value={config?.synthetic_data?.logFormat || ""} onChange={(e) => handleChange("synthetic_data", "logFormat", e.target.value)} name="synthetic_data.logFormat" className="select-input"><option>JSON</option></select>
               </div>
            </div>
            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{width: '100%'}} onClick={() => handleAction("Reset to Defaults")}><RotateCcw size={14} style={{marginRight:'0.5rem'}}/> Reset to Defaults</button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--accent-red)'}}>2. Attack Injection Configuration</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure attack types and injection rates.</p>
            
            <div className="attack-inj-list">
               <div className="ai-header" style={{display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 0.5fr', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>
                 <span>Attack Type</span>
                 <span>Description</span>
                 <span style={{textAlign: 'center'}}>Injection Rate (%)</span>
                 <span style={{textAlign: 'right'}}>Enable</span>
               </div>
               
               {[
                 {name: 'Brute Force', desc: 'Multiple failed login attempts', rate: 10, active: true},
                 {name: 'Impossible Travel', desc: 'Login from impossible locations', rate: 8, active: true},
                 {name: 'Credential Stuffing', desc: 'Using leaked credentials', rate: 12, active: true},
                 {name: 'Lateral Movement', desc: 'Movement across internal systems', rate: 7, active: true},
                 {name: 'Insider Drift', desc: 'Abnormal behavior by insiders', rate: 6, active: true},
                 {name: 'Low & Slow Exfiltration', desc: 'Slow data exfiltration attempts', rate: 4, active: true},
               ].map((att, i) => (
                 <div key={i} className="ai-row" style={{display: 'grid', gridTemplateColumns: '1.5fr 2fr 1fr 0.5fr', fontSize: '0.75rem', padding: '0.5rem 0', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                   <span style={{color: 'var(--text-primary)'}}>{att.name}</span>
                   <span style={{color: 'var(--text-secondary)'}}>{att.desc}</span>
                   <div style={{display: 'flex', justifyContent: 'center'}}>
                     <input type="number" defaultValue={att.rate} className="num-input-small" style={{width: '40px', textAlign: 'center'}}/>
                   </div>
                   <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                     <div className={`switch ${att.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                   </div>
                 </div>
               ))}
            </div>

            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(0, 255, 136, 0.05)', borderRadius: '4px', border: '1px solid rgba(0,255,136,0.2)', fontSize: '0.8rem'}}>
              <CheckCircle size={16} color="var(--accent-green)"/> 
              <span style={{color: 'var(--text-primary)'}}>Total injection rate: <span style={{color: 'var(--accent-green)', fontWeight: 'bold'}}>47%</span></span>
              <span style={{color: 'var(--text-secondary)', marginLeft: 'auto'}}>(Recommended: 20% - 60%)</span>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-green)'}}>5.</span> Output & Storage</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure output format and storage location.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Output Format</label>
                 <select value={config?.synthetic_data?.outputFormat || ""} onChange={(e) => handleChange("synthetic_data", "outputFormat", e.target.value)} name="synthetic_data.outputFormat" className="select-input"><option>Parquet</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Compression</label>
                 <select value={config?.synthetic_data?.compression || ""} onChange={(e) => handleChange("synthetic_data", "compression", e.target.value)} name="synthetic_data.compression" className="select-input"><option>Snappy</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Storage Location</label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <Database size={12} color="var(--text-secondary)"/>
                    <span style={{fontSize: '0.75rem'}}>/data/synthetic/</span>
                 </div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Split Dataset</label>
                 <select value={config?.synthetic_data?.splitDataset || ""} onChange={(e) => handleChange("synthetic_data", "splitDataset", e.target.value)} name="synthetic_data.splitDataset" className="select-input"><option>By Day</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Retention Period</label>
                 <select value={config?.synthetic_data?.retentionPeriod || ""} onChange={(e) => handleChange("synthetic_data", "retentionPeriod", e.target.value)} name="synthetic_data.retentionPeriod" className="select-input"><option>30 Days</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Auto-Delete Old Data</label>
                 <div className={`switch ${config?.synthetic_data?.autodeleteOldData ? "active" : ""}`} onClick={() => handleChange("synthetic_data", "autodeleteOldData", !config?.synthetic_data?.autodeleteOldData)}><div className="switch-knob"></div></div>
               </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>3.</span> Behavioral Profile Settings</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Control User behavior patterns.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>User Behavior Variety</label>
                 <select value={config?.synthetic_data?.userBehaviorVariety || ""} onChange={(e) => handleChange("synthetic_data", "userBehaviorVariety", e.target.value)} name="synthetic_data.userBehaviorVariety" className="select-input"><option>High</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Working Hours Pattern</label>
                 <select value={config?.synthetic_data?.workingHoursPattern || ""} onChange={(e) => handleChange("synthetic_data", "workingHoursPattern", e.target.value)} name="synthetic_data.workingHoursPattern" className="select-input"><option>Corporate (9 AM - 6 PM)</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Weekend Behavior</label>
                 <select value={config?.synthetic_data?.weekendBehavior || ""} onChange={(e) => handleChange("synthetic_data", "weekendBehavior", e.target.value)} name="synthetic_data.weekendBehavior" className="select-input"><option>Moderate Activity</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Holiday Behavior</label>
                 <select value={config?.synthetic_data?.holidayBehavior || ""} onChange={(e) => handleChange("synthetic_data", "holidayBehavior", e.target.value)} name="synthetic_data.holidayBehavior" className="select-input"><option>Low Activity</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Seasonality</label>
                 <select value={config?.synthetic_data?.seasonality || ""} onChange={(e) => handleChange("synthetic_data", "seasonality", e.target.value)} name="synthetic_data.seasonality" className="select-input"><option>Enabled</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Randomness Level</label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end'}}>
                   <input type="range" min="0" max="100" defaultValue="65" className="slider" style={{width: '80px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>65%</span>
                 </div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0, color: 'var(--accent-cyan)'}}/> Higher randomness creates more varied, but less predictable data.
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-green)'}}>6.</span> Generation Summary</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Review your configuration before generating data.</p>
            
            <div className="summary-list" style={{flex: 1}}>
               <div className="si-item"><span>Users</span><span>1,000</span></div>
               <div className="si-item"><span>Devices</span><span>500</span></div>
               <div className="si-item"><span>Days</span><span>30</span></div>
               <div className="si-item"><span>Sessions per User per Day</span><span>8</span></div>
               <div className="si-item"><span>Attack Injection Rate</span><span>47%</span></div>
               <div className="si-item"><span>Estimated Logs</span><span style={{color:'var(--accent-cyan)'}}>~ 13.5 Million</span></div>
               <div className="si-item"><span>Estimated Size</span><span style={{color:'var(--accent-cyan)'}}>~ 25 GB</span></div>
            </div>

            <div style={{fontSize: '0.75rem', color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem', marginBottom: '1rem', background: 'rgba(245, 158, 11, 0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(245, 158, 11, 0.2)'}}>
               <AlertTriangle size={14}/> Generation time may vary based on system performance.
            </div>

            <div style={{display: 'flex', gap: '0.5rem'}}>
               <button className="btn-outline" style={{flex: 1}} onClick={() => handleAction("Save Configuration")}><Save size={14} style={{marginRight: '0.4rem'}}/> Save Configuration</button>
               <button className="btn-solid-red" style={{flex: 1}} onClick={() => handleAction("Generate Synthetic Data")}><Play size={14} style={{marginRight: '0.4rem'}}/> Generate Synthetic Data</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
