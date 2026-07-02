import React, { useState } from 'react';
import axios from 'axios';

const API = 'http://Fleetms-backend-env.eba-upngx6a2.us-east-1.elasticbeanstalk.com';


export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) return;
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      const res = await axios.post(`${API}/auth/login`, formData);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('full_name', res.data.full_name || res.data.username);
      onLogin(res.data);
    } catch (err) {
      setError('Incorrect username or password.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh', background: '#0A0A0F',
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}>
      <div style={{
        width: '380px', background: '#111118',
        border: '1px solid #2A2A38', borderRadius: '16px', padding: '40px'
      }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#48484E', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase' }}>Fleet Control</div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#F2F2F7', letterSpacing: '-0.02em' }}>Sign in to FleetMS</div>
          <div style={{ fontSize: '13px', color: '#48484E', marginTop: '6px' }}>Enter your credentials to continue</div>
        </div>

        <div style={{ marginBottom: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E9A', marginBottom: '6px', letterSpacing: '0.04em' }}>USERNAME</div>
          <input
            className="input"
            placeholder="Enter username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#8E8E9A', marginBottom: '6px', letterSpacing: '0.04em' }}>PASSWORD</div>
          <input
            className="input"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleLogin()}
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.25)',
            borderRadius: '8px', padding: '10px 14px', marginBottom: '16px',
            fontSize: '13px', color: '#FF453A'
          }}>{error}</div>
        )}

        <button
          className="btn-primary"
          onClick={handleLogin}
          disabled={loading}
          style={{ width: '100%', padding: '11px' }}
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <div style={{ marginTop: '24px', padding: '16px', background: '#18181F', borderRadius: '8px', border: '1px solid #2A2A38' }}>
          <div style={{ fontSize: '11px', color: '#48484E', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Default credentials</div>
          <div style={{ fontSize: '12px', color: '#8E8E9A', fontFamily: 'JetBrains Mono, monospace' }}>admin / admin123</div>
        </div>
      </div>
    </div>
  );
}