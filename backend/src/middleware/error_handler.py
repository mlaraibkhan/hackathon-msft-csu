"""Error handling middleware."""
from flask import jsonify
from src.utils.logger import logger


class AppError(Exception):
    """Base application error."""
    
    def __init__(self, message: str, status_code: int = 400, payload=None):
        super().__init__()
        self.message = message
        self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        """Convert to dictionary."""
        rv = dict(self.payload or ())
        rv["error"] = self.message
        return rv


def handle_error(error):
    """Handle application errors."""
    if isinstance(error, AppError):
        logger.error(f"Application error: {error.message}")
        response = jsonify(error.to_dict())
        response.status_code = error.status_code
        return response
    
    logger.exception("Unhandled exception")
    response = jsonify({"error": "Internal server error"})
    response.status_code = 500
    return response


def register_error_handlers(app):
    """Register error handlers with Flask app."""
    app.register_error_handler(AppError, handle_error)
    app.register_error_handler(Exception, handle_error)
