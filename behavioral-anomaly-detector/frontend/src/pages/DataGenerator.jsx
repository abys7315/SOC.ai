import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { 
  Lock, Plane, Users, Network, Monitor, CloudRain, Download, FileText,
  Activity, ArrowRight, Server, ShieldCheck, UserCheck, Code
} from 'lucide-react';
import './DataGenerator.css';
import { API_BASE, WS_BASE } from '../config';


const ATTACK_SCENARIOS = [
  { id: 'brute_force', icon: <Lock size={24}/>, title: 'Brute Force Attack', desc: 'Simulate repeated failed login attempts from a single/multiple IPs', color: 'var(--accent-red)' },
  { id: 'impossible_travel', icon: <Plane size={24}/>, title: 'Impossible Travel', desc: 'Simulate logins from geographically distant locations within an implausible time gap', color: '#f59e0b' },
  { id: 'credential_stuffing', icon: <Users size={24}/>, title: 'Credential Stuffing', desc: 'Simulate credential stuffing using leaked credentials', color: '#a855f7' },
  { id: 'lateral_movement', icon: <Network size={24}/>, title: 'Lateral Movement', desc: 'Simulate attacker movement within the network', color: 'var(--accent-green)' },
  { id: 'device_spoofing', icon: <Monitor size={24}/>, title: 'Device Spoofing', desc: 'Simulate device id reappearing with a mismatched fingerprint', color: '#00f0ff' },
  { id: 'low_and_slow', icon: <CloudRain size={24}/>, title: 'Low & Slow Exfiltration', desc: 'Simulate gradual, small, off-hours resource access building up', color: '#eab308' },
  { id: 'insider_drift', icon: <UserCheck size={24}/>, title: 'Insider Drift', desc: 'Simulate legitimate entity slowly expanding privilege or resource footprint', color: '#f59e0b' }
];

