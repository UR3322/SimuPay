# SimuPay — MERN Stack P2P Transfer System

A responsive, secure Peer-to-Peer (P2P) digital transfer simulation system built with the MERN stack.

## Author
* **Name:** Muhammad Usman
* **Institution:** FAST-NUCES
* **Specialization:** Web Engineering

---

## Table of Contents
* [About the Project](#about-the-project)
* [Tech Stack](#tech-stack)
* [Features](#features)
* [Database Design](#database-design)
* [Environment Variables](#environment-variables)
* [Installation and Usage](#installation-and-usage)
* [Deployment](#deployment)

---

## About the Project

SimuPay is a digital transfer application that handles user authentication, transaction history tracking, and real-time financial simulations. The interface features a responsive, dark-themed layout built with accessible CSS layouts (Flexbox/CSS Grid).

---

## Tech Stack

* **MongoDB Atlas:** Cloud NoSQL database for flexible and scalable data persistence.
* **Express.js:** Backend framework for fast, robust RESTful APIs.
* **React.js:** Frontend library for dynamic, component-driven user interfaces.
* **Node.js:** Server-side JavaScript runtime environment.

---

## Features

* **User Authentication:** Secure authentication and authorization using JSON Web Tokens (JWT) and bcrypt password hashing.
* **Core P2P Logic:** Transfers include an automated 2% system calculation fee before updating user balances atomically.
* **Transaction History:** Ledger tracking that stores transaction volume history with user-referenced aggregation.
* **Security & Validation:** Middleware validation against race conditions and invalid requests.

---

## Database Design

The data layer is decoupled from transaction actions using data referencing rather than embedding, ensuring lightweight user documents:

* **User Schema:** Stores account credentials and balances.
* **Transaction Schema:** Stores the `sender` and `receiver` ObjectIds, amount, computed fees, and status.

---

## Environment Variables

### Backend `.env`
Create a `.env` file in the `backend/` directory:
```text
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.abc12.mongodb.net/simupay?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

### Frontend `.env`
Create a `.env` file in the `frontend/` directory:
```text
REACT_APP_API_URL=https://your-backend-url.onrender.com
# Use VITE_API_URL instead if you are using Vite
```

---

## Installation and Usage

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/fintechflow.git
cd fintechflow
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd backend
npm install

# Install client dependencies
cd ../frontend
npm install
```

### 3. Run Locally
```bash
# Run the backend
cd backend
npm start

# Run the frontend
cd ../frontend
npm start
```

---

## Deployment

The application is configured for deployment using modern cloud platforms:

* **Backend Deployment:** Render (Web Service using the Node runtime environment).
* **Frontend Deployment:** Vercel (React client application deployment).
