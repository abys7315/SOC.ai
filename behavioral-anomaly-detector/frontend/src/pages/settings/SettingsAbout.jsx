import React from 'react';
import { Info, CheckCircle, ExternalLink, FileText, Book, ShieldAlert, Cpu } from 'lucide-react';

export default function SettingsAbout({ config, handleChange, handleSave, handleAction }) {
  return (
    <div className="settings-tab-container">
      <div className="settings-section-header">
         <div>
           <h2 style={{margin: 0, fontSize: '1.2rem', color: 'var(--text-primary)'}}>About Platform</h2>
           <p style={{margin: '0.25rem 0 1.5rem 0', fontSize: '0.8rem', color: 'var(--text-secondary)'}}>System information, version details, and support resources.</p>
         </div>
      </div>

      <div className="settings-grid-3col">
        {/* Column 1 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: '3rem'}}>
            <div style={{width: '64px', height: '64px', background: 'var(--accent-red)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 0 20px rgba(255,0,60,0.3)'}}>
               <ShieldAlert size={32} color="white"/>
            </div>
            <h3 style={{color: 'var(--text-primary)', margin: '0 0 0.5rem 0', fontSize: '1.2rem'}}>Honeywell BADP</h3>
            <p style={{color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 2rem 0'}}>Behavioral Anomaly Detection Platform</p>
            
            <div style={{background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px', padding: '1rem', width: '100%', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Version</span>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 'bold'}}>v3.4.2 Enterprise</span>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Build ID</span>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>b_83910x_prod</span>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>License Tier</span>
                  <span style={{fontSize: '0.75rem', color: 'var(--accent-cyan)'}}>Global SOC License</span>
               </div>
               <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-secondary)'}}>Expiration</span>
                  <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>Never (Perpetual)</span>
               </div>
            </div>
            
            <div style={{marginTop: 'auto', paddingTop: '2rem', fontSize: '0.65rem', color: 'var(--text-secondary)'}}>
               &copy; {new Date().getFullYear()} Honeywell International Inc.<br/>All rights reserved.
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>System Status</span></h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Connection checks for backend core services.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
               {[
                 {name: 'Core API Server', status: 'Online', ms: '12ms'},
                 {name: 'PostgreSQL Database', status: 'Online', ms: '8ms'},
                 {name: 'Redis Cache', status: 'Online', ms: '2ms'},
                 {name: 'Kafka Event Bus', status: 'Online', ms: '15ms'},
                 {name: 'AI Inference Engine', status: 'Online', ms: '45ms'},
                 {name: 'S3 Storage Gateway', status: 'Online', ms: '22ms'}
               ].map((service, i) => (
                 <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.6rem 0', borderBottom: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                       <CheckCircle size={14} color="var(--accent-green)"/>
                       <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>{service.name}</span>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                       <span style={{fontSize: '0.65rem', color: 'var(--text-secondary)'}}>{service.ms}</span>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Column 3 */}
        <div className="settings-col">
          <div className="glass-panel" style={{flex: 1}}>
            <h3 className="panel-title" style={{color: 'var(--text-primary)'}}><span style={{color:'var(--accent-purple)'}}>Resources & Legal</span></h3>
            <p style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', marginTop: '-0.5rem'}}>Documentation, support, and legal information.</p>
            
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
               {[
                 {icon: <Book size={16} color="var(--accent-cyan)"/>, title: 'User Manual & Guides'},
                 {icon: <Cpu size={16} color="var(--accent-cyan)"/>, title: 'API Documentation'},
                 {icon: <ExternalLink size={16} color="var(--accent-cyan)"/>, title: 'Honeywell Technical Support'},
                 {icon: <FileText size={16} color="var(--accent-cyan)"/>, title: 'End User License Agreement (EULA)'},
                 {icon: <FileText size={16} color="var(--accent-cyan)"/>, title: 'Privacy Policy'},
                 {icon: <Info size={16} color="var(--accent-cyan)"/>, title: 'Open Source Licenses'},
               ].map((item, i) => (
                 <div key={i} style={{display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', transition: 'background 0.2s'}}>
                    {item.icon}
                    <span style={{fontSize: '0.75rem', color: 'var(--text-primary)'}}>{item.title}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
