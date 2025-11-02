<<<<<<< HEAD
# Employee Management System

A full-stack CRUD application for managing employee details using React, Express, and Oracle Database.

## Features

- ✅ **Create** new employees with detailed information
- ✅ **Read** and display all employees in a professional card layout
- ✅ **Update** existing employee information
- ✅ **Delete** employees with confirmation
- ✅ Dark theme UI with smooth transitions
- ✅ Oracle Database integration
- ✅ Responsive design

## Tech Stack

### Backend
- **Node.js** with Express.js
- **Oracle Database** with node-oracledb
- RESTful API design
- MVC architecture
- CORS enabled
- Auto table initialization

### Frontend
- **React** 18
- **Axios** for API calls
- Minimalist dark theme UI
- Responsive grid layout
- Clean GitHub-inspired design

## Database Schema

The `employees` table contains:
- `id` (NUMBER, Primary Key, Auto-increment)
- `name` (VARCHAR2, Required)
- `email` (VARCHAR2, Required, Unique)
- `phone` (VARCHAR2)
- `department` (VARCHAR2)
- `position` (VARCHAR2)
- `salary` (NUMBER)
- `hire_date` (DATE)

## Setup Instructions

### Prerequisites
- Node.js installed
- Oracle Database 12c or higher
- Oracle Instant Client installed and configured

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Update database credentials in `server.js` if needed:
```javascript
const dbConfig = {
  user: "your_username",
  password: "your_password",
  connectString: "localhost/XE"
};
```

4. Start the server:
```bash
npm start
```

The backend will automatically create the employees table, sequence, and trigger on startup.
The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create new employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/health` - Health check

## Usage

1. Start both backend and frontend servers
2. Open `http://localhost:3000` in your browser
3. Use the form to add new employees
4. Click "Edit" to modify existing employees
5. Click "Delete" to remove employees
6. Use "Refresh" to reload the employee list

## Project Structure

```
dbproject/
├── backend/
│   ├── server.js              # Main server entry point
│   ├── config/
│   │   └── database.js        # Database connection & initialization
│   ├── controllers/
│   │   └── employeeController.js  # Business logic for employees
│   ├── routes/
│   │   └── employeeRoutes.js  # API routes
│   ├── package.json
│   └── node_modules/
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React component
│   │   ├── App.css            # Dark theme styles
│   │   ├── index.js           # React entry point
│   │   └── index.css          # Global styles
│   ├── public/
│   │   └── index.html
│   ├── package.json
│   └── node_modules/
└── README.md
```

## Notes

- The database connection path in `server.js` should match your Oracle Instant Client installation
- Ensure Oracle Database is running before starting the backend
- All employees are displayed in descending order by ID
- Email addresses must be unique

## License

MIT

=======
# OracleDB
>>>>>>> efae072ff869acf941fc43290904adb238253a56
