from pydantic import BaseModel

class BudgetCreate(BaseModel):
    monthly_limit: float

class BudgetOut(BaseModel):
    id: int
    monthly_limit: float

    class Config:
        from_attributes = True