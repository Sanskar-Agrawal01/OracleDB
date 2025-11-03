import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api';
import EmployeeForm from '../components/EmployeeForm';

export default function EmployeeDashboard({ user, onLogout }) {
  const [employee, setEmployee] = useState(null);
  const [msg, setMsg] = useState('');

  async function load() {
    if (!user.employeeId) {
      setMsg('No employee record linked to your account.');
      return;
    }
    try {
      const data = await apiFetch(`/employees/${user.employeeId}`);
      setEmployee(data);
    } catch (e) {
      setMsg(e?.error || 'Could not load employee');
    }
  }

  useEffect(()=>{ load(); }, [user]);

  function onDone() {
    load();
    setMsg('Saved');
  }

  if (!user.employeeId) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Employee Dashboard — {user.name}</h2>
          <button className="rounded-md bg-slate-800 text-white px-3 py-2 hover:bg-slate-900" onClick={onLogout}>Logout</button>
        </div>
        <div className="rounded-md border border-amber-300 bg-amber-50 text-amber-900 p-4">No employee record linked. Contact admin.</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Employee Dashboard — {user.name}</h2>
        <button className="rounded-md bg-slate-800 text-white px-3 py-2 hover:bg-slate-900" onClick={onLogout}>Logout</button>
      </div>
      {msg && <div className="text-green-700 bg-green-50 border border-green-200 rounded p-3">{msg}</div>}
      {employee ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-2">Your details</h3>
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full">
                <tbody className="divide-y divide-slate-200">
                  <tr><td className="px-4 py-2 font-medium text-slate-600">ID</td><td className="px-4 py-2">{employee.ID}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Name</td><td className="px-4 py-2">{employee.NAME}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Email</td><td className="px-4 py-2">{employee.EMAIL}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Phone</td><td className="px-4 py-2">{employee.PHONE}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Department</td><td className="px-4 py-2">{employee.DEPARTMENT}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Position</td><td className="px-4 py-2">{employee.POSITION}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Salary</td><td className="px-4 py-2">{employee.SALARY}</td></tr>
                  <tr><td className="px-4 py-2 font-medium text-slate-600">Hire Date</td><td className="px-4 py-2">{employee.HIRE_DATE}</td></tr>
                </tbody>
              </table>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Update your details</h3>
            <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
              <EmployeeForm existing={employee} onDone={onDone} />
            </div>
          </div>
        </>
      ) : (
        <div className="text-slate-600">Loading...</div>
      )}
    </div>
  );
}
