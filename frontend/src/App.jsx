import { useEffect, useState } from 'react';
import './App.css';

const IDS = 'bitcoin,ethereum,solana,cardano,polkadot';

// Alerts need the back end. Locally it runs on port 5000.
const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

function App() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState('');
  const [coin, setCoin] = useState('bitcoin');
  const [targetPrice, setTargetPrice] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchPrices = async () => {
    try {
      const res = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=' +
          IDS +
          '&vs_currencies=usd&include_24hr_change=true'
      );
      if (res.status === 429) throw new Error('Rate limit reached');
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      setPrices(data);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (e) {
      console.log('Error fetching prices:', e);
      setError('Could not load market data. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
  };

  const setAlert = async (e) => {
    e.preventDefault();

    const price = parseFloat(targetPrice);
    if (!Number.isFinite(price) || price <= 0) {
      showMessage('❌ Target price must be a number greater than 0.', 'error');
      return;
    }

    if (!API_URL) {
      showMessage(
        'ℹ️ Alerts need the back end, which only runs locally in this demo.',
        'error'
      );
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, coin, targetPrice: price }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showMessage('❌ ' + (data.message || 'Could not set the alert.'), 'error');
        return;
      }

      showMessage(data.message || '✅ Alert set successfully!', 'success');
      setEmail('');
      setTargetPrice('');

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
    } catch (err) {
      showMessage('❌ Failed to connect to the server. Please try again later.', 'error');
    }
  };

  const coinNames = {
    bitcoin: 'Bitcoin',
    ethereum: 'Ethereum',
    solana: 'Solana',
    cardano: 'Cardano',
    polkadot: 'Polkadot',
  };

  const coinIcons = {
    bitcoin: '₿',
    ethereum: '⟠',
    solana: '◎',
    cardano: '₳',
    polkadot: '●',
  };

  const coinColors = {
    bitcoin: '#f7931a',
    ethereum: '#627eea',
    solana: '#9945ff',
    cardano: '#0033ad',
    polkadot: '#e6007a',
  };

  const hasPrices = Object.keys(prices).length > 0;

  return (
    <div className="app">
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

      <section className="prices">
        <div className="section-header">
          <h2>💰 Market Prices</h2>
          <span className="update-time">Updated: {lastUpdated || '--:--:--'}</span>
        </div>

        {error && hasPrices && (
          <div className="alert-msg error" role="alert">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading market data...</p>
          </div>
        ) : !hasPrices ? (
          <div className="loading-state" role="alert">
            <p>⚠️ {error || 'No market data available.'}</p>
            <button type="button" className="alert-btn" onClick={fetchPrices}>
              Try again
            </button>
          </div>
        ) : (
          <div className="price-grid">
            {Object.keys(prices).map((id) => {
              const usd = prices[id].usd;
              const change = prices[id].usd_24h_change;
              const hasChange = typeof change === 'number';
              const isUp = hasChange && change >= 0;
              const barWidth = hasChange
                ? Math.max(5, Math.min(Math.abs(change) * 10, 100))
                : 5;
              const changeText = hasChange
                ? (isUp ? '+' : '') + change.toFixed(2) + '%'
                : '--';
              const priceText = typeof usd === 'number' ? '$' + usd.toFixed(2) : '--';

              return (
                <div className="price-card" key={id}>
                  <div className="card-top">
                    <div className="coin-info">
                      <span className="coin-icon" style={{ color: coinColors[id] }}>
                        {coinIcons[id] || '🪙'}
                      </span>
                      <div>
                        <div className="coin-name">{coinNames[id] || id}</div>
                        <div className="coin-symbol">{id.toUpperCase()}</div>
                      </div>
                    </div>
                    <div
                      className="price-change"
                      style={isUp || !hasChange ? undefined : { color: '#ef4444' }}
                    >
                      {changeText}
                    </div>
                  </div>
                  <div className="card-bottom">
                    <div className="price-value">{priceText}</div>
                    <div className="price-bar">
                      <div className="bar-fill" style={{ width: barWidth + '%' }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

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

      <footer className="footer">
        <p>© 2026 CryptoPulse • Built with React • Powered by CoinGecko API</p>
      </footer>
    </div>
  );
}

export default App;