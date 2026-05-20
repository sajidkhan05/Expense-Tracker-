from sqlalchemy import Column, Integer, String, Float, Date, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id          = Column(Integer, primary_key=True, index=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    amount      = Column(Float, nullable=False)
    date        = Column(Date, nullable=False)
    description = Column(String, nullable=False)
    category    = Column(String, nullable=False)
    is_flagged  = Column(Boolean, default=False)

    owner = relationship("User", backref="expenses")