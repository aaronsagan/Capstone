import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { createDonation, uploadDonationProof } from '../../api/donations';
import { getCharity, getCharityCampaigns } from '../../api/charities';
import { useAuth } from '../../context/AuthContext';

function Stat({ icon, label, value }) {
  return (
    <div className="d-flex align-items-center gap-2">
      <i className={`bi ${icon} text-primary fs-5`}></i>
      <div className="small text-secondary">{label}</div>
      <div className="ms-auto fw-semibold">{value ?? '—'}</div>
    </div>
  );
}

export default function DonateForm(){
  const { charityId, campaignId } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();

  // Redirect if not donor (extra UX; ProtectedRoute will still guard)
  useEffect(()=>{ if (role && role !== 'donor') navigate('/'); }, [role, navigate]);

  const [charity, setCharity] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [loadingMeta, setLoadingMeta] = useState(true);

  // Step state
  const [step, setStep] = useState(1);
  const [createdDonation, setCreatedDonation] = useState(null);

  // Form fields
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('general'); // or 'project', etc.
  const [isAnon, setIsAnon] = useState(false);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignId || '');
  const [note, setNote] = useState('');

  // Proof
  const [proofFile, setProofFile] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  // Load charity + campaigns
  useEffect(()=>{
    let active = true;
    (async ()=>{
      setLoadingMeta(true);
      try{
        const c = await getCharity(charityId);
        const ks = await getCharityCampaigns(charityId).catch(()=>({ data: [] }));
        if (!active) return;
        setCharity(c.data || null);
        setCampaigns(Array.isArray(ks.data) ? ks.data : []);
      }finally{
        if (active) setLoadingMeta(false);
      }
    })();
    return ()=>{ active = false; };
  }, [charityId]);

  const chosenCampaign = useMemo(
    () => campaigns.find(x => String(x.id) === String(selectedCampaignId)),
    [campaigns, selectedCampaignId]
  );

  // Step 1 — Create donation
  const onCreateDonation = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    if (!amount || Number(amount) <= 0) { setErr('Please enter a valid amount.'); return; }
    setSubmitting(true);
    try{
      const payload = {
        charity_id: Number(charityId),
        campaign_id: selectedCampaignId ? Number(selectedCampaignId) : null,
        amount: Number(amount),
        purpose,
        is_anonymous: Boolean(isAnon),
        note: note || undefined,
      };
      const { data } = await createDonation(payload);
      if (!data?.id) throw new Error('No donation id returned');
      setCreatedDonation(data);
      setOk('Donation created. Please upload your proof of payment.');
      setStep(2);
    }catch(ex){
      console.error(ex);
      setErr('Could not create donation. Please check inputs and try again.');
    }finally{
      setSubmitting(false);
    }
  };

  // Step 2 — Upload proof
  const onUploadProof = async (e) => {
    e.preventDefault();
    setErr(''); setOk('');
    if (!createdDonation?.id) { setErr('No donation to attach proof to.'); return; }
    if (!proofFile) { setErr('Please choose a proof file (image or PDF).'); return; }
    setSubmitting(true);
    try{
      const form = new FormData();
      form.append('proof', proofFile);
      const { data } = await uploadDonationProof(createdDonation.id, form);
      setOk('Proof uploaded! The charity will confirm your donation soon.');
      // After a short delay, go to dashboard
      setTimeout(()=> navigate('/me'), 900);
    }catch(ex){
      console.error(ex);
      setErr('Upload failed. Try a different file type/size or try again.');
    }finally{
      setSubmitting(false);
    }
  };

  if (loadingMeta) return <Skeleton />;

  if (!charity) {
    return (
      <div className="container py-5">
        <h3 className="fw-bold">Charity not found</h3>
        <p className="text-secondary">The requested charity does not exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-3">
        <div>
          <h2 className="fw-bold mb-0">Donate to {charity.name}</h2>
          <div className="text-secondary small">
            {charity.mission || 'Support a verified organization.'}
          </div>
        </div>
        <div className="d-flex flex-column gap-1" style={{minWidth: 260}}>
          <Stat icon="bi-patch-check" label="Verification" value={charity.verification_status || '—'} />
          <Stat icon="bi-flag" label="Campaign selected" value={chosenCampaign ? chosenCampaign.title : 'None (general)'} />
        </div>
      </div>

      {/* Steps */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card card-soft">
            <div className="card-body p-4 p-md-5">

              <ul className="nav nav-pills mb-4">
                <li className="nav-item">
                  <span className={`nav-link ${step===1 ? 'active' : ''}`}>1. Donation</span>
                </li>
                <li className="nav-item">
                  <span className={`nav-link ${step===2 ? 'active' : ''}`}>2. Upload Proof</span>
                </li>
              </ul>

              {err && <div className="alert alert-danger py-2">{err}</div>}
              {ok && <div className="alert alert-success py-2">{ok}</div>}

              {step === 1 ? (
                <form className="row g-3" onSubmit={onCreateDonation}>
                  <div className="col-md-6">
                    <label className="form-label">Amount (₱)</label>
                    <input
                      type="number" min="1" step="0.01"
                      className="form-control"
                      value={amount} onChange={e=>setAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Purpose</label>
                    <select className="form-select" value={purpose} onChange={e=>setPurpose(e.target.value)}>
                      <option value="general">General support</option>
                      <option value="project">Project support</option>
                      <option value="emergency">Emergency relief</option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Campaign (optional)</label>
                    <select
                      className="form-select"
                      value={selectedCampaignId}
                      onChange={e=>setSelectedCampaignId(e.target.value)}
                    >
                      <option value="">— None (general) —</option>
                      {campaigns.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 d-flex align-items-end">
                    <div className="form-check">
                      <input className="form-check-input" type="checkbox" id="anon" checked={isAnon} onChange={e=>setIsAnon(e.target.checked)} />
                      <label className="form-check-label" htmlFor="anon">Give anonymously</label>
                    </div>
                  </div>

                  <div className="col-12">
                    <label className="form-label">Note (optional)</label>
                    <textarea className="form-control" rows="3" value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a message or allocation instructions…"></textarea>
                  </div>

                  <div className="col-12">
                    <button className="btn btn-brand btn-lg" disabled={submitting}>
                      {submitting ? 'Creating…' : 'Create donation'}
                    </button>
                  </div>
                </form>
              ) : (
                <form className="vstack gap-3" onSubmit={onUploadProof}>
                  <div className="alert alert-info">
                    Upload your deposit/transfer receipt or screenshot. Accepted: JPG, PNG, PDF.
                  </div>

                  <div>
                    <label className="form-label">Proof of payment</label>
                    <input
                      className="form-control"
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={e=>setProofFile(e.target.files?.[0] || null)}
                      required
                    />
                  </div>

                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-secondary" type="button" onClick={()=>setStep(1)}>Back</button>
                    <button className="btn btn-brand" disabled={submitting}>
                      {submitting ? 'Uploading…' : 'Upload proof'}
                    </button>
                  </div>

                  {!!createdDonation && (
                    <div className="small text-secondary">
                      Donation ID: <span className="fw-semibold">{createdDonation.id}</span> • Current status: <span className="fw-semibold">{createdDonation.status || 'pending'}</span>
                    </div>
                  )}
                </form>
              )}

            </div>
          </div>
        </div>

        {/* Sidebar: quick help & channels */}
        <aside className="col-lg-4">
          <div className="card card-soft">
            <div className="card-body">
              <h6 className="fw-bold mb-2">How it works</h6>
              <ol className="text-secondary small ps-3 mb-3">
                <li>Create your donation with the amount and purpose.</li>
                <li>Transfer via your preferred channel.</li>
                <li>Upload your receipt/screenshot as proof.</li>
                <li>Charity confirms and issues a receipt number.</li>
              </ol>
              <div className="text-secondary small">
                Need help? <Link to={`/charities/${charity.id}`}>Contact {charity.name}</Link>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Skeleton(){
  return (
    <div className="container py-5">
      <div className="placeholder-glow">
        <div className="placeholder col-6 mb-3" style={{height:'38px'}}></div>
        <div className="placeholder col-12 mb-2"></div>
        <div className="placeholder col-10 mb-2"></div>
        <div className="placeholder col-8 mb-4"></div>
      </div>
      <div className="card placeholder-wave">
        <div className="card-body">
          <div className="placeholder col-12 mb-2"></div>
          <div className="placeholder col-11 mb-2"></div>
          <div className="placeholder col-9 mb-2"></div>
        </div>
      </div>
    </div>
  );
}
