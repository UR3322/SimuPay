# SimuPay — Payment Simulation Application

![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

A full-stack MERN application for simulating peer-to-peer payment transfers
with virtual money. Every new account starts with a **$500 demo balance**.
Transfers carry a **2% simulation fee** and are recorded in a transaction
history.

> Demo project — virtual money only, not a real payment system.

## ✨ Features

- **Auth** — register/login with JWT; passwords hashed with bcrypt
- **P2P transfers** — send virtual money to any registered user by email
- **2% transfer fee** — deducted from the sender on top of the amount
- **Atomic balances** — transfers use guarded `$inc` updates, so concurrent
  transfers can never overdraw an account; failed credits roll back
- **Transaction history** — sent and received transfers with direction badges
- **Live balance** — dashboard always shows the server-side balance

## 🛠️ Tech stack

- **Frontend**: React 18, React Router DOM, Axios (Create React App)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Auth**: JWT, bcryptjs password hashing

## ⚙️ Getting started

### Prerequisites

- Node.js 18+ and npm
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGO_URI and JWT_SECRET
npm start
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string (default `mongodb://localhost:27017/simupay`) |
| `JWT_SECRET` | Long random string for signing tokens |
| `PORT` | API port (default `5000`) |
| `CLIENT_URL` | Frontend origin(s) for CORS (optional in dev) |

### 2. Frontend

```bash
cd frontend
npm install
npm start
```

The app opens at http://localhost:3000. For deployments, point it at the API
with a `.env` file:

```
REACT_APP_API_URL=https://your-api-host/api
```

## 📂 Project structure

```
├── backend/
│   ├── middleware/   # JWT auth, transfer validation
│   ├── models/       # User (hashed password, balance), Transaction
│   ├── routes/       # auth, simulate (transfers), transactions (history)
│   ├── utils/        # fee calculation
│   └── server.js
├── frontend/
│   └── src/
│       ├── api.js        # Axios instance (base URL + token)
│       ├── components/   # PrivateRoute
│       └── pages/        # Login, Signup, Dashboard
└── README.md
```

## 🔌 API endpoints

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/signup` | — | Register (returns token, logs in immediately) |
| POST | `/api/auth/login` | — | Log in |
| GET | `/api/auth/me` | ✅ | Current user + balance |

### Transfers & history

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/simulate/transfer` | ✅ | Transfer to another user by email (`{ receiverEmail, amount }`) |
| GET | `/api/transactions/history` | ✅ | Sent and received transfers, newest first |

## 📜 License

MIT — see [LICENSE](LICENSE).

---

**Author:** Muhammad Usman · FAST NUCES, Islamabad — BS Financial Technology (FinTech)
