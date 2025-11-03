// controllers/authController.js
const oracledb = require('oracledb');
const { getConnection, closeConnection } = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = '1h';

// ===============================
// REGISTER OR ACTIVATE USER
// ===============================
exports.register = async (req, res) => {
  let conn;
  try {
    const { name, email, password, role } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const hashedPassword = await bcrypt.hash(password, 10);
    conn = await getConnection();

    // ✅ Check if user already exists
    const userResult = await conn.execute(
      `SELECT ID FROM USERS WHERE LOWER(EMAIL) = LOWER(:email)`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (userResult.rows.length > 0) {
      // ✅ If user exists → allow password reset (activation)
      await conn.execute(
        `UPDATE USERS SET PASSWORD = :password WHERE LOWER(EMAIL) = LOWER(:email)`,
        { password: hashedPassword, email },
        { autoCommit: true }
      );
      return res.json({ message: 'Password updated successfully. You can now log in.' });
    }

    // ✅ If user does not exist, check EMPLOYEES table
    const empResult = await conn.execute(
      `SELECT ID, NAME FROM EMPLOYEES WHERE LOWER(EMAIL) = LOWER(:email)`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    const employeeId = empResult.rows.length > 0 ? empResult.rows[0].ID : null;
    const userName = name || (empResult.rows.length > 0 ? empResult.rows[0].NAME : 'Unknown');

    // ✅ Create new user and link to employee if found
    await conn.execute(
      `INSERT INTO USERS (NAME, EMAIL, PASSWORD, ROLE, EMPLOYEE_ID)
       VALUES (:name, :email, :password, :role, :employee_id)`,
      {
        name: userName,
        email,
        password: hashedPassword,
        role: role || (employeeId ? 'employee' : 'employee'),
        employee_id: employeeId
      },
      { autoCommit: true }
    );

    res.status(201).json({
      message: 'User registered successfully',
      linkedEmployeeId: employeeId,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Registration failed' });
  } finally {
    await closeConnection(conn);
  }
};

// ===============================
// LOGIN USER
// ===============================
exports.login = async (req, res) => {
  let conn;
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    conn = await getConnection();

    const result = await conn.execute(
      `SELECT ID, NAME, EMAIL, PASSWORD, ROLE, EMPLOYEE_ID 
       FROM USERS WHERE LOWER(EMAIL) = LOWER(:email)`,
      { email },
      { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.PASSWORD);

    if (!match)
      return res.status(401).json({ error: 'Invalid credentials' });

    // ✅ Create JWT token
    const payload = {
      id: user.ID,
      email: user.EMAIL,
      name: user.NAME,
      role: user.ROLE,
      employeeId: user.EMPLOYEE_ID || null,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    res.json({ token, user: payload });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  } finally {
    await closeConnection(conn);
  }
};
