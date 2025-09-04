import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { getCharityCampaigns, listCharityDonations } from '../../api/charities';

function Tile({ icon, label, value }) {
  return (
    <div className="col-md-4">
      <div className="stat-tile h-100">
        <i className={`bi ${icon} text-primary fs-3`}></i>
        <div className="value mt-1">{value}</div>
        <div className="label">{label}</div>
      </div>
    </div>
  );
}

export default function CharityDashboard(){
  const { charity, loading } = useMyCharity();
  const [camps, setCamps] = useState(0);
  const [pending, setPending] = useState(0);
  const [verif, setVerif] = useState('—');
  const [busy, setBusy] = useState(true);

  useEffect(()=>{
    let active = true;
    (async ()=>{
      if (!charity) { setBusy(false); return; }
      setVerif(charity.verification_status || 'pending');
      try{
        const [cs, inbox] = await Promise.all([
          getCharityCampaigns(charity.id),
          listCharityDonations(charity.id).catch(()=>({ data: [] })),
        ]);
        if (!active) return;
        setCamps(Array.isArray(cs.data) ? cs.data.length : 0);
        const items = Array.isArray(inbox.data) ? inbox.data : [];
        setPending(items.filter(d => String(d.status).toLowerCase() === 'pending').length);
      } finally {
        if (active) setBusy(false);
      }
    })();
    return ()=>{ active = false; };
  }, [charity]);

  if (loading || busy) {
    return <div className="placeholder-glow container"><span className="placeholder col-6" style={{height: 38}}></span></div>;
  }

  if (!charity) {
    return (
      <div className="container">
        <div className="alert alert-warning">
          You don’t have an organization yet. If you just registered, it may be pending creation.
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2 className="fw-bold mb-0">{charity.name}</h2>
          <div className="text-secondary small">Verification: {verif}</div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <Tile icon="bi-flag" label="Campaigns" value={camps} />
        <Tile icon="bi-inbox" label="Pending Donations" value={pending} />
        <Tile icon="bi-patch-check" label="Status" value={verif} />
      </div>

      <div className="card card-soft">
        <div className="card-body">
          <h5 className="fw-bold mb-2">Next steps</h5>
          <ol className="text-secondary mb-0">
            <li>Complete your organization profile and upload verification documents.</li>
            <li>Add donation channels (GCash, bank, etc.).</li>
            <li>Create a campaign and share it with donors.</li>
            <li>Confirm donations and log fund usage for transparency.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
