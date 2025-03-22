import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft, FaCoins } from 'react-icons/fa';
import axios from 'axios';
const Payment = () => {
  const { balance, updateBalance } = useContext(AppContext);
  const navigate = useNavigate();
  const [selectedPack, setSelectedPack] = useState(null);

  const coinPacks = [
    { coins: 50, price: 50 },
    { coins: 100, price: 90 },
    { coins: 200, price: 170 },
  ];

  const handlePayment = async () => {
    if (!selectedPack) return;
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/payment`, selectedPack, {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },
});
      updateBalance(selectedPack.coins);
      alert(`Successfully added ${selectedPack.coins} coins!`);
      navigate('/dashboard');
    } catch (err) {
      alert('Payment failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          <span className="text-[#00E676]">Lucky</span>Champ
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
            <FaCoins /> <span>{balance}</span>
          </div>
          <FaArrowLeft className="text-[#00E676] text-2xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/dashboard')} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 pt-24 pb-10 flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.5)] animate-pulse">
          Add Coins
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
          {coinPacks.map((pack) => (
            <div
              key={pack.coins}
              className={`bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-6 flex flex-col items-center justify-center border ${selectedPack?.coins === pack.coins ? 'border-[#00E676] shadow-[0_0_20px_rgba(0,230,118,0.5)]' : 'border-[#00E676]/20'} hover:shadow-[0_0_20px_rgba(0,230,118,0.5)] hover:scale-105 transition-all cursor-pointer`}
              onClick={() => setSelectedPack(pack)}
            >
              <div className="text-5xl text-[#FFC107] mb-4 animate-bounce">
                <FaCoins />
              </div>
              <h3 className="text-2xl font-semibold text-[#FFFFFF] mb-2">{pack.coins} Coins</h3>
              <p className="text-[#00E676] text-lg">₹{pack.price}</p>
            </div>
          ))}
        </div>
        <button
          className={`mt-10 bg-gradient-to-r from-[#00E676] to-[#4CAF50] text-[#121212] px-6 py-3 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(0,230,118,0.5)] hover:scale-105 transition-all font-bold ${!selectedPack ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePayment}
          disabled={!selectedPack}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default Payment;