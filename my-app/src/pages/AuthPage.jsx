import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { FcGoogle } from 'react-icons/fc';
import { MdOutlinePhone } from 'react-icons/md';
import axios from 'axios';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState('');
  const { user, login } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("hello world!");
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
      const response = await axios.post(`${process.env.REACT_APP_API_URL}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = response.data;
      if (data.token) {
        localStorage.setItem('token', data.token);
        login(data.user);
        console.log(data.user);
        navigate('/dashboard');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const logout = () => {
    setUser(null);
    //setBalance(100);
    localStorage.removeItem('token');
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 dark:text-white">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border-2 border-yellow-500/30">
        <div className="flex mb-6">
          <button className={`flex-1 py-2 ${isLogin ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700 text-gray-400'} rounded-l-lg`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`flex-1 py-2 ${!isLogin ? 'bg-yellow-500/20 text-yellow-300' : 'bg-gray-700 text-gray-400'} rounded-r-lg`} onClick={() => setIsLogin(false)}>Sign Up</button>
        </div>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-4">
              <label className="block text-yellow-300 text-sm font-bold mb-2">Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50" placeholder="Enter your name" />
            </div>
          )}
          <div className="mb-4">
            <label className="block text-yellow-300 text-sm font-bold mb-2">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50" placeholder="Enter your email" />
          </div>
          <div className="mb-6">
            <label className="block text-yellow-300 text-sm font-bold mb-2">Password</label>
            <input type="password" name="password" value={formData.password} onChange={handleInputChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/50" placeholder="Enter your password" />
          </div>
          <button type="submit" className={`w-full py-2 rounded-lg ${isLogin ? 'bg-yellow-500 text-gray-900 glow-gold' : 'bg-gradient-to-r from-green-400 to-green-600 text-white glow-green'} hover:scale-105 transition-all`}>{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        {isLogin && <p className="mt-4 text-center text-sm text-gray-400">Forgot Password? <a href="#" className="text-yellow-400 underline glow">Reset it</a></p>}
        {!isLogin && (
          <div className="mt-6">
            <p className="text-center text-gray-400 mb-4">Or sign up with</p>
            <div className="flex justify-center gap-4">
              <button className="bg-white p-2 rounded-full hover:scale-110 transition-all"><FcGoogle size={24} /></button>
              <button className="bg-gray-700 p-2 rounded-full hover:scale-110 transition-all"><MdOutlinePhone size={24} className="text-yellow-400" /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;