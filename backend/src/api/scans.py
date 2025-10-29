"""Scans API endpoints."""
from flask import Blueprint, request, jsonify
from src.services.scan_service import ScanService
from src.services.target_service import TargetService
from src.middleware.error_handler import AppError
from src.utils.logger import logger

scans_bp = Blueprint("scans", __name__)
scan_service = ScanService()
target_service = TargetService()


@scans_bp.route("", methods=["POST"])
def create_scan():
    """
    Create and start a new scan.
    
    Request body:
        {
            "target": "192.168.1.1",
            "scan_type": "basic"  # optional
        }
    """
    data = request.get_json()
    
    if not data or "target" not in data:
        raise AppError("Missing required field: target", 400)
    
    target_address = data["target"]
    scan_type = data.get("scan_type", "basic")
    
    # Validate target
    validation = target_service.validate_target_address(target_address)
    if not validation["valid"]:
        raise AppError(f"Invalid target address: {target_address}", 400)
    
    # Create target
    target = target_service.create_target(target_address)
    
    # Create scan
    scan = scan_service.create_scan(target.id, scan_type)
    
    # Start scan in background
    scan_service.execute_scan(scan.id, target.address)
    
    logger.info(f"Started scan {scan.id} for target {target.address}")
    
    return jsonify({
        "scan_id": scan.id,
        "target": target.to_dict(),
        "status": scan.status,
        "warning": validation.get("warning")
    }), 201


@scans_bp.route("/<int:scan_id>", methods=["GET"])
def get_scan(scan_id):
    """Get scan details."""
    scan = scan_service.get_scan(scan_id)
    
    response = scan.to_dict()
    response["findings"] = scan_service.get_scan_findings(scan_id)
    
    return jsonify(response)


@scans_bp.route("/<int:scan_id>/progress", methods=["GET"])
def get_scan_progress(scan_id):
    """Get scan progress."""
    scan = scan_service.get_scan(scan_id)
    
    return jsonify({
        "scan_id": scan.id,
        "status": scan.status,
        "progress": scan.progress,
        "error_message": scan.error_message
    })


@scans_bp.route("", methods=["GET"])
def list_scans():
    """List all scans."""
    from src.database import SessionLocal
    from src.models.scan_session import ScanSession
    
    db = SessionLocal()
    try:
        scans = db.query(ScanSession).order_by(ScanSession.started_at.desc()).limit(50).all()
        return jsonify([scan.to_dict() for scan in scans])
    finally:
        db.close()
