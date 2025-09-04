import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { getCharityCampaigns, getFundUsageLogs, createFundUsage } from '../../api/charities';

export default function FundUsage(){
  const { charity, loading } = useMyCharity();
  const [campaigns, setCampaigns] = useState([]);
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(()=>{
    if (!charity?.id) return;
    (async()=>{
      try{
        const { data } = await getCharityCampaigns(charity.id);
        setCampaigns(Array.isArray(data) ? data : []);
      }catch{ setCampaigns([]); }
    })();
  }, [charity?.id]);

  const loadLogs = async (id)=>{
    setSelected(id); setLogs([]);
    try{
      const { data } = await getFundUsageLogs(id);
      setLogs(Array.isArray(data) ? data : []);
    }catch{ setLogs([]); }
  };

  const submit = async (e)=>{
    e.preventDefault(); if (!selected) return;
    setBusy(true);
    try{
      const payload = { description: desc, amount: Number(amount) };
      const { data } = await createFundUsage(selected, payload);
      setLogs(prev => [data, ...prev]);
      setDesc(''); setAmount('');
    }catch{
      alert('Failed to add fund usage.');
    }finally{ setBusy(false); }
  };

  if (loading) return <div className="container py-5"><span className="placeholder col-6" /></div>;
  if (!charity) return <div className="container py-5"><div className="alert alert-warning">No organization found.</div></div>;

  return (
    <div className="container">
      <h2 className="fw-bold mb-3">Fund Usage Logs</h2>

      {/* Select campaign */}
      <div className="mb-4">
        <label className="form-label">Choose campaign</label>
        <select className="form-select" value={selected||''} onChange={e=>loadLogs(e.target.value)}>
          <option value="">— Select campaign —</option>
          {campaigns.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selected && (
        <>
          {/* Form */}
          <div className="card card-soft mb-4">
            <div className="card-body">
              <form className="row g-3" onSubmit={submit}>
                <div className="col-md-8">
                  <div className="form-floating">
                    <input className="form-control" id="desc" placeholder="Description"
                           value={desc} onChange={e=>setDesc(e.target.value)} required />
                    <label htmlFor="desc">Description</label>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-floating">
                    <input type="number" step="0.01" className="form-control" id="amount" placeholder="Amount"
                           value={amount} onChange={e=>setAmount(e.target.value)} required />
                    <label htmlFor="amount">Amount (₱)</label>
                  </div>
                </div>
                <div className="col-12">
                  <button className="btn btn-brand" disabled={busy}>
                    {busy ? 'Saving…' : 'Add usage'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Logs list */}
          <div className="card card-soft">
            <div className="card-body p-0">
              {logs.length === 0 ? (
                <div className="p-4 text-center text-secondary">No fund usage logs yet.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table mb-0 align-middle">
                    <thead className="table-light">
                      <tr>
                        <th>ID</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map(l => (
                        <tr key={l.id}>
                          <td>#{l.id}</td>
                          <td>{l.description}</td>
                          <td>₱ {Number(l.amount).toLocaleString()}</td>
                          <td>{l.created_at ? new Date(l.created_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
