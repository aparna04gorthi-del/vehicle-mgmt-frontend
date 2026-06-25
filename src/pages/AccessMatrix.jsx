import React from 'react';

const matrix = [
  {
    module: 'Vehicles',
    icon: '🚛',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: false, read: true,  update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Drivers',
    icon: '👤',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Trips',
    icon: '🗺️',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: true,  read: true,  update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: true,  read: true,  update: false, delete: false },
    }
  },
  {
    module: 'Fuel',
    icon: '⛽',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: true,  update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Maintenance',
    icon: '🔧',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: true,  update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Compliance',
    icon: '📋',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: true,  read: true,  update: true,  delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Bulk Import',
    icon: '📥',
    permissions: {
      admin:         { create: true,  read: true,  update: false, delete: false },
      fleet_manager: { create: true,  read: true,  update: false, delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
  {
    module: 'Users',
    icon: '⚙️',
    permissions: {
      admin:         { create: true,  read: true,  update: true,  delete: true  },
      fleet_manager: { create: false, read: false, update: false, delete: false },
      site_manager:  { create: false, read: false, update: false, delete: false },
      accounts:      { create: false, read: false, update: false, delete: false },
      driver:        { create: false, read: false, update: false, delete: false },
    }
  },
];

const roles = ['admin', 'fleet_manager', 'site_manager', 'accounts', 'driver'];
const roleLabels = {
  admin: 'Admin',
  fleet_manager: 'Fleet Manager',
  site_manager: 'Site Manager',
  accounts: 'Accounts',
  driver: 'Driver',
};

const roleColors = {
  admin: '#FF453A',
  fleet_manager: '#4F8EF7',
  site_manager: '#FF9F0A',
  accounts: '#30D158',
  driver: '#8E8E9A',
};

function Check({ value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {value ? (
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'rgba(48,209,88,0.15)', border: '1px solid rgba(48,209,88,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', color: '#30D158', fontWeight: 700
        }}>✓</div>
      ) : (
        <div style={{
          width: '20px', height: '20px', borderRadius: '50%',
          background: 'rgba(72,72,78,0.15)', border: '1px solid rgba(72,72,78,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '11px', color: '#48484E', fontWeight: 700
        }}>—</div>
      )}
    </div>
  );
}

export default function AccessMatrix() {
  return (
    <div>
      <div className="page-title">Access Matrix</div>
      <div className="page-subtitle">Role-based CRUD permissions across all modules</div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {roles.map(role => (
          <div key={role} style={{
            padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 600,
            background: `rgba(${role === 'admin' ? '255,69,58' : role === 'fleet_manager' ? '79,142,247' : role === 'site_manager' ? '255,159,10' : role === 'accounts' ? '48,209,88' : '142,142,154'},0.12)`,
            color: roleColors[role], border: `1px solid rgba(${role === 'admin' ? '255,69,58' : role === 'fleet_manager' ? '79,142,247' : role === 'site_manager' ? '255,159,10' : role === 'accounts' ? '48,209,88' : '142,142,154'},0.2)`
          }}>
            {roleLabels[role]}
          </div>
        ))}
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2A2A38' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#48484E', letterSpacing: '0.08em', textTransform: 'uppercase', width: '160px' }}>Module</th>
              <th style={{ padding: '14px 8px', fontSize: '11px', fontWeight: 600, color: '#48484E', letterSpacing: '0.08em', textTransform: 'uppercase', textAlign: 'center' }}>Action</th>
              {roles.map(role => (
                <th key={role} style={{ padding: '14px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: roleColors[role], letterSpacing: '0.04em', textTransform: 'uppercase', minWidth: '100px' }}>
                  {roleLabels[role]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIdx) => (
              ['create', 'read', 'update', 'delete'].map((action, actionIdx) => (
                <tr key={`${row.module}-${action}`} style={{
                  borderBottom: actionIdx === 3 ? '1px solid #2A2A38' : '1px solid #1C1C26',
                  background: actionIdx === 0 ? 'rgba(255,255,255,0.01)' : 'transparent'
                }}>
                  {actionIdx === 0 ? (
                    <td rowSpan={4} style={{ padding: '16px', verticalAlign: 'middle', borderRight: '1px solid #2A2A38' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '16px' }}>{row.icon}</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#F2F2F7' }}>{row.module}</span>
                      </div>
                    </td>
                  ) : null}
                  <td style={{ padding: '8px 16px', textAlign: 'center' }}>
                    <span style={{
                      fontSize: '10px', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', color: '#48484E',
                      padding: '2px 8px', borderRadius: '4px',
                      background: action === 'create' ? 'rgba(79,142,247,0.08)' : action === 'read' ? 'rgba(48,209,88,0.08)' : action === 'update' ? 'rgba(255,159,10,0.08)' : 'rgba(255,69,58,0.08)',
                      color: action === 'create' ? '#4F8EF7' : action === 'read' ? '#30D158' : action === 'update' ? '#FF9F0A' : '#FF453A',
                    }}>{action}</span>
                  </td>
                  {roles.map(role => (
                    <td key={role} style={{ padding: '8px', textAlign: 'center' }}>
                      <Check value={row.permissions[role][action]} />
                    </td>
                  ))}
                </tr>
              ))
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}