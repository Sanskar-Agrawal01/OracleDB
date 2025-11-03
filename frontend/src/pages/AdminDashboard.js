import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import EmployeeForm from '../components/EmployeeForm';

export default function AdminDashboard({ user, onLogout }) {
  const [employees, setEmployees] = useState([]);
  const [editing, setEditing] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    try {
      const data = await apiFetch('/employees');
      setEmployees(data);
    } catch (e) {
      setMsg(e?.error || 'Could not load employees');
    }
  }

  useEffect(()=>{ load(); }, []);

  async function remove(id) {
    if (!window.confirm('Delete employee?')) return;
    try {
      await apiFetch(`/employees/${id}`, { method: 'DELETE' });
      setMsg('Deleted');
      load();
    } catch (e) {
      setMsg(e?.error || 'Delete failed');
    }
  }

  function startEdit(emp) { setEditing(emp); }
  function stopEdit() { setEditing(null); load(); }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Dashboard — {user.name}</h2>
        <div>
          <button className="rounded-md bg-slate-800 text-white px-3 py-2 hover:bg-slate-900" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">Employees</h3>
        {msg && <div className="mb-3 text-slate-700 bg-slate-50 border border-slate-200 rounded p-3">{msg}</div>}
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-50 text-left text-sm text-slate-600">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Department</th>
                <th className="px-4 py-2">Position</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {employees.map(e => (
                <tr key={e.ID}>
                  <td className="px-4 py-2">{e.ID}</td>
                  <td className="px-4 py-2">{e.NAME}</td>
                  <td className="px-4 py-2">{e.EMAIL}</td>
                  <td className="px-4 py-2">{e.DEPARTMENT}</td>
                  <td className="px-4 py-2">{e.POSITION}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button className="rounded-md bg-indigo-600 text-white px-3 py-1 hover:bg-indigo-700" onClick={()=>startEdit(e)}>Edit</button>
                    <button className="rounded-md bg-rose-600 text-white px-3 py-1 hover:bg-rose-700" onClick={()=>remove(e.ID)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">{editing ? 'Edit Employee' : 'Create Employee'}</h3>
        <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
          <EmployeeForm existing={editing} onDone={stopEdit} />
        </div>
      </div>
    </div>
  );
}
