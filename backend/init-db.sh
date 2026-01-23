#!/bin/bash
# Database initialization script for PostgreSQL

# Create database
createdb mutual_aid_network

# Connect and create tables
psql mutual_aid_network << EOF

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone_number VARCHAR(20),
  country VARCHAR(100),
  password_hash VARCHAR(255) NOT NULL,
  profile_photo VARCHAR(255),
  id_front_image VARCHAR(255),
  id_back_image VARCHAR(255),
  is_verified BOOLEAN DEFAULT false,
  payment_method_verified BOOLEAN DEFAULT false,
  total_earnings DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Packages table
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  package_id VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  return_percentage INT NOT NULL,
  duration_days INT NOT NULL,
  description TEXT
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_id VARCHAR(255) UNIQUE NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'PENDING',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(user_id)
);

-- Help records table
CREATE TABLE help_records (
  id SERIAL PRIMARY KEY,
  help_id VARCHAR(255) UNIQUE NOT NULL,
  giver_id VARCHAR(255) NOT NULL,
  receiver_id VARCHAR(255) NOT NULL,
  package_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at TIMESTAMP,
  FOREIGN KEY(giver_id) REFERENCES users(user_id),
  FOREIGN KEY(receiver_id) REFERENCES users(user_id)
);

-- Insert default packages
INSERT INTO packages (package_id, name, amount, return_percentage, duration_days, description) VALUES
('pkg-1', 'Basic', 25, 30, 3, 'Perfect for getting started'),
('pkg-2', 'Bronze', 100, 30, 5, 'Build your earnings'),
('pkg-3', 'Silver', 250, 50, 15, 'Accelerate your growth'),
('pkg-4', 'Gold', 500, 50, 15, 'Premium support included');

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_user_id ON users(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_help_records_giver ON help_records(giver_id);
CREATE INDEX idx_help_records_receiver ON help_records(receiver_id);

EOF

echo "Database initialized successfully!"
