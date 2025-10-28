"""Target model for scan targets."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from src.database import Base


class Target(Base):
    """Represents a scan target (IP address or hostname)."""
    
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, nullable=False, index=True)
    hostname = Column(String, nullable=True)
    is_rfc1918 = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "address": self.address,
            "hostname": self.hostname,
            "is_rfc1918": self.is_rfc1918,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
