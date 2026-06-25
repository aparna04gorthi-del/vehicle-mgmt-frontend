import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({
    name: '', phone: '', license_no: '',
    license_expiry: '', address: '', status: ''
  });
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchDrivers = async () => {
    const res = await axios.get(`${API}/drivers/`, getHeaders());
    setDrivers(res.data);
  };

  useEffect(() => { fetchDrivers(); }, []);

  const handleSubmit = async () => {
    if (!form.name) return;
    setLoading(true);
    await axios.post(`${API}/drivers/`, form, getHeaders());
    setForm({ name: '', phone: '', license_no: '', license_expiry: '', address: '', status: '' });
    await fetchDrivers();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/drivers/${id}`, getHeaders());
    fetchDrivers();
  };

  const fields = [
    { key: 'name', label: 'Full Name' },
    { key: 'phone', label: 'Phone' },
    { key: 'license_no', label: 'License No' },
    { key: 'license_expiry', label: 'License Expiry (YYYY-MM-DD)' },
    { key: 'address', label: 'Address' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div>
      <div className="page-title">Drivers</div>
      <div className="page-subtitle">{drivers.length} driver{drivers.length !== 1 ? 's' : ''} on record</div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add Driver</div>
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
          {loading ? 'Adding...' : 'Add Driver'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['Name', 'Phone', 'License No', 'Expiry', 'Address', 'Status', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No drivers on record yet.</td></tr>
            ) : drivers.map(d => (
              <tr key={d.driver_id}>
                <td style={{ color: '#F2F2F7', fontWeight: 500 }}>{d.name}</td>
                <td><span className="mono">{d.phone}</span></td>
                <td><span className="mono">{d.license_no}</span></td>
                <td><span className="mono">{d.license_expiry}</span></td>
                <td>{d.address}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                    background: d.status === 'Active' ? 'rgba(48,209,88,0.12)' : 'rgba(142,142,154,0.12)',
                    color: d.status === 'Active' ? '#30D158' : '#8E8E9A'
                  }}>{d.status || '—'}</span>
                </td>
                <td><button className="btn-danger" onClick={() => handleDelete(d.driver_id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}