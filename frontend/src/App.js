import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  // Load user from localStorage if already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (token && userStr) setUser(JSON.parse(userStr));
  }, []);

  function onLogin(userObj, token) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userObj));
    setUser(userObj);
  }

  function onLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  // ✅ Not logged in → Show either Login or Register
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          {!showRegister ? (
            <>
              <Login onLogin={onLogin} />
              <p className="text-center text-sm mt-4 text-gray-600">
                Don’t have an account?{" "}
                <button
                  onClick={() => setShowRegister(true)}
                  className="text-indigo-600 hover:underline"
                >
                  Register here
                </button>
              </p>
            </>
          ) : (
            <>
              <Register />
              <p className="text-center text-sm mt-4 text-gray-600">
                Already registered?{" "}
                <button
                  onClick={() => setShowRegister(false)}
                  className="text-indigo-600 hover:underline"
                >
                  Click to Login
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    );
  }

  // ✅ Logged in → Show dashboards
  if (user.role === "admin") {
    return <AdminDashboard user={user} onLogout={onLogout} />;
  } else {
    return <EmployeeDashboard user={user} onLogout={onLogout} />;
  }
}

export default App;
