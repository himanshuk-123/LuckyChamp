import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft, FaCoins, FaRedo } from 'react-icons/fa';

const SnakeGame = () => {
  const { balance, updateBalance } = useContext(AppContext);
  const navigate = useNavigate();
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const gridSize = 25;
  const tileSize = 20;

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const moveSnake = () => {
      const newSnake = [...snake];
      const head = { ...newSnake[0] };

      switch (direction) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      newSnake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood({
          x: Math.floor(Math.random() * gridSize),
          y: Math.floor(Math.random() * gridSize),
        });
      } else {
        newSnake.pop();
      }

      if (
        head.x < 0 || head.x >= gridSize ||
        head.y < 0 || head.y >= gridSize ||
        newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
      ) {
        setGameOver(true);
        if (score >= 50) setBalance(prev => prev + 50);
        return;
      }

      setSnake(newSnake);
    };

    const interval = setInterval(moveSnake, 100);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameStarted, gameOver, score]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const startGame = () => {
    if (balance < 10 || gameStarted) return;
    updateBalance(-10);
    setGameStarted(true);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
  };

  const resetGame = () => {
    setGameStarted(false);
    setGameOver(false);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
  };

  useEffect(() => {
    if (gameOver && score >= 50) updateBalance(50); // Backend: await fetch('/api/game/win', { method: 'POST', body: JSON.stringify({ game: 'snake', amount: 50 }) });
  }, [gameOver, score, updateBalance]);

  return (
<div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20">
        <FaArrowLeft className="text-[#00E676] cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/dashboard')} />
        <h1 className="text-2xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          Snake Champ
        </h1>
        <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
          <FaCoins /> <span>{balance}</span>
        </div>
      </nav>

      <div className="flex-1 pt-24 pb-20 flex justify-center items-center px-6 gap-6">
        <div className="relative snake-container">
          <div
            style={{
              width: gridSize * tileSize,
              height: gridSize * tileSize,
              background: 'rgba(30, 30, 30, 0.8)',
              borderRadius: '12px',
              boxShadow: '0 15px 60px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {snake.map((segment, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  width: tileSize,
                  height: tileSize,
                  background: '#00E676',
                  left: segment.x * tileSize,
                  top: segment.y * tileSize,
                  boxShadow: '0 0 10px rgba(0,230,118,0.7)',
                  borderRadius: '4px',
                }}
              />
            ))}
            <div
              style={{
                position: 'absolute',
                width: tileSize,
                height: tileSize,
                background: '#FF5722',
                left: food.x * tileSize,
                top: food.y * tileSize,
                boxShadow: '0 0 10px rgba(255,87,34,0.7)',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>

        <div className="w-64 bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-2 text-sm max-h-96 overflow-y-auto border border-[#00E676]/20">
          <h3 className="text-[#00E676] font-bold mb-2">Score</h3>
          <p>{score}</p>
        </div>
      </div>

      <div className="p-6 flex flex-col items-center bg-[#121212] border-t border-[#00E676]/20">
        {!gameStarted && (
          <button
            className={`bg-gradient-to-r from-[#00E676] to-[#4CAF50] text-[#121212] px-6 py-3 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all font-bold ${balance < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={startGame}
            disabled={balance < 10}
          >
            Start Game (10 Coins)
          </button>
        )}
        {gameStarted && !gameOver && (
          <button
            className="bg-[#FF5722] text-[#FFFFFF] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
            onClick={resetGame}
          >
            <FaRedo /> Reset
          </button>
        )}
        {balance < 10 && !gameStarted && (
          <p className="mt-2 text-red-500 font-semibold">Not enough coins!</p>
        )}
        {gameOver && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-xl">Final Score: {score}</p>
            <button
              className="bg-[#FF5722] text-[#FFFFFF] px-6 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(255,87,34,0.5)] hover:scale-105 transition-all font-bold"
              onClick={resetGame}
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-[#121212]/80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-[#00E676] font-extrabold animate-pulse">
            {score >= 50 ? 'You Win $5!' : 'Game Over!'}
          </h2>
          <div className="mt-4 flex gap-4">
            <span className="text-5xl animate-bounce">🎉</span>
            <span className="text-5xl animate-bounce delay-100">✨</span>
            <span className="text-5xl animate-bounce delay-200">🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;