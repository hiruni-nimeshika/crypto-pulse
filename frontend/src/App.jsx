import { useEffect, useState } from 'react';
import './App.css';

const API_URL = 'https://cryptopulsebackend1-io6qfx0j.b4a.run';

function App() {
  const [prices, setPrices] = useState({});
  const [email, setEmail] = useState('');
  const [coin, setCoin] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await fetch(`${API_URL}/api/prices`);
      const data = await response.json();
      setPrices(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.log('Error fetching prices:', error);
    }
  };

  const setAlert = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/api/alerts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          coin,
          targetPrice: parseFloat(targetPrice)
        })
      });
      const data = await response.json();
      setMessage(data.message || '✅ Alert set successfully!');
      setMessageType('success');
      setEmail('');
      setTargetPrice('');
      
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (error) {
      setMessage('❌ Error setting alert');
      setMessageType('error');
    }
  };

  const coinNames = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    solana: 'Solana',
    cardano: 'Cardano',
    polkadot: 'Polkadot'
  };

  const coinIcons = {
    bitcoin: '₿',
    ethereum: '⟠',
    solana: '◎',
    cardano: '₳',
    polkadot: '●'
  };

  const coinColors = {
    bitcoin: '#f7931a',
    ethereum: '#627eea',
    solana: '#9945ff',
    cardano: '#0033ad',
    polkadot: '#e6007a'
  };

  const hasPrices = Object.keys(prices).length > 0;

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <span className="logo-icon">📈</span>
            <span className="logo-text">CryptoPulse</span>
          </div>
          <div className="nav-right">
            <span className="live-badge">
              <span className="live-dot"></span>
              LIVE
            </span>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Track Crypto Prices<br />
            <span className="hero-highlight">In Real-Time</span>
          </h1>
          <p className="hero-sub">
            Get instant price alerts when your favorite coins hit your target
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{Object.keys(prices).length}</span>
              <span className="stat-label">Coins Tracked</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">30s</span>
              <span className="stat-label">Update Speed</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">∞</span>
              <span className="stat-label">Free Alerts</span>
            </div>
          </div>
        </div>
      </section>

      {/* PRICE GRID */}
      <section className="prices">
        <div className="section-header">
          <h2>💰 Market Prices</h2>
          <span className="update-time">Updated: {lastUpdated || '--:--:--'}</span>
        </div>

        {!hasPrices ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading market data...</p>
          </div>
        ) : (
          <div className="price-grid">
            {Object.keys(prices).map((coin) => (
              <div className="price-card" key={coin}>
                <div className="card-top">
                  <div className="coin-info">
                    <span className="coin-icon" style={{ color: coinColors[coin] }}>
                      {coinIcons[coin] || '🪙'}
                    </span>
                    <div>
                      <div className="coin-name">{coinNames[coin] || coin}</div>
                      <div className="coin-symbol">{coin.toUpperCase()}</div>
                    </div>
                  </div>
                  <div className="price-change">+2.4%</div>
                </div>
                <div className="card-bottom">
                  <div className="price-value">
                    ${prices[coin].usd?.toFixed(2) || '0.00'}
                  </div>
                  <div className="price-bar">
                    <div className="bar-fill" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ALERT SECTION */}
      <section className="alert-section">
        <div className="alert-container">
          <div className="alert-left">
            <h2>🔔 Set Price Alert</h2>
            <p>Get notified via email when your coin reaches your target price</p>
            <div className="feature-list">
              <div className="feature-item">✅ Instant email notifications</div>
              <div className="feature-item">✅ Track multiple coins</div>
              <div className="feature-item">✅ 100% free to use</div>
            </div>
          </div>
          <div className="alert-right">
            <form onSubmit={setAlert} className="alert-form">
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Select Coin</label>
                  <select value={coin} onChange={(e) => setCoin(e.target.value)}>
                    <option value="bitcoin">Bitcoin</option>
                    <option value="ethereum">Ethereum</option>
                    <option value="solana">Solana</option>
                    <option value="cardano">Cardano</option>
                    <option value="polkadot">Polkadot</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Price ($)</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="e.g., 50000"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="alert-btn">
                Set Alert
              </button>

              {message && (
                <div className={`alert-msg ${messageType}`}>
                  {message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <p>© 2026 CryptoPulse • Built with React • Powered by CoinGecko API</p>
      </footer>
    </div>
  );
}

export default App;