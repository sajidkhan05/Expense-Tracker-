from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.routes import auth, expenses, budget, dashboard
import app.models.user
import app.models.expense
import app.models.budget

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(expenses.router)
app.include_router(budget.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Expense Tracker API is running"}