import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import AuthProvider from './components/Auth';
import EnterChat from './components/EnterChat';
import ChatRoom from './components/ChatRoom';
import ProtectedRoute from './components/ProtectedRoute';
import Cookies from 'universal-cookie';
import Header from './components/Header';

const App = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const cookies = new Cookies();
  const isAuth = cookies.get('auth-token');
  useEffect(() => {
    if (isAuth) {
      navigate('/chat');
    }
  }, []);

  return (
    <>
      <Header isAuth={isAuth} />
      <div className="w-screen flex justify-center items-center">
        <Routes>
          <Route path="/" element={<AuthProvider setUserData={setUserData} />} />
          <Route
            path="/chat"
            element={<ProtectedRoute element={EnterChat} userData={userData} />} />
          <Route
            path="/chat/:room"
            element={<ProtectedRoute element={ChatRoom} />} />
        </Routes>
      </div></>
  );
};

export default App;
