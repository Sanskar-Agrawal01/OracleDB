import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3001/api';

function normalizeRow(row) {
  // Row may contain uppercase keys (ID, NAME) from oracledb or lowercase keys.
  return {
    id: row.ID ?? row.id ?? null,
    name: row.NAME ?? row.name ?? '',
    email: row.EMAIL ?? row.email ?? '',
    phone: row.PHONE ?? row.phone ?? '',
    department: row.DEPARTMENT ?? row.department ?? '',
    position: row.POSITION ?? row.position ?? '',
    salary: row.SALARY ?? row.salary ?? null,
    hire_date: row.HIRE_DATE ?? row.hire_date ?? '' // expected 'YYYY-MM-DD' string from backend
  };
}

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    salary: '',
    hire_date: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/employees`);
      // Normalize each row to lowercase keys
      const normalized = (response.data || []).map(normalizeRow);
      setEmployees(normalized);
      setError('');
      console.log('Fetched employees:', normalized);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const preparePayload = () => {
    // Convert empty strings to null where appropriate and ensure salary is a number (or null)
    const payload = { ...formData };

    // salary: allow numeric or empty
    if (payload.salary === '' || payload.salary === null || payload.salary === undefined) {
      payload.salary = null;
    } else {
      // convert to number if possible
      const n = Number(payload.salary);
      payload.salary = Number.isFinite(n) ? n : null;
    }

    // hire_date: empty -> null, else keep yyyy-mm-dd string
    if (!payload.hire_date) {
      payload.hire_date = null;
    }

    // trim text fields
    payload.name = payload.name?.trim();
    payload.email = payload.email?.trim();
    payload.phone = payload.phone?.trim() || null;
    payload.department = payload.department?.trim() || null;
    payload.position = payload.position?.trim() || null;

    return payload;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const payload = preparePayload();

      if (editingId !== null && editingId !== undefined) {
        // ensure editingId is a number
        const id = Number(editingId);
        if (isNaN(id)) throw new Error('Invalid editing ID');
        await axios.put(`${API_URL}/employees/${id}`, payload);
      } else {
        await axios.post(`${API_URL}/employees`, payload);
      }
      await fetchEmployees();
      resetForm();
    } catch (err) {
      console.error('Submit error:', err);
      setError(err.response?.data?.error || err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (employee) => {
    // employee is already normalized
    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      position: employee.position || '',
      salary: employee.salary ?? '',
      hire_date: employee.hire_date || ''
    });

    // ensure id is numeric
    setEditingId(employee.id ?? null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    // ensure numeric id
    const nid = Number(id);
    if (isNaN(nid)) {
      setError('Invalid employee ID');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/employees/${nid}`);
      await fetchEmployees();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error || 'Failed to delete employee');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      position: '',
      salary: '',
      hire_date: ''
    });
    setEditingId(null);
  };

  const formatCurrency = (amount) => {
    const num = Number(amount);
    if (!Number.isFinite(num)) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(num);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    // backend returns YYYY-MM-DD; ensure correct parse
    const d = new Date(dateString + 'T00:00:00'); // avoid timezone shift
    if (isNaN(d)) return dateString;
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="App">
      <div className="container">
        <header className="header">
          <h1>Employee Management System</h1>
          <p className="subtitle">Oracle DB CRUD Operations</p>
        </header>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="content-wrapper">
          <div className="form-section">
            <h2>{editingId ? 'Edit Employee' : 'Add New Employee'}</h2>
            <form onSubmit={handleSubmit} className="employee-form">
              <div className="form-group">
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                  type="text"
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="position">Position</label>
                <input
                  type="text"
                  id="position"
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="salary">Salary</label>
                <input
                  type="number"
                  id="salary"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hire_date">Hire Date</label>
                <input
                  type="date"
                  id="hire_date"
                  name="hire_date"
                  value={formData.hire_date}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? 'Processing...' : (editingId ? 'Update' : 'Create')}
                </button>
                {editingId && (
                  <button type="button" onClick={resetForm} className="btn btn-secondary">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="list-section">
            <div className="list-header">
              <h2>Employees</h2>
              <button onClick={fetchEmployees} className="btn btn-secondary" disabled={loading}>
                Refresh
              </button>
            </div>

            {loading && employees.length === 0 ? (
              <div className="loading">Loading employees...</div>
            ) : employees.length === 0 ? (
              <div className="empty-state">No employees found. Add one to get started.</div>
            ) : (
              <div className="employee-list">
                {employees.map(employee => (
                  <div key={employee.id ?? Math.random()} className="employee-card">
                    <div className="employee-header">
                      <h3>{employee.name || '(No name)'}</h3>
                      <div className="employee-actions">
                        <button
                          onClick={() => handleEdit(employee)}
                          className="btn btn-edit"
                          disabled={loading}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(employee.id)}
                          className="btn btn-delete"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="employee-details">
                      <div className="detail-item">
                        <span className="detail-label">Email:</span>
                        <span>{employee.email}</span>
                      </div>
                      {employee.phone && (
                        <div className="detail-item">
                          <span className="detail-label">Phone:</span>
                          <span>{employee.phone}</span>
                        </div>
                      )}
                      {employee.department && (
                        <div className="detail-item">
                          <span className="detail-label">Department:</span>
                          <span>{employee.department}</span>
                        </div>
                      )}
                      {employee.position && (
                        <div className="detail-item">
                          <span className="detail-label">Position:</span>
                          <span>{employee.position}</span>
                        </div>
                      )}
                      {employee.salary !== null && employee.salary !== '' && (
                        <div className="detail-item">
                          <span className="detail-label">Salary:</span>
                          <span>{formatCurrency(employee.salary)}</span>
                        </div>
                      )}
                      {employee.hire_date && (
                        <div className="detail-item">
                          <span className="detail-label">Hire Date:</span>
                          <span>{formatDate(employee.hire_date)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
