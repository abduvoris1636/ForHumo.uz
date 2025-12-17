import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem("admin")) {
      window.location.href = "/admin/login";
      return;
    }

    fetch("/registered.json")
      .then(r => r.json())
      .then(d => setData(d));
  }, []);

  return (
    <div className="wrap">
      <h1>Ro‘yxatdan o‘tgan jamoalar</h1>

      <div className="grid">
        {data.map((t, i) => (
          <div key={i} className="card">
            <h2>{t.teamName}</h2>
            <p><b>Sardor:</b> {t.captainName}</p>
            <p><b>MLBB ID:</b> {t.mlbbId}</p>
            <p><b>Telegram:</b> {t.telegram}</p>
            <p><small>{new Date(t.time).toLocaleString()}</small></p>
          </div>
        ))}
      </div>

      <style jsx>{`
        .wrap {
          padding: 30px;
          color: white;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        .card {
          background: rgba(255,255,255,0.08);
          padding: 20px;
          border-radius: 12px;
          backdrop-filter: blur(6px);
          transition: 0.3s;
        }
        .card:hover {
          background: rgba(255,255,255,0.15);
        }
      `}</style>
    </div>
  );
}
