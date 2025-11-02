# Quick Start Guide

## 🚀 Getting Started in 4 Steps

### Step 1: Install Backend Dependencies
```bash
cd backend
npm install
```

This will install Express, CORS, and Oracle DB dependencies.

### Step 2: Start Backend Server
```bash
cd backend
npm start
```

The backend will automatically create the employees table with auto-increment sequence.
Backend will run on: http://localhost:3001

### Step 3: Start Frontend
Open a new terminal:
```bash
cd frontend
npm install
npm start
```

Frontend will run on: http://localhost:3000

### Step 4: Use the Application
- Open your browser to http://localhost:3000
- Fill in the employee form on the left
- Click "Create" to add an employee
- View all employees on the right side
- Edit or Delete employees as needed

### Step 5: Verify Database Connection
Check backend terminal for:
```
✅ Connected to Oracle Database!
🚀 Server running on http://localhost:3001
```

## 🎨 Features
- Dark theme interface
- Real-time CRUD operations
- Oracle DB integration
- Professional UI with smooth animations
- Responsive design

## 🔧 Troubleshooting

**Backend won't start?**
- Check Oracle Instant Client path in `server.js`
- Verify database credentials
- Ensure Oracle DB is running

**Frontend can't connect?**
- Make sure backend is running on port 3001
- Check CORS settings
- Look for console errors in browser

**No employees showing?**
- Check backend logs for table creation messages
- Check database connection
- Verify server started successfully

## 📝 Next Steps
See README.md for full documentation and API details.

