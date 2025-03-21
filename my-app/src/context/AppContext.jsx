import React, { createContext, useState, useContext,useEffect } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(100);
  const [transactions, setTransactions] = useState([]);

  const login = (userData) => {
    setUser(userData);
    setBalance(userData.balance);
    localStorage.setItem('token', userData.token);
  };

  const logout = () => {
    setUser(null);
    setBalance(100);
    setTransactions([]);
    localStorage.removeItem('token');
  };

  const updateBalance = async (amount) => {
    setBalance((prev) => prev + amount);
    setTransactions((prev) => [
      { type: amount > 0 ? 'credit' : 'debit', amount, date: new Date() },
      ...prev,
    ]);
    // Optionally, you could make an API call here to update the backend balance directly
    // For now, we rely on the game routes to handle backend updates
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
          const response = await fetch('http://localhost:5000/api/profile', {
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