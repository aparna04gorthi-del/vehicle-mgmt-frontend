import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://fleetss-backend-d0bxf9dyfadtc8hu.centralindia-01.azurewebsites.net';

function expiryStatus(dateStr) {
  if (!dateStr) return { label: '—', color: '#48484E', bg: 'rgba(72,72,78,0.12)' };
  const today = new Date();
  const expiry = new Date(dateStr);
  const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
  if (daysLeft < 0) return { label: 'Expired', color: '#FF453A', bg: 'rgba(255,69,58,0.12)' };
  if (daysLeft <= 30) return { label: `${daysLeft}d left`, color: '#FF9F0A', bg: 'rgba(255,159,10,0.12)' };
  return { label: `${daysLeft}d left`, color: '#30D158', bg: 'rgba(48,209,88,0.12)' };
}

export default function Compliance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: '', insurance_expiry: '', fitness_expiry: '',
    pollution_expiry: '', permit_expiry: '', remarks: ''
  });
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchRecords = async () => {
    const res = await axios.get(`${API}/compliance/`, getHeaders());
    setRecords(res.data);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSubmit = async () => {
    if (!form.vehicle_id) return;
    setLoading(true);
    await axios.post(`${API}/compliance/`, form, getHeaders());
    setForm({ vehicle_id: '', insurance_expiry: '', fitness_expiry: '', pollution_expiry: '', permit_expiry: '', remarks: '' });
    await fetchRecords();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/compliance/${id}`, getHeaders());
    fetchRecords();
  };

  const fields = [
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'insurance_expiry', label: 'Insurance Expiry (YYYY-MM-DD)' },
    { key: 'fitness_expiry', label: 'Fitness Expiry (YYYY-MM-DD)' },
    { key: 'pollution_expiry', label: 'Pollution Expiry (YYYY-MM-DD)' },
    { key: 'permit_expiry', label: 'Permit Expiry (YYYY-MM-DD)' },
    { key: 'remarks', label: 'Remarks' },
  ];

  const expired = records.filter(r => {
    const dates = [r.insurance_expiry, r.fitness_expiry, r.pollution_expiry, r.permit_expiry];
    return dates.some(d => d && new Date(d) < new Date());
  }).length;

  return (
    <div>
      <div className="page-title">Compliance</div>
      <div className="page-subtitle">{records.length} vehicle{records.length !== 1 ? 's' : ''} tracked · {expired} with expired documents</div>

      {expired > 0 && (
        <div style={{
          background: 'rgba(255,69,58,0.08)', border: '1px solid rgba(255,69,58,0.25)',
          borderRadius: '10px', padding: '14px 18px', marginBottom: '20px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}>
          <span style={{ fontSize: '16px' }}>⚠️</span>
          <span style={{ fontSize: '13.5px', color: '#FF453A', fontWeight: 500 }}>
            {expired} vehicle{expired !== 1 ? 's have' : ' has'} expired compliance documents. Action required.
          </span>
        </div>
      )}

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add Compliance Record</div>
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
          {loading ? 'Adding...' : 'Add Record'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['Vehicle ID', 'Insurance', 'Fitness', 'Pollution', 'Permit', 'Remarks', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No compliance records yet.</td></tr>
            ) : records.map(c => (
              <tr key={c.compliance_id}>
                <td><span className="mono">{c.vehicle_id?.slice(0, 8)}...</span></td>
                {[c.insurance_expiry, c.fitness_expiry, c.pollution_expiry, c.permit_expiry].map((date, i) => {
                  const status = expiryStatus(date);
                  return (
                    <td key={i}>
                      <div style={{ fontSize: '12px', color: '#48484E', fontFamily: 'JetBrains Mono, monospace', marginBottom: '4px' }}>{date || '—'}</div>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, background: status.bg, color: status.color }}>
                        {status.label}
                      </span>
                    </td>
                  );
                })}
                <td style={{ color: '#8E8E9A' }}>{c.remarks}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(c.compliance_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}