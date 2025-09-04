import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { getCharityChannels, createChannel, deleteChannel } from '../../api/charities';

const CHANNEL_TYPES = [
  { value: 'gcash', label: 'GCash' },
  { value: 'bank', label: 'Bank' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'paymaya', label: 'PayMaya' },
  { value: 'other', label: 'Other' },
];

export default function Channels(){
  const { charity, loading } = useMyCharity();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // form state
  const [type, setType] = useState('gcash');
  const [accountName, setAccountName] = useState('');
  const [accountNo, setAccountNo] = useState('');
  const [details, setDetails] = useState('');

  useEffect(()=>{
    if (!charity?.id) return;
    let active = true;
    (async ()=>{
      try{
        const { data } = await getCharityChannels(charity.id);
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      }catch{
        setItems([]);
      }
    })();
    return ()=>{ active = false; };
  }, [charity?.id]);

  const resetForm = ()=>{
    setType('gcash'); setAccountName(''); setAccountNo(''); setDetails('');
  };

  const submit = async (e)=>{
    e.preventDefault(); if (!charity?.id) return;
    setBusy(true); setMsg({type:'', text:''});
    try{
      const payload = {
        type,
        account_name: accountName || undefined,
        account_no: accountNo || undefined,
        details: details || undefined,
      };
      const { data } = await createChannel(charity.id, payload);
      setItems(prev => [data, ...prev]); // optimistic prepend
      setMsg({ type:'success', text:'Channel added.' });
      resetForm();
    }catch{
      setMsg({ type:'danger', text:'Could not add channel.' });
    }finally{
      setBusy(false);
    }
  };

  const remove = async (id)=>{
    if (!charity?.id) return;
    if (!confirm('Delete this channel?')) return;
    try{
      await deleteChannel(charity.id, id);
      setItems(prev => prev.filter(x => Number(x.id) !== Number(id)));
    }catch{
      alert('Delete failed.');
    }
  };

  if (loading) return <div className="container py-5"><span className="placeholder col-6" /></div>;
  if (!charity) return <div className="container py-5"><div className="alert alert-warning">No organization found.</div></div>;

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fw-bold mb-0">Donation Channels</h2>
        <span className="badge text-bg-light">For: {charity.name}</span>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      {/* create form */}
      <div className="card card-soft mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={submit}>
            <div className="col-md-3">
              <label className="form-label">Type</label>
              <select className="form-select" value={type} onChange={e=>setType(e.target.value)}>
                {CHANNEL_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input className="form-control" id="account_name" placeholder="Account name"
                       value={accountName} onChange={e=>setAccountName(e.target.value)} />
                <label htmlFor="account_name">Account name</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input className="form-control" id="account_no" placeholder="Account no"
                       value={accountNo} onChange={e=>setAccountNo(e.target.value)} />
                <label htmlFor="account_no">Account no</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input className="form-control" id="details" placeholder="Details"
                       value={details} onChange={e=>setDetails(e.target.value)} />
                <label htmlFor="details">Details / Notes</label>
              </div>
            </div>

            <div className="col-12">
              <button className="btn btn-brand" disabled={busy}>
                {busy ? 'Adding…' : 'Add channel'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* list */}
      <div className="card card-soft">
        <div className="card-body p-0">
          {items.length === 0 ? (
            <div className="p-4 text-center text-secondary">No channels yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Type</th>
                    <th>Account name</th>
                    <th>Account no</th>
                    <th>Details</th>
                    <th style={{width:100}}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(ch => (
                    <tr key={ch.id}>
                      <td className="text-capitalize">{ch.type}</td>
                      <td>{ch.account_name || '—'}</td>
                      <td>{ch.account_no || '—'}</td>
                      <td>{ch.details || '—'}</td>
                      <td className="text-end">
                        <button className="btn btn-outline-danger btn-sm" onClick={()=>remove(ch.id)}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </td>
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
