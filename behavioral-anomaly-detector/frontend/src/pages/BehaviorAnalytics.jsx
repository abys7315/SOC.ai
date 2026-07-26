import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { Activity, Clock, ShieldAlert, MapPin, Database, Server, Zap, AlertTriangle, CheckCircle, Users } from 'lucide-react';
import './BehaviorAnalytics.css';
import UserActivityReportTemplate from './UserActivityReportTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function BehaviorAnalytics() {
  const [entityType, setEntityType] = useState('All');
  const [entity, setEntity] = useState('user_1287');
  const [timeRange, setTimeRange] = useState('30 Days');
  const [key, setKey] = useState(0); // to force re-render charts when filters change
  const [activeTab, setActiveTab] = useState('Overview');
  const [geoData, setGeoData] = useState([]);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/analytics/geo')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error("Error fetching geo data:", err));
  }, []);

  // Heatmap mock data generation (7 days x 24 hours)

  const exportPDF = () => {
    const input = document.getElementById('a4-user-activity-report');
    if (!input) return;
    
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: 794
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('user-activity-report.pdf');
    });
  };

  const generateHeatmapData = (highDensity) => {
    let z = [];
    for (let day = 0; day < 7; day++) {
      let hours = [];
      for (let hour = 0; hour < 24; hour++) {
        // Higher activity during business hours (9-17) on weekdays (day < 5)
        let base = (day < 5 && hour >= 9 && hour <= 17) ? 50 : 5;
        if (highDensity) base *= 2;
        hours.push(Math.floor(Math.random() * 20) + base);
      }
      z.push(hours);
    }
    return z;
  };

  return (
    <div className="analytics-page">
      <div className="glass-panel" style={{display: 'flex', gap: '2rem', padding: '1rem 2rem', marginBottom: '0'}}>
         <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>Entity Type</span>
            <select value={entityType} onChange={e => {setEntityType(e.target.value); setKey(prev => prev + 1);}} style={{background: 'transparent', border: 'none', color: 'white', fontFamily: 'Inter', fontSize: '0.9rem'}}>
              <option value="All">All</option>
              <option value="User">User</option>
              <option value="Service">Service Account</option>
              <option value="Device">Device</option>
            </select>
         </div>
         <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>Entity</span>
            <select value={entity} onChange={e => {setEntity(e.target.value); setKey(prev => prev + 1);}} style={{background: 'transparent', border: 'none', color: 'white', fontFamily: 'Inter', fontSize: '0.9rem'}}>
              <option value="user_1287">user_1287</option>
              <option value="user_8892">user_8892</option>
              <option value="svc_web">svc_web</option>
              <option value="dev_win_44">dev_win_44</option>
            </select>
         </div>
         <div style={{display: 'flex', flexDirection: 'column'}}>
            <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>Time Range</span>
            <select value={timeRange} onChange={e => {setTimeRange(e.target.value); setKey(prev => prev + 1);}} style={{background: 'transparent', border: 'none', color: 'white', fontFamily: 'Inter', fontSize: '0.9rem'}}>
              <option value="7 Days">7 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="90 Days">90 Days</option>
            </select>
         </div>
                  <button className="btn-outline" style={{marginLeft: 'auto'}} onClick={exportPDF}>Export Report</button>
         <button className="btn-outline" onClick={() => {
           setEntityType('All');
           setEntity('user_1287');
           setTimeRange('30 Days');
           setKey(prev => prev + 1);
         }}>Reset Filters</button>
      </div>

      <div className="tabs-container" style={{marginBottom: '0'}}>
        {['Overview', 'Login Patterns', 'Resource Access', 'Session Analysis', 'Geographic Analysis', 'Command Patterns'].map((tab, i) => (
          <div key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>{tab}</div>
        ))}
      </div>

      
      <div className="analytics-grid">
        
        {activeTab === 'Overview' && (
          <>
{/* Activity Overview */}
        <div className="glass-panel" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <h3 className="panel-title">Activity Overview <Activity size={14}/></h3>
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', flex: 1}}>
             <div className="analytics-kpi-card">
                <div className="icon"><Activity size={20} color="var(--accent-cyan)"/></div>
                <div className="val">1,248</div>
                <div className="label">Total Sessions</div>
                <div className="trend pos">+ 18.4%</div>
             </div>
             <div className="analytics-kpi-card">
                <div className="icon"><CheckCircle size={20} color="var(--accent-green)"/></div>
                <div className="val">1,102</div>
                <div className="label">Successful Logins</div>
                <div className="trend pos">+ 6.7%</div>
             </div>
             <div className="analytics-kpi-card">
                <div className="icon"><ShieldAlert size={20} color="var(--accent-red)"/></div>
                <div className="val red">146</div>
                <div className="label">Failed Logins</div>
                <div className="trend neg">+ 32.1%</div>
             </div>
             <div className="analytics-kpi-card">
                <div className="icon"><Clock size={20} color="#f59e0b"/></div>
                <div className="val">42m 18s</div>
                <div className="label">Avg. Session Duration</div>
                <div className="trend pos">+ 8.3%</div>
             </div>
          </div>
        </div>

{/* Risk Score Trend */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Risk Score Trend</h3>
          <Plot
              key={`risk-${key}`}
              data={[{
                x: ['Apr 16', 'Apr 21', 'Apr 26', 'May 01', 'May 06', 'May 11', 'May 15'],
                y: Array.from({length: 7}, () => Math.floor(Math.random() * (95 - 20 + 1) + 20)),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: '#ff003c', width: 2 },
                marker: { size: 6 }
              }]}
              layout={{
                autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: false, color: '#8b9bb4' },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', range: [0, 100] }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
        </div>

{/* Behavioral Summary */}
        <div className="glass-panel">
          <h3 className="panel-title">Behavioral Summary</h3>
          <div className="behavioral-summary-list">
             <div className="bs-item">
               <Clock size={16} color="var(--accent-cyan)"/>
               <div><div className="bs-label">Typical Login Hours</div><div className="bs-val">9:00 AM - 7:00 PM (Weekdays)</div></div>
             </div>
             <div className="bs-item">
               <Activity size={16} color="var(--accent-cyan)"/>
               <div><div className="bs-label">Most Active Days</div><div className="bs-val">Tuesday, Wednesday, Thursday</div></div>
             </div>
             <div className="bs-item">
               <MapPin size={16} color="var(--accent-cyan)"/>
               <div><div className="bs-label">Typical Locations</div><div className="bs-val">Mumbai, India | Bangalore, India</div></div>
             </div>
             <div className="bs-item">
               <ShieldAlert size={16} color="var(--accent-cyan)"/>
               <div><div className="bs-label">Preferred Auth Method</div><div className="bs-val">Password (85%) | Token (15%)</div></div>
             </div>
             <div className="bs-item">
               <Database size={16} color="var(--accent-cyan)"/>
               <div><div className="bs-label">Average Data Access</div><div className="bs-val">1.2 GB per session</div></div>
             </div>
          </div>
        </div>

{/* Anomaly Indicators */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Anomaly Indicators <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Last 30 Days</span></h3>
          <div className="anomaly-indicators-list">
             <div className="ai-item critical">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><AlertTriangle size={16}/> Impossible Travel</div>
               <div className="ai-val">6 instances</div>
             </div>
             <div className="ai-item high">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><ShieldAlert size={16}/> Brute Force Attack</div>
               <div className="ai-val">14 instances</div>
             </div>
             <div className="ai-item critical">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Database size={16}/> Credential Stuffing</div>
               <div className="ai-val">3 instances</div>
             </div>
             <div className="ai-item med">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Server size={16}/> Lateral Movement</div>
               <div className="ai-val">9 instances</div>
             </div>
             <div className="ai-item high">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Zap size={16}/> Device Spoofing</div>
               <div className="ai-val">2 instances</div>
             </div>
             <div className="ai-item high">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Clock size={16}/> Low-and-Slow Exfiltration</div>
               <div className="ai-val">1 instances</div>
             </div>
             <div className="ai-item med">
               <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Activity size={16}/> Insider Drift</div>
               <div className="ai-val">5 instances</div>
             </div>
          </div>
        </div>
          </>
        )}

        {activeTab === 'Login Patterns' && (
          <>
{/* Activity Heatmap */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Activity Heatmap (Day x Hour)</h3>
          <Plot
            data={[{
              z: generateHeatmapData(false),
              x: Array.from({length: 24}, (_, i) => i),
              y: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
              type: 'heatmap',
              colorscale: [
                ['0.0', 'rgba(0, 240, 255, 0.05)'],
                ['0.5', 'rgba(0, 240, 255, 0.5)'],
                ['1.0', 'rgba(255, 0, 60, 0.8)']
              ],
              showscale: false
            }]}
            layout={{
              autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { color: '#8b9bb4', dtick: 2 },
              yaxis: { color: '#8b9bb4' }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{width: '100%', height: '350px'}}
          />
        </div>

{/* Login Activity by Hour */}
        <div className="glass-panel">
          <h3 className="panel-title">Login Activity by Hour (Average)</h3>
          <Plot
              data={[{
                x: Array.from({length: 24}, (_, i) => i),
                y: [5, 2, 1, 3, 10, 40, 80, 120, 150, 140, 130, 100, 110, 120, 90, 80, 50, 30, 20, 15, 10, 8, 6, 5],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#3b82f6', width: 2, shape: 'spline' },
                fill: 'tozeroy',
                fillcolor: 'rgba(59, 130, 246, 0.1)'
              }]}
              layout={{
                autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: false, color: '#8b9bb4', dtick: 4 },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
        </div>
          </>
        )}

        {activeTab === 'Resource Access' && (
          <>
{/* Top Accessed Resources */}
        <div className="glass-panel">
          <h3 className="panel-title">Top Accessed Resources</h3>
          <table className="alerts-table" style={{marginTop: '0'}}>
             <thead>
               <tr><th>Resource</th><th>Type</th><th>Access Count</th></tr>
             </thead>
             <tbody>
               <tr><td>Server-07</td><td>Server</td><td>342</td></tr>
               <tr><td>DB-03 (Finance)</td><td>Database</td><td>256</td></tr>
               <tr><td>Code Repo (Jira)</td><td>Application</td><td>188</td></tr>
               <tr><td>File Server</td><td>Server</td><td>142</td></tr>
               <tr><td>Analytics API</td><td>API</td><td>68</td></tr>
             </tbody>
          </table>
        </div>

{/* Resource Access Heatmap */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Resource Access Heatmap</h3>
          <Plot
            data={[{
              z: generateHeatmapData(true),
              x: Array.from({length: 24}, (_, i) => i),
              y: ['Server-07', 'DB-03', 'Code Repo', 'File Server', 'HR Portal', 'Analytics API'],
              type: 'heatmap',
              colorscale: [
                ['0.0', 'rgba(139, 92, 246, 0.05)'],
                ['0.5', 'rgba(139, 92, 246, 0.5)'],
                ['1.0', 'rgba(139, 92, 246, 1.0)']
              ],
              showscale: false
            }]}
            layout={{
              autosize: true, margin: { t: 10, b: 20, l: 80, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { color: '#8b9bb4', dtick: 2 },
              yaxis: { color: '#8b9bb4' }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{width: '100%', height: '350px'}}
          />
        </div>
          </>
        )}

        {activeTab === 'Session Analysis' && (
          <>
{/* Session Duration Distribution */}
        <div className="glass-panel">
          <h3 className="panel-title">Session Duration Distribution</h3>
          <div style={{position: 'relative', height: '350px'}}>
            <Plot
                data={[{
                  values: [15, 30, 25, 20, 10],
                  labels: ['0 - 5 min', '5 - 15 min', '15 - 30 min', '30 - 60 min', '> 1 hour'],
                  type: 'pie',
                  hole: 0.7,
                  marker: { colors: ['#ff003c', '#f59e0b', '#00ff88', '#00f0ff', '#3b82f6'] },
                  textinfo: 'none'
                }]}
                layout={{
                  autosize: true, margin: { t: 10, b: 10, l: 10, r: 100 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                  showlegend: true, legend: { font: { color: '#8b9bb4', size: 10 } }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{width: '100%', height: '350px'}}
              />
              <div style={{position: 'absolute', top: '50%', left: 'calc(50% - 50px)', transform: 'translate(-50%, -50%)', textAlign: 'center'}}>
                 <div style={{fontSize: '1.5rem', fontWeight: 'bold', fontFamily: 'Orbitron'}}>1,248</div>
                 <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>Sessions</div>
              </div>
          </div>
        </div>

        {/* Concurrent Sessions over Time */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Concurrent Sessions over Time</h3>
          <Plot
              data={[{
                x: ['Apr 16', 'Apr 18', 'Apr 20', 'Apr 22', 'Apr 24', 'Apr 26', 'Apr 28', 'May 02', 'May 06', 'May 10', 'May 15'],
                y: [10, 15, 12, 18, 25, 20, 15, 12, 10, 30, 45],
                type: 'scatter',
                mode: 'lines',
                line: { color: '#00f0ff', width: 2, shape: 'spline' },
                fill: 'tozeroy',
                fillcolor: 'rgba(0, 240, 255, 0.1)'
              }]}
              layout={{
                autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: false, color: '#8b9bb4' },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
        </div>
          </>
        )}

        {activeTab === 'Geographic Analysis' && (
          <>
{/* Geographic Activity */}
        <div className="glass-panel col-span-3">
          <h3 className="panel-title">
            Geographic Activity & IP User Mapping
            <button 
              onClick={() => setIsMapExpanded(!isMapExpanded)} 
              style={{float: 'right', background: 'transparent', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer'}}
            >
              {isMapExpanded ? 'Collapse Map' : 'Expand Map'}
            </button>
          </h3>
          <div style={{display: 'flex', height: isMapExpanded ? '600px' : '350px'}}>
            <div style={{flex: 1, position: 'relative'}}>
               <Plot
                  data={[{
                    type: 'scattergeo',
                    mode: 'markers',
                    text: geoData.length > 0 ? geoData.map(g => `${g.location}<br>${g.event_count} Events<br>${g.users.length} Users`) : [],
                    hoverinfo: 'text',
                    lon: geoData.length > 0 ? geoData.map(g => {
                      if (g.location === 'New York') return -74.006;
                      if (g.location === 'London') return -0.1277;
                      if (g.location === 'Mumbai') return 72.8777;
                      const h = Array.from(g.location).reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      return Math.sin(h * 1.3) * 180;
                    }) : [],
                    lat: geoData.length > 0 ? geoData.map(g => {
                      if (g.location === 'New York') return 40.7128;
                      if (g.location === 'London') return 51.5074;
                      if (g.location === 'Mumbai') return 19.0760;
                      const h = Array.from(g.location).reduce((acc, char) => acc + char.charCodeAt(0), 0);
                      return Math.cos(h * 2.7) * 60; // Keep latitude mostly between -60 and 60 where land is
                    }) : [],
                    marker: { size: 10, color: '#00f0ff', line: {width: 2, color: 'white'} },
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
                    margin: { l: 0, r: 0, t: 0, b: 0 }, paper_bgcolor: 'rgba(0,0,0,0)',
                  }}
                  config={{ displayModeBar: isMapExpanded, responsive: true, scrollZoom: isMapExpanded }}
                  style={{width: '100%', height: '100%'}}
                />
            </div>
            
            {!isMapExpanded && (
            <div style={{flex: 1.5, paddingLeft: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto'}}>
               <table className="alerts-table" style={{marginTop: 0}}>
                 <thead>
                   <tr>
                     <th>IP Address</th>
                     <th>Location</th>
                     <th>Events</th>
                     <th>Associated Users</th>
                   </tr>
                 </thead>
                 <tbody>
                   {geoData.length > 0 ? geoData.map((geo, i) => (
                     <tr key={i}>
                       <td style={{color: 'var(--accent-cyan)'}}>{geo.ip}</td>
                       <td>{geo.location}</td>
                       <td>{geo.event_count}</td>
                       <td>
                         <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px'}}>
                           {geo.users.map((u, j) => (
                             <span key={j} style={{background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem'}}>
                               {u}
                             </span>
                           ))}
                         </div>
                       </td>
                     </tr>
                   )) : (
                     <tr><td colSpan="4" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>Loading geographic data...</td></tr>
                   )}
                 </tbody>
               </table>
            </div>
            )}
          </div>
        </div>
          </>
        )}

        {activeTab === 'Command Patterns' && (
          <>
        {/* Top CLI Commands Executed */}
        <div className="glass-panel">
          <h3 className="panel-title">Top CLI Commands Executed</h3>
          <table className="alerts-table" style={{marginTop: '0'}}>
             <thead>
               <tr><th>Command</th><th>Frequency</th><th>Risk Level</th></tr>
             </thead>
             <tbody>
               <tr><td><code style={{color: 'var(--accent-cyan)'}}>kubectl get pods</code></td><td>245</td><td>Low</td></tr>
               <tr><td><code style={{color: 'var(--accent-cyan)'}}>ssh admin@prod-db</code></td><td>82</td><td style={{color: '#f59e0b'}}>Medium</td></tr>
               <tr><td><code style={{color: 'var(--accent-cyan)'}}>aws s3 sync</code></td><td>45</td><td>Low</td></tr>
               <tr><td><code style={{color: 'var(--accent-cyan)'}}>chmod 777 /var/www</code></td><td>12</td><td style={{color: 'var(--accent-red)'}}>High</td></tr>
               <tr><td><code style={{color: 'var(--accent-cyan)'}}>curl http://10.0...</code></td><td>8</td><td style={{color: 'var(--accent-red)'}}>High</td></tr>
             </tbody>
          </table>
        </div>

        {/* Command Risk Distribution */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Command Risk Distribution</h3>
          <Plot
              data={[
                { x: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'], y: [420, 85, 24, 3], type: 'bar', marker: { color: ['#00ff88', '#f59e0b', '#ff003c', '#990000'] } }
              ]}
              layout={{
                autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
                xaxis: { showgrid: false, color: '#8b9bb4' },
                yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
              }}
              config={{ displayModeBar: false, responsive: true }}
              style={{width: '100%', height: '350px'}}
            />
        </div>
          </>
        )}

      </div>

      {/* Hidden A4 Template for PDF Export */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <UserActivityReportTemplate />
      </div>
    </div>
  );
}
