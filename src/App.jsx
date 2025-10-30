import React from 'react'
import Dashboard from './components/Dashboard'
import Auth from './pages/Auth'
import { Routes, Route, Navigate } from 'react-router'
import Home from './pages/Home'
import { Toaster } from 'react-hot-toast';
import { useAppContext } from './context/context';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Root />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />

        <Route path="/auth" element={<Auth />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App

const Root = () => {
  const { token, user } = useAppContext();

  const isAuthenticated = !token || !user;

  return isAuthenticated ?  <Navigate to="/auth" replace />: <Navigate to="/home" replace />;
};