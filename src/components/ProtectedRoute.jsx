import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'universal-cookie';

const ProtectedRoute = ({ element: Component, ...rest }) => {
    const cookies = new Cookies();
    const isAuth = cookies.get('auth-token');

    return isAuth ? <Component {...rest} /> : <Navigate to="/" />;
};

export default ProtectedRoute;
