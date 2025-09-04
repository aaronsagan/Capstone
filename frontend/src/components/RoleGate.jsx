import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleGate({ children, allow = [] }) {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (allow.length && !allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}
