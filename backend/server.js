const express = require('express');
const cors = require('cors');
const axios = require('axios');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database(path.join(__dirname, 'alerts.db'));

db.run(`
  CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL,
    coin TEXT NOT NULL,
    targetPrice REAL NOT NULL,
    isTriggered INTEGER DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Test route
app.get('/api/health', (req, res) => {
  res.json({ message: '✅ Backend is running!' });
});

// Get prices (frontend will call this every 30 seconds)
app.get('/api/prices', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum,solana,cardano,polkadot',
          vs_currencies: 'usd'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    // Return fallback data if API fails
    res.json({
      bitcoin: { usd: 45230 },
      ethereum: { usd: 3120 },
      solana: { usd: 185 },
      cardano: { usd: 0.45 },
      polkadot: { usd: 6.80 }
    });
  }
});

// Alert endpoint
app.post('/api/alerts', (req, res) => {
  const { email, coin, targetPrice } = req.body;
  
  if (!email || !coin || !targetPrice) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  db.run(
    'INSERT INTO alerts (email, coin, targetPrice) VALUES (?, ?, ?)',
    [email, coin.toLowerCase(), targetPrice],
    function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ 
        success: true, 
        message: `✅ Alert set for ${coin} at $${targetPrice}`
      });
    }
  );
});

// Check alerts endpoint
app.get('/api/check-alerts', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'bitcoin,ethereum,solana',
          vs_currencies: 'usd'
        }
      }
    );
    const prices = response.data;
    
    db.all('SELECT * FROM alerts WHERE isTriggered = 0', (err, alerts) => {
      if (err) {
        return res.json({ alerts: [] });
      }
      
      const triggered = [];
      alerts.forEach(alert => {
        const currentPrice = prices[alert.coin]?.usd;
        if (currentPrice && currentPrice >= alert.targetPrice) {
          triggered.push(alert);
          db.run('UPDATE alerts SET isTriggered = 1 WHERE id = ?', [alert.id]);
          console.log(`🔥 Alert triggered for ${alert.email} on ${alert.coin}`);
        }
      });
      
      res.json({ triggered: triggered.length });
    });
  } catch (error) {
    res.json({ error: 'Could not check alerts' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});