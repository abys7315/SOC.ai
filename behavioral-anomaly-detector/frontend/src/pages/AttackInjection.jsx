import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  Lock, Plane, Users, Network, Monitor, CloudRain, ShieldAlert,
  Play, Square, RotateCcw, Download, Activity
} from 'lucide-react';
import './AttackInjection.css';

const ATTACK_TYPES = [
  { id: 'brute_force', icon: <Lock size={24}/>, title: 'Brute Force', desc: 'Rapid, repeated failed login attempts from the same source IP.', color: 'var(--accent-red)' },
  { id: 'impossible_travel', icon: <Plane size={24}/>, title: 'Impossible Travel', desc: 'Same entity accessing from geographically distant locations in a short time.', color: '#f59e0b' },
  { id: 'credential_stuffing', icon: <Users size={24}/>, title: 'Credential Stuffing', desc: 'Testing credentials across many accounts using known leaks.', color: '#a855f7' },
  { id: 'lateral_movement', icon: <Network size={24}/>, title: 'Lateral Movement', desc: 'Compromised entity accessing unusual resources or systems.', color: 'var(--accent-green)' },
  { id: 'device_spoofing', icon: <Monitor size={24}/>, title: 'Device Spoofing', desc: 'Entity appears to use a manipulated or new device fingerprint.', color: 'var(--accent-cyan)' },
  { id: 'low_slow', icon: <CloudRain size={24}/>, title: 'Low & Slow Exfiltration', desc: 'Unusual, small data transfers during off-hours over time.', color: '#eab308' }
];

