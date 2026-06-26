import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://fleetss-backend-d0bxf9dyfadtc8hu.centralindia-01.azurewebsites.net';

export default function Maintenance() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: '', service_type: '', service_date: '',
    cost: '', vendor: '', remarks: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchRecords = async () => {
    const res = await axios.get(`${API}/maintenance/`);
    setRecords(res.data);
  };

  useEffect(() => { fetchRecords(); }, []);

  const handleSubmit = async () => {
    if (!form.service_type) return;
    setLoading(true);
    await axios.post(`${API}/maintenance/`, form);
    setForm({ vehicle_id: '', service_type: '', service_date: '', cost: '', vendor: '', remarks: '' });
    await fetchRecords();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/maintenance/${id}`);
    fetchRecords();
  };

  const fields = [
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'service_type', label: 'Service Type' },
    { key: 'service_date', label: 'Service Date (YYYY-MM-DD)' },
    { key: 'cost', label: 'Cost (₹)' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'remarks', label: 'Remarks' },
  ];

  const totalCost = records.reduce((sum, r) => sum + (parseFloat(r.cost) || 0), 0);

  return (
    <div>
      <div className="page-title">Maintenance</div>
      <div className="page-subtitle">{records.length} service record{records.length !== 1 ? 's' : ''}</div>

      <div className="card" style={{ padding: '20px 24px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#48484E', marginBottom: '6px' }}>Total Maintenance Spend</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#FF453A', fontFamily: 'JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
            ₹{totalCost.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
        </div>
        <div style={{ fontSize: '36px', opacity: 0.15 }}>🔧</div>
      </div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add Service Record</div>
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
              {['Service Type', 'Date', 'Cost', 'Vendor', 'Remarks', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No service records yet.</td></tr>
            ) : records.map(m => (
              <tr key={m.maintenance_id}>
                <td style={{ color: '#F2F2F7', fontWeight: 500 }}>{m.service_type}</td>
                <td><span className="mono">{m.service_date}</span></td>
                <td><span className="mono" style={{ color: '#FF453A' }}>₹{m.cost}</span></td>
                <td>{m.vendor}</td>
                <td style={{ color: '#8E8E9A', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.remarks}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(m.maintenance_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}