-- ============================================
-- Inventory Bot Database Schema & Seed Data
-- MySQL 8.0+
-- ============================================

CREATE DATABASE IF NOT EXISTS inventory_db;
USE inventory_db;

-- ============================================
-- SCHEMA CREATION
-- ============================================

DROP TABLE IF EXISTS stock_valuation_layer;
DROP TABLE IF EXISTS stock_quants;
DROP TABLE IF EXISTS stock_moves;
DROP TABLE IF EXISTS stock_lots;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS warehouses;
DROP TABLE IF EXISTS partners;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS uom;

-- Units of Measure
CREATE TABLE uom (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) NOT NULL,
  symbol VARCHAR(10) NOT NULL
);

-- Product Categories
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  parent_id INT REFERENCES categories(id)
);

-- Users
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Partners (Customers & Suppliers)
CREATE TABLE partners (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  type ENUM('customer', 'supplier') NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT
);

-- Warehouses
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  short_code VARCHAR(10) UNIQUE NOT NULL
);

-- Locations (within warehouses)
CREATE TABLE locations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  warehouse_id INT NOT NULL,
  usage_type ENUM('internal', 'customer', 'supplier', 'transit', 'production') DEFAULT 'internal',
  parent_location_id INT,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id),
  FOREIGN KEY (parent_location_id) REFERENCES locations(id)
);

-- Products
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  category_id INT,
  uom_id INT DEFAULT 1,
  standard_price DECIMAL(15,2) DEFAULT 0.00,
  tracking ENUM('none', 'lot', 'serial') DEFAULT 'none',
  min_reorder_level INT DEFAULT 10,
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (uom_id) REFERENCES uom(id)
);

-- Stock Lots (for batch/lot tracking)
CREATE TABLE stock_lots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  product_id INT NOT NULL,
  expiry_date DATE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Stock Moves (inventory movements)
