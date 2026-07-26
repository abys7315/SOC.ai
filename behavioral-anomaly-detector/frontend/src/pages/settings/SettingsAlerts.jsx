import React from 'react';
import { Mail, MessageSquare, Plus, Edit2, Trash2, Info, Save, Settings, Hash, Bell, Shield, Clock, Users, CheckCircle } from 'lucide-react';

export default function SettingsAlerts({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
           <div>
             <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Alert Management</h2>
             <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure alert notifications, severity levels, auto actions, and escalation policies.</p>
           </div>
           <button className="btn-outline" style={{padding: '0.5rem 1rem', fontSize: '0.75rem'}} onClick={() => handleAction("New Alert History")}><Plus size={14} style={{marginRight: '0.3rem'}}/> New Alert History</button>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Notification Channels</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure how and where alerts are delivered.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.75rem'}}>
               <thead>
                 <tr>
                   <th>Channel</th>
                   <th style={{textAlign: 'center'}}>Status</th>
                   <th>Configuration</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'Email', icon: <Mail size={14} color="#60a5fa"/>, status: true, config: 'soc.team@honeywell.com'},
                   {name: 'SMS', icon: <MessageSquare size={14} color="#34d399"/>, status: true, config: '+1 *********42'},
                   {name: 'Slack', icon: <Hash size={14} color="#f472b6"/>, status: true, config: '#security-alerts'},
                   {name: 'Microsoft Teams', icon: <Users size={14} color="#818cf8"/>, status: true, config: 'SOC Alerts Channel'},
                   {name: 'Webhook', icon: <Settings size={14} color="#a78bfa"/>, status: false, config: '2 Webhooks Configured'},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>{row.icon} {row.name}</td>
                     <td style={{textAlign: 'center'}}><div className={`switch ${row.status ? 'active' : ''}`} style={{display: 'inline-block'}}><div className="switch-knob"></div></div></td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.config}</td>
                     <td style={{textAlign: 'right'}}>
                        <span style={{color: 'var(--text-secondary)', cursor: 'pointer'}}>&gt;</span>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>

            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{fontSize: '0.75rem', padding: '0.4rem 0.8rem'}} onClick={() => handleAction("Add Notification Channel")}><Plus size={14} style={{marginRight:'0.3rem'}}/> Add Notification Channel</button>
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Escalation Policies</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure escalation rules for unresolved alerts.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>Severity</th>
                   <th>Escalate After</th>
                   <th>Escalate To</th>
                   <th>Status</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {sev: 'Critical', time: '15 Minutes', to: 'SOC Manager', status: true},
                   {sev: 'High', time: '30 Minutes', to: 'SOC Manager', status: true},
                   {sev: 'Medium', time: '2 Hours', to: 'SOC Analyst Lead', status: false},
                   {sev: 'Low', time: '8 Hours', to: 'SOC Analyst Lead', status: true},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.sev}</td>
                     <td style={{color: 'var(--accent-cyan)'}}>{row.time}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.to}</td>
                     <td><div className={`switch ${row.status ? 'active' : ''}`} style={{display: 'inline-block'}}><div className="switch-knob"></div></div></td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.5rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>

            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{fontSize: '0.75rem', padding: '0.4rem 0.8rem'}} onClick={() => handleAction("Add Escalation Policy")}><Plus size={14} style={{marginRight:'0.3rem'}}/> Add Escalation Policy</button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Alert Severity Levels</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Define severity levels and their characteristics.</p>
            
            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>Severity</th>
                   <th>Score Range</th>
                   <th>Color</th>
                   <th>Description</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {level: 'Critical', range: '80 - 100', color: '#ff003c', desc: 'Immediate action required'},
                   {level: 'High', range: '60 - 79', color: '#f59e0b', desc: 'High risk detected'},
                   {level: 'Medium', range: '40 - 59', color: '#eab308', desc: 'Moderate risk detected'},
                   {level: 'Low', range: '20 - 39', color: '#3b82f6', desc: 'Low risk detected'},
                   {level: 'Informational', range: '0 - 19', color: '#00ff88', desc: 'Informational alert'},
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

            <div style={{marginTop: '1rem'}}>
               <button className="btn-outline" style={{fontSize: '0.75rem', padding: '0.4rem 0.8rem'}} onClick={() => handleAction("Add Severity Level")}><Plus size={14} style={{marginRight:'0.3rem'}}/> Add Severity Level</button>
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Auto Actions</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure automated actions for alerts.</p>
            
            <div className="form-group-list">
               {[
                 {title: 'Auto Assign Alerts', desc: 'Automatically assign alerts to analysts', active: true},
                 {title: 'Auto Close False Positives', desc: 'Automatically close alerts marked as false positive', active: true},
                 {title: 'Auto Enrich Alerts', desc: 'Automatically enrich alerts with threat info', active: true},
                 {title: 'Auto Ticket Creation', desc: 'Create ticket in ITSM for high-risk alerts', active: true},
                 {title: 'Auto Block IP', desc: 'Automatically block malicious IPs', active: false},
               ].map((action, i) => (
                 <div key={i} className="fg-item-horizontal" style={{padding: '0.6rem 0', borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                   <div style={{display: 'flex', alignItems: 'flex-start', gap: '0.75rem'}}>
                      <Settings size={14} color="var(--accent-purple)" style={{marginTop: '0.2rem'}}/>
                      <div className="fg-label-col">
                        <span style={{color: 'var(--text-primary)', fontSize: '0.75rem'}}>{action.title}</span>
                        <span className="fg-sub">{action.desc}</span>
                      </div>
                   </div>
                   <div className={`switch ${action.active ? 'active' : ''}`}><div className="switch-knob"></div></div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Alert Behavior</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Control how alerts are generated and grouped.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Maximum Alerts per Minute</label>
                 <input value={config?.alerts?.maximumAlertsPerMinute || ""} onChange={(e) => handleChange("alerts", "maximumAlertsPerMinute", e.target.value)} name="alerts.maximumAlertsPerMinute"  type="number" defaultValue="100" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Duplicate Alert Suppression</label>
                 <div className={`switch ${config?.alerts?.duplicateAlertSuppression ? "active" : ""}`} onClick={() => handleChange("alerts", "duplicateAlertSuppression", !config?.alerts?.duplicateAlertSuppression)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Suppression Time Window</label>
                 <select value={config?.alerts?.suppressionTimeWindow || ""} onChange={(e) => handleChange("alerts", "suppressionTimeWindow", e.target.value)} name="alerts.suppressionTimeWindow" className="select-input"><option>10 Minutes</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Alert Grouping</label>
                 <select value={config?.alerts?.alertGrouping || ""} onChange={(e) => handleChange("alerts", "alertGrouping", e.target.value)} name="alerts.alertGrouping" className="select-input"><option>By Entity</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Correlation Window</label>
                 <select value={config?.alerts?.correlationWindow || ""} onChange={(e) => handleChange("alerts", "correlationWindow", e.target.value)} name="alerts.correlationWindow" className="select-input"><option>30 Minutes</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Auto Close Low Risk Alerts</label>
                 <div className={`switch ${config?.alerts?.autoCloseLowRiskAlerts ? "active" : ""}`} onClick={() => handleChange("alerts", "autoCloseLowRiskAlerts", !config?.alerts?.autoCloseLowRiskAlerts)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none'}}>
                 <label>Auto Close After</label>
                 <select value={config?.alerts?.autoCloseAfter || ""} onChange={(e) => handleChange("alerts", "autoCloseAfter", e.target.value)} name="alerts.autoCloseAfter" className="select-input"><option>7 Days</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Alerts will be grouped and correlated to reduce noise and improve SOC efficiency.
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>6.</span> Quiet Hours</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Mute non-critical alerts during specified time.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Enable Quiet Hours</label>
                 <div className={`switch ${config?.alerts?.enableQuietHours ? "active" : ""}`} onClick={() => handleChange("alerts", "enableQuietHours", !config?.alerts?.enableQuietHours)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Start Time</label>
                 <input type="time" defaultValue="22:00" className="num-input" style={{width: '100px'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>End Time</label>
                 <input type="time" defaultValue="06:00" className="num-input" style={{width: '100px'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Time Zone</label>
                 <select value={config?.alerts?.timeZone || ""} onChange={(e) => handleChange("alerts", "timeZone", e.target.value)} name="alerts.timeZone" className="select-input"><option>(UTC+05:30) Asia/Kolkata</option></select>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none', flexDirection: 'column', alignItems: 'flex-start', gap: '0.75rem'}}>
                 <label>Apply To Severity</label>
                 <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box checked"><CheckCircle size={10} color="white"/></div> Critical</label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box checked"><CheckCircle size={10} color="white"/></div> High</label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box"></div> Medium</label>
                    <label style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box"></div> Low</label>
                 </div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Critical alerts will always be delivered regardless of quiet hours.
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer" style={{marginTop: 'auto'}}>
         <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)'}}><Info size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Alert settings help reduce noise, speed up response, and improve overall security operations efficiency.</span>
         <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Alert Management Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Alert Management Settings</button>
      </div>
    </div>
  );
}
// We also import Users for the Teams icon
