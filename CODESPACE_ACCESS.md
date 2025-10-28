# 🌐 Accessing Your Scanner from GitHub Codespaces

## ✅ Your Application is Running!

**Backend Status:** ✅ Running on port 5000
**Codespace Name:** `unearthly-monster-5vx4xpr7qgphvxwv`

---

## 🔓 Step 1: Make Port 5000 Public

Your port needs to be accessible from the internet. Here's how:

### Option A: Using the Ports Tab (Recommended)
1. Look at the bottom of your VS Code window
2. Click on the **"PORTS"** tab (next to Terminal)
3. Find **port 5000** in the list
4. Right-click on the port 5000 row
5. Hover over **"Port Visibility"**
6. Select **"Public"**

### Option B: Using Command Palette
1. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. Type: **"Ports: Change Port Visibility"**
3. Select **port 5000** from the list
4. Choose **"Public"**

---

## 🌐 Step 2: Access Your Scanner

Once port 5000 is PUBLIC, you can access your scanner at:

### 🖥️ **Web Interface (Full UI)**
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/
```

**Click the link above or copy-paste it into your browser!**

This gives you a beautiful web interface where you can:
- Enter target IPs to scan
- Watch real-time progress
- View scan results in a table
- See all open ports and services

### 📡 **API Endpoints (For Testing)**

**Health Check:**
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/health
```

**Start a Scan (POST):**
```bash
curl -X POST https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/api/scans \
  -H "Content-Type: application/json" \
  -d '{"target": "127.0.0.1", "scan_type": "basic"}'
```

**Get Scan Results (GET):**
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/api/scans/3
```

**Check Scan Progress:**
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/api/scans/3/progress
```

---

## 🧪 Quick Test

### Test 1: Check Health
Open this in your browser:
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/health
```

**Expected Response:**
```json
{"status": "ok"}
```

### Test 2: Open Web Interface
Open this in your browser:
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/
```

You should see a beautiful purple interface with:
- 🔒 "Educational Vulnerability Scanner" header
- Input form for target IP
- Scan type dropdown
- "Start Scan" button

### Test 3: Run a Scan
1. In the web interface, enter: `127.0.0.1`
2. Select: "Basic (Top 1000 ports)"
3. Click "Start Scan"
4. Watch the progress bar
5. See results appear automatically!

---

## 🎯 What Can You Scan?

### ✅ Safe Targets (For Testing)
- `127.0.0.1` - Your Codespace itself
- `localhost` - Same as above
- Any IP you own or have permission to scan

### ⚠️ DO NOT Scan
- `github.com` or any GitHub infrastructure
- Public websites without permission
- Other people's servers
- Your company/school network without authorization

**Remember:** Unauthorized scanning is illegal!

---

## 🔍 Understanding the Results

When you scan `127.0.0.1`, you'll typically see:

**Example Results:**
```
Port 2000   | SSH  | OpenSSH 8.9p1 Ubuntu   | open
Port 2222   | SSH  | OpenSSH 8.2p1 Ubuntu   | open
Port 5000   | HTTP | Flask development      | open
```

**What this means:**
- **Port 2000/2222:** SSH servers for remote access
- **Port 5000:** Your vulnerability scanner API!

---

## 🛠️ Troubleshooting

### Issue: Port shows as "Private" or "Organization"
**Fix:** Change it to "Public" (see Step 1 above)

### Issue: 404 Error when accessing URL
**Cause:** Port is not public yet
**Fix:** Make port 5000 public in the Ports tab

### Issue: Connection Refused
**Check:**
1. Is the backend running? (You should see logs in terminal)
2. Is it on port 5000? (Check with `ss -tlnp | grep 5000`)
3. Try restarting: Stop backend (Ctrl+C) and run `python3 src/main.py` again

### Issue: Scan Fails with "Insufficient Privileges"
**This is normal in Codespaces!** We already set nmap capabilities.
If you see this, the backend needs to be restarted.

### Issue: Web interface doesn't load
**Fix:** 
1. Check backend logs for errors
2. Make sure port 5000 is public
3. Try accessing `/health` endpoint first to verify connectivity

---

## 📱 Sharing Your Scanner

Want to show it to someone? Just share the URL:
```
https://unearthly-monster-5vx4xpr7qgphvxwv-5000.app.github.dev/
```

**Notes:**
- They'll need the link (Codespace URLs are not guessable)
- Port must be PUBLIC for them to access it
- Codespace URLs expire when you stop the Codespace

---

## 🎨 Web Interface Features

The web interface includes:
- ✅ Clean, modern UI with gradient design
- ✅ Real-time progress tracking
- ✅ Automatic result display
- ✅ Color-coded severity badges
- ✅ Mobile-responsive design
- ✅ Error handling with helpful messages
- ✅ "Educational Use Only" warnings

---

## 🚀 Next Steps

1. **Make port public** (Step 1 above)
2. **Open the web interface** in your browser
3. **Run your first scan** on `127.0.0.1`
4. **Share your achievement!** Show it to your team

---

## 📞 Need Help?

**Backend Logs:**
Check the terminal where you ran `python3 src/main.py` for detailed logs.

**Stop Backend:**
Press `Ctrl+C` in the terminal, or run:
```bash
pkill -f "python3 src/main.py"
```

**Restart Backend:**
```bash
cd backend
python3 src/main.py
```

---

**Your scanner is ready to use! 🎉**

Remember: Always get permission before scanning any system!

