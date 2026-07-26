import React, { createContext, useState, useEffect, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [globalConfig, setGlobalConfig] = useState(null);
  const [theme, setTheme] = useState('Dark');
  const [userSession, setUserSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial config from backend (SQLite)
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/settings');
        const data = await res.json();
        setGlobalConfig(data);
        if (data?.general?.theme) {
          setTheme(data.general.theme);
        }
      } catch (err) {
        console.error("Failed to fetch global config:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  // Apply theme to document root
  useEffect(() => {
    let activeTheme = theme;
    if (theme === 'Auto' || theme === 'System') {
      activeTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'Light' : 'Dark';
    }
    document.documentElement.setAttribute('data-theme', activeTheme.toLowerCase());
  }, [theme]);

  // Session Timeout
  useEffect(() => {
    if (!userSession || !globalConfig) return;
    
    // Default 15 minutes if not configured
    let timeoutMs = 15 * 60 * 1000;
    const configuredTimeout = globalConfig?.general?.sessionTimeout;
    
    if (configuredTimeout) {
      if (configuredTimeout.includes('15')) timeoutMs = 15 * 60 * 1000;
      else if (configuredTimeout.includes('30')) timeoutMs = 30 * 60 * 1000;
      else if (configuredTimeout.includes('60')) timeoutMs = 60 * 60 * 1000;
    }

    const timer = setTimeout(() => {
      setUserSession(null);
      alert("Session expired due to inactivity.");
    }, timeoutMs);

    return () => clearTimeout(timer);
  }, [userSession, globalConfig]);

  // Handle configuration updates
  const updateConfig = async (newConfig) => {
    try {
      const res = await fetch('http://localhost:8000/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConfig)
      });
      const data = await res.json();
      if (data.status === 'success') {
        setGlobalConfig(newConfig);
        if (newConfig?.general?.theme) {
          setTheme(newConfig.general.theme);
        }
        return true;
      }
    } catch (err) {
      console.error("Failed to save config:", err);
    }
    return false;
  };

  const handleAction = async (actionName) => {
    try {
      const res = await fetch('http://localhost:8000/api/generic-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: actionName })
      });
      const data = await res.json();
      return data;
    } catch (e) {
      console.error(e);
      return { status: 'error', message: `Failed to execute: ${actionName}` };
    }
  };

  return (
    <AppContext.Provider value={{ globalConfig, updateConfig, theme, setTheme, userSession, setUserSession, handleAction, loading }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
