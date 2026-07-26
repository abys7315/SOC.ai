import React from 'react';
import { LayoutTemplate, Info, RotateCcw, CheckCircle, Save, AlignLeft, BarChart2 } from 'lucide-react';

export default function SettingsExplainability({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Explainability Settings</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Configure how the system explains detections and predictions to enhance transparency and trust.</p>
         </div>
         <div style={{display: 'flex', gap: '0.5rem', alignItems: 'center'}}>
           <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)', cursor: 'pointer'}}><RotateCcw size={14} style={{display:'inline', verticalAlign:'middle', marginRight:'0.3rem'}}/> Reset to Defaults</span>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Row 1 */}
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{height: '100%'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Explanation Method</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Choose the primary method used to generate explanations.</p>
            
            <div className="radio-group-list">
               <div className="radio-item active">
                 <div className="radio-circle checked"></div>
                 <div className="ri-content">
                   <div className="ri-title">Attention Weights (LSTM/Transformer)</div>
                   <div className="ri-desc">Visualize the attention weights learned by the model.</div>
                 </div>
               </div>
               <div className="radio-item">
                 <div className="radio-circle"></div>
                 <div className="ri-content">
                   <div className="ri-title">SHAP (Shapley Additive Explanations)</div>
                   <div className="ri-desc">Explain predictions using SHAP feature attributions.</div>
                 </div>
               </div>
               <div className="radio-item">
                 <div className="radio-circle"></div>
                 <div className="ri-content">
                   <div className="ri-title">Feature Importance</div>
                   <div className="ri-desc">Rank features based on their importance score.</div>
                 </div>
               </div>
               <div className="radio-item">
                 <div className="radio-circle"></div>
                 <div className="ri-content">
                   <div className="ri-title">Captum (PyTorch)</div>
                   <div className="ri-desc">Deep learning model interpretability using Captum.</div>
                 </div>
               </div>
               <div className="radio-item active" style={{border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '6px', padding: '0.5rem'}}>
                 <div className="radio-circle checked" style={{borderColor: 'var(--accent-purple)'}}></div>
                 <div className="ri-content">
                   <div className="ri-title" style={{color: 'var(--accent-purple)'}}>Hybrid (Recommended)</div>
                   <div className="ri-desc">Combine multiple methods for robust explanations.</div>
                 </div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Hybrid mode provides the most comprehensive explanations but may increase computation time.
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{height: '100%'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Explanation Depth</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Set the level of detail in explanations.</p>
            
            <div className="radio-group-list">
               <div className="radio-item">
                 <div className="radio-circle"></div>
                 <div className="ri-content">
                   <div className="ri-title">Basic</div>
                   <div className="ri-desc">Show top risk factors and short summary.</div>
                 </div>
               </div>
               <div className="radio-item active" style={{border: '1px solid rgba(168, 85, 247, 0.3)', background: 'rgba(168, 85, 247, 0.05)', borderRadius: '6px', padding: '0.5rem'}}>
                 <div className="radio-circle checked" style={{borderColor: 'var(--accent-purple)'}}></div>
                 <div className="ri-content">
                   <div className="ri-title" style={{color: 'var(--accent-purple)'}}>Standard</div>
                   <div className="ri-desc">Show key factors, scores and reasoning.</div>
                 </div>
               </div>
               <div className="radio-item">
                 <div className="radio-circle"></div>
                 <div className="ri-content">
                   <div className="ri-title">Detailed</div>
                   <div className="ri-desc">Show all contributing factors and intermediate values.</div>
                 </div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: 'auto', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> Detailed explanations may be more useful for analysts but can be slower.
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{height: '100%'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Explanation Content</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Select what information to include in explanations.</p>
            
            <div className="checkbox-group-list">
               <div className="checkbox-item">
                 <div className="cb-box checked"><CheckCircle size={14} color="white"/></div>
                 <div className="cb-content">
                   <div className="cb-title">Include Risk Factors</div>
                   <div className="cb-desc">Show top contributing risk factors.</div>
                 </div>
               </div>
               <div className="checkbox-item">
                 <div className="cb-box checked"><CheckCircle size={14} color="white"/></div>
                 <div className="cb-content">
                   <div className="cb-title">Include Feature Values</div>
                   <div className="cb-desc">Show actual values of top features.</div>
                 </div>
               </div>
               <div className="checkbox-item">
                 <div className="cb-box checked"><CheckCircle size={14} color="white"/></div>
                 <div className="cb-content">
                   <div className="cb-title">Include Impact Score</div>
                   <div className="cb-desc">Show how much each factor contributed.</div>
                 </div>
               </div>
               <div className="checkbox-item">
                 <div className="cb-box checked"><CheckCircle size={14} color="white"/></div>
                 <div className="cb-content">
                   <div className="cb-title">Include Mitigation Suggestions</div>
                   <div className="cb-desc">Show recommended actions to mitigate risk.</div>
                 </div>
               </div>
               <div className="checkbox-item">
                 <div className="cb-box checked"><CheckCircle size={14} color="white"/></div>
                 <div className="cb-content">
                   <div className="cb-title">Include Timeline Context</div>
                   <div className="cb-desc">Show relevant historical context.</div>
                 </div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px', border: '1px solid rgba(168, 85, 247, 0.2)'}}>
               <Info size={14} style={{flexShrink: 0}}/> More content improves clarity but increases explanation length.
            </div>
          </div>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginTop: '1.5rem'}}>
        {/* Row 2 Col 1 (Spans 1.5) */}
        <div className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Visualization Settings</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Configure how explanations are visualized in the platform.</p>
            
            <div style={{display: 'flex', gap: '1.5rem', flex: 1}}>
              <div style={{flex: 1}}>
                 <div className="form-group-list">
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Chart Style</label>
                      <select value={config?.explainability?.chartStyle || ""} onChange={(e) => handleChange("explainability", "chartStyle", e.target.value)} name="explainability.chartStyle" className="select-input"><option>Bar Chart</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Color Scheme</label>
                      <select value={config?.explainability?.colorScheme || ""} onChange={(e) => handleChange("explainability", "colorScheme", e.target.value)} name="explainability.colorScheme" className="select-input"><option>Risk Based</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Max Features to Display</label>
                      <select value={config?.explainability?.maxFeaturesToDisplay || ""} onChange={(e) => handleChange("explainability", "maxFeaturesToDisplay", e.target.value)} name="explainability.maxFeaturesToDisplay" className="select-input"><option>10</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Show Percentage</label>
                      <div className={`switch ${config?.explainability?.showPercentage ? "active" : ""}`} onClick={() => handleChange("explainability", "showPercentage", !config?.explainability?.showPercentage)}><div className="switch-knob"></div></div>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                      <label>Show Cumulative Impact</label>
                      <div className={`switch ${config?.explainability?.showCumulativeImpact ? "active" : ""}`} onClick={() => handleChange("explainability", "showCumulativeImpact", !config?.explainability?.showCumulativeImpact)}><div className="switch-knob"></div></div>
                    </div>
                 </div>
              </div>
              <div style={{flex: 1.2, display: 'flex', flexDirection: 'column'}}>
                 <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>Preview</div>
                 <div style={{background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                    {[
                      {label: 'Unusual Login Time', val: '23.8%', w: '90%'},
                      {label: 'Impossible Travel', val: '18.7%', w: '75%'},
                      {label: 'Multiple Failed Logins', val: '12.5%', w: '50%'},
                      {label: 'New Device', val: '12.0%', w: '48%'},
                      {label: 'Data Exfiltration Pattern', val: '9.8%', w: '40%'}
                    ].map((bar, i) => (
                      <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <span style={{fontSize: '0.7rem', color: 'var(--text-secondary)', width: '110px'}}>{bar.label}</span>
                        <div style={{flex: 1, height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative', overflow: 'hidden'}}>
                           <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, width: bar.w, background: 'var(--accent-purple)', borderRadius: '2px'}}></div>
                        </div>
                        <span style={{fontSize: '0.7rem', color: 'var(--text-primary)', width: '35px', textAlign: 'right'}}>{bar.val}</span>
                      </div>
                    ))}
                    <div style={{textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>Impact Score (%)</div>
                 </div>
              </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', padding: '0'}}>
               <Info size={14} style={{flexShrink: 0}}/> Explainability improves analyst trust and accelerates incident response by providing clear reasons behind every alert.
            </div>
        </div>

        {/* Row 2 Col 2 (Spans 1) */}
        <div className="glass-panel" style={{display: 'flex', flexDirection: 'column'}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Natural Language Explanation</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>AI-generated human-readable explanations.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1}}>
                 <div className="form-group-list">
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Enable AI Summary</label>
                      <div className={`switch ${config?.explainability?.enableAiSummary ? "active" : ""}`} onClick={() => handleChange("explainability", "enableAiSummary", !config?.explainability?.enableAiSummary)}><div className="switch-knob"></div></div>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Summary Length</label>
                      <select value={config?.explainability?.summaryLength || ""} onChange={(e) => handleChange("explainability", "summaryLength", e.target.value)} name="explainability.summaryLength" className="select-input"><option>Medium</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Tone</label>
                      <select value={config?.explainability?.tone || ""} onChange={(e) => handleChange("explainability", "tone", e.target.value)} name="explainability.tone" className="select-input"><option>Professional</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0'}}>
                      <label>Language</label>
                      <select value={config?.explainability?.language || ""} onChange={(e) => handleChange("explainability", "language", e.target.value)} name="explainability.language" className="select-input"><option>English</option></select>
                    </div>
                    <div className="fg-item-horizontal" style={{padding: '0.5rem 0', borderBottom: 'none'}}>
                      <label>Include Recommendations</label>
                      <div className={`switch ${config?.explainability?.includeRecommendations ? "active" : ""}`} onClick={() => handleChange("explainability", "includeRecommendations", !config?.explainability?.includeRecommendations)}><div className="switch-knob"></div></div>
                    </div>
                 </div>

                 <div style={{flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', padding: '1rem'}}>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem'}}>AI Summary Preview</div>
                    <p style={{fontSize: '0.75rem', color: 'var(--text-primary)', lineHeight: '1.4', margin: '0 0 0.5rem 0'}}>
                      The user performed a login from an <span style={{color:'var(--accent-red)'}}>unusual location</span> that is geographically distant from their usual location. This was followed by <span style={{color:'var(--accent-red)'}}>multiple failed login attempts</span> and data access to sensitive resources, which is uncommon behavior for this user.
                    </p>
                    <div style={{fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold', marginBottom: '0.2rem'}}>Recommendations:</div>
                    <ul style={{fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0, paddingLeft: '1rem', lineHeight: '1.4'}}>
                      <li>Verify user identity</li>
                      <li>Check recent account activity</li>
                      <li>Enforce step-up authentication</li>
                    </ul>
                 </div>
            </div>
            
            <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '1rem'}}>
               <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem'}} onClick={() => handleAction("Save Explainability Settings")}><Save size={14} style={{marginRight: '0.4rem'}}/> Save Explainability Settings</button>
            </div>
        </div>
      </div>
    </div>
  );
}
