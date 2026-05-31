# 💰 Expense Tracker with Smart Insighter

A full-stack web application for personal expense management with automatic categorisation, budget alerts, anomaly detection, and visual analytics. Built as an internship project at **MPOnline Limited**.

Project Demo Video Link: https://drive.google.com/file/d/1GXd5ZVXkJmfEHLAtJfuoUgNZwGcDRu1R/view?usp=sharing

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🏷️ **Auto Categorisation** | Automatically suggests expense categories using Python keyword matching |
| 📊 **Visual Analytics** | Pie chart, bar chart, and spending heatmap on the dashboard |
| 🚨 **Budget Alerts** | Warning when monthly spending reaches 80% of your set budget |
| 🔍 **Anomaly Detection** | Flags unusually high or duplicate expenses automatically |
| 🛡️ **Admin Panel** | Separate admin dashboard to monitor platform-wide usage and spending |
| 🔐 **Secure Auth** | JWT-based login with bcrypt password hashing |
| 👥 **Multi-user** | Multiple users can be logged in simultaneously on different browser tabs |

---

## 🛠️ Tech Stack

### Backend
- **Python 3.14** — Core language
- **FastAPI** — REST API framework
- **SQLAlchemy** — ORM for database access
- **PostgreSQL** — Primary database
- **JWT (python-jose)** — Authentication tokens
- **bcrypt (passlib)** — Password hashing

### Frontend
- **Next.js 16 (React)** — UI framework
- **Tailwind CSS** — Styling
- **Recharts** — Charts and visualisations
- **Axios** — HTTP client

### Tools
- **Git & GitHub** — Version control
- **Uvicorn** — ASGI server

---

## 📁 Project Structure

```
expense-tracker/
├── backend/
│   ├── .env                    # Environment variables
│   ├── venv/                   # Python virtual environment
│   └── app/
│       ├── main.py             # FastAPI entry point
│       ├── database.py         # Database connection
│       ├── models/
│       │   ├── user.py         # User table
│       │   ├── expense.py      # Expense table
│       │   └── budget.py       # Budget table
│       ├── routes/
│       │   ├── auth.py         # Register & login
│       │   ├── expenses.py     # Expense CRUD + categorisation
│       │   ├── budget.py       # Budget management
│       │   ├── dashboard.py    # Dashboard summary data
│       │   └── admin.py        # Admin panel routes
│       ├── schemas/
│       │   ├── user.py         # User request/response models
│       │   ├── expense.py      # Expense request/response models
│       │   └── budget.py       # Budget request/response models
│       └── utils/
│           ├── auth.py         # JWT + password hashing
│           ├── categoriser.py  # Keyword-based categorisation
│           └── anomaly.py      # Anomaly detection logic
│
├── frontend/
│   ├── app/
│   │   ├── page.js             # Home / landing page
│   │   ├── layout.js           # Root layout
│   │   ├── globals.css         # Global styles
│   │   ├── login/page.js       # Login page
│   │   ├── register/page.js    # Register page
│   │   ├── dashboard/page.js   # Main dashboard
│   │   ├── expenses/page.js    # Expense list + add/edit
│   │   ├── budget/page.js      # Budget setting
│   │   └── admin/
│   │       ├── page.js         # Admin login
│   │       └── dashboard/page.js # Admin dashboard
│   ├── components/
│   │   └── Navbar.js           # Navigation bar
│   └── lib/
│       └── api.js              # Axios API client
│
└── .gitignore
```

---

## ⚙️ Setup & Installation

### Prerequisites

Make sure you have these installed:

| Tool | Check Command | Required Version |
|---|---|---|
| Python | `python --version` | 3.10+ |
| Node.js | `node --version` | 18+ |
| npm | `npm --version` | 9+ |
| PostgreSQL | `psql --version` | 14+ |
| Git | `git --version` | Any |

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/sajidkhan05/Expense-Tracker-.git
cd expense-tracker
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows (Command Prompt)
venv\Scripts\activate

# Mac / Linux
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy alembic psycopg2-binary \
  python-jose[cryptography] passlib[bcrypt] python-multipart \
  python-dotenv "pydantic[email]" bcrypt==4.0.1
```

---

### Step 3 — Configure Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/expense_tracker
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@mponline2025
```

> Replace `YOUR_PASSWORD` with your PostgreSQL password.

---

### Step 4 — Create the Database

```bash
psql -U postgres
```

```sql
CREATE DATABASE expense_tracker;
\q
```

---

### Step 5 — Start the Backend Server

```bash
cd backend
venv\Scripts\activate      # Windows
uvicorn app.main:app --reload
```

Backend runs at → **http://127.0.0.1:8000**  
API docs available at → **http://127.0.0.1:8000/docs**

---

### Step 6 — Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at → **http://localhost:3000**

---

## 🖥️ Usage

### User Flow
1. Go to `http://localhost:3000`
2. Click **Create Account** to register
3. Login with your credentials
4. Add expenses — categories are suggested automatically
5. Set your monthly budget under the **Budget** page
6. View your spending charts on the **Dashboard**
7. Flagged expenses will show a ⚠️ warning icon

### Admin Flow
1. Go to `http://localhost:3000/admin`
2. Login with admin credentials:
   - Username: `admin`
   - Password: `admin@mponline2025`
3. View platform-wide stats, user list, category breakdown, and trends

---

## 📊 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and get JWT token |

### Expenses
| Method | Endpoint | Description |
|---|---|---|
| GET | `/expenses/` | Get all expenses |
| POST | `/expenses/` | Add a new expense |
| PUT | `/expenses/{id}` | Edit an expense |
| DELETE | `/expenses/{id}` | Delete an expense |
| GET | `/expenses/suggest-category` | Get category suggestion |

### Budget & Dashboard
| Method | Endpoint | Description |
|---|---|---|
| GET | `/budget/` | Get current budget |
| POST | `/budget/` | Set or update budget |
| GET | `/dashboard/summary` | Get all dashboard data |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| POST | `/admin/login` | Admin login |
| GET | `/admin/stats` | Platform overview stats |
| GET | `/admin/users` | All users with spending data |
| GET | `/admin/category-breakdown` | Spending by category |
| GET | `/admin/monthly-trend` | Monthly spending trend |
| GET | `/admin/top-spenders` | Top 5 spenders |

---

## 🗄️ Database Schema

```
users
  id, name, email, password_hash, created_at

expenses
  id, user_id, amount, date, description, category, is_flagged

categories
  id, name

budgets
  id, user_id, monthly_limit
```

---

## 🔒 Security

- Passwords are hashed using **bcrypt** before storing
- Authentication uses **JWT tokens** with 60-minute expiry
- Each user can only access their own data
- Sessions are stored in **sessionStorage** (tab-isolated)
- Admin credentials are stored in `.env` (never in code)

---

## ⚠️ Known Limitations

- Expenses must be entered manually — no bank integration
- Categorisation uses keyword matching and may occasionally be inaccurate
- Anomaly detection is rule-based, not statistical
- Web application only — no mobile app
- Single user per account — no shared accounts

---

## 🔮 Future Improvements

- [ ] Bank / UPI integration for automatic transaction import
- [ ] React Native mobile app
- [ ] Email notifications for budget alerts
- [ ] CSV export for expense reports
- [ ] Recurring expense tracking
- [ ] Multi-user / family accounts

---

## 👨‍💻 Author

**Sajid Khan**  
Internship Project — MPOnline Limited  
Built with Python · FastAPI · Next.js · PostgreSQL

---

## 📄 License

This project was built as part of an internship programme at MPOnline Limited.  
For educational and demonstration purposes only.
