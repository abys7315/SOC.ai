import React from 'react';
import { Palette, Monitor, Sun, Moon, LayoutGrid, Type, Maximize, Save, Info, RefreshCw, CheckCircle, Sidebar } from 'lucide-react';

export default function SettingsAppearance({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>Appearance</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>Customize the platform's visual theme, layout, and density.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>1.</span> Theme Selection</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Choose your preferred visual mode.</p>
            
            <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem'}}>
               <div style={{flex: 1, padding: '1rem 0.5rem', border: '1px solid var(--accent-purple)', borderRadius: '6px', background: 'rgba(168, 85, 247, 0.1)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer'}}>
                  <Moon size={24} color="var(--accent-purple)" style={{marginBottom: '0.5rem'}}/>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Dark Mode</span>
                  <CheckCircle size={12} color="var(--accent-purple)" style={{position: 'absolute', top: '0.5rem', right: '0.5rem'}}/>
               </div>
               <div style={{flex: 1, padding: '1rem 0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative'}}>
                  <Sun size={24} color="var(--text-secondary)" style={{marginBottom: '0.5rem'}}/>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Light Mode</span>
               </div>
               <div style={{flex: 1, padding: '1rem 0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative'}}>
                  <Monitor size={24} color="var(--text-secondary)" style={{marginBottom: '0.5rem'}}/>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>System</span>
               </div>
            </div>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Accent Color</label>
                 <div style={{display: 'flex', gap: '0.5rem'}}>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#a855f7', border: '2px solid white'}}></div>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#3b82f6'}}></div>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#10b981'}}></div>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#f59e0b'}}></div>
                    <div style={{width: '20px', height: '20px', borderRadius: '50%', background: '#ff003c'}}></div>
                 </div>
               </div>
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>4.</span> Accessibility</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Options to improve visibility and contrast.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>High Contrast Text</label>
                 <div className={`switch ${config?.appearance?.highContrastText ? "active" : ""}`} onClick={() => handleChange("appearance", "highContrastText", !config?.appearance?.highContrastText)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Reduce Motion</label>
                 <div className={`switch ${config?.appearance?.reduceMotion ? "active" : ""}`} onClick={() => handleChange("appearance", "reduceMotion", !config?.appearance?.reduceMotion)}><div className="switch-knob"></div></div>
               </div>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>2.</span> Dashboard Layout</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Customize widget arrangements and default views.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Default Dashboard</label>
                 <select value={config?.appearance?.defaultDashboard || ""} onChange={(e) => handleChange("appearance", "defaultDashboard", e.target.value)} name="appearance.defaultDashboard" className="select-input" style={{width: '130px'}}><option>Security Overview</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Widget Density</label>
                 <select value={config?.appearance?.widgetDensity || ""} onChange={(e) => handleChange("appearance", "widgetDensity", e.target.value)} name="appearance.widgetDensity" className="select-input"><option>Comfortable</option></select>
               </div>
               <div className="fg-item-horizontal">
                 <label>Auto-hide Sidebar</label>
                 <div className={`switch ${config?.appearance?.autohideSidebar ? "active" : ""}`} onClick={() => handleChange("appearance", "autohideSidebar", !config?.appearance?.autohideSidebar)}><div className="switch-knob"></div></div>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Show Minimap</label>
                 <div className={`switch ${config?.appearance?.showMinimap ? "active" : ""}`} onClick={() => handleChange("appearance", "showMinimap", !config?.appearance?.showMinimap)}><div className="switch-knob"></div></div>
               </div>
            </div>

            <div style={{fontSize: '0.7rem', color: 'var(--accent-purple)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginTop: '1rem', border: '1px solid rgba(168, 85, 247, 0.2)', background: 'rgba(168, 85, 247, 0.05)', padding: '0.5rem', borderRadius: '4px'}}>
               <Info size={14} style={{flexShrink: 0}}/> Changes to layout only apply to your individual user account.
            </div>
          </div>

          <div className="glass-panel">
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>5.</span> Chart Defaults</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>How visualizations are rendered.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Default Chart Type</label>
                 <select value={config?.appearance?.defaultChartType || ""} onChange={(e) => handleChange("appearance", "defaultChartType", e.target.value)} name="appearance.defaultChartType" className="select-input"><option>Area Spline</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Color Palette</label>
                 <select value={config?.appearance?.colorPalette || ""} onChange={(e) => handleChange("appearance", "colorPalette", e.target.value)} name="appearance.colorPalette" className="select-input"><option>Cyberpunk</option></select>
               </div>
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>3.</span> Typography & Scaling</h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Adjust text size and UI scaling for better legibility.</p>
            
            <div className="form-group-list">
               <div className="fg-item-horizontal">
                 <label>Font Size</label>
                 <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                    <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>A</span>
                    <input type="range" min="1" max="5" defaultValue="3" style={{width: '60px'}}/>
                    <span style={{fontSize: '0.85rem', color: 'var(--text-secondary)'}}>A</span>
                 </div>
               </div>
               <div className="fg-item-horizontal">
                 <label>UI Scale</label>
                 <select value={config?.appearance?.uiScale || ""} onChange={(e) => handleChange("appearance", "uiScale", e.target.value)} name="appearance.uiScale" className="select-input" style={{width: '70px'}}><option>100%</option></select>
               </div>
               <div className="fg-item-horizontal" style={{borderBottom: 'none'}}>
                 <label>Font Family</label>
                 <select value={config?.appearance?.fontFamily || ""} onChange={(e) => handleChange("appearance", "fontFamily", e.target.value)} name="appearance.fontFamily" className="select-input"><option>Inter (System)</option></select>
               </div>
            </div>
            
            <div style={{marginTop: '1.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)'}}>
               <h4 style={{margin: '0 0 0.5rem 0', fontSize: '0.8rem', color: 'var(--text-primary)'}}>Preview</h4>
               <p style={{margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4'}}>
                  The quick brown fox jumps over the lazy dog. This text reflects your current typography settings across the entire platform.
               </p>
            </div>
          </div>
          
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: 'auto', paddingTop: '1rem'}}>
             <button className="btn-outline" style={{padding: '0.6rem 1rem'}} onClick={() => handleAction("Reset Defaults")}><RefreshCw size={14} style={{marginRight: '0.3rem'}}/> Reset Defaults</button>
             <button className="btn-solid-purple" style={{padding: '0.6rem 1.5rem', fontWeight: 'bold'}} onClick={() => handleAction("Save Appearance")}><Save size={14} style={{marginRight: '0.5rem', display: 'inline-block', verticalAlign: 'middle'}}/> Save Appearance</button>
          </div>
        </div>
      </div>
    </div>
  );
}
