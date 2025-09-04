import { useEffect, useState } from 'react';
import http from '../../api/http';

export default function About(){
  const [stats, setStats] = useState({ charities: 0, campaigns: 0, donations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      setLoading(true);
      try{
        // Prefer a /metrics endpoint if you add it
        const { data } = await http.get('/metrics');
        setStats({
          charities: Number(data.charities||0),
          campaigns: Number(data.campaigns||0),
          donations: Number(data.donations||0),
        });
      }catch{
        // Fallback (graceful)
        try{
          const res = await http.get('/charities');
          const list = Array.isArray(res.data) ? res.data : [];
          setStats(s => ({ ...s, charities: list.length }));
        }catch{}
      }finally{ setLoading(false); }
    })();
  },[]);

  return (
    <>
      <header className="hero py-5">
        <div className="container py-4">
          <h1 className="fw-bold display-6">About Us</h1>
          <p className="lead">Building trust, transparency, and impact in the world of giving.</p>
        </div>
      </header>

      <section className="section">
        <div className="container container-narrow">
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-people-fill text-primary fs-3"></i>
                <div className="value mt-1">{loading ? '…' : stats.charities}</div>
                <div className="label">Verified Charities</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-bullseye text-primary fs-3"></i>
                <div className="value mt-1">{loading ? '…' : stats.campaigns}</div>
                <div className="label">Active Campaigns</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-cash-stack text-primary fs-3"></i>
                <div className="value mt-1">{loading ? '…' : stats.donations}</div>
                <div className="label">Donations Tracked</div>
              </div>
            </div>
          </div>

          <div className="card card-soft">
            <div className="card-body p-4 p-md-5">
              <h3 className="fw-bold mb-2">Our Mission</h3>
              <p className="text-secondary mb-0">
                The Web-Based Donation Management System was created to address challenges in online giving:
                transparency, accountability, and accessibility. Our goal is to empower donors and charities with
                tools that make donation management simple, reliable, and trustworthy.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
