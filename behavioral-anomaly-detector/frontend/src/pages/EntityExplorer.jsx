import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { User, ShieldAlert, Clock, MapPin, Server, ChevronRight, CheckCircle, Target, Activity, AlertTriangle, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useLocation } from 'react-router-dom';
import './EntityExplorer.css';

export default function EntityExplorer({ alerts }) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [entityData, setEntityData] = useState(null);
  
  const location = useLocation();
  const entityId = location.state?.entityId || "user_1287";
  
  const activeAlert = alerts ? alerts.find(a => a.entity_id === entityId) : null;
  const exportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFontSize(22);
    pdf.setTextColor(40, 40, 40);
    pdf.text(`Entity Risk Profile: ${entityData.id}`, 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 45, 190, 45);
    
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Identity Information', 20, 60);
    
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    
    let yPos = 75;
    const identity = [
      { label: 'Entity Type', value: entityData.type },
      { label: 'Department', value: entityData.department },
      { label: 'Role', value: entityData.role },
      { label: 'Manager', value: entityData.manager },
      { label: 'Last Seen', value: entityData.last_seen }
    ];
    
    identity.forEach(m => {
      pdf.text(`${m.label}:`, 25, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(m.value || 'N/A'), 80, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 10;
    });
    
    yPos += 10;
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Security Posture & Activity', 20, yPos);
    
    yPos += 15;
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    
    const security = [
      { label: 'Risk Score', value: `${entityData.risk_score} / 100` },
      { label: 'AI Confidence', value: '96%' },
      { label: 'Total Events (30d)', value: entityData.total_events_30d?.toLocaleString() || '0' },
      { label: 'Active Alerts (30d)', value: entityData.alerts_30d || '0' }
    ];
    
    security.forEach(m => {
      pdf.text(`${m.label}:`, 25, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(m.value || '0'), 80, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 10;
    });
    
    pdf.save(`entity-report-${entityId}.pdf`);
  };


  React.useEffect(() => {
    fetch(`/api/entity/${entityId}`)
      .then(res => res.json())
      .then(data => setEntityData(data))
      .catch(err => console.error(err));
  }, [entityId]);

  if (!entityData) return <div style={{padding: '2rem', color: 'white'}}>Loading entity data...</div>;

  return (
    <div className="entity-page" id="entity-report-content">
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
        <button onClick={exportPDF} className="btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer'}}>
          <Download size={14}/> Generate Report
        </button>
      </div>
      {/* Entity Header Profile */}
      <div className="glass-panel entity-header">
        <div className="profile-section">
          <div className="avatar-large">
            <User size={40} color="var(--accent-cyan)" />
          </div>
          <div className="profile-info">
            <h2>{entityData.id} 
              <span className="status-badge active">ACTIVE</span>
              <span className="status-badge" style={{background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', borderColor: '#f59e0b', marginLeft: '0.5rem', fontSize: '0.6rem'}} title="Peer-Group Baselines active until enough history is collected.">PROFILING (Cold-Start)</span>
            </h2>
            <div className="profile-meta">
              <div><span className="meta-label">Entity Type</span><br/>{entityData.type}</div>
              <div><span className="meta-label">Department</span><br/>{entityData.department}</div>
              <div><span className="meta-label">Role</span><br/>{entityData.role}</div>
              <div><span className="meta-label">Manager</span><br/>{entityData.manager}</div>
              <div><span className="meta-label">Last Seen</span><br/>{entityData.last_seen}</div>
            </div>
          </div>
        </div>
        <div className="profile-stats">
          <div className="stat-box">
            <div className="stat-val red">{entityData.risk_score}<span className="stat-max">/100</span></div>
            <div className="stat-label">Risk Score <span>High Risk</span></div>
            <div className="confidence-bar"><div className="confidence-fill" style={{width: '96%'}}></div></div>
            <div className="confidence-text">96% AI Confidence</div>
          </div>
          <div className="stat-box" style={{background: 'rgba(0, 240, 255, 0.05)', borderColor: 'rgba(0, 240, 255, 0.2)'}}>
            <div className="stat-val cyan" style={{fontSize: '1.25rem', marginBottom: '0.2rem'}}>+14% Drift</div>
            <div className="stat-label">Baseline <span style={{color: 'var(--accent-cyan)'}}>Adapting</span></div>
            <div className="confidence-text" style={{marginTop: '0.5rem', lineHeight: '1.2'}}>Model successfully adapted to new working hours without false positives.</div>
          </div>
          <div className="stat-list">
             <div><span className="list-label">Total Events (30d):</span> <span className="list-val">{entityData.total_events_30d?.toLocaleString() || 0}</span></div>
             <div><span className="list-label">Alerts (30d):</span> <span className="list-val">{entityData.alerts_30d || 0}</span></div>
             <div><span className="list-label">Entity ID:</span> <span className="list-val">{entityData.id}</span></div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container" style={{margin: '1rem 0'}}>
        {['Overview', 'Behavior Timeline', 'Auth History', 'Resource Access', 'Alerts (8)', 'Devices (2)', 'Risk History'].map(tab => (
          <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
        ))}
      </div>

      <div className="entity-main-layout">
        <div className="entity-grid">
          
          {/* Main content switched by tab */}
          {activeTab === 'Overview' && (
            <>
              {/* Behavior Timeline Chart */}
              <div className="glass-panel col-span-2">
                <h3 className="panel-title">Behavior Timeline (30 Days)</h3>
            <Plot
              data={[
                { 
                  x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                  y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.normal : [0], 
                  type: 'bar', marker: {color: '#00ff88'}, name: 'Normal Events' 
                },
                { 
                  x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                  y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.anomalous : [0], 
                  type: 'bar', marker: {color: '#ff003c'}, name: 'Anomalous Events' 
                },
                { 
                  x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                  y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.risk : [0], 
                  type: 'scatter', mode: 'lines+markers', line: {color: '#ff00ff'}, yaxis: 'y2', name: 'Risk Score' 
                }
              ]}
              layout={{
                barmode: 'stack',
                autosize: true, margin: { t: 10, b: 20, l: 30, r: 30 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: false, color: '#8b9bb4', tickmode: 'auto', nticks: 5 },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' },
                yaxis2: { overlaying: 'y', side: 'right', showgrid: false, color: '#ff00ff', range: [0, 100] },
                showlegend: true, legend: { orientation: 'h', y: 1.1, font: { color: '#8b9bb4', size: 10 } }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '200px'}}
            />
          </div>

          {/* Auth Summary */}
          <div className="glass-panel">
            <h3 className="panel-title">Authentication Summary (30 Days)</h3>
            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
               <div style={{flex: 1, background: 'rgba(0, 255, 136, 0.15)', padding: '0.5rem', borderRadius: '8px', borderLeft: '3px solid #00ff88', overflow: 'hidden'}}>
                 <div style={{fontSize: '0.7rem', color: '#c1ffdd', textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>Success</div>
                 <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'white'}}>{(entityData.total_events_30d - entityData.alerts_30d).toLocaleString()}</div>
               </div>
               <div style={{flex: 1, background: 'rgba(255, 0, 60, 0.15)', padding: '0.5rem', borderRadius: '8px', borderLeft: '3px solid #ff003c', overflow: 'hidden'}}>
                 <div style={{fontSize: '0.7rem', color: '#ffc1c1', textTransform: 'uppercase', letterSpacing: '0.02em', whiteSpace: 'nowrap'}}>Alerts</div>
                 <div style={{fontSize: '1.25rem', fontWeight: 'bold', color: 'white'}}>{entityData.alerts_30d.toLocaleString()}</div>
               </div>
            </div>
            <div style={{display: 'flex', gap: '1rem'}}>
               <div style={{flex: 1}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>MFA Usage</div>
                  <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)'}}>85%</div>
               </div>
               <div style={{flex: 1}}>
                  <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Auth Methods</div>
                  <div style={{fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between'}}><span>Password</span> <span style={{color: 'var(--accent-cyan)'}}>85%</span></div>
                  <div style={{fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between'}}><span>MFA</span> <span style={{color: 'var(--accent-cyan)'}}>10%</span></div>
                  <div style={{fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between'}}><span>Token</span> <span style={{color: 'var(--accent-cyan)'}}>5%</span></div>
               </div>
            </div>
          </div>

          {/* Location History */}
          <div className="glass-panel">
            <h3 className="panel-title">Location History (30 Days)</h3>
            <div style={{height: '200px'}}>
              <Plot
                data={[{
                  type: 'scattergeo',
                  mode: 'markers+lines',
                  lon: entityData.geo_coordinates && entityData.geo_coordinates.length > 0 ? entityData.geo_coordinates.map(c => c.lon) : [-74.006],
                  lat: entityData.geo_coordinates && entityData.geo_coordinates.length > 0 ? entityData.geo_coordinates.map(c => c.lat) : [40.7128],
                  marker: { size: entityData.geo_coordinates && entityData.geo_coordinates.length > 0 ? entityData.geo_coordinates.map(() => 8) : [6], color: '#00f0ff' },
                  line: { width: 1, color: 'rgba(0, 240, 255, 0.5)' }
                }]}
                layout={{
                  geo: {
                    projection: { type: 'equirectangular' },
                    showland: true, landcolor: 'rgba(255,255,255,0.05)',
                    showocean: true, oceancolor: 'rgba(0,0,0,0)', bgcolor: 'rgba(0,0,0,0)',
                    showcountries: true, countrycolor: 'rgba(255,255,255,0.1)'
                  },
                  margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: 'rgba(0,0,0,0)',
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{width: '100%', height: '100%'}}
              />
            </div>
          </div>

          {/* Top Resources */}
          <div className="glass-panel">
            <h3 className="panel-title">Top Resources Accessed (30 Days)</h3>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
               {entityData.top_resources && entityData.top_resources.length > 0 ? entityData.top_resources.map((res, i) => (
                 <div className="resource-row" key={i}>
                   <span style={{width: '100px'}}>{res.name}</span>
                   <div className="bar-bg"><div className="bar-fill cyan" style={{width: `${Math.max(10, (res.count / entityData.top_resources[0].count) * 100)}%`}}></div></div>
                   <span style={{width: '30px', textAlign: 'right'}}>{res.count}</span>
                 </div>
               )) : (
                 <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No resource data available.</div>
               )}
            </div>
          </div>

          {/* Device Info */}
          <div className="glass-panel">
            <h3 className="panel-title">Device Information</h3>
            <div className="device-info-grid">
               <div className="device-item"><span>Device Fingerprint</span> {(entityData.baseline_devices && entityData.baseline_devices[0]) ? entityData.baseline_devices[0].substring(0, 15) : 'd1a3e7c5f...'}</div>
               <div className="device-item"><span>OS</span> Windows 11 Pro</div>
               <div className="device-item"><span>Browser</span> Chrome 124.0.0.0</div>
               <div className="device-item"><span>MAC Address</span> A4-5E-60-DF-3B-2A</div>
               <div className="device-item"><span>Primary IP Address</span> {(entityData.baseline_ips && entityData.baseline_ips[0]) || '203.0.113.45'}</div>
               <div className="device-item"><span>Usual Locations</span> {(entityData.baseline_locations && entityData.baseline_locations.length > 0) ? entityData.baseline_locations[0] : 'Unknown'}</div>
               <div className="device-item"><span>Last Seen</span> {entityData.last_seen}</div>
               <div className="device-item"><span>Protocol</span> HTTPS</div>
            </div>
          </div>

          {/* Activity Feed Footer (Spans all columns) */}
          <div className="glass-panel col-span-3">
             <h3 className="panel-title">Recent Activity Feed</h3>
             <div className="activity-stepper">
                <div className="step normal">
                  <div className="step-icon"><CheckCircle size={14} /></div>
                  <div className="step-content">
                    <div className="step-title">Login Success</div>
                    <div className="step-desc">Mumbai, India</div>
                    <div className="step-time">10:00 AM</div>
                  </div>
                </div>
                <div className="step-line normal"></div>
                
                <div className="step normal">
                  <div className="step-icon"><Server size={14} /></div>
                  <div className="step-content">
                    <div className="step-title">Accessed Server-07</div>
                    <div className="step-desc">Internal</div>
                    <div className="step-time">10:05 AM</div>
                  </div>
                </div>
                <div className="step-line normal"></div>
                
                <div className="step warning">
                  <div className="step-icon"><ShieldAlert size={14} /></div>
                  <div className="step-content">
                    <div className="step-title">Failed Login Attempt</div>
                    <div className="step-desc">10.10.13.45</div>
                    <div className="step-time">10:12 AM</div>
                  </div>
                </div>
                <div className="step-line warning"></div>
                
                <div className="step alert">
                  <div className="step-icon"><AlertTriangle size={14} /></div>
                  <div className="step-content">
                    <div className="step-title">Impossible Travel</div>
                    <div className="step-desc">São Paulo, Brazil</div>
                    <div className="step-time">10:24 AM</div>
                  </div>
                </div>
             </div>
          </div>
            </>
          )}
          {/* Behavior Timeline Tab */}
          {activeTab === 'Behavior Timeline' && (
            <div className="glass-panel col-span-3">
              <h3 className="panel-title">Behavior Timeline (Detailed View)</h3>
              <Plot
                data={[
                  { 
                    x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                    y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.normal : [0], 
                    type: 'bar', marker: {color: '#00ff88'}, name: 'Normal Events' 
                  },
                  { 
                    x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                    y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.anomalous : [0], 
                    type: 'bar', marker: {color: '#ff003c'}, name: 'Anomalous Events' 
                  },
                  { 
                    x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                    y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.risk : [0], 
                    type: 'scatter', mode: 'lines+markers', line: {color: '#ff00ff'}, yaxis: 'y2', name: 'Risk Score' 
                  }
                ]}
                layout={{
                  barmode: 'stack',
                  autosize: true, margin: { t: 10, b: 20, l: 30, r: 30 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: { showgrid: false, color: '#8b9bb4', tickmode: 'auto', nticks: 10 },
                  yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' },
                  yaxis2: { overlaying: 'y', side: 'right', showgrid: false, color: '#ff00ff', range: [0, 100] },
                  showlegend: true, legend: { orientation: 'h', y: 1.1, font: { color: '#8b9bb4', size: 10 } }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{width: '100%', height: '400px'}}
              />
            </div>
          )}

          {/* Auth History Tab */}
          {activeTab === 'Auth History' && (
            <div className="col-span-3" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="glass-panel">
                <h3 className="panel-title">Authentication Summary</h3>
                <div style={{display: 'flex', gap: '1rem'}}>
                   <div style={{flex: 1, background: 'rgba(0, 255, 136, 0.15)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #00ff88'}}>
                     <div style={{fontSize: '0.8rem', color: '#c1ffdd', textTransform: 'uppercase', letterSpacing: '0.02em'}}>Successful Events</div>
                     <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{(entityData.total_events_30d - entityData.alerts_30d).toLocaleString()}</div>
                   </div>
                   <div style={{flex: 1, background: 'rgba(255, 0, 60, 0.15)', padding: '1rem', borderRadius: '8px', borderLeft: '3px solid #ff003c'}}>
                     <div style={{fontSize: '0.8rem', color: '#ffc1c1', textTransform: 'uppercase', letterSpacing: '0.02em'}}>Anomalous Events</div>
                     <div style={{fontSize: '1.5rem', fontWeight: 'bold'}}>{entityData.alerts_30d.toLocaleString()}</div>
                   </div>
                   <div style={{flex: 1, padding: '1rem'}}>
                      <div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>MFA Usage</div>
                      <div style={{fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)'}}>85%</div>
                   </div>
                </div>
              </div>
              <div className="glass-panel table-container">
                 <h3 className="panel-title">Recent Authentication Events</h3>
                 <table className="alerts-table">
                    <thead><tr><th>Time</th><th>IP Address</th><th>Method</th><th>Status</th></tr></thead>
                    <tbody>
                      {entityData.recent_activity && entityData.recent_activity.length > 0 ? entityData.recent_activity.map((act, i) => (
                        <tr key={i}>
                          <td>{act.time}</td>
                          <td>{act.ip}</td>
                          <td>Password/MFA</td>
                          <td style={{color: act.action.includes('Alert') ? 'var(--accent-red)' : 'var(--accent-green)'}}>
                            {act.action.includes('Alert') ? 'Failed' : 'Success'}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No recent activity found.</td></tr>
                      )}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* Resource Access Tab */}
          {activeTab === 'Resource Access' && (
            <div className="col-span-3" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              <div className="glass-panel">
                <h3 className="panel-title">Top Resources Accessed</h3>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
                   {entityData.top_resources && entityData.top_resources.length > 0 ? entityData.top_resources.map((res, i) => (
                     <div className="resource-row" key={i}>
                       <span style={{width: '200px'}}>{res.name}</span>
                       <div className="bar-bg"><div className="bar-fill cyan" style={{width: `${Math.max(10, (res.count / entityData.top_resources[0].count) * 100)}%`}}></div></div>
                       <span style={{width: '50px', textAlign: 'right'}}>{res.count}</span>
                     </div>
                   )) : (
                     <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No resource data available.</div>
                   )}
                </div>
              </div>
              <div className="glass-panel table-container">
                 <h3 className="panel-title">Access Logs</h3>
                 <table className="alerts-table">
                    <thead><tr><th>Time</th><th>Action / Resource</th><th>IP Address</th><th>Status</th></tr></thead>
                    <tbody>
                      {entityData.recent_activity && entityData.recent_activity.length > 0 ? entityData.recent_activity.map((act, i) => (
                        <tr key={i}>
                          <td>{act.time}</td>
                          <td>{act.action}</td>
                          <td>{act.ip}</td>
                          <td style={{color: act.action.includes('Alert') ? 'var(--accent-red)' : 'var(--accent-green)'}}>
                            {act.action.includes('Alert') ? 'Denied' : 'Granted'}
                          </td>
                        </tr>
                      )) : (
                        <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No access logs found.</td></tr>
                      )}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {/* Historical Alerts Tab */}
          {activeTab.startsWith('Alerts') && (
            <div className="glass-panel col-span-3 table-container">
               <h3 className="panel-title">All Historical Alerts for {entityData.id}</h3>
               <table className="alerts-table">
                  <thead><tr><th>Time</th><th>Anomaly Type</th><th>Risk Score</th><th>Status</th></tr></thead>
                  <tbody>
                    {entityData.historical_alerts && entityData.historical_alerts.length > 0 ? entityData.historical_alerts.map((alert, i) => (
                      <tr key={i}>
                        <td>{alert.time}</td>
                        <td style={{color: 'var(--accent-red)', textTransform: 'uppercase'}}>{alert.type}</td>
                        <td>{alert.risk_score}</td>
                        <td>New</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No historical alerts found.</td></tr>
                    )}
                  </tbody>
               </table>
            </div>
          )}

          {/* Devices Tab */}
          {activeTab.startsWith('Devices') && (
            <div className="col-span-3" style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {entityData.baseline_devices && entityData.baseline_devices.length > 0 ? entityData.baseline_devices.map((device, i) => (
                <div className="glass-panel" key={i}>
                  <h3 className="panel-title">Device {i+1}</h3>
                  <div className="device-info-grid">
                     <div className="device-item"><span>Device Fingerprint</span> {device}</div>
                     <div className="device-item"><span>Primary IP</span> {entityData.baseline_ips && entityData.baseline_ips[i] ? entityData.baseline_ips[i] : 'Dynamic DHCP'}</div>
                  </div>
                </div>
              )) : (
                <div className="glass-panel">
                  <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No device fingerprints found in baseline.</div>
                </div>
              )}
            </div>
          )}

          {/* Risk History Tab */}
          {activeTab === 'Risk History' && (
            <div className="glass-panel col-span-3">
              <h3 className="panel-title">Entity Risk Score History (30 Days)</h3>
              <Plot
                data={[
                  { 
                    x: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.dates : ['No Data'], 
                    y: entityData.timeseries && entityData.timeseries.dates.length > 0 ? entityData.timeseries.risk : [0], 
                    type: 'scatter', mode: 'lines+markers', line: {color: 'var(--accent-red)', width: 3}, marker: {size: 8} 
                  }
                ]}
                layout={{
                  autosize: true, margin: { t: 10, b: 20, l: 30, r: 30 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: { showgrid: false, color: '#8b9bb4', tickmode: 'auto', nticks: 10 },
                  yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', range: [0, 100] }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{width: '100%', height: '300px'}}
              />
            </div>
          )}

        </div>

        {/* Right Sidebar (Alerts & Explanation) */}
        <div className="entity-sidebar">
          {/* Historical Alerts */}
          <div className="glass-panel col-span-2">
            <h3 className="panel-title">Historical Alerts ({entityData.alerts_30d})</h3>
            <div className="alert-history-list">
               {entityData.historical_alerts && entityData.historical_alerts.length > 0 ? entityData.historical_alerts.map((alert, i) => (
                 <div className="a-hist-item" key={i}>
                   <div className="a-hist-icon"><AlertTriangle size={16} color="var(--accent-red)"/></div>
                   <div className="a-hist-content">
                     <div className="a-hist-title">{alert.type}</div>
                     <div className="a-hist-time">{alert.time}</div>
                   </div>
                   <div className="a-hist-score">{alert.risk_score}</div>
                 </div>
               )) : (
                 <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No historical alerts for this entity.</div>
               )}
            </div>
            {entityData.historical_alerts && entityData.historical_alerts.length > 0 && <div className="view-all-link" style={{textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}>View All</div>}
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--accent-red)'}}>Why This Entity Is Flagged</h3>
            <p style={{fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
              {activeAlert ? activeAlert.explanation : (entityData.flagged_reason || 'This entity is currently operating within normal baseline parameters.')}
            </p>
            
            <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Top Contributing Factors</h4>
            {activeAlert && activeAlert.extracted_features ? (
              Object.entries(activeAlert.extracted_features).map(([feature, val], i) => (
                <div className="factor-row" style={{marginBottom: '0.25rem'}} key={i}>
                  <span style={{fontSize: '0.75rem', textTransform: 'capitalize'}}>{feature.replace('_', ' ')}</span>
                  <div className="bar-bg">
                    <div 
                      className={`bar-fill ${val > 0.8 ? 'red' : (val > 0.5 ? 'orange' : 'cyan')}`} 
                      style={{width: `${Math.min(100, (val > 1 ? val / 50 : val) * 100)}%`}}
                    ></div>
                  </div>
                  <span style={{fontSize: '0.75rem', width: '25px', textAlign: 'right'}}>
                    {val > 1 ? val : val.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div style={{color: 'var(--text-secondary)', fontSize: '0.85rem'}}>No active anomaly factors detected.</div>
            )}

            <h4 style={{fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', margin: '1.5rem 0 0.5rem 0'}}>Recommended Actions</h4>
            <ul className="actions-list" style={{fontSize: '0.75rem'}}>
              <li><CheckCircle size={12} color="var(--accent-cyan)" /> Verify User Identity</li>
              <li><CheckCircle size={12} color="var(--accent-cyan)" /> Reset Password</li>
              <li><CheckCircle size={12} color="var(--accent-cyan)" /> Investigate Access</li>
              <li><CheckCircle size={12} color="var(--accent-cyan)" /> Isolate Endpoint</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
