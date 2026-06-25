import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    registration_no: '', vehicle_type: '', make: '',
    model: '', year: '', status: '', assigned_site: '',
    rc_no: '', rc_expiry: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchVehicles = async () => {
    const res = await axios.get(`${API}/vehicles/`);
    setVehicles(res.data);
  };

  useEffect(() => { fetchVehicles(); }, []);

  const handleSubmit = async () => {
    if (!form.registration_no) return;
    setLoading(true);
    await axios.post(`${API}/vehicles/`, form);
    setForm({ registration_no: '', vehicle_type: '', make: '', model: '', year: '', status: '', assigned_site: '', rc_no: '', rc_expiry: '' });
    await fetchVehicles();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/vehicles/${id}`);
    fetchVehicles();
  };

  const fields = [
    { key: 'registration_no', label: 'Registration No' },
    { key: 'vehicle_type', label: 'Vehicle Type' },
    { key: 'make', label: 'Make' },
    { key: 'model', label: 'Model' },
    { key: 'year', label: 'Year' },
    { key: 'status', label: 'Status' },
    { key: 'assigned_site', label: 'Assigned Site' },
    { key: 'rc_no', label: 'RC Number' },
    { key: 'rc_expiry', label: 'RC Expiry (YYYY-MM-DD)' },
  ];

  return (
    <div>
      <div className="page-title">Vehicles</div>
      <div className="page-subtitle">{vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} registered</div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add Vehicle</div>
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
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['Reg No', 'Type', 'Make', 'Model', 'Year', 'Status', 'Site', 'RC No', 'RC Expiry', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.length === 0 ? (
              <tr><td colSpan={10} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No vehicles registered yet.</td></tr>
            ) : vehicles.map(v => (
              <tr key={v.vehicle_id}>
                <td><span className="mono">{v.registration_no}</span></td>
                <td>{v.vehicle_type}</td>
                <td>{v.make}</td>
                <td>{v.model}</td>
                <td><span className="mono">{v.year}</span></td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                    background: v.status === 'Active' ? 'rgba(48,209,88,0.12)' : 'rgba(142,142,154,0.12)',
                    color: v.status === 'Active' ? '#30D158' : '#8E8E9A'
                  }}>{v.status || '—'}</span>
                </td>
                <td>{v.assigned_site}</td>
                <td><span className="mono">{v.rc_no || '—'}</span></td>
                <td><span className="mono">{v.rc_expiry || '—'}</span></td>
                <td><button className="btn-danger" onClick={() => handleDelete(v.vehicle_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}