const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initializeDatabase } = require('./config/database');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/employees', employeeRoutes);

// Initialize DB and start server
(async () => {
  await initializeDatabase();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
})();
