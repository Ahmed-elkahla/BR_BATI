import { useEffect, useState } from "react";
import { dataApi } from "../api/auth";

export default function Stats() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    dataApi.stats().then(setStats).catch(() => {});
  }, []);

  return (
    <section className="stats">
      {stats.map((s) => (
        <div className="card" key={s.label}>
          <p>{s.label}</p>
          <h2>{s.value}</h2>
          <span>{s.sub}</span>
        </div>
      ))}
    </section>
  );
}
