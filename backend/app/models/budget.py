from sqlalchemy import Column, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Budget(Base):
    __tablename__ = "budgets"

    id            = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    monthly_limit = Column(Float, nullable=False)

    owner = relationship("User", backref="budget")