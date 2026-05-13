# 💰 Expense Tracker

A full stack web application to track personal income and expenses with real-time charts and analytics.

## 📸 Screenshots
![Dashboard](screenshots/dashboard.png)

## ✨ Features
- User registration and login with JWT authentication
- Add, view, and delete income and expense transactions
- Real-time balance calculation (Income - Expenses)
- Interactive bar chart — Income vs Expenses
- Pie chart — Spending breakdown by category
- Filter transactions by category and type
- Fully responsive design

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Recharts (data visualization)
- React Router DOM
- Axios

**Backend:**
- Python
- FastAPI
- SQLAlchemy ORM
- JWT Authentication (python-jose)
- Passlib + Bcrypt (password hashing)

**Database:**
- SQLite (local)

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi uvicorn sqlalchemy python-jose passlib bcrypt python-multipart
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Open the app
Go to `http://localhost:5173` in your browser.

## 📁 Project Structure
expense-tracker/
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── routes/
│       ├── auth.py
│       └── transactions.py
├── frontend/
│   └── src/
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   └── Dashboard.jsx
│       └── api/
│           └── axios.js
└── README.md

## 👩‍💻 Author
Paakhi Kataria 
- GitHub: [@PaakhiKataria](https://github.com/PaakhiKataria)