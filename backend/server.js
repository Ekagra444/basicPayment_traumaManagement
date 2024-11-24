// server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
require('dotenv').config();
// MySQL connection
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: 'banking_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

// Create bank_accounts table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        account_holder VARCHAR(255) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL
      )
    `);
    console.log('Database initialized');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();

// Add account
app.post('/api/accounts', async (req, res) => {
  const { accountHolder, balance } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO bank_accounts (account_holder, balance) VALUES (?, ?)',
      [accountHolder, balance]
    );
    res.json({ id: result.insertId, accountHolder, balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all accounts
app.get('/api/accounts', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM bank_accounts');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Transfer money
app.post('/api/transfer', async (req, res) => {
    const { fromId, toId, amount } = req.body;
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Check sender's balance
      const [sender] = await connection.query(
        'SELECT balance FROM bank_accounts WHERE id = ? FOR UPDATE',
        [fromId]
      );
      
      if(toId===fromId){
        await connection.rollback();
        return res.status(404).json({ error: 'transferring money to same account not allowed' });
      }
      if (!sender || !sender[0]) {
        await connection.rollback();
        return res.status(404).json({ error: 'Sender account not found' });
      }
      
      if (sender[0].balance < amount) {
        await connection.rollback();
        return res.status(400).json({ error: 'Insufficient funds' });
      }
      
      // Update sender's balance
      await connection.query(
        'UPDATE bank_accounts SET balance = balance - ? WHERE id = ?',
        [amount, fromId]
      );
      
      // Update receiver's balance
      const [updateResult] = await connection.query(
        'UPDATE bank_accounts SET balance = balance + ? WHERE id = ?',
        [amount, toId]
      );
  
      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: 'Receiver account not found' });
      }
      
      await connection.commit();
      res.json({ message: 'Transfer successful' });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: 'Transfer failed' });
    } finally {
      connection.release();
    }
  });

  // In your Express backend routes file
app.delete('/api/accounts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      
      // Assuming you're using a SQL database
      const result = await pool.query(
        'DELETE FROM bank_accounts WHERE id = ? ',
        [id]
      );
      
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      res.json({ message: 'Account deleted successfully' });
    } catch (error) {
      console.error('Error deleting account:', error);
      res.status(500).json({ error: 'Failed to delete account' });
    }
  });

  // edit functionality through put request 
app.put('/api/accounts/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const balance = (req.body.balance);

      
      // Validate the balance
      if (typeof balance !== 'number' || balance < 0) {
        return res.status(400).json({ error: 'Invalid balance amount' });
      }
  
      // Assuming you're using a SQL database
      const result = await pool.query(
        'UPDATE bank_accounts SET balance = ? WHERE id = ? ',
        [balance, id]
      );
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Account not found' });
      }
      
      return res.status(200).json(result[0]);
    } catch (error) {
      console.error('Error updating account:', error);
      res.status(500).json({ error: 'Failed to update account' });
    }
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});