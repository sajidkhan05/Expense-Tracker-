from sqlalchemy.orm import Session
from app.models.expense import Expense

def check_anomaly(
    db: Session,
    user_id: int,
    amount: float,
    category: str,
    date,
) -> bool:

    past_expenses = (
        db.query(Expense)
        .filter(
            Expense.user_id == user_id,
            Expense.category == category,
        )
        .all()
    )

    # Check duplicate: same amount + same category + same date
    for exp in past_expenses:
        if exp.amount == amount and exp.date == date:
            return True

    # Check unusual amount: more than 2x the average
    if len(past_expenses) >= 3:
        total   = sum(e.amount for e in past_expenses)
        average = total / len(past_expenses)
        if amount > average * 2:
            return True

    return False