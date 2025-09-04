import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar(){
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(()=>{
    const onStorage = ()=> setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return ()=> window.removeEventListener('storage', onStorage);
  },[]);

  const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-modern sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">DonorLink</Link>

        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div id="navMain" className="collapse navbar-collapse">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>
            <li className="nav-item"><NavLink className="nav-link" to="/charities">Charities</NavLink></li>
          </ul>

          {!token ? (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-secondary" to="/login">Login</Link>
              <Link className="btn btn-brand" to="/register">Get Started</Link>
            </div>
          ) : (
            <div className="d-flex gap-2">
              <Link className="btn btn-outline-secondary" to="/me">My Account</Link>
              <button className="btn btn-brand" onClick={logout}><i className="bi bi-box-arrow-right me-1"></i>Logout</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
