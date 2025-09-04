import { Link } from 'react-router-dom';

export default function Home(){
  return (
    <>
      {/* HERO */}
      <header className="hero py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="display-5 fw-bold">Transparent Giving, Real Impact</h1>
              <p className="lead">Verified charities, visible fund usage, and a safer way to support causes that matter.</p>
              <div className="d-flex gap-2">
                <Link to="/register" className="btn btn-brand btn-lg">Get Started</Link>
                <Link to="/charities" className="btn btn-outline-light btn-lg">Explore Charities</Link>
              </div>
            </div>
            <div className="col-lg-5 mt-4 mt-lg-0">
              <div className="card card-soft bg-white text-dark">
                <div className="card-body p-4">
                  <h5 className="fw-bold mb-3">Why DonorLink?</h5>
                  <ul className="mb-0 text-secondary">
                    <li>Real-time fund logs & receipts</li>
                    <li>Verified organizations & admin oversight</li>
                    <li>Campaign goals and milestone tracking</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="section">
        <div className="container container-narrow">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-graph-up-arrow text-primary fs-3"></i>
                <div className="value mt-1">Track</div>
                <div className="label">Fund usage, receipts, milestones</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-shield-check text-primary fs-3"></i>
                <div className="value mt-1">Verify</div>
                <div className="label">Charity review & admin oversight</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="stat-tile h-100">
                <i className="bi bi-heart text-primary fs-3"></i>
                <div className="value mt-1">Give</div>
                <div className="label">Support causes confidently</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-muted text-center">
        <div className="container container-narrow">
          <h3 className="fw-bold">Ready to make a difference?</h3>
          <p className="text-secondary mb-3">Join donors and charities building transparent impact.</p>
          <Link to="/register" className="btn btn-brand btn-lg">Create Account</Link>
        </div>
      </section>
    </>
  );
}
