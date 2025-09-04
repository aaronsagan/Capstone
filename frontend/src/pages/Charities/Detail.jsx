import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getCharity, getCharityCampaigns, getCharityChannels } from '../../api/charities';

function Line({icon, label, children}){
  return (
    <div className="d-flex align-items-start gap-2">
      <i className={`bi ${icon} text-primary mt-1`}></i>
      <div><div className="text-muted small">{label}</div><div>{children || '—'}</div></div>
    </div>
  );
}

export default function CharityDetail(){
  const { id } = useParams();
  const [charity, setCharity] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let active = true;
    (async ()=>{
      setLoading(true);
      try{
        const c = await getCharity(id);
        const k = await getCharityCampaigns(id);
        const ch = await getCharityChannels(id).catch(()=>({ data: [] }));
        if (!active) return;
        setCharity(c.data || null);
        setCampaigns(Array.isArray(k.data) ? k.data : []);
        setChannels(Array.isArray(ch.data) ? ch.data : []);
      } finally { if (active) setLoading(false); }
    })();
    return ()=>{ active = false; };
  }, [id]);

  if (loading) return <PageSkeleton />;
  if (!charity) return <NotFound />;

  return (
    <div className="container py-5">
      <div className="row g-4">
        {/* main */}
        <div className="col-lg-8">
          <div className="card card-soft mb-3">
            <div className="card-body">
              <div className="d-flex align-items-start justify-content-between">
                <div>
                  <h2 className="fw-bold mb-1">{charity.name}</h2>
                  <div className="text-secondary">{charity.reg_no ? `Reg. No. ${charity.reg_no}` : ''}</div>
                </div>
                {charity.verification_status && (
                  <span className="badge text-bg-light">{charity.verification_status}</span>
                )}
              </div>
              <hr />
              <p className="text-secondary mb-0">{charity.mission || '—'}</p>
            </div>
          </div>

          {/* campaigns */}
          <div className="d-flex align-items-center justify-content-between mb-2">
            <h5 className="mb-0">Campaigns</h5>
            {campaigns.length > 0 && <span className="text-secondary small">{campaigns.length} listed</span>}
          </div>
          <div className="row g-3">
            {campaigns.length === 0 ? (
              <div className="col-12">
                <div className="border rounded-3 p-4 text-center text-secondary">No campaigns yet.</div>
              </div>
            ) : campaigns.map(c => (
              <div key={c.id} className="col-md-6">
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h6 className="fw-semibold mb-1">{c.title}</h6>
                    <p className="text-secondary">{c.description || '—'}</p>
                    <div className="mt-auto d-flex gap-2">
                      <Link to={`/donate/${charity.id}/${c.id}`} className="btn btn-brand btn-sm">
                        Donate
                      </Link>
                      <Link to={`/charities/${charity.id}`} className="btn btn-outline-secondary btn-sm">
                        Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* sidebar */}
        <aside className="col-lg-4">
          <div className="card card-soft">
            <div className="card-body">
              <h5 className="mb-3">Donate to {charity.name}</h5>
              <div className="vstack gap-2 mb-3">
                <Line icon="bi-envelope" label="Email">{charity.contact_email}</Line>
                <Line icon="bi-telephone" label="Phone">{charity.contact_phone}</Line>
                <Line icon="bi-globe" label="Website">
                  {charity.website ? <a href={/^https?:/.test(charity.website) ? charity.website : `https://${charity.website}`} target="_blank" rel="noreferrer">{charity.website}</a> : '—'}
                </Line>
              </div>

              <Link to={`/donate/${charity.id}`} className="btn btn-brand w-100 mb-2">
                General Donation
              </Link>

              <div className="mt-3">
                <h6 className="mb-2">Channels</h6>
                {channels.length === 0 ? (
                  <div className="text-secondary small">No channels listed.</div>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {channels.map(ch => (
                      <li key={ch.id} className="d-flex align-items-center gap-2 mb-1">
                        <i className="bi bi-credit-card-2-front"></i>
                        <span className="small">{ch.type}: {ch.details || ch.account_name || ch.account_no || '—'}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PageSkeleton(){
  return (
    <div className="container py-5">
      <div className="placeholder-glow">
        <div className="placeholder col-6 mb-3" style={{height: '38px'}}></div>
        <div className="placeholder col-12 mb-2"></div>
        <div className="placeholder col-10 mb-2"></div>
        <div className="placeholder col-8 mb-4"></div>
      </div>
      <div className="row g-3">
        {Array.from({length:4}).map((_,i)=>(
          <div key={i} className="col-md-6">
            <div className="card placeholder-wave">
              <div className="card-body">
                <div className="placeholder col-8 mb-2"></div>
                <div className="placeholder col-12 mb-2"></div>
                <div className="placeholder col-10 mb-3"></div>
                <div className="d-flex gap-2">
                  <span className="btn btn-outline-secondary disabled placeholder col-4"></span>
                  <span className="btn btn-brand disabled placeholder col-3"></span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NotFound(){
  return (
    <div className="container py-5">
      <h3 className="fw-bold">Charity not found</h3>
      <p className="text-secondary">The requested charity does not exist or has been removed.</p>
    </div>
  );
}
