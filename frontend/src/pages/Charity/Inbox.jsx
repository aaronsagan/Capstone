import { useEffect, useState } from 'react';
import useMyCharity from '../../hooks/useMyCharity';
import { getCharityDonations, confirmDonation } from '../../api/charities';

export default function Inbox(){
  const { charity, loading } = useMyCharity();
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(null); // donationId being confirmed

  useEffect(()=>{
    if (!charity?.id) return;
    (async()=>{
      try{
        const { data } = await getCharityDonations(charity.id);
        setItems(Array.isArray(data) ? data : []);
      }catch{
        setItems([]);
      }
    })();
  }, [charity?.id]);

  const confirm = async (id)=>{
    setBusy(id);
    try{
      const { data } = await confirmDonation(id, { status: 'completed' });
      setItems(prev => prev.map(x => Number(x.id)===Number(id) ? { ...x, ...data } : x));
    }catch{
      alert('Failed to confirm.');
    }finally{
      setBusy(null);
    }
  };

  if (loading) return <div className="container py-5"><span className="placeholder col-6" /></div>;
  if (!charity) return <div className="container py-5"><div className="alert alert-warning">No organization found.</div></div>;

  return (
    <div className="container">
      <h2 className="fw-bold mb-3">Donations Inbox</h2>
      <div className="card card-soft">
        <div className="card-body p-0">
          {items.length === 0 ? (
            <div className="p-4 text-center text-secondary">No donations yet.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Donor</th>
                    <th>Campaign</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th style={{width:140}}></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(d => (
                    <tr key={d.id}>
                      <td>#{d.id}</td>
                      <td>{d.donor?.name || 'Anonymous'}</td>
                      <td>{d.campaign?.title || '—'}</td>
                      <td>₱ {Number(d.amount).toLocaleString()}</td>
                      <td>
                        {d.status === 'pending'
                          ? <span className="badge text-bg-warning">Pending</span>
                          : <span className="badge text-bg-success">Completed</span>}
                      </td>
                      <td className="text-end">
                        {d.status === 'pending' && (
                          <button className="btn btn-sm btn-brand"
                                  disabled={busy===d.id}
                                  onClick={()=>confirm(d.id)}>
                            {busy===d.id ? 'Confirming…' : 'Confirm'}
                          </button>
                        )}
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
