import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://fleetss-backend-d0bxf9dyfadtc8hu.centralindia-01.azurewebsites.net';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    role: 'driver', full_name: '', assigned_site: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/auth/users`, getHeaders());
    setUsers(res.data);
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) {
      setError('Username, email and password are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${API}/auth/register`, form, getHeaders());
      setForm({ username: '', email: '', password: '', role: 'driver', full_name: '', assigned_site: '' });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user.');
    }
    setLoading(false);
  };

  const roles = ['admin', 'fleet_manager', 'site_manager', 'accounts', 'driver'];

  const roleColors = {
    admin: { bg: 'rgba(255,69,58,0.12)', color: '#FF453A' },
    fleet_manager: { bg: 'rgba(79,142,247,0.12)', color: '#4F8EF7' },
    site_manager: { bg: 'rgba(255,159,10,0.12)', color: '#FF9F0A' },
    accounts: { bg: 'rgba(48,209,88,0.12)', color: '#30D158' },
    driver: { bg: 'rgba(142,142,154,0.12)', color: '#8E8E9A' },
  };

  return (
    <div>
      <div className="page-title">User Management</div>
      <div className="page-subtitle">{users.length} user{users.length !== 1 ? 's' : ''} in the system</div>

      <div className="card" style={{ marginBottom: '20px', padding: '24px' }}>
        <div className="section-label">Add User</div>
        <div className="form-grid">
          <input className="input" placeholder="Full Name" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} />
          <input className="input" placeholder="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <input className="input" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className="input" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          <select
            className="input"
            value={form.role}
            onChange={e => setForm({ ...form, role: e.target.value })}
            style={{ cursor: 'pointer' }}
          >
            {roles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <input className="input" placeholder="Assigned Site (optional)" value={form.assigned_site} onChange={e => setForm({ ...form, assigned_site: e.target.value })} />
        </div>
        {error && (
          <div style={{ background: 'rgba(255,69,58,0.1)', border: '1px solid rgba(255,69,58,0.25)', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '13px', color: '#FF453A' }}>
            {error}
          </div>
        )}
        <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create User'}
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              {['Full Name', 'Username', 'Email', 'Role', 'Site', 'Status'].map(h => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#48484E' }}>No users yet.</td></tr>
            ) : users.map(u => (
              <tr key={u.user_id}>
                <td style={{ color: '#F2F2F7', fontWeight: 500 }}>{u.full_name || '—'}</td>
                <td><span className="mono">{u.username}</span></td>
                <td style={{ color: '#8E8E9A' }}>{u.email}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
                    background: roleColors[u.role]?.bg, color: roleColors[u.role]?.color
                  }}>{u.role}</span>
                </td>
                <td>{u.assigned_site || '—'}</td>
                <td>
                  <span style={{
                    padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 500,
                    background: u.is_active ? 'rgba(48,209,88,0.12)' : 'rgba(142,142,154,0.12)',
                    color: u.is_active ? '#30D158' : '#8E8E9A'
                  }}>{u.is_active ? 'Active' : 'Inactive'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}