from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from app.database import get_db
from app.models.expense import Expense
from app.models.budget import Budget
from app.models.user import User
from app.utils.auth import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    today      = date.today()
    month_start = today.replace(day=1)

    # Total spent this month
    month_expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id,
            Expense.date >= month_start,
        )
        .all()
    )
    total_spent = sum(e.amount for e in month_expenses)

    # Spending by category
    by_category = {}
    for e in month_expenses:
        by_category[e.category] = by_category.get(e.category, 0) + e.amount

    # Daily spending last 30 days
    thirty_days_ago = today - timedelta(days=29)
    recent_expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == current_user.id,
            Expense.date >= thirty_days_ago,
        )
        .all()
    )
    daily_spending = {}
    for e in recent_expenses:
        day_str = str(e.date)
        daily_spending[day_str] = daily_spending.get(day_str, 0) + e.amount

    # Budget info
    budget = db.query(Budget).filter(Budget.user_id == current_user.id).first()
    monthly_limit    = budget.monthly_limit if budget else None
    budget_used_pct  = round((total_spent / monthly_limit) * 100, 1) if monthly_limit else None
    alert            = budget_used_pct is not None and budget_used_pct >= 80

    # Estimated month-end total
    days_passed  = today.day
    daily_avg    = total_spent / days_passed if days_passed > 0 else 0
    days_in_month = 30
    estimated_total = round(daily_avg * days_in_month, 2)

    return {
        "total_spent"      : round(total_spent, 2),
        "by_category"      : by_category,
        "daily_spending"   : daily_spending,
        "monthly_limit"    : monthly_limit,
        "budget_used_pct"  : budget_used_pct,
        "alert"            : alert,
        "estimated_total"  : estimated_total,
    }