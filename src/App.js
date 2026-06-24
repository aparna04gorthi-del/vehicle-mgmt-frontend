import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import './index.css';
import Vehicles from './pages/Vehicles';
import Drivers from './pages/Drivers';
import Trips from './pages/Trips';
import Fuel from './pages/Fuel';
import Maintenance from './pages/Maintenance';
import Compliance from './pages/Compliance';

const navItems = [
  { path: '/vehicles', label: 'Vehicles', icon: '🚛' },
  { path: '/drivers', label: 'Drivers', icon: '👤' },
  { path: '/trips', label: 'Trips', icon: '🗺️' },
  { path: '/fuel', label: 'Fuel', icon: '⛽' },
  { path: '/maintenance', label: 'Maintenance', icon: '🔧' },
  { path: '/compliance', label: 'Compliance', icon: '📋' },
];

function Sidebar() {
  const location = useLocation();
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
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#48484E', textTransform: 'uppercase', padding: '8px 14px 6px' }}>Modules</div>
        {navItems.map(item => {
          const active = location.pathname === item.path || (location.pathname === '/' && item.path === '/vehicles');
          return (
            <Link key={item.path} to={item.path} className={`nav-link${active ? ' active' : ''}`}>
              <span style={{ fontSize: '14px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: '16px 20px', borderTop: '1px solid #2A2A38' }}>
        <div style={{ fontSize: '11px', color: '#48484E', fontFamily: 'JetBrains Mono, monospace' }}>v1.0.0 · local</div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0F' }}>
        <Sidebar />
        <div style={{ flex: 1, padding: '40px 44px', overflowY: 'auto', maxWidth: 'calc(100vw - 220px)' }}>
          <Routes>
            <Route path="/" element={<Vehicles />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/fuel" element={<Fuel />} />
            <Route path="/maintenance" element={<Maintenance />} />
            <Route path="/compliance" element={<Compliance />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;