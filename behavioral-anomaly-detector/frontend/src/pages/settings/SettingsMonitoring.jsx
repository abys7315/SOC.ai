import React from 'react';
import { Activity, Server, Database, Bell, Shield, Cloud, AlertTriangle, AlertCircle, Info, Link, ArrowUpRight, ArrowDownRight, RefreshCw, Save, Settings } from 'lucide-react';

export default function SettingsMonitoring({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>System Monitoring</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Monitor system performance, resources, services, and integrations in real-time.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> System Overview</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Real-time overview of system health and performance.</p>
            
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem'}}>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>CPU Usage</span>
                  <span style={{fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>23%</span>
                  <span style={{fontSize: '0.6rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center'}}><ArrowDownRight size={10}/> 5%</span>
               </div>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Memory Usage</span>
                  <span style={{fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>45%</span>
                  <span style={{fontSize: '0.6rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center'}}><ArrowUpRight size={10}/> 2%</span>
               </div>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Disk Usage</span>
                  <span style={{fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>58%</span>
                  <span style={{fontSize: '0.6rem', color: 'var(--accent-red)', display: 'flex', alignItems: 'center'}}><ArrowUpRight size={10}/> 8%</span>
               </div>
               <div style={{display: 'flex', flexDirection: 'column'}}>
                  <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Network I/O</span>
                  <span style={{fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>120 <span style={{fontSize:'0.7rem', fontWeight:'normal'}}>Mbps</span></span>
                  <span style={{fontSize: '0.6rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center'}}><ArrowUpRight size={10}/> 2%</span>
               </div>
            </div>

            <div style={{fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.5rem'}}>System Load (Last 24 Hours)</div>
            <div style={{width: '100%', height: '120px', position: 'relative', display: 'flex'}}>
               <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'space-between', fontSize: '0.55rem', color: 'var(--text-secondary)', paddingRight: '0.5rem', borderRight: '1px solid rgba(255,255,255,0.1)'}}>
                 <span>100%</span><span>75%</span><span>50%</span><span>25%</span><span>0%</span>
               </div>
               <div style={{flex: 1, position: 'relative', overflow: 'hidden', paddingLeft: '0.2rem'}}>
                 {/* Chart approximation */}
                 <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100" style={{position: 'absolute', bottom: 0}}>
                   <path d="M0,80 L10,75 L20,78 L30,60 L40,65 L50,45 L60,50 L70,30 L80,35 L90,20 L100,25" fill="none" stroke="var(--accent-purple)" strokeWidth="2" />
                   <path d="M0,80 L10,75 L20,78 L30,60 L40,65 L50,45 L60,50 L70,30 L80,35 L90,20 L100,25 L100,100 L0,100 Z" fill="rgba(168, 85, 247, 0.1)" />
                 </svg>
               </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.55rem', color: 'var(--text-secondary)', marginTop: '0.3rem', marginLeft: '2rem'}}>
               <span>10 AM</span><span>2 PM</span><span>6 PM</span><span>10 PM</span><span>2 AM</span><span>6 AM</span><span>10 AM</span>
            </div>
          </div>

          <div className="glass-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>4.</span> Resource Utilization</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Detailed resource utilization by server.</p>
               </div>
               <select className="select-input" style={{width: '90px', padding: '0.2rem 0.4rem', fontSize: '0.65rem'}}><option>Last 24 Hours</option></select>
            </div>
            
            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Server Name</th>
                   <th>CPU</th>
                   <th>Memory</th>
                   <th>Disk</th>
                   <th>Network</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'SOC-NODE-01', cpu: 23, mem: 52, disk: 65, net: 50},
                   {name: 'SOC-NODE-02', cpu: 67, mem: 83, disk: 71, net: 150},
                   {name: 'SOC-NODE-03', cpu: 31, mem: 49, disk: 55, net: 70},
                   {name: 'SOC-NODE-04', cpu: 18, mem: 24, disk: 45, net: 20},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '30px', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.cpu}%`, background: 'var(--accent-purple)'}}></div></div>
                           <span style={{color: 'var(--text-secondary)'}}>{row.cpu}%</span>
                        </div>
                     </td>
                     <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '30px', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.mem}%`, background: row.mem > 80 ? 'var(--accent-red)' : 'var(--accent-purple)'}}></div></div>
                           <span style={{color: 'var(--text-secondary)'}}>{row.mem}%</span>
                        </div>
                     </td>
                     <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '30px', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.disk}%`, background: 'var(--accent-purple)'}}></div></div>
                           <span style={{color: 'var(--text-secondary)'}}>{row.disk}%</span>
                        </div>
                     </td>
                     <td>
                        <div style={{display: 'flex', alignItems: 'center', gap: '0.3rem'}}>
                           <div style={{height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', width: '30px', overflow: 'hidden'}}><div style={{height: '100%', width: `${row.net}%`, background: 'var(--accent-purple)'}}></div></div>
                           <span style={{color: 'var(--text-secondary)'}}>{row.net} <span style={{fontSize:'0.55rem'}}>Mbps</span></span>
                        </div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View Resource Details</span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Services Status</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Monitor all system services and their current status.</p>
            
            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Service Name</th>
                   <th style={{textAlign: 'center'}}>Status</th>
                   <th>Uptime</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'AI Inference Service', status: 'Healthy', sCol: 'var(--accent-green)', uptime: '15d 4h 32m'},
                   {name: 'Alert Service', status: 'Healthy', sCol: 'var(--accent-green)', uptime: '15d 4h 32m'},
                   {name: 'Data Ingestion Service', status: 'Healthy', sCol: 'var(--accent-green)', uptime: '15d 4h 32m'},
                   {name: 'Database Service', status: 'Healthy', sCol: 'var(--accent-green)', uptime: '15d 4h 32m'},
                   {name: 'Analytics Engine', status: 'Warning', sCol: '#f59e0b', uptime: '304h 12m'},
                   {name: 'Notification Service', status: 'Healthy', sCol: 'var(--accent-green)', uptime: '15d 4h 32m'},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{textAlign: 'center'}}><span style={{color: row.sCol}}>{row.status}</span></td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.uptime}</td>
                     <td style={{textAlign: 'right'}}>
                        <RefreshCw size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View All Services</span>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Integrations Health</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Health status of external integrations.</p>
            
            <table className="settings-table" style={{fontSize: '0.65rem'}}>
               <thead>
                 <tr>
                   <th>Integration Name</th>
                   <th style={{textAlign: 'center'}}>Status</th>
                   <th>Last Sync</th>
                   <th style={{textAlign: 'right'}}>Actions</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'Microsoft Sentinel', status: 'Connected', sCol: 'var(--accent-green)', sync: '2m ago'},
                   {name: 'Splunk', status: 'Connected', sCol: 'var(--accent-green)', sync: '1m ago'},
                   {name: 'ServiceNow', status: 'Connected', sCol: 'var(--accent-green)', sync: '5m ago'},
                   {name: 'Slack', status: 'Connected', sCol: 'var(--accent-green)', sync: '1m ago'},
                   {name: 'PagerDuty', status: 'Degraded', sCol: '#f59e0b', sync: '15m ago'},
                   {name: 'AWS S3', status: 'Connected', sCol: 'var(--accent-green)', sync: '2m ago'},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem'}}>
                        <div style={{width:'14px', height:'14px', background:'rgba(255,255,255,0.1)', borderRadius:'2px', display:'flex', alignItems:'center', justifyContent:'center'}}>
                           <div style={{width:'8px', height:'8px', background:'rgba(255,255,255,0.5)', borderRadius:'1px'}}></div>
                        </div>
                        {row.name}
                     </td>
                     <td style={{textAlign: 'center'}}><span style={{color: row.sCol}}>{row.status}</span></td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.sync}</td>
                     <td style={{textAlign: 'right'}}>
                        <RefreshCw size={12} style={{cursor:'pointer', color:'var(--text-secondary)'}}/>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>Manage Integrations</span>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>3.</span> System Alerts</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Active system alerts and warnings.</p>
               </div>
               <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View All Alerts &gt;</span>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               {[
                 {title: 'High Memory Usage', desc: 'Memory usage is above 80% on server SOC-NODE-02', time: '10:45 AM', date: 'May 15, 2024', icon: <AlertCircle size={14} color="var(--accent-red)"/>, bg: 'rgba(255,0,60,0.05)'},
                 {title: 'Disk Space Low', desc: 'Disk usage is above 90% on server SOC-NODE-01', time: '09:12 AM', date: 'May 15, 2024', icon: <AlertTriangle size={14} color="#f59e0b"/>, bg: 'rgba(245, 158, 11, 0.05)'},
                 {title: 'Service Restarted', desc: 'Analytics Engine service was restarted', time: '02:45 AM', date: 'May 15, 2024', icon: <Info size={14} color="#3b82f6"/>, bg: 'rgba(59, 130, 246, 0.05)'},
                 {title: 'High CPU Usage', desc: 'CPU usage is above 90% on server SOC-NODE-03', time: '07:30 AM', date: 'May 15, 2024', icon: <AlertTriangle size={14} color="#f59e0b"/>, bg: 'rgba(245, 158, 11, 0.05)'},
                 {title: 'Network Latency High', desc: 'High latency detected in data ingestion pipeline', time: '08:21 AM', date: 'May 14, 2024', icon: <AlertTriangle size={14} color="#f59e0b"/>, bg: 'rgba(245, 158, 11, 0.05)'},
               ].map((alert, i) => (
                 <div key={i} style={{display: 'flex', gap: '0.75rem', padding: '0.75rem', background: alert.bg, borderRadius: '6px', border: '1px solid rgba(255,255,255,0.02)'}}>
                    <div style={{marginTop: '0.1rem'}}>{alert.icon}</div>
                    <div style={{flex: 1}}>
                       <div style={{fontSize: '0.75rem', color: 'var(--text-primary)', marginBottom: '0.2rem'}}>{alert.title}</div>
                       <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>{alert.desc}</div>
                    </div>
                    <div style={{textAlign: 'right'}}>
                       <div style={{fontSize: '0.65rem', color: 'var(--text-primary)'}}>{alert.time}</div>
                       <div style={{fontSize: '0.55rem', color: 'var(--text-secondary)'}}>{alert.date}</div>
                    </div>
                 </div>
               ))}
            </div>
            
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><Settings size={12}/> Configure Alert Rules</span>
            </div>
          </div>

          <div className="glass-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <div>
                 <h3 className="panel-title" style={{color: 'var(--text-primary)', margin: 0}}><span style={{color:'var(--accent-purple)'}}>6.</span> Performance Metrics</h3>
                 <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0'}}>Key performance indicators and trends.</p>
               </div>
               <select className="select-input" style={{width: '90px', padding: '0.2rem 0.4rem', fontSize: '0.65rem'}}><option>Last 7 Days</option></select>
            </div>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               {[
                 {name: 'Events Processed', val: '1.2M', trend: '+12%', tCol: 'var(--accent-green)', chartCol: 'var(--accent-green)'},
                 {name: 'Alerts Generated', val: '8,245', trend: '+5%', tCol: 'var(--accent-green)', chartCol: 'var(--accent-purple)'},
                 {name: 'False Positive Rate', val: '2.45%', trend: '-0.5%', tCol: 'var(--accent-green)', chartCol: 'var(--accent-red)'},
                 {name: 'Avg Response Time', val: '187 ms', trend: '+4 ms', tCol: '#f59e0b', chartCol: 'var(--accent-cyan)'},
                 {name: 'Data Ingestion Rate', val: '2.4 GB/s', trend: '+5%', tCol: 'var(--accent-green)', chartCol: '#f59e0b'},
               ].map((metric, i) => (
                 <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: i === 4 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                    <span style={{fontSize: '0.7rem', color: 'var(--text-primary)', width: '30%'}}>{metric.name}</span>
                    <div style={{width: '40%', height: '20px'}}>
                       {/* Sparkline approximation */}
                       <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 100">
                         <path d="M0,50 Q25,80 50,30 T100,60" fill="none" stroke={metric.chartCol} strokeWidth="3" />
                       </svg>
                    </div>
                    <div style={{width: '30%', textAlign: 'right'}}>
                       <span style={{fontSize: '0.75rem', color: 'white', fontWeight: 'bold', display: 'block'}}>{metric.val}</span>
                       <span style={{fontSize: '0.6rem', color: metric.tCol}}>{metric.trend}</span>
                    </div>
                 </div>
               ))}
            </div>

            <div style={{marginTop: '0.5rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-purple)', cursor: 'pointer'}}>View All Metrics</span>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Reset to Defaults")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Reset to Defaults</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save System Monitoring Settings")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save System Monitoring Settings</button>
          </div>
        </div>
      </div>
    </div>
  );
}
