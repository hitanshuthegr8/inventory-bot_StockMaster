# 🚀 How to Run Inventory Bot - Complete Guide

## Step-by-Step Setup

### Step 1: Check Prerequisites ✅

Make sure you have these installed:

1. **Node.js 18+** 
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **MySQL 8.0+**
   - Check: `mysql --version`
   - Make sure MySQL Workbench is installed and running

3. **Google Gemini API Key**
   - Get it from: https://aistudio.google.com/app/apikey

---

### Step 2: Install Dependencies 📦

Open terminal in your project directory:

```bash
cd C:\Users\HP\Desktop\Secret\Project\inventory-bot
npm install
```

This installs:
- Express (web server)
- mysql2 (database driver)
- @google/generative-ai (Gemini API)
- dotenv (environment variables)
- cors (cross-origin requests)

---

### Step 3: Set Up Environment Variables 🔐

1. **Create `.env` file** in the project root:
   ```
   C:\Users\HP\Desktop\Secret\Project\inventory-bot\.env
   ```

2. **Open `.env` file** (create if it doesn't exist) and add:

```env
# REQUIRED: Get from https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_actual_gemini_api_key_here

# MySQL Connection (match your MySQL Workbench settings)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_db

# Server Port (optional, defaults to 3000)
PORT=3000
```

**Important:**
- Replace `your_actual_gemini_api_key_here` with your real Gemini API key
- Replace `your_mysql_password` with your MySQL password (or leave empty if no password: `DB_PASSWORD=`)

---

### Step 4: Set Up Database 💾

**Option A: Using MySQL Workbench (Recommended)**

1. Open MySQL Workbench
2. Connect to your MySQL server
3. Open the file `db/seed.sql` in MySQL Workbench
   - File → Open SQL Script → Select `db/seed.sql`
4. Execute the script (⚡ lightning bolt icon or Ctrl+Shift+Enter)
5. Wait for "Database seeded successfully!" message

**Option B: Using Command Line**

```bash
mysql -u root -p < db/seed.sql
```

This will:
- Create the `inventory_db` database
- Create all tables
- Insert sample data

**Verify Database:**
In MySQL Workbench, run:
```sql
USE inventory_db;
SHOW TABLES;
```
You should see tables like `products`, `warehouses`, `stock_quants`, etc.

---

### Step 5: Start the Backend Server 🖥️

In your project directory, run:

```bash
npm start
```

**OR for development (auto-reload on changes):**
```bash
npm run dev
```

**Expected Output:**
```
╔═══════════════════════════════════════════════════╗
║       🤖 Inventory Bot Backend Running            ║
║───────────────────────────────────────────────────║
║   Port: 3000                                      ║
║   Endpoints:                                      ║
║     POST /api/query   - Natural language query    ║
║     POST /api/sql     - Generate SQL only         ║
║     POST /api/execute - Execute raw SQL           ║
║     GET  /health      - Health check              ║
╚═══════════════════════════════════════════════════╝
```

✅ **Keep this terminal window open!** The server needs to keep running.

---

### Step 6: Test Backend (Optional) 🧪

Open a **new terminal window** and test:

```bash
# Health check
curl http://localhost:3000/health

# OR in PowerShell:
Invoke-WebRequest -Uri http://localhost:3000/health
```

You should get: `{"status":"ok","timestamp":"..."}`

---

### Step 7: Open the Frontend 🌐

**Method 1: Direct File Open (Quickest)**

1. Navigate to: `frontend/index.html`
2. Double-click it to open in your default browser
3. The frontend will open at `file:///.../frontend/index.html`

**Method 2: Local Web Server (Recommended - Better for CORS)**

**Using Python:**
```bash
cd frontend
python -m http.server 8000
```
Then open: `http://localhost:8000`

**Using Node.js http-server:**
```bash
# Install globally (one time only)
npm install -g http-server

# Run in frontend folder
cd frontend
http-server -p 8000
```
Then open: `http://localhost:8000`

**Using VS Code Live Server:**
1. Install "Live Server" extension in VS Code
2. Right-click `frontend/index.html`
3. Select "Open with Live Server"

---

### Step 8: Test the Frontend 🎯

1. **Check Connection Status:**
   - Look at bottom-right corner
   - Should show "Connected" (green dot)

2. **Try a Query:**
   - Click an example question chip, OR
   - Type: "What's the stock of iPhone 13 in Mumbai?"
   - Click "Query" button

3. **View Results:**
   - See natural language answer
   - Click "View Generated SQL" to see the SQL query
   - Check the data table below

---

## Complete Run Command Sequence

Here's everything in one go:

```bash
# 1. Navigate to project
cd C:\Users\HP\Desktop\Secret\Project\inventory-bot

# 2. Install dependencies
npm install

# 3. Create .env file (edit with your values)
# ... create .env manually ...

# 4. Setup database (in MySQL Workbench, open and run db/seed.sql)

# 5. Start backend (Terminal 1)
npm start

# 6. Open frontend (Terminal 2 - optional if using local server)
cd frontend
python -m http.server 8000
# OR just double-click frontend/index.html
```

---

## Troubleshooting 🔧

### Backend won't start

**Error: "GEMINI_API_KEY is required"**
- ✅ Check `.env` file exists in project root
- ✅ Make sure GEMINI_API_KEY is set correctly
- ✅ No spaces around `=` sign: `GEMINI_API_KEY=your_key`

**Error: "Cannot connect to database"**
- ✅ Check MySQL is running (open MySQL Workbench)
- ✅ Verify DB_HOST, DB_PORT, DB_USER, DB_PASSWORD in `.env`
- ✅ Test connection in MySQL Workbench with same credentials
- ✅ Make sure `inventory_db` database exists

**Error: "Port 3000 already in use"**
- ✅ Change PORT in `.env` to another number (e.g., 3001)
- ✅ Or close the program using port 3000

### Frontend shows "Disconnected"

**Backend not running:**
- ✅ Make sure backend terminal is still running
- ✅ Check backend shows "🤖 Inventory Bot Backend Running"

**Wrong URL:**
- ✅ Frontend expects backend on `http://localhost:3000`
- ✅ If you changed PORT in `.env`, update `frontend/js/app.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:YOUR_PORT';
  ```

**CORS issues:**
- ✅ Backend already has CORS enabled
- ✅ Make sure you're using a web server (not `file://` protocol)

### Database issues

**"Database doesn't exist"**
- ✅ Run `db/seed.sql` in MySQL Workbench

**"Table doesn't exist"**
- ✅ Make sure you ran the complete `seed.sql` file
- ✅ Check in MySQL Workbench: `USE inventory_db; SHOW TABLES;`

**"Access denied"**
- ✅ Check DB_USER and DB_PASSWORD in `.env`
- ✅ Test login in MySQL Workbench with same credentials

---

## Quick Reference Commands 📋

```bash
# Start backend
npm start

# Start backend (development mode with auto-reload)
npm run dev

# Check if backend is running
curl http://localhost:3000/health

# View all API endpoints
# Backend console will show them on startup
```

---

## Project Structure Reminder 📁

```
inventory-bot/
├── .env                 # ⚠️ CREATE THIS with your credentials
├── package.json
├── src/                 # Backend code
├── frontend/            # Frontend HTML/CSS/JS
│   └── index.html       # ← Open this in browser
└── db/
    └── seed.sql         # ← Run this in MySQL Workbench
```

---

## Need Help? 🆘

1. Check `ENV_SETUP.md` for detailed environment variable help
2. Check `frontend/README.md` for frontend-specific issues
3. Check backend terminal for error messages
4. Check browser console (F12) for frontend errors

---

**You're all set! 🎉**

Now you can ask questions like:
- "What's the stock of iPhone 13 in Mumbai?"
- "Total inventory valuation"
- "Products below reorder level"

Enjoy testing your Inventory Bot! 🤖

