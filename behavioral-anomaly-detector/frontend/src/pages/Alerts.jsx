import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  AlertTriangle, ShieldAlert, Activity, CheckCircle, 
  MapPin, Clock, Search, Filter, ShieldCheck, FileText 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Alerts.css';
import { API_BASE, WS_BASE } from '../config';


export default function Alerts({ alerts: initialAlerts }) {
  const navigate = useNavigate();
  const alerts = initialAlerts;
  const [selectedAlertId, setSelectedAlertId] = useState(null);
  const [toast, setToast] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [alertStatuses, setAlertStatuses] = useState(() => JSON.parse(localStorage.getItem('alert_statuses')) || {});

  React.useEffect(() => {
    localStorage.setItem('alert_statuses', JSON.stringify(alertStatuses));
  }, [alertStatuses]);

  const getMapData = (alertType) => {
    const type = (alertType || '').toLowerCase();
    if (type === 'impossible_travel') {
      return { lon: [-74.006, 37.6173, 139.6917], lat: [40.7128, 55.7558, 35.6895], mode: 'markers+lines' };
    } else if (type === 'brute_force' || type === 'credential_stuffing') {
      return { lon: [37.6173, 37.7, 37.8, 37.5], lat: [55.7558, 55.8, 55.7, 55.9], mode: 'markers' };
    } else if (type === 'lateral_movement') {
      return { lon: [-122.4194, -121.8863], lat: [37.7749, 37.3382], mode: 'markers+lines' };
    } else if (type === 'low_slow') {
      return { lon: [116.4074, 121.4737], lat: [39.9042, 31.2304], mode: 'markers+lines' };
    } else if (type === 'device_spoofing') {
      return { lon: [-0.1277], lat: [51.5074], mode: 'markers' };
    } else {
      return { lon: [-74.006, -0.1277], lat: [40.7128, 51.5074], mode: 'markers+lines' };
    }
  };

  const getRecommendedActions = (alertType) => {
     const type = (alertType || '').toLowerCase();
     if (type === 'brute_force' || type === 'credential_stuffing') {
        return ["Verify user identity", "Force password reset", "Block source IP"];
     } else if (type === 'impossible_travel') {
        return ["Verify user identity", "Require MFA", "Suspend account temporarily"];
     } else if (type === 'lateral_movement') {
        return ["Isolate endpoint", "Revoke active sessions", "Alert SOC Tier 2"];
     } else if (type === 'low_slow') {
        return ["Monitor outbound traffic", "Restrict external network access", "Investigate destination IP"];
     } else if (type === 'device_spoofing') {
        return ["Block unrecognized device", "Require re-authentication", "Update device policy"];
     } else {
        return ["Verify user identity", "Review recent logs", "Monitor entity activity"];
     }
  };

  // Filters
  const [activeTab, setActiveTab] = useState('All');
  
  const [filterAttackType, setFilterAttackType] = useState('All');
  const [filterSeverity, setFilterSeverity] = useState('All');
  const [filterRiskScoreMin, setFilterRiskScoreMin] = useState(0);

  const [appliedFilters, setAppliedFilters] = useState({
    attackType: 'All',
    severity: 'All',
    riskScoreMin: 0
  });

  const criticalAlerts = alerts.filter(a => a.risk_score > 0.8);
  const highAlerts = alerts.filter(a => a.risk_score > 0.6 && a.risk_score <= 0.8);
  const medAlerts = alerts.filter(a => a.risk_score > 0.4 && a.risk_score <= 0.6);
  const lowAlerts = alerts.filter(a => a.risk_score <= 0.4);

  const filteredAlerts = alerts.filter(a => {
     // Tab filter
     if (activeTab === 'Critical' && a.risk_score <= 0.8) return false;
     if (activeTab === 'High' && (a.risk_score <= 0.6 || a.risk_score > 0.8)) return false;
     if (activeTab === 'Medium' && (a.risk_score <= 0.4 || a.risk_score > 0.6)) return false;
     if (activeTab === 'Low' && a.risk_score > 0.4) return false;

     // Applied Filters
     if (appliedFilters.attackType !== 'All' && a.anomaly_type !== appliedFilters.attackType) return false;
     
     if (appliedFilters.severity !== 'All') {
        if (appliedFilters.severity === 'Critical' && a.risk_score <= 0.8) return false;
        if (appliedFilters.severity === 'High' && (a.risk_score <= 0.6 || a.risk_score > 0.8)) return false;
        if (appliedFilters.severity === 'Medium' && (a.risk_score <= 0.4 || a.risk_score > 0.6)) return false;
        if (appliedFilters.severity === 'Low' && a.risk_score > 0.4) return false;
     }

     if (a.risk_score * 100 < appliedFilters.riskScoreMin) return false;

     return true;
  });

  const uniqueAttackTypes = [...new Set(alerts.map(a => a.anomaly_type))];

  // Default to the first alert for the details panel if one isn't selected, but only if alerts exist
  const selectedAlert = selectedAlertId 
    ? alerts.find(a => a.id === selectedAlertId) 
    : filteredAlerts.length > 0 ? filteredAlerts[0] : null;

  const handleFeedback = (isPositive) => {
    if (!selectedAlert) return;
    
    const newStatus = isPositive ? 'Escalated' : 'Dismissed';
    setAlertStatuses(prev => ({...prev, [selectedAlert.id]: newStatus}));

    if (isPositive) {
       const actions = getRecommendedActions(selectedAlert.anomaly_type);
       setToast(`Executing automated response: ${actions.join(', ')}... Alert Escalated.`);
    } else {
       setToast(`Alert Dismissed. Retraining AI model baseline for ${selectedAlert.entity_id}.`);
    }
    
    setTimeout(() => setToast(null), 5000);

    const payload = {
        alert_id: selectedAlert.id || "test",
        entity_id: selectedAlert.entity_id || selectedAlert.entity || "usr_test",
        anomaly_type: selectedAlert.anomaly_type || selectedAlert.anomaly || "normal",
        is_accepted: isPositive
    };
    
    fetch(`${API_BASE}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .catch(err => {
        console.error("Feedback failed", err);
        setToast("Feedback failed. Is backend running?");
        setTimeout(() => setToast(null), 3000);
    });
  };

  const handleApplyFilters = () => {
    setAppliedFilters({
      attackType: filterAttackType,
      severity: filterSeverity,
      riskScoreMin: filterRiskScoreMin
    });
  };

  const handleClearFilters = () => {
    setFilterAttackType('All');
    setFilterSeverity('All');
    setFilterRiskScoreMin(0);
    setAppliedFilters({ attackType: 'All', severity: 'All', riskScoreMin: 0 });
    setActiveTab('All');
  };

  return (
    <div className="alerts-page">
      {/* Top KPI Row */}
      <div className="kpi-row">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><AlertTriangle size={24} color="var(--accent-red)" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Total Alerts (24h)</span>
            <span className="kpi-value cyan">{alerts.length}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><ShieldAlert size={24} color="var(--accent-red)" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Critical Alerts</span>
            <span className="kpi-value red">{criticalAlerts.length}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Activity size={24} color="#f59e0b" /></div>
          <div className="kpi-content">
            <span className="kpi-label">High Alerts</span>
            <span className="kpi-value orange">{highAlerts.length}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Activity size={24} color="#3b82f6" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Medium Alerts</span>
            <span className="kpi-value blue">{medAlerts.length}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><ShieldCheck size={24} color="var(--accent-green)" /></div>
          <div className="kpi-content">
            <span className="kpi-label">Low Alerts</span>
            <span className="kpi-value green">{lowAlerts.length}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Clock size={24} color="var(--accent-cyan)" /></div>
          <div className="kpi-content">
            <span className="kpi-label">MTTD</span>
            <span className="kpi-value cyan">2.4 min</span>
          </div>
        </div>
      </div>

      <div className="alerts-layout">
        <div className="alerts-main">
          {/* Tabs */}
          <div className="tabs-container">
            <div className={`tab ${activeTab === 'All' ? 'active' : ''}`} onClick={() => setActiveTab('All')}>All Alerts ({alerts.length})</div>
            <div className={`tab ${activeTab === 'Critical' ? 'active' : ''}`} onClick={() => setActiveTab('Critical')}>Critical ({criticalAlerts.length})</div>
            <div className={`tab ${activeTab === 'High' ? 'active' : ''}`} onClick={() => setActiveTab('High')}>High ({highAlerts.length})</div>
            <div className={`tab ${activeTab === 'Medium' ? 'active' : ''}`} onClick={() => setActiveTab('Medium')}>Medium ({medAlerts.length})</div>
            <div className={`tab ${activeTab === 'Low' ? 'active' : ''}`} onClick={() => setActiveTab('Low')}>Low ({lowAlerts.length})</div>
            <div style={{marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center'}}>
              <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Auto Refresh <input type="checkbox" defaultChecked /></span>
            </div>
          </div>

          {/* Alert Table */}
          <div className="glass-panel alerts-table-container">
            <table className="alerts-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Entity</th>
                  <th>Attack Type</th>
                  <th>Risk Score</th>
                  <th>Confidence</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredAlerts.length === 0 && (
                  <tr><td colSpan="7" style={{textAlign: 'center', padding: '2rem'}}>No alerts match the selected filters.</td></tr>
                )}
                {filteredAlerts.map((alert) => {
                  const isSelected = selectedAlertId === alert.id;
                  const isCritical = alert.risk_score > 0.8;
                  const isWarning = alert.risk_score > 0.5 && alert.risk_score <= 0.8;
                  let color = '#00ff88';
                  if (isCritical) color = '#ff003c';
                  else if (isWarning) color = '#f59e0b';

                  const currentStatus = alertStatuses[alert.id] || 'New';
                  let statusClass = 'status-new';
                  if (currentStatus === 'Escalated') statusClass = 'status-escalated';
                  else if (currentStatus === 'Dismissed') statusClass = 'status-dismissed';

                  return (
                    <tr 
                      key={alert.id} 
                      className={isSelected ? 'selected' : ''}
                      onClick={() => setSelectedAlertId(alert.id)}
                    >
                      <td>{new Date(alert.timestamp).toLocaleTimeString()}</td>
                      <td>
                        {alert.entity_id}
                        {alert.isColdStart && <span style={{fontSize: '0.6rem', padding: '0.2rem 0.4rem', background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', borderRadius: '4px', marginLeft: '0.5rem', border: '1px solid #f59e0b'}}>COLD-START</span>}
                      </td>
                      <td style={{color: color}}>{alert.anomaly_type.replace('_', ' ').toUpperCase()}</td>
                      <td>
                        <div className="score-ring" style={{borderColor: color, color: color}}>
                           {(alert.risk_score * 100).toFixed(0)}
                        </div>
                      </td>
                      <td>98%</td>
                      <td>New York, US</td>
                      <td><span className={statusClass}>{currentStatus}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>



        </div>

        {/* Right Sidebar Filters */}
        <div className="alerts-filters glass-panel">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
            <h3 style={{fontFamily: 'Orbitron', fontSize: '1rem'}}>Filters</h3>
            <span style={{color: 'var(--accent-red)', fontSize: '0.8rem', cursor: 'pointer'}} onClick={handleClearFilters}>Clear All</span>
          </div>

          <div className="filter-group">
            <label>Time Range</label>
            <select><option>Last 24 Hours</option><option>Last 7 Days</option></select>
          </div>

          <div className="filter-group">
            <label>Attack Type</label>
            <select value={filterAttackType} onChange={(e) => setFilterAttackType(e.target.value)}>
              <option value="All">All Attack Types</option>
              {uniqueAttackTypes.map(t => (
                <option key={t} value={t}>{t.replace('_', ' ').toUpperCase()}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Severity</label>
            <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
              <option value="All">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Risk Score Min</label>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.5rem'}}>
              <span>{filterRiskScoreMin}</span>
              <span>100</span>
            </div>
            <input type="range" min="0" max="100" value={filterRiskScoreMin} onChange={(e) => setFilterRiskScoreMin(parseInt(e.target.value))} style={{width: '100%'}} />
          </div>

          <button className="btn-solid-red" style={{width: '100%', marginTop: '1rem', padding: '0.75rem', flex: 'none'}} onClick={handleApplyFilters}>APPLY FILTERS</button>
          
          <div style={{marginTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem'}}>
             <h4 style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>Quick Stats</h4>
             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem'}}>
               <span>Open Alerts</span><span>{filteredAlerts.length}</span>
             </div>
             <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem'}}>
               <span>In Review</span><span>0</span>
             </div>
          </div>
        </div>

      </div>

      {/* Alert Details Panel - Full Width */}
      {selectedAlert && (
        <div className="glass-panel alert-details-panel">
          <div className="details-header">
            <h3>ALERT DETAILS: {selectedAlert.anomaly_type.replace('_', ' ').toUpperCase()}</h3>
          </div>
          <div className="details-grid">
            
            {/* Info & Why Flagged */}
            <div className="details-col">
              <div className="info-row">
                <span className="info-label">Alert ID:</span>
                <span className="info-val">{selectedAlert.id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Entity:</span>
                <span className="info-val" style={{color: 'var(--accent-cyan)'}}>{selectedAlert.entity_id}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Time:</span>
                <span className="info-val">{new Date(selectedAlert.timestamp).toLocaleString()}</span>
              </div>

              <h4 className="section-title" style={{marginTop: '1.5rem'}}>Why Flagged?</h4>
              <p className="why-flagged-text">
                {selectedAlert.explanation}
              </p>
              
              <div style={{display: 'flex', gap: '2rem', marginTop: '1.5rem'}}>
                <div>
                  <div className="info-label">Risk Score</div>
                  <div style={{fontSize: '2rem', color: selectedAlert.risk_score > 0.8 ? 'var(--accent-red)' : '#f59e0b', fontFamily: 'Orbitron', fontWeight: 'bold'}}>
                    {(selectedAlert.risk_score * 100).toFixed(0)} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/ 100</span>
                  </div>
                </div>
                <div>
                  <div className="info-label">AI Confidence</div>
                  <div style={{fontSize: '2rem', color: 'var(--accent-green)', fontFamily: 'Orbitron', fontWeight: 'bold'}}>
                    98%
                  </div>
                </div>
              </div>
            </div>

            {/* Factors & Recommended Actions */}
            <div className="details-col">
              <h4 className="section-title">Top Contributing Factors</h4>
              {(() => {
                 const type = (selectedAlert.anomaly_type || '').toLowerCase();
                 let factors = [];
                 if (type === 'brute_force' || type === 'credential_stuffing') {
                    factors = [
                      { label: "Multiple failed logins", score: 0.92, color: 'red', width: '92%' },
                      { label: "Suspicious source IP", score: 0.85, color: 'orange', width: '85%' },
                      { label: "High request rate", score: 0.72, color: 'orange', width: '72%' }
                    ];
                 } else if (type === 'impossible_travel') {
                    factors = [
                      { label: "Geo-velocity impossible", score: 0.95, color: 'red', width: '95%' },
                      { label: "New device fingerprint", score: 0.81, color: 'orange', width: '81%' },
                      { label: "Unusual access time", score: 0.65, color: 'orange', width: '65%' }
                    ];
                 } else if (type === 'lateral_movement') {
                    factors = [
                      { label: "Accessing sensitive internal resources", score: 0.89, color: 'red', width: '89%' },
                      { label: "Unusual protocol (RDP/SMB)", score: 0.82, color: 'orange', width: '82%' },
                      { label: "Off-hours activity", score: 0.74, color: 'orange', width: '74%' }
                    ];
                 } else if (type === 'low_slow') {
                    factors = [
                      { label: "Steady outbound data transfer", score: 0.88, color: 'red', width: '88%' },
                      { label: "Connection to rare external IP", score: 0.76, color: 'orange', width: '76%' },
                      { label: "Long session duration", score: 0.68, color: 'orange', width: '68%' }
                    ];
                 } else if (type === 'device_spoofing') {
                    factors = [
                      { label: "Mismatched browser fingerprint", score: 0.93, color: 'red', width: '93%' },
                      { label: "Inconsistent OS signatures", score: 0.84, color: 'orange', width: '84%' },
                      { label: "VPN/Proxy node detected", score: 0.71, color: 'orange', width: '71%' }
                    ];
                 } else {
                    factors = [
                      { label: "General baseline deviation", score: 0.85, color: 'red', width: '85%' },
                      { label: "Unusual volume of requests", score: 0.78, color: 'orange', width: '78%' },
                      { label: "New entity interaction", score: 0.65, color: 'orange', width: '65%' }
                    ];
                 }
                 
                 return factors.map((f, i) => (
                    <div className="factor-row" key={i}>
                      <span>{f.label}</span>
                      <div className="factor-bar-container">
                        <div className={`factor-bar ${f.color}`} style={{width: f.width}}></div>
                      </div>
                      <span className="factor-val">{f.score.toFixed(2)}</span>
                    </div>
                 ));
              })()}

              <h4 className="section-title" style={{marginTop: '1.5rem'}}>Recommended Actions</h4>
              <ul className="actions-list">
                {(() => {
                   const type = (selectedAlert.anomaly_type || '').toLowerCase();
                   let actions = [];
                   if (type === 'brute_force' || type === 'credential_stuffing') {
                      actions = ["Verify user identity", "Force password reset", "Block source IP"];
                   } else if (type === 'impossible_travel') {
                      actions = ["Verify user identity", "Require MFA", "Suspend account temporarily"];
                   } else if (type === 'lateral_movement') {
                      actions = ["Isolate endpoint", "Revoke active sessions", "Alert SOC Tier 2"];
                   } else if (type === 'low_slow') {
                      actions = ["Monitor outbound traffic", "Restrict external network access", "Investigate destination IP"];
                   } else if (type === 'device_spoofing') {
                      actions = ["Block unrecognized device", "Require re-authentication", "Update device policy"];
                   } else {
                      actions = ["Verify user identity", "Review recent logs", "Monitor entity activity"];
                   }
                   
                   return actions.map((act, i) => (
                     <li key={i}><CheckCircle size={14} color="var(--accent-cyan)" /> {act}</li>
                   ));
                })()}
              </ul>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto', paddingTop: '1.5rem'}}>
                <button className="btn-solid-red" onClick={() => handleFeedback(true)} style={{width: '100%', flex: 'none', padding: '0.75rem'}}>MARK AS TRUE POSITIVE</button>
                <button className="btn-outline" onClick={() => handleFeedback(false)} style={{width: '100%', padding: '0.75rem'}}>MARK AS FALSE POSITIVE</button>
                <div style={{display: 'flex', gap: '0.75rem'}}>
                   <button className="btn-outline" onClick={() => navigate('/explainability', { state: { alert: selectedAlert } })} style={{borderColor: 'var(--accent-cyan)', color: 'var(--accent-cyan)', flex: 1, padding: '0.75rem'}}>INVESTIGATE</button>
                   <button className="btn-outline" onClick={() => navigate('/entities', { state: { entityId: selectedAlert.entity_id } })} style={{borderColor: '#a855f7', color: '#a855f7', flex: 1, padding: '0.75rem'}}>VIEW ENTITY</button>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="details-col" style={{display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <h4 className="section-title" style={{margin: 0}}>Entity Location History</h4>
                <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}} onClick={() => setShowMapModal(true)}>Enlarge Map</span>
              </div>
              <div 
                style={{flex: 1, border: '1px solid var(--glass-border)', borderRadius: '4px', overflow: 'hidden', cursor: 'pointer', position: 'relative'}}
                onClick={() => setShowMapModal(true)}
              >
                <div style={{position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(0,0,0,0.5)', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)', zIndex: 10}}>Click to expand</div>
                <Plot
                  data={[{
                    type: 'scattergeo',
                    mode: getMapData(selectedAlert.anomaly_type).mode,
                    lon: getMapData(selectedAlert.anomaly_type).lon,
                    lat: getMapData(selectedAlert.anomaly_type).lat,
                    marker: { size: 8, color: 'var(--accent-red)' },
                    line: { width: 2, color: 'var(--accent-cyan)' }
                  }]}
                  layout={{
                    geo: {
                      projection: { type: 'orthographic' },
                      showland: true,
                      landcolor: 'rgba(255,255,255,0.05)',
                      showocean: true,
                      oceancolor: 'rgba(0,0,0,0)',
                      bgcolor: 'rgba(0,0,0,0)'
                    },
                    margin: { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                  }}
                  config={{ displayModeBar: false }}
                  style={{width: '100%', height: '100%'}}
                />
              </div>
            </div>

          </div>
        </div>
      )}
      
      {/* Map Modal */}
      {showMapModal && selectedAlert && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)'}}>
          <div className="glass-panel" style={{width: '90%', height: '90%', position: 'relative', display: 'flex', flexDirection: 'column'}}>
            <button className="mobile-close-btn" style={{position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'var(--accent-red)', border: 'none', color: 'white', cursor: 'pointer', zIndex: 10, width: '32px', height: '32px', borderRadius: '50%', fontWeight: 'bold'}} onClick={() => setShowMapModal(false)}>✕</button>
            <h2 style={{margin: '0 0 1rem 1rem', fontSize: '1.2rem', fontFamily: 'Orbitron'}}>Location History: {selectedAlert.entity_id} ({selectedAlert.anomaly_type.replace('_', ' ').toUpperCase()})</h2>
            <div style={{flex: 1, border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden'}}>
               <Plot
                  data={[{
                    type: 'scattergeo',
                    mode: getMapData(selectedAlert.anomaly_type).mode,
                    lon: getMapData(selectedAlert.anomaly_type).lon,
                    lat: getMapData(selectedAlert.anomaly_type).lat,
                    marker: { size: 12, color: 'var(--accent-red)' },
                    line: { width: 3, color: 'var(--accent-cyan)' },
                    text: getMapData(selectedAlert.anomaly_type).lon.map((_, i) => `Point ${i+1}`),
                    textposition: 'top center',
                    textfont: { color: 'white', family: 'Orbitron' }
                  }]}
                  layout={{
                    geo: {
                      projection: { type: 'natural earth' },
                      showland: true,
                      landcolor: 'rgba(30, 40, 60, 1)',
                      showocean: true,
                      oceancolor: 'rgba(10, 15, 30, 1)',
                      showcountries: true,
                      countrycolor: 'rgba(255,255,255,0.1)',
                      bgcolor: 'rgba(0,0,0,0)'
                    },
                    margin: { l: 0, r: 0, t: 0, b: 0 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                  }}
                  config={{ displayModeBar: true, scrollZoom: true }}
                  style={{width: '100%', height: '100%'}}
                />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          background: 'var(--glass-bg)', backdropFilter: 'blur(16px)',
          border: '1px solid var(--accent-cyan)', borderRadius: '8px',
          padding: '1rem 1.5rem', color: 'white', display: 'flex',
          alignItems: 'center', gap: '0.75rem', zIndex: 9999,
          boxShadow: '0 10px 30px rgba(0, 240, 255, 0.2)'
        }}>
          <CheckCircle size={16} color="var(--accent-cyan)"/>
          <span style={{fontSize: '0.85rem'}}>{toast}</span>
        </div>
      )}
    </div>
  );
}
