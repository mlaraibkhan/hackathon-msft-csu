"""Main entry point for the backend application."""
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.app import run_app

if __name__ == "__main__":
    run_app()
