import React from 'react';
import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
import { AppProvider,useAppContext } from './context/AppContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import LudoGame from './pages/LudoGame.jsx';
import ChessGame from './pages/ChessGame.jsx';
import SnakeGame from './pages/SnakeGame.jsx';
import Payment from './pages/Payment.jsx';
import Profile from './pages/Profile.jsx';
//import Settings from './pages/Settings.jsx';

const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/" />;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
          <Route path="/ludo" element={<ProtectedRoute><LudoGame /></ProtectedRoute>} />
          <Route path="/chess" element={<ProtectedRoute><ChessGame /></ProtectedRoute>} />
          <Route path="/snake" element={<ProtectedRoute><SnakeGame /></ProtectedRoute>} />
          <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          {/* <Route path="/settings" element={<Settings />} /> */}
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;