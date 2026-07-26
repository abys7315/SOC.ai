import React from 'react';
import { Key, Plus, Edit2, Trash2, Link, ExternalLink, Settings, BarChart2, CheckCircle, Save, Info, RefreshCw } from 'lucide-react';

export default function SettingsAPI({ config, handleChange, handleSave, handleAction }) {
  const defaultApiKeys = [
    {name: 'Production Key', key: '**** **** 4212', created: 'Jul 24, 2026', used: 'Jul 16, 2026', status: 'Active'},
    {name: 'Integration Key', key: '**** **** 8945', created: 'Jul 19, 2026', used: 'Jul 22, 2026', status: 'Active'},
    {name: 'Read Only Key', key: '**** **** 3318', created: 'Jul 23, 2026', used: 'Jul 12, 2026', status: 'Inactive'}
  ];
  const apiKeysList = config?.api?.apiKeys || defaultApiKeys;

  const handleAddApiKey = () => {
    const newKey = {name: `New Key ${apiKeysList.length + 1}`, key: '**** **** ' + Math.floor(1000 + Math.random() * 9000), created: 'Just now', used: 'Never', status: 'Active'};
    handleChange("api", "apiKeys", [...apiKeysList, newKey]);
    handleAction("API Key Generated");
  };

  const handleDeleteApiKey = (index) => {
    const newList = [...apiKeysList];
    newList.splice(index, 1);
    handleChange("api", "apiKeys", newList);
    handleAction("API Key Deleted");
  };

  const defaultWebhooks = [
    {name: 'Security Alerts', url: 'https://soc.company.com/webhook/alerts', events: 5, status: 'Active'},
    {name: 'Entity Updates', url: 'https://iam.company.com/webhook/identity', events: 3, status: 'Active'},
    {name: 'System Health', url: 'https://ops.company.com/webhook/health', events: 2, status: 'Inactive'}
  ];
  const webhooksList = config?.api?.webhooks || defaultWebhooks;

  const handleAddWebhook = () => {
    const newWebhook = {name: `New Webhook ${webhooksList.length + 1}`, url: 'https://example.com/webhook', events: 0, status: 'Active'};
    handleChange("api", "webhooks", [...webhooksList, newWebhook]);
    handleAction("Webhook Added");
  };

  const handleDeleteWebhook = (index) => {
    const newList = [...webhooksList];
    newList.splice(index, 1);
    handleChange("api", "webhooks", newList);
    handleAction("Webhook Deleted");
  };

  const defaultIps = [
    {ip: '192.168.1.0/24', desc: 'Corporate Network', added: 'Jul 14, 2026'},
    {ip: '203.0.113.10', desc: 'Integration Server', added: 'Jul 22, 2026'},
    {ip: '198.51.100.0/24', desc: 'Office Network', added: 'Jul 21, 2026'}
  ];
  const ipsList = config?.api?.ipWhitelist || defaultIps;

  const handleAddIp = () => {
    const newIp = {ip: `10.0.0.${ipsList.length + 10}`, desc: 'New Network', added: 'Just now'};
    handleChange("api", "ipWhitelist", [...ipsList, newIp]);
    handleAction("IP Allowed");
  };

  const handleDeleteIp = (index) => {
    const newList = [...ipsList];
    newList.splice(index, 1);
    handleChange("api", "ipWhitelist", newList);
    handleAction("IP Removed");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
           <div>
             <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>API & Integration</h2>
             <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Manage API access, keys, webhooks and third-party integrations.</p>
           </div>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> API Access</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure API access and manage API keys.</p>
            
            <div className="form-group-list" style={{marginBottom: '1rem'}}>
               <div className="fg-item-horizontal">
                 <label>Enable API Access</label>
                 <div className={`switch ${config?.api?.enableApiAccess ? "active" : ""}`} onClick={() => handleChange("api", "enableApiAccess", !config?.api?.enableApiAccess)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Base URL</label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.3rem 0.6rem', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)'}}>
                    <Link size={12} color="var(--text-secondary)"/>
                    <span style={{fontSize: '0.75rem'}}>https://api.honeywell-badp.com/v1</span>
                 </div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>API Version</label>
                 <select value={config?.api?.apiVersion || ""} onChange={(e) => handleChange("api", "apiVersion", e.target.value)} name="api.apiVersion" className="select-input"><option>v1</option></select>
               </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
               <div style={{fontSize: '0.8rem', color: 'var(--text-primary)'}}>API Keys</div>
               <button className="btn-outline" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}} onClick={handleAddApiKey}><Plus size={10} style={{marginRight: '0.2rem'}}/> Generate API Key</button>
            </div>

            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Key Name</th>
                   <th>Key</th>
                   <th>Created On</th>
                   <th>Last Used</th>
                   <th>Status</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {apiKeysList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{color: 'var(--accent-cyan)', fontFamily: 'monospace'}}>{row.key}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.created}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.used}</td>
                     <td><span style={{color: row.status === 'Active' ? 'var(--accent-green)' : 'var(--text-secondary)'}}>{row.status}</span></td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteApiKey(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><ExternalLink size={12}/> View API Documentation</span>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Rate Limiting</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure API rate limits and throttling settings.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Enable Rate Limiting</label>
                 <div className={`switch ${config?.api?.enableRateLimiting ? "active" : ""}`} onClick={() => handleChange("api", "enableRateLimiting", !config?.api?.enableRateLimiting)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Requests per Minute (RPM)</label>
                 <input value={config?.api?.requestsPerMinuteRpm || ""} onChange={(e) => handleChange("api", "requestsPerMinuteRpm", e.target.value)} name="api.requestsPerMinuteRpm"  type="number" defaultValue="1000" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal">
                 <label>Requests per Hour (RPH)</label>
                 <input value={config?.api?.requestsPerHourRph || ""} onChange={(e) => handleChange("api", "requestsPerHourRph", e.target.value)} name="api.requestsPerHourRph"  type="number" defaultValue="10000" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal">
                 <label>Burst Limit</label>
                 <input value={config?.api?.burstLimit || ""} onChange={(e) => handleChange("api", "burstLimit", e.target.value)} name="api.burstLimit"  type="number" defaultValue="2000" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Rate Limit Window</label>
                 <select value={config?.api?.rateLimitWindow || ""} onChange={(e) => handleChange("api", "rateLimitWindow", e.target.value)} name="api.rateLimitWindow" className="select-input"><option>Rolling Window</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Rate limits help ensure system stability and fair usage.
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>2.</span> Webhooks</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Configure webhooks to receive real-time event notifications.</p>
               </div>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleAddWebhook}><Plus size={12} style={{marginRight: '0.3rem'}}/> Add Webhook</button>
            </div>

            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Webhook Name</th>
                   <th>Endpoint URL</th>
                   <th>Events</th>
                   <th>Status</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {webhooksList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{color: 'var(--text-secondary)', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>{row.url}</td>
                     <td style={{color: 'var(--accent-cyan)', textAlign: 'center'}}>{row.events}</td>
                     <td><span style={{color: row.status === 'Active' ? 'var(--accent-green)' : 'var(--text-secondary)'}}>{row.status}</span></td>
                     <td style={{textAlign: 'right'}}>
                        <Settings size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteWebhook(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', marginBottom: '0.5rem'}}>
               <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Recent Delivery Logs</div>
               <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View All Logs</span>
            </div>

            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <tbody>
                 {[
                   {time: 'Jul 26, 2026 10:24:01 AM', event: 'Security Alerts', status: 'Delivered', lat: '240ms'},
                   {time: 'Jul 16, 2026 10:23:45 AM', event: 'Security Alerts', status: 'Delivered', lat: '180ms'},
                   {time: 'Jul 24, 2026 10:22:15 AM', event: 'Entity Updates', status: 'Delivered', lat: '210ms'},
                   {time: 'Jul 16, 2026 10:21:05 AM', event: 'System Health', status: 'Failed', lat: '3.2s', sCol: 'var(--accent-red)'},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-secondary)'}}>{row.time}</td>
                     <td style={{color: 'var(--text-primary)'}}>{row.event}</td>
                     <td style={{color: row.sCol || 'var(--accent-green)'}}>{row.status}</td>
                     <td style={{color: 'var(--text-secondary)', textAlign: 'right'}}>{row.lat}</td>
                   </tr>
                 ))}
               </tbody>
            </table>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> IP Allowlisting</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Allow access to the API from specific IP addresses.</p>
            
            <div className="form-group-list" style={{marginBottom: '1rem'}}>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Enable IP Allowlisting</label>
                 <div className={`switch ${config?.api?.enableIpAllowlisting ? "active" : ""}`} onClick={() => handleChange("api", "enableIpAllowlisting", !config?.api?.enableIpAllowlisting)}><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
               <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Allowed IP Addresses</div>
               <button className="btn-outline" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}} onClick={handleAddIp}><Plus size={10} style={{marginRight: '0.2rem'}}/> Add IP</button>
            </div>

            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>IP Address / CIDR</th>
                   <th>Description</th>
                   <th>Added On</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {ipsList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--accent-cyan)', fontFamily: 'monospace'}}>{row.ip}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.desc}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.added}</td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteIp(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem'}}>
               <Info size={14} style={{flexShrink: 0}}/> Only requests from allowed IPs will be accepted.
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Third-party Integrations</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Connect and manage third-party tools and platforms.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
               {[
                 {name: 'SIEM (Splunk)', desc: 'Send alerts and logs to Splunk', status: 'Connected', sCol: 'var(--accent-green)'},
                 {name: 'Microsoft Sentinel', desc: 'Export data to Microsoft Sentinel', status: 'Connected', sCol: 'var(--accent-green)'},
                 {name: 'ServiceNow', desc: 'Create incidents in ServiceNow', status: 'Connected', sCol: 'var(--accent-green)'},
                 {name: 'Slack', desc: 'Send alerts and notifications to Slack', status: 'Connected', sCol: 'var(--accent-green)'},
                 {name: 'PagerDuty', desc: 'Create and manage incidents', status: 'Inactive', sCol: 'var(--text-secondary)'},
               ].map((intg, i) => (
                 <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                       <div style={{width: '32px', height: '32px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                          {/* Mock Logo placeholder */}
                          <div style={{width: '16px', height: '16px', background: 'white', opacity: 0.5, borderRadius: '2px'}}></div>
                       </div>
                       <div style={{display: 'flex', flexDirection: 'column'}}>
                          <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>{intg.name}</span>
                          <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>{intg.desc}</span>
                       </div>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                       <span style={{padding: '0.15rem 0.5rem', borderRadius: '4px', border: `1px solid ${intg.sCol}`, color: intg.sCol, fontSize: '0.65rem'}}>{intg.status}</span>
                       <Settings size={14} style={{color: 'var(--text-secondary)', cursor: 'pointer'}}/>
                    </div>
                 </div>
               ))}
            </div>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Link size={12}/> Browse Integration Marketplace</span>
            </div>
          </div>

          <div className="glass-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>6.</span> API Usage Analytics</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Monitor API usage and performance metrics.</p>
               </div>
               <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View Full Analytics &gt;</span>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem'}}>
               <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Requests Over Time</span>
               <select className="select-input" style={{width: '90px', padding: '0.2rem 0.4rem', fontSize: '0.65rem'}}><option>Last 7 Days</option></select>
            </div>

            <div style={{width: '100%', height: '100px', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', padding: '0.5rem 0'}}>
                {/* CSS Line Chart approximation */}
                <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{position: 'absolute', bottom: 0, left: 0}}>
                   <path d="M0,100 L0,70 Q10,50 20,60 T40,40 T60,30 T80,50 T100,20 L100,100 Z" fill="rgba(168, 85, 247, 0.2)" />
                   <path d="M0,70 Q10,50 20,60 T40,40 T60,30 T80,50 T100,20" fill="none" stroke="var(--accent-purple)" strokeWidth="2" />
                </svg>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'var(--text-secondary)', marginTop: '0.3rem', padding: '0 0.5rem'}}>
               <span>May 9</span><span>May 10</span><span>May 11</span><span>May 12</span><span>May 13</span><span>May 14</span><span>May 15</span>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem'}}>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Total Requests</span>
                  <span style={{fontSize: '1.1rem', color: 'white', fontWeight: 'bold'}}>45,231</span>
               </div>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Avg Response Time</span>
                  <span style={{fontSize: '1.1rem', color: 'white', fontWeight: 'bold'}}>187 ms</span>
               </div>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Error Rate</span>
                  <span style={{fontSize: '1.1rem', color: 'var(--accent-red)', fontWeight: 'bold'}}>0.42%</span>
               </div>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Reset to Defaults")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Reset to Defaults</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save API & Integration Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save API & Integration Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
