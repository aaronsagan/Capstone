import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { getCharityCampaigns, createCampaign, updateCampaign, deleteCampaign } from '../../api/charities';

export default function Campaigns(){
  const { charity, loading } = useMyCharity();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // form
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [goal, setGoal] = useState('');

  // edit
  const [editing, setEditing] = useState(null); // campaign object or null

  useEffect(()=>{
    if (!charity?.id) return;
    let active = true;
    (async ()=>{
      try{
        const { data } = await getCharityCampaigns(charity.id);
        if (!active) return;
        setItems(Array.isArray(data) ? data : []);
      }catch{ setItems([]); }
    })();
    return ()=>{ active = false; };
  }, [charity?.id]);

  const resetForm = () => { setTitle(''); setDesc(''); setGoal(''); };

  const submitCreate = async (e)=>{
    e.preventDefault(); if (!charity?.id) return;
    setBusy(true); setMsg({type:'', text:''});
    try{
      const payload = {
        title,
        description: desc || undefined,
        goal_amount: goal ? Number(goal) : undefined,
      };
      const { data } = await createCampaign(charity.id, payload);
      setItems(prev => [data, ...prev]);
      setMsg({ type:'success', text:'Campaign created.' });
      resetForm();
    }catch{
      setMsg({ type:'danger', text:'Could not create campaign.' });
    }finally{
      setBusy(false);
    }
  };

  const startEdit = (c)=>{
    setEditing(c);
    setTitle(c.title || '');
    setDesc(c.description || '');
    setGoal(c.goal_amount || '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const submitEdit = async (e)=>{
    e.preventDefault(); if (!editing?.id) return;
    setBusy(true); setMsg({type:'', text:''});
    try{
      const payload = {
        title,
        description: desc || undefined,
        goal_amount: goal ? Number(goal) : undefined,
      };
      const { data } = await updateCampaign(editing.id, payload);
      setItems(prev => prev.map(x => Number(x.id) === Number(editing.id) ? { ...x, ...data } : x));
      setMsg({ type:'success', text:'Campaign updated.' });
      setEditing(null);
      resetForm();
    }catch{
      setMsg({ type:'danger', text:'Update failed.' });
    }finally{
      setBusy(false);
    }
  };

  const remove = async (id)=>{
    if (!confirm('Delete this campaign?')) return;
    try{
      await deleteCampaign(id);
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
        <h2 className="fw-bold mb-0">Campaigns</h2>
        <span className="badge text-bg-light">For: {charity.name}</span>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      <div className="card card-soft mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={editing ? submitEdit : submitCreate}>
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="title" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required />
                <label htmlFor="title">Title</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input type="number" min="0" step="0.01" className="form-control" id="goal" placeholder="Goal amount"
                       value={goal} onChange={e=>setGoal(e.target.value)} />
                <label htmlFor="goal">Goal amount (₱)</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating">
                <textarea className="form-control" id="desc" placeholder="Description" style={{height: 120}}
                          value={desc} onChange={e=>setDesc(e.target.value)} />
                <label htmlFor="desc">Description</label>
              </div>
            </div>

            <div className="col-12 d-flex gap-2">
              <button className="btn btn-brand" disabled={busy}>
                {busy ? (editing ? 'Saving…' : 'Creating…') : (editing ? 'Save changes' : 'Create campaign')}
              </button>
              {editing && (
                <button type="button" className="btn btn-outline-secondary" onClick={()=>{ setEditing(null); resetForm(); }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      <div className="card card-soft">
        <div className="card-body p-0">
          {items.length === 0 ? (
            <div className="p-4 text-center text-secondary">No campaigns yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width:90}}>ID</th>
                    <th>Title</th>
                    <th>Description</th>
                    <th className="text-end">Goal</th>
                    <th style={{width:180}}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(c => (
                    <tr key={c.id}>
                      <td className="fw-semibold">#{c.id}</td>
                      <td>{c.title}</td>
                      <td className="text-truncate" style={{maxWidth: 420}}>
                        <span title={c.description || ''}>{c.description || '—'}</span>
                      </td>
                      <td className="text-end">{formatCurrency(c.goal_amount)}</td>
                      <td className="text-end">
                        <div className="btn-group">
                          <button className="btn btn-outline-secondary btn-sm" onClick={()=>startEdit(c)}>
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <button className="btn btn-outline-danger btn-sm" onClick={()=>remove(c.id)}>
                            <i className="bi bi-trash me-1"></i>Delete
                          </button>
                        </div>
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

function formatCurrency(n){
  const v = Number(n || 0);
  return v ? `₱ ${v.toLocaleString('en-PH',{minimumFractionDigits:2, maximumFractionDigits:2})}` : '—';
}
