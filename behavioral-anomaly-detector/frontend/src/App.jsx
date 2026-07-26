import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopHUD from './components/TopHUD';
import Dashboard from './pages/Dashboard';
import Alerts from './pages/Alerts';
import EntityExplorer from './pages/EntityExplorer';
import BehaviorAnalytics from './pages/BehaviorAnalytics';
import AttackInjection from './pages/AttackInjection';
import Explainability from './pages/Explainability';
import Evaluation from './pages/Evaluation';
import SystemHealth from './pages/SystemHealth';
import DataGenerator from './pages/DataGenerator';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { useAppContext } from './AppContext';
import './App.css'; // Add layout CSS

const API_BASE = '';
const WS_URL = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/alerts`;

function App() {
  const { userSession, loading } = useAppContext();
  const [alerts, setAlerts] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalToast, setGlobalToast] = useState(null);
  const wsRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE}/alerts`)
      .then(res => res.json())
      .then(data => setAlerts(data))
      .catch(err => console.error("Failed to fetch initial alerts:", err));

    const connectWs = () => {
      const ws = new WebSocket(WS_URL);
      ws.onopen = () => setConnectionStatus('SECURE LINK ACTIVE');
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'new_alert') {
          setAlerts(prev => {
            if (prev.find(a => a.id === data.alert.id)) return prev;
            return [data.alert, ...prev].slice(0, 100);
          });
        }
      };
      ws.onclose = () => {
        setConnectionStatus('CONNECTION LOST. RETRYING...');
        setTimeout(connectWs, 3000);
      };
      ws.onerror = () => ws.close();
      wsRef.current = ws;
    };
    connectWs();
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  if (loading) {
    return <div style={{height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-dark)', color: 'white'}}>Loading Platform Configuration...</div>;
  }

  // if (!userSession) {
  //   return <Login />;
  // }

  return (
    <Router>
      <div className="app-layout">
        <Sidebar mobileOpen={mobileOpen} closeSidebar={() => setMobileOpen(false)} alerts={alerts} />
        <div className="main-content">
          <TopHUD title="Dashboard Overview" connectionStatus={connectionStatus} toggleSidebar={() => setMobileOpen(true)} />
          
          {globalToast && (
            <div className="global-toast">
              <span className="toast-icon">✓</span>
              {globalToast}
            </div>
          )}
          
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard alerts={alerts} />} />
              <Route path="/alerts" element={<Alerts alerts={alerts} />} />
              <Route path="/entities" element={<EntityExplorer alerts={alerts} />} />
              <Route path="/analytics" element={<BehaviorAnalytics />} />
              <Route path="/injection" element={<AttackInjection alerts={alerts} />} />
              <Route path="/explainability" element={<Explainability alerts={alerts} />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/health" element={<SystemHealth />} />
              <Route path="/generator" element={<DataGenerator />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
