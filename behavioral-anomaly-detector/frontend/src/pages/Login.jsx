import React, { useState } from 'react';
import { Shield, Lock, User, Key } from 'lucide-react';
import { useAppContext } from '../AppContext';
import './Login.css';

export default function Login() {
  const { setUserSession, globalConfig } = useAppContext();
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      // Check if MFA is required (simulated by checking globalConfig if it existed, for now just use a mock flag or assume enabled if we want to show it off)
      const mfaEnabled = globalConfig?.security?.mfaEnabled ?? true; 
      if (mfaEnabled) {
        setStep(2);
      } else {
        setUserSession({ username, role: 'admin' });
      }
    } else {
      setError("Invalid credentials");
    }
  };

  const handleMFA = (e) => {
    e.preventDefault();
    if (otp === '123456') { // Mock OTP
      setUserSession({ username, role: 'admin' });
    } else {
      setError("Invalid OTP. Hint: 123456");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box glass-panel">
        <div className="login-header">
          <Shield size={48} color="var(--accent-cyan)" />
          <h2>SOC Authentication</h2>
          <p>Honeywell Behavioral Anomaly Detection</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        {step === 1 ? (
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label><User size={14}/> Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter username (admin)" />
            </div>
            <div className="form-group">
              <label><Lock size={14}/> Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter password (admin)" />
            </div>
            <button type="submit" className="btn-solid-cyan login-btn">AUTHENTICATE</button>
          </form>
        ) : (
          <form onSubmit={handleMFA} className="login-form">
            <p style={{textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem'}}>
              Multi-Factor Authentication required. Please enter the 6-digit code sent to your device.
            </p>
            <div className="form-group">
              <label><Key size={14}/> One-Time Password</label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="123456" maxLength="6" style={{letterSpacing: '0.5rem', textAlign: 'center', fontSize: '1.5rem'}}/>
            </div>
            <button type="submit" className="btn-solid-cyan login-btn">VERIFY</button>
            <div style={{textAlign: 'center', marginTop: '1rem'}}>
              <a href="#" onClick={() => setStep(1)} style={{color: 'var(--accent-cyan)', fontSize: '0.8rem'}}>Back to Login</a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
