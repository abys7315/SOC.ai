// This config determines the API base URL depending on the environment.
// If VITE_API_URL is set (e.g., in Vercel), it uses that.
// Otherwise, it falls back to empty string for relative paths (Render unified deployment).
export const API_BASE = import.meta.env.VITE_API_URL || '';

// Automatically derive WebSocket URL from API_URL if provided, else calculate dynamically
let derivedWsUrl = '';
if (import.meta.env.VITE_API_URL) {
    derivedWsUrl = import.meta.env.VITE_API_URL.replace(/^http/, 'ws');
} else {
    derivedWsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}`;
}
export const WS_BASE = derivedWsUrl;
