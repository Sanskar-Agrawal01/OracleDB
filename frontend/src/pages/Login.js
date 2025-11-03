import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');

  async function submit(e) {
    e.preventDefault();
    setErr('');
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      onLogin(res.user, res.token);
    } catch (e) {
      setErr(e?.error || 'Login failed');
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Login</h3>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div>
          <input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        </div>
        <button type="submit" className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition">Login</button>
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
      </form>
    </div>
  );
}
