import React from 'react';
import Plot from 'react-plotly.js';
import { Download, Info, CheckCircle, AlertTriangle, TrendingUp, TrendingDown, Activity, Check, Database, User, FileText } from 'lucide-react';
import './Evaluation.css';
import EvaluationReportTemplate from './EvaluationReportTemplate';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Evaluation() {
  

  const exportPDF = () => {
    const input = document.getElementById('a4-evaluation-report');
    if (!input) return;
    
    // Temporarily make it visible for html2canvas (if we render it hidden via CSS)
    // Actually, if it's rendered inside a 0-height absolute div, html2canvas can still read it without display: none.
    
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      windowWidth: 794 // A4 width at 96dpi approx to avoid wrapping
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('evaluation-report.pdf');
    });
  };

  const sparklineLayout = {
    autosize: true, margin: { l: 0, r: 0, t: 5, b: 5 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
    xaxis: { showgrid: false, zeroline: false, visible: false }, yaxis: { showgrid: false, zeroline: false, visible: false }
  };

  return (
    <div className="eval-page">
      <div className="eval-header">
         <div>
            <h2 style={{margin: 0, fontFamily: 'Orbitron', fontSize: '1.25rem'}}>Evaluation Dashboard</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0'}}>Model and system performance evaluation</p>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
             <div className="live-dot"></div> Live System
           </div>
           <span style={{color: 'var(--text-secondary)', fontSize: '0.8rem'}}>Jul 21, 2026 - Jul 22, 2026</span>
           <button onClick={exportPDF} className="btn-outline" style={{display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem'}}><Download size={14}/> Export Report</button>
         </div>
      </div>

      <div className="eval-filters">
        <div className="filter-item">
          <label>Model Version</label>
          <select><option>All Versions</option></select>
        </div>
        <div className="filter-item">
          <label>Time Range</label>
          <select><option>Jul 19, 2026 - Jul 20, 2026</option></select>
        </div>
        <div className="filter-item">
          <label>Target Entity</label>
          <select><option>All Entities</option></select>
        </div>
        <div className="filter-item">
          <label>Attack Type</label>
          <select><option>All Types</option></select>
        </div>
        <div className="filter-item" style={{marginLeft: 'auto'}}>
          <label>Compare With</label>
          <select><option>Previous 7 Days</option></select>
        </div>
      </div>

      <div className="kpi-row">
        {[
          { label: <React.Fragment>Detection<br/>Accuracy</React.Fragment>, val: '97.42%', trend: '+ 2.38%', pos: true, color: '#00ff88' },
          { label: <React.Fragment>Precision<br/>(PPV)</React.Fragment>, val: '96.18%', trend: '+ 1.87%', pos: true, color: '#00ff88' },
          { label: <React.Fragment>Recall<br/>(TPR)</React.Fragment>, val: '95.37%', trend: '+ 2.51%', pos: true, color: '#00ff88' },
          { label: <React.Fragment>F1<br/>Score</React.Fragment>, val: '95.77%', trend: '+ 2.38%', pos: true, color: '#00f0ff' },
          { label: <React.Fragment>False Positive<br/>Rate</React.Fragment>, val: '1.23%', trend: '+ 0.42%', pos: false, color: '#ff003c' },
          { label: <React.Fragment>False<br/>Negatives</React.Fragment>, val: '136', trend: '+ 28', pos: false, color: '#ff003c' },
          { label: <React.Fragment>Avg. Inference<br/>Time</React.Fragment>, val: '152 ms', trend: '+ 12 ms', pos: true, color: '#00ff88' },
        ].map((kpi, i) => (
          <div key={i} className="kpi-card">
            <div className="kpi-label">{kpi.label} <Info size={12}/></div>
            <div className="kpi-val">{kpi.val}</div>
            <div className={`kpi-trend ${kpi.pos ? 'pos' : 'neg'}`}>{kpi.pos ? <TrendingUp size={12}/> : <TrendingDown size={12}/>} {kpi.trend} vs prev 7 days</div>
            <div className="kpi-spark">
               <Plot
                 data={[{ y: [4,3,5,6,5,7,8], type: 'scatter', mode: 'lines', line: { color: kpi.color, width: 2, shape: 'spline' }, fill: 'tozeroy', fillcolor: kpi.color === '#00ff88' ? 'rgba(0, 255, 136, 0.1)' : kpi.color === '#00f0ff' ? 'rgba(0, 240, 255, 0.1)' : 'rgba(255, 0, 60, 0.1)' }]}
                 layout={sparklineLayout} config={{displayModeBar: false, responsive: true}} style={{width: '100%', height: '100%'}}
               />
            </div>
          </div>
        ))}
      </div>

      <div className="eval-grid">
        
        {/* Detection Performance Over Time */}
        <div className="glass-panel col-span-3">
          <h3 className="panel-title">Detection Performance Over Time</h3>
          <Plot
            data={[
              { x: ['May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [96.5, 96.8, 97.1, 97.0, 97.2, 97.3, 97.4, 97.42], type: 'scatter', mode: 'lines+markers', name: 'Accuracy', line: {color: '#00ff88'} },
              { x: ['May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [95.2, 95.5, 95.8, 95.9, 96.0, 96.1, 96.1, 96.18], type: 'scatter', mode: 'lines+markers', name: 'Precision', line: {color: '#00f0ff'} },
              { x: ['May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [94.1, 94.4, 94.7, 94.8, 95.0, 95.2, 95.3, 95.37], type: 'scatter', mode: 'lines+markers', name: 'Recall', line: {color: '#a855f7'} },
              { x: ['May 8', 'May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [94.6, 94.9, 95.2, 95.3, 95.5, 95.6, 95.7, 95.77], type: 'scatter', mode: 'lines+markers', name: 'F1 Score', line: {color: '#f59e0b'} },
            ]}
            layout={{
              autosize: true, margin: { t: 10, b: 20, l: 30, r: 10 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { showgrid: false, color: '#8b9bb4' }, yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4', range: [90, 100] },
              showlegend: true, legend: { orientation: 'h', y: 1.1, font: { color: '#8b9bb4', size: 10 } }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{width: '100%', height: '350px'}}
          />
        </div>

        {/* Performance by Attack Type */}
        <div className="glass-panel col-span-3">
          <h3 className="panel-title">Performance by Attack Type</h3>
          <div style={{overflowX: 'auto'}}>
            <table className="alerts-table" style={{marginTop: 0, minWidth: '450px'}}>
              <thead>
                <tr><th>Attack Type</th><th>Precision</th><th>Recall</th><th>F1</th><th>Alerts</th></tr>
              </thead>
              <tbody>
                <tr><td><span style={{color: 'var(--accent-red)'}}>Brute Force</span></td><td>98.52%</td><td>99.18%</td><td>98.84%</td><td>452</td></tr>
                <tr><td><span style={{color: '#f59e0b'}}>Impossible Travel</span></td><td>96.12%</td><td>95.45%</td><td>95.78%</td><td>289</td></tr>
                <tr><td><span style={{color: '#a855f7'}}>Credential Stuffing</span></td><td>94.87%</td><td>96.32%</td><td>95.58%</td><td>212</td></tr>
                <tr><td><span style={{color: 'var(--accent-green)'}}>Lateral Movement</span></td><td>95.33%</td><td>92.12%</td><td>93.69%</td><td>88</td></tr>
                <tr><td><span style={{color: 'var(--accent-cyan)'}}>Device Spoofing</span></td><td>97.20%</td><td>95.40%</td><td>96.29%</td><td>30</td></tr>
                <tr><td><span style={{color: '#eab308'}}>Low & Slow Exfiltration</span></td><td>92.45%</td><td>89.15%</td><td>90.77%</td><td>18</td></tr>
                <tr><td><span style={{color: '#f59e0b'}}>Insider Drift</span></td><td>91.30%</td><td>88.45%</td><td>89.85%</td><td>12</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Extreme Class Imbalance */}
        <div className="glass-panel">
          <h3 className="panel-title">Extreme Class Imbalance Handling</h3>
          <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center', height: 'calc(100% - 30px)'}}>
             <div style={{flex: 1}}>
                <Plot
                  data={[{ values: [99.8, 0.2], labels: ['Normal (Benign)', 'True Intrusions'], type: 'pie', hole: 0.6, marker: {colors: ['rgba(0, 255, 136, 0.2)', '#ff003c']}, textinfo: 'label+percent', textfont: {color: 'white', size: 10} }]}
                  layout={{ autosize: true, margin: {t:0,b:0,l:0,r:0}, showlegend: false, paper_bgcolor: 'rgba(0,0,0,0)' }}
                  config={{displayModeBar: false}} style={{width: '100%', height: '160px'}}
                />
             </div>
             <div style={{flex: 1}}>
                <h4 style={{fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: '0.5rem'}}>The Imbalance Challenge</h4>
                <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
                  Real intrusions are a tiny fraction of total events. Standard accuracy fails here.
                </p>
                <div style={{fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '4px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                     <span>Focal Loss Active</span> <CheckCircle size={12} color="var(--accent-green)"/>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem'}}>
                     <span>SMOTE Processing</span> <CheckCircle size={12} color="var(--accent-green)"/>
                  </div>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                     <span>Optimized for PR-AUC</span> <CheckCircle size={12} color="var(--accent-green)"/>
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Confusion Matrix */}
        <div className="glass-panel">
          <h3 className="panel-title">Confusion Matrix (All Attacks)</h3>
          <div className="cm-grid">
             <div className="cm-header"></div>
             <div className="cm-header">Actual Normal</div>
             <div className="cm-header">Actual Anomaly</div>
             
             <div className="cm-header" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>Pred Normal</div>
             <div className="cm-cell tn">
                <div className="cm-val">98,765</div>
                <div className="cm-label">True Negative (TN)</div>
             </div>
             <div className="cm-cell fn">
                <div className="cm-val">136</div>
                <div className="cm-label">False Negative (FN)</div>
             </div>

             <div className="cm-header" style={{writingMode: 'vertical-rl', transform: 'rotate(180deg)'}}>Pred Anomaly</div>
             <div className="cm-cell fp">
                <div className="cm-val">1,235</div>
                <div className="cm-label">False Positive (FP)</div>
             </div>
             <div className="cm-cell tp">
                <div className="cm-val">2,346</div>
                <div className="cm-label">True Positive (TP)</div>
             </div>
          </div>
        </div>

        {/* Data Summary & Insights */}
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div className="glass-panel">
             <h3 className="panel-title">Data Summary <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>(Time Range)</span></h3>
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}><Activity size={14}/> Total Events</div>
                  <div style={{fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-cyan)'}}>45.2 M</div>
                </div>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}><AlertTriangle size={14}/> Anomalies Detected</div>
                  <div style={{fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-red)'}}>197 K</div>
                </div>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}><User size={14}/> Unique Entities</div>
                  <div style={{fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 'bold'}}>12,458</div>
                </div>
                <div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.75rem'}}><Database size={14}/> Data Ingested</div>
                  <div style={{fontFamily: 'Orbitron', fontSize: '1.5rem', fontWeight: 'bold'}}>2.13 TB</div>
                </div>
             </div>
          </div>
          
          <div className="glass-panel" style={{flex: 1}}>
             <h3 className="panel-title">Evaluation Insights</h3>
             <ul className="eval-insights-list">
               <li><Check size={14} color="var(--accent-green)"/> Model performance is within acceptable thresholds.</li>
               <li><Check size={14} color="var(--accent-green)"/> False positive rate improved by 0.42% compared to previous 7 days.</li>
               <li><AlertTriangle size={14} color="#f59e0b"/> Brute force attacks show slightly higher false negatives.</li>
             </ul>
          </div>
        </div>

        {/* Alert Volume vs True Positives */}
        <div className="glass-panel">
          <h3 className="panel-title">Alert Volume vs True Positives</h3>
          <Plot
            data={[
              { x: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [350, 420, 380, 510, 480, 450, 490], type: 'bar', name: 'Total Alerts', marker: {color: 'rgba(0, 240, 255, 0.2)'} },
              { x: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [330, 400, 360, 485, 460, 430, 470], type: 'bar', name: 'True Positives', marker: {color: '#00f0ff'} },
              { x: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [20, 20, 20, 25, 20, 20, 20], type: 'bar', name: 'False Positives', marker: {color: '#ff003c'} },
              { x: ['May 9', 'May 10', 'May 11', 'May 12', 'May 13', 'May 14', 'May 15'], y: [94.2, 95.2, 94.7, 95.0, 95.8, 95.5, 95.9], type: 'scatter', mode: 'lines+markers', name: 'Precision (%)', line: {color: '#00ff88'}, yaxis: 'y2' },
            ]}
            layout={{
              barmode: 'stack',
              autosize: true, margin: { t: 10, b: 20, l: 30, r: 30 }, paper_bgcolor: 'rgba(0,0,0,0)', plot_bgcolor: 'rgba(0,0,0,0)',
              xaxis: { showgrid: false, color: '#8b9bb4' }, yaxis: { showgrid: true, gridcolor: 'rgba(255,255,255,0.05)', color: '#8b9bb4' },
              yaxis2: { overlaying: 'y', side: 'right', showgrid: false, color: '#00ff88', range: [90, 100] },
              showlegend: true, legend: { orientation: 'h', y: 1.1, font: { color: '#8b9bb4', size: 10 } }
            }}
            config={{ displayModeBar: false, responsive: true }}
            style={{width: '100%', height: 'calc(100% - 30px)'}}
          />
        </div>

        {/* Model Performance by Version */}
        <div className="glass-panel col-span-2">
          <h3 className="panel-title">Model Performance by Version</h3>
          <div style={{overflowX: 'auto'}}>
            <table className="alerts-table" style={{marginTop: 0, minWidth: '550px'}}>
              <thead>
                <tr><th>Version</th><th>Accuracy</th><th>F1 Score</th><th>Avg Inference Time</th><th>Deployed On</th><th>Status</th></tr>
              </thead>
              <tbody>
                <tr><td>v2.3.1 (Current)</td><td>97.42%</td><td>95.77%</td><td>152 ms</td><td>Jul 16, 2026</td><td><span className="status-badge" style={{color: 'var(--accent-green)', borderColor: 'var(--accent-green)', background: 'transparent'}}>Active</span></td></tr>
                <tr><td>v2.3.0</td><td>96.87%</td><td>94.12%</td><td>148 ms</td><td>Jul 21, 2026</td><td><span className="status-badge" style={{color: 'var(--text-secondary)', borderColor: 'var(--text-secondary)', background: 'transparent'}}>Archived</span></td></tr>
                <tr><td>v2.1.5</td><td>95.12%</td><td>93.18%</td><td>162 ms</td><td>Jul 17, 2026</td><td><span className="status-badge" style={{color: 'var(--text-secondary)', borderColor: 'var(--text-secondary)', background: 'transparent'}}>Archived</span></td></tr>
                <tr><td>v2.0.0</td><td>91.22%</td><td>88.41%</td><td>185 ms</td><td>Jul 17, 2026</td><td><span className="status-badge" style={{color: 'var(--text-secondary)', borderColor: 'var(--text-secondary)', background: 'transparent'}}>Archived</span></td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* System Report (Assumptions, Limitations, Schema) */}
        <div className="glass-panel col-span-3">
          <h3 className="panel-title" style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}><FileText size={18}/> SYSTEM REPORT: ASSUMPTIONS, LIMITATIONS & SCHEMA</h3>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1rem'}}>
             <div>
                <h4 style={{fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase'}}>Synthetic Data Schema</h4>
                <table className="alerts-table" style={{marginTop: 0, fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)'}}>
                   <thead><tr><th>Field Name</th><th>Description</th></tr></thead>
                   <tbody>
                      <tr><td>entity_id</td><td>user_id or device_id</td></tr>
                      <tr><td>entity_type</td><td>user, service_account, or edge_device</td></tr>
                      <tr><td>timestamp</td><td>access or connection time</td></tr>
                      <tr><td>source_ip</td><td>origin IP of the access</td></tr>
                      <tr><td>geo_location</td><td>geographic origin of the access</td></tr>
                      <tr><td>resource_accessed</td><td>file, endpoint, port, or device function</td></tr>
                      <tr><td>auth_method</td><td>password, token, certificate, biometric</td></tr>
                      <tr><td>session_duration</td><td>length of connection</td></tr>
                      <tr><td>command_sequence</td><td>ordered list of actions taken</td></tr>
                      <tr><td>device_fingerprint</td><td>OS/firmware version, MAC address, protocol used</td></tr>
                   </tbody>
                </table>
             </div>
             
             <div>
                <div style={{marginBottom: '1.5rem'}}>
                   <h4 style={{fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.75rem', textTransform: 'uppercase'}}>Behavioral Assumptions</h4>
                   <ul style={{fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                     <li>Entities exhibit habitual baseline patterns regarding time, location, and accessed resources.</li>
                     <li>Legitimate behavior slowly evolves over time (Concept Drift), which is modeled as non-anomalous unless it mirrors known attack vectors.</li>
                     <li>Real intrusions are extremely rare compared to normal traffic, leading to significant class imbalance (approx. 0.5% - 3% anomaly rate).</li>
                   </ul>
                </div>
                <div>
                   <h4 style={{fontSize: '0.85rem', color: 'var(--accent-red)', marginBottom: '0.75rem', textTransform: 'uppercase'}}>Known Limitations</h4>
                   <ul style={{fontSize: '0.8rem', color: 'var(--text-secondary)', paddingLeft: '1.2rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                     <li><strong>Cold-Start Problem:</strong> New entities with no historical data are difficult to baseline and may trigger temporary false positives.</li>
                     <li><strong>Label Scarcity:</strong> Model relies heavily on synthetic data since real intrusion datasets are privacy-restricted and domain-specific.</li>
                     <li><strong>Adversarial Evasion:</strong> "Low and slow" exfiltration that perfectly mimics habitual behavior might evade detection if it falls below the configured sensitivity threshold.</li>
                   </ul>
                </div>
             </div>
          </div>
        </div>

      </div>

      {/* Hidden A4 Template for PDF Export */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <EvaluationReportTemplate />
      </div>
    </div>
  );
}
