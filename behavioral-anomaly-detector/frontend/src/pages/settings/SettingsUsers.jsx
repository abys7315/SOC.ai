import React from 'react';
import { Search, Plus, Edit2, Trash2, Key, Filter, Check, Minus, Info, Save, Shield } from 'lucide-react';

export default function SettingsUsers({ config, handleChange, handleSave, handleAction }) {
  const defaultUsers = [
    {name: 'SOC Analyst', email: 'soc.analyst@honeywell.com', role: 'SOC Analyst', rcol: '#818cf8', status: 'Active', time: 'Jul 15, 2026', initials: 'SA'},
    {name: 'SOC Manager', email: 'soc.manager@honeywell.com', role: 'SOC Manager', rcol: '#34d399', status: 'Active', time: 'Jul 14, 2026', initials: 'SM'},
    {name: 'Security Engineer', email: 'sec.eng@honeywell.com', role: 'Security Engineer', rcol: '#f472b6', status: 'Active', time: 'Jul 17, 2026', initials: 'SE'},
    {name: 'Auditor', email: 'auditor@honeywell.com', role: 'Auditor', rcol: '#facc15', status: 'Active', time: 'Jul 25, 2026', initials: 'AU'},
    {name: 'Viewer', email: 'viewer@honeywell.com', role: 'Viewer', rcol: '#94a3b8', status: 'Offline', time: 'Jul 13, 2026', initials: 'VW'}
  ];
  const userList = config?.users?.userList || defaultUsers;

  const defaultRoles = [
    {name: 'Administrator', users: 2, desc: 'Full access to all features and settings'},
    {name: 'SOC Manager', users: 3, desc: 'Manage alerts, users and escalations'},
    {name: 'SOC Analyst', users: 15, desc: 'View alerts, investigate and create reports'},
    {name: 'Security Engineer', users: 4, desc: 'Manage system, models and integrations'},
    {name: 'Auditor', users: 3, desc: 'View logs, audit trails and reports'},
    {name: 'Viewer', users: 5, desc: 'Read-only access to dashboards and alerts'},
  ];
  const roleList = config?.users?.roleList || defaultRoles;

  const handleAddUser = () => {
    const newUser = {
       name: `New User ${userList.length + 1}`, 
       email: `user${userList.length + 1}@honeywell.com`, 
       role: 'Viewer', 
       rcol: '#94a3b8', 
       status: 'Active', 
       time: 'Just now', 
       initials: 'NU'
    };
    handleChange("users", "userList", [newUser, ...userList]);
    handleAction("User Added to Local View");
  };

  const handleDeleteUser = (index) => {
    const newList = [...userList];
    newList.splice(index, 1);
    handleChange("users", "userList", newList);
    handleAction("User Removed");
  };

  const handleAddRole = () => {
    const newRole = {name: 'New Custom Role', users: 0, desc: 'Custom role added by user'};
    handleChange("users", "roleList", [newRole, ...roleList]);
    handleAction("Role Added to Local View");
  };

  const handleDeleteRole = (index) => {
    const newList = [...roleList];
    newList.splice(index, 1);
    handleChange("users", "roleList", newList);
    handleAction("Role Removed");
  };

  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
           <div>
             <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>User Management</h2>
             <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Manage users, roles, permissions and access control for the platform.</p>
           </div>
         </div>
      </div>

      <div className="settings-grid-3col" style={{gridTemplateColumns: '1.2fr 1fr 1fr'}}>
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>1.</span> Users</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Add, edit, suspend or remove users from the platform.</p>
               </div>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleAddUser}><Plus size={12} style={{marginRight: '0.3rem'}}/> Add User</button>
            </div>
            
            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
               <div style={{flex: 1, position: 'relative'}}>
                  <Search size={14} style={{position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)'}}/>
                  <input type="text" placeholder="Search users..." style={{width: '100%', padding: '0.4rem 0.5rem 0.4rem 1.8rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', borderRadius: '4px', fontSize: '0.75rem'}} />
               </div>
               <select className="select-input" style={{width: '120px'}}><option>All Roles</option></select>
            </div>

            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>User</th>
                   <th>Email</th>
                   <th>Role</th>
                   <th>Status</th>
                   <th>Last Active</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {userList.map((row, i) => (
                   <tr key={i}>
                     <td style={{display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)'}}>
                        <div style={{width: '20px', height: '20px', borderRadius: '50%', background: row.rcol, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: 'white'}}>{row.initials}</div>
                        {row.name}
                     </td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.email}</td>
                     <td><span style={{padding: '0.1rem 0.3rem', borderRadius: '4px', border: `1px solid ${row.rcol}`, color: row.rcol, fontSize: '0.65rem'}}>{row.role}</span></td>
                     <td><span style={{color: row.status === 'Active' ? 'var(--accent-green)' : 'var(--text-secondary)'}}>{row.status}</span></td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.time}</td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Key size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.3rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteUser(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', fontSize: '0.7rem', color: 'var(--text-secondary)'}}>
               <span>Showing 1 to {userList.length} of {userList.length} users</span>
               <div style={{display: 'flex', gap: '0.3rem'}}>
                 <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("&lt;")}>&lt;</button>
                 <button style={{background: 'var(--accent-purple)', border: 'none', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("1")}>1</button>
                 <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("2")}>2</button>
                 <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("3")}>3</button>
                 <span style={{padding: '0.2rem 0'}}>...</span>
                 <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("5")}>5</button>
                 <button style={{background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px'}} onClick={() => handleAction("&gt;")}>&gt;</button>
               </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Role Permissions</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure module-wise permissions for each role.</p>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem'}}>
                 <label>Select Role</label>
                 <select value={config?.users?.selectRole || ""} onChange={(e) => handleChange("users", "selectRole", e.target.value)} name="users.selectRole" className="select-input" style={{width: '150px'}}><option>SOC Analyst</option></select>
               </div>
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem'}}>
                 <span style={{color: 'var(--text-secondary)'}}>Quick Actions:</span>
                 <button style={{background: 'rgba(0,255,136,0.1)', color: 'var(--accent-green)', border: '1px solid rgba(0,255,136,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center'}} onClick={() => handleAction("Grant All")}><Check size={10} style={{marginRight: '0.2rem'}}/> Grant All</button>
                 <button style={{background: 'rgba(255,0,60,0.1)', color: 'var(--accent-red)', border: '1px solid rgba(255,0,60,0.3)', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'flex', alignItems: 'center'}} onClick={() => handleAction("Deny All")}><Minus size={10} style={{marginRight: '0.2rem'}}/> Deny All</button>
               </div>
            </div>

            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Module</th>
                   <th style={{textAlign: 'center'}}>View</th>
                   <th style={{textAlign: 'center'}}>Create</th>
                   <th style={{textAlign: 'center'}}>Edit</th>
                   <th style={{textAlign: 'center'}}>Delete</th>
                   <th style={{textAlign: 'center'}}>Export</th>
                   <th style={{textAlign: 'center'}}>Settings</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'Dashboard', v: 1, c: 0, e: 0, d: 0, x: 1, s: 0},
                   {name: 'Alerts', v: 1, c: 0, e: 1, d: 0, x: 1, s: 1},
                   {name: 'Entities', v: 1, c: 0, e: 0, d: 0, x: 0, s: 0},
                   {name: 'Attack Injection', v: 1, c: 1, e: 1, d: 0, x: 0, s: 0},
                   {name: 'Reports', v: 1, c: 0, e: 0, d: 0, x: 1, s: 0},
                   {name: 'System Settings', v: 0, c: 0, e: 0, d: 0, x: 0, s: 0},
                 ].map((mod, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{mod.name}</td>
                     {['v', 'c', 'e', 'd', 'x', 's'].map(col => (
                       <td key={col} style={{textAlign: 'center'}}>
                         {mod[col] === 1 ? (
                            <div className="cb-box checked" style={{margin: '0 auto'}}><Check size={10} color="white"/></div>
                         ) : mod[col] === 0 ? (
                            <div className="cb-box" style={{margin: '0 auto'}}></div>
                         ) : (
                            <span style={{color: 'var(--text-secondary)'}}>-</span>
                         )}
                       </td>
                     ))}
                   </tr>
                 ))}
               </tbody>
            </table></div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem'}}>
               <div style={{display: 'flex', gap: '1rem', fontSize: '0.65rem', color: 'var(--text-secondary)'}}>
                 <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box checked" style={{width:'10px', height:'10px'}}></div> Granted</span>
                 <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className="cb-box" style={{width:'10px', height:'10px'}}></div> Not Granted</span>
                 <span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>- Not Applicable</span>
               </div>
               <button className="btn-outline" style={{padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: 'var(--accent-purple)', borderColor: 'var(--accent-purple)'}} onClick={() => handleAction("Save Permissions")}><Save size={12} style={{marginRight: '0.3rem'}}/> Save Permissions</button>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>2.</span> Roles</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Create and manage user roles.</p>
               </div>
               <button className="btn-outline" style={{padding: '0.3rem 0.6rem', fontSize: '0.7rem'}} onClick={handleAddRole}><Plus size={12} style={{marginRight: '0.3rem'}}/> Add Role</button>
            </div>

            <div className="table-responsive"><table className="settings-table" style={{fontSize: '0.7rem'}}>
               <thead>
                 <tr>
                   <th>Role Name</th>
                   <th style={{textAlign: 'center'}}>Users</th>
                   <th>Description</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {roleList.map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{textAlign: 'center', color: 'var(--accent-cyan)'}}>{row.users}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.desc}</td>
                     <td style={{textAlign: 'right'}}>
                        <Edit2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)', marginRight:'0.4rem'}}/>
                        <Trash2 size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}} onClick={() => handleDeleteRole(i)}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table></div>
            <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Showing 1 to {roleList.length} of {roleList.length} roles</div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Access Control Settings</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Global access control configurations.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Require MFA for all users <Info size={10}/></label>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Allow concurrent sessions <Info size={10}/></label>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Maximum concurrent sessions</label>
                 <input value={config?.users?.maximumConcurrentSessions || ""} onChange={(e) => handleChange("users", "maximumConcurrentSessions", e.target.value)} name="users.maximumConcurrentSessions"  type="number" defaultValue="3" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Session timeout (minutes)</label>
                 <input value={config?.users?.sessionTimeoutMinutes || ""} onChange={(e) => handleChange("users", "sessionTimeoutMinutes", e.target.value)} name="users.sessionTimeoutMinutes"  type="number" defaultValue="30" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Password expiration (days)</label>
                 <input value={config?.users?.passwordExpirationDays || ""} onChange={(e) => handleChange("users", "passwordExpirationDays", e.target.value)} name="users.passwordExpirationDays"  type="number" defaultValue="90" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Account lockout after failed attempts</label>
                 <input value={config?.users?.accountLockoutAfterFailedAttempts || ""} onChange={(e) => handleChange("users", "accountLockoutAfterFailedAttempts", e.target.value)} name="users.accountLockoutAfterFailedAttempts"  type="number" defaultValue="5" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0'}}>
                 <label>Lockout duration (minutes)</label>
                 <input value={config?.users?.lockoutDurationMinutes || ""} onChange={(e) => handleChange("users", "lockoutDurationMinutes", e.target.value)} name="users.lockoutDurationMinutes"  type="number" defaultValue="15" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.4rem 0', borderBottom: 'none'}}>
                 <label>Allow self password reset</label>
                 <div className={`switch ${config?.users?.allowSelfPasswordReset ? "active" : ""}`} onClick={() => handleChange("users", "allowSelfPasswordReset", !config?.users?.allowSelfPasswordReset)}><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', padding: '0.5rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> These settings apply to all users across the platform.
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Permissions Overview</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Manage permissions for roles and modules.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem 0'}}>
               <div style={{position: 'relative', width: '140px', height: '140px', marginBottom: '1.5rem'}}>
                 {/* CSS Donut Chart approximation */}
                 <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: 'conic-gradient(#8b5cf6 0% 20%, #ef4444 20% 35%, #f59e0b 35% 50%, #06b6d4 50% 65%, #10b981 65% 80%, #3b82f6 80% 90%, #64748b 90% 100%)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                 }}>
                    <div style={{width: '100px', height: '100px', borderRadius: '50%', background: 'var(--bg-panel)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                       <span style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'white'}}>58</span>
                       <span style={{fontSize: '0.55rem', color: 'var(--text-secondary)'}}>Total Permissions</span>
                    </div>
                 </div>
               </div>

               <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', fontSize: '0.7rem'}}>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#8b5cf6'}}></div> Dashboard Access</span> <span>6</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#ef4444'}}></div> Alert Access</span> <span>10</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#f59e0b'}}></div> Entity Access</span> <span>7</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#06b6d4'}}></div> Settings Access</span> <span>12</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#10b981'}}></div> Data Access</span> <span>9</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#3b82f6'}}></div> System Access</span> <span>8</span></div>
                 <div style={{display: 'flex', justifyContent: 'space-between'}}><span style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#64748b'}}></div> Others</span> <span>6</span></div>
               </div>
            </div>

            <button className="btn-outline" style={{width: '100%', marginTop: 'auto', fontSize: '0.75rem', padding: '0.5rem'}} onClick={() => handleAction("Manage Role Permissions")}><Shield size={14} style={{marginRight: '0.4rem'}}/> Manage Role Permissions</button>
          </div>
          
          {/* Empty spacer or place for save button if it fits better in flow, but we have a footer */}
          <div style={{marginTop: 'auto', display: 'flex', justifyContent: 'flex-end'}}>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save User Management Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save User Management Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
