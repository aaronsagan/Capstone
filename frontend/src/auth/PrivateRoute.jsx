import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export default function PrivateRoute({ children, allowRoles }) {
  const { user, booted } = useAuth();

  if (!booted) return null; // or a loader
  if (!user) return <Navigate to="/login" replace />;

  if (allowRoles && !allowRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
}
