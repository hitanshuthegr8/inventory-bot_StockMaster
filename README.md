# 🤖 Inventory Bot

AI-powered natural language to SQL query system for inventory management. Ask questions in plain English, get accurate inventory data.

## Features

- **Natural Language Queries**: Ask questions like "What's the stock of iPhone 13 in Mumbai?"
- **AI-Powered SQL Generation**: Uses Google Gemini to convert questions to SQL
- **Safe Execution**: Read-only queries with SQL injection protection
- **Human-Readable Responses**: Results formatted in clear, natural language

## Quick Start

### 1. Prerequisites
- Node.js 18+
- MySQL 8.0+
- Google Gemini API key

### 2. Installation

```bash
# Clone and install
git clone <repo-url>
cd inventory-bot
npm install
```

### 3. Configuration

Create `.env` file:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inventory_db
PORT=3000
```

### 4. Database Setup

```bash
# Create database and seed data
mysql -u root -p < db/seed.sql
```

### 5. Run

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

## API Endpoints

### `POST /api/query`
Main endpoint - natural language to results.

**Request:**
```json
{
  "question": "What is the stock of iPhone 13 in Mumbai?"
}
```

**Response:**
```json
{
  "success": true,
  "question": "What is the stock of iPhone 13 in Mumbai?",
  "sql": "SELECT SUM(q.quantity - q.reserved_quantity) AS available_stock...",
  "answer": "The available stock is 130 units.",
  "data": [{ "available_stock": 130 }],
  "rowCount": 1,
  "meta": {
    "duration": "245ms",
    "timestamp": "2024-11-20T10:30:00.000Z"
  }
}
```

### `POST /api/sql`
Generate SQL without executing (debugging).

### `POST /api/execute`
Execute raw SQL (validated for safety).

### `GET /health`
Health check endpoint.

## Example Queries

| Question | Description |
|----------|-------------|
| "Stock of iPhone 13 in Mumbai" | Product stock by location |
| "Total inventory valuation" | Sum of all stock values |
| "Products below reorder level" | Low stock alerts |
| "Top 5 products by quantity" | Stock rankings |
| "List all warehouses" | Warehouse information |
| "Stock movements this month" | Recent transfers |

## Project Structure

```
inventory-bot/
├── src/
│   ├── index.js          # Express server & routes
│   ├── config.js         # Environment configuration
│   ├── schema.js         # Database schema & AI prompt
│   ├── sqlGenerator.js   # Gemini SQL generation
│   ├── sqlExecutor.js    # Safe query execution
│   └── nlFormatter.js    # Result formatting
├── db/
│   └── seed.sql          # Schema & sample data
├── .env                  # Environment variables
├── package.json
└── README.md
```

## Security Features

- **Read-Only Queries**: Only SELECT statements allowed
- **Keyword Blocking**: INSERT, UPDATE, DELETE, DROP, etc. blocked
- **Pattern Detection**: SQL injection patterns detected
- **Transaction Isolation**: Queries run in read-only transactions
- **Connection Pooling**: Safe database connection management

## Sample Data

The seed file includes:
- 4 warehouses (Mumbai, Delhi, Bangalore, Chennai)
- 13 products (phones, laptops, accessories)
- Stock across multiple locations
- Valuation layers for costing
- Sample stock movements

## Troubleshooting

**"Cannot connect to database"**
- Check MySQL is running
- Verify credentials in `.env`
- Ensure database exists: `CREATE DATABASE inventory_db;`

**"SQL Generation failed"**
- Verify Gemini API key is valid
- Check API quota limits
- Review question clarity

**"Only SELECT queries allowed"**
- The bot is read-only by design
- Modification queries are blocked for safety