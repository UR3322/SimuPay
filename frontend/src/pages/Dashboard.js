import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = ({ token, setToken }) => {
  const [receiverEmail, setReceiverEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [balance, setBalance] = useState(500);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/transactions/history', {
        headers: { Authorization: token },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [token]);

  const handleTransfer = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/simulate/transfer',
        { receiverEmail, amount },
        { headers: { Authorization: token } }
      );
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
        <h3>Current Balance: ${balance}</h3>
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
                <p><strong>To:</strong> {tx.receiver?.email} | <strong>Amount:</strong> ${tx.amount} | <strong>Fee:</strong> ${tx.fee} | <strong>Date:</strong> {new Date(tx.createdAt).toLocaleDateString()}</p>
                <span className={`status ${tx.status.toLowerCase()}`}>{tx.status}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Dashboard;