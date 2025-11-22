# Environment Variables Setup Guide

## Quick Setup

1. Create a `.env` file in the root directory of your project
2. Copy the template below and fill in your values
3. Save the file

## .env File Template

```env
# ============================================
# Google Gemini API Key (REQUIRED)
# ============================================
# Get your API key from: https://aistudio.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here

# Gemini Model Name (Optional - defaults to 'gemini-pro')
# Available models: 'gemini-pro', 'gemini-1.5-pro-latest', 'gemini-1.5-flash-latest'
GEMINI_MODEL=gemini-pro

# ============================================
# MySQL Database Configuration
# ============================================
# For MySQL Workbench - use your local connection settings
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=inventory_db

# ============================================
# Server Port (Optional - defaults to 3000)
# ============================================
PORT=3000
```

## How to Fill Each Variable

### 1. GEMINI_API_KEY (Required)
- **Purpose**: Used by Google Gemini AI to generate SQL queries from natural language
- **How to get**: 
  1. Go to https://aistudio.google.com/app/apikey
  2. Sign in with your Google account
  3. Click "Create API Key"
  4. Copy the key and paste it here
- **Example**: `GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. DB_HOST (Optional - defaults to 'localhost')
- **Purpose**: MySQL server hostname
- **For MySQL Workbench**: Usually `localhost` or `127.0.0.1`
- **If your MySQL is on a different machine**: Use that machine's IP or hostname
- **Example**: `DB_HOST=localhost`

### 3. DB_PORT (Optional - defaults to 3306)
- **Purpose**: MySQL server port number
- **For MySQL Workbench**: Default is `3306`
- **If you changed MySQL port**: Use your custom port
- **Example**: `DB_PORT=3306`

### 4. DB_USER (Optional - defaults to 'root')
- **Purpose**: MySQL username
- **For MySQL Workbench**: Check your connection settings
- **Common values**: `root` (default admin user)
- **Example**: `DB_USER=root`

### 5. DB_PASSWORD (Required if your MySQL has a password)
- **Purpose**: MySQL user password
- **For MySQL Workbench**: 
  - Check your connection settings in MySQL Workbench
  - If you set up MySQL with a password, use that password
  - If MySQL has no password, leave empty: `DB_PASSWORD=`
- **Example**: `DB_PASSWORD=mypassword123` or `DB_PASSWORD=` (for no password)

### 6. DB_NAME (Optional - defaults to 'inventory_db')
- **Purpose**: Name of your database
- **How to set**: 
  - The database will be created automatically when you run `db/seed.sql`
  - Or create it manually in MySQL Workbench: `CREATE DATABASE inventory_db;`
- **Example**: `DB_NAME=inventory_db`

### 7. PORT (Optional - defaults to 3000)
- **Purpose**: Port for the Express.js backend server
- **Default**: `3000`
- **Change if needed**: If port 3000 is busy, use another port like 3001, 8080, etc.
- **Example**: `PORT=3000`

## Step-by-Step Setup for MySQL Workbench

1. **Open MySQL Workbench** and connect to your MySQL server

2. **Check your connection settings**:
   - Look at the connection name you're using
   - Note the host, port, username
   - You'll need this info for `.env`

3. **Create the `.env` file** in your project root:
   ```
   C:\Users\HP\Desktop\Secret\Project\inventory-bot\.env
   ```

4. **Fill in the values** based on your MySQL Workbench connection:
   ```env
   GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=your_actual_mysql_password
   DB_NAME=inventory_db
   PORT=3000
   ```

5. **Create and seed the database**:
   ```bash
   # Option 1: Using command line (if MySQL is in PATH)
   mysql -u root -p < db/seed.sql
   
   # Option 2: Using MySQL Workbench
   # - Open db/seed.sql in MySQL Workbench
   # - Execute the script (File > Open SQL Script, then execute)
   ```

6. **Start your backend**:
   ```bash
   npm start
   ```

## Troubleshooting

### "Cannot connect to database"
- ✅ Check MySQL Workbench is running
- ✅ Verify DB_HOST, DB_PORT, DB_USER match your MySQL Workbench connection
- ✅ Check DB_PASSWORD is correct
- ✅ Test connection: Try connecting in MySQL Workbench with same credentials

### "GEMINI_API_KEY is required"
- ✅ Make sure `.env` file exists in project root
- ✅ Check there are no extra spaces around `=`
- ✅ Verify the API key is correct (starts with `AIzaSy`)

### "Database doesn't exist"
- ✅ Run `db/seed.sql` in MySQL Workbench to create the database
- ✅ Or manually create: `CREATE DATABASE inventory_db;`

### "Access denied for user"
- ✅ Check DB_USER and DB_PASSWORD are correct
- ✅ Verify the MySQL user has permissions to access the database

