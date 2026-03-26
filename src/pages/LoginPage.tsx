import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState<'login' | 'register'>('login');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const submit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError(''); setLoading(true);
    try {
      mode === 'login' ? await login(email, password) : await register(email, password);
      onSuccess();
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async (credentialResponse: any) => {
    setError(''); setLoading(true);
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const text = await res.text();
      if (!res.ok) {
        const e = JSON.parse(text);
        throw new Error(e.detail || 'Google login failed');
      }
      const data = JSON.parse(text);
      sessionStorage.setItem('bs_token', data.access_token);
      sessionStorage.setItem('bs_email', data.user_email);
      window.location.reload();
    } catch (e: any) {
      setError(e.message || 'Google login failed');
    } finally {
      setLoading(false);
    }
  };

  const continueAsGuest = () => {
    sessionStorage.setItem('bs_token', 'guest');
    sessionStorage.setItem('bs_email', 'Guest User');
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#0a0014' }}>
      <div className="w-full max-w-md p-8 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(139,92,246,0.3)',
          backdropFilter: 'blur(20px)',
        }}>

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/IMG_20251231_144047__1_-removebg-preview.png"
            alt="BillScan" className="h-16 mx-auto mb-2" />
          <h1 className="text-2xl font-bold text-white">BillScan AI</h1>
          <p className="text-sm mt-1" style={{ color: '#c4b5fd' }}>
            {mode === 'login' ? 'Welcome back!' : 'Create your free account'}
          </p>
        </div>

        {/* Toggle */}
        <div className="flex rounded-xl overflow-hidden mb-6"
          style={{ border: '1px solid rgba(139,92,246,0.3)' }}>
          {(['login', 'register'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }}
              className="flex-1 py-2.5 text-sm font-semibold transition-all"
              style={{
                background: mode === m ? 'rgba(139,92,246,0.4)' : 'transparent',
                color: mode === m ? 'white' : '#a78bfa',
              }}>
              {m === 'login' ? '🔐 Login' : '✨ Register'}
            </button>
          ))}
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-1" style={{ color: '#c4b5fd' }}>Email</label>
            <input type="email" value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(139,92,246,0.3)' }} />
          </div>
          <div>
            <label className="block text-sm mb-1" style={{ color: '#c4b5fd' }}>Password</label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && submit()}
              placeholder={mode === 'register' ? 'Min 8 chars, 1 uppercase, 1 number' : '••••••••'}
              className="w-full px-4 py-3 rounded-xl text-white outline-none"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(139,92,246,0.3)' }} />
          </div>

          {/* Error */}
          {error && (
            <div className="p-3 rounded-xl text-sm"
              style={{ background: 'rgba(239,68,68,0.15)', color: '#fca5a5' }}>
              ❌ {error}
            </div>
          )}

          {/* Submit */}
          <button onClick={submit} disabled={loading}
            className="w-full py-3 rounded-xl font-semibold text-white transition-all hover:scale-105 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #7c3aed, #a855f7)' }}>
            {loading ? '⏳ Please wait...' : mode === 'login' ? '🔐 Login' : '✨ Create Account'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.3)' }} />
            <span className="text-xs" style={{ color: '#7c3aed' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.3)' }} />
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => setError('Google login failed. Please try again.')}
              theme="filled_black"
              shape="rectangular"
              size="large"
              text={mode === 'login' ? 'signin_with' : 'signup_with'}
              width="368"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.1)' }} />
            <span className="text-xs" style={{ color: '#6b7280' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(139,92,246,0.1)' }} />
          </div>

          {/* Guest Button */}
          <button
            onClick={continueAsGuest}
            className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: '#9ca3af',
            }}>
            👤 Continue as Guest
          </button>

          {/* Guest warning */}
          <p className="text-center text-xs" style={{ color: '#6b7280' }}>
            Guest mode — bill history won't be saved
          </p>
        </div>
      </div>
    </div>
  );
}