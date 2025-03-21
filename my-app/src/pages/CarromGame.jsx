// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Stage, Layer, Circle, Rect } from 'react-konva';
// import Matter from 'matter-js';
// import { FaArrowLeft, FaCoins, FaUndo, FaRedo } from 'react-icons/fa';

// const CarromGame = () => {
//   const navigate = useNavigate();
//   const [balance, setBalance] = useState(100);
//   const [gameStarted, setGameStarted] = useState(false);
//   const [gameOver, setGameOver] = useState(false);
//   const [moveHistory, setMoveHistory] = useState([]);
//   const engineRef = useRef(null);
//   const strikerRef = useRef(null);
//   const piecesRef = useRef([]);

//   useEffect(() => {
//     // Matter.js Setup
//     const Engine = Matter.Engine;
//     const World = Matter.World;
//     const Bodies = Matter.Bodies;

//     const engine = Engine.create();
//     engineRef.current = engine;

//     // Carrom Board Boundaries (550x550)
//     const walls = [
//       Bodies.rectangle(275, 0, 550, 20, { isStatic: true }), // Top
//       Bodies.rectangle(275, 550, 550, 20, { isStatic: true }), // Bottom
//       Bodies.rectangle(0, 275, 20, 550, { isStatic: true }), // Left
//       Bodies.rectangle(550, 275, 20, 550, { isStatic: true }), // Right
//     ];

//     // Striker
//     const striker = Bodies.circle(275, 500, 20, {
//       restitution: 0.8,
//       friction: 0.1,
//       label: 'striker',
//     });
//     strikerRef.current = striker;

//     // Carrom Pieces (9 black, 9 white, 1 queen)
//     const pieces = [];
//     for (let i = 0; i < 9; i++) {
//       pieces.push(Bodies.circle(250 + i * 10, 250, 15, { restitution: 0.8, friction: 0.1, label: 'black' }));
//       pieces.push(Bodies.circle(250 + i * 10, 300, 15, { restitution: 0.8, friction: 0.1, label: 'white' }));
//     }
//     pieces.push(Bodies.circle(275, 275, 15, { restitution: 0.8, friction: 0.1, label: 'queen' }));
//     piecesRef.current = pieces;

//     // Add to World
//     World.add(engine.world, [...walls, striker, ...pieces]);

//     // Run Engine
//     Engine.run(engine);

//     return () => {
//       Engine.clear(engine);
//     };
//   }, []);

//   const startGame = () => {
//     if (balance < 10 || gameStarted) return;
//     setBalance(prev => prev - 10);
//     setGameStarted(true);
//   };

//   const resetGame = () => {
//     setGameOver(false);
//     setMoveHistory([]);
//     setGameStarted(false);
//     Matter.World.clear(engineRef.current.world);
//     // Re-initialize striker and pieces (simplified here)
//     const striker = Matter.Bodies.circle(275, 500, 20, { restitution: 0.8, friction: 0.1, label: 'striker' });
//     strikerRef.current = striker;
//     const pieces = [];
//     for (let i = 0; i < 9; i++) {
//       pieces.push(Matter.Bodies.circle(250 + i * 10, 250, 15, { restitution: 0.8, friction: 0.1, label: 'black' }));
//       pieces.push(Matter.Bodies.circle(250 + i * 10, 300, 15, { restitution: 0.8, friction: 0.1, label: 'white' }));
//     }
//     pieces.push(Matter.Bodies.circle(275, 275, 15, { restitution: 0.8, friction: 0.1, label: 'queen' }));
//     piecesRef.current = pieces;
//     Matter.World.add(engineRef.current.world, [striker, ...pieces]);
//   };

//   const undoMove = () => {
//     // Simplified undo: Reset striker position (full undo needs history tracking)
//     if (!gameStarted || gameOver || moveHistory.length === 0) return;
//     Matter.Body.setPosition(strikerRef.current, { x: 275, y: 500 });
//     Matter.Body.setVelocity(strikerRef.current, { x: 0, y: 0 });
//     setMoveHistory(prev => prev.slice(0, -1));
//   };

