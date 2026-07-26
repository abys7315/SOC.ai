import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { ShieldCheck, Activity, Users, Target, AlertTriangle, X, ShieldAlert, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import './Dashboard.css';
import { API_BASE, WS_BASE } from '../config';


export default function Dashboard({ alerts }) {
  const [isolatedEntities, setIsolatedEntities] = useState(new Set());
  const [isolateModalOpen, setIsolateModalOpen] = useState(null);
  const exportPDF = () => {
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.setFontSize(22);
    pdf.setTextColor(40, 40, 40);
    pdf.text('System Security & Performance Report', 20, 30);
    
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40);
    
    pdf.setLineWidth(0.5);
    pdf.setDrawColor(200, 200, 200);
    pdf.line(20, 45, 190, 45);
    
    pdf.setFontSize(16);
    pdf.setTextColor(40, 40, 40);
    pdf.text('Key Performance Indicators', 20, 60);
    
    pdf.setFontSize(12);
    pdf.setTextColor(60, 60, 60);
    
    let yPos = 75;
    const metrics = [
      { label: 'Total Events (24h)', value: totalEvents },
      { label: 'Active Alerts', value: activeAlerts },
      { label: 'High Risk Entities', value: riskyEntities },
      { label: 'Detection Accuracy', value: detectionAccuracy },
      { label: 'Average Risk Score', value: avgRiskScore },
      { label: 'Events Per Second', value: eventsPerSec }
    ];
    
    metrics.forEach(m => {
      pdf.text(`${m.label}:`, 25, yPos);
      pdf.setFont('helvetica', 'bold');
      pdf.text(String(m.value), 100, yPos);
      pdf.setFont('helvetica', 'normal');
      yPos += 15;
    });
    
    pdf.save('dashboard-report.pdf');
  };

  const [liveMetrics, setLiveMetrics] = useState({
    events_per_sec: 0,
    cpu_usage: 0,
    ram_usage: 0,
    total_events: 1240000,
    accuracy: 96.2,
    throughput_history: Array(30).fill(0)
  });

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/metrics`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'metrics_update') {
        setLiveMetrics(prev => {
          const newHistory = [...prev.throughput_history, data.data.events_per_sec].slice(-30);
          return {
            events_per_sec: data.data.events_per_sec,
            cpu_usage: data.data.cpu_usage,
            ram_usage: data.data.ram_usage,
            total_events: data.data.total_events || prev.total_events,
            accuracy: data.data.accuracy || prev.accuracy,
            throughput_history: newHistory
          };
        });
      }
    };
    return () => ws.close();
  }, []);

  const dummyAlerts = [
    { id: 'mock-1', timestamp: new Date(Date.now() - 300000).toISOString(), entity_id: 'user_1287', anomaly_type: 'impossible_travel', risk_score: 0.92, explanation: 'Logged in from two distant locations.', event_details: { action: 'api/login', source_ip: '45.33.12.9' } },
    { id: 'mock-2', timestamp: new Date(Date.now() - 600000).toISOString(), entity_id: 'svc_web', anomaly_type: 'brute_force', risk_score: 0.75, explanation: 'Multiple failed logins.', event_details: { action: 'api/auth', source_ip: '10.10.45.22' } },
    { id: 'mock-3', timestamp: new Date(Date.now() - 900000).toISOString(), entity_id: 'user_8892', anomaly_type: 'lateral_movement', risk_score: 0.85, explanation: 'Accessing unauthorized servers.', event_details: { action: 'ssh', source_ip: '192.168.1.15' } },
    { id: 'mock-4', timestamp: new Date(Date.now() - 1200000).toISOString(), entity_id: 'dev_win_44', anomaly_type: 'data_exfiltration', risk_score: 0.45, explanation: 'Unusual large upload.', event_details: { action: 'ftp_upload', source_ip: '10.10.10.50' } },
    { id: 'mock-5', timestamp: new Date(Date.now() - 1500000).toISOString(), entity_id: 'user_1287', anomaly_type: 'credential_stuffing', risk_score: 0.88, explanation: 'Multiple logins across accounts.', event_details: { action: 'api/login', source_ip: '45.33.12.9' } },
    { id: 'mock-6', timestamp: new Date(Date.now() - 1800000).toISOString(), entity_id: 'dev_mac_09', anomaly_type: 'device_spoofing', risk_score: 0.65, explanation: 'New device footprint.', event_details: { action: 'vpn_connect', source_ip: '102.44.2.1' } }
  ];
  
  const activeAlertsSource = alerts && alerts.length > 0 ? alerts : dummyAlerts;
  const displayAlerts = activeAlertsSource.filter(a => !isolatedEntities.has(a.entity_id));
  // Aggregate Metrics
  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const totalEvents = formatNumber(liveMetrics.total_events);
  const activeAlerts = displayAlerts.length;
  
  // Calculate high risk entities from alerts
  const riskyEntities = new Set(displayAlerts.filter(a => a.risk_score > 0.5).map(a => a.entity_id)).size;
  
  const detectionAccuracy = `${liveMetrics.accuracy}%`;
  
  const avgRiskScore = activeAlertsSource.length > 0 
    ? (activeAlertsSource.reduce((sum, a) => sum + a.risk_score, 0) / activeAlertsSource.length * 100).toFixed(0) 
    : 0;

  const eventsPerSec = liveMetrics.events_per_sec;

  // Prepare Chart Data
  const threatData = activeAlertsSource.reduce((acc, alert) => {
    if (alert.risk_score > 0.5) {
      acc[alert.anomaly_type] = (acc[alert.anomaly_type] || 0) + 1;
    }
    return acc;
  }, {});

  const severityData = {
    critical: displayAlerts.filter(a => a.risk_score > 0.8).length,
    high: displayAlerts.filter(a => a.risk_score > 0.6 && a.risk_score <= 0.8).length,
    medium: displayAlerts.filter(a => a.risk_score > 0.4 && a.risk_score <= 0.6).length,
    low: displayAlerts.filter(a => a.risk_score <= 0.4).length
  };

  const handleIsolate = async () => {
    if (isolateModalOpen) {
      try {
        await fetch(`${API_BASE}/api/alerts/${isolateModalOpen.id || "mock"}/action`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'isolated' })
        });
        setIsolatedEntities(prev => new Set([...prev, isolateModalOpen.entity_id]));
        setIsolateModalOpen(null);
      } catch (e) {
        console.error("Isolate failed", e);
        setIsolateModalOpen(null);
      }
    }
  };

  return (
    <div className="dashboard-page" id="dashboard-report-content">
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem'}}>
        <button onClick={exportPDF} className="btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '4px', cursor: 'pointer'}}>
          <Download size={14}/> Generate Report
        </button>
      </div>
      {/* KPI Row */}
      <div className="kpi-row">
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Activity size={24} color="var(--accent-cyan)" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>Total Events<br/>(24h)</React.Fragment></span>
            <span className="kpi-value cyan">{totalEvents}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><AlertTriangle size={24} color="var(--accent-red)" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>Active<br/>Alerts</React.Fragment></span>
            <span className="kpi-value red">{activeAlerts}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Users size={24} color="#f59e0b" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>High Risk<br/>Entities</React.Fragment></span>
            <span className="kpi-value orange">{riskyEntities}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Target size={24} color="var(--accent-green)" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>Detection<br/>Accuracy (24h)</React.Fragment></span>
            <span className="kpi-value green">{detectionAccuracy}</span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><ShieldCheck size={24} color="var(--accent-magenta)" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>Avg. Risk<br/>Score</React.Fragment></span>
            <span className="kpi-value magenta">{avgRiskScore}<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/100</span></span>
          </div>
        </div>
        <div className="kpi-card glass-panel">
          <div className="kpi-icon"><Activity size={24} color="var(--accent-cyan)" /></div>
          <div className="kpi-content">
            <span className="kpi-label"><React.Fragment>Events / Sec<br/>(Live)</React.Fragment></span>
            <span className="kpi-value cyan">{eventsPerSec}</span>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        {/* Left Column */}
        <div className="grid-left">
          
          <div className="glass-panel" style={{height: '300px', padding: '1rem'}}>
             <h3 className="panel-title">Event Throughput <span>Events / sec</span></h3>
             {/* Live Throughput Chart */}
             <Plot
                data={[{
                  y: liveMetrics.throughput_history.length > 0 ? liveMetrics.throughput_history : [0,0,0,0,0,0,0,0,0],
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'var(--accent-cyan)', width: 2 },
                  fill: 'tozeroy',
                  fillcolor: 'rgba(0, 240, 255, 0.1)'
                }]}
                layout={{
                  autosize: true,
                  margin: { t: 10, b: 20, l: 30, r: 10 },
                  paper_bgcolor: 'rgba(0,0,0,0)',
                  plot_bgcolor: 'rgba(0,0,0,0)',
                  xaxis: { showgrid: false, color: '#8b9bb4' },
                  yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
                }}
                config={{ displayModeBar: false, responsive: true }}
                style={{width: '100%', height: 'calc(100% - 30px)'}}
              />
          </div>

          <div className="bottom-charts-row">
            <div className="glass-panel" style={{height: '250px', padding: '1rem'}}>
              <h3 className="panel-title">Alerts by Attack Type</h3>
              {Object.keys(threatData).length > 0 ? (
                <Plot
                  data={[{
                    values: Object.values(threatData),
                    labels: Object.keys(threatData).map(k => k.replace('_', ' ').toUpperCase()),
                    type: 'pie',
                    hole: 0.7,
                    marker: { colors: ['#ff003c', '#00f0ff', '#ff00ff', '#00ff88', '#f59e0b', '#3b82f6'] },
                    textinfo: 'none'
                  }]}
                  layout={{
                    autosize: true,
                    margin: { t: 10, b: 10, l: 10, r: 100 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    showlegend: true,
                    legend: { font: { family: 'Inter', size: 10, color: '#8b9bb4' } }
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{width: '100%', height: 'calc(100% - 30px)'}}
                />
              ) : (
                <div className="empty-state">No Active Threats</div>
              )}
            </div>
            
            <div className="glass-panel" style={{height: '250px', padding: '1rem'}}>
              <h3 className="panel-title">Alerts by Severity</h3>
              <Plot
                  data={[{
                    x: ['Critical', 'High', 'Medium', 'Low'],
                    y: [severityData.critical, severityData.high, severityData.medium, severityData.low],
                    type: 'bar',
                    marker: { color: ['#ff003c', '#f59e0b', '#3b82f6', '#00ff88'] }
                  }]}
                  layout={{
                    autosize: true,
                    margin: { t: 10, b: 30, l: 30, r: 10 },
                    paper_bgcolor: 'rgba(0,0,0,0)',
                    plot_bgcolor: 'rgba(0,0,0,0)',
                    xaxis: { color: '#8b9bb4' },
                    yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' }
                  }}
                  config={{ displayModeBar: false, responsive: true }}
                  style={{width: '100%', height: 'calc(100% - 30px)'}}
                />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="grid-right">
          <div className="glass-panel" style={{height: '100%', padding: '1rem', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h3 className="panel-title" style={{margin: 0}}>Live Event Stream</h3>
              <span style={{fontSize: '0.8rem', color: 'var(--accent-cyan)'}}>View All</span>
            </div>
            
            <div className="table-container">
              <div className="table-responsive"><table className="stream-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Entity</th>
                    <th>Event Type</th>
                    <th>Risk Score</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayAlerts.slice(0, 15).map(alert => {
                    const isCritical = alert.risk_score > 0.8;
                    const isWarning = alert.risk_score > 0.5 && alert.risk_score <= 0.8;
                    let color = '#00ff88';
                    if (isCritical) color = '#ff003c';
                    else if (isWarning) color = '#f59e0b';
                    
                    return (
                      <tr key={alert.id}>
                        <td>{new Date(alert.timestamp).toLocaleTimeString()}</td>
                        <td>{alert.entity_id}</td>
                        <td style={{color: color}}>{alert.anomaly_type.replace('_', ' ').toUpperCase()}</td>
                        <td style={{color: color, fontWeight: 'bold'}}>{(alert.risk_score * 100).toFixed(0)}</td>
                        <td>
                          <button 
                            style={{background: 'rgba(255, 0, 60, 0.2)', border: '1px solid var(--accent-red)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '4px', cursor: 'pointer', fontSize: '0.7rem'}}
                            onClick={(e) => { e.stopPropagation(); setIsolateModalOpen(alert); }}
                          >
                            Isolate
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table></div>
              {displayAlerts.length === 0 && (
                <div className="empty-state" style={{marginTop: '2rem'}}>AWAITING TELEMETRY...</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {isolateModalOpen && (
        <div style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'}}>
          <div className="glass-panel" style={{padding: '2rem', maxWidth: '400px', width: '100%', position: 'relative'}}>
            <button className="mobile-close-btn" style={{position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)'}} onClick={() => setIsolateModalOpen(null)}><X size={20}/></button>
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--accent-red)'}}>
              <ShieldAlert size={32} />
              <h2 style={{margin: 0, fontSize: '1.2rem'}}>Isolate Entity</h2>
            </div>
            <p style={{color: 'var(--text-secondary)', marginBottom: '2rem'}}>Are you sure you want to isolate <strong>{isolateModalOpen.entity_id}</strong>? This will revoke all network access and terminate active sessions immediately.</p>
            <div style={{display: 'flex', gap: '1rem'}}>
              <button className="btn-outline" style={{flex: 1}} onClick={() => setIsolateModalOpen(null)}>Cancel</button>
              <button className="btn-solid-red" style={{flex: 1}} onClick={handleIsolate}>Confirm Isolate</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
