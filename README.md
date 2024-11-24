Here's the updated `README.md` with the configuration section removed:

---

# Banking Application

This is a simple banking application with a frontend and backend that allows users to add bank accounts, view account details, and transfer money between accounts. It also features a sidebar navigation, form validation, and real-time data updates.

## Table of Contents
- [Setup and Installation](#setup-and-installation)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Features](#features)
- [Backend Transactions](#backend-transactions)
- [Running the Application](#running-the-application)

---

## Setup and Installation

### Database Setup
1. Create a MySQL database for the application:
   ```sql
   CREATE DATABASE banking_db;
   USE banking_db;
   Add your database password in-place of process.env.DATABASE_PASSWORD 
   ```

### Backend Setup
1. Install the required dependencies:
   ```bash
   npm install 
   ```

### Frontend Setup
1. Install required packages for routing and styling:
   ```bash
   npm i
   ```

---

## Features

### Sidebar Navigation
The application features a sidebar with three main options:
1. **Add Bank Account**: A form to add new account holders with initial balances and field validation.
2. **View Bank Details**: A table that displays all account holders and their balances with auto-refreshing data.
3. **Transfer Money**: A form that allows users to transfer money between accounts, with real-time balance updates and transaction notifications.

### Add Bank Account Page
- **Form** to add new account holder and initial balance.
- **Validation** for required fields.
- Success/error notifications upon account creation.

### View Bank Details Page
- **Table** displaying all account holders and their balances.
- **Auto-refreshing** data.
- Formatted currency display for balances.

### Transfer Money Page
- **Dropdown menus** for selecting sender and receiver.
- **Amount input** with validation.
- Real-time balance updates after transaction completion.
- **Transaction success/failure notifications**.

---

## Backend Transactions

The backend implements proper MySQL transactions to ensure data consistency during money transfers:
- **Balance checking**: Ensures the sender has sufficient balance before initiating the transfer.
- **Atomic operations**: All related database actions (e.g., balance deduction and credit) are performed as part of a single transaction.
- **Transaction rollback**: If any error occurs during the transaction, the operations are rolled back to maintain data consistency.
- **Error handling**: Proper error handling is in place to catch and log errors during transactions.

---

## Running the Application

### Start the Backend Server
1. In the backend directory, start the Node.js server:
   ```bash
   node server.js
   ```

### Start the Frontend Development Server
1. In the frontend directory, start the React development server:
   ```bash
   npm start
   ```

The application should now be running. You can access it in your browser at [http://localhost:3000](http://localhost:3000).

