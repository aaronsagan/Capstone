import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from?.pathname || '/';

  const [email, setEmail] = useState('donor@example.com');
  const [password, setPassword] = useState('password');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try {
      await login(email, password);
      nav(from, { replace: true });
    } catch {
      setErr('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back 👋"
      subtitle="Sign in to track donations, follow campaigns, and support verified causes."
    >
      <h3 className="fw-bold mb-1">Sign in</h3>
      <p className="text-secondary mb-4">Use your email and password.</p>

      {err && <div className="alert alert-danger py-2">{err}</div>}

      <form onSubmit={submit} className="vstack gap-3">
        <div className="form-floating">
          <input id="email" type="email" className="form-control" placeholder="Email"
                 value={email} onChange={e=>setEmail(e.target.value)} required />
          <label htmlFor="email">Email</label>
        </div>

        <div className="form-floating position-relative">
          <input id="password" type={showPass ? 'text' : 'password'} className="form-control pe-5"
                 placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} required />
          <label htmlFor="password">Password</label>
          <button type="button"
                  className="btn btn-link position-absolute top-50 end-0 translate-middle-y me-2 p-0 text-decoration-none"
                  onClick={()=>setShowPass(s=>!s)} aria-label="Toggle password">
            <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} fs-5`}></i>
          </button>
        </div>

        <button className="btn btn-brand btn-lg w-100" disabled={loading}>
          {loading ? 'Signing in…' : 'Login'}
        </button>
      </form>

      <div className="text-center mt-3">
        <small className="text-secondary">
          New here? <Link to="/register">Create an account</Link>
        </small>
      </div>
    </AuthLayout>
  );
}
