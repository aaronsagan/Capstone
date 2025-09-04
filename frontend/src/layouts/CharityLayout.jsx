// src/layouts/CharityLayout.jsx
import { NavLink, Outlet } from 'react-router-dom';
import useMyCharity from '../hooks/useMyCharity';

export default function CharityLayout() {
  const { charity } = useMyCharity();

  return (
    <div className="container-fluid">
      <div className="row">
        {/* SIDEBAR */}
        <aside className="col-12 col-lg-3 col-xl-2 px-0 border-end bg-white dashboard-sidebar">
          {/* Brand / header */}
          <div className="p-3 border-bottom">
            <div className="d-flex align-items-center gap-2">
              <div className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                   style={{ width: 40, height: 40 }}>
                <i className="bi bi-building fs-5"></i>
              </div>
              <div className="flex-grow-1">
                <div className="fw-semibold text-truncate">
                  {charity?.name || 'My Organization'}
                </div>
                <div className="small text-secondary text-truncate">
                  {charity?.verification_status ? `Status: ${charity.verification_status}` : '—'}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile collapse trigger */}
          <button className="btn w-100 d-lg-none rounded-0 text-start sidebar-toggle" type="button"
                  data-bs-toggle="collapse" data-bs-target="#sidebarNav" aria-expanded="false">
            <i className="bi bi-list me-2"></i> Menu
          </button>

          {/* Nav */}
          <nav id="sidebarNav" className="collapse d-lg-block">
            <ul className="list-unstyled sidebar-menu m-0 py-2">
              <li>
                <NavLink end to="/charity" className="sidebar-link">
                  <i className="bi bi-speedometer2 me-2"></i> Dashboard
                </NavLink>
              </li>
              <li className="sidebar-label">Organization</li>
              <li>
                <NavLink to="/charity/organization" className="sidebar-link">
                  <i className="bi bi-building me-2"></i> Profile & Docs
                </NavLink>
              </li>
              <li>
                <NavLink to="/charity/channels" className="sidebar-link">
                  <i className="bi bi-credit-card-2-front me-2"></i> Donation Channels
                </NavLink>
              </li>

              <li className="sidebar-label mt-2">Operations</li>
              <li>
                <NavLink to="/charity/campaigns" className="sidebar-link">
                  <i className="bi bi-flag me-2"></i> Campaigns
                </NavLink>
              </li>
              <li>
                <NavLink to="/charity/inbox" className="sidebar-link">
                  <i className="bi bi-inbox me-2"></i> Donations Inbox
                </NavLink>
              </li>
              <li>
                <NavLink to="/charity/fund-usage" className="sidebar-link">
                  <i className="bi bi-journal-check me-2"></i> Fund Usage
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-12 col-lg-9 col-xl-10 py-4 px-3 px-lg-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
