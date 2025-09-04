import { useEffect, useState } from 'react';

export default function PingTest() {
  const [msg, setMsg] = useState("Checking...");

  useEffect(() => {
    fetch(import.meta.env.VITE_API_BASE_URL + "/ping")
      .then(res => res.json())
      .then(data => setMsg("OK: " + JSON.stringify(data)))
      .catch(err => setMsg("ERROR: " + err.message));
  }, []);

  return <div style={{padding:20, fontFamily:'system-ui'}}>Backend status → {msg}</div>;
}
