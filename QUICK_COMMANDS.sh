#!/bin/bash

# ============================================
# Inventory Bot - Quick Setup Commands
# ============================================

# 1. Navigate to project directory
cd C:\Users\HP\Desktop\Secret\Project\inventory-bot

# 2. Install dependencies
npm install

# 3. Create .env file (edit manually with your values)
# Create .env file in project root with:
# GEMINI_API_KEY=your_api_key
# DB_HOST=localhost
# DB_PORT=3306
# DB_USER=root
# DB_PASSWORD=your_password
# DB_NAME=inventory_db
# PORT=3000

# 4. Setup database (run in MySQL Workbench or command line)
# mysql -u root -p < db/seed.sql

# 5. Start backend server
npm start

# ============================================
# In a NEW terminal window, for frontend:
# ============================================

# Option 1: Open frontend/index.html directly in browser
# (Just double-click it)

# Option 2: Serve frontend with Python
cd frontend
python -m http.server 8000
# Then open: http://localhost:8000

# Option 3: Serve frontend with Node.js http-server
# npm install -g http-server  # (one time only)
# cd frontend
# http-server -p 8000
# Then open: http://localhost:8000

# ============================================
# Quick Test Commands:
# ============================================

# Test backend health
curl http://localhost:3000/health

# Test API endpoint
curl -X POST http://localhost:3000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question":"List all warehouses"}'

