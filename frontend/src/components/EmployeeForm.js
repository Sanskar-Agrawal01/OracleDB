import React, { useState, useEffect } from "react";
import { apiFetch } from "../api";

export default function EmployeeForm({ existing, onDone }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    salary: "",
    hire_date: "",
    linkUserId: "",
  });
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (existing) {
      setForm({
        name: existing.NAME || "",
        email: existing.EMAIL || "",
        phone: existing.PHONE || "",
        department: existing.DEPARTMENT || "",
        position: existing.POSITION || "",
        salary: existing.SALARY || "",
        hire_date: existing.HIRE_DATE || "",
        linkUserId: "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        position: "",
        salary: "",
        hire_date: "",
        linkUserId: "",
      });
    }
  }, [existing]);

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      if (existing) {
        await apiFetch(`/employees/${existing.ID}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        setMsg("Updated");
      } else {
        await apiFetch("/employees", {
          method: "POST",
          body: JSON.stringify(form),
        });
        setMsg("Created");
      }
      if (onDone) onDone();
    } catch (err) {
      setMsg(err?.error || "Save failed");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Department"
          value={form.department}
          onChange={(e) => setForm({ ...form, department: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Position"
          value={form.position}
          onChange={(e) => setForm({ ...form, position: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Salary"
          value={form.salary}
          onChange={(e) => setForm({ ...form, salary: e.target.value })}
        />
      </div>
      <div>
        <input
          type="date"
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={form.hire_date ? form.hire_date.split("T")[0] : ""}
          onChange={(e) => setForm({ ...form, hire_date: e.target.value })}
        />
      </div>
      <div>
        <input
          className="w-full rounded-md border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Link user id (optional)"
          value={form.linkUserId}
          onChange={(e) => setForm({ ...form, linkUserId: e.target.value })}
        />
      </div>
      <button
        type="submit"
        className="inline-flex items-center justify-center rounded-md bg-indigo-600 text-white px-4 py-2 hover:bg-indigo-700 transition"
      >
        Save
      </button>
      {msg && <div className="text-slate-700 text-sm">{msg}</div>}
    </form>
  );
}
