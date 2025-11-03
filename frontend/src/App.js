import React, { useState, useEffect } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (token && userStr) setUser(JSON.parse(userStr));
  }, []);

  function onLogin(userObj, token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userObj));
    setUser(userObj);
  }
  function onLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }

  if (!user) {
    return (
      <div className="min-h-full flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <h2 className="text-3xl font-bold mb-6 text-center">Login or Register</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
              <Login onLogin={onLogin} />
            </div>
            <div className="bg-white rounded-xl shadow p-6 border border-slate-200">
              <Register />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (user.role === 'admin') {
    return <AdminDashboard user={user} onLogout={onLogout} />;
  } else {
    return <EmployeeDashboard user={user} onLogout={onLogout} />;
  }
}

export default App;
