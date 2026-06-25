import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0, drivers: 0, trips: 0,
    fuel_cost: 0, maintenance_cost: 0, compliance_alerts: 0
  });

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [vehicles, drivers, trips, fuel, maintenance, compliance] = await Promise.all([
          axios.get(`${API}/vehicles/`),
          axios.get(`${API}/drivers/`),
          axios.get(`${API}/trips/`),
          axios.get(`${API}/fuel/`),
          axios.get(`${API}/maintenance/`),
          axios.get(`${API}/compliance/`),
        ]);

        const today = new Date();
        const alerts = compliance.data.filter(c => {
          const dates = [c.insurance_expiry, c.fitness_expiry, c.pollution_expiry, c.permit_expiry];
          return dates.some(d => {
            if (!d) return false;
            const diff = Math.ceil((new Date(d) - today) / (1000 * 60 * 60 * 24));
            return diff <= 30;
          });
        }).length;

        setStats({
          vehicles: vehicles.data.length,
          drivers: drivers.data.length,
          trips: trips.data.length,
          fuel_cost: fuel.data.reduce((sum, f) => sum + (parseFloat(f.cost) || 0), 0),
          maintenance_cost: maintenance.data.reduce((sum, m) => sum + (parseFloat(m.cost) || 0), 0),
          compliance_alerts: alerts
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Vehicles', value: stats.vehicles, color: '#4F8EF7', icon: '🚛' },
    { label: 'Total Drivers', value: stats.drivers, color: '#30D158', icon: '👤' },
    { label: 'Total Trips', value: stats.trips, color: '#FF9F0A', icon: '🗺️' },
    { label: 'Compliance Alerts', value: stats.compliance_alerts, color: '#FF453A', icon: '⚠️' },
    { label: 'Total Fuel Spend', value: `₹${stats.fuel_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#FF9F0A', icon: '⛽' },
    { label: 'Maintenance Spend', value: `₹${stats.maintenance_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#FF453A', icon: '🔧' },
  ];

  return (
    <div>
      <div className="page-title">Dashboard</div>
      <div className="page-subtitle">Fleet overview — live summary</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '28px' }}>
        {statCards.map(stat => (
          <div key={stat.label} className="card" style={{ padding: '24px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#48484E', marginBottom: '12px' }}>
              {stat.icon} {stat.label}
            </div>
            <div style={{ fontSize: '28px', fontWeight: 700, color: stat.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
              {stat.value}
            </div>
            <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', fontSize: '60px', opacity: 0.05 }}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {stats.compliance_alerts > 0 && (
        <div style={{
          background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.25)',
          borderRadius: '12px', padding: '18px 22px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '12px'
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div>
            <div style={{ fontSize: '14px', color: '#FF453A', fontWeight: 600 }}>
              {stats.compliance_alerts} vehicle{stats.compliance_alerts !== 1 ? 's' : ''} with compliance expiring soon
            </div>
            <div style={{ fontSize: '12px', color: '#8E8E9A', marginTop: '2px' }}>
              Check the Compliance module to review and renew documents.
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-label">Quick Stats</div>
          {[
            { label: 'Active Vehicles', value: stats.vehicles },
            { label: 'Licensed Drivers', value: stats.drivers },
            { label: 'Trips Logged', value: stats.trips },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1C1C26' }}>
              <span style={{ fontSize: '13.5px', color: '#8E8E9A' }}>{item.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: '#4F8EF7', fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: '24px' }}>
          <div className="section-label">Cost Summary</div>
          {[
            { label: 'Total Fuel Spend', value: `₹${stats.fuel_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#FF9F0A' },
            { label: 'Total Maintenance', value: `₹${stats.maintenance_cost.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#FF453A' },
            { label: 'Total Fleet Cost', value: `₹${(stats.fuel_cost + stats.maintenance_cost).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`, color: '#F2F2F7' },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1C1C26' }}>
              <span style={{ fontSize: '13.5px', color: '#8E8E9A' }}>{item.label}</span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', color: item.color, fontWeight: 600 }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}