export default function DataGenerator() {
  const [selectedScenario, setSelectedScenario] = useState('brute_force');
  const [isGenerating, setIsGenerating] = useState(false);
  const [recentEvents, setRecentEvents] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [scenarioConfig, setScenarioConfig] = useState({});

  const selectedScenarioData = ATTACK_SCENARIOS.find(s => s.id === selectedScenario) || ATTACK_SCENARIOS[0];

  const getScenarioSpecificParams = (scenarioId) => {
    switch(scenarioId) {
      case 'brute_force':
        return [
          { key: 'ipType', label: 'Source IP Type', type: 'select', options: ['Multiple IPs', 'Single IP'] },
          { key: 'numIps', label: 'Number of Source IPs', type: 'number', default: 50 },
          { key: 'targetAccts', label: 'Target Accounts', type: 'select', options: ['User Accounts', 'Service Accounts'] },
          { key: 'numAccts', label: 'Number of Target Accounts', type: 'number', default: 100 },
          { key: 'loginAtt', label: 'Login Attempts per IP', type: 'number', default: 500 },
          { key: 'failRatio', label: 'Failed Login Ratio (%)', type: 'number', default: 98 },
        ];
      case 'impossible_travel':
        return [
          { key: 'locations', label: 'Locations (Comma separated)', type: 'text', default: 'New York, Beijing' },
          { key: 'timeWindow', label: 'Time Window (Minutes)', type: 'number', default: 10 },
          { key: 'entityType', label: 'Entity Type', type: 'select', options: ['User', 'Service Account'] }
        ];
      case 'credential_stuffing':
        return [
          { key: 'dbSource', label: 'Leaked DB Source', type: 'select', options: ['DarkWeb_Dump_A', 'Pastebin_2024'] },
          { key: 'targetAccts', label: 'Target Accounts', type: 'number', default: 5000 },
          { key: 'rotFreq', label: 'IP Rotation Frequency', type: 'select', options: ['High', 'Medium', 'Low'] },
        ];
      case 'lateral_movement':
        return [
          { key: 'initComp', label: 'Initial Compromise Point', type: 'select', options: ['Edge Device', 'User Workstation'] },
          { key: 'targetRes', label: 'Target Resource', type: 'select', options: ['sensitive_res_150', 'db_main'] },
          { key: 'cmdSeq', label: 'Command Sequence', type: 'text', default: 'ls, cat, copy, scp' }
        ];
      case 'device_spoofing':
        return [
          { key: 'spoofedOs', label: 'Spoofed OS', type: 'select', options: ['UNKNOWN_OS', 'Windows_Legacy'] },
          { key: 'targetEnt', label: 'Target Entity Type', type: 'select', options: ['User', 'Edge Device'] }
        ];
      case 'low_and_slow':
        return [
          { key: 'targetRes', label: 'Target Resource', type: 'text', default: 'db_dump_chunk' },
          { key: 'interval', label: 'Interval (Hours)', type: 'number', default: 12 },
          { key: 'durationDays', label: 'Duration (Days)', type: 'number', default: 5 }
        ];
      case 'insider_drift':
        return [
          { key: 'entityType', label: 'Entity Type', type: 'select', options: ['Service Account', 'User'] },
          { key: 'newRes', label: 'New Resource Accessed', type: 'text', default: 'new_project_repo' },
          { key: 'freqInc', label: 'Frequency Increase (%)', type: 'number', default: 25 }
        ];
      default:
        return [];
    }
  };

  const handleConfigChange = (key, value) => {
    setScenarioConfig(prev => ({ ...prev, [key]: value }));
  };

  React.useEffect(() => {
    fetch(`${API_BASE}/api/generator/status`)
      .then(res => res.json())
      .then(data => setIsGenerating(data.running))
      .catch(err => console.error(err));
  }, []);

  React.useEffect(() => {
    let intervalId;
    if (isGenerating) {
      intervalId = setInterval(() => {
        fetch(`${API_BASE}/api/generator/events`)
          .then(res => res.json())
          .then(data => setRecentEvents(data.events || []))
          .catch(err => console.error(err));
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isGenerating]);

  const handleToggleGenerator = () => {
    const endpoint = isGenerating ? '/api/generator/stop' : '/api/generator/start';
    const payload = {
        scenario: selectedScenario,
        config: scenarioConfig
    };
    fetch(`http://localhost:8000${endpoint}`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: endpoint.includes('start') ? JSON.stringify(payload) : null
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 'started' || data.status === 'already_running') setIsGenerating(true);
        if (data.status === 'stopped' || data.status === 'already_stopped') setIsGenerating(false);
      });
  };

  return (
    <div className="generator-page">
      <div className="generator-header">
         <div>
            <h2 style={{margin: 0, fontFamily: 'Orbitron', fontSize: '1.25rem'}}>Synthetic Data Generator</h2>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0.25rem 0 0 0'}}>Generate realistic attack and behavioral data to improve model robustness</p>
         </div>
         <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--accent-green)'}}>
             <div className="live-dot"></div> Live System
           </div>
           <button className="btn-outline" style={{padding: '0.4rem 1rem'}}>View Documentation</button>
         </div>
      </div>

      <div className="stepper-bar">
         <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-num">1</div>
            <div className="step-text">Configure Scenario<span>Define attack scenario</span></div>
         </div>
         <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-num">2</div>
            <div className="step-text">Configure Parameters<span>Set generation parameters</span></div>
         </div>
         <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-num">3</div>
            <div className="step-text">Preview & Validate<span>Review synthetic data</span></div>
         </div>
         <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-num">4</div>
            <div className="step-text">Generate Data<span>Generate & export dataset</span></div>
         </div>
      </div>

      <div className="generator-layout">
         
         {/* Left Column */}
         <div className="generator-left">
            {currentStep === 1 && (
              <>
                <h3 className="section-title">1. SELECT ATTACK SCENARIO</h3>
                <div className="scenario-grid">
                   {ATTACK_SCENARIOS.map(scenario => (
                      <div 
                        key={scenario.id} 
                        className={`scenario-card ${selectedScenario === scenario.id ? 'active' : ''}`}
                        onClick={() => setSelectedScenario(scenario.id)}
                        style={{'--theme-color': scenario.color}}
                      >
                         <div className="scenario-icon" style={{color: scenario.color, borderColor: scenario.color}}>{scenario.icon}</div>
                         <div className="scenario-content">
                           <h4>{scenario.title}</h4>
                           <p>{scenario.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
                <button className="btn-solid-red" style={{width: '100%', marginTop: '2rem', padding: '1rem'}} onClick={() => setCurrentStep(2)}>
                   Next: Configure Parameters <ArrowRight size={16} style={{display:'inline', verticalAlign:'middle'}}/>
                </button>
              </>
            )}

            {currentStep === 2 && (
              <>
                <h3 className="section-title">2. CONFIGURE SCENARIO PARAMETERS</h3>
                <div className="params-grid">
                   <div className="param-group">
                     <label>Target Environment</label>
                     <select><option>Enterprise Network</option></select>
                   </div>
                   <div className="param-group">
                     <label>Attack Intensity</label>
                     <select><option>Medium</option></select>
                   </div>
                   <div className="param-group">
                     <label>Attacker Skill Level</label>
                     <select><option>Intermediate</option></select>
                   </div>
                   <div className="param-group">
                     <label>Start Time</label>
                     <input type="datetime-local" defaultValue="2024-05-15T10:00" />
                   </div>
                   <div className="param-group">
                     <label>Duration</label>
                     <select><option>24 Hours</option></select>
                   </div>
                   <div className="param-group" style={{gridColumn: 'span 2'}}>
                     <label style={{color: selectedScenarioData.color}}>Attack Specific Parameters ({selectedScenarioData.title})</label>
                     <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '0.5rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', border: `1px solid ${selectedScenarioData.color}`}}>
                        {getScenarioSpecificParams(selectedScenario).map((param, idx) => (
                           <div className="param-group" key={idx}>
                             <label>{param.label}</label>
                             {param.type === 'select' ? (
                               <select onChange={(e) => handleConfigChange(param.key, e.target.value)} defaultValue={param.options[0]}>
                                 {param.options.map(opt => <option key={opt}>{opt}</option>)}
                               </select>
                             ) : (
                               <input type={param.type} defaultValue={param.default} onChange={(e) => handleConfigChange(param.key, e.target.value)} />
                             )}
                           </div>
                        ))}
                     </div>
                   </div>
                </div>
                
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                  <button className="btn-outline" style={{flex: 1, padding: '1rem'}} onClick={() => setCurrentStep(1)}>
                     Back
                  </button>
                  <button className="btn-solid-red" style={{flex: 1, padding: '1rem'}} onClick={() => setCurrentStep(3)}>
                     Next: Preview & Validate <ArrowRight size={16} style={{display:'inline', verticalAlign:'middle'}}/>
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <h3 className="section-title">3. PREVIEW & VALIDATE</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '1rem'}}>
                  Review the scenario summary, kill chain, and expected event distribution on the right panel. Check the data preview table below for sample data.
                </p>
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                  <button className="btn-outline" style={{flex: 1, padding: '1rem'}} onClick={() => setCurrentStep(2)}>
                     Back
                  </button>
                  <button className="btn-solid-red" style={{flex: 1, padding: '1rem'}} onClick={() => setCurrentStep(4)}>
                     Next: Generate Data <ArrowRight size={16} style={{display:'inline', verticalAlign:'middle'}}/>
                  </button>
                </div>
              </>
            )}

            {currentStep === 4 && (
              <>
                <h3 className="section-title">4. GENERATE DATA</h3>
                <p style={{color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '1rem'}}>
                  You are ready to start the data generator stream. Use the control bar at the bottom to start or stop the data generation process.
                </p>
                <div style={{display: 'flex', gap: '1rem', marginTop: '2rem'}}>
                  <button className="btn-outline" style={{flex: 1, padding: '1rem'}} onClick={() => setCurrentStep(3)}>
                     Back
                  </button>
                </div>
              </>
            )}
         </div>

         {/* Right Column */}
         <div className="generator-right">
            
            <div className="glass-panel">
               <h3 className="panel-title">SCENARIO SUMMARY</h3>
               <div className="summary-tags">
                  <div className="sum-tag"><span>Scenario</span>{selectedScenarioData.title}</div>
                  <div className="sum-tag"><span>Target Environment</span>Enterprise Network</div>
                  <div className="sum-tag"><span>Attack Intensity</span>Medium</div>
                  <div className="sum-tag"><span>Duration</span>24 Hours</div>
                  <div className="sum-tag"><span>Estimated Data Points</span>~ 2.5 Million</div>
               </div>

               <h3 className="panel-title" style={{marginTop: '1.5rem'}}>ATTACK KILL CHAIN (Simulated)</h3>
               <div className="kill-chain-visual">
                  <div className="kc-step"><Activity size={16}/> Reconnaissance</div>
                  <div className="kc-line"></div>
                  <div className="kc-step active"><Lock size={16}/> Initial Access</div>
                  <div className="kc-line"></div>
                  <div className="kc-step"><Code size={16}/> Execution</div>
                  <div className="kc-line"></div>
                  <div className="kc-step"><Server size={16}/> Persistence</div>
                  <div className="kc-line"></div>
                  <div className="kc-step"><CloudRain size={16}/> Actions on Objectives</div>
               </div>
            </div>

            <div className="glass-panel" style={{flex: 1}}>
               <h3 className="panel-title">EVENT DISTRIBUTION</h3>
               <div style={{display: 'flex', gap: '1.5rem', marginTop: '0.5rem', flexWrap: 'wrap'}}>
                  <div style={{flex: 1, minWidth: '200px'}}>
                     <h4 style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Entity Type Distribution</h4>
                     <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                        <Plot
                           data={[{ values: [70, 20, 10], type: 'pie', hole: 0.7, textinfo: 'none', marker: {colors: ['#3b82f6', '#00ff88', '#ff003c']} }]}
                           layout={{ autosize: true, margin: {t:0,b:0,l:0,r:0}, showlegend: false, paper_bgcolor: 'rgba(0,0,0,0)' }}
                           config={{displayModeBar: false}} style={{width: '100px', height: '100px'}}
                        />
                        <div style={{fontSize: '0.7rem'}}>
                           <div style={{color: '#3b82f6'}}>● user 70.0%</div>
                           <div style={{color: '#00ff88'}}>● edge_device 20.0%</div>
                           <div style={{color: '#ff003c'}}>● service_account 10.0%</div>
                        </div>
                     </div>
                  </div>
                  <div style={{flex: 1, minWidth: '200px'}}>
                     <h4 style={{fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem'}}>Geographic Distribution (Top 3)</h4>
                     <div style={{display: 'flex', alignItems: 'center', gap: '1rem', height: '100px'}}>
                        <Plot
                           data={[{ type: 'scattergeo', mode: 'markers', lon: [-95.7129, 10.4515, 2.2137], lat: [37.0902, 51.1657, 46.2276], marker: {size: [10,8,6], color: 'var(--accent-red)'} }]}
                           layout={{ geo: {projection: {type: 'equirectangular'}, showland: true, landcolor: 'rgba(255,255,255,0.05)', showocean: true, oceancolor: 'rgba(0,0,0,0)', bgcolor: 'rgba(0,0,0,0)'}, margin: {t:0,b:0,l:0,r:0}, paper_bgcolor: 'rgba(0,0,0,0)' }}
                           config={{displayModeBar: false}} style={{width: '150px', height: '100px'}}
                        />
                        <div style={{fontSize: '0.7rem'}}>
                           <div style={{color: 'var(--accent-red)'}}>● United States 32.1%</div>
                           <div style={{color: '#f59e0b'}}>● Germany 18.7%</div>
                           <div style={{color: '#a855f7'}}>● France 12.4%</div>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

         </div>
      </div>

      {/* Data Preview Full Length */}
      <div className="glass-panel">
         <h3 className="panel-title" style={{display: 'flex', justifyContent: 'space-between'}}>
           DATA PREVIEW <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}>(Sample of synthetic data)</span>
         </h3>
         <div className="table-container" style={{height: '250px'}}>
             <table className="alerts-table" style={{marginTop: 0, fontSize: '0.7rem'}}>
               <thead><tr><th>entity_id</th><th>entity_type</th><th>timestamp</th><th>source_ip</th><th>geo_location</th><th>resource_accessed</th><th>auth_method</th><th>session_duration</th><th>command_sequence</th><th>device_fingerprint</th></tr></thead>
               <tbody>
                  {recentEvents.length > 0 ? (
                    recentEvents.map((evt, idx) => (
                      <tr key={idx}>
                        <td>{evt.entity_id}</td>
                        <td>{evt.entity_type}</td>
                        <td>{new Date(evt.timestamp).toLocaleString()}</td>
                        <td>{evt.source_ip}</td>
                        <td>{evt.geo_location}</td>
                        <td>{evt.resource_accessed}</td>
                        <td>{evt.auth_method}</td>
                        <td>{parseFloat(evt.session_duration).toFixed(1)}</td>
                        <td>{JSON.stringify(evt.command_sequence)}</td>
                        <td>{evt.device_fingerprint}</td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr><td>usr_8f2a1</td><td>user</td><td>2024-05-15 10:00:01</td><td>203.0.113.45</td><td>Germany</td><td>api/login</td><td>password</td><td>0.0</td><td>[]</td><td>Chrome_A4-5E-60</td></tr>
                      <tr><td>usr_8f2a1</td><td>user</td><td>2024-05-15 10:00:02</td><td>198.51.100.12</td><td>Netherlands</td><td>api/login</td><td>password</td><td>0.0</td><td>[]</td><td>Firefox_B2-11-9A</td></tr>
                      <tr><td>usr_8f2a1</td><td>user</td><td>2024-05-15 10:00:03</td><td>203.0.113.78</td><td>France</td><td>api/login</td><td>password</td><td>0.0</td><td>[]</td><td>Safari_C1-33-8B</td></tr>
                      <tr><td>usr_8f2a1</td><td>user</td><td>2024-05-15 10:00:04</td><td>203.0.113.91</td><td>Canada</td><td>api/login</td><td>token</td><td>312.4</td><td>["login","read"]</td><td>Chrome_A4-5E-60</td></tr>
                    </>
                  )}
               </tbody>
            </table>
         </div>
      </div>

      <div className="generator-footer">
         <div style={{display: 'flex', gap: '2rem', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>
            <span>Storage Location: <span style={{color: 'white'}}>s3://synthetic-data-bucket/brute-force-attack/</span></span>
            <span>Data Format: <span style={{color: 'white'}}>JSONL</span></span>
            <span>Compression: <span style={{color: 'white'}}>GZIP</span></span>
         </div>
         <button 
           className={isGenerating ? "btn-outline" : "btn-solid-red"} 
           onClick={handleToggleGenerator}
           style={{borderColor: isGenerating ? 'var(--accent-red)' : '', color: isGenerating ? 'var(--accent-red)' : ''}}
         >
           {isGenerating ? "Stop Generator" : "Generate Data (Stream)"}
         </button>
      </div>

    </div>
  );
}
