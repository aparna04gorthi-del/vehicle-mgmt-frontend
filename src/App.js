import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Fuel from './pages/Fuel';
import Maintenance from './pages/Maintenance';
import Compliance from './pages/Compliance';
import Users from './pages/Users';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '📊', roles: ['admin', 'fleet_manager', 'site_manager', 'accounts', 'driver'] },
  { path: '/vehicles', label: 'Vehicles', icon: '🚛', roles: ['admin', 'fleet_manager', 'site_manager'] },
  { path: '/drivers', label: 'Drivers', icon: '👤', roles: ['admin', 'fleet_manager'] },
  { path: '/trips', label: 'Trips', icon: '🗺️', roles: ['admin', 'fleet_manager', 'site_manager', 'driver'] },
  { path: '/fuel', label: 'Fuel', icon: '⛽', roles: ['admin', 'fleet_manager', 'accounts'] },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧', roles: ['admin', 'fleet_manager', 'accounts'] },
  { path: '/compliance', label: 'Compliance', icon: '📋', roles: ['admin', 'fleet_manager'] },
  { path: '/users', label: 'Users', icon: '⚙️', roles: ['admin'] },
];

function Sidebar({ user, onLogout }) {
  const location = useLocation();
  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return (
    <div style={{
      width: '220px', minHeight: '100vh', background: '#0A0A0F',
      borderRight: '1px solid #2A2A38', display: 'flex',
      flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh'
    }}>
      <div style={{ padding: '28px 20px 20px', borderBottom: '1px solid #2A2A38' }}>
        <div style={{ fontSize: '10px', letterSpacing: '0.12em', color: '#48484E', marginBottom: '6px', fontWeight: 600, textTransform: 'uppercase' }}>Fleet Control</div>
        <div style={{ fontSize: '17px', fontWeight: 700, color: '#F2F2F7', letterSpacing: '-0.02em' }}>VehicleMS</div>
      </div>

      <div style={{ padding: '16px 20px', borderBottom: '1px solid #2A2A38' }}>
        <div style={{ fontSize: '12px', color: '#F2F2F7', fontWeight: 600 }}>{user.full_name || user.username}</div>
        <div style={{
          display: 'inline-block', marginTop: '4px', padding: '2px 8px',
          borderRadius: '4px', fontSize: '11px', fontWeight: 600,
          background: 'rgba(79,142,247,0.12)', color: '#4F8EF7'
        }}>{user.role}</div>
      </div>

      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#48484E', textTransform: 'uppercase', padding: '8px 14px 6px' }}>Modules</div>
        {filteredNav.map(item => {
          const active = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`nav-link${active ? ' active' : ''}`}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2A38' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%', background: 'transparent', border: '1px solid #2A2A38',
            borderRadius: '8px', padding: '8px', color: '#8E8E9A', fontSize: '13px',
            cursor: 'pointer', fontFamily: 'Inter, sans-serif', transition: 'all 200ms ease-out'
          }}
        >Sign out</button>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const full_name = localStorage.getItem('full_name');
    if (token) setUser({ token, role, full_name });
  }, []);

  const handleLogin = (data) => {
    setUser(data);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('full_name');
    setUser(null);
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
        <Sidebar user={user} onLogout={handleLogout} />
        <div style={{ flex: 1, padding: '40px 44px', overflowY: 'auto', maxWidth: 'calc(100vw - 220px)' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/compliance" element={<Compliance />} />
            <Route path="/users" element={<Users />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;