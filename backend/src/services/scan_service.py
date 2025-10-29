"""Scan service for network scanning operations."""
import threading
import time
from datetime import datetime
from typing import Optional
import nmap
from src.models.scan_session import ScanSession
from src.models.finding import Finding
from src.database import SessionLocal
from src.middleware.error_handler import AppError
from src.privilege_helper import check_nmap_privileges, get_privilege_instructions
from src.utils.nmap_parser import parse_nmap_xml, format_findings
from src.utils.logger import logger


class ScanService:
    """Service for network scanning operations."""
    
    def __init__(self):
        self.active_scans = {}
    
    def create_scan(self, target_id: int, scan_type: str = "basic") -> ScanSession:
        """
        Create a new scan session.
        
        Args:
            target_id: ID of target to scan
            scan_type: Type of scan (basic, full, custom)
            
        Returns:
            ScanSession object
        """
        db = SessionLocal()
        try:
            scan = ScanSession(
                target_id=target_id,
                status="pending",
                scan_type=scan_type
            )
            db.add(scan)
            db.commit()
            db.refresh(scan)
            
            logger.info(f"Created scan session {scan.id} for target {target_id}")
            return scan
        
        finally:
            db.close()
    
    def execute_scan(self, scan_id: int, target_address: str):
        """
        Execute scan in background thread.
        
        Args:
            scan_id: ID of scan session
            target_address: Target IP or hostname
        """
        thread = threading.Thread(
            target=self._run_scan,
            args=(scan_id, target_address),
            daemon=True
        )
        thread.start()
        logger.info(f"Started scan {scan_id} in background")
    
    def _run_scan(self, scan_id: int, target_address: str):
        """Run the actual scan (internal method)."""
        db = SessionLocal()
        
        try:
            # Check privileges
            has_privileges, priv_message = check_nmap_privileges()
            if not has_privileges:
                self._update_scan_status(
                    scan_id,
                    "failed",
                    error=f"Insufficient privileges: {priv_message}\n\n{get_privilege_instructions()}"
                )
                return
            
            # Update status to running
            self._update_scan_status(scan_id, "running", progress=0.0)
            
            # Initialize nmap scanner
            nm = nmap.PortScanner()
            
            # Run scan (basic: top 1000 ports with service detection)
            logger.info(f"Starting nmap scan of {target_address}")
            scan_args = "-sV -T4 --top-ports 1000"
            
            self._update_scan_status(scan_id, "running", progress=10.0)
            
            nm.scan(hosts=target_address, arguments=scan_args)
            
            self._update_scan_status(scan_id, "running", progress=70.0)
            
            # Parse results
            findings = []
            for host in nm.all_hosts():
                for proto in nm[host].all_protocols():
                    ports = nm[host][proto].keys()
                    for port in ports:
                        port_info = nm[host][proto][port]
                        
                        if port_info['state'] == 'open':
                            finding = Finding(
                                scan_session_id=scan_id,
                                port=port,
                                protocol=proto,
                                state=port_info['state'],
                                service=port_info.get('name', 'unknown'),
                                version=f"{port_info.get('product', '')} {port_info.get('version', '')}".strip() or None,
                                severity="info"  # Will be updated by severity classifier
                            )
                            findings.append(finding)
            
            self._update_scan_status(scan_id, "running", progress=90.0)
            
            # Save findings
            db = SessionLocal()
            try:
                for finding in findings:
                    db.add(finding)
                db.commit()
                logger.info(f"Saved {len(findings)} findings for scan {scan_id}")
            finally:
                db.close()
            
            # Complete scan
            self._update_scan_status(scan_id, "completed", progress=100.0)
            logger.info(f"Scan {scan_id} completed successfully")
        
        except Exception as e:
            logger.exception(f"Scan {scan_id} failed: {e}")
            self._update_scan_status(scan_id, "failed", error=str(e))
    
    def _update_scan_status(self, scan_id: int, status: str, progress: Optional[float] = None, error: Optional[str] = None):
        """Update scan status in database."""
        db = SessionLocal()
        try:
            scan = db.query(ScanSession).filter_by(id=scan_id).first()
            if scan:
                scan.status = status
                if progress is not None:
                    scan.progress = progress
                if error:
                    scan.error_message = error
                if status in ["completed", "failed"]:
                    scan.completed_at = datetime.utcnow()
                db.commit()
        finally:
            db.close()
    
    def get_scan(self, scan_id: int) -> ScanSession:
        """Get scan by ID."""
        db = SessionLocal()
        try:
            scan = db.query(ScanSession).filter_by(id=scan_id).first()
            if not scan:
                raise AppError(f"Scan not found: {scan_id}", 404)
            return scan
        finally:
            db.close()
    
    def get_scan_findings(self, scan_id: int) -> list:
        """Get all findings for a scan."""
        db = SessionLocal()
        try:
            findings = db.query(Finding).filter_by(scan_session_id=scan_id).all()
            return [f.to_dict() for f in findings]
        finally:
            db.close()
