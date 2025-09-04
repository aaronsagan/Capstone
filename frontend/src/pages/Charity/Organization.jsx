import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { updateCharity, uploadCharityDocument } from '../../api/charities';

export default function Organization(){
  const { charity, loading } = useMyCharity();
  const [form, setForm] = useState({
    name: '', reg_no: '', tax_id: '',
    mission: '', vision: '',
    website: '', contact_email: '', contact_phone: '',
  });
  const [doc, setDoc] = useState(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(()=>{
    if (charity) {
      setForm({
        name: charity.name || '',
        reg_no: charity.reg_no || '',
        tax_id: charity.tax_id || '',
        mission: charity.mission || '',
        vision: charity.vision || '',
        website: charity.website || '',
        contact_email: charity.contact_email || '',
        contact_phone: charity.contact_phone || '',
      });
    }
  }, [charity]);

  const onChange = (e)=> setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const save = async (e)=>{
    e.preventDefault(); if (!charity?.id) return;
    setBusy(true); setMsg({type:'', text:''});
    try{
      await updateCharity(charity.id, form);
      setMsg({ type:'success', text:'Organization profile saved.' });
    }catch{
      setMsg({ type:'danger', text:'Save failed. Please check your inputs and try again.' });
    }finally{
      setBusy(false);
    }
  };

  const upload = async (e)=>{
    e.preventDefault(); if (!charity?.id || !doc) return;
    setBusy(true); setMsg({type:'', text:''});
    try{
      const fd = new FormData();
      fd.append('document', doc);
      await uploadCharityDocument(charity.id, fd);
      setMsg({ type:'success', text:'Document uploaded. Awaiting admin review.' });
      setDoc(null);
      e.target.reset?.();
    }catch{
      setMsg({ type:'danger', text:'Upload failed. Try a different file type/size.' });
    }finally{
      setBusy(false);
    }
  };

  if (loading) return <div className="container py-5"><span className="placeholder col-6"></span></div>;
  if (!charity) return <div className="container py-5"><div className="alert alert-warning">No organization found for your account.</div></div>;

  return (
    <div className="container">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h2 className="fw-bold mb-0">Organization</h2>
        <span className="badge text-bg-light">Verification: {charity.verification_status || 'pending'}</span>
      </div>

      {msg.text && <div className={`alert alert-${msg.type} py-2`}>{msg.text}</div>}

      <div className="card card-soft mb-4">
        <div className="card-body">
          <form className="row g-3" onSubmit={save}>
            <div className="col-md-6">
              <div className="form-floating">
                <input className="form-control" id="name" name="name" placeholder="Name" value={form.name} onChange={onChange} required />
                <label htmlFor="name">Organization name</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input className="form-control" id="reg_no" name="reg_no" placeholder="Reg" value={form.reg_no} onChange={onChange} />
                <label htmlFor="reg_no">Registration No.</label>
              </div>
            </div>
            <div className="col-md-3">
              <div className="form-floating">
                <input className="form-control" id="tax_id" name="tax_id" placeholder="Tax" value={form.tax_id} onChange={onChange} />
                <label htmlFor="tax_id">Tax ID</label>
              </div>
            </div>

            <div className="col-md-6">
              <div className="form-floating">
                <textarea className="form-control" id="mission" name="mission" placeholder="Mission" style={{height:120}} value={form.mission} onChange={onChange} />
                <label htmlFor="mission">Mission</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <textarea className="form-control" id="vision" name="vision" placeholder="Vision" style={{height:120}} value={form.vision} onChange={onChange} />
                <label htmlFor="vision">Vision</label>
              </div>
            </div>

            <div className="col-md-4">
              <div className="form-floating">
                <input className="form-control" id="website" name="website" placeholder="https://…" value={form.website} onChange={onChange} />
                <label htmlFor="website">Website</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input className="form-control" id="contact_email" name="contact_email" placeholder="Email" type="email" value={form.contact_email} onChange={onChange} />
                <label htmlFor="contact_email">Contact email</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input className="form-control" id="contact_phone" name="contact_phone" placeholder="Phone" value={form.contact_phone} onChange={onChange} />
                <label htmlFor="contact_phone">Contact phone</label>
              </div>
            </div>

            <div className="col-12">
              <button className="btn btn-brand" disabled={busy}>
                {busy ? 'Saving…' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Document upload */}
      <div className="card card-soft">
        <div className="card-body">
          <h5 className="fw-bold mb-2">Upload verification document</h5>
          <p className="text-secondary small">Accepted: PDF, JPG, PNG. This helps admins verify your organization.</p>
          <form className="vstack gap-3" onSubmit={upload}>
            <input className="form-control" type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={e=>setDoc(e.target.files?.[0]||null)} />
            <button className="btn btn-outline-secondary" disabled={busy || !doc}>
              {busy ? 'Uploading…' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
