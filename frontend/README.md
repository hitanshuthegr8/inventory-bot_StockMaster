# Inventory Bot Frontend

Modern, user-friendly frontend interface for testing the Inventory Bot.

## Features

- 🎨 Clean, modern UI design
- 💬 Natural language query input
- 📊 Tabular data display
- 🔍 View generated SQL queries
- ✅ Real-time connection status
- 📱 Responsive design
- ⚡ Quick example questions

## Quick Start

### Option 1: Open Directly in Browser (Easiest)

1. Make sure your backend is running on `http://localhost:3000`
   ```bash
   cd ..
   npm start
   ```

2. Open `frontend/index.html` in your web browser
   - Double-click the file, or
   - Right-click → Open with → Your preferred browser

### Option 2: Use a Local Server (Recommended)

1. **Using Python** (if installed):
   ```bash
   cd frontend
   python -m http.server 8000
   ```
   Then open: `http://localhost:8000`

2. **Using Node.js http-server**:
   ```bash
   # Install globally (one time)
   npm install -g http-server
   
   # Run in frontend directory
   cd frontend
   http-server -p 8000
   ```
   Then open: `http://localhost:8000`

3. **Using VS Code Live Server Extension**:
   - Install "Live Server" extension in VS Code
   - Right-click `frontend/index.html` → "Open with Live Server"

## Usage

1. **Start the Backend**:
   ```bash
   cd ..
   npm start
   ```
   You should see: `🤖 Inventory Bot Backend Running`

2. **Open the Frontend** in your browser

3. **Check Connection Status**:
   - Bottom-right corner shows connection status
   - Should say "Connected" when backend is running

4. **Ask Questions**:
   - Type your question in the text area
   - Click "Query" button
   - Or click an example question chip

5. **View Results**:
   - Natural language answer at the top
   - Summary/details below
   - Click "View Generated SQL" to see the SQL query
   - Data table shows all results

## Example Questions

- "What's the stock of iPhone 13 in Mumbai?"
- "Total inventory valuation"
- "Products below reorder level"
- "Top 5 products by quantity"
- "List all warehouses"
- "Stock movements this month"

## Configuration

The frontend is configured to connect to `http://localhost:3000` by default.

To change the backend URL, edit `frontend/js/app.js`:

```javascript
const API_BASE_URL = 'http://localhost:3000'; // Change this
```

## Troubleshooting

### "Disconnected" Status
- ✅ Make sure backend is running (`npm start`)
- ✅ Check backend is on port 3000 (or update frontend config)
- ✅ Verify no firewall is blocking connections

### CORS Errors
- ✅ Backend already has CORS enabled
- ✅ Make sure you're opening via a web server, not `file://`

### Cannot Query
- ✅ Check backend logs for errors
- ✅ Verify database connection in backend
- ✅ Make sure `.env` file is configured correctly

### Results Not Showing
- ✅ Check browser console (F12) for errors
- ✅ Verify backend is returning valid JSON
- ✅ Check network tab in browser DevTools

## File Structure

```
frontend/
├── index.html      # Main HTML structure
├── css/
│   └── style.css   # All styling
├── js/
│   └── app.js      # JavaScript logic
└── README.md       # This file
```

