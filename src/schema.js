// ============================================
// 📁 FILE: src/schema.js
// ============================================
export const schema = `
TABLE users (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  role VARCHAR(50),
  created_at DATETIME
)

TABLE partners (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  type ENUM('customer', 'supplier'),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT
)

TABLE warehouses (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  short_code VARCHAR(10)
)

TABLE locations (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  warehouse_id INT REFERENCES warehouses(id),
  usage_type ENUM('internal', 'customer', 'supplier', 'transit', 'production'),
  parent_location_id INT REFERENCES locations(id)
)

TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  sku VARCHAR(100),
  category_id INT,
  uom_id INT,
  standard_price DECIMAL(15,2),
  tracking ENUM('none', 'lot', 'serial'),
  min_reorder_level INT
)

TABLE stock_lots (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  product_id INT REFERENCES products(id),
  expiry_date DATE
)

TABLE stock_moves (
  id INT PRIMARY KEY,
  transfer_id INT,
  date DATETIME,
  product_id INT REFERENCES products(id),
  qty DECIMAL(15,3),
  uom_id INT,
  location_id INT REFERENCES locations(id),
  dest_location_id INT REFERENCES locations(id),
  lot_id INT REFERENCES stock_lots(id),
  state ENUM('draft', 'confirmed', 'done', 'cancelled')
)

TABLE stock_quants (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  location_id INT REFERENCES locations(id),
  lot_id INT REFERENCES stock_lots(id),
  quantity DECIMAL(15,3),
  reserved_quantity DECIMAL(15,3)
)

TABLE stock_valuation_layer (
  id INT PRIMARY KEY,
  product_id INT REFERENCES products(id),
  stock_move_id INT REFERENCES stock_moves(id),
  quantity DECIMAL(15,3),
  remaining_qty DECIMAL(15,3),
  unit_cost DECIMAL(15,4),
  value DECIMAL(15,2)
)
`;

export const systemPrompt = `You are an expert MySQL query generator for an Inventory Management System.
Convert natural language questions into SQL queries using ONLY the schema below.

SCHEMA:

${schema}

STRICT RULES:

1. Return ONLY the SQL query - no explanations, no markdown, no code blocks

2. Use ONLY tables and columns from the schema above

3. Only SELECT queries - never UPDATE, INSERT, DELETE, DROP

4. For stock availability: available = quantity - reserved_quantity

5. Use COALESCE for nullable values

6. Use LIKE '%term%' for name searches (case-insensitive matching)

7. Always join through proper foreign keys

8. For "stock" questions, query stock_quants table

9. For "value/valuation" questions, query stock_valuation_layer table

10. Filter internal locations with: usage_type = 'internal'

EXAMPLE QUERIES:

Q: "stock of iPhone 13 in Mumbai"

SELECT COALESCE(SUM(q.quantity - q.reserved_quantity), 0) AS available_stock
FROM stock_quants q
JOIN products p ON p.id = q.product_id
JOIN locations l ON l.id = q.location_id
JOIN warehouses w ON w.id = l.warehouse_id
WHERE p.name LIKE '%iPhone 13%' AND w.name LIKE '%Mumbai%' AND l.usage_type = 'internal'

Q: "total inventory valuation"

SELECT COALESCE(SUM(v.remaining_qty * v.unit_cost), 0) AS total_value
FROM stock_valuation_layer v
WHERE v.remaining_qty > 0

Q: "list all products"

SELECT id, name, sku, standard_price FROM products ORDER BY name

Q: "low stock products"

SELECT p.name, p.sku, p.min_reorder_level, COALESCE(SUM(q.quantity - q.reserved_quantity), 0) AS available
FROM products p
LEFT JOIN stock_quants q ON q.product_id = p.id
LEFT JOIN locations l ON l.id = q.location_id AND l.usage_type = 'internal'
GROUP BY p.id
HAVING available < p.min_reorder_level

Return ONLY SQL, nothing else:`;
