import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaChess, FaDiceSix, FaCoins, FaPlus, FaCog, FaUserCircle } from 'react-icons/fa';
import { GiSnake } from 'react-icons/gi';

const Dashboard = () => {
  const { balance } = useContext(AppContext);
  const navigate = useNavigate();

  const games = [
    { name: 'Chess', icon: <FaChess />, path: '/chess' },
    { name: 'Snake', icon: <GiSnake />, path: '/snake' },
    { name: 'Ludo', icon: <FaDiceSix />, path: '/ludo' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex flex-col md:flex-row items-center justify-between border-b border-[#00E676]/20">
  <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
    <span className="text-[#00E676]">Lucky</span>Champ
  </h1>
  <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-0">
    <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
      <FaCoins /> <span>{balance}</span>
    </div>
    <FaPlus className="text-[#00E676] text-xl md:text-2xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/payment')} />
    {/* <FaCog className="text-[#00E676] text-xl md:text-2xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/settings')} /> */}
    <FaUserCircle className="text-[#00E676] text-2xl md:text-3xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/profile')} />
  </div>
</nav>
      <div className="flex-1 pt-24 pb-10 flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.5)] animate-pulse">
          Choose Your Game
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {games.map((game) => (
            <div
              key={game.name}
              className="bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center justify-center border border-[#00E676]/20 hover:shadow-[0_0_20px_rgba(0,230,118,0.5)] hover:scale-105 transition-all cursor-pointer"
              onClick={() => navigate(game.path)}
            >
              <div className="text-5xl text-[#00E676] mb-4 animate-bounce">{game.icon}</div>
              <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-4">{game.name}</h3>
              <button
                className="bg-gradient-to-r from-[#00E676] to-[#4CAF50] text-[#121212] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] transition-all font-bold"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(game.path);
                }}
              >
                Play Now
              </button>
            </div>
          ))}
        </div>
      </div>
      <footer className="p-4 text-center text-[#FFFFFF]/70 border-t border-[#00E676]/20">
        <p>© 2025 LuckyChamp - Play Smart, Win Big!</p>
      </footer>
    </div>
  );
};

export default Dashboard;