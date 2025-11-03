// routes/employees.js
const express = require('express');
const router = express.Router();
const employeeCtrl = require('../controllers/employeeController');
const { authenticateJWT, authorizeAdmin, authorizeSelfOrAdmin } = require('../middleware/auth');

router.get('/', authenticateJWT, authorizeAdmin, employeeCtrl.getAllEmployees); // only admin can get all
router.get('/:id', authenticateJWT, authorizeSelfOrAdmin, employeeCtrl.getEmployeeById);
router.post('/', authenticateJWT, authorizeAdmin, employeeCtrl.createEmployee); // only admin can create
router.put('/:id', authenticateJWT, authorizeSelfOrAdmin, employeeCtrl.updateEmployee); // admin or owner
router.delete('/:id', authenticateJWT, authorizeAdmin, employeeCtrl.deleteEmployee); // only admin

module.exports = router;
