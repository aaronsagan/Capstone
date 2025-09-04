import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { isAuthenticated, user, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white border-bottom">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/">DonorLink</NavLink>

          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#nav"
                  aria-controls="nav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="nav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item"><NavLink className="nav-link" to="/charities">Charities</NavLink></li>
              <li className="nav-item"><NavLink className="nav-link" to="/about">About</NavLink></li>

              {!isAuthenticated ? (
                <>
                  <li className="nav-item"><NavLink className="nav-link" to="/login">Login</NavLink></li>
                  <li className="nav-item">
                    <NavLink className="btn btn-primary ms-lg-2" to="/register">Sign Up</NavLink>
                  </li>
                </>
              ) : (
                <li className="nav-item dropdown ms-lg-3">
                  <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    {user?.name || 'Account'}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    {role === 'donor' && <li><NavLink className="dropdown-item" to="/me">My donations</NavLink></li>}
                    {role === 'charity_admin' && <li><NavLink className="dropdown-item" to="/charity">Charity admin</NavLink></li>}
                    {/* {role === 'admin' && <li><NavLink className="dropdown-item" to="/admin">System admin</NavLink></li>} */}
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item" onClick={handleLogout}>Log out</button></li>
                  </ul>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />

      <footer className="border-top mt-5">
        <div className="container py-4 text-secondary small">
          © {new Date().getFullYear()} DonorLink
        </div>
      </footer>
    </>
  );
}
