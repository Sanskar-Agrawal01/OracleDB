// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
  if (!token) return res.status(401).json({ error: 'Missing token' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    // decoded should contain { id, email, role, employeeId }
    req.user = decoded;
    next();
  });
}

function authorizeAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') return next();
  return res.status(403).json({ error: 'Admin access required' });
}

// allows access if admin OR user is acting on their own employee record
function authorizeSelfOrAdmin(req, res, next) {
  const idParam = Number(req.params.id);
  // if admin -> allow
  if (req.user && req.user.role === 'admin') return next();
  // if employee and their employeeId matches requested employee id -> allow
  if (req.user && req.user.role === 'employee' && req.user.employeeId && idParam === Number(req.user.employeeId)) {
    return next();
  }
  return res.status(403).json({ error: 'Forbidden' });
}

module.exports = { authenticateJWT, authorizeAdmin, authorizeSelfOrAdmin };
