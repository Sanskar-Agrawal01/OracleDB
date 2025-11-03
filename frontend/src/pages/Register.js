import React, { useState } from 'react';
import { apiFetch } from '../api';

export default function Register() {
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [msg,setMsg]=useState('');

  async function submit(e){
    e.preventDefault();
    setMsg('');
    try{
      await apiFetch('/auth/register',{ method: 'POST', body: JSON.stringify({ name, email, password })});
      setMsg('Registered! You can now login.');
    }catch(err){
      setMsg(err?.error || 'Registration failed');
    }
  }

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Register (employee)</h3>
      <form onSubmit={submit} className="space-y-4">
        <div><input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} /></div>
        <div><input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} /></div>
        <div><input className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" /></div>
        <button type="submit" className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition">Register</button>
        {msg && <div className="text-slate-700 text-sm mt-2">{msg}</div>}
      </form>
    </div>
  );
}
