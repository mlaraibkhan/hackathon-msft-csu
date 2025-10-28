"""Findings API endpoints."""
from flask import Blueprint, jsonify
from src.database import SessionLocal
from src.models.finding import Finding
from src.middleware.error_handler import AppError

findings_bp = Blueprint("findings", __name__)


@findings_bp.route("/<int:finding_id>", methods=["GET"])
def get_finding(finding_id):
    """Get finding details."""
    db = SessionLocal()
    try:
        finding = db.query(Finding).filter_by(id=finding_id).first()
        if not finding:
            raise AppError(f"Finding not found: {finding_id}", 404)
        
        return jsonify(finding.to_dict())
    finally:
        db.close()


@findings_bp.route("/<int:finding_id>/analyze", methods=["POST"])
def analyze_finding(finding_id):
    """
    Generate AI analysis for a finding.
    
    This endpoint will be implemented in Phase 4 (User Story 2).
    """
    raise AppError("AI analysis not yet implemented", 501)
