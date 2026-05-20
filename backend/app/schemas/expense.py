from pydantic import BaseModel
from datetime import date

class ExpenseCreate(BaseModel):
    amount: float
    date: date
    description: str
    category: str

class ExpenseUpdate(BaseModel):
    amount: float
    date: date
    description: str
    category: str

class ExpenseOut(BaseModel):
    id: int
    amount: float
    date: date
    description: str
    category: str
    is_flagged: bool

    class Config:
        from_attributes = True