import React, { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions/history');
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await api.get('/auth/me');
      setBalance(res.data.user.balance);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [txRes, meRes] = await Promise.all([
          api.get('/transactions/history'),
          api.get('/auth/me'),
        ]);
        setTransactions(txRes.data);
        setBalance(meRes.data.user.balance);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [token]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await api.post('/simulate/transfer', { receiverEmail, amount });
      setMessage(res.data.message);
      setBalance(res.data.newBalance);
      setReceiverEmail('');
      setAmount('');
      fetchTransactions();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>SimuPay - P2P Transfer</h2>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>

      <div className="balance-card">
        <h3>Current Balance: {balance === null ? '…' : `$${Number(balance).toFixed(2)}`}</h3>
      </div>

      <form onSubmit={handleTransfer} className="transfer-form">
        <h3>Transfer Simulation</h3>
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <input
          type="email"
          placeholder="Receiver's Email"
          value={receiverEmail}
          onChange={(e) => setReceiverEmail(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (e.g. 50)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          min="0.01"
          step="any"
        />
        <button type="submit">Transfer (Includes 2% Fee)</button>
      </form>

      <div className="transactions-list">
        <h3>Transaction History</h3>
        {transactions.length === 0 ? (
          <p>No transactions yet</p>
        ) : (
          <ul>
            {transactions.map((tx) => (
              <li key={tx._id}>
                <p>
                  <strong>{tx.direction === 'sent' ? 'To' : 'From'}:</strong>{' '}
                  {tx.direction === 'sent' ? tx.receiver?.email : tx.sender?.email} |{' '}
                  <strong>Amount:</strong> ${tx.amount} | <strong>Fee:</strong> ${tx.fee} |{' '}
                  <strong>Date:</strong> {new Date(tx.createdAt).toLocaleDateString()}
                </p>
                <span className={`status ${tx.direction}`}>
                  {tx.direction === 'sent' ? '⬆ Sent' : '⬇ Received'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
