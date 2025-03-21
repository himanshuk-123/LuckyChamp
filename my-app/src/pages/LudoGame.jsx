import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft, FaCoins, FaDiceSix } from 'react-icons/fa';

const LudoGame = () => {
  const { balance, updateBalance } = useContext(AppContext);
  const navigate = useNavigate();
  const [dice, setDice] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    if (balance < 10 || gameStarted) return;
    updateBalance(-10);
    setGameStarted(true);
  };

  const rollDice = () => {
    if (!gameStarted || dice) return;
    setDice(Math.floor(Math.random() * 6) + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20">
        <FaArrowLeft className="text-[#00E676] cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/dashboard')} />
        <h1 className="text-2xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          <FaDiceSix className="text-[#00E676]" /> Ludo Champ
        </h1>
        <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
          <FaCoins /> <span>{balance}</span>
        </div>
      </nav>
      <div className="flex-1 pt-24 pb-20 flex flex-col items-center justify-center px-6">
        <div className="relative w-[600px] h-[600px] bg-[#FFFFFF] rounded-lg shadow-[0_15px_60px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 left-0 w-[240px] h-[240px] bg-[#FF5722] opacity-70" />
          <div className="absolute top-0 right-0 w-[240px] h-[240px] bg-[#4CAF50] opacity-70" />
          <div className="absolute bottom-0 right-0 w-[240px] h-[240px] bg-[#FFC107] opacity-70" />
          <div className="absolute bottom-0 left-0 w-[240px] h-[240px] bg-[#2196F3] opacity-70" />
          <div className="absolute top-[240px] left-[240px] w-[120px] h-[120px] bg-[#00E676] rounded-lg shadow-[0_0_10px_rgba(0,230,118,0.7)]" />
          {dice && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/90 text-black text-4xl p-4 rounded-lg shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {dice}
            </div>
          )}
        </div>
        {!gameStarted && (
          <button
            className={`mt-6 bg-gradient-to-r from-[#00E676] to-[#4CAF50] text-[#121212] px-6 py-3 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all font-bold ${balance < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={startGame}
            disabled={balance < 10}
          >
            Start Game (10 Coins)
          </button>
        )}
        {gameStarted && (
          <button
            className="mt-6 bg-[#00E676] text-[#121212] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
            onClick={rollDice}
            disabled={dice !== null}
          >
            <FaDiceSix /> Roll Dice
          </button>
        )}
        {balance < 10 && !gameStarted && (
          <p className="mt-2 text-red-500 font-semibold">Not enough coins!</p>
        )}
      </div>
    </div>
  );
};

export default LudoGame;