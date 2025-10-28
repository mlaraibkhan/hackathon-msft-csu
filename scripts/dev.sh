#!/bin/bash
# Development startup script

echo "🚀 Starting Educational Vulnerability Scanner..."
echo ""

# Check if nmap is installed
if ! command -v nmap &> /dev/null; then
    echo "⚠️  WARNING: nmap is not installed!"
    echo "Install nmap:"
    echo "  - Ubuntu/Debian: sudo apt-get install nmap"
    echo "  - macOS: brew install nmap"
    echo "  - Windows: Download from https://nmap.org/download.html"
    echo ""
fi

# Check privileges
if [ "$EUID" -ne 0 ]; then 
    echo "⚠️  NOT running with root privileges"
    echo "Some network scans may fail without elevated privileges."
    echo "To run with privileges: sudo ./scripts/dev.sh"
    echo ""
fi

# Start backend in background
echo "📡 Starting Python backend..."
cd backend
python3 src/main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to be ready..."
sleep 3

# Start frontend
echo "🎨 Starting Electron frontend..."
cd frontend
npm run dev

# Cleanup on exit
trap "echo 'Stopping backend...'; kill $BACKEND_PID" EXIT
