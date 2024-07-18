import React, { useState } from 'react';

import AuthProvider from './components/Auth';

import { Routes, Route, useLocation } from 'react-router-dom';

const App = () => {
  const [userData, setUserData] = useState(null);

  return (
    <Routes>
      <Route
        path="/"
        element={<AuthProvider setUserData={setUserData} />} />
    </Routes>
  );
};

export default App;
