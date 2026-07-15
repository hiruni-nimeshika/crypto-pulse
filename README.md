
---

## Step 5: Create a Screenshot

**5.1** Open your dashboard at `http://localhost:5173`

**5.2** Take a screenshot:
- Press **Windows + Shift + S**
- Select the browser window
- Save as `screenshot.png` in your `crypto-dashboard` folder

---

## Step 6: Add and Commit Everything

In your terminal, run these commands one by one:

```bash
# Add all files
git add .

# Commit with a message
git commit -m "Initial commit: CryptoPulse - Real-time Crypto Dashboard"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/crypto-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main