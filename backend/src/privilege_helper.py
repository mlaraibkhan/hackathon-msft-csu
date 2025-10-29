"""Privilege helper for elevated network scanning operations."""
import os
import platform
import subprocess
import shutil
from src.utils.logger import logger


def is_running_with_privileges() -> bool:
    """Check if running with elevated privileges."""
    system = platform.system()
    
    if system == "Windows":
        try:
            import ctypes
            return ctypes.windll.shell32.IsUserAnAdmin() != 0
        except:
            return False
    else:  # Linux/macOS
        return os.geteuid() == 0


def get_nmap_path() -> str:
    """Get nmap executable path."""
    nmap_path = shutil.which("nmap")
    if not nmap_path:
        raise FileNotFoundError("nmap is not installed or not in PATH")
    return nmap_path


def check_nmap_privileges() -> tuple[bool, str]:
    """
    Check if nmap can run with required privileges.
    
    Returns:
        tuple: (has_privileges, message)
    """
    try:
        nmap_path = get_nmap_path()
    except FileNotFoundError as e:
        return False, str(e)
    
    system = platform.system()
    
    if system == "Linux":
        # Check for capabilities
        try:
            result = subprocess.run(
                ["getcap", nmap_path],
                capture_output=True,
                text=True,
                timeout=5
            )
            if "cap_net_raw" in result.stdout and "cap_net_admin" in result.stdout:
                return True, "nmap has required capabilities"
        except:
            pass
        
        # Check if running as root
        if is_running_with_privileges():
            return True, "Running with root privileges"
        
        return False, "nmap requires elevated privileges. Run with sudo or set capabilities."
    
    elif system == "Darwin":  # macOS
        if is_running_with_privileges():
            return True, "Running with root privileges"
        return False, "nmap requires elevated privileges. Run with sudo."
    
    elif system == "Windows":
        if is_running_with_privileges():
            return True, "Running with administrator privileges"
        return False, "nmap requires administrator privileges. Run as administrator."
    
    return False, f"Unsupported platform: {system}"


def get_privilege_instructions() -> str:
    """Get platform-specific privilege elevation instructions."""
    system = platform.system()
    
    if system == "Linux":
        return """
To grant nmap the required privileges on Linux:

Option 1: Use capabilities (recommended):
  sudo setcap cap_net_raw,cap_net_admin=eip $(which nmap)

Option 2: Run application with sudo:
  sudo python -m backend.src.app

Option 3: Run as root (not recommended for security)
"""
    
    elif system == "Darwin":
        return """
To run with required privileges on macOS:

Run the application with sudo:
  sudo python -m backend.src.app

Note: macOS does not support file capabilities like Linux.
"""
    
    elif system == "Windows":
        return """
To run with required privileges on Windows:

1. Right-click the application
2. Select "Run as Administrator"
3. Click "Yes" on the UAC prompt

Or run from an elevated command prompt/PowerShell.
"""
    
    return "Platform-specific instructions not available."


def setup_linux_capabilities():
    """Attempt to setup Linux capabilities for nmap."""
    if platform.system() != "Linux":
        return False, "Not a Linux system"
    
    try:
        nmap_path = get_nmap_path()
        result = subprocess.run(
            ["sudo", "setcap", "cap_net_raw,cap_net_admin=eip", nmap_path],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode == 0:
            logger.info("Successfully set nmap capabilities")
            return True, "Capabilities set successfully"
        else:
            return False, f"Failed to set capabilities: {result.stderr}"
    
    except Exception as e:
        logger.error(f"Error setting capabilities: {e}")
        return False, str(e)
