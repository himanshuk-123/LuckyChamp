import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { FaArrowLeft, FaCoins, FaChessKing, FaUndo, FaRedo } from 'react-icons/fa';
import axios from 'axios'

const ChessGame = () => {
  const { balance, updateBalance } = useContext(AppContext); // Added refreshUserData
  const navigate = useNavigate();
  const [game, setGame] = useState(new Chess());
  const [position, setPosition] = useState(game.fen());
  const [gameOver, setGameOver] = useState(false);
  const [moveHistory, setMoveHistory] = useState([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [possibleMoves, setPossibleMoves] = useState([]);

  const onSquareClick = (square) => {
    if (!gameStarted || gameOver) return;

    const piece = game.get(square);
    if (piece && piece.color === game.turn()) {
      setSelectedPiece(square);
      const moves = game.moves({ square, verbose: true });
      setPossibleMoves(moves.map((move) => move.to));
    } else if (selectedPiece && possibleMoves.includes(square)) {
      const move = game.move({
        from: selectedPiece,
        to: square,
        promotion: 'q',
      });
      if (move) {
        setPosition(game.fen());
        setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);
        setSelectedPiece(null);
        setPossibleMoves([]);
        if (game.isGameOver()) {
          handleGameOver();
        } else {
          opponentMove();
        }
      }
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const onDrop = async (sourceSquare, targetSquare) => {
    if (!gameStarted || gameOver) return false;

    const gameCopy = new Chess(game.fen());
    const move = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move === null) return false;

    setGame(gameCopy);
    setPosition(gameCopy.fen());
    setMoveHistory((prev) => [...prev, `${move.from}-${move.to}`]);

    if (gameCopy.isGameOver()) {
      handleGameOver(gameCopy);
    } else {
      opponentMove(gameCopy);
    }
    return true;
  };

  const opponentMove = (currentGame = game) => {
    setTimeout(() => {
      if (!gameStarted || gameOver) return;
      const moves = currentGame.moves({ verbose: true });
      if (moves.length > 0) {
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        currentGame.move(randomMove);
        setGame(new Chess(currentGame.fen()));
        setPosition(currentGame.fen());
        setMoveHistory((prev) => [...prev, `${randomMove.from}-${randomMove.to}`]);
        if (currentGame.isGameOver()) {
          handleGameOver(currentGame);
        }
      }
    }, 500);
  };

  const handleGameOver = async (currentGame = game) => {
    setGameOver(true);
    if (currentGame.isCheckmate()) {
      if (currentGame.turn() === 'b') { // White wins
        try {
          const response = await axios.post(`https://luckychamp-backend.onrender.com/api/game/win`, {
            game: 'chess',
            amount: 50,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.status === 200) { // response.ok ki jagah status check
            await updateBalance(50,win);
            console.log('Win recorded:', response.data);
          } else {
            console.error('Win update failed:', response.data.message);
          }
        } catch (err) {
          console.error('Win update failed:', err.response?.data?.message || err.message);
        }
      } else { // Black wins (player loses)
        try {
          const response = await axios.post(`https://luckychamp-backend.onrender.com/api/game/loss`, {
            game: 'chess',
            amount: 50,
          }, {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          });
          if (response.status === 200) {
            await updateBalance(-20,loss);
            console.log('Loss recorded:', response.data);
          } else {
            console.error('Loss update failed:', response.data.message);
          }
        } catch (err) {
          console.error('Loss update failed:', err.response?.data?.message || err.message);
        }
      }
    }
  };

  const startGame = async () => {
    if (balance < 10 || gameStarted) return;
    console.log("Checks the log message!..");
    await updateBalance(-10); // Deduct 10 coins and sync with backend
    // await refreshUserData(); // Sync latest user data
    console.log("Balance: ",balance);
    setGameStarted(true);
  };

const undoMove = () => {
    if (!gameStarted || gameOver || moveHistory.length < 2) return;
    game.undo(); // Undo player's move
    game.undo(); // Undo opponent's move
    setPosition(game.fen());
    setMoveHistory(prev => prev.slice(0, -2));
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const resetGame = () => {
    const newGame = new Chess();
    setGame(newGame);
    setPosition(newGame.fen());
    setGameOver(false);
    setMoveHistory([]);
    setGameStarted(false);
    setSelectedPiece(null);
    setPossibleMoves([]);
  };

  const restartGame = () => {
    resetGame();
  };

  const squareStyles = {};
  possibleMoves.forEach((move) => {
    squareStyles[move] = {
      backgroundColor: 'rgba(0, 230, 118, 0.4)',
      boxShadow: '0 0 15px rgba(0, 230, 118, 0.7)',
      transition: 'all 0.3s ease',
    };
  });
  if (selectedPiece) {
    squareStyles[selectedPiece] = {
      backgroundColor: 'rgba(255, 87, 34, 0.6)',
      boxShadow: '0 0 20px rgba(255, 87, 34, 0.8)',
      transform: 'scale(1.1)',
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20">
        <FaArrowLeft className="text-[#00E676] cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/dashboard')} />
        <h1 className="text-2xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          <FaChessKing className="text-[#00E676]" /> Chess Champ
        </h1>
        <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
          <FaCoins /> <span>{balance}</span>
        </div>
      </nav>

      <div className="flex-1 pt-24 pb-20 flex justify-center items-center px-6 gap-6">
        <div className="relative">
          <Chessboard
            position={position}
            onPieceDrop={onDrop}
            onSquareClick={onSquareClick}
            boardStyle={{
              borderRadius: '12px',
              boxShadow: '0 10px 50px rgba(0,0,0,0.4), inset 0 0 15px rgba(255,255,255,0.2)',
              transform: 'perspective(1200px) rotateX(20deg) rotateY(10deg)',
              background: 'linear-gradient(45deg, #FFFFFF, #D3D3D3)',
              padding: '10px',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
            customSquareStyles={squareStyles}
            arePiecesDraggable={gameStarted && !gameOver}
            boardWidth={550}
          />
        </div>

        <div className="w-64 bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-2 text-sm max-h-96 overflow-y-auto border border-[#00E676]/20">
          <h3 className="text-[#00E676] font-bold mb-2">Move History</h3>
          {moveHistory.length > 0 ? (
            moveHistory.map((move, i) => <p key={i}>{move}</p>)
          ) : (
            <p>No moves yet!</p>
          )}
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
          <div className="flex gap-4">
            <button
              className="bg-[#00E676] text-[#121212] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
              onClick={undoMove}
            >
              <FaUndo /> Undo
            </button>
            <button
              className="bg-[#FF5722] text-[#FFFFFF] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
              onClick={resetGame}
            >
              <FaRedo /> Reset
            </button>
          </div>
        )}
        {balance < 10 && !gameStarted && (
          <p className="mt-2 text-red-500 font-semibold">Not enough coins!</p>
        )}
        {gameOver && (
          <button
            className="mt-4 bg-[#FF5722] text-[#FFFFFF] px-6 py-3 rounded-lg hover:shadow-[0_0_10px_rgba(255,87,34,0.5)] hover:scale-105 transition-all font-bold"
            onClick={restartGame}
          >
            Play Again
          </button>
        )}
      </div>

      {gameOver && (
        <div className="absolute inset-0 bg-[#121212]/80 flex flex-col items-center justify-center">
          <h2 className="text-4xl text-[#00E676] font-extrabold animate-pulse">
            {game.isCheckmate() && game.turn() === 'b' ? 'You Win $5!' : 'Game Over!'}
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

export default ChessGame;