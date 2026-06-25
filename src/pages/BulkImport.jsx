import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';

const API = 'http://localhost:8000';

export default function BulkImport() {
  const [vehicleFile, setVehicleFile] = useState(null);
  const [driverFile, setDriverFile] = useState(null);
  const [vehiclePreview, setVehiclePreview] = useState([]);
  const [driverPreview, setDriverPreview] = useState([]);
  const [vehicleStatus, setVehicleStatus] = useState('');
  const [driverStatus, setDriverStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const getHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });

  const handleVehicleFile = (e) => {
    const file = e.target.files[0];
    setVehicleFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setVehiclePreview(data.slice(0, 5));
    };
    reader.readAsBinaryString(file);
  };

  const handleDriverFile = (e) => {
    const file = e.target.files[0];
    setDriverFile(file);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      setDriverPreview(data.slice(0, 5));
    };
    reader.readAsBinaryString(file);
  };

  const importVehicles = async () => {
    if (!vehicleFile) return;
    setLoading(true);
    setVehicleStatus('');
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      let success = 0, failed = 0;
      for (const row of data) {
        try {
          await axios.post(`${API}/vehicles/`, {
            registration_no: row['Registration No'] || row['registration_no'],
            vehicle_type: row['Vehicle Type'] || row['vehicle_type'],
            make: row['Make'] || row['make'],
            model: row['Model'] || row['model'],
            year: row['Year'] || row['year'],
            status: row['Status'] || row['status'],
            assigned_site: row['Assigned Site'] || row['assigned_site'],
            rc_no: row['RC No'] || row['rc_no'],
            rc_expiry: row['RC Expiry'] || row['rc_expiry'],
          }, getHeaders());
          success++;
        } catch { failed++; }
      }
      setVehicleStatus(`✅ ${success} imported successfully. ${failed > 0 ? `❌ ${failed} failed.` : ''}`);
      setLoading(false);
    };
    reader.readAsBinaryString(vehicleFile);
  };

  const importDrivers = async () => {
    if (!driverFile) return;
    setLoading(true);
    setDriverStatus('');
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'binary' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(ws);
      let success = 0, failed = 0;
      for (const row of data) {
        try {
          await axios.post(`${API}/drivers/`, {
            name: row['Name'] || row['name'],
            phone: row['Phone'] || row['phone'],
            license_no: row['License No'] || row['license_no'],
            license_expiry: row['License Expiry'] || row['license_expiry'],
            address: row['Address'] || row['address'],
            status: row['Status'] || row['status'],
          }, getHeaders());
          success++;
        } catch { failed++; }
      }
      setDriverStatus(`✅ ${success} imported successfully. ${failed > 0 ? `❌ ${failed} failed.` : ''}`);
      setLoading(false);
    };
    reader.readAsBinaryString(driverFile);
  };

  const downloadTemplate = (type) => {
    const vehicleTemplate = [{ 'Registration No': 'MH01AB1234', 'Vehicle Type': 'Truck', 'Make': 'Tata', 'Model': 'Prima', 'Year': 2020, 'Status': 'Active', 'Assigned Site': 'Site A', 'RC No': 'RC123456', 'RC Expiry': '2026-12-31' }];
    const driverTemplate = [{ 'Name': 'John Doe', 'Phone': '9876543210', 'License No': 'DL123456', 'License Expiry': '2027-06-30', 'Address': '123 Main St', 'Status': 'Active' }];
    const data = type === 'vehicle' ? vehicleTemplate : driverTemplate;
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `${type}_template.xlsx`);
  };

  return (
    <div>
      <div className="page-title">Bulk Import</div>
      <div className="page-subtitle">Import vehicles and drivers from Excel files</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>

        {/* Vehicle Import */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-label">Import Vehicles</div>
          <button
            onClick={() => downloadTemplate('vehicle')}
            style={{ marginBottom: '16px', background: 'transparent', border: '1px solid #2A2A38', borderRadius: '8px', padding: '8px 16px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            ↓ Download Template
          </button>

          <div style={{
            border: '1px dashed #2A2A38', borderRadius: '8px', padding: '24px',
            textAlign: 'center', marginBottom: '16px', cursor: 'pointer',
            background: vehicleFile ? 'rgba(48,209,88,0.05)' : 'transparent'
          }}>
            <input type="file" accept=".xlsx,.xls" onChange={handleVehicleFile} style={{ display: 'none' }} id="vehicle-file" />
            <label htmlFor="vehicle-file" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
              <div style={{ fontSize: '13px', color: vehicleFile ? '#30D158' : '#48484E' }}>
                {vehicleFile ? vehicleFile.name : 'Click to select Excel file'}
              </div>
            </label>
          </div>

          {vehiclePreview.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#48484E', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview (first 5 rows)</div>
              <div style={{ overflowX: 'auto', fontSize: '11px', color: '#8E8E9A', background: '#18181F', borderRadius: '6px', padding: '10px' }}>
                {vehiclePreview.map((row, i) => (
                  <div key={i} style={{ marginBottom: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {row['Registration No'] || row['registration_no']} — {row['Make'] || row['make']} {row['Model'] || row['model']}
                  </div>
                ))}
              </div>
            </div>
          )}

          {vehicleStatus && (
            <div style={{ fontSize: '13px', color: '#30D158', marginBottom: '12px', padding: '10px', background: 'rgba(48,209,88,0.08)', borderRadius: '6px', border: '1px solid rgba(48,209,88,0.2)' }}>
              {vehicleStatus}
            </div>
          )}

          <button className="btn-primary" onClick={importVehicles} disabled={!vehicleFile || loading} style={{ width: '100%' }}>
            {loading ? 'Importing...' : 'Import Vehicles'}
          </button>
        </div>

        {/* Driver Import */}
        <div className="card" style={{ padding: '24px' }}>
          <div className="section-label">Import Drivers</div>
          <button
            onClick={() => downloadTemplate('driver')}
            style={{ marginBottom: '16px', background: 'transparent', border: '1px solid #2A2A38', borderRadius: '8px', padding: '8px 16px', color: '#4F8EF7', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}
          >
            ↓ Download Template
          </button>

          <div style={{
            border: '1px dashed #2A2A38', borderRadius: '8px', padding: '24px',
            textAlign: 'center', marginBottom: '16px', cursor: 'pointer',
            background: driverFile ? 'rgba(48,209,88,0.05)' : 'transparent'
          }}>
            <input type="file" accept=".xlsx,.xls" onChange={handleDriverFile} style={{ display: 'none' }} id="driver-file" />
            <label htmlFor="driver-file" style={{ cursor: 'pointer' }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>📋</div>
              <div style={{ fontSize: '13px', color: driverFile ? '#30D158' : '#48484E' }}>
                {driverFile ? driverFile.name : 'Click to select Excel file'}
              </div>
            </label>
          </div>

          {driverPreview.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '11px', color: '#48484E', marginBottom: '8px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview (first 5 rows)</div>
              <div style={{ overflowX: 'auto', fontSize: '11px', color: '#8E8E9A', background: '#18181F', borderRadius: '6px', padding: '10px' }}>
                {driverPreview.map((row, i) => (
                  <div key={i} style={{ marginBottom: '4px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {row['Name'] || row['name']} — {row['License No'] || row['license_no']}
                  </div>
                ))}
              </div>
            </div>
          )}

          {driverStatus && (
            <div style={{ fontSize: '13px', color: '#30D158', marginBottom: '12px', padding: '10px', background: 'rgba(48,209,88,0.08)', borderRadius: '6px', border: '1px solid rgba(48,209,88,0.2)' }}>
              {driverStatus}
            </div>
          )}

          <button className="btn-primary" onClick={importDrivers} disabled={!driverFile || loading} style={{ width: '100%' }}>
            {loading ? 'Importing...' : 'Import Drivers'}
          </button>
        </div>
      </div>
    </div>
  );
}