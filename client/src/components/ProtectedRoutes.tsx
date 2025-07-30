import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { JSX } from 'react';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const jwt = Cookies.get('jwt_hp'); 

  if (!jwt) {
    return <Navigate to="/create" replace />;
  }

  return children;
}
