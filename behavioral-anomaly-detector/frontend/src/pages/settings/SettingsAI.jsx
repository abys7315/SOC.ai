import React from 'react';
import { Cpu, Settings, Target, BarChart2, CheckCircle, Save, Info, RefreshCw, UploadCloud, FileText, Activity } from 'lucide-react';

export default function SettingsAI({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>AI & Model Settings</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure AI detection engine, models, thresholds and learning behavior.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>1.</span> Detection Engine</h3>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <div className="fg-label-col">
                   <span>Enable AI Detectors</span>
                   <span className="fg-sub">Enable AI engine for behavioral anomaly detection</span>
                 </div>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>

               <div className="fg-item-horizontal" style={{padding: '0.8rem 0'}}>
                 <div className="fg-label-col" style={{flex: 1}}>
                   <span>Detection Threshold</span>
                   <span className="fg-sub">Minimum anomaly score to trigger detection</span>
                 </div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                   <input type="range" min="0" max="5" step="0.01" defaultValue="2.85" className="slider slider-cyan" style={{width: '60px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>2.85</span>
                 </div>
               </div>

               <div className="fg-item-horizontal" style={{padding: '0.8rem 0'}}>
                 <div className="fg-label-col" style={{flex: 1}}>
                   <span>Risk Score Threshold</span>
                   <span className="fg-sub">Minimum risk score to raise alert</span>
                 </div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                   <input type="range" min="0" max="100" defaultValue="75" className="slider slider-cyan" style={{width: '60px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>75</span>
                 </div>
               </div>

               <div className="fg-item-horizontal" style={{padding: '0.8rem 0'}}>
                 <div className="fg-label-col" style={{flex: 1}}>
                   <span>Confidence Threshold</span>
                   <span className="fg-sub">Minimum model confidence for a valid prediction</span>
                 </div>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                   <input type="range" min="0" max="1" step="0.01" defaultValue="0.70" className="slider slider-cyan" style={{width: '60px'}}/>
                   <span style={{fontSize: '0.75rem', width: '30px', textAlign: 'right'}}>0.70</span>
                 </div>
               </div>

               <div className="fg-item-horizontal">
                 <label>Prediction Smoothing</label>
                 <select value={config?.ai?.predictionSmoothing || ""} onChange={(e) => handleChange("ai", "predictionSmoothing", e.target.value)} name="ai.predictionSmoothing" className="select-input" >
                   <option>Exponential Moving Average</option>
                   <option>Simple Moving Average</option>
                 </select>
               </div>
               
               <div className="fg-item-horizontal">
                 <label>Smoothing Window</label>
                 <select value={config?.ai?.smoothingWindow || ""} onChange={(e) => handleChange("ai", "smoothingWindow", e.target.value)} name="ai.smoothingWindow" className="select-input" >
                   <option>30</option>
                   <option>60</option>
                 </select>
               </div>
            </div>

            <div style={{marginTop: '1rem'}}>
               <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Threshold Presets</div>
               <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem'}}>
                 <div className="preset-btn">
                   <span>Conservative</span>
                   <span className="pb-sub">Low alerts, high precision</span>
                 </div>
                 <div className="preset-btn active">
                   <span>Balanced</span>
                   <span className="pb-sub">Balanced detection</span>
                 </div>
                 <div className="preset-btn">
                   <span>Aggressive</span>
                   <span className="pb-sub">More alerts, high recall</span>
                 </div>
                 <div className="preset-btn">
                   <span>Custom</span>
                   <span className="pb-sub">User defined</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>5.</span> Feature & Input Configuration</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Select and configure features used by the AI models.</p>
            
            <div className="settings-inner-tabs">
               <div className="si-tab active">User Features</div>
               <div className="si-tab">Entity Features</div>
               <div className="si-tab">Network Features</div>
               <div className="si-tab">System Features</div>
            </div>

            <table className="settings-table" style={{fontSize: '0.7rem', marginTop: '1rem'}}>
               <thead>
                 <tr>
                   <th>Feature Name</th>
                   <th>Description</th>
                   <th>Importance</th>
                   <th style={{textAlign: 'right'}}>Status</th>
                 </tr>
               </thead>
               <tbody>
                 {[
                   {name: 'Login Time', desc: 'Time of day when user logged in', imp: 'High', active: true},
                   {name: 'Login Location', desc: 'Geographic location of login', imp: 'High', active: true},
                   {name: 'Device ID', desc: 'Device fingerprint identifier', imp: 'High', active: true},
                   {name: 'Resource Access Pattern', desc: 'Access pattern for resources', imp: 'Medium', active: true},
                   {name: 'Data Transfer Volume', desc: 'Volume of data transferred', imp: 'Medium', active: true},
                   {name: 'Command Pattern', desc: 'Commands executed by user', imp: 'Low', active: true},
                   {name: 'Session Duration', desc: 'Duration of user session', imp: 'Low', active: false},
                 ].map((row, i) => (
                   <tr key={i}>
                     <td style={{color: 'var(--text-primary)'}}>{row.name}</td>
                     <td style={{color: 'var(--text-secondary)'}}>{row.desc}</td>
                     <td>
                       <span style={{
                         display: 'inline-block', padding: '0.1rem 0.4rem', borderRadius: '4px', fontSize: '0.65rem',
                         background: row.imp === 'High' ? 'rgba(168, 85, 247, 0.1)' : row.imp === 'Medium' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                         color: row.imp === 'High' ? '#c084fc' : row.imp === 'Medium' ? '#60a5fa' : 'var(--text-secondary)'
                       }}>
                         <div style={{width:'6px', height:'6px', borderRadius:'50%', display:'inline-block', marginRight:'4px', background: row.imp === 'High' ? '#c084fc' : row.imp === 'Medium' ? '#60a5fa' : 'var(--text-secondary)'}}></div>
                         {row.imp}
                       </span>
                     </td>
                     <td style={{textAlign: 'right'}}>
                       <div className={`switch ${row.active ? 'active' : ''}`} style={{display: 'inline-block'}}><div className="switch-knob"></div></div>
                     </td>
                   </tr>
                 ))}
               </tbody>
            </table>
            <div style={{marginTop: '1rem'}}>
              <span style={{fontSize: '0.7rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}><Settings size={12} style={{display:'inline', verticalAlign:'middle', marginRight:'0.2rem'}}/> Manage Features</span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>2.</span> Model Configuration</h3>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0 0 1rem 0', borderBottom: 'none'}}>
                 <label>Active Model</label>
                 <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
                    <select className="select-input" style={{width: '200px'}}><option>LSTM + Transformer (Ensemble)</option></select>
                    <span style={{background: 'rgba(0,255,136,0.1)', color: 'var(--accent-green)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.7rem'}}>Active</span>
                 </div>
               </div>
            </div>
            
            <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Model Type</div>
            
            <div className="radio-group-list">
               {[
                 {name: 'LSTM', desc: 'Long Short-Term Memory', type: 'Recurrent', active: false},
                 {name: 'GRU', desc: 'Gated Recurrent Unit', type: 'Recurrent', active: false},
                 {name: 'Transformer', desc: 'Attention based model', type: 'Deep Learning', active: false},
                 {name: 'Isolation Forest', desc: 'Tree based model', type: 'Traditional', active: false},
                 {name: 'Ensemble (LSTM + Transformer)', desc: 'Balanced ensemble model', type: 'Ensemble', active: true},
               ].map((mod, i) => (
                 <div key={i} className={`radio-item ${mod.active ? 'active' : ''}`} style={{padding: '0.6rem', border: mod.active ? '1px solid rgba(255,0,60,0.3)' : '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', background: mod.active ? 'rgba(255,0,60,0.05)' : 'rgba(0,0,0,0.2)', alignItems: 'center'}}>
                   <div className={`radio-circle ${mod.active ? 'checked' : ''}`} style={{borderColor: mod.active ? 'var(--accent-red)' : ''}}></div>
                   <div className="ri-content" style={{flex: 1}}>
                     <div className="ri-title" style={{color: mod.active ? 'var(--accent-red)' : 'var(--text-primary)'}}>{mod.name}</div>
                     <div className="ri-desc">{mod.desc}</div>
                   </div>
                   <div style={{fontSize: '0.65rem', padding: '0.2rem 0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', color: mod.type === 'Ensemble' ? 'var(--accent-green)' : mod.type === 'Recurrent' ? 'var(--accent-purple)' : mod.type === 'Deep Learning' ? 'var(--accent-cyan)' : '#f59e0b'}}>
                     {mod.type}
                   </div>
                 </div>
               ))}
            </div>

            <div style={{marginTop: '1.5rem'}}>
              <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}><Cpu size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Manage Models</span>
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>6.</span> Cold Start & Baseline</h3>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Baseline Strategy</label>
                 <select value={config?.ai?.baselineStrategy || ""} onChange={(e) => handleChange("ai", "baselineStrategy", e.target.value)} name="ai.baselineStrategy" className="select-input"><option>Population Baseline</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Default Risk Score</label>
                 <select value={config?.ai?.defaultRiskScore || ""} onChange={(e) => handleChange("ai", "defaultRiskScore", e.target.value)} name="ai.defaultRiskScore" className="select-input"><option>Medium (50-70)</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Minimum History Length <span style={{fontSize:'0.65rem', color:'var(--text-secondary)', display:'block'}}>Minimum events required for user profiling</span></label>
                 <input type="number" defaultValue="50" className="num-input" />
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Baseline Update Frequency</label>
                 <select value={config?.ai?.baselineUpdateFrequency || ""} onChange={(e) => handleChange("ai", "baselineUpdateFrequency", e.target.value)} name="ai.baselineUpdateFrequency" className="select-input"><option>24 Hours</option></select>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(59, 130, 246, 0.05)', padding: '0.75rem', borderRadius: '4px', border: '1px solid rgba(59, 130, 246, 0.2)'}}>
               <Info size={16} style={{flexShrink: 0, color: 'var(--accent-cyan)'}}/>
               <div>
                 <strong style={{color: 'var(--accent-cyan)', display: 'block', marginBottom: '0.2rem'}}>Cold Start Handling</strong>
                 For new users with insufficient history, the system will use population baselines and gradually build individual profile.
               </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>3.</span> Learning & Adaptation</h3>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Learning Mode</label>
                 <select value={config?.ai?.learningMode || ""} onChange={(e) => handleChange("ai", "learningMode", e.target.value)} name="ai.learningMode" className="select-input" style={{width: '100%'}}><option>Continual Learning</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <div className="fg-label-col">
                   <span>Online Learning</span>
                   <span className="fg-sub">Update model with new data in real-time</span>
                 </div>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <div className="fg-label-col">
                   <span>Active Learning</span>
                   <span className="fg-sub">Actively query informative samples</span>
                 </div>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <div className="fg-label-col">
                   <span>Concept Drift Detection</span>
                   <span className="fg-sub">Detect and adapt to behavior shift</span>
                 </div>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <div className="fg-label-col">
                   <span>Auto-Model Retraining</span>
                   <span className="fg-sub">Initiate retrain when performance drops</span>
                 </div>
                 <div className="switch active"><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal">
                 <label>Drift Sensitivity</label>
                 <select value={config?.ai?.driftSensitivity || ""} onChange={(e) => handleChange("ai", "driftSensitivity", e.target.value)} name="ai.driftSensitivity" className="select-input"><option>Medium</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Retrain Frequency</label>
                 <select value={config?.ai?.retrainFrequency || ""} onChange={(e) => handleChange("ai", "retrainFrequency", e.target.value)} name="ai.retrainFrequency" className="select-input"><option>7 Days</option></select>
               </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '1rem', padding: '0.75rem', background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <div>
                 <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Last Retrain</div>
                 <div style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>May 10, 2024 02:30 AM</div>
               </div>
               <div style={{textAlign: 'right'}}>
                 <div style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>Performance Change</div>
                 <div style={{fontSize: '0.75rem', color: 'var(--accent-green)'}}>+2.4% <Activity size={10} style={{display:'inline'}}/></div>
               </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>4.</span> Model Performance Targets</h3>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{padding: '0.3rem 0', border: 'none'}}>
                 <label style={{color: 'var(--text-secondary)'}}>Target Precision (%)</label>
                 <input type="number" defaultValue="90" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.3rem 0', border: 'none'}}>
                 <label style={{color: 'var(--text-secondary)'}}>Target Recall (%)</label>
                 <input type="number" defaultValue="85" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.3rem 0', border: 'none'}}>
                 <label style={{color: 'var(--text-secondary)'}}>Target F1 Score (%)</label>
                 <input type="number" defaultValue="87" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.3rem 0', border: 'none'}}>
                 <label style={{color: 'var(--text-secondary)'}}>Maximum False Positive Rate (%)</label>
                 <input type="number" defaultValue="1.5" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
               <div className="fg-item-horizontal" style={{padding: '0.3rem 0', border: 'none'}}>
                 <label style={{color: 'var(--text-secondary)'}}>Minimum Detection Rate (%)</label>
                 <input type="number" defaultValue="85" className="num-input-small" style={{width: '60px', textAlign: 'right'}}/>
               </div>
            </div>

            <div style={{marginTop: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.75rem', background: 'rgba(0, 255, 136, 0.05)', borderRadius: '6px', border: '1px solid rgba(0, 255, 136, 0.2)'}}>
               <CheckCircle size={18} color="var(--accent-green)"/>
               <div>
                  <div style={{fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>Model Status</div>
                  <div style={{fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.2rem'}}>Model is performing within expected range.</div>
               </div>
            </div>
            
            <div style={{marginTop: '0.75rem', textAlign: 'center'}}>
               <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)', cursor: 'pointer'}}><BarChart2 size={12} style={{display:'inline', verticalAlign:'middle'}}/> View Performance Dashboard</span>
            </div>
          </div>

          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-red)'}}>7.</span> Model Management</h3>
            
            <div className="summary-list" style={{marginBottom: '1.5rem'}}>
               <div className="si-item"><span>Model Version</span><span style={{color:'var(--text-primary)'}}>v2.3.1 <span style={{background:'rgba(0,255,136,0.1)', color:'var(--accent-green)', padding:'0.1rem 0.3rem', borderRadius:'4px', marginLeft:'0.3rem', fontSize:'0.6rem'}}>Latest</span></span></div>
               <div className="si-item"><span>Trained On</span><span>May 10, 2024 01:30 AM</span></div>
               <div className="si-item"><span>Training Data Size</span><span>2.4 TB (2.4M)</span></div>
               <div className="si-item"><span>Validation Accuracy</span><span style={{color:'var(--accent-green)'}}>92.34%</span></div>
               <div className="si-item"><span>Model Size</span><span>152.6 MB</span></div>
            </div>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '0.5rem', marginTop: 'auto'}}>
               <button className="btn-outline" style={{padding: '0.5rem', fontSize: '0.7rem'}} onClick={() => handleAction("View Model Details")}>View Model Details</button>
               <button className="btn-outline" style={{padding: '0.5rem', fontSize: '0.7rem'}} onClick={() => handleAction("Download Model")}><UploadCloud size={14}/> Download Model</button>
               <button className="btn-solid-red" style={{padding: '0.5rem', fontSize: '0.75rem'}} onClick={() => handleAction("Retrain Model")}><RefreshCw size={14} style={{marginRight:'0.3rem'}}/> Retrain Model</button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-footer">
         <span style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}><Info size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Changes to AI & Model settings may take a few minutes to apply to the system.</span>
         <button className="btn-solid-red" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save AI & Model Settings")}><Save size={16} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save AI & Model Settings</button>
      </div>
    </div>
  );
}
