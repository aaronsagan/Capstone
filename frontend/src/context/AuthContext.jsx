import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import http from '../api/http';

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('auth_user');
    try { return raw ? JSON.parse(raw) : null; } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  // bootstrap: if we have a token but no user, try /me
  useEffect(() => {
    let active = true;
    (async () => {
      if (!token || user) return; // nothing to do
      setLoading(true);
      try {
        const { data } = await http.get('/me');
        if (!active) return;
        setUser(data || null);
        localStorage.setItem('auth_user', JSON.stringify(data || null));
      } catch {
        // token invalid → clear
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        setToken('');
        setUser(null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [token, user]);

  const login = async (email, password) => {
    // Adjust this block to match your API response shape
    // Expecting: { token, user }
    const { data } = await http.post('/auth/login', { email, password });
    const gotToken = data?.token;
    const gotUser  = data?.user;

    if (!gotToken) throw new Error('No token returned');

    localStorage.setItem('auth_token', gotToken);
    localStorage.setItem('auth_user', JSON.stringify(gotUser || null));
    setToken(gotToken);
    setUser(gotUser || null);

    return gotUser || null;
  };

  const logout = async () => {
    try { await http.post('/auth/logout'); } catch { /* ignore */ }
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setToken('');
    setUser(null);
  };

  const value = useMemo(() => ({
    token, user, role: user?.role || null, loading,
    isAuthenticated: !!token,
    login, logout,
  }), [token, user, loading]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);
