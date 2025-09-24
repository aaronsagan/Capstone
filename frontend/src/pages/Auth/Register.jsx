import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import http from '../../api/http';

export default function Register() {
  const nav = useNavigate();
  const [role, setRole] = useState('donor');

  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Charity-only
  const [org, setOrg] = useState('');
  const [mission, setMission] = useState('');
  const [doc, setDoc] = useState(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const fullName = useMemo(() => `${first.trim()} ${last.trim()}`.trim(), [first, last]);
  const passMatch = password && confirm && password === confirm;

  const submit = async (e) => {
    e.preventDefault(); setErr(''); setOk('');
    if (!passMatch) { setErr('Passwords do not match'); return; }
    setLoading(true);
    try {
      if (role === 'donor') {
        await http.post('/auth/register', { 
          name: fullName, 
          email, 
          password,
          password_confirmation: confirm
        });
      } else {
        const form = new FormData();
        form.append('name', fullName);
        form.append('email', email);
        form.append('password', password);
        form.append('password_confirmation', confirm);
        form.append('organization_name', org);
        form.append('mission', mission);
        if (doc) form.append('document', doc);
        await http.post('/auth/register-charity', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      setOk('Account created! Redirecting to login…');
      setTimeout(() => nav('/login'), 900);
    } catch (e) {
      const resp = e?.response;
      const msg = resp?.data?.message || (resp?.status === 422 ? 'Validation failed. Please correct the highlighted fields.' : null);
      const firstValidationError = resp?.data?.errors && Object.values(resp.data.errors)[0]?.[0];
      setErr(firstValidationError || msg || 'Registration failed. Please check your inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account ✨"
      subtitle="Join donors and charities building transparent impact."
    >
      <h3 className="fw-bold mb-1">Sign up</h3>
      <p className="text-secondary mb-4">Choose your role and fill in your details.</p>

      {err && <div className="alert alert-danger py-2">{err}</div>}
      {ok && <div className="alert alert-success py-2">{ok}</div>}

      <form onSubmit={submit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Role</label>
          <select className="form-select" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="donor">Donor</option>
            <option value="charity">Charity Admin</option>
          </select>
        </div>

        <div className="col-md-4">
          <div className="form-floating">
            <input id="first" className="form-control" placeholder="First" value={first} onChange={e=>setFirst(e.target.value)} required />
            <label htmlFor="first">First name</label>
          </div>
        </div>
        <div className="col-md-4">
          <div className="form-floating">
            <input id="last" className="form-control" placeholder="Last" value={last} onChange={e=>setLast(e.target.value)} required />
            <label htmlFor="last">Last name</label>
          </div>
        </div>

        <div className="col-md-6">
          <div className="form-floating">
            <input id="email" type="email" className="form-control" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <label htmlFor="email">Email</label>
          </div>
        </div>

        <div className="col-md-3">
          <label className="form-label">Password</label>
          <div className="input-group">
            <input type={showPass ? 'text' : 'password'} className="form-control" value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="new-password" />
            <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowPass(s=>!s)}>
              <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="col-md-3">
          <label className="form-label">Confirm</label>
          <div className="input-group">
            <input type={showConfirm ? 'text' : 'password'} className={`form-control ${confirm && !passMatch ? 'is-invalid' : ''}`} value={confirm} onChange={e=>setConfirm(e.target.value)} required autoComplete="new-password" />
            <button type="button" className="btn btn-outline-secondary" onClick={()=>setShowConfirm(s=>!s)}>
              <i className={`bi ${showConfirm ? 'bi-eye-slash' : 'bi-eye'}`}></i>
            </button>
            {!passMatch && confirm && <div className="invalid-feedback">Passwords do not match</div>}
          </div>
        </div>

        {role === 'charity' && (
          <>
            <div className="col-md-6">
              <div className="form-floating">
                <input id="org" className="form-control" placeholder="Organization" value={org} onChange={e=>setOrg(e.target.value)} required />
                <label htmlFor="org">Organization Name</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input id="mission" className="form-control" placeholder="Mission" value={mission} onChange={e=>setMission(e.target.value)} required />
                <label htmlFor="mission">Mission</label>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Verification Document (PDF/JPG/PNG)</label>
              <input className="form-control" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>setDoc(e.target.files?.[0]||null)} />
              <div className="form-text">Optional now; can be uploaded later.</div>
            </div>
          </>
        )}

        <div className="col-12">
          <button className="btn btn-brand btn-lg w-100" disabled={loading}>
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </div>
      </form>

      <p className="text-center text-secondary small mt-3 mb-0">
        By continuing you agree to our terms and privacy policy.
      </p>
    </AuthLayout>
  );
}
