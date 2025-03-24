import React, { createContext, useState, useContext,useEffect } from 'react';
import axios from 'axios'
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(100);
  const [transactions, setTransactions] = useState([]);

  const login = (userData) => {
    setUser(userData);
    setBalance(userData.balance);
  };

  const logout = () => {
    setUser(null);
    setBalance(100);
    setTransactions([]);
    localStorage.removeItem('token');
  };

  const updateBalance = async (amount, winOrLoss = null) => {
    try {
      const newBalance = balance + amount;
      let updatedStats = { ...user.stats };

      if (winOrLoss === 'win') {
        updatedStats.wins += 1;
        updatedStats.coinsEarned += amount;
      } else if (winOrLoss === 'loss') {
        updatedStats.losses += 1;
      }

      const response = await axios.put(`https://luckychamp-backend.onrender.com/api/profile`, {
        balance: newBalance,
        stats: updatedStats,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      const updatedUser = response.data;
      setBalance(updatedUser.balance);
      setUser(updatedUser); // Full user object update
      setTransactions((prev) => [
        { type: amount > 0 ? 'credit' : 'debit', amount, date: new Date() },
        ...prev,
      ]);
    } catch (err) {
      console.error('Balance update failed:', err.response?.data?.message || err.message);
    }
  };

  // const refreshUserData = async () => {
  //   try {
  //     const response = await fetch('http://localhost:5000/api/profile', {
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });
  //     const data = await response.json();
  //     if (response.ok) {
  //       setUser((prev) => ({ ...prev, ...data }));
  //       setBalance(data.balance);
  //     } else {
  //       console.error('Failed to refresh user data:', data.message);
  //     }
  //   } catch (err) {
  //     console.error('Failed to refresh user data:', err);
  //   }
  // };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('https://luckychamp-backend.onrender.com/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok) {
            setUser({ id: data._id, name: data.name, email: data.email });
            setBalance(data.balance);
          } else {
            logout(); // Invalid token, clear session
          }
        } catch (err) {
          console.error('Session restore failed:', err);
          logout();
        }
      }
    };
    restoreSession();
  }, []);

  return (
    <AppContext.Provider value={{ user, login, logout, balance, updateBalance, transactions }}>
      <div className="min-h-screen">{children}</div>
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);