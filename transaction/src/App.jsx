import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

// Sidebar Component
const Sidebar = () => {
  const location = useLocation();
  
  const isActiveRoute = (path) => {
    return location.pathname === path ? "bg-blue-700" : "";
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gray-900 text-white shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-8 text-center text-white">Banking App</h2>
        <nav className="space-y-2">
          <Link
            to="/add-account"
            className={`block px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors ₹{isActiveRoute('/add-account')}`}
          >
            Add Bank Account
          </Link>
          <Link
            to="/accounts"
            className={`block px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors ₹{isActiveRoute('/accounts')}`}
          >
            View Bank Details
          </Link>
          <Link
            to="/transfer"
            className={`block px-4 py-3 rounded-lg hover:bg-blue-600 transition-colors ₹{isActiveRoute('/transfer')}`}
          >
            Transfer Money
          </Link>
        </nav>
      </div>
    </div>
  );
};

// Add Account Component
const AddAccount = () => {
  const [accountHolder, setAccountHolder] = useState('');
  const [balance, setBalance] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountHolder, balance: parseFloat(balance) }),
      });
      if (response.ok) {
        alert('Account created successfully!');
        setAccountHolder('');
        setBalance('');
      }
    } catch (error) {
      alert('Error creating account');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Add Bank Account</h2>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Account Holder Name
          </label>
          <input
            type="text"
            value={accountHolder}
            onChange={(e) => setAccountHolder(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Initial Balance
          </label>
          <input
            type="number"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            min="0"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Account
        </button>
      </form>
    </div>
  );
};

// View Accounts Component
const ViewAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/accounts');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ₹{response.status}`);
      }
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      alert('Error fetching accounts');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Bank Accounts</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Account Holder
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.map((account) => (
              <tr key={account.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {account.account_holder}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ₹{account.balance}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Transfer Money Component
const TransferMoney = () => {
  const [accounts, setAccounts] = useState([]);
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/accounts');
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      alert('Error fetching accounts');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fromId: parseInt(fromId),
          toId: parseInt(toId),
          amount: parseFloat(amount)
        }),
      });
      
      if (response.ok) {
        alert('Transfer successful!');
        setFromId('');
        setToId('');
        setAmount('');
        fetchAccounts();
      } else {
        const error = await response.json();
        alert(error.error || 'Transfer failed');
      }
    } catch (error) {
      alert('Error processing transfer');
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Transfer Money</h2>
      <form onSubmit={handleTransfer} className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From Account
          </label>
          <select
            value={fromId}
            onChange={(e) => setFromId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_holder} (Balance: ₹{account.balance})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            To Account
          </label>
          <select
            value={toId}
            onChange={(e) => setToId(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Select account</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.account_holder} (Balance: ₹{account.balance})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Transfer
        </button>
      </form>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 ml-64">
          <Routes>
            <Route path="/add-account" element={<AddAccount />} />
            <Route path="/accounts" element={<ViewAccounts />} />
            <Route path="/transfer" element={<TransferMoney />} />
            <Route path="/" element={<AddAccount />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;