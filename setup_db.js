import sqlite3 from 'sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'banking_audit.db');

const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // Create a transactions table
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    account_id TEXT,
    amount REAL,
    currency TEXT,
    date TEXT,
    description TEXT,
    status TEXT
  )`);

  const stmt = db.prepare("INSERT INTO transactions (account_id, amount, currency, date, description, status) VALUES (?, ?, ?, ?, ?, ?)");
  
  // Normal transactions
  stmt.run("ACC-123", 125.50, "AUD", "2026-05-19", "Grocery Store", "completed");
  stmt.run("ACC-456", 2400.00, "AUD", "2026-05-19", "Monthly Rent", "completed");
  
  // A suspicious transaction (High value)
  stmt.run("ACC-789", 15000.00, "AUD", "2026-05-20", "Private Sale Transfer", "pending");
  
  // Structured transactions (Multiple small transfers to bypass $10k flag)
  stmt.run("ACC-999", 9500.00, "AUD", "2026-05-20", "Consulting Fee", "completed");
  stmt.run("ACC-999", 9500.00, "AUD", "2026-05-20", "Consulting Fee Part 2", "completed");

  stmt.finalize();
  console.log("Database 'banking_audit.db' created with mock data.");
});

db.close();