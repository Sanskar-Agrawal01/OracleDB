import React, { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8">
        {mode === "login" ? (
          <Login
            onLogin={onLogin}
            onSwitchToRegister={() => setMode("register")}
          />
        ) : (
          <Register onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
