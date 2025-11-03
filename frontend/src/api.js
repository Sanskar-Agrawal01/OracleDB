const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:4000/api';

export function getAuthHeaders() {
  const token = localStorage.getItem('token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

export async function apiFetch(path, options = {}) {
  const headers = options.headers || {};
  if (!headers['Content-Type'] && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const finalHeaders = { ...headers, ...getAuthHeaders() };
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers: finalHeaders });
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) throw data || { error: 'Server error' };
    return data;
  } catch (err) {
    throw err;
  }
}
