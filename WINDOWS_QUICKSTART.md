# 🚀 Quick Start Guide for Windows 11

## Prerequisites Checklist
Before starting, make sure you have:
- [ ] Python 3.11+ installed (with "Add to PATH" checked)
- [ ] Node.js 18+ installed
- [ ] Nmap installed from https://nmap.org/download.html
- [ ] Administrator access to your computer

## Step-by-Step Instructions

### 1️⃣ Verify Prerequisites

Open PowerShell and run:
```powershell
python --version
node --version
nmap --version
```

All should return version numbers. If any fail, install the missing software.

### 2️⃣ Install Dependencies

```powershell
# Install Python dependencies
cd backend
pip install -r requirements.txt
cd ..

# Install Node dependencies (this takes 2-3 minutes)
cd frontend
npm install
cd ..
```

### 3️⃣ Start the Application

**IMPORTANT:** You need TWO windows - one for backend, one for frontend.

#### Window 1 - Backend (Administrator)
1. Right-click PowerShell → "Run as Administrator"
2. Navigate to project:
   ```powershell
   cd C:\path\to\hackathon-msft-csu
   ```
3. Double-click: `start-backend-windows.bat`
   
   OR manually run:
   ```powershell
   cd backend
   python src/main.py
   ```

Wait for message: `Running on http://127.0.0.1:5000`

#### Window 2 - Frontend (Normal)
1. Open regular PowerShell (no admin needed)
2. Navigate to project:
   ```powershell
   cd C:\path\to\hackathon-msft-csu
   ```
3. Double-click: `start-frontend-windows.bat`
   
   OR manually run:
   ```powershell
   cd frontend
   npm run dev
   ```

The Electron app window should open automatically!

### 4️⃣ Test the Scanner

1. In the app, enter: `127.0.0.1` (your local machine)
2. Select: "Basic (Top 1000 ports)"
3. Click: "Start Scan"
4. Watch the progress bar
5. View results when complete!

## 🎯 Safe Targets for Testing

✅ **Safe to scan:**
- `127.0.0.1` - Your own computer
- `localhost` - Same as above
- `192.168.1.1` - Your home router
- Your own devices on your home network

⚠️ **DO NOT scan:**
- Work/school networks without permission
- Your ISP's equipment
- Any public IP addresses
- Other people's networks

## 🐛 Troubleshooting

### "nmap: command not found"
**Fix:** Add Nmap to Windows PATH
1. Search Windows for "Environment Variables"
2. Click "Environment Variables" button
3. Under "System variables", find and edit "Path"
4. Click "New" and add: `C:\Program Files (x86)\Nmap`
5. Click OK and restart PowerShell

### "Access Denied" or "Insufficient Privileges"
**Fix:** Run backend as Administrator
- Right-click PowerShell → "Run as Administrator"
- Or right-click `start-backend-windows.bat` → "Run as Administrator"

### "Port 5000 already in use"
**Fix:** Kill the process using port 5000
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

### Frontend shows "Backend not available"
**Fix:** Make sure backend started successfully
1. Check Window 1 - should show Flask running on 127.0.0.1:5000
2. Try accessing http://127.0.0.1:5000/health in a browser
3. Should return: `{"status": "ok"}`

### Scans are very slow or timing out
**Fix:** 
1. Use smaller IP ranges (e.g., single IP instead of /24)
2. Use "Basic" scan type (not "Full")
3. Add nmap.exe to Windows Defender exclusions:
   - Windows Security → Virus & threat protection
   - Manage settings → Add exclusion
   - Add file: `C:\Program Files (x86)\Nmap\nmap.exe`

## 📞 Need More Help?

Check the full documentation:
- [PROJECT_README.md](PROJECT_README.md) - Complete guide
- [docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md) - Feature status
- [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) - Technical details

---

**Ready to learn about network security? Let's go! 🚀**
