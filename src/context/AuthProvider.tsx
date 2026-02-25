import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<{ email: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = sessionStorage.getItem('bs_token');
    const e = sessionStorage.getItem('bs_email');
    if (t && e) { setToken(t); setUser({ email: e }); }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    if (!res.ok) { const e = JSON.parse(text); throw new Error(e.detail || 'Login failed'); }
    const data = JSON.parse(text);
    setToken(data.access_token);
    setUser({ email: data.user_email });
    sessionStorage.setItem('bs_token', data.access_token);
    sessionStorage.setItem('bs_email', data.user_email);
  };

  const register = async (email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const text = await res.text();
    if (!res.ok) { const e = JSON.parse(text); throw new Error(e.detail || 'Registration failed'); }
    const data = JSON.parse(text);
    setToken(data.access_token);
    setUser({ email: data.user_email });
    sessionStorage.setItem('bs_token', data.access_token);
    sessionStorage.setItem('bs_email', data.user_email);
  };

  const logout = () => {
    setUser(null); setToken(null);
    sessionStorage.removeItem('bs_token');
    sessionStorage.removeItem('bs_email');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
