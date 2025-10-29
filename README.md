# Educational Vulnerability Scanner

🔒 A desktop application for learning about network security through hands-on vulnerability scanning.

**⚠️ For Educational Use Only**

---

## 🚀 Quick Start for Windows 11

**New to the project? Start here:** 👉 **[WINDOWS_QUICKSTART.md](WINDOWS_QUICKSTART.md)** 👈

**Full documentation:** [PROJECT_README.md](PROJECT_README.md)

### Super Quick Setup

1. **Install prerequisites:**
   - Python 3.11+: https://www.python.org/downloads/
   - Node.js 18+: https://nodejs.org/
   - Nmap: https://nmap.org/download.html

2. **Install dependencies:**
   ```powershell
   cd backend && pip install -r requirements.txt
   cd ..\frontend && npm install
   ```

3. **Run the app:**
   - Double-click `start-backend-windows.bat` (as Administrator)
   - Double-click `start-frontend-windows.bat` (normal)

That's it! The app will open automatically.

---

## 🎯 Project Overview

This is an Electron-based desktop application that helps students and security enthusiasts learn about network vulnerabilities through interactive scanning and AI-powered explanations.

### Current Status: MVP Complete ✅

The application can:
- ✅ Scan network targets (IP addresses/hostnames)
- ✅ Detect open ports and running services
- ✅ Display scan results in real-time
- ✅ Show service versions and basic information
- ✅ Handle privilege requirements for network scanning

See [docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md) for detailed implementation status.

---

## 📚 Documentation

- **[PROJECT_README.md](PROJECT_README.md)** - Complete guide with features, architecture, and troubleshooting
- **[WINDOWS_QUICKSTART.md](WINDOWS_QUICKSTART.md)** - Fast setup guide for Windows 11
- **[docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md)** - Implementation summary
- **[docs/IMPLEMENTATION_STATUS.md](docs/IMPLEMENTATION_STATUS.md)** - Detailed task checklist

---

## 🔧 For Developers

### Manual Start (Linux/macOS)
```bash
# Terminal 1:
cd backend && python3 src/main.py

# Terminal 2:
cd frontend && npm run dev
```

### Manual Start (Windows)
```powershell
# Terminal 1 (as Administrator):
cd backend
python src/main.py

# Terminal 2:
cd frontend
npm run dev
```

---

## ⚖️ Legal Notice

**🚨 AUTHORIZED USE ONLY**

This tool is for educational purposes only. Only scan systems you own or have explicit written permission to test. Unauthorized port scanning may be illegal in your jurisdiction.

---

## 📚 AI Tools Setup

This Codespace Repo comes with some great AI Tools pre-installed.

First, make sure to open the repo in a Codespace:

<img width="480" height="201" alt="image" src="https://github.com/user-attachments/assets/3368867b-eb88-4c29-9ade-641b3c2d9ec3" />


## GitHub Spec Kit

Before coding a bunch with AI, it is important to first spec out what you want to build.
GitHub Spec Kit helps with this and is available in the terminal.

First set up Spec Kit with `specify init .` in a terminal.

Then, you can open Copilot Chat.

## Copilot Chat

Copilot Chat can be acccessed by toggling the chat. If you are unfamiliar with AI coding, this is a great starting point.

<img width="565" height="66" alt="image" src="https://github.com/user-attachments/assets/39887cd7-704a-4d34-83f7-92acd7b1ccd7" />

Make sure the chat is in "Agent" mode:

<img width="688" height="145" alt="image" src="https://github.com/user-attachments/assets/12c4adfb-ab87-4345-ae76-25976bfaec31" />

I generally recommend using Claude Sonnet 4.5 or GPT-5 Codex.

## Using Spec Kit & Chat Together

If you initialized Spec Kit properly, you can now run various slash commands inside of Copilot:

<img width="709" height="325" alt="image" src="https://github.com/user-attachments/assets/2932b142-41be-4d98-9b72-9bf4cbc506fc" />

Execute these prompts in order with your project idea:

1. Create the spec
Use the `/speckit.specify` command to describe what you want to build. Focus on the what and why, not the tech stack.

`/speckit.specify` Build an application that can help me organize my photos in separate photo albums. Albums are grouped by date and can be re-organized by dragging and dropping on the main page. Albums are never in other nested albums. Within each album, photos are previewed in a tile-like interface.

2. Create a technical implementation plan
Use the `/speckit.plan` command to provide your tech stack and architecture choices.

`/speckit.plan` The application uses Vite with minimal number of libraries. Use vanilla HTML, CSS, and JavaScript as much as possible. Images are not uploaded anywhere and metadata is stored in a local SQLite database.

3. Break down into tasks
Use `/speckit.tasks` to create an actionable task list from your implementation plan.

4. Implement

Use `/speckit.implement` to execute all tasks and build your feature according to the plan.

5. Iterate!

You can continue iterating on your project with Copilot Chat or Copilot CLI:

## Copilot CLI

This is my favorite way to do AI Coding because it has so much potential as a terminal tool.
You can open the CLI by typing `copilot` in a terminal, and even run multiple sessions at once!
To run Copilot and auto-approve all tools, you can run `copilot --allow-all-tools`.
Note that this can be quite dangerous as you allow the AI to run everything it wants autonomously.
If you are in a Codespace, this is relatively safe.

## Context7 MCP Server

To get you used to working with MCP servers, which extend AI coding agents, the Context7 MCP server is pre-installed.
This allows you to make the AI model aware of latest documentation. You can explicitly call it by asking something like `use context7 to find the latest Azure Functions documentation`.

### Troubleshooting

If you are running into GitHub Auth issues, it may be necessary to log in with `gh auth login`.
