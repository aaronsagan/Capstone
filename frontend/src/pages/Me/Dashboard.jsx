import { useEffect, useMemo, useState } from 'react';
import { myDonations } from '../../api/donations';

function Badge({ status }){
  const map = {
    pending: 'warning',
    completed: 'success',
    rejected: 'danger',
    confirmed: 'info',
  };
  const tone = map[String(status || '').toLowerCase()] || 'secondary';
  return <span className={`badge text-bg-${tone} text-capitalize`}>{status || '—'}</span>;
}

export default function MeDashboard(){
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let active = true;
    (async ()=>{
      setLoading(true);
      try{
        const { data } = await myDonations();
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      }finally{
        if (active) setLoading(false);
      }
    })();
    return ()=>{ active = false; };
  },[]);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-1">My Donations</h2>
      <p className="text-secondary">Track your donations and their statuses.</p>

      <div className="card card-soft">
        <div className="card-body p-0">
          {loading ? (
            <TableSkeleton />
          ) : items.length === 0 ? (
            <div className="p-4 text-center text-secondary">No donations yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: 90}}>ID</th>
                    <th>Charity</th>
                    <th>Campaign</th>
                    <th>Purpose</th>
                    <th className="text-end">Amount</th>
                    <th>Status</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(d => (
                    <tr key={d.id}>
                      <td className="fw-semibold">#{d.id}</td>
                      <td>{d.charity?.name || d.charity_name || d.charity_id || '—'}</td>
                      <td>{d.campaign?.title || d.campaign_title || d.campaign_id || '—'}</td>
                      <td className="text-capitalize">{d.purpose || '—'}</td>
                      <td className="text-end">₱ {formatCurrency(d.amount)}</td>
                      <td><Badge status={d.status} /></td>
                      <td>{formatDate(d.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TableSkeleton(){
  return (
    <div className="p-4">
      {Array.from({length:5}).map((_,i)=>(
        <div key={i} className="placeholder-glow mb-3">
          <span className="placeholder col-2 me-2"></span>
          <span className="placeholder col-3 me-2"></span>
          <span className="placeholder col-2 me-2"></span>
          <span className="placeholder col-2 me-2"></span>
          <span className="placeholder col-2"></span>
        </div>
      ))}
    </div>
  );
}

function formatCurrency(n){
  const v = Number(n || 0);
  return v.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function formatDate(s){
  if (!s) return '—';
  const d = new Date(s);
  if (isNaN(d)) return s;
  return d.toLocaleString();
}
