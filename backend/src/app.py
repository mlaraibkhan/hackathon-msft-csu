"""Flask application factory."""
import os
from flask import Flask
from flask_cors import CORS
from src.database import init_db
from src.middleware.error_handler import register_error_handlers
from src.utils.logger import logger


def create_app(config=None):
    """Create and configure Flask application."""
    app = Flask(__name__, static_folder='../static', static_url_path='/static')
    
    # Configuration
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-key-change-in-production")
    app.config["JSON_SORT_KEYS"] = False
    
    # Enable CORS for Electron frontend
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Force localhost-only binding for security
    app.config["HOST"] = "127.0.0.1"
    app.config["PORT"] = int(os.getenv("PORT", "5000"))
    
    # Initialize database
    init_db()
    logger.info("Database initialized")
    
    # Register error handlers
    register_error_handlers(app)
    
    # Register blueprints
    from src.api.scans import scans_bp
    from src.api.findings import findings_bp
    
    app.register_blueprint(scans_bp, url_prefix="/api/scans")
    app.register_blueprint(findings_bp, url_prefix="/api/findings")
    
    @app.route("/health")
    def health():
        return {"status": "ok"}
    
    @app.route("/")
    def index():
        """Serve the new CyberScope dashboard."""
        from flask import send_from_directory
        return send_from_directory(app.static_folder, 'index.html')
    
    logger.info("Application created successfully")
    return app


def run_app():
    """Run the Flask application."""
    app = create_app()
    host = app.config["HOST"]
    port = app.config["PORT"]
    
    logger.info(f"Starting server on {host}:{port}")
    logger.warning("Server bound to localhost only for security")
    
    app.run(host=host, port=port, debug=os.getenv("FLASK_ENV") == "development")


if __name__ == "__main__":
    run_app()