CREATE TABLE stock_moves (
  id INT PRIMARY KEY AUTO_INCREMENT,
  transfer_id INT,
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  product_id INT NOT NULL,
  qty DECIMAL(15,3) NOT NULL,
  uom_id INT,
  location_id INT NOT NULL,
  dest_location_id INT NOT NULL,
  lot_id INT,
  state ENUM('draft', 'confirmed', 'done', 'cancelled') DEFAULT 'draft',
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (uom_id) REFERENCES uom(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (dest_location_id) REFERENCES locations(id),
  FOREIGN KEY (lot_id) REFERENCES stock_lots(id)
);

-- Stock Quants (current inventory levels)
CREATE TABLE stock_quants (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  location_id INT NOT NULL,
  lot_id INT,
  quantity DECIMAL(15,3) DEFAULT 0,
  reserved_quantity DECIMAL(15,3) DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (location_id) REFERENCES locations(id),
  FOREIGN KEY (lot_id) REFERENCES stock_lots(id),
  UNIQUE KEY unique_quant (product_id, location_id, lot_id)
);

-- Stock Valuation Layer (for FIFO/LIFO costing)
CREATE TABLE stock_valuation_layer (
  id INT PRIMARY KEY AUTO_INCREMENT,
  product_id INT NOT NULL,
  stock_move_id INT,
  quantity DECIMAL(15,3) NOT NULL,
  remaining_qty DECIMAL(15,3) NOT NULL,
  unit_cost DECIMAL(15,4) NOT NULL,
  value DECIMAL(15,2) GENERATED ALWAYS AS (remaining_qty * unit_cost) STORED,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (stock_move_id) REFERENCES stock_moves(id)
);

-- ============================================
-- SEED DATA
-- ============================================

-- Units of Measure
INSERT INTO uom (name, symbol) VALUES
('Units', 'pcs'),
('Kilograms', 'kg'),
('Liters', 'L'),
('Boxes', 'box'),
('Pallets', 'plt');

-- Categories
INSERT INTO categories (name, parent_id) VALUES
('Electronics', NULL),
('Mobile Phones', 1),
('Laptops', 1),
('Accessories', 1),
('Food & Beverage', NULL),
('Clothing', NULL);

-- Users
INSERT INTO users (name, email, role) VALUES
('Admin User', 'admin@company.com', 'admin'),
('Warehouse Manager', 'warehouse@company.com', 'manager'),
('Stock Keeper', 'stock@company.com', 'user');

-- Partners
INSERT INTO partners (name, type, email, phone, address) VALUES
('Apple Inc', 'supplier', 'orders@apple.com', '+1-800-275-2273', 'Cupertino, CA'),
('Samsung Electronics', 'supplier', 'b2b@samsung.com', '+82-2-2255-0114', 'Seoul, South Korea'),
('Dell Technologies', 'supplier', 'sales@dell.com', '+1-800-999-3355', 'Round Rock, TX'),
('Retail Customer A', 'customer', 'buyer@retaila.com', '+91-9876543210', 'Mumbai, India'),
('Retail Customer B', 'customer', 'orders@retailb.com', '+91-8765432109', 'Delhi, India');

-- Warehouses
INSERT INTO warehouses (name, short_code) VALUES
('Mumbai Central', 'MUM'),
('Delhi North', 'DEL'),
('Bangalore Tech Park', 'BLR'),
('Chennai Port', 'CHN');

-- Locations
INSERT INTO locations (name, warehouse_id, usage_type, parent_location_id) VALUES
-- Mumbai
('MUM/Stock', 1, 'internal', NULL),
('MUM/Stock/Shelf-A', 1, 'internal', 1),
('MUM/Stock/Shelf-B', 1, 'internal', 1),
('MUM/Receiving', 1, 'transit', NULL),
('MUM/Shipping', 1, 'transit', NULL),
-- Delhi
('DEL/Stock', 2, 'internal', NULL),
('DEL/Stock/Zone-1', 2, 'internal', 6),
('DEL/Stock/Zone-2', 2, 'internal', 6),
-- Bangalore
('BLR/Stock', 3, 'internal', NULL),
('BLR/Stock/Electronics', 3, 'internal', 9),
-- Chennai
('CHN/Stock', 4, 'internal', NULL),
('CHN/Import', 4, 'supplier', NULL);

-- Products
INSERT INTO products (name, sku, category_id, uom_id, standard_price, tracking, min_reorder_level) VALUES
('iPhone 13', 'APL-IP13-128', 2, 1, 799.00, 'serial', 50),
('iPhone 14 Pro', 'APL-IP14P-256', 2, 1, 1099.00, 'serial', 30),
('iPhone 15', 'APL-IP15-128', 2, 1, 899.00, 'serial', 40),
('Samsung Galaxy S23', 'SAM-S23-128', 2, 1, 749.00, 'serial', 50),
('Samsung Galaxy Z Fold', 'SAM-ZFOLD-256', 2, 1, 1799.00, 'serial', 20),
('MacBook Pro 14"', 'APL-MBP14-512', 3, 1, 1999.00, 'serial', 25),
('MacBook Air M2', 'APL-MBA-M2-256', 3, 1, 1199.00, 'serial', 30),
('Dell XPS 15', 'DEL-XPS15-512', 3, 1, 1499.00, 'serial', 20),
('Dell Latitude 5530', 'DEL-LAT5530', 3, 1, 1099.00, 'serial', 15),
('AirPods Pro', 'APL-APP-2', 4, 1, 249.00, 'lot', 100),
('Samsung Buds Pro', 'SAM-BUDS-PRO', 4, 1, 199.00, 'lot', 100),
('USB-C Charger 65W', 'ACC-USBC-65W', 4, 1, 49.00, 'none', 200),
('Laptop Bag Premium', 'ACC-BAG-PREM', 4, 1, 79.00, 'none', 150);

-- Stock Lots
INSERT INTO stock_lots (name, product_id, expiry_date) VALUES
('LOT-IP13-2024-001', 1, NULL),
('LOT-IP14P-2024-001', 2, NULL),
('LOT-APP-2024-Q1', 10, '2026-12-31'),
('LOT-APP-2024-Q2', 10, '2027-03-31'),
('LOT-SBUDS-2024', 11, '2026-06-30');

-- Stock Quants (Current Inventory)
-- Mumbai Warehouse
INSERT INTO stock_quants (product_id, location_id, lot_id, quantity, reserved_quantity) VALUES
(1, 2, 1, 150, 20),    -- iPhone 13 in MUM/Shelf-A
(2, 2, 2, 75, 10),     -- iPhone 14 Pro in MUM/Shelf-A
(3, 3, NULL, 100, 15), -- iPhone 15 in MUM/Shelf-B
(4, 3, NULL, 80, 5),   -- Galaxy S23 in MUM/Shelf-B
(6, 2, NULL, 45, 5),   -- MacBook Pro in MUM/Shelf-A
(10, 3, 3, 200, 30),   -- AirPods Pro in MUM/Shelf-B
(12, 3, NULL, 500, 50);-- USB-C Chargers in MUM/Shelf-B

-- Delhi Warehouse
INSERT INTO stock_quants (product_id, location_id, lot_id, quantity, reserved_quantity) VALUES
(1, 7, NULL, 80, 10),  -- iPhone 13 in DEL/Zone-1
(3, 7, NULL, 60, 8),   -- iPhone 15 in DEL/Zone-1
(5, 8, NULL, 25, 3),   -- Galaxy Z Fold in DEL/Zone-2
(7, 8, NULL, 55, 10),  -- MacBook Air in DEL/Zone-2
(8, 7, NULL, 40, 5),   -- Dell XPS in DEL/Zone-1
(11, 8, 5, 150, 20);   -- Samsung Buds in DEL/Zone-2

-- Bangalore Warehouse
INSERT INTO stock_quants (product_id, location_id, lot_id, quantity, reserved_quantity) VALUES
(2, 10, NULL, 90, 15), -- iPhone 14 Pro in BLR/Electronics
(4, 10, NULL, 120, 20),-- Galaxy S23 in BLR/Electronics
(6, 10, NULL, 35, 8),  -- MacBook Pro in BLR/Electronics
(9, 10, NULL, 50, 5),  -- Dell Latitude in BLR/Electronics
(10, 10, 4, 300, 40),  -- AirPods Pro in BLR/Electronics
(13, 10, NULL, 200, 25);-- Laptop Bags in BLR/Electronics

-- Chennai Warehouse
INSERT INTO stock_quants (product_id, location_id, lot_id, quantity, reserved_quantity) VALUES
(1, 11, NULL, 200, 0),  -- iPhone 13 in CHN/Stock (new shipment)
(3, 11, NULL, 150, 0),  -- iPhone 15 in CHN/Stock
(4, 11, NULL, 100, 0),  -- Galaxy S23 in CHN/Stock
(12, 11, NULL, 1000, 0);-- USB-C Chargers in CHN/Stock

-- Stock Moves (Recent movements)
INSERT INTO stock_moves (transfer_id, date, product_id, qty, uom_id, location_id, dest_location_id, lot_id, state) VALUES
(1001, '2024-11-01 10:00:00', 1, 50, 1, 12, 2, 1, 'done'),
(1001, '2024-11-01 10:00:00', 2, 25, 1, 12, 2, 2, 'done'),
(1002, '2024-11-05 14:30:00', 1, 30, 1, 2, 5, 1, 'done'),
(1003, '2024-11-10 09:15:00', 10, 100, 1, 12, 3, 3, 'done'),
(1004, '2024-11-15 11:00:00', 6, 10, 1, 12, 10, NULL, 'done'),
(1005, '2024-11-18 16:45:00', 3, 20, 1, 11, 7, NULL, 'confirmed');

-- Stock Valuation Layers
INSERT INTO stock_valuation_layer (product_id, stock_move_id, quantity, remaining_qty, unit_cost) VALUES
(1, 1, 50, 45, 650.00),
(1, NULL, 100, 100, 680.00),
(1, NULL, 285, 285, 700.00),
(2, 2, 25, 20, 950.00),
(2, NULL, 140, 140, 980.00),
(3, NULL, 310, 310, 780.00),
(4, NULL, 300, 300, 620.00),
(5, NULL, 25, 25, 1500.00),
(6, 5, 10, 10, 1750.00),
(6, NULL, 70, 70, 1800.00),
(7, NULL, 55, 55, 1050.00),
(8, NULL, 40, 40, 1300.00),
(9, NULL, 50, 50, 950.00),
(10, 4, 100, 70, 180.00),
(10, NULL, 430, 430, 195.00),
(11, NULL, 150, 150, 150.00),
(12, NULL, 1500, 1500, 35.00),
(13, NULL, 200, 200, 55.00);

-- ============================================
-- USEFUL VIEWS (Optional)
-- ============================================

CREATE OR REPLACE VIEW v_stock_available AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  p.sku,
  w.name AS warehouse,
  l.name AS location,
  q.quantity,
  q.reserved_quantity,
  (q.quantity - q.reserved_quantity) AS available_qty
FROM stock_quants q
JOIN products p ON p.id = q.product_id
JOIN locations l ON l.id = q.location_id
JOIN warehouses w ON w.id = l.warehouse_id
WHERE l.usage_type = 'internal';

CREATE OR REPLACE VIEW v_product_valuation AS
SELECT
  p.id AS product_id,
  p.name AS product_name,
  SUM(v.remaining_qty) AS total_qty,
  SUM(v.remaining_qty * v.unit_cost) AS total_value,
  AVG(v.unit_cost) AS avg_cost
FROM stock_valuation_layer v
JOIN products p ON p.id = v.product_id
WHERE v.remaining_qty > 0
GROUP BY p.id, p.name;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_quants_product ON stock_quants(product_id);
CREATE INDEX idx_quants_location ON stock_quants(location_id);
CREATE INDEX idx_moves_product ON stock_moves(product_id);
CREATE INDEX idx_moves_date ON stock_moves(date);
CREATE INDEX idx_valuation_product ON stock_valuation_layer(product_id);

SELECT 'Database seeded successfully!' AS status;