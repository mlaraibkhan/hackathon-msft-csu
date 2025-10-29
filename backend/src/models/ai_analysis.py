"""AIAnalysis model for AI-generated explanations."""
from datetime import datetime
from sqlalchemy import Column, Integer, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from src.database import Base


class AIAnalysis(Base):
    """Represents AI-generated analysis for a finding."""
    
    __tablename__ = "ai_analyses"

    id = Column(Integer, primary_key=True, index=True)
    finding_id = Column(Integer, ForeignKey("findings.id"), nullable=False, unique=True)
    explanation = Column(Text, nullable=False)
    security_implications = Column(Text, nullable=True)
    remediation_steps = Column(Text, nullable=True)
    learning_resources = Column(Text, nullable=True)  # JSON string
    exploit_information = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    finding = relationship("Finding", back_populates="ai_analysis")

    def to_dict(self):
        """Convert to dictionary."""
        return {
            "id": self.id,
            "finding_id": self.finding_id,
            "explanation": self.explanation,
            "security_implications": self.security_implications,
            "remediation_steps": self.remediation_steps,
            "learning_resources": self.learning_resources,
            "exploit_information": self.exploit_information,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
