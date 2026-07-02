import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://Fleetms-backend-env.eba-upngx6a2.us-east-1.elasticbeanstalk.com';

export default function Fuel() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: '', fuel_date: '', litres: '',
    cost: '', fuel_station: '', payment_mode: ''
  });
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchEntries = async () => {
    const res = await axios.get(`${API}/fuel/`, getHeaders());
    setEntries(res.data);
  };

  useEffect(() => { fetchEntries(); }, []);

  const handleSubmit = async () => {
    if (!form.fuel_station) return;
    setLoading(true);
    await axios.post(`${API}/fuel/`, form, getHeaders());
    setForm({ vehicle_id: '', fuel_date: '', litres: '', cost: '', fuel_station: '', payment_mode: '' });
    await fetchEntries();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/fuel/${id}`, getHeaders());
    fetchEntries();
  };

  const fields = [
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'fuel_date', label: 'Date (YYYY-MM-DD)' },
    { key: 'litres', label: 'Litres' },
    { key: 'cost', label: 'Cost (₹)' },
    { key: 'fuel_station', label: 'Fuel Station' },
    { key: 'payment_mode', label: 'Payment Mode' },
  ];

  const totalCost = entries.reduce((sum, e) => sum + (parseFloat(e.cost) || 0), 0);
  const totalLitres = entries.reduce((sum, e) => sum + (parseFloat(e.litres) || 0), 0);

  return (
    <div>
      <div className="page-title">Fuel</div>
      <div className="page-subtitle">{entries.length} entr{entries.length !== 1 ? 'ies' : 'y'} recorded</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Spend', value: `₹${totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, color: '#FF9F0A' },
          { label: 'Total Litres', value: `${totalLitres.toFixed(1)} L`, color: '#4F8EF7' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#48484E', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: stat.color, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add Fuel Entry</div>
        <div className="form-grid">
          {fields.map(f => (
            <input
              key={f.key}
              className="input"
              placeholder={f.label}
              value={form[f.key]}
              onChange={e => setForm({ ...form, [f.key]: e.target.value })}
            />
          ))}
        </div>
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Adding...' : 'Add Entry'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['Date', 'Litres', 'Cost', 'Cost/L', 'Station', 'Payment', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {entries.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No fuel entries yet.</td></tr>
            ) : entries.map(f => {
              const costPerL = f.cost && f.litres ? (f.cost / f.litres).toFixed(2) : '—';
              return (
                <tr key={f.fuel_id}>
                  <td><span className="mono">{f.fuel_date}</span></td>
                  <td><span className="mono">{f.litres} L</span></td>
                  <td><span className="mono" style={{ color: '#FF9F0A' }}>₹{f.cost}</span></td>
                  <td><span className="mono">₹{costPerL}</span></td>
                  <td style={{ color: '#F2F2F7' }}>{f.fuel_station}</td>
                  <td>{f.payment_mode}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(f.fuel_id)}>Remove</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}