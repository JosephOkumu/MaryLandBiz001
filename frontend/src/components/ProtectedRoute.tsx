import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Assumes AuthContext is in the same directory or adjust path

const ProtectedRoute: React.FC = () => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You might want to render a global loading spinner here
    // or a more specific one depending on your UI/UX preferences.
    return <div>Loading authentication status...</div>; // Or return null if App.tsx handles global loading
  }

  if (!currentUser) {
    // User is not logged in, redirect them to the /admin/login page.
    // Pass the current location so we can redirect back after login (optional).
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render the child route content.
  return <Outlet />;
};

export default ProtectedRoute;