export default function AttackInjection({ alerts = [] }) {
  const [selectedAttack, setSelectedAttack] = useState('brute_force');
  const [isInjecting, setIsInjecting] = useState(false);
  const [toast, setToast] = useState(null);

  const [targetEntities, setTargetEntities] = useState(() => localStorage.getItem('inj_target') || 'All Entities');
  const [intensity, setIntensity] = useState(() => localStorage.getItem('inj_intensity') || 'Medium');
  const [duration, setDuration] = useState(() => localStorage.getItem('inj_duration') || '5 Minutes');
  const [rate, setRate] = useState(() => parseInt(localStorage.getItem('inj_rate')) || 15);
  const [currentInjection, setCurrentInjection] = useState(() => {
    const saved = localStorage.getItem('inj_current');
    return saved ? JSON.parse(saved) : null;
  });
  const [recentInjections, setRecentInjections] = useState(() => {
    const saved = localStorage.getItem('inj_recent');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllInjections, setShowAllInjections] = useState(false);

  React.useEffect(() => {
    localStorage.setItem('inj_target', targetEntities);
    localStorage.setItem('inj_intensity', intensity);
    localStorage.setItem('inj_duration', duration);
    localStorage.setItem('inj_rate', rate);
    localStorage.setItem('inj_current', JSON.stringify(currentInjection));
    localStorage.setItem('inj_recent', JSON.stringify(recentInjections));
  }, [targetEntities, intensity, duration, rate, currentInjection, recentInjections]);

  const handleInject = () => {
    setIsInjecting(true);
    fetch('/api/attack/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        anomaly_type: selectedAttack,
        target_entities: targetEntities,
        intensity: intensity,
        duration: duration,
        rate: rate
      })
    })
    .then(res => res.json())
    .then(data => {
       if (data.status === 'blocked') {
           setToast(`🛑 Injection Blocked! ${data.message}`);
           setTimeout(() => setToast(null), 5000);
           return;
       }
       
       setToast(`Injected ${selectedAttack} successfully! Check dashboard.`);
       setTimeout(() => setToast(null), 4000);
       
       const attackTitle = ATTACK_TYPES.find(a => a.id === selectedAttack)?.title || selectedAttack;
       const startTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
       
       setCurrentInjection({
           attack: attackTitle,
           startedAt: startTime,
           targetEntities: targetEntities,
           rate: rate,
           active: true
       });

       setRecentInjections(prev => [
         { id: Date.now(), attackId: selectedAttack, attack: attackTitle, time: startTime, status: 'Active' },
         ...prev.map(inj => ({...inj, status: 'Completed'}))
       ]);
    })
    .catch(err => {
       console.error("Injection failed", err);
       setToast("Injection failed. Is backend running?");
       setTimeout(() => setToast(null), 4000);
    })
    .finally(() => setIsInjecting(false));
  };

  const handleQuickAction = (actionName) => {
    fetch('/api/generic-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: actionName })
    })
    .then(res => res.json())
    .then(data => {
      setToast(data.message || `Action ${actionName} executed successfully.`);
      setTimeout(() => setToast(null), 3000);
      if (actionName === 'Stop All Injections') {
        if (currentInjection) setCurrentInjection({...currentInjection, active: false});
        setRecentInjections(prev => prev.map(inj => ({...inj, status: 'Completed'})));
      }
    });
  };

  // Use live alerts from the system
  const streamData = alerts.slice(0, 5).map(a => ({
    time: new Date(a.timestamp).toLocaleTimeString(),
    entity: a.entity_id,
    type: 'User',
    ip: a.event_details?.source_ip || '10.10.10.45',
    resource: a.event_details?.action || 'api/login',
    event: a.event_details?.action || 'Anomaly',
    attack: a.anomaly_type,
    risk: Math.round(a.risk_score * 100)
  }));

  return (
    <div className="injection-page">
      <div className="injection-header">
        <div>
          <h2 style={{fontFamily: 'Orbitron', margin: 0, fontSize: '1.25rem'}}>Attack Injection Panel</h2>
          <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0'}}>Simulate real-world attack patterns and inject into the live stream</p>
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
           <div className="live-dot"></div> Live System
        </div>
      </div>

      <div className="injection-layout">
        
        {/* Left Column */}
        <div className="injection-main">
          
          <div className="injection-top-row">
            {/* Attack Types */}
            <div className="glass-panel" style={{flex: '2 1 450px'}}>
              <h3 className="panel-title">1. SELECT ATTACK TYPE TO INJECT</h3>
              <div className="attack-grid">
                {ATTACK_TYPES.map(attack => (
                  <div 
                    key={attack.id} 
                    className={`attack-card ${selectedAttack === attack.id ? 'active' : ''}`}
                    onClick={() => setSelectedAttack(attack.id)}
                    style={{'--theme-color': attack.color}}
                  >
                     <div className="attack-card-icon" style={{color: attack.color, borderColor: attack.color}}>{attack.icon}</div>
                     <div className="attack-card-content">
                       <h4>{attack.title}</h4>
                       <p>{attack.desc}</p>
                     </div>
                     <button className="btn-select">Select</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="glass-panel" style={{flex: '1 1 250px'}}>
              <h3 className="panel-title">2. INJECTION CONTROLS</h3>
              
              <div className="control-group">
                <label>Injection Settings</label>
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Target Entities</div>
                <select className="control-select" value={targetEntities} onChange={(e) => setTargetEntities(e.target.value)}>
                  <option>All Entities</option>
                  <option>Specific Entity (usr_8f2a1)</option>
                  <option>Random Subset</option>
                </select>
                
                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem'}}>Intensity / Severity</div>
                <select className="control-select" value={intensity} onChange={(e) => setIntensity(e.target.value)}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>

                <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.75rem'}}>Duration</div>
                <select className="control-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option>1 Minute</option>
                  <option>5 Minutes</option>
                  <option>15 Minutes</option>
                  <option>Continuous</option>
                </select>
              </div>

              <div className="control-group" style={{marginTop: '1.5rem'}}>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <label>Rate (events/sec)</label>
                  <span style={{color: 'var(--accent-cyan)', fontSize: '0.8rem'}}>{rate}</span>
                </div>
                <input type="range" min="1" max="100" value={rate} onChange={(e) => setRate(parseInt(e.target.value))} className="control-slider" />
              </div>

              <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                <button 
                  className="btn-solid-red" 
                  style={{flex: 2, opacity: isInjecting ? 0.7 : 1}}
                  onClick={handleInject}
                  disabled={isInjecting}
                >
                  <Activity size={16}/> {isInjecting ? 'Injecting...' : 'Inject Attack'}
                </button>
                <button className="btn-outline" style={{flex: 1}}>Reset</button>
              </div>
              <button className="btn-outline" style={{width: '100%', marginTop: '1rem', borderColor: 'var(--accent-red)', color: 'var(--accent-red)'}} onClick={() => handleQuickAction('Stop All Injections')}>
                <Square size={14}/> Stop All Injections
              </button>
            </div>
          </div>

          {/* Stream Preview */}
          <div className="glass-panel" style={{flex: 1}}>
             <h3 className="panel-title" style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
               3. LIVE INJECTION STREAM PREVIEW 
               <span style={{fontSize: '0.75rem', color: 'var(--accent-green)', display: 'flex', alignItems: 'center', gap: '0.4rem'}}><div className="live-dot"></div> Live</span>
             </h3>
             <div className="table-container">
               <table className="alerts-table" style={{marginTop: '0'}}>
                 <thead>
                   <tr>
                     <th>Time</th>
                     <th>Entity ID</th>
                     <th>Entity Type</th>
                     <th>Source IP</th>
                     <th>Resource</th>
                     <th>Event Type</th>
                     <th>Attack Type</th>
                     <th>Risk Score</th>
                   </tr>
                 </thead>
                 <tbody>
                   {streamData.map((row, i) => (
                     <tr key={i}>
                       <td>{row.time}</td>
                       <td>{row.entity}</td>
                       <td>{row.type}</td>
                       <td>{row.ip}</td>
                       <td>{row.resource}</td>
                       <td>{row.event}</td>
                       <td style={{color: 'var(--accent-red)'}}>{row.attack}</td>
                       <td><div className="score-ring" style={{color: 'var(--accent-red)', borderColor: 'var(--accent-red)', width: '24px', height: '24px', fontSize: '0.65rem'}}>{row.risk}</div></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
                <span style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Activity size={14}/> Streaming live events from generator to detection engine...</span>
                <span>Total Events (Today): <strong style={{color: 'white'}}>12,458</strong> &nbsp;&nbsp;&nbsp; Anomalous Events: <strong style={{color: 'var(--accent-red)'}}>356 (2.86%)</strong></span>
             </div>
          </div>

        </div>

        {/* Right Sidebar */}
        <div className="injection-sidebar">
           
           <div className="glass-panel">
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <h3 className="panel-title" style={{margin: 0}}>LIVE INJECTION STATUS</h3>
               <span className="status-badge" style={{color: currentInjection?.active ? 'var(--accent-green)' : 'var(--text-secondary)', borderColor: currentInjection?.active ? 'var(--accent-green)' : 'var(--text-secondary)', background: 'transparent'}}>{currentInjection?.active ? 'Running' : 'Idle'}</span>
             </div>
             
             <div className="status-row"><span>Current Attack</span> <span style={{color: 'var(--accent-red)'}}>{currentInjection ? currentInjection.attack : 'None'}</span></div>
             <div className="status-row"><span>Started At</span> <span>{currentInjection ? currentInjection.startedAt : '--'}</span></div>
             <div className="status-row"><span>Elapsed Time</span> <span>{currentInjection ? '00:00:00' : '--'}</span></div>
             <div className="status-row"><span>Events Injected</span> <span>{currentInjection ? (currentInjection.rate * 5) : '--'}</span></div>
             <div className="status-row"><span>Target Entities</span> <span>{currentInjection ? currentInjection.targetEntities : '--'}</span></div>
             <div className="status-row"><span>Events / Sec</span> <span>{currentInjection ? currentInjection.rate : '--'}</span></div>
             <div className="status-row"><span>Status</span> <span style={{color: currentInjection?.active ? 'var(--accent-green)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.3rem'}}><div className={currentInjection?.active ? "live-dot" : ""}></div> {currentInjection?.active ? 'Active' : 'Idle'}</span></div>

             <div style={{marginTop: '1.5rem', height: '100px'}}>
                <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Events injected (per sec)</div>
                <Plot
                  data={[{
                    y: [12, 14, 13, 15, 12, 13, 14, 13, 15, 12, 14, 13, 14, 15, 12, 13, 14, 12, 13],
                    type: 'scatter', mode: 'lines+markers', line: { color: 'var(--accent-red)', width: 2 }, marker: {size: 4}
                  }]}
                  layout={{
                    autosize: true, margin: { t: 0, b: 20, l: 20, r: 0 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                    xaxis: { showgrid: false, color: '#8b9bb4' }, yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{width: '100%', height: '100%'}}
                />
             </div>
           </div>

           <div className="glass-panel">
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
               <h3 className="panel-title" style={{margin: 0}}>RECENT INJECTIONS</h3>
               <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}} onClick={() => setShowAllInjections(true)}>View All</span>
             </div>
             
             <div className="recent-list">
               {recentInjections.length === 0 && <div className="empty-state">No recent injections</div>}
               {recentInjections.slice(0, 4).map((inj) => {
                 const iconProps = { size: 14, color: ATTACK_TYPES.find(a => a.id === inj.attackId)?.color || 'var(--text-secondary)' };
                 const Icon = ATTACK_TYPES.find(a => a.id === inj.attackId)?.icon?.type || ShieldAlert;
                 return (
                   <div className="recent-item" key={inj.id}>
                     <Icon {...iconProps}/>
                     <div className="recent-info"><span>{inj.attack}</span><span className="time">{inj.time}</span></div>
                     <span className={`recent-status ${inj.status === 'Active' ? 'active' : ''}`}>{inj.status}</span>
                   </div>
                 );
               })}
             </div>
           </div>

           <div className="glass-panel">
             <h3 className="panel-title">QUICK ACTIONS</h3>
             <div className="quick-actions-grid">
               <div className="action-btn" onClick={() => handleQuickAction('Start Stream')}><Play size={20} color="var(--accent-green)"/> <span>Start Stream</span></div>
               <div className="action-btn" onClick={() => handleQuickAction('Pause Stream')}><Square size={20} color="#f59e0b"/> <span>Pause Stream</span></div>
               <div className="action-btn" onClick={() => handleQuickAction('Reset Simulator')}><RotateCcw size={20} color="var(--accent-cyan)"/> <span>Reset Simulator</span></div>
               <div className="action-btn" onClick={() => handleQuickAction('Export Logs')}><Download size={20} color="#a855f7"/> <span>Export Logs</span></div>
             </div>
             <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '4px'}}>
               <ShieldAlert size={14} color="var(--accent-cyan)" style={{flexShrink: 0}}/>
               <span>Injection is only for simulation and testing purposes. No real systems are affected.</span>
             </div>
           </div>

        </div>

      </div>
      
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
          border: '1px solid var(--accent-red)', borderRadius: '8px',
          padding: '1rem 1.5rem', color: 'white', display: 'flex',
          alignItems: 'center', gap: '0.75rem', zIndex: 9999,
          boxShadow: '0 10px 30px rgba(255, 0, 60, 0.2)'
        }}>
          <ShieldAlert size={16} color="var(--accent-red)"/>
          <span style={{fontSize: '0.85rem'}}>{toast}</span>
        </div>
      )}

      {/* View All Injections Modal */}
      {showAllInjections && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
          <div className="glass-panel" style={{padding: '2rem', maxWidth: '600px', width: '100%', position: 'relative', maxHeight: '80vh', display: 'flex', flexDirection: 'column'}}>
            <button className="mobile-close-btn" style={{position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer'}} onClick={() => setShowAllInjections(false)}>✕</button>
            <h2 style={{margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontFamily: 'Orbitron'}}>Injection History</h2>
            <div style={{overflowY: 'auto', flex: 1, paddingRight: '1rem'}}>
              {recentInjections.length === 0 ? (
                 <div className="empty-state">No injections recorded yet.</div>
              ) : (
                recentInjections.map(inj => {
                   const iconProps = { size: 16, color: ATTACK_TYPES.find(a => a.id === inj.attackId)?.color || 'var(--text-secondary)' };
                   const Icon = ATTACK_TYPES.find(a => a.id === inj.attackId)?.icon?.type || ShieldAlert;
                   return (
                     <div key={inj.id} style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)'}}>
                        <Icon {...iconProps} />
                        <div style={{flex: 1}}>
                           <div style={{fontWeight: 'bold'}}>{inj.attack}</div>
                           <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{inj.time}</div>
                        </div>
                        <span className={`recent-status ${inj.status === 'Active' ? 'active' : ''}`}>{inj.status}</span>
                     </div>
                   );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
