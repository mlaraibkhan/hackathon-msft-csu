"""Target service for managing scan targets."""
from src.models.target import Target
from src.utils.validators import validate_target
from src.database import SessionLocal
from src.middleware.error_handler import AppError
from src.utils.logger import logger


class TargetService:
    """Service for managing scan targets."""
    
    @staticmethod
    def create_target(address: str) -> Target:
        """
        Create a new target.
        
        Args:
            address: IP address or hostname
            
        Returns:
            Target object
            
        Raises:
            AppError: If target is invalid
        """
        is_valid, normalized_address, is_private = validate_target(address)
        
        if not is_valid:
            raise AppError(f"Invalid target address: {address}", 400)
        
        db = SessionLocal()
        try:
            # Check if target already exists
            existing = db.query(Target).filter_by(address=normalized_address).first()
            if existing:
                logger.info(f"Target already exists: {normalized_address}")
                return existing
            
            # Create new target
            target = Target(
                address=normalized_address,
                is_rfc1918=is_private
            )
            db.add(target)
            db.commit()
            db.refresh(target)
            
            logger.info(f"Created target: {normalized_address} (RFC1918: {is_private})")
            return target
        
        finally:
            db.close()
    
    @staticmethod
    def get_target(target_id: int) -> Target:
        """Get target by ID."""
        db = SessionLocal()
        try:
            target = db.query(Target).filter_by(id=target_id).first()
            if not target:
                raise AppError(f"Target not found: {target_id}", 404)
            return target
        finally:
            db.close()
    
    @staticmethod
    def validate_target_address(address: str) -> dict:
        """
        Validate target address and return info.
        
        Returns:
            dict with validation results
        """
        is_valid, normalized_address, is_private = validate_target(address)
        
        return {
            "valid": is_valid,
            "address": normalized_address,
            "is_private": is_private,
            "warning": "Scanning external/public IPs may be illegal without authorization" if not is_private and is_valid else None
        }