//   const handleDragEnd = (e) => {
//     if (!gameStarted || gameOver) return;
//     const { x, y } = e.target.attrs;
//     const dx = x - 275;
//     const dy = y - 500;
//     Matter.Body.applyForce(strikerRef.current, strikerRef.current.position, {
//       x: -dx * 0.05,
//       y: -dy * 0.05,
//     });
//     setMoveHistory(prev => [...prev, `Striker moved to (${x}, ${y})`]);
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
//       <nav className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20">
//         <FaArrowLeft className="text-[#00E676] cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/game-selection')} />
//         <h1 className="text-2xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
//           Carrom Champ
//         </h1>
//         <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
//           <FaCoins /> <span>{balance}</span>
//         </div>
//       </nav>

//       <div className="flex-1 pt-24 pb-20 flex justify-center items-center px-6 gap-6">
//         <Stage width={550} height={550} className="shadow-[0_15px_60px_rgba(0,0,0,0.5)] rounded-lg">
//           <Layer>
//             {/* Carrom Board */}
//             <Rect x={0} y={0} width={550} height={550} fill="burlywood" shadowBlur={10} shadowColor="rgba(0,0,0,0.5)" />
//             {/* Pockets */}
//             <Circle x={30} y={30} radius={25} fill="black" />
//             <Circle x={520} y={30} radius={25} fill="black" />
//             <Circle x={30} y={520} radius={25} fill="black" />
//             <Circle x={520} y={520} radius={25} fill="black" />
//             {/* Striker */}
//             <Circle
//               x={strikerRef.current?.position.x || 275}
//               y={strikerRef.current?.position.y || 500}
//               radius={20}
//               fill="#00E676"
//               draggable={gameStarted && !gameOver}
//               onDragEnd={handleDragEnd}
//               shadowBlur={10}
//               shadowColor="rgba(0,230,118,0.7)"
//             />
//             {/* Pieces */}
//             {piecesRef.current.map((piece, i) => (
//               <Circle
//                 key={i}
//                 x={piece.position.x}
//                 y={piece.position.y}
//                 radius={15}
//                 fill={piece.label === 'black' ? '#000' : piece.label === 'white' ? '#FFF' : '#FF5722'}
//                 shadowBlur={5}
//                 shadowColor="rgba(0,0,0,0.5)"
//               />
//             ))}
//           </Layer>
//         </Stage>

//         <div className="w-64 bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-2 text-sm max-h-96 overflow-y-auto border border-[#00E676]/20">
//           <h3 className="text-[#00E676] font-bold mb-2">Move History</h3>
//           {moveHistory.length > 0 ? (
//             moveHistory.map((move, i) => <p key={i}>{move}</p>)
//           ) : (
//             <p>No moves yet!</p>
//           )}
//         </div>
//       </div>

//       <div className="p-6 flex flex-col items-center bg-[#121212] border-t border-[#00E676]/20">
//         {!gameStarted && (
//           <button
//             className={`bg-gradient-to-r from-[#00E676] to-[#4CAF50] text-[#121212] px-6 py-3 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all font-bold ${balance < 10 ? 'opacity-50 cursor-not-allowed' : ''}`}
//             onClick={startGame}
//             disabled={balance < 10}
//           >
//             Start Game (10 Coins)
//           </button>
//         )}
//         {gameStarted && !gameOver && (
//           <div className="flex gap-4">
//             <button
//               className="bg-[#00E676] text-[#121212] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
//               onClick={undoMove}
//             >
//               <FaUndo /> Undo
//             </button>
//             <button
//               className="bg-[#FF5722] text-[#FFFFFF] px-4 py-2 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] hover:scale-105 transition-all flex items-center gap-2 font-bold"
//               onClick={resetGame}
//             >
//               <FaRedo /> Reset
//             </button>
//           </div>
//         )}
//         {balance < 10 && !gameStarted && (
//           <p className="mt-2 text-red-500 font-semibold">Not enough coins!</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default CarromGame;