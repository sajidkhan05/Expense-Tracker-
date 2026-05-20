from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.budget import Budget
from app.models.user import User
from app.schemas.budget import BudgetCreate, BudgetOut
from app.utils.auth import get_current_user

router = APIRouter(prefix="/budget", tags=["Budget"])

@router.post("/", response_model=BudgetOut)
def set_budget(
    budget: BudgetCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if existing:
        existing.monthly_limit = budget.monthly_limit
        db.commit()
        db.refresh(existing)
        return existing

    new_budget = Budget(user_id=current_user.id, monthly_limit=budget.monthly_limit)
    db.add(new_budget)
    db.commit()
    db.refresh(new_budget)
    return new_budget

@router.get("/", response_model=BudgetOut)
def get_budget(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    if not budget:
        raise HTTPException(status_code=404, detail="No budget set yet")
    return budget