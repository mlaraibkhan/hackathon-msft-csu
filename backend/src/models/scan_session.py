"""ScanSession model for tracking scan operations."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Float, Text
from sqlalchemy.orm import relationship
from src.database import Base


class ScanSession(Base):
    """Represents a scan session."""
    
    __tablename__ = "scan_sessions"

    id = Column(Integer, primary_key=True, index=True)
    target_id = Column(Integer, ForeignKey("targets.id"), nullable=False)
    status = Column(String, default="pending")  # pending, running, completed, failed
    progress = Column(Float, default=0.0)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)
    scan_type = Column(String, default="basic")  # basic, full, custom
    scan_args = Column(Text, nullable=True)
    
    target = relationship("Target", backref="scan_sessions")
    findings = relationship("Finding", back_populates="scan_session", cascade="all, delete-orphan")

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "target_id": self.target_id,
            "status": self.status,
            "progress": self.progress,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "completed_at": self.completed_at.isoformat() if self.completed_at else None,
            "error_message": self.error_message,
            "scan_type": self.scan_type,
        }
