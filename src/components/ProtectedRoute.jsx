import React from 'react';
import { Navigate } from 'react-router';
import { useAppContext } from '../context/context';

const ProtectedRoute = ({ children }) => {
  const { token, user } = useAppContext();

  const localToken = localStorage.getItem('token');
  const localUser = localStorage.getItem('user');
  

  const isAuthenticated = !!token || !!user || !!localToken || !!localUser;

  

  if (!isAuthenticated) {

    return <Navigate to="/auth" replace />;
  }


  return children;
};

export default ProtectedRoute;