import heroImg from '../assets/secure.jpg'; // swap for a premium image if you have one

export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="hero" style={{ minHeight: '100dvh', position: 'relative', overflow: 'hidden' }}>
      <div className="container py-5">
        <div className="row g-5 align-items-center">
          {/* Left: narrative + image */}
          <div className="col-lg-6 d-none d-lg-block">
            <div className="mb-4">
              <span className="badge bg-light text-dark mb-3">DonorLink</span>
              <h1 className="fw-bold display-6 mb-2">{title}</h1>
              <p className="lead opacity-75 mb-0">{subtitle}</p>
            </div>
            <img src={heroImg} alt="Secure" className="img-fluid rounded-4 shadow-lg" />
          </div>

          {/* Right: form card */}
          <div className="col-lg-6">
            <div className="card card-soft">
              <div className="card-body p-4 p-md-5">
                {children}
              </div>
            </div>
            <p className="text-center text-white-50 small mt-3 d-lg-none mb-0">
              DonorLink • Transparency • Impact
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
