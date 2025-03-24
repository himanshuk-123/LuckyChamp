import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FaArrowLeft, FaCoins, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const { balance, user, login, logout } = useAppContext();
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`https://luckychamp-backend.onrender.com/api/profile`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.status === 200) {
        login(response.data); // Context mein latest user data set karo
      }
    } catch (err) {
      console.error('Profile fetch failed:', err.response?.data?.message || err.message);
      logout();
      navigate('/');
    }
  };

  useEffect(() => {
    fetchProfile();
    console.log(user); // Page load pe latest data fetch karo
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col">
      <div className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex flex-col md:flex-row items-center justify-between border-b border-[#00E676]/20">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)]">
          <span className="text-[#00E676]">Lucky</span>Champ
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-0">
          <div className="flex items-center gap-2 text-[#FFC107] animate-pulse">
            <FaCoins /> <span>{balance}</span>
          </div>
          <FaArrowLeft className="text-[#00E676] text-2xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)]" onClick={() => navigate('/dashboard')} />
        </div>
      </div>
      <div className="flex-1 pt-24 pb-10 flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.5)] animate-pulse">
          Profile
        </h2>
        <div className="bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md border border-[#00E676]/20 shadow-[0_0_20px_rgba(0,230,118,0.5)]">
          <div className="flex flex-col items-center mb-6">
            <div className="text-6xl text-[#00E676] mb-4"><FaUserCircle /></div>
            <h3 className="text-2xl font-semibold text-[#FFFFFF]">{user?.name || 'Player'}</h3>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between text-[#FFFFFF]">
              <span>Wins:</span>
              <span className="text-[#00E676]">{user?.stats?.wins || 0}</span>
            </div>
            <div className="flex justify-between text-[#FFFFFF]">
              <span>Losses:</span>
              <span className="text-[#FF5722]">{user?.stats?.losses || 0}</span>
            </div>
            <div className="flex justify-between text-[#FFFFFF]">
              <span>Coins Earned:</span>
              <span className="text-[#FFC107]">{user?.stats?.coinsEarned || 0}</span>
            </div>
          </div>
          <button
            className="mt-6 bg-[#FF5722] text-[#FFFFFF] px-4 py-2 rounded-lg w-full flex items-center justify-center gap-2 shadow-[0_4px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_0_15px_rgba(255,87,34,0.5)] hover:scale-105 transition-all font-bold"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;