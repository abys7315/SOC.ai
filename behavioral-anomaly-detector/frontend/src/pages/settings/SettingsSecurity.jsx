import React from 'react';
import { Shield, Key, Lock, Eye, AlertTriangle, FileText, CheckCircle, Info, Database, Save } from 'lucide-react';

export default function SettingsSecurity({ config, handleChange, handleSave, handleAction }) {
  const defaultApiKeys = [
    {name: 'SIEM_Connector', createdBy: 'admin', createdOn: 'Jul 23, 2026', lastUsed: 'Jul 14, 2026', status: 'Active'},
    {name: 'Mobile_App_Key', createdBy: 'sec_engineer', createdOn: 'Jul 21, 2026', lastUsed: 'Jul 18, 2026', status: 'Active'}
  ];
  const apiKeysList = config?.security?.apiKeys || defaultApiKeys;

  const handleAddApiKey = () => {
    const newKey = {
      name: `API_Key_${apiKeysList.length + 1}`,
      createdBy: 'current_user',
      createdOn: 'Just now',
      lastUsed: 'Never',
      status: 'Active'
    };
    handleChange("security", "apiKeys", [...apiKeysList, newKey]);
    handleAction("API Key Generated");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Security Settings</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Manage authentication, access control, API security and encryption settings.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          {/* Authentication Settings */}
          <div className="glass-panel">
            <h3 className="panel-title"><Lock size={16} style={{marginRight: '0.5rem'}}/> Authentication Settings</h3>
            
            <div className="form-group-list">
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Password Policy</span>
                   <span className="fg-sub">Enforce strong passwords for all users</span>
                 </div>
                 <div className="fg-input-col"><span style={{color: 'var(--accent-cyan)'}}>Strong &gt;</span></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Multi-Factor Authentication (MFA)</span>
                   <span className="fg-sub">Require MFA for user login</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Session Expiration</span>
                   <span className="fg-sub">Automatically logout inactive sessions</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.sessionTimeout || ""} onChange={(e) => handleChange("security", "sessionTimeout", e.target.value)} name="security.sessionTimeout" >
                     <option>30 Minutes</option>
                     <option>12 Hours</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Login Timeout</span>
                   <span className="fg-sub">Time after which login page expires</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.loginTimeout || ""} onChange={(e) => handleChange("security", "loginTimeout", e.target.value)} name="security.loginTimeout">
                     <option>15 Minutes</option>
                     <option>30 Minutes</option>
                     <option>60 Minutes</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Maximum Login Attempts</span>
                   <span className="fg-sub">Lock account after failed attempts</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.maxFailedLogins || ""} onChange={(e) => handleChange("security", "maxFailedLogins", e.target.value)} name="security.maxFailedLogins" >
                     <option>3 Attempts</option>
                     <option>5 Attempts</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Account Lock Duration</span>
                   <span className="fg-sub">Time to lock account after max attempts</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.accountLockDuration || ""} onChange={(e) => handleChange("security", "accountLockDuration", e.target.value)} name="security.accountLockDuration">
                     <option>15 Minutes</option>
                     <option>30 Minutes</option>
                     <option>60 Minutes</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item" style={{borderBottom: 'none'}}>
                 <div className="fg-label-col">
                   <span>Biometric Authentication</span>
                   <span className="fg-sub">Allow biometric authentication (if supported)</span>
                 </div>
                  <div className="fg-input-col"><div className={`switch ${config?.security?.biometricAuth ? "active" : ""}`} onClick={() => handleChange("security", "biometricAuth", !config?.security?.biometricAuth)}><div className="switch-knob"></div></div></div>
               </div>
            </div>
          </div>

          {/* Encryption Settings */}
          <div className="glass-panel">
            <h3 className="panel-title"><Shield size={16} style={{marginRight: '0.5rem'}}/> Encryption Settings</h3>
            
            <div className="form-group-list">
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Data in Transit</span>
                   <span className="fg-sub">Encrypt data in transit using TLS</span>
                 </div>
                 <div className="fg-input-col"><span style={{color: 'var(--accent-green)'}}>TLS 1.3 &gt;</span></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Data at Rest</span>
                   <span className="fg-sub">Encrypt internal data in database</span>
                 </div>
                 <div className="fg-input-col"><span style={{color: 'var(--accent-green)'}}>AES-256 &gt;</span></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Database Encryption</span>
                   <span className="fg-sub">Encrypt sensitive data in the database</span>
                 </div>
                 <div className="fg-input-col"><span style={{color: 'var(--accent-green)'}}>AES-256 &gt;</span></div>
               </div>
               
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Model Encryption</span>
                   <span className="fg-sub">Encrypt AI models and artifacts</span>
                 </div>
                 <div className="fg-input-col"><span style={{color: 'var(--accent-green)'}}>AES-256 &gt;</span></div>
               </div>

               <div className="fg-item" style={{borderBottom: 'none'}}>
                 <div className="fg-label-col">
                   <span>Encryption Key Rotation</span>
                   <span className="fg-sub">Automatically rotate encryption keys</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.encryptionKeyRotation || ""} onChange={(e) => handleChange("security", "encryptionKeyRotation", e.target.value)} name="security.encryptionKeyRotation">
                     <option>30 Days</option>
                     <option>60 Days</option>
                     <option>90 Days</option>
                   </select>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          {/* Access Control */}
          <div className="glass-panel">
            <h3 className="panel-title"><Shield size={16} style={{marginRight: '0.5rem'}}/> Access Control (RBAC)</h3>
            
            <div className="form-group-list">
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Role Based Access Control</span>
                   <span className="fg-sub">Enable role-based permissions</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>
               
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Default Role for New Users</span>
                   <span className="fg-sub">Set default role for newly created users</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.defaultRole || ""} onChange={(e) => handleChange("security", "defaultRole", e.target.value)} name="security.defaultRole">
                     <option>Analyst</option>
                     <option>Investigator</option>
                     <option>Admin</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Session Concurrency Limit</span>
                   <span className="fg-sub">Max concurrent sessions per user</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.sessionConcurrency || ""} onChange={(e) => handleChange("security", "sessionConcurrency", e.target.value)} name="security.sessionConcurrency">
                     <option>1 Session</option>
                     <option>2 Sessions</option>
                     <option>5 Sessions</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>IP Restriction for Admins</span>
                   <span className="fg-sub">Restrict admin access to specific IPs</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Allowed IPs / Networks</span>
                   <span className="fg-sub">IP addresses allowed for admin access</span>
                 </div>
                 <div className="fg-input-col"><span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>192.168.1.0/24, 10.0.0.5</span></div>
               </div>
            </div>

            <h4 style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', marginBottom: '0.75rem'}}>Current Roles</h4>
            <div className="role-list">
               <div className="role-item">
                 <div className="r-icon"><Shield size={14}/></div>
                 <div className="r-details">
                    <span className="r-name">Administrator</span>
                    <span className="r-desc">Full access to all modules and settings</span>
                 </div>
                 <div className="r-count">4 Users &gt;</div>
               </div>
               <div className="role-item">
                 <div className="r-icon"><Eye size={14}/></div>
                 <div className="r-details">
                    <span className="r-name">SOC Analyst</span>
                    <span className="r-desc">Access to detection, alerts and analytics</span>
                 </div>
                 <div className="r-count">28 Users &gt;</div>
               </div>
               <div className="role-item">
                 <div className="r-icon"><Database size={14}/></div>
                 <div className="r-details">
                    <span className="r-name">Security Engineer</span>
                    <span className="r-desc">Access to configuration and models</span>
                 </div>
                 <div className="r-count">15 Users &gt;</div>
               </div>
               <div className="role-item">
                 <div className="r-icon"><FileText size={14}/></div>
                 <div className="r-details">
                    <span className="r-name">Auditor</span>
                    <span className="r-desc">Read-only access to logs and reports</span>
                 </div>
                 <div className="r-count">6 Users &gt;</div>
               </div>
               <div className="role-item">
                 <div className="r-icon"><Info size={14}/></div>
                 <div className="r-details">
                    <span className="r-name">Viewer</span>
                    <span className="r-desc">Read-only access to dashboards</span>
                 </div>
                 <div className="r-count">34 Users &gt;</div>
               </div>
            </div>
          </div>

          {/* Audit & Compliance */}
          <div className="glass-panel">
            <h3 className="panel-title"><FileText size={16} style={{marginRight: '0.5rem'}}/> Audit & Compliance</h3>
            
            <div className="form-group-list">
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Audit Logging</span>
                   <span className="fg-sub">Log security-related events</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Log Retention Period</span>
                   <span className="fg-sub">Retention period for security logs</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.auditLogRetention || ""} onChange={(e) => handleChange("security", "auditLogRetention", e.target.value)} name="security.auditLogRetention">
                     <option>90 Days</option>
                     <option>180 Days</option>
                     <option>1 Year</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Compliance Mode</span>
                   <span className="fg-sub">Enable compliance controls (GDPR, ISO 27001)</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.complianceMode || ""} onChange={(e) => handleChange("security", "complianceMode", e.target.value)} name="security.complianceMode">
                     <option>ISO 27001</option>
                     <option>SOC 2</option>
                     <option>HIPAA</option>
                     <option>GDPR</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Data Masking</span>
                   <span className="fg-sub">Mask sensitive data in logs</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item" style={{borderBottom: 'none'}}>
                 <div className="fg-label-col">
                   <span>Export Audit Logs</span>
                   <span className="fg-sub">Export security and access logs</span>
                 </div>
                 <div className="fg-input-col">
                   <button className="btn-outline" style={{padding: '0.2rem 0.5rem', fontSize: '0.7rem'}} onClick={() => handleAction("Export Logs")}><FileText size={12}/> Export Logs</button>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          {/* API Security */}
          <div className="glass-panel">
            <h3 className="panel-title"><Key size={16} style={{marginRight: '0.5rem'}}/> API Security</h3>
            
            <div className="form-group-list">
               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Enable API Access</span>
                   <span className="fg-sub">Allow external API access</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>API Authentication</span>
                   <span className="fg-sub">Choose API authentication method</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.authMethod || ""} onChange={(e) => handleChange("security", "authMethod", e.target.value)} name="security.authMethod">
                     <option>API Key</option>
                     <option>OAuth2</option>
                     <option>JWT</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>JWT Expiration</span>
                   <span className="fg-sub">Token expiration time</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.apiKeyExpiration || ""} onChange={(e) => handleChange("security", "apiKeyExpiration", e.target.value)} name="security.apiKeyExpiration">
                     <option>24 Hours</option>
                     <option>7 Days</option>
                     <option>30 Days</option>
                     <option>Never</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>API Rate Limiting</span>
                   <span className="fg-sub">Limit API requests per client</span>
                 </div>
                 <div className="fg-input-col">
                   <select value={config?.security?.globalApiRateLimit || ""} onChange={(e) => handleChange("security", "globalApiRateLimit", e.target.value)} name="security.globalApiRateLimit">
                     <option>50 Requests / Min</option>
                     <option>100 Requests / Min</option>
                     <option>500 Requests / Min</option>
                   </select>
                 </div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>IP Whitelisting</span>
                   <span className="fg-sub">Restrict API access to specific IPs</span>
                 </div>
                 <div className="fg-input-col"><div className="switch active"><div className="switch-knob"></div></div></div>
               </div>

               <div className="fg-item">
                 <div className="fg-label-col">
                   <span>Whitelisted IPs</span>
                   <span className="fg-sub">IPs allowed to access the API</span>
                 </div>
                 <div className="fg-input-col"><span style={{fontSize:'0.7rem', color:'var(--text-secondary)'}}>10.0.0.3/8, 192.168.1.0/24</span></div>
               </div>

               <div className="fg-item" style={{borderBottom: 'none'}}>
                 <div className="fg-label-col">
                   <span>API Keys</span>
                   <span className="fg-sub">Manage and revoke API keys</span>
                 </div>
                 <div className="fg-input-col">
                   <button className="btn-outline" style={{padding: '0.2rem 0.5rem', fontSize: '0.7rem'}} onClick={handleAddApiKey}>Generate API Key</button>
                 </div>
               </div>
            </div>

            <h4 style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '1.5rem', marginBottom: '0.75rem'}}>Active API Keys</h4>
            <div className="api-table-wrapper">
              <table className="settings-table">
                 <thead>
                   <tr>
                     <th>Key Name</th>
                     <th>Created By</th>
                     <th>Created On</th>
                     <th>Last Used</th>
                     <th>Status</th>
                   </tr>
                 </thead>
                 <tbody>
                   {apiKeysList.map((key, i) => (
                     <tr key={i}>
                       <td>{key.name}</td>
                       <td>{key.createdBy}</td>
                       <td>{key.createdOn}</td>
                       <td>{key.lastUsed}</td>
                       <td><span style={{color:'var(--accent-green)'}}>{key.status}</span></td>
                     </tr>
                   ))}
                 </tbody>
              </table>
              <div style={{textAlign: 'right', marginTop: '0.5rem'}}>
                <span style={{fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}>View All API Keys &gt;</span>
              </div>
            </div>
          </div>

          {/* Recent Security Events */}
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <h3 className="panel-title" style={{margin: 0}}>Recent Security Events</h3>
               <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}>View All</span>
            </div>
            
            <div className="audit-list">
               <div className="audit-item">
                 <div className="a-time">Jul 25, 2026 10:15:22 AM</div>
                 <div className="a-action">Failed login attempts for user admin</div>
                 <div className="a-ip" style={{color: '#f59e0b'}}>Warning</div>
               </div>
               <div className="audit-item">
                 <div className="a-time">Jul 24, 2026 09:45:11 AM</div>
                 <div className="a-action">MFA verification failed for user analyst</div>
                 <div className="a-ip" style={{color: '#f59e0b'}}>Warning</div>
               </div>
               <div className="audit-item">
                 <div className="a-time">Jul 11, 2026 08:32:05 AM</div>
                 <div className="a-action">User role updated: sec_engineer</div>
                 <div className="a-ip" style={{color: 'var(--accent-cyan)'}}>Info</div>
               </div>
               <div className="audit-item">
                 <div className="a-time">Jul 14, 2026 10:14:44 AM</div>
                 <div className="a-action">API key created: Integration_01</div>
                 <div className="a-ip" style={{color: 'var(--accent-cyan)'}}>Info</div>
               </div>
               <div className="audit-item" style={{borderBottom: 'none'}}>
                 <div className="a-time">Jul 26, 2026 03:55:12 AM</div>
                 <div className="a-action">Admin login from new IP: 192.168.1.45</div>
                 <div className="a-ip" style={{color: 'var(--accent-green)'}}>Success</div>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
         <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}><Info size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Security changes may require re-authentication or system restart to take effect.</span>
         <button className="btn-solid-red" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Security Settings")}><Save size={16} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Security Settings</button>
      </div>
    </div>
  );
}
