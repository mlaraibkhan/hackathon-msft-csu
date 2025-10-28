"""Finding model for scan results."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from src.database import Base


class Finding(Base):
    """Represents a scan finding (open port, service, etc)."""
    
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_session_id = Column(Integer, ForeignKey("scan_sessions.id"), nullable=False)
    port = Column(Integer, nullable=False)
    protocol = Column(String, default="tcp")
    state = Column(String, nullable=False)  # open, closed, filtered
    service = Column(String, nullable=True)
    version = Column(String, nullable=True)
    severity = Column(String, default="info")  # critical, high, medium, low, info
    raw_output = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scan_session = relationship("ScanSession", back_populates="findings")
    ai_analysis = relationship("AIAnalysis", back_populates="finding", uselist=False, cascade="all, delete-orphan")

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "scan_session_id": self.scan_session_id,
            "port": self.port,
            "protocol": self.protocol,
            "state": self.state,
            "service": self.service,
            "version": self.version,
            "severity": self.severity,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
