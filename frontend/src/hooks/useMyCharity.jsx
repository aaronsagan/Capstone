import { useEffect, useState } from 'react';
import { listCharities } from '../api/charities';
import { useAuth } from '../context/AuthContext';

export default function useMyCharity() {
  const { user } = useAuth();
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    let active = true;
    (async ()=>{
      setLoading(true);
      try{
        if (!user?.id) { setCharity(null); return; }
        // Simple approach: fetch all and filter by owner_id
        const { data } = await listCharities();
        const mine = Array.isArray(data) ? data.find(c => Number(c.owner_id) === Number(user.id)) : null;
        if (active) setCharity(mine || null);
        if (mine) localStorage.setItem('charityId', String(mine.id));
      } finally {
        if (active) setLoading(false);
      }
    })();
    return ()=>{ active = false; };
  }, [user?.id]);

  return { charity, loading };
}
