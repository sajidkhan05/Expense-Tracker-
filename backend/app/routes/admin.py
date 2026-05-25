from fastapi import APIRouter, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import Depends
from app.database import get_db
from app.models.user import User
from app.models.expense import Expense
from app.models.budget import Budget
from jose import jwt
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

SECRET_KEY            = os.getenv("SECRET_KEY")
ALGORITHM             = os.getenv("ALGORITHM")
ADMIN_USERNAME        = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD        = os.getenv("ADMIN_PASSWORD")

router = APIRouter(prefix="/admin", tags=["Admin"])

# ── Admin Login ───────────────────────────────────────────────
@router.post("/login")
def admin_login(credentials: dict):
    username = credentials.get("username")
    password = credentials.get("password")

    if username != ADMIN_USERNAME or password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")

    token = jwt.encode(
        {"sub": "admin", "exp": datetime.utcnow() + timedelta(hours=8)},
        SECRET_KEY, algorithm=ALGORITHM
    )
    return {"access_token": token, "token_type": "bearer"}

# ── Verify Admin Token ────────────────────────────────────────
def verify_admin(authorization: str = Header(...)):
    try:
        scheme, token = authorization.split()
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("sub") != "admin":
            raise HTTPException(status_code=403, detail="Not authorized")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

# ── Overview Stats ────────────────────────────────────────────
@router.get("/stats")
def get_stats(db: Session = Depends(get_db), _=Depends(verify_admin)):
    total_users    = db.query(func.count(User.id)).scalar()
    total_expenses = db.query(func.count(Expense.id)).scalar()
    total_spending = db.query(func.sum(Expense.amount)).scalar() or 0
    total_budgets  = db.query(func.count(Budget.id)).scalar()

    return {
        "total_users"    : total_users,
        "total_expenses" : total_expenses,
        "total_spending" : round(total_spending, 2),
        "total_budgets"  : total_budgets,
    }

# ── Spending by Category ──────────────────────────────────────
@router.get("/category-breakdown")
def get_category_breakdown(db: Session = Depends(get_db), _=Depends(verify_admin)):
    results = (
        db.query(Expense.category, func.sum(Expense.amount), func.count(Expense.id))
        .group_by(Expense.category)
        .order_by(func.sum(Expense.amount).desc())
        .all()
    )
    return [
        {"category": r[0], "total_amount": round(r[1], 2), "expense_count": r[2]}
        for r in results
    ]

# ── All Users with Stats ──────────────────────────────────────
@router.get("/users")
def get_all_users(db: Session = Depends(get_db), _=Depends(verify_admin)):
    users = db.query(User).all()
    result = []
    for user in users:
        expenses     = db.query(Expense).filter(Expense.user_id == user.id).all()
        total_spent  = sum(e.amount for e in expenses)
        budget       = db.query(Budget).filter(Budget.user_id == user.id).first()
        flagged      = sum(1 for e in expenses if e.is_flagged)

        result.append({
            "id"            : user.id,
            "name"          : user.name,
            "email"         : user.email,
            "joined"        : str(user.created_at)[:10],
            "total_expenses": len(expenses),
            "total_spent"   : round(total_spent, 2),
            "budget_set"    : budget.monthly_limit if budget else None,
            "flagged_count" : flagged,
        })
    return result

# ── Monthly Spending Trend (platform-wide) ───────────────────
@router.get("/monthly-trend")
def get_monthly_trend(db: Session = Depends(get_db), _=Depends(verify_admin)):
    results = (
        db.query(
            func.to_char(Expense.date, 'YYYY-MM').label("month"),
            func.sum(Expense.amount).label("total")
        )
        .group_by("month")
        .order_by("month")
        .all()
    )
    return [{"month": r[0], "total": round(r[1], 2)} for r in results]

# ── Top Spenders ──────────────────────────────────────────────
@router.get("/top-spenders")
def get_top_spenders(db: Session = Depends(get_db), _=Depends(verify_admin)):
    results = (
        db.query(
            User.name,
            User.email,
            func.sum(Expense.amount).label("total"),
            func.count(Expense.id).label("count")
        )
        .join(Expense, Expense.user_id == User.id)
        .group_by(User.id, User.name, User.email)
        .order_by(func.sum(Expense.amount).desc())
        .limit(5)
        .all()
    )
    return [
        {"name": r[0], "email": r[1], "total_spent": round(r[2], 2), "expense_count": r[3]}
        for r in results
    ]