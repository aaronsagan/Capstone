export default function Footer(){
  return (
    <footer className="footer py-4 mt-5">
      <div className="container d-flex flex-wrap align-items-center justify-content-between gap-3">
        <span className="text-muted">© {new Date().getFullYear()} DonorLink</span>
        <div className="d-flex gap-3">
          <a className="text-muted" href="/about">About</a>
          <a className="text-muted" href="/charities">Charities</a>
        </div>
      </div>
    </footer>
  );
}
