
// ============================================
// 📁 FILE: src/index.js
// ============================================
import express from 'express';
import cors from 'cors';
import { config } from './config.js';
import { generateSQL } from './sqlGenerator.js';
import { executeSQL, closePool } from './sqlExecutor.js';
import { formatResult } from './nlFormatter.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main query endpoint
app.post('/api/query', async (req, res) => {
  const startTime = Date.now();
  const { question } = req.body;

  if (!question || typeof question !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Please provide a valid question.'
    });
  }

  try {
    console.log(`\n📝 Question: "${question}"`);

    // Step 1: Generate SQL
    const sql = await generateSQL(question);
    console.log(`🔧 Generated SQL:\n${sql}`);

    // Step 2: Execute SQL
    const results = await executeSQL(sql);
    console.log(`📊 Results: ${results.length} rows`);

    // Step 3: Format response
    const formatted = formatResult(question, results, sql);

    const duration = Date.now() - startTime;
    console.log(`✅ Completed in ${duration}ms`);

    res.json({
      success: true,
      question,
      sql,
      ...formatted,
      meta: {
        duration: `${duration}ms`,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    
    res.status(error.message.includes('read-only') ? 400 : 500).json({
      success: false,
      question,
      error: error.message,
      meta: {
        duration: `${Date.now() - startTime}ms`,
        timestamp: new Date().toISOString()
      }
    });
  }
});

// SQL-only endpoint (for debugging)
app.post('/api/sql', async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ error: 'Question required' });
  }

  try {
    const sql = await generateSQL(question);
    res.json({ success: true, sql });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Execute raw SQL (protected, for testing)
app.post('/api/execute', async (req, res) => {
  const { sql } = req.body;

  if (!sql) {
    return res.status(400).json({ error: 'SQL query required' });
  }

  try {
    const results = await executeSQL(sql);
    res.json({ success: true, data: results, rowCount: results.length });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  await closePool();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closePool();
  process.exit(0);
});

// Start server
app.listen(config.server.port, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║       🤖 Inventory Bot Backend Running            ║
║───────────────────────────────────────────────────║
║   Port: ${config.server.port}                                      ║
║   Endpoints:                                      ║
║     POST /api/query   - Natural language query    ║
║     POST /api/sql     - Generate SQL only         ║
║     POST /api/execute - Execute raw SQL           ║
║     GET  /health      - Health check              ║
╚═══════════════════════════════════════════════════╝
  `);
});

export default app;