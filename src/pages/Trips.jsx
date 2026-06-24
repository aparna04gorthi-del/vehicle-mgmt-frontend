import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [form, setForm] = useState({
    vehicle_id: '', driver_id: '', start_location: '',
    end_location: '', start_km: '', end_km: '', trip_date: '', status: ''
  });
  const [loading, setLoading] = useState(false);

  const fetchTrips = async () => {
    const res = await axios.get(`${API}/trips/`);
    setTrips(res.data);
  };

  useEffect(() => { fetchTrips(); }, []);

  const handleSubmit = async () => {
    if (!form.start_location) return;
    setLoading(true);
    await axios.post(`${API}/trips/`, form);
    setForm({ vehicle_id: '', driver_id: '', start_location: '', end_location: '', start_km: '', end_km: '', trip_date: '', status: '' });
    await fetchTrips();
    setLoading(false);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/trips/${id}`);
    fetchTrips();
  };

  const fields = [
    { key: 'vehicle_id', label: 'Vehicle ID' },
    { key: 'driver_id', label: 'Driver ID' },
    { key: 'start_location', label: 'Start Location' },
    { key: 'end_location', label: 'End Location' },
    { key: 'start_km', label: 'Start KM' },
    { key: 'end_km', label: 'End KM' },
    { key: 'trip_date', label: 'Trip Date (YYYY-MM-DD)' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div>
      <div className="page-title">Trips</div>
      <div className="page-subtitle">{trips.length} trip{trips.length !== 1 ? 's' : ''} logged</div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Log Trip</div>
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
          {loading ? 'Logging...' : 'Log Trip'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['From', 'To', 'Start KM', 'End KM', 'Distance', 'Date', 'Status', ''].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No trips logged yet.</td></tr>
            ) : trips.map(t => {
              const distance = t.end_km && t.start_km ? (t.end_km - t.start_km).toFixed(0) : '—';
              return (
                <tr key={t.trip_id}>
                  <td style={{ color: '#F2F2F7' }}>{t.start_location}</td>
                  <td style={{ color: '#F2F2F7' }}>{t.end_location}</td>
                  <td><span className="mono">{t.start_km}</span></td>
                  <td><span className="mono">{t.end_km}</span></td>
                  <td><span className="mono" style={{ color: '#30D158' }}>{distance} km</span></td>
                  <td><span className="mono">{t.trip_date}</span></td>
                  <td>
                    <span style={{
                      padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                      background: t.status === 'Completed' ? 'rgba(48,209,88,0.12)' : 'rgba(255,159,10,0.12)',
                      color: t.status === 'Completed' ? '#30D158' : '#FF9F0A'
                    }}>{t.status || '—'}</span>
                  </td>
                  <td><button className="btn-danger" onClick={() => handleDelete(t.trip_id)}>Remove</button></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}