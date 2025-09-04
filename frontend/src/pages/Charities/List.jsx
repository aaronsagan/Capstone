import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { listCharities } from '../../api/charities';

function CardSkeleton(){
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card card-soft placeholder-wave">
        <div className="card-body">
          <h5 className="card-title"><span className="placeholder col-8"></span></h5>
          <p className="card-text"><span className="placeholder col-12"></span><span className="placeholder col-10"></span></p>
          <div className="d-flex gap-2">
            <span className="btn btn-outline-secondary disabled placeholder col-4"></span>
            <span className="btn btn-brand disabled placeholder col-3"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CharitiesList(){
  const [params, setParams] = useSearchParams();
  const initialQ = params.get('q') || '';
  const [q, setQ] = useState(initialQ);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const debouncedQ = useDebounce(q, 400);

  useEffect(() => {
    setParams(prev => {
      const p = new URLSearchParams(prev);
      if (q) p.set('q', q); else p.delete('q');
      return p;
    }, { replace: true });
  }, [q, setParams]);

  useEffect(() => {
    let active = true;
    (async ()=>{
      setLoading(true);
      try{
        const { data } = await listCharities({ q: debouncedQ || undefined });
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, [debouncedQ]);

  return (
    <div className="container py-5">
      {/* header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h2 className="fw-bold mb-0">Charities</h2>
          <div className="text-secondary small">Browse verified organizations and support their campaigns.</div>
        </div>
        <div className="input-group" style={{ maxWidth: 360 }}>
          <input
            className="form-control"
            placeholder="Search by name or mission…"
            value={q} onChange={(e)=>setQ(e.target.value)}
          />
          <button className="btn btn-outline-secondary" onClick={()=>setQ('')}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>
      </div>

      {/* grid */}
      {loading ? (
        <div className="row g-3">
          {Array.from({ length: 6 }).map((_,i)=><CardSkeleton key={i} />)}
        </div>
      ) : items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="row g-3">
          {items.map(c => (
            <div key={c.id} className="col-md-6 col-lg-4">
              <div className="card card-soft h-100">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex align-items-start justify-content-between">
                    <h5 className="card-title mb-1">{c.name}</h5>
                    {c.verification_status && (
                      <span className="badge text-bg-light">{c.verification_status}</span>
                    )}
                  </div>
                  <p className="text-secondary mb-3" style={{minHeight: '3rem'}}>
                    {c.mission || '—'}
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <Link className="btn btn-outline-secondary" to={`/charities/${c.id}`}>
                      Details
                    </Link>
                    <Link className="btn btn-brand" to={`/donate/${c.id}`}>
                      Donate
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function EmptyState(){
  return (
    <div className="text-center py-5">
      <div className="display-6 mb-2">No results</div>
      <p className="text-secondary">Try a different keyword or check back later.</p>
    </div>
  );
}

/* small debounce hook */
function useDebounce(value, delay=400){
  const [v, setV] = useState(value);
  useEffect(()=>{
    const id = setTimeout(()=> setV(value), delay);
    return ()=> clearTimeout(id);
  }, [value, delay]);
  return v;
}
