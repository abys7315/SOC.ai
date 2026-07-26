import React from 'react';
import { Sliders, AlertTriangle, ShieldAlert, Activity, Edit2, Trash2, Plus, Info, Save, RotateCcw } from 'lucide-react';

export default function SettingsDetectionRules({ config, handleChange, handleSave, handleAction }) {
  const defaultRules = [
    {name: 'After Hours Admin Login', cond: 'Login by admin outside working hours', score: 75, status: 'Active'},
    {name: 'Multiple Geolocation Changes', cond: '> 3 location changes within 1 hour', score: 60, status: 'Active'},
    {name: 'Unusual Data Access', cond: 'Access to restricted data outside role', score: 80, status: 'Active'},
    {name: 'New Device Login', cond: 'Login from new device via new browser', score: 40, status: 'Active'},
    {name: 'High Data Download', cond: 'Download size > 10 GB in 1 hour', score: 70, status: 'Active'}
  ];
  const ruleList = config?.detection_rules?.ruleList || defaultRules;

  const handleAddRule = () => {
    const newRule = {
      name: `Custom Rule ${ruleList.length + 1}`,
      cond: 'Custom user defined condition',
      score: 50,
      status: 'Active'
    };
    handleChange("detection_rules", "ruleList", [...ruleList, newRule]);
    handleAction("Detection Rule Created");
  };

  const handleDeleteRule = (index) => {
    const newList = [...ruleList];
    newList.splice(index, 1);
    handleChange("detection_rules", "ruleList", newList);
    handleAction("Detection Rule Removed");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Detection Rules</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure risk scoring, alerting rules, and detection thresholds.</p>
         </div>
         <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
           <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer'}}><RotateCcw size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Reset All Rules</span>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>1.</span> Risk Score Thresholds</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Define risk score ranges and their severity levels.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.75rem'}}>
               <thead>
                 <tr>
                   <th>Severity Level</th>
                   <th>Score Range</th>
                   <th>Color</th>
                   <th>Description</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {level: 'Critical', range: '80 - 100', color: '#ff003c', desc: 'High probability of malicious activity'},
                   {level: 'High', range: '60 - 79', color: '#f59e0b', desc: 'Suspicious activity requiring attention'},
                   {level: 'Medium', range: '40 - 59', color: '#eab308', desc: 'Potential risk needs monitoring'},
                   {level: 'Low', range: '20 - 39', color: '#3b82f6', desc: 'Low risk routine activity'},
                   {level: 'Informational', range: '0 - 19', color: '#00ff88', desc: 'Normal expected behavior'},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.level}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.range}</td>
                     <td><div style={{width:'12px', height:'12px', background: row.color, borderRadius:'2px'}}></div></td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.desc}</td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.5rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>
            
            <button className="btn-outline" style={{width: '100%', marginTop: '1rem', fontSize: '0.75rem', padding: '0.4rem'}} onClick={() => handleAction("Add New Level")}><Plus size={14} style={{marginRight:'0.3rem'}}/> Add New Level</button>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>4.</span> Detection Sensitivity</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Adjust sensitivity for the detection engine.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label style={{color:'var(--accent-cyan)'}}>Overall Sensitivity <Info size={10}/></label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end'}}>
                   <input type="range" min="0" max="100" defaultValue="75" className="slider slider-cyan" style={{width: '100px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>75%</span>
                 </div>
               </div>
               
               <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', padding: '0.5rem 0'}}>Adjust sensitivity for specific attack types:</div>
               
               {[
                 {name: 'Brute Force', val: 75},
                 {name: 'Impossible Travel', val: 75},
                 {name: 'Credential Stuffing', val: 75},
                 {name: 'Lateral Movement', val: 75},
                 {name: 'Insider Drift', val: 75},
                 {name: 'Low & Slow Exfiltration', val: 65},
               ].map((att, i) => (
                 <div key={i} className="fg-item-horizontal" style={{borderBottom: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.05)', padding: '0.4rem 0'}}>
                   <label style={{fontSize: '0.7rem'}}>{att.name}</label>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'flex-end'}}>
                     <input type="range" min="0" max="100" defaultValue={att.val} className="slider" style={{width: '100px'}}/>
                     <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>{att.val}%</span>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>2.</span> Alert Rules</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure alert generation and suppression rules.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Max Alerts per Minute</label>
                 <input value={config?.detection_rules?.maxAlertsPerMinute || ""} onChange={(e) => handleChange("detection_rules", "maxAlertsPerMinute", e.target.value)} name="detection_rules.maxAlertsPerMinute"  type="number" defaultValue="50" className="num-input" />
               </div>
               <div className="fg-item-horizontal">
                 <label>Alert Cooldown Period</label>
                 <select value={config?.detection_rules?.alertCooldownPeriod || ""} onChange={(e) => handleChange("detection_rules", "alertCooldownPeriod", e.target.value)} name="detection_rules.alertCooldownPeriod" className="select-input"><option>5 Minutes</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Duplicate Alert Suppression</label>
                 <div className={`switch ${config?.detection_rules?.duplicateAlertSuppression ? "active" : ""}`} onClick={() => handleChange("detection_rules", "duplicateAlertSuppression", !config?.detection_rules?.duplicateAlertSuppression)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Correlate Alerts</label>
                 <div className={`switch ${config?.detection_rules?.correlateAlerts ? "active" : ""}`} onClick={() => handleChange("detection_rules", "correlateAlerts", !config?.detection_rules?.correlateAlerts)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Correlation Time Window</label>
                 <select value={config?.detection_rules?.correlationTimeWindow || ""} onChange={(e) => handleChange("detection_rules", "correlationTimeWindow", e.target.value)} name="detection_rules.correlationTimeWindow" className="select-input"><option>30 Minutes</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Group Alerts By Entity</label>
                 <div className={`switch ${config?.detection_rules?.groupAlertsByEntity ? "active" : ""}`} onClick={() => handleChange("detection_rules", "groupAlertsByEntity", !config?.detection_rules?.groupAlertsByEntity)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Escalate Unresolved Alerts</label>
                 <div className={`switch ${config?.detection_rules?.escalateUnresolvedAlerts ? "active" : ""}`} onClick={() => handleChange("detection_rules", "escalateUnresolvedAlerts", !config?.detection_rules?.escalateUnresolvedAlerts)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Escalation Time</label>
                 <select value={config?.detection_rules?.escalationTime || ""} onChange={(e) => handleChange("detection_rules", "escalationTime", e.target.value)} name="detection_rules.escalationTime" className="select-input"><option>30 Minutes</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(0, 240, 255, 0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(0, 240, 255, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0, color: 'var(--accent-cyan)'}}/> Alerts will be grouped and correlated to reduce noise and improve SOC efficiency.
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>5.</span> Custom Detection Rules</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Create custom rules for specific business requirements.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>Rule Name</th>
                   <th>Condition</th>
                   <th>Risk Score</th>
                   <th>Status</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {ruleList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{color: 'var(--text-secondary)', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}} title={row.cond}>{row.cond}</td>
                     <td style={{color: 'var(--text-primary)', textAlign: 'center'}}>{row.score}</td>
                     <td><span style={{color: 'var(--accent-green)'}}>{row.status}</span></td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.5rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteRule(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>
            <button className="btn-outline" style={{width: 'max-content', marginTop: '1rem', fontSize: '0.75rem', padding: '0.4rem 0.8rem'}} onClick={handleAddRule}><Plus size={14} style={{marginRight:'0.3rem'}}/> Create New Rule</button>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>3.</span> Attack Categories</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Enable or disable detection for specific attack categories.</p>
            
            <div className="attack-inj-list">
               <div className="ai-header" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem'}}>
                 <span>Attack Category</span>
                 <span>Description</span>
                 <span style={{textAlign: 'right'}}>Enabled</span>
               </div>
               
               {[
                 {name: 'Brute Force', desc: 'Multiple failed login attempts', active: true},
                 {name: 'Impossible Travel', desc: 'Login from impossible locations', active: true},
                 {name: 'Credential Stuffing', desc: 'Using leaked credentials', active: true},
                 {name: 'Lateral Movement', desc: 'Movement across internal systems', active: true},
                 {name: 'Device Spoofing', desc: 'Access from unrecognized devices', active: true},
                 {name: 'Insider Drift', desc: 'Abnormal behavior by insiders', active: true},
                 {name: 'Low & Slow Exfiltration', desc: 'Slow data exfiltration attempts', active: true},
                 {name: 'Account Takeover', desc: 'Suspicious account takeover', active: false},
               ].map((att, i) => (
                 <div key={i} className="ai-row" style={{display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', fontSize: '0.75rem', padding: '0.5rem 0', alignItems: 'center', borderBottom: i === 7 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                   <span style={{color: 'var(--text-primary)'}}>{att.name}</span>
                   <span style={{color: 'var(--text-secondary)', fontSize: '0.65rem'}}>{att.desc}</span>
                   <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                     <div className={`switch ${att.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                   </div>
                 </div>
               ))}
            </div>

            <button className="btn-outline" style={{width: 'max-content', marginTop: '1rem', fontSize: '0.75rem', padding: '0.4rem 0.8rem'}} onClick={() => handleAction("Add Custom Category")}><Plus size={14} style={{marginRight:'0.3rem'}}/> Add Custom Category</button>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-cyan)'}}>6.</span> Response Actions</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure automated response actions for high-risk events.</p>
            
            <div className="form-group-list">
               {[
                 {name: 'Auto Block IP', score: 90, active: true},
                 {name: 'Force Password Reset', score: 85, active: true},
                 {name: 'Enable Step-up Authentication', score: 75, active: true},
                 {name: 'Disable Account', score: 95, active: false},
                 {name: 'Notify Admin', score: 60, active: true},
                 {name: 'Create Ticket in ITSM', score: 80, active: true},
               ].map((action, i) => (
                 <div key={i} className="fg-item-horizontal" style={{borderBottom: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.05)', padding: '0.6rem 0'}}>
                   <label style={{flex: 1}}>{action.name}</label>
                   <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                     <div className={`switch ${action.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                     <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>After Score &gt;</span>
                     <input type="number" defaultValue={action.score} className="num-input-small" style={{width: '40px', textAlign: 'center'}}/>
                   </div>
                 </div>
               ))}
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem'}}>
               <Info size={14} style={{flexShrink: 0, color: 'var(--accent-cyan)'}}/> Response actions will be triggered based on risk score and rule conditions.
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: 'auto', paddingTop: '1rem'}}>
               <button className="btn-solid-red" style={{width: '100%', padding: '0.6rem'}} onClick={() => handleAction("Save Detection Rules")}><Save size={14} style={{marginRight: '0.4rem'}}/> Save Detection Rules</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
