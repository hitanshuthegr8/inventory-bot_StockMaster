
// ============================================
// 📁 FILE: src/config.js
// ============================================
import dotenv from 'dotenv';
dotenv.config();

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ ERROR: GEMINI_API_KEY is required in .env file');
  console.error('   Get your API key from: https://aistudio.google.com/app/apikey');
  process.exit(1);
}

export const config = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-1.5-flash'
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'inventory_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },
  server: {
    port: process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
  }
};
