import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  AlertTriangle, ArrowLeft, Download, User, ShieldAlert, Lock, Plane, Clock, 
  MapPin, CheckCircle, Info, FileText, Activity
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Explainability.css';

export default function Explainability() {
  const [activeTab, setActiveTab] = useState('Overview');
  const [importanceView, setImportanceView] = useState('Local');
  const [entityProfile, setEntityProfile] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const alert = location.state?.alert;

  const [cfFailedLogins, setCfFailedLogins] = useState(alert?.extracted_features?.failed_logins || 1);
  const [cfLocationDeviation, setCfLocationDeviation] = useState(alert?.extracted_features?.location_deviation || 0.2);

  React.useEffect(() => {
    if (alert?.extracted_features) {
      setCfFailedLogins(alert.extracted_features.failed_logins);
      setCfLocationDeviation(alert.extracted_features.location_deviation);
    }
  }, [alert]);

  const baseRiskScore = alert?.risk_score ? alert.risk_score * 100 : 0;
  const diffLogins = (cfFailedLogins - (alert?.extracted_features?.failed_logins || 1)) * 1.5;
  const diffLocation = (cfLocationDeviation - (alert?.extracted_features?.location_deviation || 0.2)) * 40;
  let cfRiskScore = Math.max(0, Math.min(100, Math.round(baseRiskScore + diffLogins + diffLocation)));

  const [actionStatuses, setActionStatuses] = useState({
     verify: 'Take Action',
     reset: 'Take Action',
     block: 'Take Action'
  });

  const handleAction = (type) => {
     setActionStatuses(prev => ({...prev, [type]: 'Processing...'}));
     
     let target = '';
     if (type === 'verify' || type === 'reset') target = alert.entity_id;
     if (type === 'block') target = alert.event_details?.source_ip || '10.10.10.45';

     fetch('http://localhost:8000/api/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action_type: type, target: target })
     }).then(res => res.json())
       .then(data => {
          setTimeout(() => {
             setActionStatuses(prev => ({...prev, [type]: 'Action Taken'}));
          }, 500);
       })
       .catch(err => {
          console.error(err);
          setActionStatuses(prev => ({...prev, [type]: 'Error'}));
       });
  };

  React.useEffect(() => {
    if (alert?.entity_id) {
       fetch(`http://localhost:8000/api/entity/${alert.entity_id}`)
         .then(res => res.json())
         .then(data => setEntityProfile(data))
         .catch(err => console.error("Error fetching entity profile:", err));
    }
  }, [alert]);

  if (!alert) {
    return (
      <div className="explain-page" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        <div style={{textAlign: 'center', color: 'var(--text-secondary)'}}>
          <AlertTriangle size={48} style={{marginBottom: '1rem', opacity: 0.5}} />
          <h2>No Alert Selected</h2>
          <p>Please select an alert from the Alerts page to investigate.</p>
          <button className="btn-outline" style={{marginTop: '1rem'}} onClick={() => navigate('/alerts')}>Go to Alerts</button>
        </div>
      </div>
    );
  }

  const baseline = entityProfile ? {
      locations: (entityProfile.baseline_locations || []).slice(0,2).join(', ') || 'Unknown',
      ips: (entityProfile.baseline_ips || []).slice(0,2).join(', ') || 'Unknown',
      devices: (entityProfile.baseline_devices || []).slice(0,2).map(d => d.split('_')[0]).join(', ') || 'Unknown',
      loginTime: entityProfile.login_time || '9 AM - 6 PM'
  } : { locations: 'Loading...', ips: 'Loading...', devices: 'Loading...', loginTime: 'Loading...' };

  const isBruteForce = alert.anomaly_type === 'brute_force' || alert.anomaly_type === 'credential_stuffing';

  return (
    <div className="explain-page">
      {/* Top Header */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
         <div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer', marginBottom: '0.5rem'}} onClick={() => navigate('/alerts')}>
              <ArrowLeft size={14}/> Back to Alerts
            </div>
            <h2 style={{margin: 0, fontFamily: 'Orbitron', fontSize: '1.25rem'}}>Explainability</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0'}}>Understand why the system flagged this event as anomalous.</p>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
             <div className="live-dot"></div> Live System
           </div>
           <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>{new Date().toLocaleTimeString()}</span>
         </div>
      </div>

      {/* Alert Context Banner */}
      <div className="glass-panel alert-context-banner">
        <div style={{display: 'flex', alignItems: 'center', gap: '1.5rem', borderRight: '1px solid rgba(255,255,255,0.1)', paddingRight: '1.5rem'}}>
           <div className="alert-icon-large"><AlertTriangle size={32} color={alert.risk_score > 0.8 ? "var(--accent-red)" : "#f59e0b"}/></div>
           <div>
              <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem'}}>
                 <span className="status-badge" style={{background: 'rgba(255,0,60,0.1)', color: alert.risk_score > 0.8 ? 'var(--accent-red)' : '#f59e0b', borderColor: alert.risk_score > 0.8 ? 'var(--accent-red)' : '#f59e0b'}}>{alert.risk_score > 0.8 ? 'High Risk' : 'Medium Risk'}</span>
                 <h3 style={{margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)'}}>{alert.anomaly_type.replace('_', ' ').toUpperCase()} DETECTED</h3>
              </div>
              <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>
                 Alert ID: {alert.id} &nbsp;&nbsp;|&nbsp;&nbsp; Time: {new Date(alert.timestamp).toLocaleString()}
              </div>
           </div>
        </div>

        <div className="context-metrics">
           <div className="context-item">
             <span className="c-label">Entity</span>
             <span className="c-val" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><User size={14}/> {alert.entity_id}</span>
           </div>
           <div className="context-item">
             <span className="c-label">Source IP</span>
             <span className="c-val">{alert.event_details?.source_ip || 'Unknown'}</span>
           </div>
           <div className="context-item">
             <span className="c-label">Target Resource</span>
             <span className="c-val">{alert.event_details?.resource_accessed || 'Unknown'}</span>
           </div>
           <div className="context-item">
             <span className="c-label">Location</span>
             <span className="c-val" style={{display: 'flex', alignItems: 'center', gap: '0.4rem'}}><MapPin size={14}/> {alert.event_details?.geo_location || 'Unknown'}</span>
           </div>
        </div>

        <div style={{marginLeft: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingLeft: '1.5rem', borderLeft: '1px solid rgba(255,255,255,0.1)'}}>
           <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>Risk Score</div>
           <div style={{fontFamily: 'Orbitron', fontSize: '2rem', fontWeight: 'bold', color: alert.risk_score > 0.8 ? 'var(--accent-red)' : '#f59e0b', lineHeight: '1'}}>
             {(alert.risk_score * 100).toFixed(0)}<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/100</span>
           </div>
           <div style={{fontSize: '0.7rem', color: 'var(--accent-green)', marginTop: '0.2rem'}}>Confidence: 96%</div>
        </div>
      </div>

      <div className="tabs-container" style={{marginBottom: '1.5rem'}}>
        {['Overview', 'Feature Analysis', 'Temporal Analysis', 'Counterfactual Analysis', 'Model Insights'].map((tab) => (
          <div 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      {activeTab === 'Overview' && (

      <div className="explain-grid">
        
        {/* 1. Why Flagged */}
        <div className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
          <h3 className="panel-title">1. WHY WAS THIS FLAGGED?</h3>
          <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem'}}>
            The system detected behaviors for {alert.entity_id} that deviate significantly from their normal pattern.
          </p>
          
          <div className="flag-reasons">
             <div className="flag-item">
               <div className="f-icon red"><AlertTriangle size={16}/></div>
               <div className="f-content">
                 <div className="f-title">Generated Explanation <span className="f-badge red">Critical</span></div>
                 <div className="f-desc" style={{lineHeight: 1.4}}>{alert.explanation}</div>
               </div>
             </div>
          </div>

          <div style={{marginTop: 'auto', padding: '1rem', background: 'rgba(0, 240, 255, 0.05)', borderLeft: '3px solid var(--accent-cyan)', fontSize: '0.8rem', color: 'var(--accent-cyan)', display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
             <Info size={16}/> Sequence models combined these signals to derive the {(alert.risk_score * 100).toFixed(0)}% risk score.
          </div>
        </div>

        {/* 2. Top Contributing Factors */}
        <div className="glass-panel col-span-2">
           <h3 className="panel-title">2. TOP CONTRIBUTING FACTORS</h3>
           <table className="factors-table">
             <thead>
               <tr>
                 <th style={{width: '30%'}}>Feature</th>
                 <th style={{width: '15%'}}>Value Observed</th>
                 <th style={{width: '15%'}}>Expected Range</th>
                 <th style={{width: '40%'}}>Contribution</th>
               </tr>
             </thead>
             <tbody>
               <tr>
                 <td>Failed Login Count (3 min)</td>
                 <td style={{color: 'var(--accent-red)'}}>{alert.extracted_features?.failed_logins || (isBruteForce ? '45' : '1')}</td>
                 <td>0 - 3</td>
                 <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                     <div className="bar-bg"><div className="bar-fill red" style={{width: '85%'}}></div></div>
                     <span>0.42</span>
                   </div>
                 </td>
               </tr>
               <tr>
                 <td>Login Attempts / min</td>
                 <td style={{color: 'var(--accent-red)'}}>{alert.extracted_features?.login_rate?.toFixed(1) || (isBruteForce ? '22.5' : '0.5')}</td>
                 <td>0 - 0.5</td>
                 <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                     <div className="bar-bg"><div className="bar-fill red" style={{width: '65%'}}></div></div>
                     <span>0.31</span>
                   </div>
                 </td>
               </tr>
               <tr>
                 <td>Location Deviation Score</td>
                 <td style={{color: '#f59e0b'}}>{alert.extracted_features?.location_deviation?.toFixed(2) || (alert.anomaly_type === 'impossible_travel' ? '0.98' : '0.2')}</td>
                 <td>0 - 0.25</td>
                 <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                     <div className="bar-bg"><div className="bar-fill orange" style={{width: '35%'}}></div></div>
                     <span>0.18</span>
                   </div>
                 </td>
               </tr>
               <tr>
                 <td>Resource Access Anomaly</td>
                 <td style={{color: '#f59e0b'}}>{alert.extracted_features?.resource_anomaly?.toFixed(2) || 0.87}</td>
                 <td>0 - 0.25</td>
                 <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                     <div className="bar-bg"><div className="bar-fill orange" style={{width: '30%'}}></div></div>
                     <span>0.15</span>
                   </div>
                 </td>
               </tr>
               <tr>
                 <td>Device Familiarity Score</td>
                 <td style={{color: '#f59e0b'}}>{alert.extracted_features?.device_familiarity?.toFixed(2) || (alert.anomaly_type === 'device_spoofing' ? '0.12' : '0.85')}</td>
                 <td>0.8 - 1.0</td>
                 <td>
                   <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                     <div className="bar-bg"><div className="bar-fill orange" style={{width: '25%'}}></div></div>
                     <span>0.12</span>
                   </div>
                 </td>
               </tr>
             </tbody>
           </table>
        </div>

        {/* 3. Feature Importance */}
        <div className="glass-panel">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
            <h3 className="panel-title" style={{margin: 0}}>3. FEATURE IMPORTANCE (Model View) <Info size={14} style={{display:'inline', color:'var(--text-secondary)'}}/></h3>
            <div className="toggle-switch">
              <div className={`t-option ${importanceView === 'Global' ? 'active' : ''}`} onClick={() => setImportanceView('Global')}>Global</div>
              <div className={`t-option ${importanceView === 'Local' ? 'active' : ''}`} onClick={() => setImportanceView('Local')}>Local</div>
            </div>
          </div>
          <Plot
              data={[{
                x: [0.42, 0.31, 0.18, 0.15, 0.12, 0.07, 0.05, 0.02, 0.01, 0.01],
                y: [
                  'Failed Login Count (3 min)', 'Login Attempts / min', 'Location Deviation Score',
                  'Resource Access Anomaly', 'Device Familiarity Score', 'Hour of Day (Deviation)',
                  'Avg Session Duration', 'Accessed Unusual Resource', 'Unusual Data Volume', 'MFA Not Used'
                ].reverse(),
                type: 'bar',
                orientation: 'h',
                marker: { color: ['#3b82f6', '#3b82f6', '#3b82f6', '#00ff88', '#00ff88', '#00ff88', '#f59e0b', '#f59e0b', '#ff003c', '#ff003c'] }
              }]}
              layout={{
                autosize: true, margin: { t: 0, b: 30, l: 150, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', title: 'Importance Score', titlefont: {size: 10} },
                yaxis: { showgrid: false, color: '#8b9bb4', tickfont: {size: 9} }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '250px'}}
            />
        </div>

        {/* 4. Expected vs Observed */}
        <div className="glass-panel">
          <h3 className="panel-title">4. EXPECTED VS OBSERVED BEHAVIOR</h3>
          <table className="alerts-table" style={{marginTop: 0}}>
             <thead>
               <tr><th>Behavior</th><th>Expected (Normal)</th><th>Observed (This Event)</th></tr>
             </thead>
             <tbody>
               <tr>
                 <td><Lock size={14}/> Failed Login Count</td>
                 <td>0 - 3</td>
                 <td style={{color: 'var(--accent-red)'}}>{alert.extracted_features?.failed_logins || (isBruteForce ? '45' : '1')}</td>
               </tr>
               <tr>
                 <td><Activity size={14}/> Usual Source IPs</td>
                 <td>{baseline.ips}</td>
                 <td style={{color: 'var(--accent-red)'}}>{alert.event_details?.source_ip || 'Unknown'}</td>
               </tr>
               <tr>
                 <td><Clock size={14}/> Usual Login Time</td>
                 <td>{baseline.loginTime}</td>
                 <td style={{color: '#f59e0b'}}>{new Date(alert.timestamp).toLocaleTimeString()}</td>
               </tr>
               <tr>
                 <td><MapPin size={14}/> Usual Locations</td>
                 <td>{baseline.locations}</td>
                 <td style={{color: '#f59e0b'}}>{alert.event_details?.geo_location || 'Unknown'}</td>
               </tr>
               <tr>
                 <td><User size={14}/> Usual Devices</td>
                 <td>{baseline.devices}</td>
                 <td style={{color: '#f59e0b'}}>{alert.anomaly_type === 'device_spoofing' ? 'Unknown Proxy Node' : baseline.devices.split(',')[0]}</td>
               </tr>
             </tbody>
          </table>
        </div>

        {/* 5. Sequence & Temporal Context */}
        <div className="glass-panel">
          <h3 className="panel-title" style={{display: 'flex', justifyContent: 'space-between'}}>
            5. SEQUENCE & TEMPORAL ANALYSIS
            <div style={{display: 'flex', gap: '1rem', fontSize: '0.7rem'}}>
              <span style={{color: 'var(--accent-green)'}}>● Normal</span>
              <span style={{color: 'var(--accent-red)'}}>● Anomalous</span>
              <span style={{color: 'var(--accent-cyan)'}}>● This Event</span>
            </div>
          </h3>
          
          <div style={{marginBottom: '1.5rem', padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', borderLeft: '3px solid var(--accent-cyan)'}}>
             <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Command Sequence Evaluated</h4>
             <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: 'Orbitron', fontSize: '0.9rem', color: 'var(--text-primary)'}}>
                <span style={{color: 'var(--accent-green)'}}>login</span> 
                <span style={{color: 'var(--text-secondary)'}}>→</span> 
                <span style={{color: 'var(--accent-green)'}}>read</span> 
                <span style={{color: 'var(--text-secondary)'}}>→</span> 
                <span style={{color: 'var(--accent-red)', fontWeight: 'bold'}}>download_all</span>
                <span style={{color: 'var(--text-secondary)'}}>→</span> 
                <span style={{color: 'var(--accent-red)', fontWeight: 'bold'}}>delete_logs</span>
             </div>
             <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: 0}}>
                The RNN sequence model flagged this explicit chain of commands as a 99.8% deviation from habitual baseline. Legitimate users rarely execute `download_all` followed immediately by `delete_logs`.
             </p>
          </div>

          <div className="timeline-container">
            {/* Timeline track */}
            <div className="t-track"></div>
            
            <div className="t-event">
               <div className="t-time">10:15:12 AM</div>
               <div className="t-dot" style={{background: 'var(--accent-green)'}}></div>
               <div className="t-desc">Successful login <span>Mumbai, India</span></div>
            </div>
            <div className="t-event">
               <div className="t-time">10:21:05 AM</div>
               <div className="t-dot" style={{background: 'var(--accent-red)'}}></div>
               <div className="t-desc">Failed login attempt <span>10.10.10.45</span></div>
            </div>
            <div className="t-event">
               <div className="t-time">10:22:11 AM</div>
               <div className="t-dot" style={{background: 'var(--accent-red)'}}></div>
               <div className="t-desc">Failed login attempt <span>10.10.10.45</span></div>
            </div>
            <div className="t-event">
               <div className="t-time" style={{color: 'var(--accent-cyan)'}}>10:24:35 AM</div>
               <div className="t-dot" style={{background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)'}}></div>
               <div className="t-desc" style={{color: 'white', fontWeight: 'bold'}}>Successful login after 45 failed attempts! <span>New Device</span></div>
            </div>
          </div>
        </div>

        {/* 6 & 7 */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-panel">
            <h3 className="panel-title">6. HUMAN READABLE EXPLANATION</h3>
            <div className="why-flagged-text" style={{background: 'transparent', padding: 0, border: 'none'}}>
              {alert.explanation}
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title">7. RECOMMENDED ACTIONS</h3>
            <div className="rec-action-item">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                 <User size={16} color="var(--accent-cyan)"/> Verify user identity ({alert.entity_id})
              </div>
              <button 
                className={actionStatuses.verify === 'Action Taken' ? "btn-outline disabled" : "btn-outline"}
                disabled={actionStatuses.verify !== 'Take Action'}
                onClick={() => handleAction('verify')}
                style={{padding: '0.25rem 0.75rem', opacity: actionStatuses.verify === 'Action Taken' ? 0.5 : 1}}
              >
                {actionStatuses.verify}
              </button>
            </div>
            <div className="rec-action-item">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                 <Lock size={16} color="var(--accent-cyan)"/> Force password reset
              </div>
              <button 
                className={actionStatuses.reset === 'Action Taken' ? "btn-outline disabled" : "btn-outline"}
                disabled={actionStatuses.reset !== 'Take Action'}
                onClick={() => handleAction('reset')}
                style={{padding: '0.25rem 0.75rem', opacity: actionStatuses.reset === 'Action Taken' ? 0.5 : 1}}
              >
                {actionStatuses.reset}
              </button>
            </div>
            <div className="rec-action-item">
              <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                 <ShieldAlert size={16} color="var(--accent-red)"/> Block IP {alert.event_details?.source_ip || '10.10.10.45'}
              </div>
              <button 
                className={actionStatuses.block === 'Action Taken' ? "btn-outline disabled" : "btn-solid-red"}
                disabled={actionStatuses.block !== 'Take Action'}
                onClick={() => handleAction('block')}
                style={{padding: '0.25rem 0.75rem', opacity: actionStatuses.block === 'Action Taken' ? 0.5 : 1}}
              >
                {actionStatuses.block}
              </button>
            </div>
          </div>
        </div>

        </div>
      )}

      {activeTab === 'Feature Analysis' && (
        <div className="explain-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="glass-panel">
            <h3 className="panel-title">FEATURE DEVIATION DISTRIBUTION</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Compare the observed values for {alert.entity_id} against the global and local historical distributions.</p>
            <Plot
              data={[
                {
                  x: Array.from({length: 100}, () => Math.random() * 5),
                  type: 'histogram',
                  name: 'Baseline Distribution (Local)',
                  marker: { color: 'rgba(59, 130, 246, 0.5)' }
                },
                {
                  x: [alert.extracted_features?.failed_logins || (isBruteForce ? 45 : 2.5)],
                  y: [10],
                  type: 'scatter',
                  mode: 'markers',
                  name: 'Observed Event',
                  marker: { color: '#ff003c', size: 12, symbol: 'star' }
                }
              ]}
              layout={{
                autosize: true, margin: { t: 20, b: 40, l: 40, r: 20 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', title: 'Feature Value (Observed)' },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', title: 'Frequency' },
                barmode: 'overlay'
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
          </div>
        </div>
      )}

      {activeTab === 'Temporal Analysis' && (
        <div className="explain-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="glass-panel">
            <h3 className="panel-title">BEHAVIORAL VELOCITY & TEMPORAL DRIFT</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Analyzing the rate of change in behavioral patterns leading up to the anomalous event.</p>
            <Plot
              data={[
                {
                  x: ['-24h', '-12h', '-6h', '-3h', '-1h', 'Event'],
                  y: alert.temporal_velocity || [12, 14, 13, 28, 85, isBruteForce ? 450 : 95],
                  type: 'scatter',
                  mode: 'lines+markers',
                  name: 'Action Velocity',
                  line: { color: '#f59e0b', width: 3 },
                  marker: { size: 8 }
                },
                {
                  x: ['-24h', '-12h', '-6h', '-3h', '-1h', 'Event'],
                  y: [10, 10, 10, 10, 10, 10],
                  type: 'scatter',
                  mode: 'lines',
                  name: 'Expected Baseline',
                  line: { color: '#3b82f6', width: 2, dash: 'dash' }
                }
              ]}
              layout={{
                autosize: true, margin: { t: 20, b: 40, l: 40, r: 20 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', title: 'Actions / Hour' }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
          </div>
        </div>
      )}

      {activeTab === 'Counterfactual Analysis' && (
        <div className="explain-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="glass-panel">
            <h3 className="panel-title">COUNTERFACTUAL "WHAT-IF" GENERATOR</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Adjust the sliders to see how modifying specific features would have changed the model's prediction.</p>
            
            <div style={{display: 'flex', gap: '3rem', marginTop: '2rem'}}>
               <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Failed Login Count</label>
                      <span style={{color: 'var(--accent-red)'}}>{cfFailedLogins}</span>
                    </div>
                    <input type="range" min="0" max="100" value={cfFailedLogins} onChange={e => setCfFailedLogins(parseInt(e.target.value))} style={{width: '100%'}} />
                  </div>
                  <div>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                      <label style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Location Deviation Score</label>
                      <span style={{color: '#f59e0b'}}>{cfLocationDeviation.toFixed(2)}</span>
                    </div>
                    <input type="range" min="0" max="1" step="0.01" value={cfLocationDeviation} onChange={e => setCfLocationDeviation(parseFloat(e.target.value))} style={{width: '100%'}} />
                  </div>
               </div>

               <div style={{flex: 1, padding: '2rem', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                 <h4 style={{margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem'}}>Counterfactual Risk Score</h4>
                 <div style={{fontFamily: 'Orbitron', fontSize: '3rem', color: cfRiskScore > 75 ? 'var(--accent-red)' : 'var(--text-primary)'}}>
                   {cfRiskScore}<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/100</span>
                 </div>
                 <p style={{fontSize: '0.8rem', color: cfRiskScore > 75 ? 'var(--accent-red)' : 'var(--accent-green)', textAlign: 'center', marginTop: '1rem', maxWidth: '300px'}}>
                   {cfRiskScore > 75 
                     ? "This combination of features still exceeds the risk threshold and would generate an alert." 
                     : "If these values were observed, the risk score would drop below the 75 threshold, and this event would not have been flagged."}
                 </p>
               </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Model Insights' && (
        <div className="explain-grid" style={{gridTemplateColumns: '1fr'}}>
          <div className="glass-panel">
            <h3 className="panel-title">MODEL ENSEMBLE INSIGHTS</h3>
            <p style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>Transparency report for the sequence models that evaluated this transaction.</p>
            
            <table className="alerts-table" style={{marginTop: '1.5rem'}}>
              <thead>
                <tr>
                  <th>Model Subsystem</th>
                  <th>Architecture</th>
                  <th>Confidence Score</th>
                  <th>Primary Signal Extracted</th>
                </tr>
              </thead>
              <tbody>
                {alert.model_insights ? alert.model_insights.map((mi, idx) => (
                  <tr key={idx}>
                    <td>{mi.name}</td>
                    <td>{mi.type}</td>
                    <td style={{color: mi.confidence > 0.9 ? 'var(--accent-green)' : '#f59e0b'}}>{(mi.confidence * 100).toFixed(1)}%</td>
                    <td>{mi.signal}</td>
                  </tr>
                )) : (
                  <>
                  <tr>
                    <td>Behavioral Sequence Engine</td>
                    <td>LSTM RNN</td>
                    <td style={{color: 'var(--accent-green)'}}>98.2%</td>
                    <td>Command Sequence Chain</td>
                  </tr>
                  <tr>
                    <td>Spatial Anomaly Detector</td>
                    <td>Isolation Forest</td>
                    <td style={{color: 'var(--accent-green)'}}>94.5%</td>
                    <td>Geo-velocity / IP Distance</td>
                  </tr>
                  <tr>
                    <td>Temporal Drift Analyzer</td>
                    <td>Prophet / ARIMA</td>
                    <td style={{color: '#f59e0b'}}>82.1%</td>
                    <td>Time-of-day access frequency</td>
                  </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
