from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models.expense import Expense
from app.models.user import User
from app.schemas.expense import ExpenseCreate, ExpenseUpdate, ExpenseOut
from app.utils.auth import get_current_user
from app.utils.categoriser import suggest_category
from app.utils.anomaly import check_anomaly

router = APIRouter(prefix="/expenses", tags=["Expenses"])

@router.post("/", response_model=ExpenseOut)
def add_expense(
    expense: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    is_flagged = check_anomaly(
        db       = db,
        user_id  = current_user.id,
        amount   = expense.amount,
        category = expense.category,
        date     = expense.date,
    )
    new_expense = Expense(
        user_id     = current_user.id,
        amount      = expense.amount,
        date        = expense.date,
        description = expense.description,
        category    = expense.category,
        is_flagged  = is_flagged,
    )
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)
    return new_expense

@router.get("/", response_model=List[ExpenseOut])
def get_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
        .all()
    )

@router.put("/{expense_id}", response_model=ExpenseOut)
def update_expense(
    expense_id: int,
    updated: ExpenseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id,
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.amount      = updated.amount
    expense.date        = updated.date
    expense.description = updated.description
    expense.category    = updated.category
    expense.is_flagged  = check_anomaly(
        db       = db,
        user_id  = current_user.id,
        amount   = updated.amount,
        category = updated.category,
        date     = updated.date,
    )
    db.commit()
    db.refresh(expense)
    return expense

@router.delete("/{expense_id}")
def delete_expense(
    expense_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = db.query(Expense).filter(
        Expense.id == expense_id,
        Expense.user_id == current_user.id,
    ).first()
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()
    return {"message": "Expense deleted successfully"}

@router.get("/suggest-category")
def get_suggested_category(description: str):
    return {"category": suggest_category(description)}