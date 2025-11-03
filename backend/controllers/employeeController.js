// controllers/employeeController.js
const { getConnection, closeConnection, oracledb } = require('../config/database');

// GET all employees (admin only)
exports.getAllEmployees = async (req, res) => {
  let conn;
  try {
    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ID, NAME, EMAIL, PHONE, DEPARTMENT, POSITION, SALARY,
              TO_CHAR(HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
       FROM EMPLOYEES ORDER BY ID DESC`,
      [], { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).json({ error: 'Failed to fetch employees' });
  } finally {
    await closeConnection(conn);
  }
};

// GET employee by ID (admin or owner)
exports.getEmployeeById = async (req, res) => {
  let conn;
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid employee ID' });

    conn = await getConnection();
    const result = await conn.execute(
      `SELECT ID, NAME, EMAIL, PHONE, DEPARTMENT, POSITION, SALARY,
              TO_CHAR(HIRE_DATE, 'YYYY-MM-DD') AS HIRE_DATE
       FROM EMPLOYEES WHERE ID = :id`,
      { id }, { outFormat: oracledb.OUT_FORMAT_OBJECT }
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: 'Employee not found' });

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching employee:', err);
    res.status(500).json({ error: 'Failed to fetch employee' });
  } finally {
    await closeConnection(conn);
  }
};

// CREATE employee (admin only). Optionally returns created ID.
// CREATE employee (admin only). Optionally returns created ID.
// CREATE employee (admin only). Optionally returns created ID.
exports.createEmployee = async (req, res) => {
  let conn;
  try {
    const { name, email, phone, department, position, salary, hire_date } = req.body;

    if (!name || !email)
      return res.status(400).json({ error: 'Name and email are required' });

    const safePhone = phone?.trim() || null;
    const safeDept = department?.trim() || null;
    const safePos = position?.trim() || null;
    const safeSalary = salary !== undefined && salary !== null && salary !== '' ? salary : null;
    const safeDate = hire_date ? hire_date.split('T')[0] : null; // Ensure format YYYY-MM-DD

    conn = await getConnection();

    // ✅ Insert into EMPLOYEES and return the new employee ID
    const result = await conn.execute(
      `INSERT INTO EMPLOYEES (NAME, EMAIL, PHONE, DEPARTMENT, POSITION, SALARY, HIRE_DATE)
       VALUES (:name, :email, :phone, :department, :position, :salary,
         CASE WHEN :hire_date IS NOT NULL THEN TO_DATE(:hire_date, 'YYYY-MM-DD') ELSE NULL END)
       RETURNING ID INTO :id`,
      {
        name,
        email,
        phone: safePhone,
        department: safeDept,
        position: safePos,
        salary: safeSalary,
        hire_date: safeDate,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: false }
    );

    const newEmpId = result.outBinds.id[0];

    // ✅ Link the new employee to a user with the same email
    await conn.execute(
      `UPDATE USERS SET EMPLOYEE_ID = :empId WHERE LOWER(EMAIL) = LOWER(:email)`,
      { empId: newEmpId, email },
      { autoCommit: false }
    );

    await conn.commit();

    res.status(201).json({ message: 'Employee created successfully', employeeId: newEmpId });
  } catch (err) {
    console.error('Error creating employee:', err);
    if (err.errorNum === 1)
      res.status(409).json({ error: 'Email already exists' });
    else
      res.status(500).json({ error: 'Failed to create employee' });
  } finally {
    await closeConnection(conn);
  }
};


// UPDATE employee (admin or owner)
exports.updateEmployee = async (req, res) => {
  let conn;
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid employee ID' });

    const { name, email, phone, department, position, salary, hire_date } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email are required' });

    conn = await getConnection();

    const result = await conn.execute(
      `UPDATE EMPLOYEES
       SET NAME = :name,
           EMAIL = :email,
           PHONE = :phone,
           DEPARTMENT = :department,
           POSITION = :position,
           SALARY = :salary,
           HIRE_DATE = CASE WHEN :hire_date IS NOT NULL THEN TO_DATE(:hire_date, 'YYYY-MM-DD') ELSE HIRE_DATE END
       WHERE ID = :id`,
      {
        id,
        name,
        email,
        phone: phone || null,
        department: department || null,
        position: position || null,
        salary: salary !== undefined && salary !== '' ? salary : null,
        hire_date: hire_date || null
      },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Employee not found' });

    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    console.error('Error updating employee:', err);
    res.status(500).json({ error: 'Failed to update employee' });
  } finally {
    await closeConnection(conn);
  }
};

// DELETE employee (admin only)
exports.deleteEmployee = async (req, res) => {
  let conn;
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid employee ID' });

    conn = await getConnection();

    const result = await conn.execute(
      `DELETE FROM EMPLOYEES WHERE ID = :id`,
      { id },
      { autoCommit: true }
    );

    if (result.rowsAffected === 0) return res.status(404).json({ error: 'Employee not found' });

    // also remove employee links from users if any
    await conn.execute(`UPDATE USERS SET EMPLOYEE_ID = NULL WHERE EMPLOYEE_ID = :id`, { id }, { autoCommit: true });

    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    console.error('Error deleting employee:', err);
    res.status(500).json({ error: 'Failed to delete employee' });
  } finally {
    await closeConnection(conn);
  }
};
