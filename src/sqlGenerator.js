
// ============================================
// 📁 FILE: src/sqlGenerator.js
// ============================================
import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from './config.js';
import { systemPrompt } from './schema.js';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

export async function generateSQL(question) {
  try {
    const model = genAI.getGenerativeModel({ model: config.gemini.model });
    
    const prompt = `${systemPrompt}

USER QUESTION: ${question}

Generate the SQL query:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let sql = response.text().trim();
    
    // Clean up response - remove markdown fences if present
    sql = sql.replace(/```sql\n?/gi, '').replace(/```\n?/g, '').trim();
    
    // Check for special responses
    if (sql === 'READ_ONLY_ERROR') {
      throw new Error('I can only generate read-only queries. Modifications are not allowed.');
    }
    if (sql === 'CANNOT_ANSWER') {
      throw new Error('I cannot answer this question with the available data schema.');
    }
    
    return sql;
  } catch (error) {
    if (error.message.includes('read-only') || error.message.includes('cannot answer')) {
      throw error;
    }
    throw new Error(`SQL Generation failed: ${error.message}`);
  }
}
