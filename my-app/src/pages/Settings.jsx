import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { FaArrowLeft, FaCoins, FaVolumeUp, FaVolumeMute, FaSun, FaMoon } from 'react-icons/fa';

const Settings = () => {
  const {
    balance,
    theme,
    setTheme,
    soundEnabled,
    setSoundEnabled,
    notificationsEnabled,
    setNotificationsEnabled,
  } = useContext(AppContext);
  const navigate = useNavigate();

  // Dummy audio for sound toggle
  const audio = new Audio('https://www.soundjay.com/buttons/beep-01a.mp3'); // Replace with your sound file later

  useEffect(() => {
    if (soundEnabled) {
      audio.play().catch(() => console.log('Audio play failed')); // Test sound on enable
    } else {
      audio.pause();
    }
  }, [soundEnabled]);

  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
    // Backend placeholder: await fetch('/api/settings/sound', { method: 'POST', body: JSON.stringify({ soundEnabled: !soundEnabled }) });
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
    console.log(theme);
    // Backend placeholder: await fetch('/api/settings/theme', { method: 'POST', body: JSON.stringify({ theme: theme === 'dark' ? 'light' : 'dark' }) });
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(prev => !prev);
    // Backend placeholder: await fetch('/api/settings/notifications', { method: 'POST', body: JSON.stringify({ notificationsEnabled: !notificationsEnabled }) });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#121212] to-[#1E1E1E] text-[#FFFFFF] flex flex-col dark:bg-gradient-to-br dark:from-[#F5F5F5] dark:to-[#E0E0E0] dark:text-[#121212]">
      <div className="fixed top-0 left-0 right-0 bg-[#1E1E1E]/80 backdrop-blur-md z-10 p-4 flex items-center justify-between border-b border-[#00E676]/20 dark:bg-[#E0E0E0]/80 dark:border-[#4CAF50]/20">
        <h1 className="text-3xl font-extrabold flex items-center gap-2 shadow-[0_0_10px_rgba(0,230,118,0.5)] dark:shadow-[0_0_10px_rgba(76,175,80,0.5)]">
          <span className="text-[#00E676] dark:text-[#4CAF50]">Lucky</span>Champ
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[#FFC107] animate-pulse dark:text-[#FF9800]">
            <FaCoins /> <span>{balance}</span>
          </div>
          <FaArrowLeft
            className="text-[#00E676] text-2xl cursor-pointer hover:shadow-[0_0_10px_rgba(0,230,118,0.5)] dark:text-[#4CAF50] dark:hover:shadow-[0_0_10px_rgba(76,175,80,0.5)]"
            onClick={() => navigate('/dashboard')}
          />
        </div>
      </div>
      <div className="flex-1 pt-24 pb-10 flex flex-col items-center justify-center px-6">
        <h2 className="text-4xl font-bold mb-10 text-[#00E676] shadow-[0_0_15px_rgba(0,230,118,0.5)] animate-pulse dark:text-[#4CAF50] dark:shadow-[0_0_15px_rgba(76,175,80,0.5)]">
          Settings
        </h2>
        <div className="bg-[#1E1E1E]/80 backdrop-blur-md rounded-lg p-6 w-full max-w-md border border-[#00E676]/20 shadow-[0_0_20px_rgba(0,230,118,0.5)] dark:bg-[#E0E0E0]/80 dark:border-[#4CAF50]/20 dark:shadow-[0_0_20px_rgba(76,175,80,0.5)]">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <span className="text-[#FFFFFF] text-lg dark:text-[#121212]">Sound</span>
              <button
                className="text-[#00E676] text-2xl hover:shadow-[0_0_10px_rgba(0,230,118,0.5)] dark:text-[#4CAF50] dark:hover:shadow-[0_0_10px_rgba(76,175,80,0.5)]"
                onClick={toggleSound}
              >
                {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#FFFFFF] text-lg dark:text-[#121212]">Theme</span>
              <button
                className="text-[#00E676] text-2xl hover:shadow-[0_0_10px_rgba(0,230,118,0.5)] dark:text-[#4CAF50] dark:hover:shadow-[0_0_10px_rgba(76,175,80,0.5)]"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? <FaMoon /> : <FaSun />}
              </button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#FFFFFF] text-lg dark:text-[#121212]">Notifications</span>
              <button
                className={`px-4 py-1 rounded-full font-semibold transition-all ${
                  notificationsEnabled
                    ? 'bg-[#00E676] text-[#121212] dark:bg-[#4CAF50]'
                    : 'bg-[#FF5722] text-[#FFFFFF] dark:bg-[#F44336]'
                }`}
                onClick={toggleNotifications}
              >
                {notificationsEnabled ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;