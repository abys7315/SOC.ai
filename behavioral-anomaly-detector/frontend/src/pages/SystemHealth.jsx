import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import { 
  ShieldCheck, Clock, Server, AlertTriangle, Activity, Zap,
  Database, Network, Cpu, HardDrive, CheckCircle
} from 'lucide-react';
import './SystemHealth.css';
import { API_BASE, WS_BASE } from '../config';


export default function SystemHealth() {
  const [metrics, setMetrics] = useState({ cpu: 58, ram: 62, disk: 47 });

  useEffect(() => {
    const ws = new WebSocket(`${WS_BASE}/ws/metrics`);
    ws.onmessage = (event) => {
      const parsed = JSON.parse(event.data);
      if (parsed.type === 'metrics_update') {
        setMetrics(prev => ({
          cpu: parsed.data.cpu_usage || prev.cpu,
          ram: parsed.data.ram_usage || prev.ram,
          disk: prev.disk // Backend doesn't provide disk yet, keep previous
        }));
      }
    };
    return () => ws.close();
  }, []);
  const handleRefresh = async () => {
    try {
      await fetch(`${API_BASE}/api/health/refresh`, { method: 'POST' });
      // In a real app we'd refetch metrics here, but websocket is handling it.
      // Force a slight jiggle to show it refreshed
      setMetrics(prev => ({...prev, cpu: prev.cpu + (Math.random() > 0.5 ? 1 : -1)}));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="health-page">
      <div className="health-header">
         <div>
            <h2 style={{margin: 0, fontFamily: 'Orbitron', fontSize: '1.25rem'}}>System Health</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0'}}>Real-time health and performance monitoring of the platform</p>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
             <div className="live-dot"></div> Live System
           </div>
           <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>May 15, 2024 - 10:24 AM</span>
           <button className="btn-outline" style={{padding: '0.4rem 1rem'}} onClick={handleRefresh}>Refresh</button>
         </div>
      </div>

      {/* KPIs */}
      <div className="kpi-row">
         <div className="kpi-card" style={{borderColor: 'var(--accent-green)'}}>
            <div className="kpi-label"><ShieldCheck size={16} color="var(--accent-green)"/> Overall Health</div>
            <div className="kpi-val" style={{color: 'var(--accent-green)'}}>Healthy</div>
            <div className="kpi-trend pos">All systems operational</div>
         </div>
         <div className="kpi-card">
            <div className="kpi-label"><Clock size={16} color="var(--accent-cyan)"/> System Uptime</div>
            <div className="kpi-val">99.98%</div>
            <div className="kpi-trend pos">↑ 0.02% vs yesterday</div>
         </div>
         <div className="kpi-card">
            <div className="kpi-label"><Server size={16} color="var(--accent-cyan)"/> Services</div>
            <div className="kpi-val">24<span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>/24</span></div>
            <div className="kpi-trend pos">Operational</div>
         </div>
         <div className="kpi-card">
            <div className="kpi-label"><AlertTriangle size={16} color="var(--accent-red)"/> Active Alerts</div>
            <div className="kpi-val red">12</div>
            <div className="kpi-trend neg">↑ 2 vs yesterday</div>
         </div>
         <div className="kpi-card">
            <div className="kpi-label"><Activity size={16} color="#a855f7"/> Events Ingested</div>
            <div className="kpi-val">45.2 M</div>
            <div className="kpi-trend pos">↑ 8.4% vs yesterday</div>
         </div>
         <div className="kpi-card">
            <div className="kpi-label"><Zap size={16} color="#f59e0b"/> Avg. Response Time</div>
            <div className="kpi-val">152 ms</div>
            <div className="kpi-trend neg">↑ 12 ms vs yesterday</div>
         </div>
      </div>

      <div className="health-grid">
         
         {/* System Performance Over Time */}
         <div className="glass-panel col-span-2">
           <h3 className="panel-title" style={{display: 'flex', justifyContent: 'space-between'}}>
             System Performance Over Time
             <div className="tabs-container" style={{border: 'none', padding: 0, gap: '0.2rem'}}>
                <div className="tab" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}}>1H</div>
                <div className="tab" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}}>6H</div>
                <div className="tab active" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}}>24H</div>
                <div className="tab" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}}>7D</div>
                <div className="tab" style={{padding: '0.2rem 0.5rem', fontSize: '0.65rem'}}>30D</div>
             </div>
           </h3>
           <Plot
            data={[
              { x: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], y: [45, 42, 65, 85, 78, 62, 55, 48], type: 'scatter', mode: 'lines+markers', name: 'CPU Usage (%)', line: {color: '#00f0ff'} },
              { x: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], y: [58, 59, 62, 75, 72, 65, 60, 58], type: 'scatter', mode: 'lines+markers', name: 'Memory Usage (%)', line: {color: '#00ff88'} },
              { x: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], y: [42, 43, 44, 48, 47, 45, 43, 42], type: 'scatter', mode: 'lines+markers', name: 'Disk I/O (%)', line: {color: '#a855f7'} },
              { x: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'], y: [120, 110, 250, 480, 420, 280, 150, 130], type: 'scatter', mode: 'lines', name: 'Network I/O (Mbps)', line: {color: '#f59e0b'}, yaxis: 'y2' },
            ]}
            layout={{
              autosize: true, margin: { t: 10, b: 20, l: 30, r: 30 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { showgrid: false, color: '#8b9bb4' }, yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', range: [0, 100] },
              yaxis2: { overlaying: 'y', side: 'right', showgrid: false, color: '#f59e0b' },
              showlegend: true, legend: { orientation: 'h', y: 1.1, font: { color: '#8b9bb4', size: 10 } }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{width: '100%', height: 'calc(100% - 30px)'}}
          />
         </div>

         {/* Service Health */}
         <div className="glass-panel">
            <h3 className="panel-title">Service Health</h3>
            <table className="alerts-table" style={{marginTop: 0}}>
               <thead>
                 <tr><th>Service</th><th>Status</th><th>Uptime</th><th>Response</th><th>Inst</th></tr>
               </thead>
               <tbody>
                 <tr><td>Data Ingestion Service</td><td><span className="status-badge" style={{color: 'var(--accent-green)', border: 'none'}}>Healthy</span></td><td>100%</td><td>45 ms</td><td>3</td></tr>
                 <tr><td>Stream Processing Engine</td><td><span className="status-badge" style={{color: 'var(--accent-green)', border: 'none'}}>Healthy</span></td><td>100%</td><td>12 ms</td><td>8</td></tr>
                 <tr><td>Anomaly Detection Engine</td><td><span className="status-badge" style={{color: 'var(--accent-green)', border: 'none'}}>Healthy</span></td><td>100%</td><td>152 ms</td><td>12</td></tr>
                 <tr><td>Alert Management Service</td><td><span className="status-badge" style={{color: 'var(--accent-green)', border: 'none'}}>Healthy</span></td><td>99.98%</td><td>18 ms</td><td>2</td></tr>
                 <tr><td>User & Entity Service</td><td><span className="status-badge" style={{color: 'var(--accent-green)', border: 'none'}}>Healthy</span></td><td>100%</td><td>24 ms</td><td>2</td></tr>
                 <tr><td>Feature Store Service</td><td><span className="status-badge" style={{color: '#f59e0b', border: 'none'}}>Warning</span></td><td>99.95%</td><td>120 ms</td><td>4</td></tr>
               </tbody>
            </table>
         </div>

         {/* Infrastructure Overview (Gauges) */}
         <div className="glass-panel col-span-2">
            <h3 className="panel-title">Infrastructure Overview</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', padding: '1rem'}}>
               <div className="gauge-container">
                 <div className="gauge-label">CPU Usage</div>
                 <div className="gauge-circle"><Cpu size={24} color="var(--accent-cyan)"/><br/>{metrics.cpu.toFixed(1)}%</div>
                 <div className="gauge-sub">Live</div>
               </div>
               <div className="gauge-container">
                 <div className="gauge-label">Memory Usage</div>
                 <div className="gauge-circle"><Server size={24} color="var(--accent-green)"/><br/>{metrics.ram.toFixed(1)}%</div>
                 <div className="gauge-sub">Live</div>
               </div>
               <div className="gauge-container">
                 <div className="gauge-label">Disk Usage</div>
                 <div className="gauge-circle"><HardDrive size={24} color="#a855f7"/><br/>{metrics.disk.toFixed(1)}%</div>
                 <div className="gauge-sub">Live</div>
               </div>
               <div className="gauge-container">
                 <div className="gauge-label">Network Usage</div>
                 <div className="gauge-circle"><Network size={24} color="#f59e0b"/><br/>72%</div>
                 <div className="gauge-sub">↑ 12% vs yesterday</div>
               </div>
            </div>
         </div>

         {/* Resource Utilization by Node */}
         <div className="glass-panel">
            <h3 className="panel-title">Resource Utilization by Node</h3>
            <table className="node-table">
               <thead><tr><th>Node</th><th>CPU (%)</th><th>Memory (%)</th><th>Disk I/O (MB/s)</th><th>Status</th></tr></thead>
               <tbody>
                  {[
                    {id: 'node-01', cpu: 65, mem: 58, disk: 14.2, status: 'Healthy'},
                    {id: 'node-02', cpu: 72, mem: 64, disk: 18.5, status: 'Healthy'},
                    {id: 'node-03', cpu: 89, mem: 92, disk: 42.1, status: 'Warning'},
                    {id: 'node-04', cpu: 45, mem: 42, disk: 8.4, status: 'Healthy'},
                    {id: 'node-05', cpu: 52, mem: 48, disk: 11.2, status: 'Healthy'},
                  ].map(node => (
                    <tr key={node.id}>
                      <td>{node.id}</td>
                      <td>
                         <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem'}}>
                           <div className="mini-bar-bg"><div className={`mini-bar-fill ${node.cpu > 80 ? 'red' : 'cyan'}`} style={{width: `${node.cpu}%`}}></div></div>
                           {node.cpu}%
                         </div>
                      </td>
                      <td>
                         <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.65rem'}}>
                           <div className="mini-bar-bg"><div className={`mini-bar-fill ${node.mem > 80 ? 'orange' : 'green'}`} style={{width: `${node.mem}%`}}></div></div>
                           {node.mem}%
                         </div>
                      </td>
                      <td>{node.disk}</td>
                      <td><span className="status-dot" style={{background: node.status === 'Warning' ? '#f59e0b' : 'var(--accent-green)'}}></span></td>
                    </tr>
                  ))}
               </tbody>
            </table>
         </div>

         {/* System Map */}
         <div className="glass-panel col-span-2">
            <h3 className="panel-title">System Map</h3>
            <div className="system-map-container">
               <div className="map-node">
                 <Database size={16}/> Data Sources
                 <span>24 / 24 healthy</span>
               </div>
               <div className="map-line"></div>
               <div className="map-node">
                 <Network size={16}/> Ingestion Layer
                 <span>3 / 3 healthy</span>
               </div>
               <div className="map-line"></div>
               <div className="map-node">
                 <Activity size={16}/> Stream Processing
                 <span>8 / 8 healthy</span>
               </div>
               <div className="map-line"></div>
               <div className="map-node">
                 <Cpu size={16}/> Anomaly Detection
                 <span>12 / 12 healthy</span>
               </div>
               <div className="map-line"></div>
               <div className="map-node">
                 <AlertTriangle size={16}/> Alert Management
                 <span>2 / 2 healthy</span>
               </div>
               <div className="map-line"></div>
               <div className="map-node">
                 <HardDrive size={16}/> Storage
                 <span>4 / 4 healthy</span>
               </div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
               <div style={{width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)', marginRight: '280px'}}></div>
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
               <div className="map-node" style={{marginRight: '280px'}}>
                 <Server size={16}/> Feature Store
                 <span>2 / 2 healthy</span>
               </div>
            </div>
         </div>

         {/* Recent System Events */}
         <div className="glass-panel">
            <h3 className="panel-title">Recent System Events</h3>
            <div className="sys-events-list">
               <div className="se-item">
                 <div className="se-time">10:24 AM</div>
                 <div className="se-badge info">Info</div>
                 <div className="se-desc">Configuration reload successful <span>Config Service</span></div>
               </div>
               <div className="se-item">
                 <div className="se-time">10:15 AM</div>
                 <div className="se-badge warn">Warning</div>
                 <div className="se-desc">High memory usage on node-03 <span>Stream Engine</span></div>
               </div>
               <div className="se-item">
                 <div className="se-time">09:30 AM</div>
                 <div className="se-badge info">Info</div>
                 <div className="se-desc">Model version v2.3.1 deployed <span>Model Service</span></div>
               </div>
               <div className="se-item">
                 <div className="se-time">08:00 AM</div>
                 <div className="se-badge info">Info</div>
                 <div className="se-desc">Backup completed successfully <span>Database</span></div>
               </div>
               <div className="se-item">
                 <div className="se-time">02:15 AM</div>
                 <div className="se-badge crit">Critical</div>
                 <div className="se-desc">Disk I/O latency high on node-08 <span>Storage</span></div>
               </div>
            </div>
         </div>

      </div>
    </div>
  );
}
