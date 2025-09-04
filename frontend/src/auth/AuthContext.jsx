import { createContext, useContext, useEffect, useState } from 'react';
import { me } from '../api/auth';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { setBooted(true); return; }
    me().then(setUser).catch(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    }).finally(() => setBooted(true));
  }, []);

  return (
    <AuthCtx.Provider value={{ user, setUser, booted }}>
      {children}
    </AuthCtx.Provider>
  );
}
