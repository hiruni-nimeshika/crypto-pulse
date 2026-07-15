# 🚀 CryptoPulse - Real-Time Crypto Dashboard

![React](https://img.shields.io/badge/React-18.x-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![SQLite](https://img.shields.io/badge/SQLite-3.x-lightblue)
![License](https://img.shields.io/badge/License-MIT-yellow)

> A real-time cryptocurrency price tracker with instant price alerts. Get notified when your favorite coins hit your target price!

## 📸 Screenshots

![Dashboard Screenshot](./screenshot.png)

## ✨ Features

- 📊 **Real-time prices** - Live updates every 30 seconds
- 🔔 **Price alerts** - Get notified via email when coins hit your target
- 🎯 **Track multiple coins** - Bitcoin, Ethereum, Solana, Cardano, Polkadot
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🌙 **Dark theme** - Modern, professional UI
- ⚡ **Fast performance** - Built with Vite for optimal speed

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- CSS3 with modern animations

**Backend:**
- Node.js
- Express.js
- SQLite3 (database)
- Nodemailer (email notifications)

**API:**
- CoinGecko API (crypto prices)

## 🚀 Live Demo

[View Live Demo](https://your-frontend-url.vercel.app)

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Clone the repository
```bash
git clone https://github.com/hiruni-nimeshika/crypto-pulse.git
cd crypto-pulse
Backend Setup
bash
cd backend
npm install
npm run dev
The backend will run on http://localhost:5000

Frontend Setup
bash
cd frontend
npm install
npm run dev
The frontend will run on http://localhost:5173

📁 Project Structure
text
crypto-pulse/
├── backend/
│   ├── server.js          # Main server file
│   ├── package.json
│   └── alerts.db          # SQLite database file
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── App.css        # Styling
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
├── README.md
└── .gitignore
🔧 API Endpoints
Method	Endpoint	Description
GET	/api/health	Health check
GET	/api/prices	Get all crypto prices
POST	/api/alerts	Create a new price alert
GET	/api/check-alerts	Check triggered alerts
🎯 How It Works
Live Prices: The frontend fetches prices from the backend every 30 seconds

Price Alerts: Users set target prices for their favorite coins

Email Notifications: When a coin hits the target, the system triggers an email notification

Database: All alerts are stored in SQLite for persistence

🚀 Deployment
Deploy Backend to Render
Push code to GitHub

Go to Render.com

Create new Web Service → Connect GitHub repo

Root directory: backend

Start command: node server.js

Deploy Frontend to Vercel
Go to Vercel.com

Import GitHub repo

Root directory: frontend

Framework preset: Vite

🤝 Contributing
Contributions are welcome! Please open an issue or submit a pull request.

📄 License
This project is licensed under the MIT License.

🙏 Acknowledgments
CoinGecko API for free crypto data

React for the frontend framework

Vite for the build tool

📬 Contact
Hiruni Nimeshika - GitHub

GitHub: @hiruni-nimeshika

⭐ Star this repo if you found it helpful!

text

---

## Step 3: Save the file

Press **Ctrl + S** to save.

---

## Step 4: Push to GitHub

Open terminal and run:

```bash
git add README.md
git commit -m "Update README with correct GitHub URL and professional content"
git push